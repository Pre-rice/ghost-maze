/** 生成与编码在后台完成；关闭设置后取消，不把过期结果加载到当前地图。 */
export function generateRandomMap(size,health,{signal}={}) {
    return new Promise((resolve,reject)=>{
        if(signal?.aborted){reject(new DOMException('已取消生成','AbortError'));return;}
        const worker=new Worker(new URL('./randomMapWorker.js',import.meta.url),{type:'module'});
        const cleanup=()=>{worker.terminate();signal?.removeEventListener('abort',abort);};
        const abort=()=>{cleanup();reject(new DOMException('已取消生成','AbortError'));};
        signal?.addEventListener('abort',abort,{once:true});
        worker.onmessage=({data})=>{cleanup();if(data.success)resolve(data.code);else reject(new Error(data.error));};
        worker.onerror=()=>{cleanup();reject(new Error('生成组件加载失败，请重试'));};
        worker.postMessage({size,health});
    });
}
