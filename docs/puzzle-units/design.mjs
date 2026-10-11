import { writeFileSync } from 'node:fs';
import { GameLogic } from '../../src/core/gameLogic.js';
import { MapDefinition } from '../../src/core/mapDefinition.js';
import { DataSerializer } from '../../src/core/dataSerializer.js';
import { WALL_TYPES as W } from '../../src/core/constants.js';
import { installBrowserEnv } from '../../test/helpers/browser-env.mjs';

installBrowserEnv();

// 空格是非活动格；相邻活动格默认连通。边界保持实墙，避免隔空视线。
const layouts = [
    { id: 'unit-01', title: '探头再绕行', rows: [
        '        ', '        ', ' ...G.E ', ' S   .  ',
        ' .....  ', '        ', '        ', '        '
    ] },
    { id: 'unit-02', title: '把鬼留在门那边', rows: [
        '        ', '   E    ', ' ...G.  ', ' S   .  ',
        ' .....  ', '        ', '        ', '        '
    ], gate: true }
];

const actions = [
    ['U', 0, -1], ['R', 1, 0], ['D', 0, 1], ['L', -1, 0]
].map(([name, dx, dy]) => ({ name, type: 'MOVE', payload: { dx, dy } }));

function addGate(map) {
    map.vWalls[2][3] = { type: W.LETTER_DOOR, keys: 0, letter: 'A', initialState: 'open' };
    map.buttons = [{ x: 1, y: 3, direction: { dx: -1, dy: 0 }, letter: 'A' }];
    return map;
}

function makeMap({ rows, gate }) {
    const width = rows[0].length, height = rows.length;
    const solid = () => ({ type: W.SOLID, keys: 0 });
    const empty = () => ({ type: W.EMPTY, keys: 0 });
    const map = {
        width, height, gameMode: 'death-loop', initialHealth: 5, initialStamina: 100,
        editorMode: 'free', multiLayerMode: false, layerCount: 1,
        layers: [], stairs: [], items: [], buttons: [], initialGhosts: [],
        activeCells: rows.map(row => [...row].map(cell => cell !== ' ')),
        hWalls: Array.from({ length: height + 1 }, () => Array.from({ length: width }, solid)),
        vWalls: Array.from({ length: height }, () => Array.from({ length: width + 1 }, solid))
    };
    rows.forEach((row, y) => [...row].forEach((cell, x) => {
        if (cell === ' ') return;
        if (cell === 'S') map.startPos = map.customStartPos = { x, y };
        if (cell === 'E') map.endPos = { x, y };
        if (cell === 'G') map.initialGhosts.push({ x, y, id: 0 });
        if (x + 1 < width && map.activeCells[y][x + 1]) map.vWalls[y][x + 1] = empty();
        if (y + 1 < height && map.activeCells[y + 1][x]) map.hWalls[y + 1][x] = empty();
    }));
    return gate ? addGate(map) : map;
}

const gateState = state => state.layerStates[0].wallStates.v[2][3].currentState;
const atPeek = state => state.player.x === 1 && state.player.y === 2;

// 只验证本文件的单层、至多一只鬼、无物品关卡，不是通用求解器。
// 探索模式去掉体力限制；碰鬼仍终止。去掉计步和轨迹后穷尽有限物理状态。
function solve(map, allow = () => true) {
    const def = new MapDefinition({ ...map, gameMode: 'exploration' });
    const stateKey = state => JSON.stringify([
        state.player.x, state.player.y,
        state.layerStates[0].ghosts.map(ghost => [ghost.x, ghost.y]),
        gateState(state)
    ]);
    const initial = GameLogic.createInitialState(def);
    const queue = [{ state: initial, sequence: '' }];
    const visited = new Set([stateKey(initial)]);
    let shortest = null;
    for (let index = 0; index < queue.length; index++) {
        const { state, sequence } = queue[index];
        if (state.isWon) { shortest ??= sequence; continue; }
        for (const action of actions) {
            const next = GameLogic.calculateNextState(state, action, def);
            if (next === state || next.isDead || !allow(next, state, action)) continue;
            const key = stateKey(next);
            if (visited.has(key)) continue;
            visited.add(key);
            queue.push({ state: next, sequence: sequence + action.name });
        }
    }
    return { shortest, reachableStates: visited.size, exhausted: true };
}

