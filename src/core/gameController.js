import { MapDefinition } from './mapDefinition.js';
import { GameLogic } from './gameLogic.js';
import { DataSerializer } from './dataSerializer.js';
import { ReplaySerializer } from './replaySerializer.js';
import { validateMapData } from './mapDataUtils.js';
import { actionToName } from './actions.js';
import { ActionHistory } from './actionHistory.js';
import { SessionHistory } from './sessionHistory.js';
import { finishStep } from './stepOutcome.js';

/** 当前局可分享，整次会话可撤销；各入口使用同一份当步完成状态。 */
export class GameController {
    constructor(ui = {}) {
        this.ui = ui;
        this.mapData = this.mapDefinition = this.currentGameState = this.history = this.session = null;
        this.checkpoints = [];
        this.currentStep = this.sessionCursor = this.viewLayer = 0;
        this.pendingDeath = false;
    }
    get gameMode() { return this.mapDefinition?.gameMode || 'exploration'; }
    get initialHealth() { return this.mapDefinition?.initialHealth || 5; }
    get actions() { return this.history?.actions.slice(0, this.currentStep) || []; }
    get replayActions() { return this.actions.length ? this.actions : this.session?.lastAttempt(this.sessionCursor) || []; }
    get canRevive() { return this.pendingDeath && !this.currentGameState?.isDead; }
    get canUndo() { return this.sessionCursor > 0; }
    get canRedo() { return !!this.session && this.sessionCursor < this.session.events.length; }
    get canRewind() { return this.checkpoints.some(p => p.cursor < this.sessionCursor); }
    startGame(source) {
        const checked = validateMapData(source);
        if (!checked.valid) return { success: false, error: checked.error };
        this.mapData = checked.mapData;
        this.mapDefinition = new MapDefinition(this.mapData);
        this.session = new SessionHistory(this.mapDefinition);
        this.currentGameState = this.session.stateAt(0);
        this.history = new ActionHistory(this.mapDefinition, [], { initialState: this.currentGameState });
        this.checkpoints = [];
        this.currentStep = this.sessionCursor = 0;
        this.pendingDeath = false;
        this._sync();
        return { success: true };
    }
    processAction(action) {
        if (!this.currentGameState) return null;
        if (action.type === 'REVIVE') return this.revive();
        let name;
        try { name = actionToName(action); } catch { return null; }
        const physical = GameLogic.calculateNextState(this.currentGameState, action, this.mapDefinition);
        if (physical === this.currentGameState) return null;
        const next = finishStep(physical, this.mapDefinition);
        const death = physical.isDead;
        this.session.appendEvent({ type: 'action', name, death }, next, this.sessionCursor);
        this.sessionCursor++;
        if (death && this.gameMode === 'death-loop') {
            this.history = new ActionHistory(this.mapDefinition, [], { initialState: next });
            this.currentStep = 0;
        } else {
            this.history.append(name, next, this.currentStep);
            if (death) this.history.deathSteps.add(this.currentStep + 1);
            this.currentStep++;
        }
        this.currentGameState = next;
        this.pendingDeath = death;
        this._sync();
        return next;
    }
    movePlayer(dx, dy) { return this.processAction({ type: 'MOVE', payload: { dx, dy } }); }
    useStair() { return this.processAction({ type: 'USE_STAIR' }); }
    revive() {
        if (!this.canRevive) return null;
        this.pendingDeath = false;
        const event=this.session.events[this.sessionCursor-1];if(event?.death)event.acknowledged=true;
        this._sync();
        return this.currentGameState;
    }
    reset() {
        if (!this.mapDefinition) return { ok: false, error: '请先加载地图' };
        const state = GameLogic.createInitialState(this.mapDefinition);
        this.session.appendEvent({ type: 'reset' }, state, this.sessionCursor++);
        this.currentGameState = state;
        this.history = new ActionHistory(this.mapDefinition, [], { initialState: state });
        this.currentStep = 0;
        this.pendingDeath = false;
        this._sync();
        return { ok: true };
    }
    restore(cursor) {
        this.currentGameState = this.session.stateAt(cursor);
        this.sessionCursor = cursor;
        const episode = this.session.episode(cursor);
        this.history = new ActionHistory(this.mapDefinition, episode.actions, { initialState: this.session.stateAt(episode.start) });
        this.currentStep = episode.actions.length;
        this.history.remember(this.currentStep, this.currentGameState, true);
        const event=this.session.events[cursor-1];this.pendingDeath=!!event?.death&&!event.acknowledged;
        this._sync();
    }
    undo() {
        if (!this.canUndo) return { ok: false, error: '已经回到本次加载的开局' };
        this.restore(this.sessionCursor - 1);
        return { ok: true };
    }
    redo() {
        if (!this.canRedo) return { ok: false, error: '没有可以重做的步骤' };
        this.restore(this.sessionCursor + 1);
        return { ok: true };
    }
    save() {
        if (!this.currentGameState) return { ok: false, error: '请先加载地图' };
        const encoded = this.generateReplayCode();
        if (!encoded.success) return { ok: false, error: encoded.error };
        if (this.checkpoints.some(p => p.code === encoded.code)) return { ok: false, error: '该步已经有存档点' };
        const point = { code: encoded.code, step: this.currentStep, cursor: this.sessionCursor, time: Date.now() };
        this.checkpoints.push(point);
        this.ui.onHistoryChange?.();
        return { ok: true, ...point };
    }
    rewind() {
        const target = this.checkpoints.filter(p => p.cursor < this.sessionCursor).at(-1);
        if (!target) return { ok: false, error: '没有更早的存档点' };
        const decoded = ReplaySerializer.loadFromShareCode(this.mapData, target.code);
        if (!decoded.success) return { ok: false, error: decoded.error };
        this.loadActions(this.mapData, decoded.actions);
        return { ok: true, step: this.currentStep };
    }
    _adopt(mapData, definition, history, step) {
        this.mapData = mapData;
        this.mapDefinition = definition;
        this.session = SessionHistory.fromReplay(history, step);
        this.sessionCursor = step;
        this.checkpoints = [];
        this.restore(step);
        this.pendingDeath = false;
        this._sync();
        return { ok: true };
    }
    loadActions(source, actions) {
        const checked = validateMapData(source);
        if (!checked.valid) return { ok: false, error: checked.error };
        const definition = new MapDefinition(checked.mapData);
        const history = new ActionHistory(definition, actions);
        history.stateAt(actions.length);
        return this._adopt(checked.mapData, definition, history, actions.length);
    }
    async loadActionsAsync(source, actions, options = {}) {
        const checked = validateMapData(source);
        if (!checked.valid) return { ok: false, error: checked.error };
        const definition = new MapDefinition(checked.mapData);
        const history = new ActionHistory(definition, actions);
        await history.stateAtAsync(actions.length, options);
        return this._adopt(checked.mapData, definition, history, actions.length);
    }
    loadReplayStep(replay, step) { return this.loadActions(replay.mapData, replay.history.actions.slice(0, step)); }
    buildShareSourceData() { return this.mapData; }
    loadFromShareCode(code) { return DataSerializer.loadFromShareCode(code); }
    generateReplayCode() {
        return this.mapData ? ReplaySerializer.generateShareCode(this.mapData, this.actions)
            : { success: false, error: '请先加载地图' };
    }
    _sync() {
        if (!this.currentGameState) return;
        this.viewLayer = this.currentGameState.player.layer;
        this.ui.onSync?.();
        this.ui.onHistoryChange?.();
        if (this.currentGameState.isWon) this.ui.onWin?.(this._winStats());
        else if (this.pendingDeath || this.currentGameState.isDead) this.ui.onDeath?.(this._deathStats());
    }
    _winStats() {
        const p = this.currentGameState.player;
        return { text: this.gameMode === 'exploration' ? `以 ${p.hp} 点剩余生命和 ${p.steps} 步通关` : `以 ${p.steps} 步通关` };
    }
    _deathStats() {
        const p = this.currentGameState.player;
        return { overlay: 'death', message: this.gameMode === 'exploration' ? p.hp <= 0 ? '生命耗尽，可以撤销或重置' : this.currentGameState.isDead ? '出生点被占据，可以撤销或重置' : `死亡，剩余生命 ${p.hp}` : '死亡，已回到出生点' };
    }
}
