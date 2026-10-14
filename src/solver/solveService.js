import { optimalCache } from '../maps/optimal-cache.js';
import { safeGet,safeSet } from '../storage.js';
import { routeURL } from '../site/localLibrary.js';
const KEY='ghostmaze-solutions-'+optimalCache.ruleset;
export class SolveService {
    constructor(app){this.app=app;this.views=new Set();this.cache=new Map();try{const saved=JSON.parse(safeGet(KEY)||'[]');for(const [key,value] of saved)if(Number.isInteger(value.steps)&&value.steps>=0&&Array.isArray(value.codes)&&value.codes.every(c=>typeof c==='string')&&/^\d+$/.test(String(value.count)))this.cache.set(key,value);}catch{}}
    prepare(mapData,mapCode,background=true){
        if(this.job?.mapCode===mapCode)return;
        this.invalidate();const cached=optimalCache.maps[mapCode]||this.cache.get(mapCode);
        this.job={mapData,mapCode,status:cached?'ready':'searching',steps:cached?.steps??null,count:cached?.count??null,codes:cached?.codes.slice()||[],complete:!!cached?.complete,background};
        this.render();if(!cached)this.startWorker(background);
    }
    invalidate(){this.worker?.terminate();this.worker=null;this.job=null;this.render();}
    startWorker(background=false,skip=0){
        if(!this.job)return;this.worker?.terminate();const worker=new Worker(new URL('./solverWorker.js',import.meta.url),{type:'module'});this.worker=worker;this.job.background=background;this.job.status='searching';
        worker.onmessage=({data})=>{if(this.worker===worker)this.receive(data);};worker.onerror=()=>{if(this.worker===worker){this.job.status='error';this.job.error='求解加载失败，可以重试';this.render();}};
        worker.postMessage({type:'start',mapData:this.job.mapData,skip,background});
    }
    activate(){if(!this.job)return;if(this.job.status==='unknown'||this.job.status==='error')this.continue();else if(this.job.status==='searching'&&this.job.background){this.job.background=false;this.worker?.postMessage({type:'foreground'});}this.render();}
    continue(){if(!this.job)return;this.job.status='searching';this.job.background=false;if(this.worker)this.worker.postMessage({type:'continue'});else this.startWorker(false,this.job.codes.length);this.render();}
    more(){if(!this.job)return;if(this.worker)this.worker.postMessage({type:'more'});else this.startWorker(false,this.job.codes.length);}
    pauseBackground(){if(this.job?.background&&this.job.status==='searching'){this.worker?.postMessage({type:'pause'});this.job.status='unknown';this.render();}}
    receive(data){
        const j=this.job;if(!j)return;
        if(data.type==='proved'){j.steps=data.steps;}
        else if(data.type==='solved'){j.status='ready';j.steps=data.steps??j.steps;j.count=data.count;}
        else if(data.type==='routes'){j.codes.push(...data.codes);j.complete=!!data.complete||(j.count!==null&&BigInt(j.codes.length)===BigInt(j.count));if(j.complete){this.cache.set(j.mapCode,{steps:j.steps,count:j.count,codes:j.codes.slice(),complete:true});while(this.cache.size>16)this.cache.delete(this.cache.keys().next().value);safeSet(KEY,JSON.stringify([...this.cache]));this.worker?.terminate();this.worker=null;}}
        else if(data.type==='unknown'){j.status='unknown';}
        else if(data.type==='unsat'){j.status='unsat';this.worker?.terminate();this.worker=null;}
        else if(data.type==='error'){j.status='error';j.error=data.message;}
        this.render();
    }
    mount(container){
        if(container.id==='solve-pane'){
            if(!container.querySelector('.solver-scope')){const tip=document.createElement('p');tip.className='solver-scope';tip.textContent='从地图初态出发，无伤、无复活。';container.prepend(tip);}
        }else if(!container.querySelector('[data-solver-status]')){
            container.innerHTML='<p class="solver-scope">从地图初态出发，无伤、无复活。</p><p data-solver-status role="status"></p><div data-solver-routes class="solver-routes"></div><div class="button-row"><button data-solver-continue class="secondary" hidden>继续求解</button><button data-solver-more class="secondary" hidden>继续显示</button></div>';
            container.querySelector('[data-solver-continue]').onclick=()=>this.continue();container.querySelector('[data-solver-more]').onclick=()=>this.more();
        }
        this.views.add(container);this.render();
    }
    render(){
        const j=this.job;
        for(const container of this.views){
            const status=container.querySelector('[data-solver-status],#solver-status'),list=container.querySelector('[data-solver-routes],#solver-routes'),cont=container.querySelector('[data-solver-continue],#solver-continue-btn'),more=container.querySelector('[data-solver-more],#solver-more-btn');if(!status)continue;
            status.textContent=!j?'尚未求解':j.status==='ready'?`最优解 ${j.steps} 步，共 ${j.count} 种`:j.status==='unsat'?'无伤、无复活条件下无解':j.status==='unknown'?j.steps===null?'求解已暂停，可继续':`最优解 ${j.steps} 步，正在整理不同解法，可继续`:j.status==='error'?j.error:j.steps===null?'正在求解…':`最优解 ${j.steps} 步，正在整理不同解法…`;
            cont.hidden=!j||!['unknown','error'].includes(j.status);more.hidden=!j||j.status!=='ready'||j.complete;
            list.replaceChildren();if(j)j.codes.forEach((code,index)=>{const a=document.createElement('a');a.textContent='查看解法 '+(index+1);a.href=routeURL({map:j.mapCode,replay:code});a.onclick=e=>{e.preventDefault();this.app.openSolution(j.mapCode,code);};list.append(a);});
        }
    }
}