function replay(map, sequence) {
    const def = new MapDefinition(map);
    let state = GameLogic.createInitialState(def);
    const snapshot = () => ({
        player: [state.player.x, state.player.y],
        ghosts: state.layerStates[0].ghosts.map(ghost => [ghost.x, ghost.y]),
        gate: map.buttons.length ? gateState(state) : null,
        steps: state.player.steps, stamina: state.player.stamina,
        won: state.isWon, dead: state.isDead
    });
    const trace = [{ action: null, ...snapshot() }];
    for (const name of sequence) {
        state = GameLogic.calculateNextState(state, actions.find(action => action.name === name), def);
        trace.push({ action: name, ...snapshot() });
    }
    return trace;
}

const maps = layouts.map(makeMap);
const results = layouts.map((layout, index) => {
    const map = maps[index];
    const search = solve(map);
    if (!search.shortest) throw new Error(`${layout.title}未找到解`);
    const encoded = DataSerializer.generateShareCode(map);
    if (!encoded.success) throw new Error(encoded.error);
    const decoded = DataSerializer.loadFromShareCode(encoded.code);
    if (!decoded.success) throw new Error(decoded.error);
    const { mapData, gameMode, initialHealth, initialStamina } = decoded.data;
    const decodedMap = { ...mapData, gameMode, initialHealth, initialStamina };
    const trace = replay(decodedMap, search.shortest);
    if (!trace.at(-1).won || trace.some(frame => frame.dead)) throw new Error('分享码重放失败');
    if (JSON.stringify(trace) !== JSON.stringify(replay(map, search.shortest))) throw new Error('编码前后轨迹不一致');
    const noGhosts = solve({ ...map, initialGhosts: [] });
    const noPeek = solve(map, state => !atPeek(state));
    if (noPeek.shortest !== null) throw new Error('存在绕过探头的解');
    const noClosing = layout.gate ? solve(map, state => gateState(state) === 'open') : null;
    if (noClosing?.shortest !== null && layout.gate) throw new Error('存在不关门的解');
    const noGhostLeftOfClosedGate = layout.gate ? solve(map, state =>
        !(gateState(state) === 'closed' && state.layerStates[0].ghosts[0].x < 3 && state.layerStates[0].ghosts[0].y === 2)
    ) : null;
    if (layout.gate && noGhostLeftOfClosedGate.shortest !== null) throw new Error('存在未把鬼留在门左侧的解');
    const blindDetour = replay(map, 'DRRRRUU');
    if (!blindDetour.at(-1).dead) throw new Error('直接绕行意外成功');
    // 终点仅用于独立试玩；移除它后验证单元真实出口状态，避免借用提前判胜。
    const embeddedTrace = replay({ ...decodedMap, endPos: null }, search.shortest);
    if (embeddedTrace.some(frame => frame.dead)) throw new Error('移除终点后不能安全抵达出口');
    writeFileSync(new URL(`${layout.id}.json`, import.meta.url), JSON.stringify(map, null, 2) + '\n');
    return {
        id: layout.id, title: layout.title,
        activeCells: map.activeCells.flat().filter(Boolean).length,
        shareCode: encoded.code, shareUrl: `https://ghostmaze.novic.cc/?map=${encoded.code}`,
        search, trace, exitWithoutGoal: embeddedTrace.at(-1),
        checks: { noGhosts, noPeek, noClosing, noGhostLeftOfClosedGate, blindDetour }
    };
});

// 保留一个被淘汰的设计对照：只给第一题加机关，却不改变通行目标。
const redundantGate = solve(addGate(structuredClone(maps[0])));
if (redundantGate.shortest !== results[0].search.shortest) throw new Error('冗余机关对照发生变化');

writeFileSync(new URL('verification.json', import.meta.url), JSON.stringify({
    rules: '使用当前游戏引擎；有限物理状态穷尽；最短指成功动作数；不包含复活与撤销',
    redundantGate, units: results
}, null, 2) + '\n');
console.log(JSON.stringify({ redundantGate, units: results.map(({ trace, checks, ...unit }) => ({
    ...unit, actions: trace.length - 1, moves: trace.at(-1).steps,
    noPeek: checks.noPeek, noClosing: checks.noClosing,
    noGhostLeftOfClosedGate: checks.noGhostLeftOfClosedGate, noGhosts: checks.noGhosts
})) }, null, 2));
