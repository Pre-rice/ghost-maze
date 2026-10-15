import { ActionHistory, replayStep } from './actionHistory.js';
import { GameLogic } from './gameLogic.js';

/** 本次加载后的撤销序列。RESET不进入分享路线；致死动作已包含当步重生。 */
export class SessionHistory extends ActionHistory {
    constructor(mapDef) {
        super(mapDef);
        this.events = [];
    }
    get length() { return (this.events?.length || 0) + 1; }
    appendEvent(event, state, cursor) {
        this.events.length = cursor;
        for (const key of this.cache.entries.keys()) if (typeof key === 'number' && key > cursor) this.cache.delete(key);
        const previousStart = this.events.at(-1)?.episodeStart || 0;
        const index = cursor + 1;
        this.events.push({ ...event, episodeStart: event.type === 'reset' || event.death && this.mapDef.gameMode === 'death-loop' ? index : previousStart });
        this.target = index;
        this.remember(index, state, true);
    }
    stateAt(cursor) {
        const nearest = this.nearest(cursor);
        this.target = cursor;
        let state = nearest.state;
        for (let i = nearest.from; i < cursor; i++) {
            const event = this.events[i];
            state = event.type === 'reset' ? GameLogic.createInitialState(this.mapDef)
                : replayStep(state, event.name, this.mapDef, i + 1);
            this.remember(i + 1, state, i + 1 === cursor);
        }
        return state;
    }
    episode(cursor) {
        const start = this.events[cursor - 1]?.episodeStart || 0;
        return { start, actions: this.events.slice(start, cursor).filter(e => e.type === 'action').map(e => e.name) };
    }
    lastAttempt(cursor) {
        for (let i = cursor - 1; i >= 0; i--) {
            const event = this.events[i];
            if (event.type === 'reset') break;
            if (event.death && this.mapDef.gameMode === 'death-loop') {
                const start = this.events[i - 1]?.episodeStart || 0;
                return this.events.slice(start, i + 1).filter(e => e.type === 'action').map(e => e.name);
            }
        }
        return [];
    }
    static fromReplay(history, cursor) {
        history.stateAt(cursor);
        const session = new SessionHistory(history.mapDef);
        let episodeStart = 0;
        session.events = history.actions.slice(0, cursor).map((name, i) => {
            const death = history.deathSteps.has(i + 1);
            if (death && history.mapDef.gameMode === 'death-loop') episodeStart = i + 1;
            return { type: 'action', name, death, episodeStart, acknowledged: true };
        });
        session.target = cursor;
        for (const [key, state] of history.cache.entries) if (Number.isInteger(key) && key <= cursor) session.remember(key, state, key === cursor);
        return session;
    }
}
