import assert from 'node:assert/strict';
import {
    suite,test,summary
} from './_assert.mjs';
import {
    installBrowserEnv
} from './helpers/browser-env.mjs';
import {
    makeMap
} from './helpers/map-fixture.mjs';
import {
    DataSerializer
} from '../src/core/dataSerializer.js';
import {
    normalizeMapData
} from '../src/core/mapDataUtils.js';
import {
    createBreadthFirstSearch
} from '../src/solver/breadthFirst.js';
import {
    createOptimalSearch
} from '../src/solver/optimalSearch.js';
import {
    createSearchEnvironment
} from '../src/solver/searchEnvironment.js';
import {
    ghostFrame,createTrajectoryGroups
} from '../src/solver/trajectoryGroups.js';
import {
    aiMaps
} from '../src/maps/ai-gallery.js';
installBrowserEnv();
suite('trajectoryGroups');
const budget={
    nodeBudget:1000000,stateBudget:1000000,budgetMs:30000
};
test('开阔20×20的353亿最短走法直接归并为一条，A*仍证明38步',()=>{
    const map=normalizeMapData(makeMap({
        width:20,height:20,gameMode:'death-loop'
    })),env=createSearchEnvironment(map),baseline=createBreadthFirstSearch(env,{
        allOptimal:true
    });assert.equal(baseline.run(budget).totalActions,38);assert.equal(baseline.routeCount(),35345263800n);const search=createOptimalSearch(env,{
        classifyState:ghostFrame
    });assert.equal(search.run(budget).totalActions,38);const groups=createTrajectoryGroups(search.optimalGraph());assert.equal(groups.run({
        stateBudget:2000,budgetMs:10000
    }).count,'1');const [route]=[...groups.routes()];let s=env.initialState();for(const a of route)s=env.step(s,a);assert(s.isWon);
});
test('十三图逐步轨迹数与独立逐条重放归并一致；全部代表解保持最优',()=>{
    for(const row of aiMaps){
        const env=createSearchEnvironment(DataSerializer.loadFromShareCode(row.mapCode).data.mapData),base=createBreadthFirstSearch(env,{
            allOptimal:true
        }),a=base.run(budget),expected=new Set();for(const route of base.routes()){
            let s=env.initialState();const frames=[];for(const action of route){
                s=env.step(s,action);frames.push(ghostFrame(s));
            }expected.add(frames.join(';'));
        }const search=createOptimalSearch(env,{
            algorithm:'astar',classifyState:ghostFrame
        }),b=search.run(budget);assert.equal(b.totalActions,a.totalActions,row.title);const groups=createTrajectoryGroups(search.optimalGraph());assert.equal(Number(groups.run({
            stateBudget:1000000,budgetMs:30000
        }).count),expected.size,row.title);for(const route of groups.routes()){
            assert.equal(route.length,a.totalActions);let s=env.initialState();const frames=[];for(const action of route){
                s=env.step(s,action);assert(!s.isDead);frames.push(ghostFrame(s));
            }assert(s.isWon);assert(expected.has(frames.join(';')));
        }
    }
});
test('归途保留什么时候动和停，三个节奏不能合成一种',()=>{
    const row=aiMaps.find(r=>r.title==='归途'),env=createSearchEnvironment(DataSerializer.loadFromShareCode(row.mapCode).data.mapData),search=createOptimalSearch(env,{
        classifyState:ghostFrame
    });search.run(budget);const grouping=createTrajectoryGroups(search.optimalGraph());assert.equal(grouping.run({
        stateBudget:1,budgetMs:1000
    }).status,'unknown');assert.equal(grouping.run({
        stateBudget:100000,budgetMs:10000
    }).count,'3');assert.equal([...grouping.routes()].length,3);
});
test('无解与预算中断不同；不把未知称最优',()=>{
    const map=normalizeMapData(makeMap());map.layers[0].activeCells=map.layers[0].activeCells.map(row=>row.map(()=>false));map.layers[0].activeCells[0][0]=map.layers[0].activeCells[7][7]=true;const env=createSearchEnvironment(map),search=createOptimalSearch(env,{
        algorithm:'astar',classifyState:ghostFrame
    });assert.equal(search.run(budget).status,'proven_unsat');const open=createOptimalSearch(createSearchEnvironment(normalizeMapData(makeMap())),{
        algorithm:'astar'
    });assert.equal(open.run({
        ...budget,nodeBudget:0
    }).status,'unknown');assert.throws(()=>open.optimalGraph());assert.equal(open.run(budget).totalActions,14);
});
test('无鬼时只需第一条已证明最优的路线即可代表唯一轨迹，减少开阔空间探索',()=>{
    const env=createSearchEnvironment(normalizeMapData(makeMap({
        width:20,height:20
    }))),search=createOptimalSearch(env,{
        classifyState:ghostFrame,firstOptimalOnly:true
    }),result=search.run(budget);assert.equal(result.totalActions,38);assert(result.expanded<100);const groups=createTrajectoryGroups(search.optimalGraph());assert.equal(groups.run({
        stateBudget:2000,budgetMs:10000
    }).count,'1');
});
summary();
