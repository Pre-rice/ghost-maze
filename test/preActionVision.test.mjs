import test from 'node:test';
import assert from 'node:assert/strict';
import { makeMap } from './helpers/map-fixture.mjs';
import { MapDefinition } from '../src/core/mapDefinition.js';
import { GameLogic } from '../src/core/gameLogic.js';
import { actionFromName } from '../src/core/actions.js';
import { WALL_TYPES as W } from '../src/core/constants.js';

function fixture({ ghosts = [{ x: 1, y: 3 }], gateX = 3, startX = 5, initialState = 'open' } = {}) {
    const map = makeMap({ customStartPos: { x: startX, y: 3 }, initialGhosts: ghosts, endPos: null,
        buttons: [{ x: startX, y: 3, letter: 'A', direction: { dx: 0, dy: -1 } }] });
    map.hWalls[3][startX] = { type: W.SOLID, keys: 0 };
    map.vWalls[3][gateX] = { type: W.LETTER_DOOR, keys: 0, letter: 'A', initialState };
    const definition = new MapDefinition(map), before = GameLogic.createInitialState(definition);
    return { definition, before, step: (state = before, action = 'U') =>
        GameLogic.calculateNextState(state, actionFromName(action), definition, { trails: false, visibility: false }) };
}
const ghosts = state => state.layerStates[0].ghosts.map(g => [g.x, g.y]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);

test('关门遮断原有视线时，鬼仍朝操作前玩家追一格，原状态不变', () => {
    const { before, step } = fixture(), snapshot = JSON.stringify(before), after = step();
    assert.equal(after.layerStates[0].wallStates.v[3][3].currentState, 'closed');
    assert.deepEqual(ghosts(after), [[2, 3]]);
    assert.equal(after.player.steps, 1); assert.equal(after.isDead, false);
    assert.equal(JSON.stringify(before), snapshot);
});

test('刚关闭的门挡住下一步时停在门前，不穿门也不绕路', () => {
    const { step } = fixture({ ghosts: [{ x: 2, y: 3 }] });
    assert.deepEqual(ghosts(step()), [[2, 3]]);
});

test('开门后新获得视线也追一格；近身开门当步正常死亡', () => {
    assert.deepEqual(ghosts(fixture({ initialState: 'closed' }).step()), [[2, 3]]);
    const close = fixture({ ghosts: [{ x: 4, y: 3 }], gateX: 5, initialState: 'closed' }).step();
    assert.equal(close.isDead, true); assert.deepEqual(ghosts(close), [[5, 3]]);
});

test('关门后的队列仍整体推进，编号和排列不改变结果', () => {
    for (const order of [[{ x: 1, y: 3, id: 99 }, { x: 2, y: 3, id: 1 }],
        [{ x: 2, y: 3, id: 99 }, { x: 1, y: 3, id: 1 }]]) {
        const { step } = fixture({ ghosts: order, gateX: 4, startX: 6 });
        assert.deepEqual(ghosts(step()), [[2, 3], [3, 3]]);
    }
});

test('普通拐角仍追旧位置一格，之后不继续追不可见玩家', () => {
    const { before, step } = fixture();
    const turn = step(before, 'D'); assert.deepEqual(ghosts(turn), [[2, 3]]);
    assert.deepEqual(ghosts(step(turn, 'D')), [[2, 3]]);
});

test('全局关门时仅当前层追击，未参与楼梯追击的另一层不获得额外回合', () => {
    const base = makeMap({ endPos: null }), layers = [0, 1].map(layer => ({
        activeCells: structuredClone(base.activeCells), hWalls: structuredClone(base.hWalls),
        vWalls: structuredClone(base.vWalls), ghosts: [{ x: 1, y: 3 }], items: [],
        buttons: layer ? [] : [{ x: 5, y: 3, letter: 'A', direction: { dx: 0, dy: -1 } }],
        customStartPos: layer ? null : { x: 5, y: 3 }, endPos: null
    }));
    for (const l of layers) { l.vWalls[3][3] = { type: W.LETTER_DOOR, keys: 0, letter: 'A', initialState: 'open' }; }
    layers[0].hWalls[3][5] = { type: W.SOLID, keys: 0 };
    const definition = new MapDefinition({ width: 8, height: 8, editorMode: 'free', gameMode: 'death-loop',
        initialHealth: 5, multiLayerMode: true, layerCount: 2, layers, stairs: [] });
    const after = GameLogic.calculateNextState(GameLogic.createInitialState(definition), actionFromName('U'), definition,
        { trails: false, visibility: false });
    assert.deepEqual(after.layerStates.map(l => l.ghosts.map(g => [g.x, g.y])), [[[2, 3]], [[1, 3]]]);
    assert(after.layerStates.every(l => l.wallStates.v[3][3].currentState === 'closed'));
});
