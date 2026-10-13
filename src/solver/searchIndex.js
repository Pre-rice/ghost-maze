import { WALL_TYPES as W } from '../core/constants.js';
import { MapDefinition } from '../core/mapDefinition.js';
import { GameLogic } from '../core/gameLogic.js';
import { validateMapData } from '../core/mapDataUtils.js';

/** 搜索适配器只建立静态布局与动态门索引，全部动作由共同规则执行。 */
export function makeSimulator(source, { withGhosts = true } = {}) {
    const data = source instanceof MapDefinition ? {
        width: source.width, height: source.height, editorMode: source.editorMode,
        gameMode: source.gameMode, initialHealth: source.initialHealth,
        multiLayerMode: source.multiLayerMode, layerCount: source.layerCount, stairs: source.stairs,
        layers: source.layers.map(layer => ({ activeCells: layer.activeCells,
            hWalls: layer.initialWalls.h, vWalls: layer.initialWalls.v, ...layer.initialEntities }))
    } : source;
    const checked = validateMapData(data, { requireEnd: false });
    if (!checked.valid) throw new TypeError(`地图无效：${checked.error}`);
    if (!withGhosts) for (const layer of checked.mapData.layers) layer.ghosts = [];
    const def = new MapDefinition(checked.mapData);
    let bitCount = 0;
    const dynamicWalls = def.layers.map(layer => {
        const walls = [];
        for (const axis of ['h', 'v']) layer.initialWalls[axis].forEach((row, y) => row.forEach((wall, x) => {
            if (wall.type === W.LOCKED || wall.type === W.LETTER_DOOR) walls.push({ axis, x, y, bit: bitCount++ });
        }));
        return walls;
    });
    return {
        definition: def, width: def.width, height: def.height, layerCount: def.layerCount,
        multiLayer: def.multiLayerMode, startPos: def.playerStart, stairs: def.stairs,
        editorMode: def.editorMode, gameMode: def.gameMode, initialHealth: def.initialHealth, withGhosts,
        layers: def.layers.map(layer => ({ hWalls: layer.initialWalls.h, vWalls: layer.initialWalls.v,
            activeCells: layer.activeCells, ...layer.initialEntities })),
        bitCount, dynamicWalls, wallCache: dynamicWalls.map(() => new WeakMap())
    };
}

export const createInitState = sim => GameLogic.createInitialState(sim.definition);
export const step = (state, action, sim) => GameLogic.calculateNextState(state, action, sim.definition, { trails: false, visibility: false });
export const canGhostSeePlayer = (sim, state, layer, ghost, player) =>
    GameLogic._canGhostSeePlayer(ghost, player, sim.definition.layers[layer], state.layerStates[layer]);

/** 位图是由权威墙态计算的索引，不写入局面，避免形成第二份可变状态。 */
export function wallBits(state, sim) {
    let bits = 0n;
    state.layerStates.forEach((layer, li) => {
        let value = sim.wallCache[li].get(layer.wallStates);
        if (value === undefined) {
            value = 0n;
            for (const { axis, x, y, bit } of sim.dynamicWalls[li]) {
                const wall = layer.wallStates[axis][y][x];
                if (wall.type === W.EMPTY || wall.currentState === 'open') value |= 1n << BigInt(bit);
            }
            sim.wallCache[li].set(layer.wallStates, value);
        }
        bits |= value;
    });
    return bits;
}

export function stateKey(state, sim, { withGhosts = true } = {}) {
    const p = state.player;
    return `${p.layer},${p.x},${p.y},${p.keys},${p.hp},${state.isDead},${state.isWon},${wallBits(state, sim)}|` +
        state.layerStates.map(layer => JSON.stringify(layer.items.map(it => [it.x, it.y, it.type]))).join(';') +
        (withGhosts && sim.withGhosts ? '|g:' + state.layerStates.map(layer => layer.ghosts.map(g => `${g.x},${g.y}`).join('|')).join(';') : '');
}

export const getEndPos = (sim, layer) => sim.layers[layer]?.endPos ?? null;
export const isWin = state => state.isWon && !state.isDead;
