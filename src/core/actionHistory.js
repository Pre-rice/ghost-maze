import { GameLogic } from './gameLogic.js';
import { actionFromName } from './actions.js';

export function mergeSeen(first, second) {
    return first.map((layer, li) => layer.map((row, y) => row.map((seen, x) => seen || second[li]?.[y]?.[x] || false)));
}

/** 每个有效操作恰好对应一个步号；探索模式的复活由下一操作推导。 */
export function replayStep(state, name, mapDef, step) {
    let base = state;
    if (base.isDead && mapDef.gameMode === 'exploration' && base.player.hp > 0) base = GameLogic.handleRevive(base, mapDef);
    const next = GameLogic.calculateNextState(base, actionFromName(name), mapDef, { trails: false });
    if (next === base) throw new RangeError('第 ' + step + ' 步无法执行，请检查回放路线');
    return next;
}

/** 按实际共用引用估算缓存占用，释放引用时回收计数。 */
class StateCache {
    entries = new Map(); refs = new Map(); bytes = 0;
    constructor(budget) { this.budget = budget; }
    retain(object) {
        if (!object || typeof object !== 'object') return;
        const previous = this.refs.get(object);
        if (previous) { previous.count++; return; }
        const values = Object.values(object), size = 40 + values.length * 8 +
            values.reduce((sum, value) => sum + (typeof value === 'string' ? value.length * 2 : 0), 0);
        this.refs.set(object, { count: 1, values, size }); this.bytes += size;
        for (const value of values) this.retain(value);
    }
    release(object) {
        if (!object || typeof object !== 'object') return;
        const ref = this.refs.get(object);
        if (!ref || --ref.count) return;
        this.refs.delete(object); this.bytes -= ref.size;
        for (const value of ref.values) this.release(value);
    }
    put(step, state) {
        this.delete(step); this.entries.set(step, state); this.retain(state);
    }
    delete(step) {
        const state = this.entries.get(step);
        if (state) { this.entries.delete(step); this.release(state); }
    }
}

export class ActionHistory {
    constructor(mapDef, actions = [], { initialState, cacheBudgetBytes = 16 * 1024 * 1024 } = {}) {
        this.mapDef = mapDef;
        this.deathSteps = new Set();
        this.actions = actions.slice();
        for (const name of this.actions) actionFromName(name);
        this.cache = new StateCache(cacheBudgetBytes);
        this.cache.put(0, initialState || GameLogic.createInitialState(mapDef));
        this.target = 0;
    }
    get length() { return this.actions.length + 1; }
    get cachedBytes() { return this.cache.bytes; }
    nearest(step) {
        if (!Number.isInteger(step) || step < 0 || step >= this.length) throw new RangeError('步号超出回放范围');
        let from = 0;
        for (const key of this.cache.entries.keys()) if (typeof key === 'number' && key <= step && key > from) from = key;
        return { from, state: this.cache.entries.get(from) };
    }
    remember(step, state, final = false) {
        if (state.isDead) this.deathSteps.add(step);
        if (step % 32 === 0 || final || step >= this.target - 32) this.cache.put(step, state);
        // 近期局面保留 32 步，远处只留锚点。
        for (const key of this.cache.entries.keys()) {
            if (typeof key === 'number' && key !== 0 && key !== step && key % 32 !== 0 && Math.abs(key - this.target) > 32) this.cache.delete(key);
        }
        if (this.cache.bytes > this.cache.budget) for (const key of this.cache.entries.keys()) {
            if (key === 0 || key === step || typeof key !== 'number') continue;
            this.cache.delete(key);
            if (this.cache.bytes <= this.cache.budget) break;
        }
    }
    stateAt(step) {
        const nearest = this.nearest(step); this.target = step;
        let state = nearest.state;
        for (let index = nearest.from; index < step; index++) {
            state = replayStep(state, this.actions[index], this.mapDef, index + 1);
            this.remember(index + 1, state, index + 1 === step);
        }
        return state;
    }
    async stateAtAsync(step, { signal } = {}) {
        const nearest = this.nearest(step); this.target = step;
        let state = nearest.state, started = performance.now();
        for (let index = nearest.from; index < step; index++) {
            if (signal?.aborted) throw new DOMException('已取消跳步', 'AbortError');
            state = replayStep(state, this.actions[index], this.mapDef, index + 1);
            this.remember(index + 1, state, index + 1 === step);
            if (performance.now() - started >= 8 && index + 1 < step) {
                await new Promise(resolve => setTimeout(resolve, 0)); started = performance.now();
            }
        }
        return state;
    }
    truncate(step) {
        this.actions.length = step;
        for (const death of this.deathSteps) if (death > step) this.deathSteps.delete(death);
        for (const key of this.cache.entries.keys()) if (typeof key === 'number' && key > step) this.cache.delete(key);
    }
    append(name, state, step) {
        this.truncate(step); this.actions.push(name); this.target = step + 1;
        this.remember(step + 1, state, true);
    }
}

