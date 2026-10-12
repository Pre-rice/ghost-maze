import { MapDefinition } from './mapDefinition.js';
import { GameLogic } from './gameLogic.js';
import { DataSerializer } from './dataSerializer.js';
import { ReplaySerializer } from './replaySerializer.js';
import { validateMapData } from './mapDataUtils.js';
import { actionToName } from './actions.js';
import { ActionHistory, mergeSeen } from './actionHistory.js';

/** 游玩局唯一控制器；操作是历史，局面仅为可重建缓存。 */
export class GameController {
    constructor(ui = {}) {
        this.ui = ui;
        this.mapData = null; this.mapDefinition = null; this.currentGameState = null;
        this.history = null; this.checkpoints = []; this.currentStep = 0; this.viewLayer = 0;
        this.revivalBoundary = 0; this.revivalState = null;
    }
    get gameMode() { return this.mapDefinition?.gameMode || 'exploration'; }
    get initialHealth() { return this.mapDefinition?.initialHealth || 5; }
    get actions() { return this.history?.actions.slice(0, this.currentStep) || []; }
    get canRevive() { return !!this.currentGameState?.isDead && (this.gameMode === 'death-loop' ||
        this.currentGameState.player.hp > 0 && !GameLogic.isSpawnOccupied(this.currentGameState, this.mapDefinition)); }
    get canUndo() { return this.currentStep > this.revivalBoundary; }
    get canRewind() { return this.checkpoints.some(step => step < this.currentStep); }
    startGame(source) {
        const result = validateMapData(source);
        if (!result.valid) return { success: false, error: result.error };
        this.mapData = result.mapData;
        this.mapDefinition = new MapDefinition(this.mapData);
        this.currentGameState = GameLogic.createInitialState(this.mapDefinition);
        this.history = new ActionHistory(this.mapDefinition, [], { initialState: this.currentGameState });
        this.checkpoints = []; this.currentStep = 0; this.revivalBoundary = 0; this.revivalState = null;
        this._sync();
        return { success: true };
    }
    processAction(action) {
        if (!this.currentGameState) return null;
        if (action.type === 'REVIVE') return this.revive();
        let name;
        try { name = actionToName(action); } catch { return null; }
        const next = GameLogic.calculateNextState(this.currentGameState, action, this.mapDefinition);
        if (next === this.currentGameState) return null;
        this.checkpoints = this.checkpoints.filter(step => step <= this.currentStep);
        this.history.append(name, next, this.currentStep);
        this.currentStep++; this.currentGameState = next;
        this._sync();
        return next;
    }
    movePlayer(dx, dy) { return this.processAction({ type: 'MOVE', payload: { dx, dy } }); }
    useStair() { return this.processAction({ type: 'USE_STAIR' }); }
    revive() {
        if (!this.currentGameState?.isDead) return null;
        const next = GameLogic.handleRevive(this.currentGameState, this.mapDefinition);
        if (next === this.currentGameState) return null;
        this.checkpoints = [];
        if (this.gameMode === 'death-loop') {
            this.history = new ActionHistory(this.mapDefinition, [], { initialState: next });
            this.currentStep = 0; this.revivalBoundary = 0; this.revivalState = null;
        } else {
            this.revivalBoundary = this.currentStep; this.revivalState = next;
            this.history.cache.put('revival', next);
        }
        this.currentGameState = next; this._sync();
        return next;
    }
    restore(step) {
        this.currentStep = step;
        this.currentGameState = step === this.revivalBoundary && this.revivalState ? this.revivalState : this.history.stateAt(step);
        this._sync();
    }
    undo() {
        if (!this.canUndo) return { ok: false, error: '无法撤回到复活点之前' };
        this.restore(this.currentStep - 1); return { ok: true };
    }
    save() {
        if (!this.currentGameState || this.currentGameState.isDead || this.currentGameState.isWon) return { ok: false, error: '当前不能存档' };
        const last = this.checkpoints.at(-1) ?? -1;
        if (this.currentStep <= last) return { ok: false, error: '请先操作后再存档' };
        this.checkpoints.push(this.currentStep);
        if (!this.revivalState || this.currentStep !== this.revivalBoundary) this.history.remember(this.currentStep, this.currentGameState, true);
        this.ui.onHistoryChange?.(); return { ok: true, step: this.currentStep };
    }
    rewind() {
        const targets = this.checkpoints.filter(step => step < this.currentStep);
        if (!targets.length) return { ok: false, error: '没有更早的存档点可供回溯' };
        const step = targets.at(-1);
        this.restore(step); return { ok: true, step };
    }
    /** 回放加载是显式接管；死亡循环用新基础视野重建缓存，撤回不会丢旧探索。 */
    loadReplayStep(replay, step) {
        replay.history.stateAt(step);
        const sameMap = this.mapData && JSON.stringify(this.mapData) === JSON.stringify(replay.mapData);
        const actions = replay.history.actions.slice(0, step);
        this.mapData = replay.mapData; this.mapDefinition = replay.mapDefinition;
        let initial = GameLogic.createInitialState(this.mapDefinition);
        if (this.gameMode === 'death-loop') {
            initial.loopCount = (sameMap ? this.currentGameState.loopCount : 0) + 1;
            if (sameMap) initial.seenCells = mergeSeen(initial.seenCells, this.currentGameState.seenCells);
        }
        this.history = new ActionHistory(this.mapDefinition, actions, { initialState: initial });
        this.currentGameState = this.history.stateAt(step);
        // 保留所选末步准确的死亡或胜利，不自动复活。
        this.currentStep = step; this.checkpoints = []; this.revivalState = null; this.revivalBoundary = 0;
        if (this.gameMode === 'exploration') {
            this.revivalBoundary = Math.max(0, ...[...this.history.deathSteps].filter(death => death < step));
            if (this.revivalBoundary > 0) {
                this.revivalState = GameLogic.handleRevive(this.history.stateAt(this.revivalBoundary), this.mapDefinition);
                this.history.cache.put('revival', this.revivalState);
            }
        }
        this._sync(); return { ok: true };
    }
    buildShareSourceData() { return this.mapData; }
    loadFromShareCode(code) { return DataSerializer.loadFromShareCode(code); }
    generateReplayCode() {
        if (!this.mapData) return { success: false, error: '请先加载地图' };
        return ReplaySerializer.generateShareCode(this.mapData, this.actions);
    }
    _sync() {
        this.viewLayer = this.currentGameState.player.layer;
        this.ui.onSync?.(); this.ui.onHistoryChange?.();
        if (this.currentGameState.isWon) this.ui.onWin?.(this._winStats());
        else if (this.currentGameState.isDead) this.ui.onDeath?.(this._deathStats());
    }
    _winStats() {
        const p = this.currentGameState.player;
        return { text: this.gameMode === 'exploration' ? '你以 ' + p.hp + ' 点剩余生命和 ' + p.steps + ' 步的成绩通关！' : '你以 ' + p.steps + ' 步的成绩通关！' };
    }
    _deathStats() {
        const p = this.currentGameState.player;
        return { overlay: this.gameMode === 'exploration' && p.hp <= 0 ? 'game-over' : 'death',
            message: this.gameMode === 'exploration' ? '你死了（剩余生命 ' + p.hp + '）' +
                (p.hp > 0 && !this.canRevive ? '。出生点被鬼占据，无法复活；可以撤回、回存档或重置地图。' : '') : '你死了' };
    }
}
