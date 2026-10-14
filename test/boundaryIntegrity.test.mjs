import assert from 'node:assert/strict';
import {test,suite,summary} from './_assert.mjs';
import {installBrowserEnv} from './helpers/browser-env.mjs';
import {makeMap} from './helpers/map-fixture.mjs';
import {WALL_TYPES as W} from '../src/core/constants.js';
import {normalizeMapData,validateMapData} from '../src/core/mapDataUtils.js';
import {DataSerializer,encodeMapContent} from '../src/core/dataSerializer.js';
import {toBase64} from '../src/core/binaryCodec.js';
import {MapDefinition} from '../src/core/mapDefinition.js';
import {EditorDocument} from '../src/editor/editorSession.js';
installBrowserEnv();suite('boundaryIntegrity');
const special=type=>({type,keys:3,...(type===W.ONE_WAY?{direction:{dx:1,dy:0}}:{}),...(type===W.LETTER_DOOR?{letter:'A',initialState:'open'}:{})});

test('外圈、活动区与虚空接壤、两侧虚空都拒绝门和玻璃；导出与解码同样拒绝',()=>{
 for(const type of[W.DOOR,W.LOCKED,W.ONE_WAY,W.GLASS,W.LETTER_DOOR])for(const[axis,x,y,voids]of[['h',2,0,[]],['v',0,2,[]],['h',2,3,[[2,2]]],['v',3,2,[[2,2]]],['h',2,3,[[2,2],[2,3]]]]){
  const map=normalizeMapData(makeMap());for(const[vx,vy]of voids)map.layers[0].activeCells[vy][vx]=false;map.layers[0][axis+'Walls'][y][x]=special(type);
  const checked=validateMapData(map);assert(!checked.valid);assert.match(checked.error,/边界必须是墙/);assert(!DataSerializer.generateShareCode(map).success);
  const code=toBase64(Uint8Array.of(0,...encodeMapContent(map)));assert(!DataSerializer.loadFromShareCode(code).success);
 }
});

test('合法0门、字母门、玻璃与边界按钮保持可用',()=>{
 const map=normalizeMapData(makeMap());map.layers[0].hWalls[2][2]={type:W.LOCKED,keys:0};map.layers[0].vWalls[3][3]={type:W.LETTER_DOOR,letter:'A',initialState:'open'};map.layers[0].hWalls[4][4]={type:W.GLASS};map.layers[0].buttons=[{x:0,y:0,direction:{dx:0,dy:-1},letter:'A'}];assert(validateMapData(map).valid);assert(DataSerializer.generateShareCode(map).success);
});

test('静态装配清除边界门参数，内部机关不变且不污染原图',()=>{
 const source=normalizeMapData(makeMap());source.layers[0].vWalls[2][0]=special(W.LETTER_DOOR);source.layers[0].vWalls[2][2]=special(W.LETTER_DOOR);const def=new MapDefinition(source);
 assert.deepEqual(def.layers[0].initialWalls.v[2][0],{type:W.SOLID,keys:0});assert.equal(def.layers[0].initialWalls.v[2][2].letter,'A');assert.equal(def.letterWalls.get('A').length,1);assert.equal(source.layers[0].vWalls[2][0].type,W.LETTER_DOOR);
});

test('边界约束逐层检查，不仅限第零层',()=>{
 const first=normalizeMapData(makeMap()).layers[0],second=structuredClone(first);second.customStartPos=null;second.hWalls[0][2]=special(W.LOCKED);assert(!validateMapData({width:8,height:8,editorMode:'free',gameMode:'death-loop',initialHealth:5,layerCount:2,layers:[first,second],stairs:[]}).valid);
});

test('编辑器墙工具不得改边界，也不能清掉边界按钮；删格后不遗留门',()=>{
 const doc=EditorDocument.blank(8,8,'free');doc.customStartPos={x:1,y:1};doc.endPos={x:7,y:7};doc.buttons=[{x:2,y:0,direction:{dx:0,dy:-1},letter:'A'}];const edge={type:'h',x:2,y:0},before=structuredClone(doc.hWalls[0][2]);
 for(const change of[()=>doc.toggleWall(edge),()=>doc.setWall(edge,W.GLASS),()=>doc.toggleDoor(edge),()=>doc.setLocked(edge,3),()=>doc.toggleLetterDoor(edge,'A'),()=>doc.setOneWay(edge,{dx:0,dy:1})]){change();assert.deepEqual(doc.hWalls[0][2],before);assert.equal(doc.buttons.length,1);}
 doc.setLocked({type:'h',x:3,y:3},2);assert.equal(doc.hWalls[3][3].type,W.LOCKED);doc.toggleActiveCell(3,2,'remove');assert.equal(doc.hWalls[3][3].type,W.EMPTY);doc.setLocked({type:'h',x:3,y:3},2);assert.equal(doc.hWalls[3][3].type,W.EMPTY);assert(validateMapData(doc.toMapData()).valid);
});
summary();
