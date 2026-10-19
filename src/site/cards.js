import { formatSavedTime } from './localLibrary.js';
const enter='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
const bin='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"/></svg>';
const node=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
export class CardViews {
    constructor(app){
        this.app=app;this.queue=[];this.busy=false;this.version=0;this.palette=this.theme();
        this.observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){this.observer.unobserve(e.target);this.enqueue(e.target);}},{root:document.getElementById('panel-scroll'),rootMargin:'150px'});
    }
    make(record,{checkpoint=false}={}){
        const card=node('article',checkpoint?'library-card checkpoint-card':'library-card');card.dataset.recordId=record.id||'';
        const preview=node('button','card-preview');preview.type='button';preview.title='加载';preview.setAttribute('aria-label',record.title?'游玩 '+record.title:checkpoint?'加载第 '+record.step+' 步存档':'加载'+(record.kind==='draft'?'草稿':'本地存档'));
        const canvas=document.createElement('canvas');canvas.width=canvas.height=280;preview.append(canvas);const overlay=node('span','preview-enter');overlay.innerHTML=enter;preview.append(overlay);
        preview.onclick=()=>this.app.loadURL(record.url);card.append(preview);
        const info=node('div','card-info');if(checkpoint)info.append(node('h3','',`第 ${record.step} 步`));if(record.title){const title=node('h3','',record.title+(record.userOptimized?' *':''));if(record.userOptimized)title.title='经站主优化';info.append(title);}
        const meta=node('p','card-meta',record.cells!==undefined?`${record.cells} 格 · ${record.ghosts} 只鬼`:record.kind==='save'&&record.step!==undefined?`第 ${record.step} 步`:'正在加载…');
        if(!checkpoint)info.append(meta);if(record.time&&!checkpoint)info.append(node('time','card-time',formatSavedTime(record.time)));card.append(info);
        if(record.local||checkpoint){const remove=node('button','delete-record');remove.type='button';remove.title=remove.ariaLabel=checkpoint?'删除临时存档':'删除'+(record.kind==='draft'?'草稿':'本地存档');remove.innerHTML=bin;remove.onclick=e=>{e.stopPropagation();try{if(checkpoint){const c=this.app.game.controller;c.checkpoints=c.checkpoints.filter(p=>p.code!==record.code);this.app.renderPoints();}else this.app.library.remove(record.id);this.app.notify('已删除');}catch(error){this.app.notify(error.message,'error');}};card.append(remove);}
        if(checkpoint){const save=node('button','secondary checkpoint-save','保存到本地');save.onclick=()=>this.app.saveLocal('save',record.url);info.append(save);}
        preview.record=record;preview.metaElement=meta;this.observer.observe(preview);
        return card;
    }
    theme(){return document.documentElement.classList.contains('dark')?'dark':'light';}
    syncPalette(){
        const theme=this.theme();if(theme===this.palette)return;
        this.palette=theme;this.version++;
        document.querySelectorAll('.card-preview').forEach(p=>p.dataset.previewReady='false');
    }
    fill(container,records){
        const signature=JSON.stringify(records);if(container.recordSignature===signature)return;
        container.recordSignature=signature;container.querySelectorAll('.card-preview').forEach(p=>this.observer.unobserve(p));
        container.replaceChildren(...records.map(r=>this.make(r)));
    }
    isReady(container){this.syncPalette();return [...container.querySelectorAll('.card-preview')].every(p=>p.readyVersion===this.version&&p.dataset.previewReady==='true');}
    async preload(container){
        this.syncPalette();const version=this.version,nodes=[...container.querySelectorAll('.card-preview')];
        const results=await Promise.all(nodes.map(p=>this.enqueue(p)));
        if(version!==this.version||nodes.some(p=>!p.isConnected))return this.preload(container);
        return results.every(Boolean);
    }
    enqueue(preview){
        this.syncPalette();if(preview.paintVersion===this.version&&preview.paintPromise)return preview.paintPromise;
        let resolve;const promise=new Promise(done=>resolve=done),job={preview,version:this.version,promise,resolve};
        preview.paintVersion=this.version;preview.paintPromise=promise;preview.dataset.previewReady='false';
        this.queue.push(job);this.run();return promise;
    }
    finish(job,success){
        const p=job.preview;
        if(p.paintPromise===job.promise){p.dataset.previewReady=String(success);if(success)p.readyVersion=job.version;else p.paintPromise=null;}
        job.resolve(success);
    }
    async run(){
        if(this.busy)return;this.busy=true;
        try {
            const {drawRecord}=await this.app.thumbnailModule();
            while(this.queue.length){
                const job=this.queue.shift(),p=job.preview;
                if(!p.isConnected||job.version!==this.version){this.finish(job,false);continue;}
                try {
                    const meta=await drawRecord(p.querySelector('canvas'),p.record);
                    if(job.version!==this.version){this.finish(job,false);continue;}
                    p.metaElement.textContent=p.record.kind==='save'?`第 ${meta.steps} 步`:`${meta.cells} 格 · ${meta.ghosts} 只鬼`;
                    this.finish(job,true);
                }catch{p.metaElement.textContent='记录无法加载';p.title='记录无法加载';this.finish(job,false);}
                // 折叠时也绘制精品图，但每张之间让界面处理输入和绘制。
                await new Promise(resolve=>setTimeout(resolve,0));
            }
        }catch{
            while(this.queue.length){const job=this.queue.shift();job.preview.metaElement.textContent='记录无法加载';this.finish(job,false);}
        }finally{this.busy=false;}
    }
    refreshVisible(){
        this.syncPalette();this.preload(document.getElementById('premium-map-grid'));
        document.querySelectorAll('.card-preview').forEach(p=>{if(p.record)this.observer.observe(p);});
    }
}
