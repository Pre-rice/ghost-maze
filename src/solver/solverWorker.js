import '../vendor/pako.js';
import { createBreadthFirstSearch } from './breadthFirst.js';
import { createSearchEnvironment } from './searchEnvironment.js';
import { ReplaySerializer } from '../core/replaySerializer.js';

// 压缩协议共用本地 pako；工作线程不引入页面或第二套规则。
globalThis.window = { pako: globalThis.pako };
let search, env, mapData, routes, running = false, allowance, increment, skip = 0;
const reportError = error => { running = false; postMessage({ type: 'error', message: error.message }); };
function emitRoutes() {
    try {
        const codes = [];
        for (let i = 0; i < 200; i++) {
            const route = routes.next();
            if (route.done) { postMessage({ type: 'routes', codes, complete: true }); return; }
            // 独立重放每条枚举结果；不是只相信搜索节点或编码成功。
            let state = env.initialState();
            for (const action of route.value) {
                const next = env.step(state, action);
                if (next === state || next.isDead) throw new Error('求解路线验证失败');
                state = next;
            }
            if (!state.isWon) throw new Error('求解路线未通关');
            const encoded = ReplaySerializer.generateShareCode(mapData, route.value);
            if (!encoded.success) throw new Error(encoded.error);
            codes.push(encoded.code);
        }
        postMessage({ type: 'routes', codes, complete: false });
    } catch (error) { reportError(error); }
}
function advance() {
    if (!running) return;
    try {
        const result = search.run({ nodeBudget: allowance, stateBudget: allowance, budgetMs: 200 });
        if (result.status === 'unknown') {
            if (result.reason === 'time_budget') { setTimeout(advance, 0); return; }
            running = false; postMessage({ type: 'unknown' }); return;
        }
        running = false;
        if (result.status === 'proven_unsat') { postMessage({ type: 'unsat' }); return; }
        postMessage({ type: 'solved', steps: result.totalActions, count: search.routeCount().toString() });
        routes = search.routes();
        while (skip-- > 0 && !routes.next().done) { /* 恢复编辑器返回后的列表位置。 */ }
        emitRoutes();
    } catch (error) { reportError(error); }
}
onmessage = ({ data }) => {
    try {
        if (data.type === 'start') {
            mapData = data.mapData; env = createSearchEnvironment(mapData);
            // 大地图每个快照更大，按地图大小限制首批工作，避免一次性占满浏览器内存。
            increment = Math.max(1000, Math.min(100000, Math.floor(96 * 1024 * 1024 /
                (env.stateKey(env.initialState()).length * 2 + 4096))));
            allowance = increment;
            search = createBreadthFirstSearch(env, { allOptimal: true }); skip = data.skip ?? 0;
            running = true; advance();
        } else if (data.type === 'continue' && !running && !routes) {
            allowance += increment; running = true; advance();
        } else if (data.type === 'more' && routes) emitRoutes();
    } catch (error) { reportError(error); }
};
