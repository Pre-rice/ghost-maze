import { test, suite, summary, assert, assertEq, assertDeepEq } from './_assert.mjs';
import { makeMap } from './helpers/map-fixture.mjs';
import { MapDefinition } from '../src/core/mapDefinition.js';
import { GameLogic } from '../src/core/gameLogic.js';
import { GameState } from '../src/core/gameState.js';

suite('ghostConflicts');
const move = (dx, dy) => ({ type: 'MOVE', payload: { dx, dy } });
const points = ghosts => ghosts.map(g => [g.x, g.y]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
const observe = s => ({ player: [s.player.x, s.player.y, s.player.layer, s.player.hp, s.player.keys],
    dead: s.isDead, won: s.isWon, ghosts: s.layerStates.map(l => points(l.ghosts)) });
const run = (start, ghosts, action, overrides = {}) => {
    const def = new MapDefinition(makeMap({ customStartPos: start, initialGhosts: ghosts, endPos: null, ...overrides }));
    const diagnostics = [];
    const state = GameLogic.calculateNextState(GameLogic.createInitialState(def), action, def,
        { trails: false, visibility: false, ghostDiagnostics: diagnostics });
    return { state, diagnostics };
};
const permutations = list => list.length < 2 ? [list] : list.flatMap((item, i) =>
    permutations(list.filter((_, j) => j !== i)).map(rest => [item, ...rest]));

test('能看到新位置的鬼优先，调换编号和排列不改变结果', () => {
    const ghosts = [{ x: 2, y: 3, id: 91 }, { x: 3, y: 4, id: 2 }];
    for (const order of permutations(ghosts)) {
        const { state, diagnostics } = run({ x: 3, y: 3 }, order, move(0, -1));
        assertDeepEq(points(state.layerStates[0].ghosts), [[2, 3], [3, 3]]);
        assert(!state.isDead); assertEq(diagnostics[0].decision, 'visible_target_priority');
    }
});

test('两侧只看到旧位置的鬼地位对称，共同进入空格并重合', () => {
    for (const order of permutations([{ x: 3, y: 2 }, { x: 3, y: 4 }])) {
        const { state, diagnostics } = run({ x: 3, y: 3 }, order, move(1, 0));
        assertDeepEq(points(state.layerStates[0].ghosts), [[3, 3], [3, 3]]);
        assert(!state.isDead); assertEq(diagnostics[0].decision, 'equal_priority_overlap');
    }
});

test('同时夹击玩家时两鬼进入玩家格并重合，只扣一次生命', () => {
    for (const order of permutations([{ x: 2, y: 2 }, { x: 4, y: 2 }])) {
        const { state, diagnostics } = run({ x: 3, y: 3 }, order, move(0, -1));
        assertEq(diagnostics[0].decision, 'player_capture_overlap');
        assert(state.isDead && !state.isWon); assertEq(state.player.hp, 4);
        assertDeepEq(points(state.layerStates[0].ghosts), [[3, 2], [3, 2]]);
    }
});

test('终点已有鬼时死亡，无鬼的终点仍在后续追击前判胜', () => {
    const occupied = run({ x: 3, y: 3 }, [{ x: 3, y: 2 }], move(0, -1), { endPos: { x: 3, y: 2 } }).state;
    assert(occupied.isDead && !occupied.isWon); assertEq(occupied.player.hp, 4);
    const empty = run({ x: 3, y: 3 }, [{ x: 3, y: 1 }], move(0, -1), { endPos: { x: 3, y: 2 } }).state;
    assert(empty.isWon && !empty.isDead);
});

test('出生格钥匙与终点立即生效，不需要额外走动或按按钮', () => {
    const key = new MapDefinition(makeMap({ customStartPos: { x: 3, y: 3 }, items: [{ x: 3, y: 3, type: 'key' }], endPos: null }));
    const initial = GameLogic.createInitialState(key);
    assertEq(initial.player.keys, 1); assertEq(initial.player.steps, 0); assertEq(initial.layerStates[0].items.length, 0);
    const goal = new MapDefinition(makeMap({ customStartPos: { x: 3, y: 3 }, endPos: { x: 3, y: 3 } }));
    assert(GameLogic.createInitialState(goal).isWon);
});

test('探索复活点已有鬼时禁止复活，生命与历史不被悄悄改变', () => {
    const def = new MapDefinition(makeMap({ customStartPos: { x: 3, y: 3 }, initialGhosts: [{ x: 3, y: 4 }], endPos: null }));
    const state = GameLogic.createInitialState(def);
    state.isDead = true; state.player.hp = 3; state.player.x = 5; state.player.y = 5;
    state.layerStates[0].ghosts[0].y = 3;
    assertEq(GameLogic.handleRevive(state, def), state); assertEq(state.player.hp, 3);
});

test('空位能够推进整条队列，与排列无关；不允许交换占位', () => {
    for (const order of permutations([{ x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }])) {
        const { state } = run({ x: 5, y: 4 }, order, move(0, -1));
        assertDeepEq(points(state.layerStates[0].ghosts), [[2, 3], [3, 3], [4, 3]]);
        assert(!state.isDead);
    }
    const ghosts = [{ x: 2, y: 3 }, { x: 3, y: 3 }];
    GameLogic._resolveGhostMoveConflicts(ghosts, [
        { ghost: ghosts[0], nextStep: { x: 3, y: 3 }, seesAfter: true },
        { ghost: ghosts[1], nextStep: { x: 2, y: 3 }, seesAfter: true }
    ], false);
    assertDeepEq(points(ghosts), [[2, 3], [3, 3]]);
});

const stairMap = ghosts => {
    const base = makeMap({ customStartPos: { x: 3, y: 3 }, endPos: null });
    return new MapDefinition({ ...base, multiLayerMode: true, layerCount: 2,
        stairs: [{ x: 3, y: 3, layer: 0, direction: 'up' }, { x: 3, y: 3, layer: 1, direction: 'down' }],
        layers: [0, 1].map(layer => ({ hWalls: base.hWalls, vWalls: base.vWalls, activeCells: base.activeCells,
            ghosts: ghosts[layer], items: [], buttons: [], customStartPos: layer ? null : { x: 3, y: 3 }, endPos: null })) });
};

test('楼梯追击与本层追击共同裁定，仍有新视线者优先且不重叠', () => {
    const def = stairMap([[{ x: 3, y: 4 }], [{ x: 3, y: 3 }]]);
    const state = GameLogic.calculateNextState(GameLogic.createInitialState(def), move(0, -1), def);
    assertDeepEq(state.layerStates.map(l => points(l.ghosts)), [[[3, 3]], [[3, 3]]]);
    assert(!state.isDead);
});

test('楼梯与本层同级争位重合，单独入场的鬼不会同回合再走一步', () => {
    const tie = stairMap([[{ x: 3, y: 2 }], [{ x: 3, y: 3 }]]);
    const state = GameLogic.calculateNextState(GameLogic.createInitialState(tie), move(1, 0), tie);
    assertDeepEq(state.layerStates.map(l => points(l.ghosts)), [[[3, 3], [3, 3]], []]);
    const alone = stairMap([[], [{ x: 3, y: 3 }]]);
    const arrived = GameLogic.calculateNextState(GameLogic.createInitialState(alone), move(1, 0), alone);
    assertDeepEq(arrived.layerStates.map(l => points(l.ghosts)), [[[3, 3]], []]);
    assert(!arrived.isDead);
});

test('旋转和镜像保留新目标优先及对称重合，不引入方向编号偏好', () => {
    for (let mirror = 0; mirror < 2; mirror++) for (let turns = 0; turns < 4; turns++) {
        const point = p => { let x = mirror ? 7 - p.x : p.x, y = p.y; for (let i = 0; i < turns; i++) [x, y] = [7 - y, x]; return { x, y }; };
        const vector = v => { let dx = mirror ? -v.dx : v.dx, dy = v.dy; for (let i = 0; i < turns; i++) [dx, dy] = [-dy, dx]; return { dx, dy }; };
        for (const fixture of [
            { ghosts: [{ x: 2, y: 3 }, { x: 3, y: 4 }], direction: { dx: 0, dy: -1 }, expected: [{ x: 2, y: 3 }, { x: 3, y: 3 }] },
            { ghosts: [{ x: 3, y: 2 }, { x: 3, y: 4 }], direction: { dx: 1, dy: 0 }, expected: [{ x: 3, y: 3 }, { x: 3, y: 3 }] }
        ]) for (const order of permutations(fixture.ghosts.map(point))) {
            const d = vector(fixture.direction), result = run(point({ x: 3, y: 3 }), order, move(d.dx, d.dy));
            assertDeepEq(points(result.state.layerStates[0].ghosts), points(fixture.expected.map(point)));
        }
    }
});

test('全部局部双鬼布局对编号和排列不敏感，包括死亡转移', () => {
    const def = new MapDefinition(makeMap({ customStartPos: { x: 3, y: 3 }, endPos: null }));
    const initial = GameLogic.createInitialState(def), cells = [];
    for (let y = 1; y <= 5; y++) for (let x = 1; x <= 5; x++) if (x !== 3 || y !== 3) cells.push({ x, y });
    for (let i = 0; i < cells.length; i++) for (let j = i + 1; j < cells.length; j++) for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
        const state = initial.clone(); state.layerStates[0].ghosts = [cells[i], cells[j]].map((g, id) => ({ ...g, id, trail: [] }));
        const reversed = state.clone(); reversed.layerStates[0].ghosts.reverse(); reversed.layerStates[0].ghosts.forEach(g => g.id += 90);
        const a = GameLogic.calculateNextState(state, move(dx, dy), def, { trails: false, visibility: false });
        const b = GameLogic.calculateNextState(reversed, move(dx, dy), def, { trails: false, visibility: false });
        assertDeepEq(observe(a), observe(b));
    }
});

summary();
