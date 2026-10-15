import { test, suite, summary, assertDeepEq, assertEq } from './_assert.mjs';
import { drawCorners, drawEditor } from '../src/view/renderer.js';
import { WALL_TYPES as W, GAME_STATES } from '../src/core/constants.js';

suite('renderer');
const view = () => ({ width: 3, height: 3, cellSize: 20, colors: { wall: '#888' }, state: GAME_STATES.PLAYING,
    hWalls: Array.from({length:4},()=>Array.from({length:3},()=>({type:W.EMPTY}))),
    vWalls: Array.from({length:3},()=>Array.from({length:4},()=>({type:W.EMPTY}))),
    activeCells: Array.from({length:3},()=>Array(3).fill(true)), seenCells: Array.from({length:3},()=>Array(3).fill(true)),
    debugVision: true, editor: {mode:'free'} });
const corners = (v, editor = false) => { const fills=[]; drawCorners({fillRect:(x,y,w)=>fills.push([(x+w/2)/v.cellSize,(y+w/2)/v.cellSize])},v,editor); return fills; };
const atCenter = (v, editor=false) => corners(v,editor).some(([x,y])=>x===1&&y===1);

test('虚空中的墙数据不产生补角，游戏和编辑器均保持空白',()=>{
    const v=view();v.activeCells.forEach(row=>row.fill(false));
    for(const rows of [v.hWalls,v.vWalls])for(const row of rows)for(const wall of row)wall.type=W.SOLID;
    assertDeepEq(corners(v),[]);assertDeepEq(corners(v,true),[]);
});
test('活动孤岛只在真实边界转角补块，外围格点没有散落方块',()=>{
    const v=view();v.activeCells.forEach(row=>row.fill(false));v.activeCells[1][1]=true;
    for(const rows of [v.hWalls,v.vWalls])for(const row of rows)for(const wall of row)wall.type=W.SOLID;
    assertDeepEq(corners(v),[[1,1],[2,1],[1,2],[2,2]]);
    assertDeepEq(corners(v,true),[[1,1],[2,1],[1,2],[2,2]]);
    for(const rows of [v.hWalls,v.vWalls])for(const row of rows)for(const wall of row)wall.type=W.EMPTY;
    assertDeepEq(corners(v),[[1,1],[2,1],[1,2],[2,2]]);
});
test('字母门打开后不留补角；编辑器使用初始门态，游戏使用当前门态',()=>{
    const v=view();v.hWalls[1][1]={type:W.SOLID};
    v.vWalls[1][1]={type:W.LETTER_DOOR,initialState:'closed',currentState:'closed'};
    assertEq(atCenter(v),true);v.vWalls[1][1].currentState='open';assertEq(atCenter(v),false);
    assertEq(atCenter(v,true),true);v.vWalls[1][1].initialState='open';assertEq(atCenter(v,true),false);
});
test('直线接缝和玻璃装饰不产生转角补块',()=>{
    const v=view();v.hWalls[1][0]={type:W.SOLID};v.hWalls[1][1]={type:W.SOLID};assertEq(atCenter(v),false);
    v.hWalls[1][0]={type:W.EMPTY};v.hWalls[1][1]={type:W.GLASS};v.vWalls[1][1]={type:W.SOLID};assertEq(atCenter(v),false);
});
test('迷雾中未绘出的内墙不泄露补角；已探索和编辑器显示真实转角',()=>{
    const v=view();v.debugVision=false;v.seenCells.forEach(row=>row.fill(false));
    v.hWalls[1][1]={type:W.SOLID};v.vWalls[1][1]={type:W.SOLID};assertEq(atCenter(v),false);assertEq(atCenter(v,true),true);
    v.seenCells[1][1]=true;assertEq(atCenter(v),true);
});
test('编辑鼠标越过地图四边时不越界，绘制坐标不残留偏移',()=>{
    let depth=0;
    const ctx=new Proxy({canvas:{width:200,height:200},save(){depth++},restore(){depth--}},{get(target,key){return key in target?target[key]:()=>{};}});
    const v={...view(),workspaceFrame:{x:0,y:0,width:3,height:3},offsetX:30,offsetY:24,stairs:[],ghosts:[],items:[],buttons:[]};
    for(const hoveredWall of [{type:'v',x:1,y:-1},{type:'v',x:1,y:3},{type:'h',x:-1,y:1},{type:'h',x:3,y:1},{type:'v',x:1,y:1}]){
        v.editor={mode:'free',tool:'wall',hoveredWall};drawEditor(ctx,v);assertEq(depth,0);
    }
});
summary();
