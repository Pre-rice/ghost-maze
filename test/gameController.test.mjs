import { installBrowserEnv } from './helpers/browser-env.mjs';
import { makeMap } from './helpers/map-fixture.mjs';
import { test, suite, summary, assert, assertEq, assertDeepEq } from './_assert.mjs';
import { GameController } from '../src/core/gameController.js';
import { MapDefinition } from '../src/core/mapDefinition.js';
import { GameLogic } from '../src/core/gameLogic.js';
import { ActionHistory } from '../src/core/actionHistory.js';
import { ReplaySerializer } from '../src/core/replaySerializer.js';
installBrowserEnv(); suite('gameController');
const start = (map=makeMap(),ui={})=>{const c=new GameController(ui);const r=c.startGame(map);assert(r.success,r.error);return c;};
const move=(c,name)=>c.movePlayer(...({R:[1,0],L:[-1,0],U:[0,-1],D:[0,1]}[name]));
const deathMap=(mode='exploration')=>{
    const m=makeMap({gameMode:mode,initialHealth:3,customStartPos:{x:2,y:2},initialGhosts:[{x:5,y:3}],items:[{x:3,y:2,type:'key'}]});
    m.vWalls[3][4]={type:3,keys:1};return m;
};
const die=c=>{move(c,'R');move(c,'D');move(c,'R');assertEq(c.currentGameState.isDead,true);};
const replay=c=>({mapData:c.mapData,mapDefinition:c.mapDefinition,history:new ActionHistory(c.mapDefinition,c.actions)});
const clearCache=history=>{for(const key of [...history.cache.entries.keys()])if(key!==0)history.cache.delete(key);};
test('作者设置、输入隔离、无镜像、初态与回调',()=>{
    const source=makeMap({gameMode:'death-loop'});let synced=0;const c=start(source,{onSync:()=>synced++});
    source.hWalls[0][0].type=1;assertEq(c.mapData.layers[0].hWalls[0][0].type,0);
    assertEq(c.gameMode,'death-loop');assertEq(c.currentStep,0);assertEq(c.history.length,1);assertEq(synced,1);
    for(const key of ['player','hWalls','ghosts','seenCells','layers'])assertEq(c[key],undefined);
    assertEq(c.currentGameState.player.stamina,undefined);
});
test('无效输入不计步且不改历史，有效动作直接记录',()=>{
    const c=start();assertEq(move(c,'L'),null);assertEq(c.processAction({type:'PRESS_BUTTON',payload:{letter:'A'}}),null);
    assertEq(c.movePlayer(2,0),null);assertEq(c.useStair(),null);assertEq(c.revive(),null);
    move(c,'R');assertDeepEq(c.actions,['R']);assertEq(c.currentStep,1);assertEq(c.currentGameState.player.steps,1);
    const ref=GameLogic.calculateNextState(GameLogic.createInitialState(c.mapDefinition),{type:'MOVE',payload:{dx:1,dy:0}},c.mapDefinition);
    const actual=c.currentGameState.clone();actual.player.trail=[];ref.player.trail=[];assertDeepEq(actual,ref);
});
test('不合法地图不覆盖已有游戏',()=>{
    const c=start();const before=c.currentGameState;const source=makeMap({buttons:[{x:0,y:0,direction:{dx:1,dy:0},letter:'A'}]});
    assertEq(c.startGame(source).success,false);assertEq(c.currentGameState,before);
});
test('存档可回溯、重复存档拒绝，新操作裁掉旧未来与未来存档',()=>{
    const c=start();move(c,'R');c.save();move(c,'D');c.save();move(c,'R');
    assertEq(c.rewind().step,2);assertEq(c.rewind().step,1);assertEq(c.rewind().ok,false);
    const old=c.history.length;assertEq(old,4);assertEq(c.actions.length,1);
    move(c,'D');assertDeepEq(c.actions,['R','D']);assertDeepEq(c.checkpoints,[1]);
    assertEq(c.undo().ok,true);move(c,'D');assertEq(c.save().ok,true);assertEq(c.save().ok,false);
});
test('死亡后回存档准确恢复生命、视野、门与鬼，不额外计步',()=>{
    const c=start(deathMap());move(c,'R');c.save();const saved=c.currentGameState;
    move(c,'D');move(c,'R');assertEq(c.currentGameState.isDead,true);assertEq(c.currentGameState.player.hp,2);
    assertEq(c.rewind().step,1);assertDeepEq(c.currentGameState,saved);assertEq(c.currentGameState.isDead,false);
});
test('探索复活保留动态状态与全局操作，复活边界禁止撤回；清缓存仍准确重建',()=>{
    const c=start(deathMap());die(c);const dead=c.currentGameState;c.revive();
    assertEq(c.currentStep,3);assertEq(c.currentGameState.player.keys,1);assertEq(c.currentGameState.player.hp,2);
    assertEq(c.currentGameState.layerStates[0].wallStates.v[3][4].type,0);assertEq(c.undo().ok,false);
    assertEq(c.save().ok,true);assertEq(c.history.stateAt(3).isDead,true,'存档不能把回放死亡步改成活态');
    move(c,'U');const final=c.currentGameState;assertDeepEq(c.actions,['R','D','R','U']);
    c.undo();assertEq(c.currentGameState.isDead,false);assertEq(c.currentStep,3);assertEq(c.undo().ok,false);
    clearCache(c.history);const reconstructed=c.history.stateAt(4);
    assertEq(reconstructed.player.hp,final.player.hp);assertEq(reconstructed.player.keys,final.player.keys);
    assertDeepEq(reconstructed.seenCells,final.seenCells);assertDeepEq(reconstructed.layerStates.map(l=>({items:l.items,wallStates:l.wallStates,ghosts:l.ghosts.map(({trail,...g})=>g)})),final.layerStates.map(l=>({items:l.items,wallStates:l.wallStates,ghosts:l.ghosts.map(({trail,...g})=>g)})));
    assertEq(dead.isDead,true,'原历史没有被复活污染');
});
test('死亡循环复活清操作/存档、步数归零、视野保留；重来全清',()=>{
    const c=start(deathMap('death-loop'));move(c,'R');c.save();move(c,'D');move(c,'R');const seen=c.currentGameState.seenCells;
    c.revive();assertEq(c.currentStep,0);assertEq(c.currentGameState.loopCount,1);assertDeepEq(c.actions,[]);assertDeepEq(c.checkpoints,[]);
    for(let y=0;y<8;y++)for(let x=0;x<8;x++)if(seen[0][y][x])assert(c.currentGameState.seenCells[0][y][x]);
    assertEq(c.currentGameState.player.keys,0);assertEq(c.currentGameState.layerStates[0].wallStates.v[3][4].type,3);
    c.startGame(c.mapData);assertEq(c.currentGameState.loopCount,0);assertEq(c.currentStep,0);
    assertDeepEq(c.currentGameState.seenCells,GameLogic.createInitialState(c.mapDefinition).seenCells);
});
test('探索耗尽生命不可复活，仍可回到之前存档',()=>{
    const m=deathMap();m.initialHealth=1;const c=start(m);move(c,'R');c.save();move(c,'D');move(c,'R');
    assertEq(c.currentGameState.player.hp,0);assertEq(c.revive(),null);assertEq(c.rewind().ok,true);assertEq(c.currentGameState.player.hp,1);
});
test('加载探索第N步替换旧视野、清存档、保留死步与复活边界',()=>{
    const c=start(deathMap());die(c);const route=replay(c);c.revive();move(c,'U');c.save();
    c.loadReplayStep(route,3);assertEq(c.currentGameState.isDead,true);assertEq(c.currentGameState.player.steps,3);assertDeepEq(c.checkpoints,[]);
    c.revive();move(c,'U');const expanded=replay(c);c.loadReplayStep(expanded,4);
    assertEq(c.revivalBoundary,3);c.undo();assertEq(c.currentGameState.isDead,false);assertEq(c.undo().ok,false);
    c.loadReplayStep(expanded,0);assertEq(c.currentGameState.player.steps,0);assertDeepEq(c.actions,[]);
});
test('加载死亡循环6→7、旧视野取并集，撤回和清缓存保留基础；不同图不迁移',()=>{
    const c=start(deathMap('death-loop'));die(c);const route=replay(c);c.revive();
    c.currentGameState.loopCount=6;c.currentGameState.seenCells[0][7][7]=true;c.save();
    c.loadReplayStep(route,2);assertEq(c.currentGameState.loopCount,7);assert(c.currentGameState.seenCells[0][7][7]);assertEq(c.checkpoints.length,0);
    c.undo();assert(c.currentGameState.seenCells[0][7][7]);clearCache(c.history);c.restore(0);assert(c.currentGameState.seenCells[0][7][7]);
    const other=start(makeMap({gameMode:'death-loop',endPos:{x:6,y:6}}));c.loadReplayStep(replay(other),0);
    assertEq(c.currentGameState.loopCount,1);assertEq(c.currentGameState.seenCells[0][7][7],false);
});
test('胜利步可加载，分享保留原始地图、回放码仅含有效分支',()=>{
    const c=start(makeMap({endPos:{x:1,y:0}}));move(c,'R');const route=replay(c);
    c.startGame(c.mapData);c.save();c.loadReplayStep(route,1);assertEq(c.currentGameState.isWon,true);
    assertEq(c.currentGameState.isDead,false);assertDeepEq(c.checkpoints,[]);assertEq(c.revive(),null);
    const code=c.generateReplayCode();assert(code.success,code.error);
    assertDeepEq(ReplaySerializer.loadFromShareCode(c.mapData,code.code).actions,['R']);
    assertEq(c.buildShareSourceData().layers[0].items.length,0);
});
summary('gameController');
