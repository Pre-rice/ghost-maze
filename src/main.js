import { CanvasApp } from './canvasApp.js';
import { GAME_STATES, MAP_SIZE_MIN, MAP_SIZE_MAX, DEFAULT_GHOST_COUNT } from './core/constants.js';
import { GameController } from './core/gameController.js';
import { DataSerializer } from './core/dataSerializer.js';
import { ReplaySerializer } from './core/replaySerializer.js';
import { MapDefinition } from './core/mapDefinition.js';
import { ActionHistory } from './core/actionHistory.js';
import { validateMapData } from './core/mapDataUtils.js';
import { generateFullMaze } from './core/mazeGenerator.js';
import { computeGameView, pruneTrails } from './view/viewSlice.js';
import { mapURL } from './shareLinks.js';
import { SolutionDialog } from './solver/solutionDialog.js';
import * as InputHandler from './inputHandler.js';
import * as UI from './ui.js';
import * as LayerManager from './layerManager.js';

export class GhostMazeGame extends CanvasApp {
    constructor() {
        super();
        this.state = GAME_STATES.MENU; this.editor = { active: false };
        this.debugVision = false; this.replay = null; this.replayTimer = null; this.replaySpeed = 1;
        this.animationFrameId = null; this.autoMoveInterval = null; this.dpadInterval = null;
        this.seekAbort = null; this.mapCode = null;
        this.controller = new GameController({
            onSync: () => this.syncGame(),
            onWin: stats => { if (!this.replay) this.showOutcome('win', stats.text); },
            onDeath: stats => { if (!this.replay) this.showOutcome(stats.overlay, stats.message); },
            onHistoryChange: () => this.updateHistoryButtons()
        });
        this.dpad = { element: document.getElementById('dpad-controls'), grip: document.getElementById('dpad-center'),
            isDragging: false, isResizing: false, startX: 0, startY: 0, initialLeft: 0, initialTop: 0, initialDist: 0, currentScale: 1 };
        this.solverDialog = new SolutionDialog({
            onOpen: () => { this.stopAutoMove(); this.pauseReplay(); this.updateDpadVisibility(); },
            onClose: () => this.updateDpadVisibility(),
            onReplay: ({ code, mapCode }) => {
                if (window.app) { window.app.openSolution({ code, mapCode }); return; }
                const route = ReplaySerializer.loadFromShareCode(this.controller.mapData, code);
                if (!route.success) { this.showToast(route.error, 4000, 'error'); return; }
                this.openReplay(this.controller.mapData, route.actions, mapCode, code);
                this.returnToSolutions = true;
            }
        });
        this.bindUI(); this.showInitialMessage(); this.updateHistoryButtons(); this.updateDpadVisibility();
        const params = new URLSearchParams(location.search), code = params.get('map'), replayCode = params.get('replay');
        if (replayCode && !code) this.showToast('加载回放需要链接中包含地图码。', 5000, 'error');
        else if (code) {
            this.loadFromShareCode(code, replayCode);
            if (params.get('solve') === '1' && this.replay) {
                this.solverDialog.restore(this.controller.mapData, code); this.returnToSolutions = true;
            }
        }
    }
    get activeController() { return this.replay || this.controller; }
    getGameView() {
        const active = this.activeController;
        return computeGameView({ mapDef: active.mapDefinition, gameState: active.currentGameState, viewLayer: active.viewLayer },
            { canvas: this.canvas, staticLayerCanvas: this.staticLayerCanvas, state: this.state,
                cellSize: this.cellSize, colors: this.colors, drawOffset: this.drawOffset, debugVision: this.debugVision });
    }
    getView() { return this.getGameView(); }
    bindUI() {
        const on = (id, fn, event = 'click') => document.getElementById(id).addEventListener(event, fn);
        on('generate-map-btn', () => this.showNewMapOptions());
        on('new-map-cancel-btn', () => this.closeNewMapOptions());
        on('new-map-form', event => { event.preventDefault(); this.generateNewRandomMap(); }, 'submit');
        on('reset-map-btn', () => this.resetCurrentMap());
        on('full-vision-toggle', event => { this.debugVision = event.target.checked; this.draw(); }, 'change');
        on('dpad-toggle', () => this.updateDpadVisibility(), 'change');
        for (const id of ['undo-btn', 'death-undo-btn', 'game-over-undo-btn']) on(id, () => this.handleUndo()); on('save-btn', () => this.handleSave()); on('rewind-btn', () => this.handleRewind());
        for (const id of ['death-rewind-btn', 'game-over-rewind-btn']) on(id, () => this.handleRewind());
        for (const id of ['death-reset-btn', 'game-over-replay-btn', 'win-replay-btn']) on(id, () => this.resetCurrentMap());
        on('revive-btn', () => this.revivePlayer());
        on('watch-replay-btn', () => this.watchReplay());
        on('solve-map-btn', () => this.solveMap());
        on('win-watch-replay-btn', () => this.watchReplay());
        on('replay-play-btn', () => this.replayPlaying ? this.pauseReplay() : this.playReplay());
        on('replay-prev-btn', () => this.seekReplay(this.replay.currentStep - 1));
        on('replay-next-btn', () => this.seekReplay(this.replay.currentStep + 1));
        on('replay-step-input', event => this.seekReplay(Number(event.target.value)), 'change');
        on('replay-step-range', event => this.seekReplay(Number(event.target.value)), 'input');
        on('replay-speed', event => {
            this.replaySpeed = Number(event.target.value);
            if (this.replayPlaying) { this.pauseReplay(); this.playReplay(); }
        }, 'change');
        on('replay-load-btn', () => {
            this.pauseReplay();
            const replay = this.replay, step = replay.currentStep;
            this.showConfirm('是否加载第 ' + step + ' 步到当前局面？这会替换你当前的游玩状态，并清除当前存档。', () => this.loadReplayStep(replay, step));
        });
        on('replay-close-btn', () => { if (window.app) window.app.closeReplay(); else this.closeReplay(); });
        window.addEventListener('keydown', event => {
            if ((window.app && window.app.view !== 'play') || this.solverDialog.open) return;
            if (document.getElementById('new-map-overlay').style.display === 'flex') {
                if (event.key === 'Escape') this.closeNewMapOptions();
                return;
            }
            InputHandler.handleKeyPress(this, event);
        });
        this.canvas.addEventListener('click', event => InputHandler.handleCanvasClick(this, event));
        this.stopDpad = InputHandler.bindDpadControls(this);
        UI.initializeDpadTouchControls(this.dpad);
        window.matchMedia('(max-width: 768px)').addEventListener('change', () => this.updateDpadVisibility());
        window.addEventListener('blur', () => { this.stopAutoMove(); this.pauseReplay(); });
    }
    showNewMapOptions() {
        this.stopAutoMove(); this.pauseReplay();
        document.getElementById('new-map-overlay').style.display = 'flex';
        this.updateDpadVisibility(); document.getElementById('new-map-size').focus();
    }
    closeNewMapOptions() {
        document.getElementById('new-map-overlay').style.display = 'none';
        this.updateDpadVisibility(); document.getElementById('generate-map-btn').focus();
    }
    generateNewRandomMap() {
        const size = Number(document.getElementById('new-map-size').value);
        const gameMode = 'exploration';
        const initialHealth = gameMode === 'exploration' ? Number(document.getElementById('new-map-health').value) : 5;
        if (!Number.isInteger(size) || size < MAP_SIZE_MIN || size > MAP_SIZE_MAX) return;
        if (!Number.isInteger(initialHealth) || initialHealth < 1 || initialHealth > 4294967295) return;
        const mapData = { ...generateFullMaze(size, size, DEFAULT_GHOST_COUNT), gameMode, initialHealth };
        if (this.startGame(mapData)) this.closeNewMapOptions();
    }
    syncGame() {
        if (this.replay) return;
        const current = this.controller.currentGameState;
        this.state = current.isWon ? GAME_STATES.WON : current.isDead ? GAME_STATES.DEAD : GAME_STATES.PLAYING;
        this.hideAllOverlays(); this.configureCanvas();
        this._renderStaticLayer(); this.draw(); this.updateUIDisplays(); this.updateHistoryButtons(); this.updateLayerPanel(); this.updateDpadVisibility();
        if (this.state === GAME_STATES.PLAYING) this.startAnimationLoop(); else { this.stopAutoMove(); this.stopAnimationLoop(); }
    }
    configureCanvas() {
        const md = this.activeController.mapDefinition;
        this.cellSize = (this.canvas.width - 2 * this.padding) / Math.max(md.width, md.height);
        let minX = md.width, minY = md.height, maxX = 0, maxY = 0;
        for (const layer of md.layers) layer.activeCells.forEach((row, y) => row.forEach((active, x) => {
            if (active) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
        }));
        this.drawOffset = { x: (this.canvas.width - (maxX - minX + 1) * this.cellSize) / 2 - minX * this.cellSize,
            y: (this.canvas.height - (maxY - minY + 1) * this.cellSize) / 2 - minY * this.cellSize };
    }
    startGame(mapData, code = null) {
        const checked = validateMapData(mapData);
        if (!checked.valid) { this.showToast(checked.error, 4000, 'error'); return false; }
        this.closeReplay(false); this.stopAutoMove();
        this.solverDialog.reset(code);
        const result = this.controller.startGame(checked.mapData);
        if (!result.success) { this.showToast(result.error, 4000, 'error'); return false; }
        const encoded = code ? { success: true, code } : this.generateShareCode();
        if (encoded.success) { this.mapCode = encoded.code; this.updateURLWithShareCode(encoded.code); this.updateEditorLink(); }
        return true;
    }
    generateShareCode() {
        const source = this.activeController.mapData;
        return source ? DataSerializer.generateShareCode(source) : { success: false, error: '请先加载地图' };
    }
    loadFromShareCode(code, replayCode = null) {
        const result = DataSerializer.loadFromShareCode(code);
        if (!result.success) { this.showToast(result.error, 4000, 'error'); return false; }
        if (replayCode) {
            const route = ReplaySerializer.loadFromShareCode(result.data.mapData, replayCode);
            if (!route.success) { this.showToast(route.error, 5000, 'error'); return false; }
            // 已有游玩局保留；首次打开则同时建立该图的初始游玩局。
            if (!this.controller.mapData) this.startGame(result.data.mapData, code);
            this.openReplay(result.data.mapData, route.actions, code, replayCode); return true;
        }
        return this.startGame(result.data.mapData, code);
    }
    processAction(action) { return this.state === GAME_STATES.PLAYING && !this.solverDialog.open ? this.controller.processAction(action) : null; }
    movePlayer(dx, dy) { return this.processAction({ type: 'MOVE', payload: { dx, dy } }); }
    useStair() { return this.processAction({ type: 'USE_STAIR' }); }
    revivePlayer() { this.controller.revive(); }
    resetCurrentMap() {
        if (!this.controller.mapData) { this.showToast('请先加载地图', 3000, 'error'); return; }
        this.startGame(this.controller.mapData, this.mapCode);
    }
    hideAllOverlays() { UI.hideAllOverlays(); }
    showOutcome(kind, message) {
        document.getElementById('revive-btn').disabled = !this.controller.canRevive;
        if (kind === 'win') { document.getElementById('win-stats').textContent = message; document.getElementById('win-overlay').style.display = 'flex'; }
        else {
            document.getElementById('death-message').textContent = message;
            document.getElementById(kind === 'game-over' ? 'game-over-overlay' : 'death-overlay').style.display = 'flex';
        }
        this.updateHistoryButtons();
    }
    updateUIDisplays() {
        if (!this.activeController.currentGameState) return;
        const current = this.activeController.currentGameState, mode = this.activeController.mapDefinition.gameMode;
        UI.updateUIDisplays({ gameMode: mode, player: current.player, loopCount: current.loopCount,
            healthDisplay: document.getElementById('player-health-display'), stepsDisplay: document.getElementById('player-steps-display'),
            keysDisplay: document.getElementById('player-keys-display') });
        const displayedPlayer = this.getGameView().player;
        UI.updateProximityWarning({ ghosts: current.layerStates[displayedPlayer.layer].ghosts, player: displayedPlayer,
            ghostProximityDisplay: document.getElementById('ghost-proximity-display') });
        document.getElementById('mode-display').textContent = (this.replay ? '回放 · ' : '') + (mode === 'exploration' ? '探索模式' : '死亡循环');
    }
    updateHistoryButtons() {
        const disabled = !!this.replay || !this.controller.currentGameState;
        for (const id of ['undo-btn', 'death-undo-btn', 'game-over-undo-btn']) document.getElementById(id).disabled = disabled || !this.controller.canUndo;
        document.getElementById('save-btn').disabled = disabled || this.state !== GAME_STATES.PLAYING || this.controller.currentStep <= (this.controller.checkpoints.at(-1) ?? -1);
        for (const id of ['rewind-btn', 'death-rewind-btn', 'game-over-rewind-btn']) document.getElementById(id).disabled = disabled || !this.controller.canRewind;
        const replayButton = document.getElementById('watch-replay-btn');
        replayButton.disabled = !this.controller.mapData;
        replayButton.hidden = !!this.replay;
        document.getElementById('solve-map-btn').disabled = !this.controller.mapData;
    }
    handleUndo() { this.stopAutoMove(); const result = this.controller.undo(); if (!result.ok && result.error) this.showToast(result.error, 2000, 'error'); }
    handleSave() { const result = this.controller.save(); this.showToast(result.ok ? '已在第 ' + result.step + ' 步存档' : result.error, 2000, result.ok ? 'success' : 'error'); }
    handleRewind() { this.stopAutoMove(); const result = this.controller.rewind(); if (!result.ok) this.showToast(result.error, 2000, 'error'); }
    updateDpadVisibility() {
        const exploration = this.activeController.mapDefinition?.gameMode !== 'death-loop';
        const mobile = window.matchMedia('(max-width: 768px)').matches;
        document.getElementById('full-vision-control').hidden = !exploration;
        document.getElementById('ghost-proximity-display').hidden = !exploration;
        const viewOptions = document.getElementById('view-options-controls');
        viewOptions.hidden = !exploration && !mobile;
        viewOptions.classList.toggle('single-toggle', !exploration);
        document.getElementById('map-actions').hidden = !!this.replay;
        document.getElementById('generate-map-btn').hidden = !!this.replay;
        document.getElementById('play-options-controls').hidden = !!this.replay && !exploration && !mobile;
        UI.updateDpadVisibility(this.state !== GAME_STATES.PLAYING || document.getElementById('new-map-overlay').style.display === 'flex' || this.solverDialog.open);
    }
    stopAutoMove() {
        clearInterval(this.autoMoveInterval); this.autoMoveInterval = null;
        clearInterval(this.dpadInterval); this.dpadInterval = null; this.stopDpad?.();
    }
    startAnimationLoop() {
        if (this.animationFrameId) return;
        const loop = () => {
            this.animationFrameId = null;
            if (this.state !== GAME_STATES.PLAYING) return;
            pruneTrails(this.controller.currentGameState, this.controller.viewLayer, Date.now());
            this.draw(); this.animationFrameId = requestAnimationFrame(loop);
        };
        this.animationFrameId = requestAnimationFrame(loop);
    }
    stopAnimationLoop() { cancelAnimationFrame(this.animationFrameId); this.animationFrameId = null; }
    switchToLayer(index) {
        const active = this.activeController;
        if (!active.mapDefinition || index < 0 || index >= active.mapDefinition.layerCount) return;
        active.viewLayer = index; this._renderStaticLayer(); this.draw(); this.updateLayerPanel();
    }
    updateLayerPanel() {
        const active = this.activeController, md = active.mapDefinition;
        LayerManager.updateLayerPanelUI({ multiLayerMode: md.multiLayerMode, layerCount: md.layerCount,
            currentLayer: active.viewLayer, playerLayer: this.getGameView().playerLayer,
            editorActive: false, hasStartPoint: true, onLayerClick: index => this.switchToLayer(index) });
    }
    updateURLWithShareCode(code, replayCode = null) {
        if (window.app) window.app.mapURL(code, replayCode);
        else history.replaceState({}, '', mapURL(code, { replay: replayCode }));
    }
    updateEditorLink() {
        const result = this.generateShareCode();
        document.getElementById('edit-map-btn').href = result.success ? mapURL(result.code, { editor: true }) : 'editor.html';
    }
    replayCodes() {
        const map = this.generateShareCode();
        if (!map.success) return map;
        const active = this.activeController;
        const route = ReplaySerializer.generateShareCode(active.mapData, this.replay ? active.history.actions : this.controller.actions);
        return route.success ? { success: true, map: map.code, replay: route.code } : route;
    }
    solveMap() {
        if (this.replay || !this.controller.mapData) return;
        this.solverDialog.show(this.controller.mapData, this.mapCode);
    }
    watchReplay() {
        const result = this.replayCodes();
        if (!result.success) { this.showToast(result.error, 3000, 'error'); return; }
        const actions = this.replay ? this.replay.history.actions : this.controller.actions;
        if (window.app) window.app.watchReplay(this.activeController.mapData, actions, result.map, result.replay);
        else this.openReplay(this.activeController.mapData, actions, result.map, result.replay);
    }
    openReplay(mapData, actions, mapCode, replayCode) {
        document.getElementById('replay-close-btn').textContent = '返回游玩';
        this.returnToSolutions = false;
        this.pauseReplay(); this.seekAbort?.abort(); this.stopAutoMove(); this.stopAnimationLoop(); this.hideAllOverlays();
        if (!this.replay) this.playVision = this.debugVision;
        const mapDefinition = new MapDefinition(mapData), timeline = new ActionHistory(mapDefinition, actions);
        this.replay = { mapData, mapDefinition, history: timeline, currentGameState: timeline.stateAt(0), currentStep: 0, viewLayer: mapDefinition.playerStart.layer, mapCode };
        this.debugVision = true; document.getElementById('full-vision-toggle').checked = true;
        this.state = GAME_STATES.REPLAY;
        document.getElementById('replay-controls').hidden = false;
        document.getElementById('play-history-controls').hidden = true;
        this.configureCanvas(); this.syncReplay(); this.updateEditorLink();
        this.updateURLWithShareCode(mapCode, replayCode);
    }
    syncReplay() {
        if (!this.replay) return;
        this._renderStaticLayer(); this.draw(); this.updateUIDisplays(); this.updateLayerPanel(); this.updateHistoryButtons(); this.updateDpadVisibility();
        const step = this.replay.currentStep, total = this.replay.history.actions.length;
        const range = document.getElementById('replay-step-range'), input = document.getElementById('replay-step-input');
        range.max = input.max = total; range.value = input.value = step;
        document.getElementById('replay-total').textContent = '/ ' + total;
        document.getElementById('replay-prev-btn').disabled = step === 0;
        document.getElementById('replay-next-btn').disabled = step === total;
    }
    async seekReplay(step, pause = true) {
        if (!this.replay) return;
        if (pause) this.pauseReplay();
        const replay = this.replay;
        step = Math.max(0, Math.min(replay.history.actions.length, Math.trunc(step)));
        if (!Number.isFinite(step)) return;
        this.seekAbort?.abort(); this.seekAbort = new AbortController();
        const signal = this.seekAbort.signal;
        document.getElementById('replay-load-btn').disabled = true;
        try {
            const current = await replay.history.stateAtAsync(step, { signal });
            if (this.replay !== replay || signal.aborted) return;
            replay.currentGameState = current; replay.currentStep = step;
            replay.viewLayer = current.isDead ? replay.mapDefinition.playerStart.layer : current.player.layer;
            this.syncReplay();
        } catch (error) {
            if (error.name !== 'AbortError') { this.pauseReplay(); this.showToast(error.message, 5000, 'error'); }
        } finally {
            if (this.replay === replay && this.seekAbort?.signal === signal) document.getElementById('replay-load-btn').disabled = false;
        }
    }
    playReplay() {
        if (!this.replay || this.replayPlaying) return;
        if (this.replay.currentStep >= this.replay.history.actions.length) return;
        this.replayPlaying = true;
        const run = this.replayRun;
        document.getElementById('replay-play-btn').textContent = '暂停';
        const next = async () => {
            this.replayTimer = null;
            if (!this.replayPlaying || this.replayRun !== run || !this.replay) return;
            await this.seekReplay(this.replay.currentStep + 1, false);
            if (this.replayRun !== run) return;
            if (this.replayPlaying && this.replay && this.replay.currentStep < this.replay.history.actions.length) this.replayTimer = setTimeout(next, 400 / this.replaySpeed);
            else this.pauseReplay();
        };
        this.replayTimer = setTimeout(next, 400 / this.replaySpeed);
    }
    pauseReplay() {
        this.replayPlaying = false;
        this.replayRun = (this.replayRun || 0) + 1;
        this.seekAbort?.abort();
        clearTimeout(this.replayTimer); this.replayTimer = null;
        document.getElementById('replay-play-btn').textContent = '播放';
    }
    closeReplay(sync = true) {
        if (!this.replay) return;
        const returnToSolutions = this.returnToSolutions; this.returnToSolutions = false;
        this.pauseReplay(); this.seekAbort?.abort(); this.replay = null;
        this.debugVision = this.playVision; document.getElementById('full-vision-toggle').checked = this.debugVision;
        document.getElementById('replay-controls').hidden = true; document.getElementById('play-history-controls').hidden = false;
        if (sync && this.controller.mapData) {
            this.syncGame();
            if (this.controller.currentGameState.isWon) this.showOutcome('win', this.controller._winStats().text);
            else if (this.controller.currentGameState.isDead) { const stats = this.controller._deathStats(); this.showOutcome(stats.overlay, stats.message); }
            this.updateURLWithShareCode(this.mapCode); this.updateEditorLink();
            if (returnToSolutions) this.solveMap();
        }
    }
    loadReplayStep(replay, step) {
        if (this.replay !== replay) return;
        window.app?.prepareReplayLoad();
        this.closeReplay(false);
        this.mapCode = replay.mapCode;
        this.controller.loadReplayStep(replay, step);
        this.updateURLWithShareCode(this.mapCode); this.updateEditorLink();
        window.app?.finishReplayLoad();
        this.showToast('已加载第 ' + step + ' 步', 2000, 'success');
    }
}
