import { test,suite,summary,assert,assertEq,assertDeepEq } from './_assert.mjs';
import { LocalLibrary,readRoute,routeURL,formatSavedTime } from '../src/site/localLibrary.js';
suite('localLibrary');
const storage=()=>{let raw=null;return {get:()=>raw,set:(_,v)=>raw=v};};
test('三种记录按时间倒序，同内容更新一次，不与其他类型合并',()=>{const l=new LocalLibrary(storage());l.save('map','https://ghostmaze.novic.cc/?map=M',100);l.save('save','https://ghostmaze.novic.cc/?map=M&save=S',300);l.save('draft','https://ghostmaze.novic.cc/?draft=D',200);assertDeepEq(l.list().map(e=>e.kind),['save','draft','map']);l.save('map','https://preview.invalid/?map=M',400);assertEq(l.list().length,3);assertEq(l.list()[0].time,400);assertEq(l.list('play').length,2);l.remove(l.list()[0].id);assertEq(l.list().length,2);});
test('保存失败必须明确失败，不产生成功记录',()=>{const l=new LocalLibrary({get:()=>null,set:()=>{}});let message='';try{l.save('map','/?map=M');}catch(e){message=e.message;}assert(message.includes('未能保存'));assertEq(l.list().length,0);});
test('地址类型互斥，地图在进度之前，换域使用当前站点',()=>{assertEq(new URL(routeURL({map:'M',save:'S'},'https://x.invalid/')).search,'?map=M&save=S');assertDeepEq(readRoute('https://a.invalid/?map=M&save=S'),{map:'M',save:'S',replay:null,draft:null});for(const bad of ['/?save=S','/?map=M&save=S&replay=R','/?draft=D&map=M']){let failed=false;try{readRoute(bad);}catch{failed=true;}assert(failed);}assert(!formatSavedTime(0).includes(':00:'));});
summary('localLibrary');
