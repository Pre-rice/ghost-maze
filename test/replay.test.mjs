import { installBrowserEnv } from './helpers/browser-env.mjs';
import { makeMap } from './helpers/map-fixture.mjs';
import { test, suite, summary, assert, assertEq, assertDeepEq } from './_assert.mjs';
import { ReplaySerializer } from '../src/core/replaySerializer.js';
import { MapDefinition } from '../src/core/mapDefinition.js';
import { mapCRC32 } from '../src/core/dataSerializer.js';
import { ActionHistory } from '../src/core/actionHistory.js';
import { toBase64, fromBase64 } from '../src/core/binaryCodec.js';
installBrowserEnv();suite('replay');const map=makeMap();
test('0～2000步、稀疏/连续楼梯及不可压缩方向往返',()=>{
    let seed=97531;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed;};
    for(const n of [0,1,2,3,4,5,70,73,1000,2000])for(const frequency of [0,3,17,1]){
        const actions=Array.from({length:n},()=>frequency&&rand()%frequency===0?'STAIR':['U','D','L','R'][rand()>>>30]);
        const result=ReplaySerializer.generateShareCode(map,actions);assert(result.success,result.error);
        assertDeepEq(ReplaySerializer.loadFromShareCode(map,result.code).actions,actions);
    }
});
test('方向数据最多2bit/步，含地图绑定和控制开销',()=>{
    const actions=Array.from({length:70},(_,i)=>['U','L','D','R'][(i*i+3*i)%4]);
    const result=ReplaySerializer.generateShareCode(map,actions);assert(result.success);assert(result.code.length<=31);
    const crc=mapCRC32(map);assert(crc>=0&&crc<=0xffffffff);
    assertEq(ReplaySerializer.loadFromShareCode(makeMap({initialHealth:6}),result.code).success,false);
});
test('坏控制、末组、尾位、越界楼梯、额外字节拒绝',()=>{
    const encoded=ReplaySerializer.generateShareCode(map,[]);const original=fromBase64(encoded.code);
    for(const control of [128,224,14,24]){const bytes=original.slice();bytes[0]=control;assertEq(ReplaySerializer.loadFromShareCode(map,toBase64(bytes)).success,false);}
    const header=original.slice(0,5);
    // 五进制三步最大124；方向稀疏表必须非空且步号在范围内。
    for(const [control,body] of [[18,[250]],[4,[0]],[4,[1,127]],[24,[1]]]){
        const bytes=Uint8Array.of(...header,...body);bytes[0]=control;assertEq(ReplaySerializer.loadFromShareCode(map,toBase64(bytes)).success,false);
    }
});
test('历史初态/当前缓存可重建，墙和视野不污染前一步；大路线受预算约束',()=>{
    const actions=Array.from({length:2000},(_,i)=>i%2?'L':'R');const timeline=new ActionHistory(new MapDefinition(map),actions,{cacheBudgetBytes:128*1024});
    const first=JSON.stringify(timeline.stateAt(0));const state=timeline.stateAt(2000);assertEq(state.player.steps,2000);
    assertEq(JSON.stringify(timeline.stateAt(0)),first);assert(timeline.cachedBytes<=128*1024);
    for(const key of [...timeline.cache.entries.keys()])if(key!==0)timeline.cache.delete(key);
    assertEq(timeline.stateAt(1501).player.x,1);assertEq(timeline.stateAt(2000).player.steps,2000);
});
test('第N步无法执行必须报具体步号',()=>{
    const history=new ActionHistory(new MapDefinition(map),['R','STAIR']);let message='';try{history.stateAt(2);}catch(error){message=error.message;}
    assert(message.includes('第 2 步无法执行'));
});
summary('replay');
