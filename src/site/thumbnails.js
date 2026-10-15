import { readRoute } from './localLibrary.js';
import { DataSerializer } from '../core/dataSerializer.js';
import { ReplaySerializer } from '../core/replaySerializer.js';
import { MapDefinition } from '../core/mapDefinition.js';
import { GameLogic } from '../core/gameLogic.js';
import { ActionHistory } from '../core/actionHistory.js';
import { decodeDraft } from '../editor/draftCodec.js';
import { EditorDocument } from '../editor/editorSession.js';
import { computeGameView,computeEditorView } from '../view/viewSlice.js';
import * as Renderer from '../view/renderer.js';
import { getColorsFromCSS } from '../themeManager.js';
const cache=new Map();
async function model(record){
    const route=readRoute(record.url),key=JSON.stringify(route);if(cache.has(key))return cache.get(key);
    let result;
    if(route.draft){const decoded=decodeDraft(route.draft);if(!decoded.success)throw new Error(decoded.error);const s=decoded.snapshot,doc=EditorDocument.fromMapData(s.map),birth=s.map.layers.findIndex(l=>l.customStartPos);doc.switchLayer(birth>=0?birth:s.layer);result={doc,map:s.map,frame:s.frame,steps:0};}
    else {const decoded=DataSerializer.loadFromShareCode(route.map);if(!decoded.success)throw new Error(decoded.error);const map=decoded.data.mapData,definition=new MapDefinition(map);let state=GameLogic.createInitialState(definition),steps=0;
        if(route.save){const replay=ReplaySerializer.loadFromShareCode(map,route.save);if(!replay.success)throw new Error(replay.error);const h=new ActionHistory(definition,replay.actions,{cacheBudgetBytes:128*1024});state=await h.stateAtAsync(replay.actions.length);steps=replay.actions.length;}
        result={map,definition,state,steps};
    }
    cache.set(key,result);if(cache.size>48)cache.delete(cache.keys().next().value);return result;
}
export async function drawRecord(canvas,record){
    const m=await model(record),colors=getColorsFromCSS(),ctx=canvas.getContext('2d'),staticCanvas=document.createElement('canvas');
    let minX=20,minY=20,maxX=-1,maxY=-1;
    const layer=m.doc?m.doc.currentLayer:m.definition.playerStart.layer,l=m.map.layers[layer];
    l.activeCells.forEach((row,y)=>row.forEach((a,x)=>{if(a){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}}));
    if(maxX<0){minX=minY=0;maxX=maxY=0;}
    const size=Math.min((canvas.width-30)/(maxX-minX+1),(canvas.height-30)/(maxY-minY+1)),offset={x:(canvas.width-(maxX-minX+1)*size)/2-minX*size,y:(canvas.height-(maxY-minY+1)*size)/2-minY*size};
    if(m.doc){const v=computeEditorView(m.doc,{canvas,staticLayerCanvas:staticCanvas,state:'editor',cellSize:size,colors,padding:0,editor:{active:true,mode:'free',tool:'pan'}});v.offsetX=offset.x;v.offsetY=offset.y;v.workspaceFrame={x:minX,y:minY,width:maxX-minX+1,height:maxY-minY+1};Renderer.drawEditor(ctx,v);}
    else {const v=computeGameView({mapDef:m.definition,gameState:m.state,viewLayer:layer},{canvas,staticLayerCanvas:staticCanvas,state:'playing',cellSize:size,colors,drawOffset:offset,debugVision:false});Renderer.renderStaticLayer(canvas,staticCanvas,v);Renderer.drawGame(ctx,v);}
    return {cells:m.map.layers.reduce((n,l)=>n+l.activeCells.flat().filter(Boolean).length,0),ghosts:m.map.layers.reduce((n,l)=>n+l.ghosts.length,0),steps:m.steps};
}
