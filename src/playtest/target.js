import { createBreadthFirstSearch } from '../solver/breadthFirst.js';
import { physicalStateKey } from '../solver/searchEnvironment.js';
import { GameLogic } from '../core/gameLogic.js';
import { actionFromName } from '../core/actions.js';
import { targetOrigin } from './session.js';
import { plainCopy } from './portable.js';

/** 只在起点证明一个整数；不调用路线恢复，也不向试玩者返回搜索过程或候选动作。 */
export function prepareTarget(session, revision, options = {}) {
    const runtime = targetOrigin(session, revision);
    if (session.target?.status === 'solved' || session.target?.status === 'proven_unsat') return { session: plainCopy(session), target: plainCopy(session.target) };
    const positive = (name, fallback, maximum) => {
        const value = options[name] ?? fallback;
        if (!Number.isFinite(value) || value <= 0 || value > maximum) throw new RangeError('目标计算预算无效');
        return value;
    };
    const search = createBreadthFirstSearch({ actions: ['U', 'R', 'D', 'L', 'STAIR'],
        initialState: () => runtime.state,
        step: (state, name) => GameLogic.calculateNextState(state, actionFromName(name), runtime.definition, { trails: false, visibility: false }),
        stateKey: state => physicalStateKey(state) });
    const result = search.run({ nodeBudget: positive('nodeBudget', 100000, 2000000),
        stateBudget: positive('stateBudget', 100000, 2000000), budgetMs: positive('budgetMs', 5000, 30000) });
    const target = { status: result.status, steps: result.status === 'solved' ? result.totalActions : null };
    const updated = plainCopy(session); updated.target = target;
    return { session: updated, target };
}
