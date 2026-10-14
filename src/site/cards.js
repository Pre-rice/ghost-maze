import { formatSavedTime } from './localLibrary.js';
const enter='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
const bin='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"/></svg>';
const node=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
export class CardViews {
    constructor(app){
        this.app=app;this.queue=[];this.busy=false;
        this.observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){this.observer.unobserve(e.target);this.queue.push(e.target);this.run();}},{root:document.getElementById('panel-scroll'),rootMargin:'150px'});
    }
    make(record,{checkpoint=false}={}){
        const card=node('article',checkpoint?'checkpoint-card':'library-card');card.dataset.recordId=record.id||'';
        if(checkpoint)card.append(node('h3','',`第 ${record.step} 步`));
        const preview=node('button','card-preview');preview.type='button';preview.title='加载';preview.setAttribute('aria-label',record.title?'游玩 '+record.title:checkpoint?'加载第 '+record.step+' 步存档':'加载'+(record.kind==='draft'?'草稿':'本地存档'));
        const canvas=document.createElement('canvas');canvas.width=canvas.height=280;preview.append(canvas);const overlay=node('span','preview-enter');overlay.innerHTML=enter;preview.append(overlay);
        preview.onclick=()=>this.app.loadURL(record.url);card.append(preview);
        const info=node('div','card-info');if(record.title)info.append(node('h3','',record.title));
        const meta=node('p','card-meta',record.cells!==undefined?`${record.cells} 格 · ${record.ghosts} 只鬼`:record.kind==='save'&&record.step!==undefined?`第 ${record.step} 步`:'正在加载…');
        if(!checkpoint)info.append(meta);if(record.time&&!checkpoint)info.append(node('time','card-time',formatSavedTime(record.time)));if(!checkpoint)card.append(info);
        if(record.local){const remove=node('button','delete-record');remove.type='button';remove.title=remove.ariaLabel='删除'+(record.kind==='draft'?'草稿':'本地存档');remove.innerHTML=bin;remove.onclick=e=>{e.stopPropagation();try{this.app.library.remove(record.id);this.app.notify('已删除');}catch(error){this.app.notify(error.message,'error');}};card.append(remove);}
        if(checkpoint){const row=node('div','button-row');const load=node('button','', '加载该存档'),save=node('button','secondary','保存到本地');load.onclick=()=>this.app.loadURL(record.url);save.onclick=()=>this.app.saveLocal('save',record.url);row.append(load,save);card.append(row);}
        preview.record=record;preview.metaElement=meta;this.observer.observe(preview);
        return card;
    }
    fill(container,records){container.replaceChildren(...records.map(r=>this.make(r)));}
    async run(){
        if(this.busy)return;this.busy=true;
        try {const {drawRecord}=await this.app.thumbnailModule();while(this.queue.length){const preview=this.queue.shift();if(!preview.isConnected)continue;try{const meta=await drawRecord(preview.querySelector('canvas'),preview.record);if(preview.record.kind==='save')preview.metaElement.textContent=`第 ${meta.steps} 步`;else preview.metaElement.textContent=`${meta.cells} 格 · ${meta.ghosts} 只鬼`;}catch(error){preview.metaElement.textContent='记录无法加载';preview.title=error.message;}}}
        finally{this.busy=false;}
    }
    refreshVisible(){document.querySelectorAll('.card-preview').forEach(p=>{if(p.record)this.observer.observe(p);});}
}
