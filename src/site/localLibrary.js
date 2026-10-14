import { safeGet, safeSet } from '../storage.js';
const KEY='ghostmaze-local-library-v1';
export function routeURL({map,save,replay,draft},base=globalThis.location?.href || 'https://ghostmaze.novic.cc/') {
    const url=new URL('./',base);
    if(draft){url.searchParams.set('draft',draft);return url.toString();}
    if(!map) return url.toString();
    url.searchParams.set('map',map);
    if(save)url.searchParams.set('save',save);
    else if(replay)url.searchParams.set('replay',replay);
    return url.toString();
}
export function readRoute(input,base=globalThis.location?.href || 'https://ghostmaze.novic.cc/') {
    const url=new URL(input,base),p=url.searchParams;
    if(p.has('save')&&p.has('replay')||p.has('draft')&&(p.has('map')||p.has('save')||p.has('replay')))throw new Error('链接不能同时包含多种加载内容');
    if((p.has('save')||p.has('replay'))&&!p.get('map'))throw new Error('存档和回放链接必须包含地图');
    return {map:p.get('map'),save:p.get('save'),replay:p.get('replay'),draft:p.get('draft')};
}
export class LocalLibrary {
    constructor(storage={get:safeGet,set:safeSet}){this.storage=storage;this.listeners=new Set();}
    list(kind=null){
        let entries=[];
        try { entries=JSON.parse(this.storage.get(KEY)||'[]'); } catch {}
        if(!Array.isArray(entries))entries=[];
        return entries.filter(e=>e&&['map','save','draft'].includes(e.kind)&&typeof e.url==='string'&&Number.isFinite(e.time)&&(!kind||(kind==='play'?e.kind!=='draft':e.kind===kind))).sort((a,b)=>b.time-a.time);
    }
    write(entries){
        const raw=JSON.stringify(entries);
        this.storage.set(KEY,raw);
        if(this.storage.get(KEY)!==raw)throw new Error('未能保存到本地，请检查浏览器的存储权限或可用空间');
        for(const listener of this.listeners)listener();
    }
    save(kind,url,time=Date.now()){
        const route=readRoute(url),canonical=new URL(routeURL(route)).search;
        if(kind==='map'&&(!route.map||route.save||route.replay||route.draft)||kind==='save'&&!route.save||kind==='draft'&&!route.draft)throw new Error('保存内容与类型不符');
        const entries=this.list(),existing=entries.find(e=>e.kind===kind&&e.url===canonical);
        const record={id:existing?.id || (globalThis.crypto?.randomUUID?.() ?? `${time}-${Math.random().toString(36).slice(2)}`),kind,url:canonical,time};
        this.write([record,...entries.filter(e=>e.id!==record.id)]);
        return record;
    }
    remove(id){this.write(this.list().filter(e=>e.id!==id));}
    subscribe(listener){this.listeners.add(listener);return()=>this.listeners.delete(listener);}
}
export function formatSavedTime(time){
    const d=new Date(time),pad=n=>String(n).padStart(2,'0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
