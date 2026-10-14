import '../vendor/pako.js';
import {
    createOptimalSearch
} from './optimalSearch.js';
import {
    createSearchEnvironment
} from './searchEnvironment.js';
import {
    ghostFrame, createTrajectoryGroups
} from './trajectoryGroups.js';
import {
    ReplaySerializer
} from '../core/replaySerializer.js';
globalThis.window = {
    pako: globalThis.pako
};
let search, grouping, env, mapData, routes, running = false, allowance, increment, skip = 0, background = false, deadline = Infinity;
const reportError = error => {
    running = false;
    postMessage({
        type:'error',message:error.message
    });
};
function emitRoutes(){
    try{
        const codes=[];
        for(let i=0;i<50;i++){
            const route=routes.next();
            if(route.done){
                postMessage({
                    type:'routes',codes,complete:true
                });
                return;
            }let state=env.initialState();
            for(const a of route.value){
                const next=env.step(state,a);
                if(next===state||next.isDead)throw new Error('求解路线验证失败');
                state=next;
            }if(!state.isWon)throw new Error('求解路线未通关');
            const encoded=ReplaySerializer.generateShareCode(mapData,route.value);
            if(!encoded.success)throw new Error(encoded.error);
            codes.push(encoded.code);
        }postMessage({
            type:'routes',codes,complete:false
        });
    }catch(e){
        reportError(e);
    }
} function advance(){
    if(!running)return;
    if(background && performance.now()>deadline){running=false;postMessage({type:'unknown',reason:'background_budget'});return;}
    try{
        const result=grouping?grouping.run({
            stateBudget:allowance*4,budgetMs:background?15:40
        }):search.run({
            nodeBudget:allowance,stateBudget:allowance,budgetMs:background?15:40
        });
        if(result.status==='unknown'){
            if(result.reason==='time_budget'){
                setTimeout(advance,background?10:0);
                return;
            }running=false;
            postMessage({
                type:'unknown',grouping:!!grouping
            });
            return;
        }     if(result.status==='proven_unsat'){
            running=false;
            postMessage({
                type:'unsat'
            });
            return;
        }     if(!grouping){
            postMessage({
                type:'proved',steps:result.totalActions
            });
            grouping=createTrajectoryGroups(search.optimalGraph());
            setTimeout(advance,background?10:0);
            return;
        }     running=false;
        postMessage({
            type:'solved',count:result.count
        });
        routes=grouping.routes();
        while(skip>0&&!routes.next().done)skip--;
        emitRoutes();
    }catch(e){
        reportError(e);
    }
} onmessage=({
    data
})=>{
    try{
        if(data.type==='start'){
            background=!!data.background;deadline=background?performance.now()+1000:Infinity;
            mapData=data.mapData;
            env=createSearchEnvironment(mapData);
            increment=Math.max(1000,Math.min(100000,Math.floor(96*1024*1024/(env.stateKey(env.initialState()).length*2+4096))));
            allowance=increment;
            search=createOptimalSearch(env,{
                classifyState:ghostFrame,firstOptimalOnly:env.mapDefinition.layers.every(l=>l.initialEntities.ghosts.length===0)
            });
            grouping=null;
            routes=null;
            skip=data.skip??0;
            running=true;
            advance();
        }     else if(data.type==='pause')running=false;
        else if(data.type==='foreground'){background=false;deadline=Infinity;}
        else if(data.type==='continue'&&!routes){
            background=false;deadline=Infinity;
            allowance+=increment;
            running=true;
            advance();
        }     else if(data.type==='more'&&routes)emitRoutes();
    }catch(e){
        reportError(e);
    }
};
