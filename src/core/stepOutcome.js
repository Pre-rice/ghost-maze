import { GameLogic } from './gameLogic.js';

/** 物理碰撞仍由唯一规则计算；网页、回放与存档只留下当步完成后的出生点状态。 */
export function finishStep(state, mapDef) {
    if (!state.isDead) return state;
    const revived = GameLogic.handleRevive(state, mapDef);
    if (revived !== state) return revived;
    // 生命耗尽或出生点被占据仍按既有规则终止，显示位置也统一为出生点。
    const stopped = state.clone();
    Object.assign(stopped.player, mapDef.playerStart, { trail: [] });
    return stopped;
}
