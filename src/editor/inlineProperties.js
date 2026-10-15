import { WALL_TYPES as W } from '../core/constants.js';

/** 元件旁的即时输入。字母池在本次展开期间固定，避免改值时丢掉可循环的字母。 */
export class InlineProperties {
    constructor(editor) {
        this.editor=editor;this.host=editor.canvas.parentElement;
        this.element=document.createElement('div');this.element.className='element-popover';this.element.hidden=true;
        this.element.setAttribute('role','group');this.element.setAttribute('aria-label','编辑元件');
        this.input=document.createElement('input');this.input.id='element-value';this.open=false;
        this.input.autocomplete='off';this.input.spellcheck=false;this.element.append(this.input);this.host.append(this.element);
        this.input.addEventListener('input',()=>this.change());
        window.addEventListener('keydown',e=>{if(e.key==='Tab'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&this.open&&editor.visible&&!editor.app.dialogOpen){e.preventDefault();e.stopPropagation();this.cycle(e.shiftKey?-1:1);this.input.focus({preventScroll:true});this.input.select();}},true);
        this.input.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();this.hide();editor.canvas.focus();}});
        this.element.addEventListener('pointerenter',()=>clearTimeout(this.closeTimer));
        this.element.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')this.closeSoon();});
        document.addEventListener('pointerdown',e=>{if(!this.element.contains(e.target)&&e.target!==editor.canvas)this.hide();});
    }
    key(t){return t?JSON.stringify(t):'';}
    value(t=this.target){
        if(!t||this.editor.editorDoc.currentLayer!==t.layer)return null;
        const d=this.editor.editorDoc;
        if(t.kind==='button')return d.buttons.find(b=>b.x===t.x&&b.y===t.y&&b.direction.dx===t.dx&&b.direction.dy===t.dy)||null;
        const wall=d[t.type+'Walls'][t.y]?.[t.x];return wall?.type===(t.kind==='lock'?W.LOCKED:W.LETTER_DOOR)?wall:null;
    }
    at(p){
        const d=this.editor.editorDoc,layer=d.currentLayer;
        for(const b of d.buttons){const x=b.x+.5+b.direction.dx*.4,y=b.y+.5+b.direction.dy*.4;
            if(Math.abs(p.x-x)<.3&&Math.abs(p.y-y)<.25)return {kind:'button',layer,x:b.x,y:b.y,dx:b.direction.dx,dy:b.direction.dy};}
        const w=this.editor.wallAt(p),distance=w.type==='h'?Math.abs(p.y-w.y):Math.abs(p.x-w.x),wall=d[w.type+'Walls'][w.y]?.[w.x];
        if(distance<.25&&[W.LOCKED,W.LETTER_DOOR].includes(wall?.type))return {...w,layer,kind:wall.type===W.LOCKED?'lock':'letter'};
        return null;
    }
    hover(p){
        const target=this.at(p),key=this.key(target);
        if(key===this.key(this.target)&&this.open){clearTimeout(this.closeTimer);return;}
        if(this.open){if(target)this.hide();else this.closeSoon();}
        if(key===this.hoverKey)return;
        clearTimeout(this.hoverTimer);this.hoverKey=key;
        if(target)this.hoverTimer=setTimeout(()=>{if(this.editor.visible&&!this.editor.gesture&&this.hoverKey===key)this.show(target,false);},550);
    }
    show(target,focus=true){
        const value=this.value(target);if(!value)return;
        clearTimeout(this.hoverTimer);clearTimeout(this.closeTimer);clearTimeout(this.hideTimer);this.target={...target};this.hoverKey=this.key(target);
        this.editor.editorDoc.saveCurrentLayer();const layers=this.editor.editorDoc.layers;
        this.pool=target.kind==='lock'?Array.from({length:1+layers.reduce((n,l)=>n+l.items.filter(i=>i.type==='key').length,0)},(_,i)=>i):
            [...new Set(layers.flatMap(l=>[...l.buttons.map(b=>b.letter),...[...l.hWalls,...l.vWalls].flatMap(row=>row.filter(w=>w.type===W.LETTER_DOOR).map(w=>w.letter))]))].sort();
        this.input.type='text';
        this.input.setAttribute('aria-label',target.kind==='lock'?'数字门钥匙数量':'元件字母');
        if(target.kind==='lock'){this.input.maxLength=10;this.input.inputMode='numeric';}
        else{this.input.maxLength=1;this.input.inputMode='text';}
        this.input.value=target.kind==='lock'?value.keys:value.letter;this.input.removeAttribute('aria-invalid');this.open=true;this.element.hidden=false;this.element.inert=false;this.element.setAttribute('aria-hidden','false');this.position();
        requestAnimationFrame(()=>{if(this.open)this.element.classList.add('is-visible');});
        if(focus){this.input.focus({preventScroll:true});this.input.select();}
    }
    position(){
        if(!this.open||!this.target)return;
        if(!this.editor.visible||!this.value()){this.hide();return;}
        const t=this.target,r=this.editor.canvas.getBoundingClientRect(),host=this.host.getBoundingClientRect(),v=this.editor.view;
        const x=t.kind==='button'?t.x+.5+t.dx*.4:t.x+(t.type==='h'?.5:0),y=t.kind==='button'?t.y+.5+t.dy*.4:t.y+(t.type==='v'?.5:0);
        const px=r.left-host.left+(v.x+x*v.scale)*r.width/this.editor.canvas.width,py=r.top-host.top+(v.y+y*v.scale)*r.height/this.editor.canvas.height;
        const width=this.element.offsetWidth,height=this.element.offsetHeight;
        const left=px+14+width<=host.width-6?px+14:px-width-14,top=py+14+height<=host.height-6?py+14:py-height-14;
        this.element.style.left=Math.max(6,Math.min(host.width-width-6,left))+'px';
        this.element.style.top=Math.max(6,Math.min(host.height-height-6,top))+'px';
    }
    cycle(delta){
        if(!this.pool?.length)return;const raw=this.input.value,value=this.target.kind==='lock'?Number(raw):raw.toUpperCase();
        const index=raw===''?-1:this.pool.indexOf(value);this.input.value=this.pool[index<0?0:(index+delta+this.pool.length)%this.pool.length];this.change();
        this.input.select();
    }
    change(){
        if(!this.value())return;
        const t=this.target,raw=this.input.value.toUpperCase(),value=t.kind==='lock'?Number(raw):raw;
        const valid=t.kind==='lock'?/^\d+$/.test(raw)&&Number.isInteger(value)&&value<=0xffffffff:/^[A-Z]$/.test(raw);
        this.input.setAttribute('aria-invalid',String(!valid));if(!valid)return;
        if(t.kind!=='lock')this.input.value=value;
        this.editor.lastValues[t.kind]=value;
        this.editor.apply(()=>{const object=this.value();if(object)object[t.kind==='lock'?'keys':'letter']=value;});
    }
    closeSoon(){clearTimeout(this.closeTimer);this.closeTimer=setTimeout(()=>this.hide(),120);}
    hide(){clearTimeout(this.hoverTimer);clearTimeout(this.closeTimer);clearTimeout(this.hideTimer);this.hoverKey='';this.target=null;this.open=false;this.element.classList.remove('is-visible');this.element.inert=true;this.element.setAttribute('aria-hidden','true');if(document.activeElement===this.input)this.input.blur();this.hideTimer=setTimeout(()=>{if(!this.open)this.element.hidden=true;},150);}
}
