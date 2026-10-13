import { test, suite, summary, assert, assertEq, assertDeepEq } from './_assert.mjs';
import { makeMap } from './helpers/map-fixture.mjs';
import { validateMapData } from '../src/core/mapDataUtils.js';
import { MapDefinition } from '../src/core/mapDefinition.js';
import { GameLogic } from '../src/core/gameLogic.js';
import { WALL_TYPES as W } from '../src/core/constants.js';

suite('visibility');
const cells = [[1,3],[1,2],[2,2],[3,2],[4,2],[4,3],[5,3]];
const build = (transform = p => p, fillGap = false) => {
    const point = ([x,y]) => transform({x,y});
    const map = makeMap({ editorMode:'free', customStartPos:point([4,3]), endPos:point([4,2]),
        initialGhosts:[point([1,3])], activeCells:Array.from({length:8},()=>Array(8).fill(false)) });
    for(const p of [...cells,...(fillGap?[[2,3],[3,3]]:[])].map(point))map.activeCells[p.y][p.x]=true;
    const checked=validateMapData(map);assert(checked.valid,checked.error);
    return new MapDefinition(checked.mapData);
};
const sees = (def,state,g,p) => GameLogic._canGhostSeePlayer(g,p,def.layers[0],state.layerStates[0]);

test('合法空墙边界不能让鬼透过虚空看到玩家，且不绕回廊隔空追击', () => {
    const def=build(),first=GameLogic.createInitialState(def),g=first.layerStates[0].ghosts[0];
    assert(!first.seenCells[0][g.y][g.x]); assert(!sees(def,first,g,first.player));
    const next=GameLogic.calculateNextState(first,{type:'MOVE',payload:{dx:1,dy:0}},def);
    assertDeepEq(next.layerStates[0].ghosts.map(g=>[g.x,g.y]),[[1,3]]);
    assert(!next.isDead);
});

test('虚空遮挡在四个射线方向一致，不依赖地图朝向', () => {
    for(let turns=0;turns<4;turns++) {
        const rotate = p => { let {x,y}=p;for(let i=0;i<turns;i++)[x,y]=[7-y,x];return {x,y}; };
        const def=build(rotate),s=GameLogic.createInitialState(def),g=s.layerStates[0].ghosts[0];
        assert(!sees(def,s,g,s.player)); assert(!sees(def,s,s.player,g));
    }
});

test('把间隔补成活动通道后双方互见，鬼恢复直线追击', () => {
    const def=build(p=>p,true),s=GameLogic.createInitialState(def),g=s.layerStates[0].ghosts[0];
    assert(s.seenCells[0][g.y][g.x]);assert(sees(def,s,g,s.player));
    const next=GameLogic.calculateNextState(s,{type:'MOVE',payload:{dx:1,dy:0}},def);
    assertDeepEq(next.layerStates[0].ghosts.map(g=>[g.x,g.y]),[[2,3]]);
});

test('玻璃仍让双方互见，只修正虚空，不改变已有玻璃视线', () => {
    const def=build(p=>p,true),s=GameLogic.createInitialState(def);
    s.setWall(0,'v',3,3,{type:W.GLASS});GameLogic.updateVisibility(s,def);
    const g=s.layerStates[0].ghosts[0];assert(s.seenCells[0][g.y][g.x]);assert(sees(def,s,g,s.player));
});

summary();
