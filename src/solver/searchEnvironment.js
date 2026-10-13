import { GameLogic } from '../core/gameLogic.js';
import { validateMapData } from '../core/mapDataUtils.js';
import { actionFromName } from '../core/actions.js';
import { makeSimulator, stateKey } from './searchIndex.js';

/** 与原参考环境相同的物理状态键：步数和观察记录不改变下一步物理结果。 */
export function physicalStateKey(state, mapId = null) {
    const p = state.player;
    return JSON.stringify([mapId, p.layer, p.x, p.y, p.hp, p.keys, state.isDead, state.isWon,
        state.layerStates.map(layer => [layer.ghosts.map(g => [g.x, g.y]),
            layer.items.map(item => [item.x, item.y, item.type]), layer.wallStates])]);
}

export function createSearchEnvironment(mapData) {
    const checked = validateMapData(mapData);
    if (!checked.valid) throw new TypeError(checked.error);
    const sim = makeSimulator(checked.mapData), mapDefinition = sim.definition;
    return {
        mapDefinition, actions: ['U', 'R', 'D', 'L', 'STAIR'],
        initialState: () => GameLogic.createInitialState(mapDefinition),
        step: (state, name) => GameLogic.calculateNextState(state, actionFromName(name), mapDefinition, { trails: false, visibility: false }),
        stateKey: state => stateKey(state, sim)
    };
}
