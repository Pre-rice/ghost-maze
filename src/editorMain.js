import { EditorWorkspace } from './editor/workspace.js';
import { DataSerializer } from './core/dataSerializer.js';
import { WALL_TYPES as W } from './core/constants.js';
import { isInteriorWall } from './core/mapDataUtils.js';
import { computeEditorView } from './view/viewSlice.js';
import * as Renderer from './view/renderer.js';
import { getColorsFromCSS } from './themeManager.js';

const names={pan:'平移视野',grid:'地板',wall:'墙',door:'普通门',lock:'数字门',oneway:'单向门',glass:'玻璃',letter:'字母门',button:'按钮',start:'出生点',end:'终点',ghost:'鬼',key:'钥匙',stair:'楼梯',eraser:'擦除'};
const tips={pan:'拖动平移；也可按住中键临时平移。',grid:'点击添加或移除地板，拖动沿用本笔操作；向外绘制会自动扩展。',wall:'点击切换墙，长按拖动保持一条直线。',glass:'点击切换玻璃，长按拖动保持一条直线。',oneway:'箭头指向鼠标或手指所在一侧，跨过原墙可改向。',button:'点击靠近实墙的位置放置按钮；再次点击相同按钮可移除。',stair:'点格子的上半部连接上一层，下半部连接下一层；拖动可改向。',eraser:'点击或拖动擦除元件；空格上擦除地板。'};
export class EditorApp {
    constructor(app){
        this.app=app;this.canvas=document.getElementById('game-canvas');this.ctx=this.canvas.getContext('2d');
        this.staticLayerCanvas=document.createElement('canvas');this.workspace=new EditorWorkspace();
        this.tool='wall';this.buttonFace='auto';this.view={x:0,y:0,scale:70};this.points=new Map();this.loaded=false;
        this.bind();
    }
    get editorDoc(){return this.workspace.doc;}
    get visible(){return this.app.view==='editor';}
    enter(map,code,snapshot=null){
        if(!this.loaded){this.workspace=new EditorWorkspace(map);this.workspace.originalCode=code||null;if(snapshot)this.workspace.restore(snapshot);this.loaded=true;this.fit();if(map&&this.app.game.cellSize)this.view={scale:this.app.game.cellSize,x:this.app.game.drawOffset.x,y:this.app.game.drawOffset.y};}
        this.sync();
    }
    apply(fn,fit=false){try{const changed=this.workspace.apply(fn);if(changed)this.changed();else this.sync();if(fit)this.fit();}catch(e){this.notify(e.message);this.sync();}}
    bind(){
        const on=(id,fn,event='click')=>document.getElementById(id).addEventListener(event,fn);
        document.querySelectorAll('[data-editor-tool]').forEach(b=>b.onclick=()=>{this.tool=b.dataset.editorTool;this.sync();});
        document.querySelectorAll('[data-button-face]').forEach(b=>b.onclick=()=>{this.buttonFace=b.dataset.buttonFace;this.sync();});
        on('editor-undo',()=>this.undo());on('editor-redo',()=>this.redo());on('editor-fit',()=>this.fit());
        for(const mode of ['death-loop','exploration'])on('editor-mode-'+mode+'-btn',()=>this.apply(()=>{this.editorDoc.gameMode=mode;}));
        on('editor-initial-health',e=>this.apply(()=>{const n=Number(e.target.value);if(!Number.isInteger(n)||n<1||n>0xffffffff)throw new Error('生命必须为正整数');this.editorDoc.initialHealth=n;}),'change');
        on('editor-resize',()=>{const w=Number(document.getElementById('editor-width').value),h=Number(document.getElementById('editor-height').value),loss=this.workspace.resizeLoss(w,h);const resize=()=>this.apply(()=>this.workspace.resize(w,h),true);if(loss.cells||loss.entities)this.app.confirm(`缩小范围将删除 ${loss.cells} 格和 ${loss.entities} 个元件，可撤销。继续？`,resize);else resize();});
        on('layer-mode-multi-btn',()=>{if(this.editorDoc.layerCount===1)this.addLayer();});
        on('layer-mode-single-btn',()=>{if(this.editorDoc.layerCount>1)this.app.confirm('改为单层将保留第1层并移除其他层，可撤销。继续？',()=>this.apply(()=>{const m=this.editorDoc.toMapData();m.layers=m.layers.slice(0,1);m.layerCount=1;m.multiLayerMode=false;m.stairs=[];this.workspace.replace(m);}));});
        on('layer-add-btn',()=>this.addLayer());on('layer-remove-btn',()=>this.app.confirm('删除顶层和相关楼梯，可撤销。继续？',()=>this.apply(()=>{const m=this.editorDoc.toMapData();if(m.layers.length===1)return;m.layers.pop();m.layerCount=m.layers.length;m.multiLayerMode=m.layerCount>1;m.stairs=m.stairs.filter(s=>s.layer<m.layerCount&&s.layer+(s.direction==='up'?1:-1)<m.layerCount);this.workspace.replace(m);})));
        on('editor-new',()=>this.app.confirm('新建空白草稿，可撤销。继续？',()=>this.apply(()=>{this.workspace.replace(new EditorWorkspace().doc.toMapData());this.workspace.frame={x:0,y:0,width:1,height:1};},true)));
        on('editor-clear',()=>this.app.confirm('清空当前层，可撤销。继续？',()=>this.apply(()=>{const d=this.editorDoc;d.stairs=d.stairs.filter(s=>s.layer!==d.currentLayer&&s.layer+(s.direction==='up'?1:-1)!==d.currentLayer);d.clearAllGrids();})));
        on('editor-save-draft',()=>this.app.saveDraft());on('solve-edited-map-btn',()=>this.app.solveEditor());
        for(const type of ['pointerdown','pointermove','pointerup','pointercancel'])this.canvas.addEventListener(type,e=>this.pointer(e));
        this.canvas.addEventListener('lostpointercapture',e=>{if(this.gesture&&this.gesture.pointerId===e.pointerId)this.cancelGesture();});
        this.canvas.addEventListener('pointerleave',()=>{if(!this.gesture){this.hover=null;if(this.visible)this.draw();}});
        this.canvas.addEventListener('contextmenu',e=>{if(this.visible)e.preventDefault();});
        this.canvas.addEventListener('wheel',e=>{if(!this.visible)return;e.preventDefault();this.zoom(e.deltaY>0?.9:1.1,e.clientX,e.clientY);},{passive:false});
        window.addEventListener('blur',()=>this.cancelGesture());
    }
    addLayer(){this.apply(()=>{const m=this.editorDoc.toMapData();if(m.layers.length>=10)throw new Error('最多10层');const empty=()=>({type:0,keys:0});m.layers.push({hWalls:Array.from({length:m.height+1},()=>Array.from({length:m.width},empty)),vWalls:Array.from({length:m.height},()=>Array.from({length:m.width+1},empty)),activeCells:Array.from({length:m.height},()=>Array(m.width).fill(false)),ghosts:[],items:[],buttons:[],customStartPos:null,endPos:null});m.layerCount=m.layers.length;m.multiLayerMode=true;this.workspace.replace(m);this.editorDoc.switchLayer(m.layerCount-1);});}
    undo(){if(this.workspace.undo()){this.changed();this.fit();}}
    redo(){if(this.workspace.redo()){this.changed();this.fit();}}
    notify(message){this.app.notify(message,'error');}
    code(){return this.workspace.originalCode?{success:true,code:this.workspace.originalCode}:DataSerializer.generateShareCode(this.editorDoc.toMapData());}
    changed(){this.app.editorChanged(this);this.sync();}
    sync(){
        const d=this.editorDoc;document.getElementById('editor-width').value=this.workspace.frame.width;document.getElementById('editor-height').value=this.workspace.frame.height;
        document.getElementById('editor-initial-health').value=d.initialHealth;document.getElementById('initial-health-container').hidden=d.gameMode!=='exploration';
        for(const mode of ['death-loop','exploration'])document.getElementById('editor-mode-'+mode+'-btn').classList.toggle('secondary',d.gameMode!==mode);
        document.getElementById('layer-mode-single-btn').classList.toggle('secondary',d.layerCount!==1);document.getElementById('layer-mode-multi-btn').classList.toggle('secondary',d.layerCount===1);
        document.getElementById('editor-layer-actions').hidden=d.layerCount===1;document.getElementById('tool-stair').hidden=d.layerCount===1;
        document.getElementById('editor-tool-title').textContent=names[this.tool];document.getElementById('editor-tool-tip').textContent=tips[this.tool]||'点击放置，再次点击同一元件可以移除。';
        document.querySelectorAll('[data-editor-tool]').forEach(b=>b.classList.toggle('active',b.dataset.editorTool===this.tool));
        document.querySelector('.letter-setting').hidden=!['letter','button'].includes(this.tool);document.querySelector('.keys-setting').hidden=this.tool!=='lock';document.querySelector('.door-initial-setting').hidden=this.tool!=='letter';document.getElementById('editor-button-face').hidden=this.tool!=='button';
        document.querySelectorAll('[data-button-face]').forEach(b=>b.classList.toggle('active',b.dataset.buttonFace===this.buttonFace));
        document.getElementById('editor-undo').disabled=!this.workspace.undoStack.length;document.getElementById('editor-redo').disabled=!this.workspace.redoStack.length;
        const result=this.code();document.getElementById('editor-status').textContent=result.success?'编辑后链接实时更新':'草稿未完成，仍可保存；完成校验后可游玩';
        if(this.visible){this.app.renderLayers();this.draw();}
    }
    fit(){const f=this.workspace.frame;this.view.scale=Math.min((this.canvas.width-56)/f.width,(this.canvas.height-56)/f.height,180*(devicePixelRatio||1));this.view.x=(this.canvas.width-f.width*this.view.scale)/2-f.x*this.view.scale;this.view.y=(this.canvas.height-f.height*this.view.scale)/2-f.y*this.view.scale;if(this.visible)this.draw();}
    zoom(factor,cx=null,cy=null){const r=this.canvas.getBoundingClientRect(),x=cx===null?this.canvas.width/2:(cx-r.left)*this.canvas.width/r.width,y=cy===null?this.canvas.height/2:(cy-r.top)*this.canvas.height/r.height;const scale=Math.max(10,Math.min(700,this.view.scale*factor)),ratio=scale/this.view.scale;this.view.x=x-(x-this.view.x)*ratio;this.view.y=y-(y-this.view.y)*ratio;this.view.scale=scale;this.draw();}
    draw(){
        const d=this.editorDoc,colors=getColorsFromCSS();
        const v=computeEditorView(d,{canvas:this.canvas,staticLayerCanvas:this.staticLayerCanvas,state:'editor',cellSize:this.view.scale,colors,padding:0,editor:{active:true,mode:'free',tool:this.tool,isDragging:!!this.gesture,stairPlacement:this.gesture?.stairPreview||null,hoveredWall:this.hover&&['wall','door','lock','oneway','glass','letter'].includes(this.tool)?this.wallAt(this.hover):null,isRightClickErasing:this.tool==='eraser',rightClickMousePos:this.hover?{x:this.hover.x*this.view.scale,y:this.hover.y*this.view.scale}:null}});
        v.editor.mode='free';v.offsetX=this.view.x;v.offsetY=this.view.y;v.workspaceFrame=this.workspace.frame;Renderer.drawEditor(this.ctx,v);
    }
    position(e){const r=this.canvas.getBoundingClientRect(),px=(e.clientX-r.left)*this.canvas.width/r.width,py=(e.clientY-r.top)*this.canvas.height/r.height;return {px,py,x:(px-this.view.x)/this.view.scale,y:(py-this.view.y)/this.view.scale};}
    wallAt(p){const x=Math.round(p.x),y=Math.round(p.y);return Math.abs(p.x-x)<Math.abs(p.y-y)?{type:'v',x,y:Math.floor(p.y)}:{type:'h',x:Math.floor(p.x),y};}
    direction(p,w){return w.type==='h'?{dx:0,dy:p.y>w.y?1:-1}:{dx:p.x>w.x?1:-1,dy:0};}
    stairDirection(p,x,y){const d=this.editorDoc;d.saveCurrentLayer();let dir=p.y-y<.5?'up':'down';const valid=v=>!!d.layers[d.currentLayer+(v==='up'?1:-1)]?.activeCells[y]?.[x];if(!valid(dir))dir=dir==='up'?'down':'up';return valid(dir)?dir:null;}
    cancelGesture(){if(this.workspace.pending){this.workspace.cancel();if(this.gesture?.initialView)this.view={...this.gesture.initialView};}this.points.clear();this.pinch=null;this.gesture=null;this.hover=null;if(this.temporaryTool){this.tool=this.temporaryTool;this.temporaryTool=null;}if(this.visible)this.sync();}
    pointer(e){
        if(!this.visible)return;e.preventDefault();const p=this.position(e);this.hover=p;
        if(e.type==='pointerdown'){
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
            if(!this.points.has(e.pointerId)){this.draw();return;}this.points.set(e.pointerId,{x:e.clientX,y:e.clientY});
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
            catch(error){this.workspace.cancel();this.notify(error.message);}this.gesture=null;if(e.pointerType==='touch')this.hover=null;if(this.temporaryTool){this.tool=this.temporaryTool;this.temporaryTool=null;}this.sync();
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
                else if(g.tool==='letter')value={type:W.LETTER_DOOR,letter:document.getElementById('editor-letter').value,initialState:document.getElementById('editor-door-state').value,keys:0};
                else{const keys=Number(document.getElementById('editor-keys').value);if(!Number.isInteger(keys)||keys<0||keys>0xffffffff)throw new Error('钥匙数量必须为非负整数');value={type:W.LOCKED,keys};}
                if(g.tool==='letter'&&old.type===value.type&&old.letter===value.letter&&old.initialState===value.initialState)value={type:W.EMPTY,keys:0};if(g.tool==='lock'&&old.type===value.type&&old.keys===value.keys)value={type:W.EMPTY,keys:0};
                this.workspace.setWall(w,value);g.validPaint=true;this.draw();return;
            }
            const key=x+','+y;if(g.seen.has(key))return;g.seen.add(key);
            if(g.tool==='eraser'){
                const wall=this.wallAt(p),near=Math.min(Math.abs(p.x-Math.round(p.x)),Math.abs(p.y-Math.round(p.y)))<.2;
                if(near&&isInteriorWall(wall,d.width,d.height,d.activeCells))this.workspace.setWall(wall,{type:W.EMPTY,keys:0});
                else if(d.activeCells[y]?.[x]){if(d.stairs.some(s=>s.layer===d.currentLayer&&s.x===x&&s.y===y))d.eraseStairAt(x,y,d.currentLayer);else {const occupied=[...d.ghosts,...d.items,...d.buttons,d.customStartPos,d.endPos].filter(Boolean).some(v=>v.x===x&&v.y===y);if(occupied){d.ghosts=d.ghosts.filter(v=>v.x!==x||v.y!==y);d.items=d.items.filter(v=>v.x!==x||v.y!==y);d.buttons=d.buttons.filter(v=>v.x!==x||v.y!==y);if(d.customStartPos?.x===x&&d.customStartPos?.y===y)d.customStartPos=null;if(d.endPos?.x===x&&d.endPos?.y===y)d.endPos=null;}else this.workspace.eraseCell(x,y);}}
                g.validPaint=true;this.draw();return;
            }
            if(g.tool==='button'){
                if(!d.activeCells[y]?.[x])throw new Error('按钮需要活动格');const fixed={up:{dx:0,dy:-1},right:{dx:1,dy:0},down:{dx:0,dy:1},left:{dx:-1,dy:0}}[this.buttonFace];const w=fixed?(fixed.dx?{type:'v',x:x+(fixed.dx===1?1:0),y}:{type:'h',x,y:y+(fixed.dy===1?1:0)}):this.wallAt(p);
                const direction=fixed||(w.type==='h'?{dx:0,dy:w.y===y?-1:1}:{dx:w.x===x?-1:1,dy:0}),wall=d[w.type+'Walls'][w.y]?.[w.x];if(isInteriorWall(w,d.width,d.height,d.activeCells)&&wall.type!==W.SOLID)throw new Error('按钮只能依附实墙');
                const letter=document.getElementById('editor-letter').value,old=d.buttons.find(b=>b.x===x&&b.y===y&&b.direction.dx===direction.dx&&b.direction.dy===direction.dy);d.buttons=d.buttons.filter(b=>b!==old);if(!old||old.letter!==letter)d.buttons.push({x,y,direction,letter});g.validPaint=true;this.draw();return;
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
        else if(['arrowup','w','arrowdown','s'].includes(k)&&this.editorDoc.layerCount>1){e.preventDefault();const delta=['arrowup','w'].includes(k)?1:-1;this.editorDoc.switchLayer((this.editorDoc.currentLayer+delta+this.editorDoc.layerCount)%this.editorDoc.layerCount);this.sync();}
        else if(k===' '){e.preventDefault();this.editorDoc.switchLayer(this.editorDoc.playerLayer);this.sync();}
    }
}
