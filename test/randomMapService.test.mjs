import test,{afterEach} from 'node:test';
import assert from 'node:assert/strict';
import {warmRandomGenerator,generateRandomMap} from '../src/site/randomMap.js';

class WorkerDouble {
    static instances=[];
    constructor(){this.requests=[];this.stopped=false;WorkerDouble.instances.push(this);}
    postMessage(data){this.requests.push(data);}
    terminate(){this.stopped=true;}
    reply(data){this.onmessage({data});}
}
globalThis.Worker=WorkerDouble;
const latest=()=>WorkerDouble.instances.at(-1);
afterEach(()=>latest()?.onerror());

test('预热不生成地图，两次点击复用已就绪的组件',async()=>{
    const ready=warmRandomGenerator(),worker=latest();assert.equal(worker.requests.length,0);
    worker.reply({type:'ready'});await ready;
    for(const size of [8,20]){
        const result=generateRandomMap(size,9),request=worker.requests.at(-1);
        assert.equal(latest(),worker);assert.equal(request.size,size);assert.equal(request.health,9);
        worker.reply({id:request.id,success:true,code:'map-'+size});assert.equal(await result,'map-'+size);
    }
    assert.equal(worker.stopped,false);
});

test('取消立即终止旧任务，迟到消息不能替换下一张地图',async()=>{
    const abort=new AbortController(),old=generateRandomMap(8,5,{signal:abort.signal}),oldWorker=latest();
    abort.abort();await assert.rejects(old,{name:'AbortError'});assert.equal(oldWorker.stopped,true);
    const next=generateRandomMap(10,5),worker=latest(),id=worker.requests.at(-1).id;
    assert.notEqual(worker,oldWorker);oldWorker.reply({id,success:true,code:'过期'});
    worker.reply({type:'ready'});worker.reply({id,success:true,code:'当前'});assert.equal(await next,'当前');
});

test('预热加载失败可重新准备，实际生成失败明确返回且可重试',async()=>{
    const ready=warmRandomGenerator();latest().onerror();await assert.rejects(ready,/加载失败/);
    const failed=generateRandomMap(10,5),worker=latest();worker.onerror();await assert.rejects(failed,/加载失败/);
    const retry=generateRandomMap(10,5),fresh=latest();fresh.reply({type:'ready'});
    fresh.reply({id:fresh.requests.at(-1).id,success:false,error:'参数无效'});await assert.rejects(retry,/参数无效/);
    const valid=generateRandomMap(8,5);assert.equal(latest(),fresh);
    fresh.reply({id:fresh.requests.at(-1).id,success:true,code:'成功'});assert.equal(await valid,'成功');
});

test('已取消的点击不启动组件；完成后关闭弹窗不销毁可复用组件',async()=>{
    const abort=new AbortController();abort.abort();const before=WorkerDouble.instances.length;
    await assert.rejects(generateRandomMap(8,5,{signal:abort.signal}),{name:'AbortError'});
    assert.equal(WorkerDouble.instances.length,before);
    const controller=new AbortController(),result=generateRandomMap(8,5,{signal:controller.signal}),worker=latest();
    worker.reply({type:'ready'});worker.reply({id:worker.requests.at(-1).id,success:true,code:'完成'});
    assert.equal(await result,'完成');controller.abort();assert.equal(worker.stopped,false);
});
