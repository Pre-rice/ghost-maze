import assert from 'node:assert/strict';
import {
    suite,test,summary
} from './_assert.mjs';
import {
    makeMap
} from './helpers/map-fixture.mjs';
import {
    normalizeMapData,validateMapData
} from '../src/core/mapDataUtils.js';
import {
    EditorWorkspace,mapBounds
} from '../src/editor/workspace.js';
import {MapDefinition} from '../src/core/mapDefinition.js';
import {GameLogic} from '../src/core/gameLogic.js';
import {DataSerializer} from '../src/core/dataSerializer.js';
import {installBrowserEnv} from './helpers/browser-env.mjs';
installBrowserEnv();
suite('editorWorkspace');
test('真实5×7小图按包络装载；扩展保留全部原格、出生、门和元件，撤销恢复',()=>{
    const map=normalizeMapData(makeMap());map.layers[0].activeCells=map.layers[0].activeCells.map((row,y)=>row.map((_,x)=>x>=1&&x<=5&&y<7));map.layers[0].customStartPos={
        x:1,y:6
    };map.layers[0].endPos={
        x:5,y:0
    };map.layers[0].ghosts=[{
        x:3,y:3,id:0
    }];map.layers[0].vWalls[4][3]={
        type:6,keys:0,letter:'A',initialState:'closed'
    };const ws=new EditorWorkspace(map);assert.deepEqual(ws.frame,{
        x:1,y:0,width:5,height:7
    });const before=ws.snapshot();ws.apply(()=>ws.resize(7,9));assert.equal(ws.doc.toMapData().layers[0].vWalls[4][3].letter,'A');assert.deepEqual(ws.doc.customStartPos,{
        x:1,y:6
    });assert.equal(ws.doc.ghosts.length,1);assert(ws.undo());assert.deepEqual(ws.snapshot(),before);assert(ws.redo());assert.equal(ws.frame.height,9);
});
test('裁切先给损失数量，保留范围内元件，不能留下边界门；可撤销',()=>{
    const map=normalizeMapData(makeMap());map.layers[0].vWalls[3][5]={
        type:3,keys:0
    };const ws=new EditorWorkspace(map);assert(ws.resizeLoss(5,8).cells>0);ws.apply(()=>ws.resize(5,8));assert.equal(ws.doc.vWalls[3][5].type,1);assert.equal(ws.doc.endPos,null);ws.undo();assert.equal(ws.doc.endPos.x,7);
});
test('整体移动跨层同步楼梯与出生；取消、撤销和重做保留作品',()=>{
    const map=normalizeMapData(makeMap());map.layers[0].activeCells=map.layers[0].activeCells.map((r,y)=>r.map((_,x)=>x>=2&&x<=4&&y>=2&&y<=4));map.layers[0].customStartPos={
        x:2,y:2
    };map.layers[0].endPos={
        x:4,y:4
    };const upper=structuredClone(map.layers[0]);upper.customStartPos=null;map.layers.push(upper);map.layerCount=2;map.multiLayerMode=true;map.stairs=[{
        x:3,y:3,layer:0,direction:'up'
    },{
        x:3,y:3,layer:1,direction:'down'
    }];const ws=new EditorWorkspace(map),old=ws.snapshot();ws.apply(()=>ws.moveRegion(ws.frame,1,-1,{
        allLayers:true
    }));assert.deepEqual(ws.doc.toMapData().stairs.map(s=>[s.x,s.y]),[[4,2],[4,2]]);assert(validateMapData(ws.doc.toMapData()).valid);ws.undo();assert.deepEqual(ws.snapshot(),old);ws.begin();ws.doc.endPos=null;ws.cancel();assert.deepEqual(ws.snapshot(),old);
});
test('区域移动不能覆盖未选区域，旧常规图无效操作不会自动改码',()=>{
    const map=normalizeMapData(makeMap({
        editorMode:'regular'
    })),ws=new EditorWorkspace(map);ws.begin();assert.equal(ws.commit(),false);assert.equal(ws.doc.mode,'regular');const before=ws.snapshot();assert.throws(()=>ws.apply(()=>ws.moveRegion({
        x:0,y:0,width:2,height:2
    },2,0)),/目标区域已有/);assert.deepEqual(ws.snapshot(),before);
});
test('经典出生房间普通编辑后仍完整可见，改出生或隔断后不套用旧房间',()=>{
    const ws=new EditorWorkspace(normalizeMapData(makeMap({editorMode:'regular',customStartPos:{x:1,y:6}})));
    ws.apply(()=>ws.doc.items.push({x:4,y:4,type:'key'}));
    const code=DataSerializer.generateShareCode(ws.doc.toMapData());assert(code.success);
    const data=DataSerializer.loadFromShareCode(code.code).data.mapData;assert.equal(data.editorMode,'regular');
    const state=GameLogic.createInitialState(new MapDefinition(data));assert(state.seenCells[0].slice(5,8).every(row=>row.slice(0,3).every(Boolean)));
    ws.apply(()=>{ws.doc.customStartPos={x:4,y:4};});assert.equal(ws.doc.toMapData().editorMode,'free');ws.undo();assert.equal(ws.doc.toMapData().editorMode,'regular');
    ws.apply(()=>{ws.doc.hWalls[6][0]={type:1,keys:0};});assert.equal(ws.doc.toMapData().editorMode,'free');ws.undo();assert.equal(ws.doc.toMapData().editorMode,'regular');
});
summary();
