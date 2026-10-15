import { EditorWorkspace, mapBounds, reshapeMap } from './editor/workspace.js';
import { DataSerializer } from './core/dataSerializer.js';
import { WALL_TYPES as W } from './core/constants.js';
import { isInteriorWall } from './core/mapDataUtils.js';
import { computeEditorView } from './view/viewSlice.js';
import * as Renderer from './view/renderer.js';
import { getColorsFromCSS } from './themeManager.js';
import { InlineProperties } from './editor/inlineProperties.js';

export class EditorApp {
    constructor(app){
        this.app=app;this.canvas=document.getElementById('game-canvas');this.ctx=this.canvas.getContext('2d');
        this.staticLayerCanvas=document.createElement('canvas');this.workspace=new EditorWorkspace();
        this.tool='wall';this.lastValues={letter:'A',button:'A',lock:0};this.view={x:0,y:0,scale:70};this.points=new Map();this.loaded=false;
        this.properties=new InlineProperties(this);this.bind();
    }
    get editorDoc(){return this.workspace.doc;}
    get visible(){return this.app.view==='editor';}
    enter(map,code,snapshot=null){
        if(!this.loaded){this.properties.hide();this.workspace=new EditorWorkspace(map);this.workspace.originalCode=code||null;if(snapshot)this.workspace.restore(snapshot);this.loaded=true;this.fit();if(map&&this.app.game.cellSize)this.view={scale:this.app.game.cellSize,x:this.app.game.drawOffset.x,y:this.app.game.drawOffset.y};}
        this.sync();
    }
    apply(fn,fit=false){try{const changed=this.workspace.apply(fn);if(changed)this.changed();else this.sync();if(fit)this.fit();}catch(e){this.notify(e.message);this.sync();}}
    bind(){
        const on=(id,fn,event='click')=>document.getElementById(id).addEventListener(event,fn);
        document.querySelectorAll('[data-editor-tool]').forEach(b=>b.onclick=()=>{this.properties.hide();this.tool=b.dataset.editorTool;this.sync();});
        on('editor-undo',()=>this.undo());on('editor-redo',()=>this.redo());on('editor-fit',()=>this.fit());
        for(const mode of ['death-loop','exploration'])on('editor-mode-'+mode+'-btn',()=>this.apply(()=>{this.editorDoc.gameMode=mode;}));
        on('editor-initial-health',e=>this.apply(()=>{const n=Number(e.target.value);if(!Number.isInteger(n)||n<1||n>0xffffffff)throw new Error('生命必须为正整数');this.editorDoc.initialHealth=n;}),'change');
        on('editor-resize',()=>this.adapt());
        for(const id of ['editor-width','editor-height']){on(id,()=>this.resizeFrame(),'change');on(id,e=>{if(e.key==='Enter'){e.preventDefault();e.target.blur();}},'keydown');}
        on('layer-mode-multi-btn',()=>{if(this.editorDoc.layerCount===1)this.addLayer();});
        on('layer-mode-single-btn',()=>{if(this.editorDoc.layerCount>1)this.app.confirm('改为单层将保留第1层并移除其他层，可撤销。继续？',()=>this.apply(()=>{const m=this.editorDoc.toMapData();m.layers=m.layers.slice(0,1);m.layerCount=1;m.multiLayerMode=false;m.stairs=[];this.workspace.replace(m);}));});
        on('editor-clear-entities',()=>this.apply(()=>{this.editorDoc.clearWalls();this.editorDoc.clearEntities();}));
        on('editor-clear',()=>this.apply(()=>{this.editorDoc.clearWalls();this.editorDoc.clearAllGrids();}));
        on('editor-fill',()=>this.fillLayer());
        on('editor-save-draft',()=>this.app.saveDraft());on('solve-edited-map-btn',()=>this.app.solveEditor());
        for(const type of ['pointerdown','pointermove','pointerup','pointercancel'])this.canvas.addEventListener(type,e=>this.pointer(e));
        this.canvas.addEventListener('lostpointercapture',e=>{if(this.gesture&&this.gesture.pointerId===e.pointerId)this.cancelGesture();});
        this.canvas.addEventListener('pointerleave',e=>{if(!this.gesture){if(e.pointerType!=='touch')this.properties.closeSoon();this.hover=null;if(this.visible)this.draw();}});
        this.canvas.addEventListener('contextmenu',e=>{if(this.visible)e.preventDefault();});
        this.canvas.addEventListener('wheel',e=>{if(!this.visible)return;e.preventDefault();this.zoom(e.deltaY>0?.9:1.1,e.clientX,e.clientY);},{passive:false});
        window.addEventListener('blur',()=>this.cancelGesture());
    }
    addLayer(){this.apply(()=>{const m=this.editorDoc.toMapData();if(m.layers.length>=10)throw new Error('最多10层');const empty=()=>({type:0,keys:0});m.layers.push({hWalls:Array.from({length:m.height+1},()=>Array.from({length:m.width},empty)),vWalls:Array.from({length:m.height},()=>Array.from({length:m.width+1},empty)),activeCells:Array.from({length:m.height},(_,y)=>Array.from({length:m.width},(_,x)=>x>=this.workspace.frame.x&&x<this.workspace.frame.x+this.workspace.frame.width&&y>=this.workspace.frame.y&&y<this.workspace.frame.y+this.workspace.frame.height)),ghosts:[],items:[],buttons:[],customStartPos:null,endPos:null});m.layerCount=m.layers.length;m.multiLayerMode=true;this.workspace.replace(m);this.editorDoc.switchLayer(m.layerCount-1);});}
    resizeFrame(){
        const w=Number(document.getElementById('editor-width').value),h=Number(document.getElementById('editor-height').value),loss=this.workspace.resizeLoss(w,h);
        const resize=()=>this.apply(()=>this.workspace.resize(w,h),true);
        if(loss.cells||loss.entities)this.app.confirm(`缩小范围将删除 ${loss.cells} 格和 ${loss.entities} 个元件，可撤销。继续？`,resize);else resize();
    }
    adapt(){this.properties.hide();this.apply(()=>{const map=this.editorDoc.toMapData(),b=mapBounds(map);this.workspace.replace(reshapeMap(map,Math.max(8,b.width),Math.max(8,b.height),-b.x,-b.y));this.workspace.frame={x:0,y:0,width:b.width,height:b.height};},true);}
    removeLayer(){if(this.editorDoc.layerCount<=1)return;this.app.confirm('删除顶层及其相连楼梯，可撤销。继续？',()=>{this.properties.hide();this.apply(()=>{const m=this.editorDoc.toMapData(),layer=this.editorDoc.currentLayer;m.layers.pop();m.layerCount=m.layers.length;m.multiLayerMode=m.layerCount>1;m.stairs=m.stairs.filter(s=>s.layer<m.layerCount&&s.layer+(s.direction==='up'?1:-1)<m.layerCount);this.workspace.replace(m);this.editorDoc.switchLayer(Math.min(layer,m.layerCount-1));});});}
    switchToLayer(index){if(index<0||index>=this.editorDoc.layerCount)return;this.cancelGesture();this.editorDoc.saveCurrentLayer();this.editorDoc.switchLayer(index);this.sync();}
    fillLayer(){this.properties.hide();this.apply(()=>{const d=this.editorDoc,f=this.workspace.frame;
        const wallFor=b=>b.direction.dx?{type:'v',x:b.x+(b.direction.dx===1?1:0),y:b.y}:{type:'h',x:b.x,y:b.y+(b.direction.dy===1?1:0)};
        const anchors=d.buttons.map(wallFor).filter(w=>!isInteriorWall(w,d.width,d.height,d.activeCells));
        for(let y=f.y;y<f.y+f.height;y++)for(let x=f.x;x<f.x+f.width;x++)d.activeCells[y][x]=true;
        // 填充后变为内部的旧边界按钮，仍保留实体墙依附。
        for(const w of anchors)if(isInteriorWall(w,d.width,d.height,d.activeCells)&&d[w.type+'Walls'][w.y][w.x].type===W.EMPTY)d[w.type+'Walls'][w.y][w.x]={type:W.SOLID,keys:0};
    });}
    undo(){this.properties.hide();if(this.workspace.undo()){this.changed();this.fit();}}
    redo(){this.properties.hide();if(this.workspace.redo()){this.changed();this.fit();}}
    notify(message){this.app.notify(message,'error');}
    code(){return this.workspace.originalCode?{success:true,code:this.workspace.originalCode}:DataSerializer.generateShareCode(this.editorDoc.toMapData());}
    changed(){this.app.editorChanged(this);this.sync();}
    sync(){
        const d=this.editorDoc;document.getElementById('editor-width').value=this.workspace.frame.width;document.getElementById('editor-height').value=this.workspace.frame.height;
        document.getElementById('editor-initial-health').value=d.initialHealth;document.getElementById('initial-health-container').hidden=d.gameMode!=='exploration';
        for(const mode of ['death-loop','exploration'])document.getElementById('editor-mode-'+mode+'-btn').classList.toggle('secondary',d.gameMode!==mode);
        document.getElementById('layer-mode-single-btn').classList.toggle('secondary',d.layerCount!==1);document.getElementById('layer-mode-multi-btn').classList.toggle('secondary',d.layerCount===1);
        document.getElementById('tool-stair').hidden=d.layerCount===1;
        document.querySelectorAll('[data-editor-tool]').forEach(b=>{b.classList.toggle('active',b.dataset.editorTool===this.tool);b.setAttribute('aria-pressed',String(b.dataset.editorTool===this.tool));});
        for(const mode of ['death-loop','exploration'])document.getElementById('editor-mode-'+mode+'-btn').setAttribute('aria-pressed',String(d.gameMode===mode));
        document.getElementById('editor-undo').disabled=!this.workspace.undoStack.length;document.getElementById('editor-redo').disabled=!this.workspace.redoStack.length;
        if(this.visible){this.app.renderLayers();this.draw();}
    }
    fit(){const f=this.workspace.frame;this.view.scale=Math.min((this.canvas.width-56)/f.width,(this.canvas.height-56)/f.height,180*(devicePixelRatio||1));this.view.x=(this.canvas.width-f.width*this.view.scale)/2-f.x*this.view.scale;this.view.y=(this.canvas.height-f.height*this.view.scale)/2-f.y*this.view.scale;if(this.visible)this.draw();}
    zoom(factor,cx=null,cy=null){const r=this.canvas.getBoundingClientRect(),x=cx===null?this.canvas.width/2:(cx-r.left)*this.canvas.width/r.width,y=cy===null?this.canvas.height/2:(cy-r.top)*this.canvas.height/r.height;const scale=Math.max(10,Math.min(700,this.view.scale*factor)),ratio=scale/this.view.scale;this.view.x=x-(x-this.view.x)*ratio;this.view.y=y-(y-this.view.y)*ratio;this.view.scale=scale;this.draw();}
    draw(){
        const d=this.editorDoc,colors=getColorsFromCSS();
        const v=computeEditorView(d,{canvas:this.canvas,staticLayerCanvas:this.staticLayerCanvas,state:'editor',cellSize:this.view.scale,colors,padding:0,editor:{active:true,mode:'free',tool:this.tool,isDragging:!!this.gesture,stairPlacement:this.gesture?.stairPreview||null,hoveredWall:this.hover&&['wall','door','lock','oneway','glass','letter'].includes(this.tool)?this.wallAt(this.hover):null,isRightClickErasing:this.tool==='eraser',rightClickMousePos:this.hover?{x:this.hover.x*this.view.scale,y:this.hover.y*this.view.scale}:null}});
        v.editor.mode='free';v.offsetX=this.view.x;v.offsetY=this.view.y;v.workspaceFrame=this.workspace.frame;Renderer.drawEditor(this.ctx,v);this.properties.position();
    }
    position(e){const r=this.canvas.getBoundingClientRect(),px=(e.clientX-r.left)*this.canvas.width/r.width,py=(e.clientY-r.top)*this.canvas.height/r.height;return {px,py,x:(px-this.view.x)/this.view.scale,y:(py-this.view.y)/this.view.scale};}
    wallAt(p){const x=Math.round(p.x),y=Math.round(p.y);return Math.abs(p.x-x)<Math.abs(p.y-y)?{type:'v',x,y:Math.floor(p.y)}:{type:'h',x:Math.floor(p.x),y};}
    direction(p,w){return w.type==='h'?{dx:0,dy:p.y>w.y?1:-1}:{dx:p.x>w.x?1:-1,dy:0};}
    stairDirection(p,x,y){const d=this.editorDoc;d.saveCurrentLayer();let dir=p.y-y<.5?'up':'down';const valid=v=>!!d.layers[d.currentLayer+(v==='up'?1:-1)]?.activeCells[y]?.[x];if(!valid(dir))dir=dir==='up'?'down':'up';return valid(dir)?dir:null;}
    cancelGesture(){this.properties.hide();if(this.workspace.pending){this.workspace.cancel();if(this.gesture?.initialView)this.view={...this.gesture.initialView};}this.points.clear();this.pinch=null;this.gesture=null;this.hover=null;if(this.temporaryTool){this.tool=this.temporaryTool;this.temporaryTool=null;}if(this.visible)this.sync();}
    pointer(e){
        if(!this.visible)return;e.preventDefault();const p=this.position(e);this.hover=p;
        if(e.type==='pointerdown'){
            this.properties.hide();
            this.canvas.setPointerCapture(e.pointerId);this.points.set(e.pointerId,{x:e.clientX,y:e.clientY});
            if(this.points.size===2){if(this.workspace.pending){this.workspace.cancel();this.view={...this.gesture.initialView};}this.gesture=null;const[a,b]=[...this.points.values()];this.pinch={distance:Math.hypot(a.x-b.x,a.y-b.y),x:(a.x+b.x)/2,y:(a.y+b.y)/2};this.draw();return;}
            if(this.points.size>2)return;
            if(e.button===1||e.button===2){this.temporaryTool=this.tool;this.tool=e.button===1?'pan':'eraser';this.sync();}
            this.gesture={pointerId:e.pointerId,start:{...p},last:p,client:{x:e.clientX,y:e.clientY},initialView:{...this.view},drag:false,tool:this.tool,line:this.wallAt(p),seen:new Set()};
            if(this.tool!=='pan'){this.workspace.begin();if(['wall','glass','oneway','grid','eraser'].includes(this.tool))this.paint(p,false);if(this.tool==='stair'){const x=Math.floor(p.x),y=Math.floor(p.y),dir=this.stairDirection(p,x,y);this.gesture.stairPreview=dir?{x,y,layer:this.editorDoc.currentLayer,direction:dir}:null;}}
            return;
        }
        if(e.type==='pointercancel'){this.cancelGesture();return;}
        if(e.type==='pointermove'){
            if(!this.points.has(e.pointerId)){this.properties.hover(p);this.draw();return;}this.points.set(e.pointerId,{x:e.clientX,y:e.clientY});
            if(this.pinch&&this.points.size>=2){const[a,b]=[...this.points.values()],distance=Math.hypot(a.x-b.x,a.y-b.y),x=(a.x+b.x)/2,y=(a.y+b.y)/2;this.zoom(distance/Math.max(1,this.pinch.distance),x,y);const r=this.canvas.getBoundingClientRect();this.view.x+=(x-this.pinch.x)*this.canvas.width/r.width;this.view.y+=(y-this.pinch.y)*this.canvas.height/r.height;this.pinch={distance,x,y};this.draw();return;}
            const g=this.gesture;if(!g)return;if(Math.hypot(e.clientX-g.client.x,e.clientY-g.client.y)>6)g.drag=true;
            if(!g.drag&&g.tool!=='oneway')return;
            if(g.tool==='pan'){this.view.x+=p.px-g.last.px;this.view.y+=p.py-g.last.py;}
            else if(g.tool==='stair'){const s=g.stairPreview;if(s){s.direction=this.stairDirection(p,s.x,s.y)||s.direction;}}
            else this.paint(p,true);g.last=p;this.draw();return;
        }
        if(e.type==='pointerup'){
            this.points.delete(e.pointerId);if(this.pinch){if(!this.points.size)this.pinch=null;return;}
            const g=this.gesture;if(!g)return;
            try{if(g.tool!=='pan'){if(g.tool==='stair')this.paint({...p,x:g.start.x,y:g.start.y},false);else if(!g.drag&&!['wall','glass','oneway','grid','eraser'].includes(g.tool))this.paint(p,false);const changed=this.workspace.commit();if(changed)this.changed();}}
            catch(error){this.workspace.cancel();this.notify(error.message);}this.gesture=null;if(e.pointerType==='touch')this.hover=null;if(this.temporaryTool){this.tool=this.temporaryTool;this.temporaryTool=null;}this.sync();if(g.editTarget)this.properties.show(g.editTarget);
        }
    }
    paint(p,drag){
        const g=this.gesture;if(!g||!this.workspace.pending)return;let x=Math.floor(p.x),y=Math.floor(p.y),d=this.editorDoc;
        try{
            if(['wall','glass','door','letter','lock','oneway'].includes(g.tool)){
                let w=g.tool==='oneway'&&drag?g.line:this.wallAt(p);
                if(drag&&['wall','glass'].includes(g.tool))w=g.line.type==='h'?{type:'h',x:Math.floor(p.x),y:g.line.y}:{type:'v',x:g.line.x,y:Math.floor(p.y)};
                if(drag&&['wall','glass'].includes(g.tool)){const from=g.line.type==='h'?g.line.x:g.line.y,to=Math.max(0,Math.min(w.type==='h'?d.width-1:d.height-1,w.type==='h'?w.x:w.y));for(let at=Math.min(from,to);at<=Math.max(from,to);at++){const s=w.type==='h'?{type:'h',x:at,y:w.y}:{type:'v',x:w.x,y:at};if(isInteriorWall(s,d.width,d.height,d.activeCells))this.workspace.setWall(s,{type:g.tool==='wall'?W.SOLID:W.GLASS,keys:0});}g.validPaint=true;this.draw();return;}
                if(!isInteriorWall(w,d.width,d.height,d.activeCells))throw new Error('边界只能是墙，请先绘制相邻地板');
                const key=`${w.type}:${w.x}:${w.y}`;if(g.tool!=='oneway'&&g.seen.has(key))return;g.seen.add(key);
                const old=d[w.type+'Walls'][w.y][w.x];let value={type:W.SOLID,keys:0};
                if(['wall','glass'].includes(g.tool))value.type=old.type===(g.tool==='glass'?W.GLASS:W.SOLID)?W.EMPTY:g.tool==='glass'?W.GLASS:W.SOLID;
                else if(g.tool==='door')value.type=old.type===W.DOOR?W.EMPTY:W.DOOR;
                else if(g.tool==='oneway'){value={type:W.ONE_WAY,direction:this.direction(p,w),keys:0};g.line=w;}
                else if(g.tool==='letter')value=old.type===W.LETTER_DOOR?{...old,initialState:old.initialState==='open'?'closed':'open'}:{type:W.LETTER_DOOR,letter:this.lastValues.letter,initialState:'closed',keys:0};
                else value=old.type===W.LOCKED?{...old}:{type:W.LOCKED,keys:this.lastValues.lock};
                if(['letter','lock'].includes(g.tool))g.editTarget={...w,kind:g.tool,layer:d.currentLayer};
                this.workspace.setWall(w,value);g.validPaint=true;this.draw();return;
            }
            const key=x+','+y;if(g.tool!=='eraser'&&g.seen.has(key))return;g.seen.add(key);
            if(g.tool==='eraser'){d.eraseAt({x:p.x,y:p.y},1);g.validPaint=true;this.draw();return;}
            if(g.tool==='button'){
                if(!d.activeCells[y]?.[x])throw new Error('按钮需要活动格');const w=this.wallAt(p);
                const direction=w.type==='h'?{dx:0,dy:w.y===y?-1:1}:{dx:w.x===x?-1:1,dy:0},wall=d[w.type+'Walls'][w.y]?.[w.x];if(isInteriorWall(w,d.width,d.height,d.activeCells)&&wall.type!==W.SOLID)throw new Error('按钮只能依附实墙');
                const old=d.buttons.find(b=>b.x===x&&b.y===y&&b.direction.dx===direction.dx&&b.direction.dy===direction.dy);if(!old)d.buttons.push({x,y,direction,letter:this.lastValues.button});
                g.editTarget={kind:'button',layer:d.currentLayer,x,y,dx:direction.dx,dy:direction.dy};g.validPaint=true;this.draw();return;
            }
            if(g.tool==='stair'){
                if(!d.activeCells[y]?.[x])throw new Error('请先绘制楼梯所在格');if(d.stairs.some(s=>s.layer===d.currentLayer&&s.x===x&&s.y===y))d.eraseStairAt(x,y,d.currentLayer);else {const dir=g.stairPreview?.direction||this.stairDirection(p,x,y);if(!dir||!d.placeStair(x,y,dir))throw new Error('相邻层同格需要地板，且不能占用现有元件');}g.validPaint=true;this.draw();return;
            }
            const a=this.workspace.ensure(x,y);if(a.dx||a.dy){this.view.x-=a.dx*this.view.scale;this.view.y-=a.dy*this.view.scale;g.start.x+=a.dx;g.start.y+=a.dy;g.line.x+=a.dx;g.line.y+=a.dy;}x=a.x;y=a.y;d=this.editorDoc;
            if(g.tool==='grid'){g.gridAction??=d.activeCells[y][x]?'remove':'add';if(g.gridAction==='remove')this.workspace.eraseCell(x,y);else d.toggleActiveCell(x,y,'add');}
            else{if(!d.activeCells[y][x])d.toggleActiveCell(x,y,'add');if(g.tool==='ghost'){const old=d.ghosts.find(v=>v.x===x&&v.y===y);if(old&&!drag)d.ghosts=d.ghosts.filter(v=>v!==old);else if(!old)d.ghosts.push({x,y});}else if(g.tool==='key'){const old=d.items.find(v=>v.x===x&&v.y===y);if(old&&!drag)d.items=d.items.filter(v=>v!==old);else if(!old)d.items.push({x,y,type:'key'});}else if(g.tool==='start'){d.saveCurrentLayer();for(const l of d.layers)l.customStartPos=null;d.customStartPos={x,y};d.playerLayer=d.currentLayer;}else if(g.tool==='end')d.endPos=d.endPos?.x===x&&d.endPos?.y===y?null:{x,y};}
            g.validPaint=true;this.draw();
        }catch(error){if(!g.validPaint)this.workspace.cancel();if(!g.error){g.error=true;this.notify(error.message);}}
    }
    handleKey(e){
        const k=e.key.toLowerCase();if(k==='f'){e.preventDefault();this.fit();}else if(['+','=','-','_'].includes(k)){e.preventDefault();this.zoom(k==='-'||k==='_'?.8:1.25);}else if(k==='escape'){this.cancelGesture();}
        else if(['arrowleft','a','arrowright','d'].includes(k)){e.preventDefault();const tools=[...document.querySelectorAll('[data-editor-tool]')].filter(b=>!b.hidden).map(b=>b.dataset.editorTool),index=tools.indexOf(this.tool),delta=['a','arrowleft'].includes(k)?-1:1;this.tool=tools[(index+delta+tools.length)%tools.length];this.sync();}
        else if(['arrowup','w','arrowdown','s'].includes(k)&&this.editorDoc.layerCount>1){e.preventDefault();const delta=['arrowup','w'].includes(k)?1:-1;this.switchToLayer((this.editorDoc.currentLayer+delta+this.editorDoc.layerCount)%this.editorDoc.layerCount);}
        else if(k===' '){e.preventDefault();this.switchToLayer(this.editorDoc.playerLayer);}
    }
}
