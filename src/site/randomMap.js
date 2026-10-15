/** 空闲时只预热组件，点击时才生成；重复生成复用同一个后台线程。 */
let current=null,sequence=0;

function close(state,error) {
    if(current!==state)return;
    current=null;state.worker.terminate();state.rejectReady(error);
    if(state.job){state.job.cleanup();state.job.reject(error);state.job=null;}
}

export function warmRandomGenerator() {
    if(current)return current.ready;
    const worker=new Worker(new URL('./randomMapWorker.js',import.meta.url),{type:'module'});
    const state={worker,job:null};
    state.ready=new Promise((resolve,reject)=>{state.resolveReady=resolve;state.rejectReady=reject;});
    // 预热失败不打断游玩；真正点击时可重新加载并给出错误反馈。
    state.ready.catch(()=>{});current=state;
    worker.onmessage=({data})=>{
        if(current!==state)return;
        if(data.type==='ready'){state.resolveReady();return;}
        const job=state.job;if(!job||job.id!==data.id)return;
        state.job=null;job.cleanup();
        if(data.success)job.resolve(data.code);else job.reject(new Error(data.error));
    };
    worker.onerror=()=>close(state,new Error('生成组件加载失败，请重试'));
    return state.ready;
}

export function generateRandomMap(size,health,{signal}={}) {
    return new Promise((resolve,reject)=>{
        if(signal?.aborted){reject(new DOMException('已取消生成','AbortError'));return;}
        warmRandomGenerator();const state=current;
        if(state.job){reject(new Error('正在生成，请稍候'));return;}
        const abort=()=>close(state,new DOMException('已取消生成','AbortError'));
        const job={id:++sequence,resolve,reject,cleanup:()=>signal?.removeEventListener('abort',abort)};
        state.job=job;signal?.addEventListener('abort',abort,{once:true});
        state.worker.postMessage({id:job.id,size,health});
    });
}
