import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { spawnSync } from 'node:child_process';
import { installBrowserEnv } from './helpers/browser-env.mjs';
import { makeMap } from './helpers/map-fixture.mjs';
import { test, suite, summary, assert, assertEq, assertDeepEq } from './_assert.mjs';
import { createPlaytestAPI } from '../src/playtest/public.js';
import { prepareTarget } from '../src/playtest/target.js';
import { reconstruct } from '../src/playtest/session.js';
import { observeBoard } from '../src/playtest/observation.js';
import { MapDefinition } from '../src/core/mapDefinition.js';
import { GameLogic } from '../src/core/gameLogic.js';
import { DataSerializer } from '../src/core/dataSerializer.js';
import { ReplaySerializer } from '../src/core/replaySerializer.js';
import { ActionHistory } from '../src/core/actionHistory.js';
import { actionFromName } from '../src/core/actions.js';
installBrowserEnv();
const manifest = JSON.parse(readFileSync(new URL('../.agents/skills/ghostmaze-playtest/assets/manifest.json', import.meta.url)));
const api = createPlaytestAPI(manifest), revision = manifest.engine;
const code = map => { const r = DataSerializer.generateShareCode(map); assert(r.success, r.error); return r.code; };
const start = (map = makeMap(), extra = {}) => api.start({ source: code(map), ...extra });
const command = (result, cmd) => api.command(result.session, cmd);
const fail = (fn, text) => { let caught = false; try { fn(); } catch (e) { caught = !text || e.message.includes(text); } assert(caught, '没有按预期拒绝'); };
const physical = state => JSON.stringify(state, (key, value) => key === 'trail' ? undefined : value);
function twoLayers(ghost = false) {
    const base = DataSerializer.loadFromShareCode(code(makeMap())).data.mapData;
    const layers = [structuredClone(base.layers[0]), structuredClone(base.layers[0])];
    layers[1].customStartPos = null;
    if (ghost) layers[1].ghosts = [{ x: 1, y: 0 }];
    return { ...base, layerCount: 2, multiLayerMode: true, layers,
        stairs: [{ x: 1, y: 0, layer: 0, direction: 'up' }, { x: 1, y: 0, layer: 1, direction: 'down' }] };
}
suite('AI试玩');
test('包资源与唯一源码逐字节核对', () => {
    const checked = spawnSync(process.execPath, ['scripts/package-playtest.mjs', '--check'], { cwd: new URL('../', import.meta.url), encoding: 'utf8' });
    assertEq(checked.status, 0, checked.stderr);
});
test('地图码与链接开局一致，replay不会成为答案输入', () => {
    const map = code(makeMap()), a = api.start({ source: map }), b = api.start({ source: `https://ghostmaze.novic.cc/?map=${map}&replay=not-read` });
    assertDeepEq(a.board, b.board); assertEq(a.info.rules, 'known');
    fail(() => api.start({ source: 'https://ghostmaze.novic.cc/?replay=abc' }));
    fail(() => api.start({ source: `https://ghostmaze.novic.cc/?map=${map}&map=${map}` }));
});
test('未知规则开局不带机制解释、设计资料或身份信息', () => {
    const r = start(makeMap(), { rules: 'discover', inheritedExperience: '上次自己观察到的现象' });
    assertEq(r.info.rules, 'discover'); assertEq(r.info.inheritedExperience, '上次自己观察到的现象');
    for (const key of ['mapDefinition', 'layerStates', 'ghostDiagnostics', 'legalActions', 'solution']) assertEq(r.board[key], undefined);
});
test('隐藏鬼位、门参数和鬼编号变化不改变可见局面', () => {
    const a = makeMap({ initialGhosts: [{ x: 6, y: 5, id: 123 }] });
    a.vWalls[6][6] = { type: 6, letter: 'A', initialState: 'closed' };
    const b = structuredClone(a); b.initialGhosts = [{ x: 7, y: 6, id: 999 }];
    b.vWalls[6][6] = { type: 6, letter: 'B', initialState: 'open' };
    assertDeepEq(start(a).board, start(b).board);
});
test('死亡循环固定全图无鬼数，探索只显示网页可见范围', () => {
    const a = start(makeMap({ gameMode: 'death-loop' })), b = start();
    assertEq(a.board.view, 'full'); assertEq(a.board.stats.nearbyGhosts, undefined);
    assertEq(b.board.view, 'explored'); assertEq(b.board.stats.nearbyGhosts, 0);
    assert(b.board.grid.rows.some(row => row.includes('?')));
    fail(() => start(makeMap(), { fullVision: true }));
    assertEq(start(makeMap(), { fullVision: true, allowFullVision: true }).board.view, 'full');
});
test('观察器不泄露任何未探索格内的元件', () => {
    const m = makeMap({ initialGhosts: [{ x: 6, y: 6 }], items: [{ x: 5, y: 5, type: 'key' }] });
    m.hWalls[5][4] = { type: 1 }; m.buttons = [{ x: 4, y: 4, letter: 'Z', direction: { dx: 0, dy: 1 } }];
    const r = start(m), runtime = reconstruct(r.session, revision);
    for (const entity of r.board.entities) assert(runtime.state.seenCells[0][entity.at[1] - 1][entity.at[0] - 1]);
    assert(!JSON.stringify(r.board).includes('"letter":"Z"'));
});
test('重合数量可见、鬼顺序不成为身份提示', () => {
    const r = start(makeMap({ gameMode: 'death-loop', initialGhosts: [{ x: 4, y: 0 }, { x: 4, y: 1 }] }));
    const runtime = reconstruct(r.session, revision), state = runtime.state.clone();
    state.layerStates[0].ghosts[1].y = 0; // 观察器须能表示运行中产生的重合；初图仍拒绝重合。
    const board = observeBoard(runtime.definition, state), ghost = board.entities.find(e => e.kind === 'ghost');
    assertEq(ghost.count, 2); assertEq(ghost.id, undefined);
    state.layerStates[0].ghosts.reverse(); assertDeepEq(observeBoard(runtime.definition, state), board);
});
test('已知空通道、门所在边和按钮朝向准确表示', () => {
    const m = makeMap({ gameMode: 'death-loop', buttons: [{ x: 0, y: 0, letter: 'A', direction: { dx: 0, dy: -1 } }] });
    m.vWalls[0][1] = { type: 6, letter: 'A', initialState: 'closed' };
    const r = start(m), edge = r.board.edges.find(e => e.kind === 'letter-door');
    assertDeepEq(edge.between, [[1, 1], [2, 1]]); assertEq(edge.state, 'closed');
    assertEq(r.board.entities.find(e => e.kind === 'button').facing, 'U');
    const next = command(r, 'U'); assertEq(next.board.stats.steps, 1);
    assertEq(next.board.edges.find(e => e.kind === 'letter-door').state, 'open');
    assertDeepEq(next.board.player.at, [1, 1]);
});
test('无效输入不计步、不裁掉重做，禁止远程按按钮和多步脚本', () => {
    let r = command(start(), 'R'); r = command(r, { type: 'undo' });
    r = command(r, 'L'); assertEq(r.lastEvent.effective, false); assertEq(r.board.stats.steps, 0); assertEq(r.info.canRedo, true);
    fail(() => command(r, { type: 'PRESS_BUTTON', letter: 'A' })); fail(() => command(r, ['R', 'D']));
});
test('有效输入与原GameLogic逐步一致，普通输入从不调用求解器', () => {
    let r = start(), runtime = reconstruct(r.session, revision), expected = runtime.state;
    for (const name of ['R', 'D', 'R', 'U', 'L', 'L', 'D', 'D']) {
        expected = GameLogic.calculateNextState(expected, actionFromName(name), runtime.definition, { trails: false });
        r = command(r, name);
        assertEq(physical(reconstruct(r.session, revision).state), physical(expected));
    }
    const bundle = readFileSync(new URL('../.agents/skills/ghostmaze-playtest/assets/playtest.js', import.meta.url), 'utf8');
    assert(!bundle.includes('createBreadthFirstSearch')); assert(!bundle.includes('optimal-cache'));
});
test('撤销、重做与分支保持实际记录', () => {
    let r = command(start(), 'R'); r = command(r, 'D'); r = command(r, { type: 'undo' });
    assertDeepEq(r.board.player.at, [2, 1]);
    r = command(r, { type: 'redo' }); assertDeepEq(r.board.player.at, [2, 2]);
    r = command(r, { type: 'undo' }); r = command(r, 'R'); assertEq(r.info.canRedo, false);
    const trace = api.export(r.session).trace; assertEq(trace.length, 6); assertEq(trace[1].command.action, 'D');
});
test('重置可撤销，原本的失败路线不会从审计记录消失', () => {
    let r = command(start(), 'R'); r = command(r, 'D'); r = command(r, { type: 'reset' });
    assertEq(r.board.stats.steps, 0); r = command(r, { type: 'undo' }); assertDeepEq(r.board.player.at, [2, 2]);
    assertEq(api.export(r.session).attempts[0].kind, 'reset');
});
test('探索致死自动使用同引擎复活，仍可撤销死亡', () => {
    const map = makeMap({ initialGhosts: [{ x: 2, y: 0 }] });
    let r = start(map); r = command(r, 'R');
    assertEq(r.lastEvent.change.death, true); assertEq(r.lastEvent.change.revived, true);
    assertDeepEq(r.board.player.at, [1, 1]); assertEq(r.board.stats.health, 4);
    const expected = GameLogic.handleRevive(GameLogic.calculateNextState(GameLogic.createInitialState(new MapDefinition(DataSerializer.loadFromShareCode(code(map)).data.mapData)), actionFromName('R'), new MapDefinition(DataSerializer.loadFromShareCode(code(map)).data.mapData), { trails: false }), new MapDefinition(DataSerializer.loadFromShareCode(code(map)).data.mapData));
    assertEq(physical(reconstruct(r.session, revision).state), physical(expected));
    r = command(r, { type: 'undo' }); assertEq(r.board.stats.health, 5); assertEq(r.board.stats.steps, 0);
});
test('生命耗尽会停止，不能自动多走或增加生命', () => {
    let r = start(makeMap({ initialHealth: 1, initialGhosts: [{ x: 2, y: 0 }] }));
    r = command(r, 'R'); assertEq(r.board.status, 'stopped'); assertEq(r.board.stats.health, 0);
    const steps = r.board.stats.steps; r = command(r, 'D'); assertEq(r.lastEvent.effective, false); assertEq(r.board.stats.steps, steps);
});
test('死亡循环清本轮路线但留死亡回放与累计失败', () => {
    let r = start(makeMap({ gameMode: 'death-loop', initialGhosts: [{ x: 2, y: 0 }] })); r = command(r, 'R');
    assertEq(r.board.stats.loops, 1); assertEq(r.board.stats.steps, 0);
    const record = api.export(r.session); assertEq(record.stats.deaths, 1); assertEq(record.attempts[0].steps, 1);
    r = command(r, { type: 'undo' }); assertEq(r.board.stats.loops, 0);
});
test('查看其他层不计步，楼梯移动由本体执行', () => {
    let r = start(twoLayers()); r = command(r, { type: 'view', layer: 2 });
    assertEq(r.board.layer, 2); assertEq(r.board.stats.steps, 0); assertEq(r.board.player.layer, 1);
    r = command(r, 'R'); r = command(r, 'STAIR'); assertEq(r.board.player.layer, 2); assertEq(r.board.stats.steps, 2);
});
test('抵达楼梯端点当步可被另一端鬼杀死，不复制延迟规则', () => {
    let r = start(twoLayers(true)); r = command(r, 'R'); assertEq(r.lastEvent.change.death, true); assertEq(r.board.stats.health, 4);
});
test('存档点可加载和删除，加载仅重建其真实路线', () => {
    let r = command(start(), 'R'); r = command(r, { type: 'checkpoint', label: '暂存' });
    const id = r.info.checkpoints[0].id; r = command(r, 'D'); r = command(r, { type: 'load', id });
    assertDeepEq(r.board.player.at, [2, 1]); assertEq(r.board.stats.steps, 1);
    r = command(r, { type: 'undo' }); assertEq(r.board.stats.steps, 0);
    r = command(r, { type: 'deleteCheckpoint', id }); assertEq(r.info.checkpoints.length, 0);
});
test('存档链接恢复前缀与可撤销序列，不读取replay参数', () => {
    const map = code(makeMap()), data = DataSerializer.loadFromShareCode(map).data.mapData;
    const save = ReplaySerializer.generateShareCode(data, ['R', 'D']).code;
    let r = api.start({ source: `https://ghostmaze.novic.cc/?map=${map}&save=${save}` });
    assertEq(r.board.stats.steps, 2); r = command(r, { type: 'undo' }); assertEq(r.board.stats.steps, 1);
    r = command(r, { type: 'restart' }); assertEq(r.board.stats.steps, 2);
});
test('恢复码包含中文、表情与全部分支，损坏和版本错配拒绝', () => {
    let r = command(start(), 'R'); r = command(r, { type: 'note', kind: 'feeling', text: '有点困惑，继续看看🙂' });
    r = command(r, { type: 'reset' }); r = command(r, { type: 'undo' });
    const token = api.save(r.session), restored = api.restore(token);
    assertDeepEq(restored.board, r.board); assertDeepEq(restored.info, r.info); assertDeepEq(restored.session.events, r.session.events);
    fail(() => api.restore(token.slice(0, -3) + 'AAA'));
    fail(() => createPlaytestAPI({ engine: 'other' }).restore(token));
});
test('历史只包含已经发生的可见观察，笔记不是自动生成的情绪', () => {
    let r = command(start(), 'R'); r = command(r, { type: 'note', kind: 'hypothesis', text: '准备检验一个想法' });
    const record = api.export(r.session); assertEq(record.source, 'ai-playtest'); assertEq(record.notes.length, 1);
    assertEq(record.notes[0].kind, 'hypothesis'); assertEq(api.history(r.session, { from: 2, limit: 1 })[0].event, 2);
    assertEq(record.rating, undefined); assertEq(record.humanQuality, undefined);
});
test('最短挑战行动前必须证明目标，只返回一个步数', () => {
    let r = start(makeMap({ endPos: { x: 2, y: 0 } }), { challenge: 'shortest' });
    fail(() => command(r, 'R'), '目标');
    const prepared = prepareTarget(r.session, revision); assertDeepEq(Object.keys(prepared.target).sort(), ['status', 'steps']);
    assertEq(prepared.target.steps, 2); assertEq(prepared.target.status, 'solved');
    r = { session: prepared.session }; r = command(r, 'R');
    fail(() => prepareTarget(r.session, revision), '中间');
    r = command(r, 'R'); assertEq(r.info.goal.met, true);
});
test('绕路通关不能冒充最短，重启后可以继续挑战', () => {
    let session = start(makeMap({ endPos: { x: 2, y: 0 } }), { challenge: 'shortest' }).session;
    session = prepareTarget(session, revision).session; let r = { session };
    for (const action of ['D', 'R', 'R', 'U']) r = command(r, action);
    assertEq(r.board.status, 'won'); assertEq(r.info.goal.met, false); assertEq(r.info.goal.stepsSinceStart, 4);
    r = command(r, { type: 'restart' }); r = command(r, 'R'); r = command(r, 'R'); assertEq(r.info.goal.met, true);
});
test('存档挑战目标为剩余步数，回退到起点之前不能套用该目标', () => {
    const map = code(makeMap({ endPos: { x: 3, y: 0 } })), data = DataSerializer.loadFromShareCode(map).data.mapData;
    const save = ReplaySerializer.generateShareCode(data, ['R']).code;
    let r = api.start({ source: `https://ghostmaze.novic.cc/?map=${map}&save=${save}`, challenge: 'shortest' });
    r.session = prepareTarget(r.session, revision).session; assertEq(r.session.target.steps, 2);
    r = command(r, { type: 'undo' }); assertEq(r.info.goal.eligible, false);
    r = command(r, { type: 'restart' }); r = command(r, 'R'); r = command(r, 'R'); assertEq(r.info.goal.met, true);
});
test('证明无解与预算未知分开，普通试玩不接受目标查询', () => {
    let m = makeMap(); m.vWalls[0][1] = { type: 1 }; m.hWalls[1][0] = { type: 1 };
    let session = start(m, { challenge: 'shortest' }).session;
    assertEq(prepareTarget(session, revision).target.status, 'proven_unsat');
    session = start(makeMap(), { challenge: 'shortest' }).session;
    const unknown = prepareTarget(session, revision, { stateBudget: 1 }).target;
    assertEq(unknown.status, 'unknown'); assertEq(unknown.steps, null);
    fail(() => prepareTarget(start().session, revision));
});
test('已在出口的零步最优正确处理', () => {
    const session = start(makeMap({ endPos: { x: 0, y: 0 } }), { challenge: 'shortest' }).session;
    const prepared = prepareTarget(session, revision); assertEq(prepared.target.steps, 0); assertEq(api.observe(prepared.session).info.goal.met, true);
});
test('导出回放在正式本体重放到相同胜利状态', () => {
    let r = start(makeMap({ endPos: { x: 2, y: 0 } })); r = command(r, 'R'); r = command(r, 'R');
    const record = api.export(r.session), url = new URL(record.currentReplay), map = DataSerializer.loadFromShareCode(url.searchParams.get('map')).data.mapData;
    const actions = ReplaySerializer.loadFromShareCode(map, url.searchParams.get('replay')).actions;
    const history = new ActionHistory(new MapDefinition(map), actions); assertEq(history.stateAt(actions.length).isWon, true);
    assertEq(url.origin, 'https://ghostmaze.novic.cc');
});
test('纯JS包在无Node/DOM/网络/Base64/克隆内建的沙箱中运行且可恢复', () => {
    const text = readFileSync(new URL('../.agents/skills/ghostmaze-playtest/assets/playtest.js', import.meta.url), 'utf8');
    const context = {}; const isolated = runInNewContext(text, context);
    assertEq(context.document, undefined); assertEq(context.process, undefined); assertEq(context.fetch, undefined);
    const first = isolated.start({ source: code(makeMap()), rules: 'discover' });
    const moved = isolated.command(first.session, 'R'), token = isolated.save(moved.session);
    const fresh = runInNewContext(text, {}); assertDeepEq(fresh.restore(token).board, moved.board);
    assertEq(fresh.restore(token).info.canUndo, true);
});
test('运行说明中的间接求值装载返回真实API，注释不导致空返回', () => {
    const source = readFileSync(new URL('../.agents/skills/ghostmaze-playtest/assets/playtest.js', import.meta.url), 'utf8');
    const loaded = runInNewContext('(0,eval)(source)', { source });
    assertEq(typeof loaded.start, 'function'); assertEq(loaded.engine, revision);
});
summary();
