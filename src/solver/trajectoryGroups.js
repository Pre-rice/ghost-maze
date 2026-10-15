/** 可见鬼位逐步比较；停顿保留，列表顺序与内部编号不参与。 */
export const ghostFrame = state => JSON.stringify(state.layerStates.map(layer =>
    layer.ghosts.map(g => [g.x, g.y]).sort((a, b) => a[0] - b[0] || a[1] - b[1])));

/** 在最短前继图上合并相同轨迹前缀，不枚举玩家赶路的笛卡尔积。 */
export function createTrajectoryGroups({ entries, goals }) {
    const useful = new Set(goals), stack = [...goals];
    while (stack.length) for (const [parent] of entries[stack.pop()].parents) if (!useful.has(parent)) { useful.add(parent); stack.push(parent); }
    const order = [...useful].sort((a, b) => entries[a].depth - entries[b].depth || a - b);
    const groups = entries.map(() => null), prefixes = new Map(), representatives = new Map();
    groups[0] = new Map([[0, null]]);
    let cursor = 0, parentCursor = 0, sourceCursor = 0, sourcePairs = null, nextPrefix = 1, assigned = 1, complete = false;
    return {
        run({ budgetMs = 200, stateBudget = 100000 } = {}) {
            const started = performance.now();
            while (cursor < order.length) {
                const index = order[cursor], entry = entries[index];
                if (index === 0) { cursor++; continue; }
                groups[index] ??= new Map();
                while (parentCursor < entry.parents.length) {
                    const [parent, action] = entry.parents[parentCursor];
                    sourcePairs ??= [...groups[parent].keys()];
                    while (sourceCursor < sourcePairs.length) {
                        if (performance.now() - started >= budgetMs) return { status: 'unknown', reason: 'time_budget' };
                        const source = sourcePairs[sourceCursor], key = source + ':' + entry.label;
                        const existing = prefixes.get(key), id = existing ?? nextPrefix;
                        if (!groups[index].has(id)) {
                            if (assigned >= stateBudget) return { status: 'unknown', reason: 'state_budget' };
                            if (existing === undefined) { prefixes.set(key, id); nextPrefix++; }
                            groups[index].set(id, { parent, source, action }); assigned++;
                        }
                        sourceCursor++;
                    }
                    sourcePairs = null; sourceCursor = 0; parentCursor++;
                }
                cursor++; parentCursor = 0;
            }
            if (!complete) for (const goal of goals) for (const id of groups[goal].keys()) if (!representatives.has(id)) representatives.set(id, goal);
            complete = true;
            return { status: 'solved', count: String(representatives.size), prefixes: nextPrefix, assigned };
        },
        *routes() {
            if (!complete) throw new Error('鬼轨迹归并尚未完成');
            for (const [id, goal] of representatives) {
                const actions = []; let current = goal, prefix = id;
                while (current !== 0) { const edge = groups[current].get(prefix); actions.push(edge.action); current = edge.parent; prefix = edge.source; }
                yield actions.reverse();
            }
        }
    };
}
