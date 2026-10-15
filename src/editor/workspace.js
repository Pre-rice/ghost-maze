import {
    EditorDocument
} from './editorSession.js';
import {
    normalizeMapData, isInteriorWall
} from '../core/mapDataUtils.js';
import {
    WALL_TYPES as W
} from '../core/constants.js';
const empty = () => ({
    type:W.EMPTY,keys:0
});
export function mapBounds(map) {
    let minX=Infinity,minY=Infinity,maxX=-1,maxY=-1;
    for(const l of map.layers)l.activeCells.forEach((row,y)=>row.forEach((a,x)=>{
        if(a){
            minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
        }
    }));
    return maxX<0?{
        x:0,y:0,width:1,height:1
    }:{
        x:minX,y:minY,width:maxX-minX+1,height:maxY-minY+1
    };
} /** 所有层与楼梯同步移位／裁切；从不因调整大小清空作品。草稿允许缺起终点。 */
export function reshapeMap(source,width,height,dx=0,dy=0,clip=null) {
    if(width<8||height<8||width>20||height>20)throw new Error('地图范围最多20×20');
    const inside=(x,y)=>x>=0&&y>=0&&x<width&&y<height&&(!clip||(x>=clip.x&&y>=clip.y&&x<clip.x+clip.width&&y<clip.y+clip.height));
    const map=structuredClone(source);
    map.width=width;
    map.height=height;
    map.layers=source.layers.map(l=>{
        const activeCells=Array.from({
            length:height
        },()=>Array(width).fill(false)),hWalls=Array.from({
            length:height+1
        },()=>Array.from({
            length:width
        },empty)),vWalls=Array.from({
            length:height
        },()=>Array.from({
            length:width+1
        },empty));         l.activeCells.forEach((row,y)=>row.forEach((a,x)=>{
            if(a&&inside(x+dx,y+dy))activeCells[y+dy][x+dx]=true;
        }));         for(const axis of ['h','v'])l[axis+'Walls'].forEach((row,y)=>row.forEach((w,x)=>{
            const nx=x+dx,ny=y+dy;const target=axis==='h'?hWalls:vWalls;if(target[ny]?.[nx])target[ny][nx]=structuredClone(w);
        }));         const point=p=>p&&inside(p.x+dx,p.y+dy)&&activeCells[p.y+dy]?.[p.x+dx]?{
            ...p,x:p.x+dx,y:p.y+dy
        }:null;         return {
            ...l,activeCells,hWalls,vWalls,ghosts:l.ghosts.map(point).filter(Boolean),items:l.items.map(point).filter(Boolean),buttons:l.buttons.map(point).filter(Boolean),customStartPos:point(l.customStartPos),endPos:point(l.endPos)
        };
    });
    map.stairs=source.stairs.map(s=>({
        ...s,x:s.x+dx,y:s.y+dy
    })).filter(s=>inside(s.x,s.y)&&map.layers[s.layer].activeCells[s.y]?.[s.x]&&map.layers[s.layer+(s.direction==='up'?1:-1)]?.activeCells[s.y]?.[s.x]);
    return normalizeMapData(map);
} export class EditorWorkspace {
    constructor(map) {
        this.doc=map?EditorDocument.fromMapData(map):EditorDocument.blank(8,8,'free');
        if(!map){
            this.doc.clearAllGrids();
            this.doc.gameMode='death-loop';
        }this.frame=mapBounds(this.doc.toMapData());
        this.undoStack=[];
        this.redoStack=[];
        this.originalCode=null;
    }
    snapshot(){
        return {
            map:this.doc.toMapData(),frame:{
                ...this.frame
            },layer:this.doc.currentLayer,originalCode:this.originalCode
        };
    }
    restore(s){
        this.doc=EditorDocument.fromMapData(s.map);
        this.doc.switchLayer(Math.min(s.layer,this.doc.layerCount-1));
        this.frame={
            ...s.frame
        };
        this.originalCode=s.originalCode;
    }
    begin(){
        this.pending=this.snapshot();
        this.doc.mode='free';
    }
    commit(){
        if(!this.pending)return false;
        const before=this.pending;
        this.pending=null;
        const compared=this.doc.toMapData();
        compared.editorMode=before.map.editorMode;
        if(JSON.stringify(before.map)===JSON.stringify(compared)&&JSON.stringify(before.frame)===JSON.stringify(this.frame)){
            this.restore(before);
            return false;
        }this.undoStack.push(before);
        if(this.undoStack.length>100)this.undoStack.shift();
        this.redoStack=[];
        this.originalCode=null;
        return true;
    }
    cancel(){
        if(this.pending){
            this.restore(this.pending);
            this.pending=null;
        }
    }
    undo(){
        if(!this.undoStack.length)return false;
        this.redoStack.push(this.snapshot());
        this.restore(this.undoStack.pop());
        return true;
    }
    redo(){
        if(!this.redoStack.length)return false;
        this.undoStack.push(this.snapshot());
        this.restore(this.redoStack.pop());
        return true;
    }
    apply(fn){
        this.begin();
        try{
            fn();
            return this.commit();
        }catch(e){
            this.cancel();
            throw e;
        }
    }
    replace(map){
        const layer=this.doc.currentLayer;
        this.doc=EditorDocument.fromMapData(map);
        this.doc.switchLayer(Math.min(layer,this.doc.layerCount-1));
    }
    ensure(x,y){
        const map=this.doc.toMapData(),hasCells=map.layers.some(l=>l.activeCells.some(r=>r.some(Boolean))),b=hasCells?mapBounds(map):{
            x,y,width:1,height:1
        };
        const minX=Math.min(b.x,x),minY=Math.min(b.y,y),maxX=Math.max(b.x+b.width-1,x),maxY=Math.max(b.y+b.height-1,y);
        if(maxX-minX>=20||maxY-minY>=20)throw new Error('地图范围最多20×20');
        const dx=minX<0||maxX>=20?-minX:0,dy=minY<0||maxY>=20?-minY:0,width=Math.max(8,maxX+dx+1),height=Math.max(8,maxY+dy+1);
        if(dx||dy||width!==map.width||height!==map.height){
            this.replace(reshapeMap(map,width,height,dx,dy));
            this.frame.x+=dx;
            this.frame.y+=dy;
        }         const nx=x+dx,ny=y+dy,right=Math.max(this.frame.x+this.frame.width,nx+1),bottom=Math.max(this.frame.y+this.frame.height,ny+1);
        this.frame.x=Math.min(this.frame.x,nx);
        this.frame.y=Math.min(this.frame.y,ny);
        this.frame.width=right-this.frame.x;
        this.frame.height=bottom-this.frame.y;
        if(!hasCells||this.frame.x<0||this.frame.y<0||this.frame.x+this.frame.width>20||this.frame.y+this.frame.height>20)this.frame={
            x:minX+dx,y:minY+dy,width:maxX-minX+1,height:maxY-minY+1
        };
        return {
            x:nx,y:ny,dx,dy
        };
    }
    resize(width,height){
        if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>20||height>20)throw new Error('长和宽分别为1～20');
        const b=this.frame,dx=b.x+width>20?-b.x:0,dy=b.y+height>20?-b.y:0;
        const clip={
            x:b.x+dx,y:b.y+dy,width,height
        };
        this.replace(reshapeMap(this.doc.toMapData(),Math.max(8,clip.x+width),Math.max(8,clip.y+height),dx,dy,clip));
        this.frame=clip;
    }
    resizeLoss(width,height){
        const b=this.frame;
        let cells=0,entities=0;
        for(const l of this.doc.toMapData().layers){
            l.activeCells.forEach((row,y)=>row.forEach((a,x)=>{
                if(a&&(x>=b.x+width||y>=b.y+height))cells++;
            }));
            for(const p of [...l.ghosts,...l.items,...l.buttons,l.customStartPos,l.endPos].filter(Boolean))if(p.x>=b.x+width||p.y>=b.y+height)entities++;
        }return {
            cells,entities
        };
    }
    setWall(wall,value){
        if(value.type===W.LOCKED&&(!Number.isInteger(value.keys)||value.keys<0||value.keys>0xffffffff))throw new Error('钥匙数量必须为非负整数');
        if(value.type===W.LETTER_DOOR&&(!/^[A-Z]$/.test(value.letter)||!['open','closed'].includes(value.initialState)))throw new Error('字母门参数无效');
        const d=this.doc;
        if(!isInteriorWall(wall,d.width,d.height,d.activeCells))throw new Error('边界只能是墙；门需要位于两个活动格之间');
        if(value.type!==W.SOLID)d.buttons=d.buttons.filter(b=>!(wall.type==='h'?b.x===wall.x&&((b.y===wall.y&&b.direction.dy===-1)||(b.y===wall.y-1&&b.direction.dy===1)):b.y===wall.y&&((b.x===wall.x&&b.direction.dx===-1)||(b.x===wall.x-1&&b.direction.dx===1))));
        d.setWall(wall,value.type);
        const rows=wall.type==='h'?d.hWalls:d.vWalls;
        rows[wall.y][wall.x]={
            ...value
        };
    }
    eraseCell(x,y){
        this.doc.toggleActiveCell(x,y,'remove');
    }     moveRegion(rect,dx,dy,{
        copy=false,allLayers=false,source=null
    }={
    }) {
        const base=this.doc.toMapData(),packet=source??base,selected=p=>p&&p.x>=rect.x&&p.y>=rect.y&&p.x<rect.x+rect.width&&p.y<rect.y+rect.height;
        const targetX=rect.x+dx,targetY=rect.y+dy,shiftX=Math.max(0,-targetX),shiftY=Math.max(0,-targetY),width=Math.max(base.width+shiftX,targetX+shiftX+rect.width),height=Math.max(base.height+shiftY,targetY+shiftY+rect.height);
        let result=reshapeMap(base,width,height,shiftX,shiftY);
        const selectedLayers=allLayers?packet.layers.map((_,i)=>i):[this.doc.currentLayer];
        for(const li of selectedLayers){
            const old=packet.layers[li],dest=result.layers[li];
            if(!old||!dest)throw new Error('目标楼层不存在');
            if(copy&&(selected(old.customStartPos)||selected(old.endPos)))throw new Error('出生点和本层终点不能复制，请使用移动或缩小选区');
            const selectedCells=[];
            old.activeCells.forEach((row,y)=>row.forEach((a,x)=>{
                if(a&&selected({
                    x,y
                }))selectedCells.push({
                    x,y
                });
            }));
            for(const p of selectedCells){
                const x=p.x+dx+shiftX,y=p.y+dy+shiftY;
                if(dest.activeCells[y][x]&&(copy||!selected({
                    x:x-shiftX,y:y-shiftY
                })))throw new Error('目标区域已有地图，请先移开或选择空白位置');
            }             if(!copy){
                for(const p of selectedCells){
                    const x=p.x+shiftX,y=p.y+shiftY;
                    dest.activeCells[y][x]=false;
                    dest.hWalls[y][x]=empty();
                    dest.hWalls[y+1][x]=empty();
                    dest.vWalls[y][x]=empty();
                    dest.vWalls[y][x+1]=empty();
                }for(const name of ['ghosts','items','buttons'])dest[name]=dest[name].filter(p=>!selected({
                    x:p.x-shiftX,y:p.y-shiftY
                }));
                if(selected(old.customStartPos))dest.customStartPos=null;
                if(selected(old.endPos))dest.endPos=null;
            }             for(const p of selectedCells){
                const x=p.x+dx+shiftX,y=p.y+dy+shiftY;
                dest.activeCells[y][x]=true;
                for(const[axis,ox,oy]of[['h',0,0],['h',0,1],['v',0,0],['v',1,0]])dest[axis+'Walls'][y+oy][x+ox]=structuredClone(old[axis+'Walls'][p.y+oy][p.x+ox]);
            }             const moved=p=>({
                ...p,x:p.x+dx+shiftX,y:p.y+dy+shiftY
            });
            for(const name of ['ghosts','items','buttons'])dest[name].push(...old[name].filter(selected).map(moved));
            if(selected(old.customStartPos)&&!copy)dest.customStartPos=moved(old.customStartPos);
            if(selected(old.endPos))dest.endPos=moved(old.endPos);
        }         const selectedStairs=packet.stairs.filter(s=>selected(s)&&selectedLayers.includes(s.layer));
        if(selectedStairs.length&&!allLayers)throw new Error('包含楼梯的区域请选择全部楼层一起移动');
        if(!copy)result.stairs=result.stairs.filter(s=>!selectedLayers.includes(s.layer)||!selected({
            x:s.x-shiftX,y:s.y-shiftY
        }));
        result.stairs.push(...selectedStairs.map(s=>({
            ...s,x:s.x+dx+shiftX,y:s.y+dy+shiftY
        })));
        this.replace(normalizeMapData(result));
        this.frame=mapBounds(this.doc.toMapData());
        return {
            x:targetX+shiftX,y:targetY+shiftY,width:rect.width,height:rect.height
        };
    }
}
