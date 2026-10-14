import {
    EditorWorkspace, mapBounds
} from './editor/workspace.js';
import {
    EditorDocument
} from './editor/editorSession.js';
import {
    computeEditorView
} from './view/viewSlice.js';
import * as Renderer from './view/renderer.js';
import {
    getColorsFromCSS
} from './themeManager.js';
import {
    DataSerializer
} from './core/dataSerializer.js';
import {
    WALL_TYPES as W
} from './core/constants.js';
import {
    isValidButtonAttachment
} from './core/pathfinding.js';
import {
    isInteriorWall
} from './core/mapDataUtils.js';
import {
    safeGet,safeSet
} from './storage.js';
const draftKey='ghostmaze-editor-draft-v2';
const tips={
    select:'点选元件或拖框选区；拖动已选区域移动地图。',pan:'拖动画面，不改变地图。',wall:'按下翻转墙；拖动后沿起始墙段保持直线。',oneway:'箭头朝指针所在一侧；拖动到墙的另一侧可以改向。',grid:'按下决定添加或删除，整笔保持同一种操作。',button:'在活动格的实墙附近放置按钮。',stair:'在当前格与相邻层同格成对放置楼梯。'
};
export class EditorApp {
    constructor(app){
        this.app=app;
        this.canvas=document.getElementById('editor-canvas');
        this.ctx=this.canvas.getContext('2d');
        this.staticLayerCanvas=document.createElement('canvas');
        this.staticLayerCanvas.width=this.canvas.width;
        this.staticLayerCanvas.height=this.canvas.height;
        this.workspace=new EditorWorkspace();
        this.tool='select';
        this.buttonFace='auto';
        this.selection=null;
        this.entitySelection=null;
        this.points=new Map();
        this.view={
            x:0,y:0,scale:70
        };
        this.bind();
        this.fit();
    }     get editorDoc(){
        return this.workspace.doc;
    }     get visible(){
        return this.app.view==='editor';
    }
    enter(map,code){
        if(!this.loaded||this.sourceCode!==code){
            this.workspace=new EditorWorkspace(map);
            this.workspace.originalCode=code;
            this.sourceCode=code;
            this.selection=null;
            this.entitySelection=null;
            this.loaded=true;
            this.fit();
        }this.sync();
    }
    bind(){
        const on=(id,fn,type='click')=>document.getElementById(id).addEventListener(type,fn);
        const edit=fn=>{
            try{
                this.workspace.apply(fn);
                this.changed();
            }catch(e){
                this.notify(e.message);
            }
        };
        document.querySelectorAll('[data-oneway-face]').forEach(b=>b.onclick=()=>{const direction={up:{dx:0,dy:-1},right:{dx:1,dy:0},down:{dx:0,dy:1},left:{dx:-1,dy:0}}[b.dataset.onewayFace];if(this.propertyWall){this.workspace.apply(()=>this.workspace.setWall(this.propertyWall,{type:W.ONE_WAY,keys:0,direction}));this.changed();}});
        document.querySelectorAll('[data-button-face]').forEach(b=>b.onclick=()=>{
            this.buttonFace=b.dataset.buttonFace;this.sync();
        });
        document.querySelectorAll('[data-editor-tool]').forEach(b=>b.onclick=()=>{
            this.propertyWall=null;this.tool=b.dataset.editorTool;this.sync();
        });
        on('editor-back',()=>this.app.leaveEditor());
        on('editor-undo',()=>{
            this.workspace.undo();this.selection=null;this.changed();this.fit();
        });
        on('editor-redo',()=>{
            this.workspace.redo();this.selection=null;this.changed();this.fit();
        });
        on('play-edited-map-btn',()=>this.app.tryEditor());
        on('solve-edited-map-btn',()=>this.app.solveEditor());
        on('editor-theme',()=>{
            document.getElementById('theme-toggle-btn').click();this.draw();
        });
        on('editor-fit',()=>this.fit());
        on('editor-zoom-in',()=>this.zoom(1.25));
        on('editor-zoom-out',()=>this.zoom(.8));
        on('editor-properties-close',()=>this.properties(false));
        on('editor-properties-toggle',()=>this.properties(!document.getElementById('editor-inspector').classList.contains('shown')));
        for(const mode of ['death-loop','exploration'])on('editor-mode-'+mode+'-btn',()=>edit(()=>{
            this.editorDoc.gameMode=mode;
        }));
        on('editor-initial-health',e=>edit(()=>{
            const n=Number(e.target.value);if(!Number.isInteger(n)||n<1||n>0xffffffff)throw new Error('生命必须为有效正整数');this.editorDoc.initialHealth=n;
        }),'change');
        on('editor-resize',()=>{
            const width=Number(document.getElementById('editor-width').value),height=Number(document.getElementById('editor-height').value),lost=this.workspace.resizeLoss(width,height);const resize=()=>{
                edit(()=>this.workspace.resize(width,height));this.selection=null;this.fit();
            };if(lost.cells||lost.entities)this.app.game.showConfirm(`裁切将删除${lost.cells}格及${lost.entities}个元件，仍可撤销。是否继续？`,resize);else resize();
        });
        on('editor-select-all',()=>{
            this.entitySelection=null;this.selection={
                ...mapBounds(this.editorDoc.toMapData()),allLayers:true
            };this.tool='select';this.sync();
        });
        for(const[id,dx,dy]of[['left',-1,0],['right',1,0],['up',0,-1],['down',0,1]])on('editor-move-'+id,()=>this.moveSelection(dx,dy));
        on('editor-copy',()=>{
            if(!this.selection)return this.notify('先选择一个区域');this.clipboard=this.entitySelection?{
                entity:{
                    ...this.entitySelection,value:structuredClone(this.entityValue(this.entitySelection))
                }
            }:{
                source:this.editorDoc.toMapData(),rect:{
                    ...this.selection
                }
            };this.notify('已复制区域，选择粘贴后点击目标位置');
        });
        on('editor-paste',()=>{
            if(!this.clipboard)return this.notify('先复制一个区域');this.tool='paste';this.sync();
        });
        on('layer-add-btn',()=>edit(()=>{
            const d=this.editorDoc;d.saveCurrentLayer();if(d.layerCount>=10)throw new Error('最多10层');const map=d.toMapData(),l={
                hWalls:Array.from({
                    length:map.height+1
                },()=>Array.from({
                    length:map.width
                },()=>({
                    type:0,keys:0
                }))),vWalls:Array.from({
                    length:map.height
                },()=>Array.from({
                    length:map.width+1
                },()=>({
                    type:0,keys:0
                }))),activeCells:Array.from({
                    length:map.height
                },()=>Array(map.width).fill(false)),ghosts:[],items:[],buttons:[],customStartPos:null,endPos:null
            };map.layers.push(l);map.layerCount++;map.multiLayerMode=true;this.workspace.replace(map);this.editorDoc.switchLayer(map.layerCount-1);
        }));
        on('layer-remove-btn',()=>this.app.game.showConfirm('删除顶层及相关楼梯？此操作可撤销。',()=>edit(()=>{
            const map=this.editorDoc.toMapData();if(map.layerCount===1)throw new Error('至少保留一层');map.layers.pop();map.layerCount--;map.multiLayerMode=map.layerCount>1;map.stairs=map.stairs.filter(s=>s.layer<map.layerCount&&s.layer+(s.direction==='up'?1:-1)<map.layerCount);this.workspace.replace(map);
        } )));
        on('editor-new',()=>this.app.game.showConfirm('新建空白草稿？当前草稿会保留在撤销中。',()=>{
            edit(()=>{
                this.workspace.replace(new EditorWorkspace().doc.toMapData());this.workspace.frame={
                    x:0,y:0,width:1,height:1
                };
            });this.selection=null;this.fit();
        }));
        on('editor-clear',()=>this.app.game.showConfirm('清空当前层？可以撤销。',()=>edit(()=>{
            const d=this.editorDoc;d.stairs=d.stairs.filter(s=>s.layer!==d.currentLayer&&s.layer+(s.direction==='up'?1:-1)!==d.currentLayer);d.clearAllGrids();
        })));
        on('editor-restore',()=>{
            try{
                const saved=JSON.parse(safeGet(draftKey));if(!saved)throw new Error('尚无本机草稿');edit(()=>this.workspace.restore(saved));this.fit();
            }catch(e){
                this.notify(e.message);
            }
        });
        for(const type of ['pointerdown','pointermove','pointerup','pointercancel'])this.canvas.addEventListener(type,e=>this.pointer(e));
        this.canvas.addEventListener('contextmenu',e=>e.preventDefault());
        this.canvas.addEventListener('wheel',e=>{
            e.preventDefault();this.zoom(e.deltaY>0?.9:1.1,e.clientX,e.clientY);
        },{
            passive:false
        });
        window.addEventListener('keydown',e=>{
            if(!this.visible||this.app.game.solverDialog.open||['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){
                e.preventDefault();document.getElementById(e.shiftKey?'editor-redo':'editor-undo').click();
            }else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){
                e.preventDefault();document.getElementById('editor-redo').click();
            }else if(e.key==='Escape'){
                this.selection=null;this.tool='select';this.sync();
            }
        });
        new ResizeObserver(()=>{
            if(this.visible)this.fit();
        }).observe(this.canvas);
    }
    notify(message){
        this.app.game.showToast(message,2500,'error');
    }
    code(){
        if(this.workspace.originalCode)return {
            success:true,code:this.workspace.originalCode
        };
        return DataSerializer.generateShareCode(this.editorDoc.toMapData());
    }
    changed(){
        const saved=JSON.stringify(this.workspace.snapshot());
        safeSet(draftKey,saved);
        this.draftSaved=safeGet(draftKey)===saved;
        const result=this.code();
        if(result.success){
            this.app.editorCode=result.code;
            this.app.editorURL(result.code);
        }this.sync();
    }
    sync(){
        const d=this.editorDoc,b=this.workspace.frame;
        document.getElementById('editor-width').value=b.width;
        document.getElementById('editor-height').value=b.height;
        document.getElementById('editor-initial-health').value=d.initialHealth;
        document.getElementById('initial-health-container').hidden=d.gameMode!=='exploration';
        for(const mode of ['death-loop','exploration'])document.getElementById('editor-mode-'+mode+'-btn').classList.toggle('secondary',d.gameMode!==mode);
        document.getElementById('editor-undo').disabled=!this.workspace.undoStack.length;
        document.getElementById('editor-redo').disabled=!this.workspace.redoStack.length;
        const result=this.code();
        document.getElementById('editor-status').textContent=result.success?'链接已更新':(this.draftSaved?'草稿已保存，尚不能生成游玩链接':'未完成草稿仅当前标签保留');
        document.getElementById('editor-tool-title').textContent=document.querySelector(`[data-editor-tool="${this.tool}"]`)?.textContent??'粘贴';
        document.getElementById('editor-tool-tip').textContent=tips[this.tool]??'点击放置，已有元件可用选择工具修改。';
        document.querySelectorAll('[data-editor-tool]').forEach(b=>b.classList.toggle('active',b.dataset.editorTool===this.tool));
        document.querySelectorAll('.letter-setting').forEach(el=>el.hidden=!['letter','button'].includes(this.tool));
        document.getElementById('editor-oneway-dir').hidden=this.tool!=='oneway'||!this.propertyWall;document.getElementById('editor-button-face').hidden=this.tool!=='button';
        document.querySelectorAll('[data-button-face]').forEach(b=>b.classList.toggle('active',b.dataset.buttonFace===this.buttonFace));
        document.querySelector('.door-initial-setting').hidden=this.tool!=='letter';
        document.querySelector('.keys-setting').hidden=this.tool!=='lock';
        document.querySelector('.stair-setting').hidden=this.tool!=='stair';
        document.getElementById('editor-selection-info').textContent=this.selection?`已选${this.selection.width}×${this.selection.height}${this.selection.allLayers?'，全部楼层':''}`:'未选择区域';
        const tabs=document.getElementById('editor-layer-tabs');
        tabs.replaceChildren();
        for(let i=0;i<d.layerCount;i++){
            const b=document.createElement('button');
            b.textContent=`${i+1}层`;
            b.className=i===d.currentLayer?'':'secondary';
            b.onclick=()=>{
                d.saveCurrentLayer();
                d.switchLayer(i);
                this.selection=null;
                this.entitySelection=null;
                this.sync();
            };
            tabs.append(b);
        }this.objectProperties();
        this.draw();
    }
    properties(open){
        const panel=document.getElementById('editor-inspector');
        if(open){this.propertiesView={...this.view};panel.classList.add('shown');const r=this.canvas.getBoundingClientRect(),b=this.workspace.frame,available=Math.max(100,Math.min(r.height,panel.getBoundingClientRect().top-r.top-12))*this.canvas.height/r.height;this.view.scale=Math.min(this.view.scale,(available-24)/b.height);this.view.x=(this.canvas.width-b.width*this.view.scale)/2-b.x*this.view.scale;this.view.y=(available-b.height*this.view.scale)/2-b.y*this.view.scale;}
        else{panel.classList.remove('shown');if(this.propertiesView)this.view=this.propertiesView;this.propertiesView=null;}
        this.draw();
    }
    fit(){
        const r=this.canvas.getBoundingClientRect();
        if(this.visible&&r.width){
            const available=Math.max(260,innerHeight-(innerWidth<850?340:220));
            this.canvas.height=Math.round(available*this.canvas.width/r.width);
            this.staticLayerCanvas.height=this.canvas.height;
        }const b=this.workspace.frame;
        this.view.scale=Math.min((this.canvas.width-100)/Math.max(1,b.width),(this.canvas.height-100)/Math.max(1,b.height),160);
        this.view.x=(this.canvas.width-b.width*this.view.scale)/2-b.x*this.view.scale;
        this.view.y=(this.canvas.height-b.height*this.view.scale)/2-b.y*this.view.scale;
        this.draw();
    }
    zoom(factor,cx,cy){
        const r=this.canvas.getBoundingClientRect(),x=cx==null?this.canvas.width/2:(cx-r.left)*this.canvas.width/r.width,y=cy==null?this.canvas.height/2:(cy-r.top)*this.canvas.height/r.height;
        const scale=Math.max(12,Math.min(220,this.view.scale*factor)),ratio=scale/this.view.scale;
        this.view.x=x-(x-this.view.x)*ratio;
        this.view.y=y-(y-this.view.y)*ratio;
        this.view.scale=scale;
        this.draw();
    }
    draw(){
        const d=this.editorDoc,colors=getColorsFromCSS(),v=computeEditorView(d,{
            canvas:this.canvas,staticLayerCanvas:this.staticLayerCanvas,state:'editor',cellSize:this.view.scale,colors,padding:0,editor:{
                active:true,mode:'free',tool:this.tool,isDragging:!!this.gesture
            }
        });
        v.editor.mode='free';
        v.offsetX=this.view.x;
        v.offsetY=this.view.y;
        v.workspaceFrame=this.workspace.frame;
        Renderer.drawEditor(this.ctx,v);
        if(this.selection){
            const s=this.preview??this.selection;
            this.ctx.strokeStyle=colors.primary||'#1890ff';
            this.ctx.lineWidth=3;
            this.ctx.strokeRect(this.view.x+s.x*this.view.scale,this.view.y+s.y*this.view.scale,s.width*this.view.scale,s.height*this.view.scale);
        }
    }
    position(e){
        const r=this.canvas.getBoundingClientRect(),px=(e.clientX-r.left)*this.canvas.width/r.width,py=(e.clientY-r.top)*this.canvas.height/r.height;
        return {
            px,py,x:(px-this.view.x)/this.view.scale,y:(py-this.view.y)/this.view.scale
        };
    }
    wallAt(p){
        const x=Math.round(p.x),y=Math.round(p.y),vx=Math.abs(p.x-x),hy=Math.abs(p.y-y);
        return vx<hy?{
            type:'v',x,y:Math.floor(p.y)
        }:{
            type:'h',x:Math.floor(p.x),y
        };
    }
    direction(p,w){
        return w.type==='h'?{
            dx:0,dy:p.y>w.y?1:-1
        }:{
            dx:p.x>w.x?1:-1,dy:0
        };
    }
    pointer(e){
        if(!this.visible)return;
        e.preventDefault();
        const p=this.position(e);
        if(e.type==='pointerdown'){
            this.canvas.setPointerCapture(e.pointerId);
            this.points.set(e.pointerId,{
                x:e.clientX,y:e.clientY
            });
            if(this.points.size===2){
                this.workspace.cancel();
                this.gesture=null;
                const [a,b]=[...this.points.values()];
                this.pinch={
                    distance:Math.hypot(a.x-b.x,a.y-b.y),x:(a.x+b.x)/2,y:(a.y+b.y)/2
                };
                this.draw();
                return;
            }if(this.points.size>2)return;
            const inside=this.selection&&p.x>=this.selection.x&&p.y>=this.selection.y&&p.x<this.selection.x+this.selection.width&&p.y<this.selection.y+this.selection.height;
            this.gesture={
                start:p,last:p,client:{
                    x:e.clientX,y:e.clientY
                },drag:false,tool:e.button===2?'eraser':this.tool,line:this.wallAt(p),seen:new Set(),move:this.tool==='select'&&inside,selection:this.selection?{
                    ...this.selection
                }:null
            };
            if(!['select','pan'].includes(this.gesture.tool)){
                this.workspace.begin();
                this.paint(p,false);
            }return;
        }         if(e.type==='pointercancel'){
            this.points.delete(e.pointerId);
            this.workspace.cancel();
            this.gesture=null;
            this.pinch=null;
            this.preview=null;
            this.sync();
            return;
        }         if(e.type==='pointermove'){
            if(!this.points.has(e.pointerId))return;
            this.points.set(e.pointerId,{
                x:e.clientX,y:e.clientY
            });
            if(this.pinch&&this.points.size>=2){
                const[a,b]=[...this.points.values()],distance=Math.hypot(a.x-b.x,a.y-b.y),x=(a.x+b.x)/2,y=(a.y+b.y)/2;
                this.zoom(distance/this.pinch.distance,x,y);
                const r=this.canvas.getBoundingClientRect();
                this.view.x+=(x-this.pinch.x)*this.canvas.width/r.width;
                this.view.y+=(y-this.pinch.y)*this.canvas.height/r.height;
                this.pinch={
                    distance,x,y
                };
                this.draw();
                return;
            }const g=this.gesture;
            if(!g)return;
            if(Math.hypot(e.clientX-g.client.x,e.clientY-g.client.y)>6)g.drag=true;
            if(!g.drag&&g.tool!=='oneway')return;
            if(g.tool==='pan'){
                this.view.x+=p.px-g.last.px;
                this.view.y+=p.py-g.last.py;
            }else if(g.tool==='select'){
                this.propertyWall=null;
                if(!g.move)this.entitySelection=null;
                if(g.move)this.preview={
                    ...g.selection,x:g.selection.x+Math.round(p.x-g.start.x),y:g.selection.y+Math.round(p.y-g.start.y)
                };
                else this.selection={
                    x:Math.floor(Math.min(p.x,g.start.x)),y:Math.floor(Math.min(p.y,g.start.y)),width:Math.abs(Math.floor(p.x)-Math.floor(g.start.x))+1,height:Math.abs(Math.floor(p.y)-Math.floor(g.start.y))+1
                };
            }else this.paint(p,true);
            g.last=p;
            this.draw();
            return;
        }         if(e.type==='pointerup'){
            this.points.delete(e.pointerId);
            if(this.pinch){
                if(!this.points.size)this.pinch=null;
                return;
            }const g=this.gesture;
            if(!g)return;
            try{
                if(g.tool==='select'){
                    this.propertyWall=null;
                    if(!g.move)this.entitySelection=null;
                    if(g.move&&g.drag&&this.preview)this.moveSelection(this.preview.x-g.selection.x,this.preview.y-g.selection.y);
                    else if(!g.drag)this.selection={
                        x:Math.floor(p.x),y:Math.floor(p.y),width:1,height:1
                    };
                }else if(g.tool!=='pan'){
                    if(!g.drag&&!['wall','glass','oneway','grid','eraser'].includes(g.tool))this.paint(p,false);
                    this.workspace.commit();
                    this.changed();
                }
            }catch(err){
                this.workspace.cancel();
                this.notify(err.message);
            }this.gesture=null;
            this.preview=null;
            this.sync();
        }
    }
    paint(p,drag){
        const g=this.gesture;
        if(!g)return;
        try{
            let x=Math.floor(p.x),y=Math.floor(p.y),d=this.editorDoc;
            if(['wall','glass','door','letter','lock','oneway'].includes(g.tool)){
                let w=g.tool==='oneway'&&drag?g.line:this.wallAt(p);
                if(drag&&['wall','glass'].includes(g.tool))w=g.line.type==='h'?{
                    type:'h',x:Math.floor(p.x),y:g.line.y
                }:{
                    type:'v',x:g.line.x,y:Math.floor(p.y)
                };
                if(!isInteriorWall(w,d.width,d.height,d.activeCells))throw new Error('边界只能是墙；请先绘制相邻地板');
                if(drag&&['wall','glass'].includes(g.tool)){
                    const from=g.line.type==='h'?g.line.x:g.line.y,to=w.type==='h'?w.x:w.y;
                    for(let at=Math.min(from,to);at<=Math.max(from,to);at++){
                        const segment=w.type==='h'?{
                            type:'h',x:at,y:w.y
                        }:{
                            type:'v',x:w.x,y:at
                        };
                        if(isInteriorWall(segment,d.width,d.height,d.activeCells))this.workspace.setWall(segment,{
                            type:g.tool==='wall'?W.SOLID:W.GLASS,keys:0
                        });
                    }g.validPaint=true;
                    this.draw();
                    return;
                }const key=`${w.type},${w.x},${w.y}`;
                if(g.tool!=='oneway'&&g.seen.has(key))return;
                g.seen.add(key);
                const old=d[w.type+'Walls'][w.y][w.x];
                let value={
                    type:W.SOLID,keys:0
                };
                if(g.tool==='wall'||g.tool==='glass'){
                    value.type=drag?(g.tool==='glass'?W.GLASS:W.SOLID):(old.type===(g.tool==='glass'?W.GLASS:W.SOLID)?W.EMPTY:g.tool==='glass'?W.GLASS:W.SOLID);
                }else if(g.tool==='door')value.type=W.DOOR;
                else if(g.tool==='oneway'){
                    value={
                        type:W.ONE_WAY,direction:this.direction(p,w),keys:0
                    };
                    g.line=w;
                }else if(g.tool==='letter')value={
                    type:W.LETTER_DOOR,letter:document.getElementById('editor-letter').value,initialState:document.getElementById('editor-door-state').value,keys:0
                };
                else value={
                    type:W.LOCKED,keys:Number(document.getElementById('editor-keys').value)
                };
                if(value.type===W.LOCKED&&(!Number.isInteger(value.keys)||value.keys<0||value.keys>0xffffffff))throw new Error('钥匙数量必须是非负整数');
                this.workspace.setWall(w,value);
                g.validPaint=true;
                this.draw();
                return;
            }         if(g.tool==='button'){
                const fixed={
                    up:{
                        dx:0,dy:-1
                    },right:{
                        dx:1,dy:0
                    },down:{
                        dx:0,dy:1
                    },left:{
                        dx:-1,dy:0
                    }
                }[this.buttonFace];
                const w=fixed?(fixed.dx?{
                    type:'v',x:x+(fixed.dx===1?1:0),y
                }:{
                    type:'h',x,y:y+(fixed.dy===1?1:0)
                }):this.wallAt(p);
                if(x<0||y<0||!d.activeCells[y]?.[x])throw new Error('按钮需要位于活动格的墙上');
                const direction=fixed??(w.type==='h'?{
                    dx:0,dy:w.y===y?-1:1
                }:{
                    dx:w.x===x?-1:1,dy:0
                });
                const wall=d[w.type+'Walls'][w.y]?.[w.x];
                if(isInteriorWall(w,d.width,d.height,d.activeCells)&&wall.type!==W.SOLID)throw new Error('按钮只能依附实墙');
                d.buttons=d.buttons.filter(b=>b.x!==x||b.y!==y||b.direction.dx!==direction.dx||b.direction.dy!==direction.dy);
                d.buttons.push({
                    x,y,direction,letter:document.getElementById('editor-letter').value
                });
                g.validPaint=true;
                this.draw();
                return;
            }         if(g.tool==='paste'){
                if(g.pasted)return;
                g.pasted=true;
                const c=this.clipboard;
                if(c.entity){
                    this.placeEntity(c.entity.key,c.entity.value,x,y,true);
                    return;
                }this.selection=this.workspace.moveRegion(c.rect,x-c.rect.x,y-c.rect.y,{
                    copy:true,allLayers:!!c.rect.allLayers,source:c.source
                });
                return;
            }         const key=x+','+y;
            if(g.seen.has(key))return;
            g.seen.add(key);
            if(g.tool==='eraser'){
                const wall=this.wallAt(p),near=Math.min(Math.abs(p.x-Math.round(p.x)),Math.abs(p.y-Math.round(p.y)))<.2;
                if(near&&isInteriorWall(wall,d.width,d.height,d.activeCells))this.workspace.setWall(wall,{
                    type:W.EMPTY,keys:0
                });
                else if(d.activeCells[y]?.[x]){
                    const occupied=d.ghosts.some(v=>v.x===x&&v.y===y)||d.items.some(v=>v.x===x&&v.y===y)||d.buttons.some(v=>v.x===x&&v.y===y)||d.customStartPos?.x===x&&d.customStartPos?.y===y||d.endPos?.x===x&&d.endPos?.y===y;
                    if(occupied){
                        d.ghosts=d.ghosts.filter(v=>v.x!==x||v.y!==y);
                        d.items=d.items.filter(v=>v.x!==x||v.y!==y);
                        d.buttons=d.buttons.filter(v=>v.x!==x||v.y!==y);
                        if(d.customStartPos?.x===x&&d.customStartPos?.y===y)d.customStartPos=null;
                        if(d.endPos?.x===x&&d.endPos?.y===y)d.endPos=null;
                    }else this.workspace.eraseCell(x,y);
                }g.validPaint=true;
                this.draw();
                return;
            }         const a=this.workspace.ensure(x,y);
            if(a.dx||a.dy){
                this.view.x-=a.dx*this.view.scale;
                this.view.y-=a.dy*this.view.scale;
                g.start.x+=a.dx;
                g.start.y+=a.dy;
                g.line.x+=a.dx;
                g.line.y+=a.dy;
            }x=a.x;
            y=a.y;
            d=this.editorDoc;
            if(g.tool==='grid'){
                g.gridAction??=d.activeCells[y][x]?'remove':'add';
                d.toggleActiveCell(x,y,g.gridAction);
            }         else{
                if(!d.activeCells[y][x])d.toggleActiveCell(x,y,'add');
                if(g.tool==='ghost'){
                    if(!d.ghosts.some(v=>v.x===x&&v.y===y))d.ghosts.push({
                        x,y
                    });
                }else if(g.tool==='key'){
                    if(!d.items.some(v=>v.x===x&&v.y===y))d.items.push({
                        x,y,type:'key'
                    });
                }else if(g.tool==='start'){
                    d.saveCurrentLayer();
                    for(const l of d.layers)l.customStartPos=null;
                    d.customStartPos={
                        x,y
                    };
                    d.playerLayer=d.currentLayer;
                }else if(g.tool==='end')d.endPos={
                    x,y
                };
                else if(g.tool==='stair'){
                    const dir=document.getElementById('editor-stair-direction').value,other=d.currentLayer+(dir==='up'?1:-1);
                    d.saveCurrentLayer();
                    if(!d.layers[other]?.activeCells[y]?.[x])throw new Error('请先在相邻层同格绘制地板');
                    if(d.stairs.some(s=>s.x===x&&s.y===y&&s.layer===d.currentLayer))throw new Error('此处已有楼梯，可在属性中移除');
                    d.stairs.push({
                        x,y,layer:d.currentLayer,direction:dir
                    },{
                        x,y,layer:other,direction:dir==='up'?'down':'up'
                    });
                }
            }         g.validPaint=true;
            this.draw();
        }catch(e){
            if(!g.validPaint)this.workspace.cancel();
            if(!g.error){
                g.error=true;
                this.notify(e.message);
            }
        }
    }
    moveSelection(dx,dy){
        this.propertyWall=null;
        if(!this.selection)return this.notify('先选择一个区域');
        try{
            if(this.entitySelection){
                const selected={
                    ...this.entitySelection
                },value=structuredClone(this.entityValue(selected));
                this.workspace.apply(()=>this.placeEntity(selected.key,value,selected.x+dx,selected.y+dy,false));
                this.changed();
                return;
            }this.workspace.apply(()=>{
                this.selection={
                    ...this.workspace.moveRegion(this.selection,dx,dy,{
                        allLayers:!!this.selection.allLayers
                    }),allLayers:this.selection.allLayers
                };
            });
            this.changed();
            this.fit();
        }catch(e){
            this.notify(e.message);
        }
    }
    entityValue(selected){
        const list=this.editorDoc[selected.key];
        return Array.isArray(list)?list.find(p=>p.x===selected.x&&p.y===selected.y&&(!selected.direction||p.direction.dx===selected.direction.dx&&p.direction.dy===selected.direction.dy)):list;
    }
    placeEntity(key,value,x,y,copy){
        if(!value)throw new Error('元件已移除，请重新选择');
        if(copy&&['customStartPos','endPos'].includes(key))throw new Error('出生点与终点请使用移动');
        const next=this.workspace.ensure(x,y),d=this.editorDoc,old={
            x:value.x+next.dx,y:value.y+next.dy
        };
        if(!d.activeCells[next.y][next.x])d.toggleActiveCell(next.x,next.y,'add');
        const placed={
            ...value,x:next.x,y:next.y
        };
        if(key==='buttons'&&!isValidButtonAttachment(placed,{
            width:d.width,height:d.height,activeCells:d.activeCells,hWalls:d.hWalls,vWalls:d.vWalls,editorMode:'free'
        }))throw new Error('按钮目标必须有实墙');
        if(Array.isArray(d[key])){
            const match=p=>p.x===old.x&&p.y===old.y&&(!value.direction||p.direction.dx===value.direction.dx&&p.direction.dy===value.direction.dy);
            const conflict=d[key].some(p=>p.x===next.x&&p.y===next.y&&(!value.direction||p.direction.dx===value.direction.dx&&p.direction.dy===value.direction.dy)&&(copy||!match(p)));
            if(conflict)throw new Error('目标格已有同类元件');
            if(!copy)d[key]=d[key].filter(p=>!match(p));
            d[key].push(placed);
        }else d[key]=placed;
        this.entitySelection={
            key,x:next.x,y:next.y,direction:placed.direction
        };
        this.selection={
            x:next.x,y:next.y,width:1,height:1
        };
        this.view.x-=next.dx*this.view.scale;
        this.view.y-=next.dy*this.view.scale;
    }
    objectProperties(){
        const holder=document.getElementById('editor-object-properties');
        holder.replaceChildren();
        const s=this.selection;
        if(!s||s.width!==1||s.height!==1)return;
        const d=this.editorDoc,x=s.x,y=s.y;
        const entries=[...d.ghosts.filter(p=>p.x===x&&p.y===y).map(p=>['鬼','ghosts',p]),...d.items.filter(p=>p.x===x&&p.y===y).map(p=>['钥匙','items',p]),...d.buttons.filter(p=>p.x===x&&p.y===y).map(p=>['按钮 '+p.letter,'buttons',p])];
        if(d.customStartPos?.x===x&&d.customStartPos?.y===y)entries.push(['出生点','customStartPos',d.customStartPos]);
        if(d.endPos?.x===x&&d.endPos?.y===y)entries.push(['终点','endPos',d.endPos]);
        for(const[name,key,p]of entries){
            const row=document.createElement('div');
            row.className='object-property';
            row.textContent=name;
            const b=document.createElement('button');
            b.textContent='移除';
            b.className='secondary';
            b.onclick=()=>{
                this.workspace.apply(()=>{
                    if(Array.isArray(this.editorDoc[key]))this.editorDoc[key]=this.editorDoc[key].filter(v=>v.x!==p.x||v.y!==p.y||(key==='buttons'&&(v.direction.dx!==p.direction.dx||v.direction.dy!==p.direction.dy)));else this.editorDoc[key]=null;
                });
                this.changed();
            };
            const choose=document.createElement('button');
            choose.textContent='选择移动';
            choose.className='secondary';
            choose.onclick=()=>{
                this.entitySelection={
                    key,x:p.x,y:p.y,direction:p.direction?{
                        ...p.direction
                    }:undefined
                };
                this.tool='select';
                this.sync();
            };
            row.append(choose,b);
            if(key==='buttons'){
                const letter=document.createElement('select');
                for(let i=0;i<26;i++){
                    const o=document.createElement('option');
                    o.textContent=String.fromCharCode(65+i);
                    letter.append(o);
                }letter.value=p.letter;
                letter.onchange=()=>{
                    this.workspace.apply(()=>{
                        this.editorDoc.buttons.find(v=>v.x===p.x&&v.y===p.y&&v.direction.dx===p.direction.dx&&v.direction.dy===p.direction.dy).letter=letter.value;
                    });
                    this.changed();
                };
                row.append(letter);
            }holder.append(row);
        }for(const wall of [{
            type:'h',x,y
        },{
            type:'h',x,y:y+1
        },{
            type:'v',x,y
        },{
            type:'v',x:x+1,y
        }]){
            const w=d[wall.type+'Walls'][wall.y]?.[wall.x];
            if(!w||w.type<=1||!isInteriorWall(wall,d.width,d.height,d.activeCells))continue;
            const b=document.createElement('button');
            b.className='secondary';
            b.textContent=w.type===W.LETTER_DOOR?`字母门 ${w.letter} · ${w.initialState==='open'?'开启':'关闭'}`:w.type===W.LOCKED?`数字门 ${w.keys}`:'修改门';
            b.onclick=()=>{
                this.tool={
                    2:'door',3:'lock',4:'oneway',5:'glass',6:'letter'
                }[w.type];
                if(w.letter)document.getElementById('editor-letter').value=w.letter;
                if(w.keys!=null)document.getElementById('editor-keys').value=w.keys;
                if(w.initialState)document.getElementById('editor-door-state').value=w.initialState;
                this.propertyWall=wall;
                this.sync();
            };
            holder.append(b);
        }if(this.propertyWall&&['letter','lock'].includes(this.tool)){
            const b=document.createElement('button');
            b.textContent='应用到选中门';
            b.onclick=()=>{
                const w=this.propertyWall;
                this.workspace.apply(()=>{
                    if(this.tool==='letter')this.workspace.setWall(w,{
                        type:W.LETTER_DOOR,keys:0,letter:document.getElementById('editor-letter').value,initialState:document.getElementById('editor-door-state').value
                    });else if(this.tool==='lock')this.workspace.setWall(w,{
                        type:W.LOCKED,keys:Number(document.getElementById('editor-keys').value)
                    });
                });
                this.changed();
            };
            holder.append(b);
        }
    }
}
