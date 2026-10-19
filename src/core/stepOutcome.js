import { GameLogic } from './gameLogic.js';

/** 死亡判定瞬间的整个局面。按当步完成后的局面对象查表：不写入共享局面，也不进入存档、回放或编号。 */
const deathOutcomes = new WeakMap();

/** 当步死亡判定瞬间的完整局面（玩家在死亡格，鬼、门、钥匙都是当时的状态）；无死亡返回 null。 */
export function deathOutcomeOf(state) {
    return deathOutcomes.get(state) || null;
}

/** 当步死亡位置；权威状态仍是复活后局面，显示层据此把视野切到死亡所在格。 */
export function deathPositionOf(state) {
    const outcome = deathOutcomes.get(state);
    return outcome ? { x: outcome.player.x, y: outcome.player.y, layer: outcome.player.layer } : null;
}

/** 物理碰撞仍由唯一规则计算；死亡当步记下死亡瞬间的局面，状态内容保持复活后局面。 */
export function finishStep(state, mapDef) {
    if (!state.isDead) return state;
    let result = GameLogic.handleRevive(state, mapDef);
    if (result === state) {
        // 生命耗尽或出生点被占据仍按既有规则终止，状态位置统一为出生点。
        result = state.clone();
        Object.assign(result.player, mapDef.playerStart, { trail: [] });
    }
    deathOutcomes.set(result, state);
    return result;
}
