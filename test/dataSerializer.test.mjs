import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { installBrowserEnv } from './helpers/browser-env.mjs';
import { makeMap } from './helpers/map-fixture.mjs';
import { test, suite, summary, assert, assertEq, assertDeepEq } from './_assert.mjs';
import { DataSerializer, encodeMapContent } from '../src/core/dataSerializer.js';
import { normalizeMapData, validateMapData } from '../src/core/mapDataUtils.js';
import { fromBase64, toBase64, unpack } from '../src/core/binaryCodec.js';
installBrowserEnv();
suite('dataSerializer');
const golden = JSON.parse(readFileSync(new URL('./golden/maps.json', import.meta.url), 'utf8'));
const browserPako = runInNewContext(readFileSync(new URL('../src/vendor/pako.js', import.meta.url), 'utf8') + '; pako;', {});
function roundTrip(map) {
    const encoded = DataSerializer.generateShareCode(map); assert(encoded.success, encoded.error);
    const decoded = DataSerializer.loadFromShareCode(encoded.code); assert(decoded.success, decoded.error);
    assertDeepEq(decoded.data.mapData, normalizeMapData(map)); return { encoded, decoded };
}
for (const [name, entry] of Object.entries(golden)) test(name + '：新码、唯一层数据、URL 与稳定重编码', () => {
    const result = roundTrip(entry.canonical);
    assertEq(result.encoded.code, entry.code);
    assertDeepEq(DataSerializer.loadFromShareCode(entry.code).data.mapData, entry.canonical);
    assert(entry.code.length <= 100, '地图码没有膨胀');
    const url = new URL('https://ghostmaze.novic.cc/'); url.searchParams.set('map', entry.code);
    assertEq(url.searchParams.get('map'), entry.code); assert(/^[\w-]+$/.test(entry.code));
    assertEq(result.decoded.data.initialStamina, undefined);
    assertEq(result.decoded.data.mapData.hWalls, undefined);
});
const full = makeMap({ initialHealth: 256 });
full.hWalls[0][0] = { type: 1 }; full.hWalls[0][1] = { type: 2 }; full.hWalls[0][2] = { type: 3, keys: 0xffffffff };
full.hWalls[1][0] = { type: 4, direction: { dx: 0, dy: -1 } }; full.hWalls[1][1] = { type: 5 };
full.hWalls[1][2] = { type: 6, letter: 'Z', initialState: 'open' };
full.buttons = [{ x: 0, y: 0, direction: { dx: 0, dy: -1 }, letter: 'Z' }];
full.initialGhosts = [{ x: 2, y: 0 }, { x: 1, y: 2 }]; full.items = [{ x: 1, y: 0, type: 'key' }];
test('全部墙类型、UINT32门槛、生命256、鬼顺序往返', () => {
    const map = roundTrip(full).decoded.data.mapData;
    assertEq(map.layers[0].hWalls[0][2].keys, 0xffffffff); assertEq(map.initialHealth, 256);
    assertDeepEq(map.layers[0].ghosts.map(g => [g.x,g.y]), [[2,0],[1,2]]);
    assertEq(map.layers[0].hWalls[1][2].initialState, 'open');
});
test('三种墙表示均线性读取，尾部多余或缺失拒绝', () => {
    for (const style of [0,1,2]) {
        const content = encodeMapContent(normalizeMapData(full), style);
        const code = toBase64(Uint8Array.of(0, ...content));
        assertDeepEq(DataSerializer.loadFromShareCode(code).data.mapData, normalizeMapData(full));
        assertEq(DataSerializer.loadFromShareCode(toBase64(Uint8Array.of(0, ...content, 0))).success, false);
        assertEq(DataSerializer.loadFromShareCode(toBase64(Uint8Array.of(0, ...content.slice(0,-1)))).success, false);
    }
});
test('虚空墙规范化不污染输入，跨虚空视线墙保留', () => {
    const map = makeMap(); map.activeCells.forEach(row=>row.fill(false));
    map.activeCells[1][1] = map.activeCells[4][1] = true;
    map.customStartPos = {x:1,y:1}; map.endPos = {x:1,y:4};
    map.hWalls[0][0] = {type:1}; map.hWalls[3][1] = {type:1}; map.hWalls[1][1] = {type:1};
    const decoded = roundTrip(map).decoded.data.mapData.layers[0];
    assertEq(map.hWalls[0][0].type, 1); assertEq(decoded.hWalls[0][0].type, 0);
    assertEq(decoded.hWalls[3][1].type, 1); assertEq(decoded.hWalls[1][1].type, 1);
});
test('十层20×20、出生高层、楼梯配对、终点分层往返', () => {
    const maps = Array.from({length:10},()=>normalizeMapData(makeMap({width:20,height:20})).layers[0]);
    for(const layer of maps)layer.customStartPos=null;
    maps[9].customStartPos={x:0,y:0};
    const stairs = Array.from({length:9},(_,layer)=>[{x:1,y:1,layer,direction:'up'},{x:1,y:1,layer:layer+1,direction:'down'}]).flat();
    // 中间层同格不能同时有上下楼梯，分别使用不同位置。
    stairs.forEach((s,i)=>{s.x=1+Math.floor(i/2)%2;});
    roundTrip({width:20,height:20,editorMode:'free',gameMode:'exploration',initialHealth:256,layerCount:10,layers:maps,stairs});
});
test('地图缺起点/终点、悬空按钮、原始虚空坏参数、层冲突均拒绝', () => {
    const changes = [m=>m.customStartPos=null, m=>m.endPos=null, m=>m.buttons=[{x:1,y:1,direction:{dx:1,dy:0},letter:'A'}],
        m=>m.hWalls[0][0]={type:3,keys:0x100000000}, m=>m.initialHealth=0, m=>m.width=21,
        m=>{m.layers=[normalizeMapData(m).layers[0]];m.items=[{x:1,y:1,type:'key'}];}];
    for(const change of changes){const map=makeMap();change(map); assertEq(DataSerializer.generateShareCode(map).success,false);}
    const map=makeMap(); map.activeCells[0][0]=false; map.hWalls[0][0]={type:6,letter:'?',initialState:'open'};
    assertEq(validateMapData(map).valid,false);
});
test('解码入口同样检查按钮依附',()=>{
    const invalid=normalizeMapData(makeMap({buttons:[{x:1,y:1,direction:{dx:1,dy:0},letter:'A'}]}));
    const code=toBase64(Uint8Array.of(0,...encodeMapContent(invalid,0)));
    assertEq(DataSerializer.loadFromShareCode(code).success,false);
});
test('空码、非法字符/控制、截断、非规范Base64与deflate多余数据拒绝', () => {
    for(const code of ['', '!!!', 'AA=', 'A', 'AgAAAA', golden['G1-demo'].code.slice(0,10)]) assertEq(DataSerializer.loadFromShareCode(code).success,false);
    const content=encodeMapContent(normalizeMapData(full),0);
    const bytes=Uint8Array.of(1,...window.pako.deflateRaw(content),0);
    for(const pako of [window.pako,browserPako]){
        const original=window.pako;try{window.pako=pako;assertEq(DataSerializer.loadFromShareCode(toBase64(bytes)).success,false);}finally{window.pako=original;}
    }
});
test('真实pako与Node zlib互通，压缩结果解回完全一致', () => {
    const shim=window.pako;
    try{
        for(const map of [full,...Object.values(golden).map(g=>g.canonical)]){
            window.pako=shim;const first=roundTrip(map).encoded.code;
            window.pako=browserPako;assertDeepEq(DataSerializer.loadFromShareCode(first).data.mapData,normalizeMapData(map));
            const second=roundTrip(map).encoded.code;window.pako=shim;
            assertDeepEq(DataSerializer.loadFromShareCode(second).data.mapData,normalizeMapData(map));
        }
    }finally{window.pako=shim;}
});
summary('dataSerializer');
