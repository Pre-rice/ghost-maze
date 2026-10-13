import test from 'node:test';
import assert from 'node:assert/strict';
import { makeMap } from './helpers/map-fixture.mjs';
import { createSearchEnvironment } from '../src/solver/searchEnvironment.js';
import { createBreadthFirstSearch } from '../src/solver/breadthFirst.js';

const budget = { nodeBudget: 10000, stateBudget: 10000, budgetMs: 60000 };
const searchMap = map => {
    const env = createSearchEnvironment(map), search = createBreadthFirstSearch(env, { allOptimal: true });
    return { env, search, result: search.run(budget) };
};
function verify(env, route) {
    let state = env.initialState();
    for (const action of route) { const next = env.step(state, action); assert.notEqual(next, state); assert(!next.isDead); state = next; }
    assert(state.isWon);
}
test('最短路线汇合后仍保留全部六条最优路径，不加入绕行', () => {
    const { env, search, result } = searchMap(makeMap({ endPos: { x: 2, y: 2 } }));
    assert.equal(result.totalActions, 4); assert.equal(search.routeCount(), 6n);
    const routes = [...search.routes()]; assert.equal(new Set(routes.map(r => r.join(','))).size, 6);
    for (const route of routes) { assert.equal(route.length, 4); verify(env, route); }
});
test('首个目标之后继续收集不同资源终局的同长最优解', () => {
    const { search, result } = searchMap(makeMap({ endPos: { x: 2, y: 2 }, items: [{ x: 1, y: 0, type: 'key' }] }));
    assert.equal(result.totalActions, 4); assert.equal(search.routeCount(), 6n);
});
test('预算暂停可从半展开节点继续，不丢并列路径或误报无解', () => {
    const env = createSearchEnvironment(makeMap({ endPos: { x: 2, y: 2 } }));
    const search = createBreadthFirstSearch(env, { allOptimal: true });
    assert.equal(search.run({ ...budget, stateBudget: 2 }).status, 'unknown');
    assert.equal(search.run(budget).status, 'solved'); assert.equal(search.routeCount(), 6n);
    assert.equal(search.run(budget).status, 'solved');
});
test('开放大区域的数千条最优解可逐条枚举，计数精确', () => {
    const { env, search, result } = searchMap(makeMap());
    assert.equal(result.totalActions, 14); assert.equal(search.routeCount(), 3432n);
    let count = 0; for (const route of search.routes()) { verify(env, route); count++; }
    assert.equal(count, 3432);
});
test('不可达终点穷尽才报无解；初态通关提供一条零步路线', () => {
    const activeCells = Array.from({ length: 8 }, () => Array(8).fill(false)); activeCells[0][0] = activeCells[2][2] = true;
    const isolated = searchMap(makeMap({ activeCells, endPos: { x: 2, y: 2 } }));
    assert.equal(isolated.result.status, 'proven_unsat'); assert.equal(isolated.search.routeCount(), 0n);
    const won = searchMap(makeMap({ endPos: { x: 0, y: 0 } }));
    assert.equal(won.result.totalActions, 0); assert.deepEqual([...won.search.routes()], [[]]);
});
test('探索求解不会把死亡与复活当作捷径', () => {
    const activeCells = Array.from({ length: 8 }, () => Array(8).fill(false));
    for (let x = 0; x < 3; x++) activeCells[0][x] = true;
    const { result } = searchMap(makeMap({ activeCells, endPos: { x: 2, y: 0 }, initialGhosts: [{ x: 1, y: 0, id: 0 }] }));
    assert.equal(result.status, 'proven_unsat');
});
