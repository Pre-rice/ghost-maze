import {
    createBreadthFirstSearch
} from './breadthFirst.js';
import {
    relaxedDistance
} from './relaxedDistance.js';
/** 可暂停的A*，收齐全部最短前继；物理动作仍由同一GameLogic执行。 */
export function createOptimalSearch(env, {
    classifyState, algorithm = 'auto', firstOptimalOnly = false
} = {
}) {
    const size = env.mapDefinition.layers.reduce((n,l) => n + l.activeCells.flat().filter(Boolean).length, 0);
    if (algorithm === 'bfs' || (algorithm === 'auto' && size < 64)) return createBreadthFirstSearch(env, {
        allOptimal: !firstOptimalOnly, classifyState
    });
    const lower = relaxedDistance(env.mapDefinition), first = env.initialState();
    const entries = [{
        state:first, depth:0, parents:[], label:classifyState?.(first)
    }], visited = new Map([[env.stateKey(first),0]]), heap = [], goals = [];
    let active = null, actionIndex = 0, expanded = 0, transitions = 0, goalDepth = Infinity, status = null, reason = null;
    const before = (a,b) => a.f < b.f || (a.f === b.f && (a.g > b.g || (a.g === b.g && a.index < b.index)));
    const push = node => {
        heap.push(node);
        for(let i=heap.length-1;i>0;) {
            const p=(i-1)>>1;
            if(!before(heap[i],heap[p]))break;
            [heap[i],heap[p]]=[heap[p],heap[i]];
            i=p;
        }
    };
    const pop = () => {
        const result=heap[0],last=heap.pop();
        if(heap.length){
            heap[0]=last;
            for(let i=0;;){
                let best=i;
                for(const child of [i*2+1,i*2+2])if(child<heap.length&&before(heap[child],heap[best]))best=child;
                if(best===i)break;
                [heap[i],heap[best]]=[heap[best],heap[i]];
                i=best;
            }
        }return result;
    };
    const snapshot = () => ({
        status:status??'unknown',reason,expanded,transitions,discovered:entries.length,totalActions:Number.isFinite(goalDepth)?goalDepth:null
    });
    const finish = (s,r) => {
        status=s;
        reason=r;
        return snapshot();
    };
    if(first.isWon){
        goals.push(0);
        goalDepth=0;
        status='solved';
        reason='goal_reached';
    } else if(!Number.isFinite(lower(first))){
        status='proven_unsat';
        reason='relaxed_unreachable';
    } else push({
        index:0,g:0,f:lower(first)
    });
    return {
        run({
            nodeBudget,stateBudget,budgetMs
        }) {
            if(status)return snapshot();
            const started=performance.now();
            while(active||heap.length){
                if(performance.now()-started>=budgetMs){
                    reason='time_budget';
                    return snapshot();
                }                 if(!active){
                    const node=pop(),entry=entries[node.index];
                    if(node.g!==entry.depth)continue;
                    if(node.f>goalDepth)return finish('solved','goal_reached');
                    if(entry.state.isWon){
                        if(entry.depth<goalDepth){
                            goalDepth=entry.depth;
                            goals.length=0;
                        }if(!goals.includes(node.index))goals.push(node.index);
                        if(firstOptimalOnly)return finish('solved','goal_reached');
                        continue;
                    }if(expanded>=nodeBudget){
                        push(node);
                        reason='node_budget';
                        return snapshot();
                    }active=node;
                    actionIndex=0;
                    expanded++;
                }                 const entry=entries[active.index];
                while(actionIndex<env.actions.length){
                    if(performance.now()-started>=budgetMs){
                        reason='time_budget';
                        return snapshot();
                    }                     const action=env.actions[actionIndex],next=env.step(entry.state,action);
                    transitions++;
                    if(next===entry.state||next.isDead){
                        actionIndex++;
                        continue;
                    }                     const depth=entry.depth+1,h=lower(next);
                    if(depth+h>goalDepth||!Number.isFinite(h)){
                        actionIndex++;
                        continue;
                    }                     const key=env.stateKey(next),found=visited.get(key);
                    if(found!==undefined){
                        const old=entries[found];
                        if(depth===old.depth)old.parents.push([active.index,action]);
                        else if(depth<old.depth){
                            old.depth=depth;
                            old.parents=[[active.index,action]];
                            old.state=next;
                            push({
                                index:found,g:depth,f:depth+h
                            });
                        }actionIndex++;
                        continue;
                    }                     if(entries.length>=stateBudget){
                        reason='state_budget';
                        return snapshot();
                    }                     const index=entries.length;
                    entries.push({
                        state:next,depth,parents:[[active.index,action]],label:classifyState?.(next)
                    });
                    visited.set(key,index);
                    push({
                        index,g:depth,f:depth+h
                    });
                    actionIndex++;
                }                 // 一致距离下界保证弹出后的深度不再降低；保留前继即可重建路线。
                entry.state=null;
                active=null;
            }             return finish(goals.length?'solved':'proven_unsat',goals.length?'goal_reached':'frontier_exhausted');
        },         optimalGraph(){
            if(status!=='solved')throw new Error('最优搜索尚未完成');
            return {
                entries,goals
            };
        }
    };
}
