/** 从原参考求解器抽出的 BFS；同一搜索供网站和研究使用，物理行为由传入环境负责。 */
export function createBreadthFirstSearch(env, { allOptimal = false, monitor } = {}) {
    const progress = monitor?.initial() ?? [];
    const keyOf = (state, p) => `${env.stateKey(state)}|monitor:${p.join(',')}`;
    const first = env.initialState();
    const entries = [{ state: first, progress, depth: 0, parents: [] }];
    const visited = new Map([[keyOf(first, progress), 0]]);
    const goals = first.isWon ? [0] : [];
    let head = 0, actionIndex = 0, expanded = 0, transitions = 0, entered = false;
    let goalDepth = first.isWon ? 0 : Infinity, status = first.isWon ? 'solved' : null;
    let reason = first.isWon ? 'goal_reached' : null;
    const snapshot = () => ({ status: status ?? 'unknown', reason, expanded, transitions,
        discovered: entries.length, totalActions: Number.isFinite(goalDepth) ? goalDepth : null });
    const finish = (s, r) => { status = s; reason = r; return snapshot(); };
    return {
        run({ nodeBudget, stateBudget, budgetMs }) {
            if (status) return snapshot();
            const started = performance.now();
            while (head < entries.length) {
                const current = entries[head];
                // 最短目标层的所有入边已收齐，较长路线不再展开。
                if (current.depth >= goalDepth) return finish('solved', 'goal_reached');
                if (performance.now() - started >= budgetMs) { reason = 'time_budget'; return snapshot(); }
                if (!entered) {
                    if (expanded >= nodeBudget) { reason = 'node_budget'; return snapshot(); }
                    expanded++; entered = true;
                }
                while (actionIndex < env.actions.length) {
                    if (performance.now() - started >= budgetMs) { reason = 'time_budget'; return snapshot(); }
                    const action = env.actions[actionIndex];
                    const next = env.step(current.state, action);
                    transitions++;
                    if (next === current.state || next.isDead) { actionIndex++; continue; }
                    const p = monitor ? monitor.advance(current.progress, current.state, action, next) : [];
                    if (p === null) { actionIndex++; continue; }
                    const depth = current.depth + 1, key = keyOf(next, p), found = visited.get(key);
                    if (found !== undefined) {
                        if (allOptimal && entries[found].depth === depth) entries[found].parents.push([head, action]);
                        actionIndex++; continue;
                    }
                    if (entries.length >= stateBudget) { reason = 'state_budget'; return snapshot(); }
                    const index = entries.length;
                    visited.set(key, index);
                    entries.push({ state: next, progress: p, depth, parents: [[head, action]] });
                    actionIndex++;
                    if (next.isWon) {
                        goalDepth = depth; goals.push(index);
                        if (!allOptimal) return finish('solved', 'goal_reached');
                    }
                }
                current.state = null; current.progress = null;
                head++; actionIndex = 0; entered = false;
            }
            return goals.length ? finish('solved', 'goal_reached') : finish('proven_unsat', 'frontier_exhausted');
        },
        firstActions() {
            if (status !== 'solved') return null;
            const actions = [];
            for (let index = goals[0]; entries[index].parents.length;) {
                const [parent, action] = entries[index].parents[0]; actions.push(action); index = parent;
            }
            return actions.reverse();
        },
        routeCount() {
            if (status !== 'solved') return 0n;
            const counts = [1n];
            for (let i = 1; i < entries.length; i++) counts[i] = entries[i].parents.reduce((n, [parent]) => n + counts[parent], 0n);
            return goals.reduce((n, goal) => n + counts[goal], 0n);
        },
        *routes() {
            if (status !== 'solved') return;
            // 父边组成严格降深度的 DAG；逐条枚举，避免指数数量的路线常驻内存。
            for (const goal of goals) {
                const stack = [{ index: goal, cursor: 0 }], reversed = [];
                while (stack.length) {
                    const frame = stack.at(-1), parents = entries[frame.index].parents;
                    if (!parents.length) {
                        yield reversed.slice().reverse(); stack.pop(); if (stack.length) reversed.pop();
                    } else if (frame.cursor === parents.length) {
                        stack.pop(); if (stack.length) reversed.pop();
                    } else {
                        const [index, action] = parents[frame.cursor++]; reversed.push(action); stack.push({ index, cursor: 0 });
                    }
                }
            }
        }
    };
}
