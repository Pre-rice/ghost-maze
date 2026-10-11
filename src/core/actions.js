import { DIRECTIONS, directionIndex } from './mapDataUtils.js';

export const ACTION_NAMES = Object.freeze(['U', 'D', 'L', 'R', 'STAIR']);
const actions = Object.freeze(ACTION_NAMES.map((name, index) => index === 4
    ? Object.freeze({ type: 'USE_STAIR' })
    : Object.freeze({ type: 'MOVE', payload: Object.freeze({ ...DIRECTIONS[index] }) })));
export function actionFromName(name) {
    const index = ACTION_NAMES.indexOf(name);
    if (index < 0) throw new TypeError('仅允许上下左右或楼梯操作');
    return actions[index];
}
export function actionToName(action) {
    const index = action.type === 'USE_STAIR' ? 4 : action.type === 'MOVE' ? directionIndex(action.payload) : -1;
    if (index < 0) throw new TypeError('仅允许上下左右或楼梯操作');
    return ACTION_NAMES[index];
}

