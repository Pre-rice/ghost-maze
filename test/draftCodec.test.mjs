import { installBrowserEnv } from './helpers/browser-env.mjs';
import { EditorWorkspace } from '../src/editor/workspace.js';
import { encodeDraft,decodeDraft } from '../src/editor/draftCodec.js';
import { test,suite,summary,assert,assertEq,assertDeepEq } from './_assert.mjs';
installBrowserEnv();suite('draftCodec');
test('没有起终点的空白草稿及一格范围也能往返',()=>{const w=new EditorWorkspace(),s=w.snapshot();const result=encodeDraft(s);assert(result.success,result.error);assertDeepEq(decodeDraft(result.code).snapshot,{...s,originalCode:null});});
test('未完成草稿完整保留元件范围与楼层，不冒充游玩图',()=>{const w=new EditorWorkspace();w.doc.toggleActiveCell(0,0,'add');w.doc.ghosts.push({x:0,y:0,id:9});w.frame={x:0,y:0,width:5,height:7};const s=w.snapshot(),encoded=encodeDraft(s);assert(encoded.success,encoded.error);assertDeepEq(decodeDraft(encoded.code).snapshot,{...s,originalCode:null});});
test('损坏链接和异常尺寸干净失败',()=>{assertEq(decodeDraft('!').success,false);const w=new EditorWorkspace();const s=w.snapshot();s.map.width=999;assertEq(encodeDraft(s).success,false);});
summary('draftCodec');
