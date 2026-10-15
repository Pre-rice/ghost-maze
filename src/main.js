import { DataSerializer } from './core/dataSerializer.js';
import { GAME_STATES } from './core/constants.js';
import { GameController } from './core/gameController.js';
import { MapDefinition } from './core/mapDefinition.js';
import { ActionHistory } from './core/actionHistory.js';
import { ReplaySerializer } from './core/replaySerializer.js';
import { computeGameView,pruneTrails } from './view/viewSlice.js';
import * as Renderer from './view/renderer.js';
import { getColorsFromCSS } from './themeManager.js';
import * as Input from './inputHandler.js';
import * as UI from './ui.js';

export class GhostMazeGame {
    constructor(app) {
        this.app=app;
        this.canvas=document.getElementById('game-canvas');this.ctx=this.canvas.getContext('2d');
        this.staticLayerCanvas=document.createElement('canvas');this.padding=24;
        this.cellSize=0;this.drawOffset={x:0,y:0};this.colors=getColorsFromCSS();
        this.state=GAME_STATES.MENU;this.editor={active:false};this.debugVision=false;
        this.replay=null;this.replaySpeed=1;this.replayPlaying=false;this.replayRun=0;
        this.controller=this.makeController();
        this.dpad={element:document.getElementById('dpad-controls'),grip:document.getElementById('dpad-center'),isDragging:false,isResizing:false,currentScale:1};
        this.stopDpad=Input.bindDpadControls(this);UI.initializeDpadTouchControls(this.dpad);
        this.canvas.addEventListener('click',e=>{if(app.view==='play'&&!this.controller.pendingDeath&&!app.dialogOpen)Input.handleCanvasClick(this,e);});
        window.addEventListener('blur',()=>{this.stopAutoMove();this.pauseReplay();});
        window.matchMedia('(max-width:768px)').addEventListener('change',()=>this.sync());
        this.bind();this.resize();
    }
    makeController(){return new GameController({onSync:()=>this.sync(),onHistoryChange:()=>this.syncButtons()});}
    install(controller,code){this.stopAutoMove();this.pauseReplay();this.controller=controller;controller.ui={onSync:()=>this.sync(),onHistoryChange:()=>this.syncButtons()};this.mapCode=code;this.replay=null;this.sync();window.dispatchEvent(new CustomEvent('ghostmaze:map-installed'));}
    generateShareCode(){return this.controller.mapData?this.mapCode?{success:true,code:this.mapCode}:DataSerializer.generateShareCode(this.controller.mapData):{success:false,error:'请先加载地图'};}
    clear(){this.stopAutoMove();this.pauseReplay();this.controller=this.makeController();this.mapCode=null;this.replay=null;this.sync();}
    get activeController(){return this.app.view==='replay'&&this.replay?this.replay:this.controller;}
    getGameView(){const a=this.activeController;return computeGameView({mapDef:a.mapDefinition,gameState:a.currentGameState,viewLayer:a.viewLayer},{canvas:this.canvas,staticLayerCanvas:this.staticLayerCanvas,state:this.app.view==='replay'?GAME_STATES.REPLAY:this.state,cellSize:this.cellSize,colors:this.colors,drawOffset:this.drawOffset,debugVision:this.app.view==='replay'?this.replayVision:this.debugVision});}
    bind(){
        const on=(id,fn,event='click')=>document.getElementById(id).addEventListener(event,fn);
        on('undo-btn',()=>this.handleUndo());on('redo-btn',()=>this.handleRedo());on('reset-map-btn',()=>this.resetCurrentMap());
        on('revive-btn',()=>this.revivePlayer());
        on('full-vision-toggle',e=>{this.debugVision=e.target.checked;this.draw();},'change');
        on('dpad-toggle',()=>this.updateDpadVisibility(),'change');
        on('replay-full-vision',e=>{this.replayVision=e.target.checked;this.draw();},'change');
        on('replay-play-btn',()=>this.replayPlaying?this.pauseReplay():this.playReplay());
        on('replay-prev-btn',()=>this.seekReplay(this.replay.currentStep-1));on('replay-next-btn',()=>this.seekReplay(this.replay.currentStep+1));
        on('replay-step-input',e=>this.seekReplay(Number(e.target.value)),'change');on('replay-step-range',e=>this.seekReplay(Number(e.target.value)),'input');
        on('replay-speed',e=>this.setSpeed(Number(e.target.value)),'change');
        on('replay-load-btn',()=>this.app.loadReplayStep());on('replay-return-btn',()=>this.app.returnFromSolution());
    }
    resize(){
        const r=this.canvas.getBoundingClientRect(),ratio=Math.min(2,devicePixelRatio||1);
        if(r.width>0&&r.height>0){const oldWidth=this.canvas.width,oldHeight=this.canvas.height;this.canvas.width=Math.round(r.width*ratio);this.canvas.height=Math.round(r.height*ratio);if(this.app.editor?.loaded&&oldWidth&&oldHeight){const v=this.app.editor.view,scale=Math.min(this.canvas.width/oldWidth,this.canvas.height/oldHeight);v.x=this.canvas.width/2-(oldWidth/2-v.x)*scale;v.y=this.canvas.height/2-(oldHeight/2-v.y)*scale;v.scale*=scale;}}
        this.colors=getColorsFromCSS();this.configureCanvas();this.app.renderMap();
    }
    configureCanvas(){
        const md=this.activeController.mapDefinition;if(!md)return;
        let minX=md.width,minY=md.height,maxX=-1,maxY=-1;
        for(const l of md.layers)l.activeCells.forEach((row,y)=>row.forEach((a,x)=>{if(a){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}}));
        this.cellSize=Math.min((this.canvas.width-48)/Math.max(1,maxX-minX+1),(this.canvas.height-48)/Math.max(1,maxY-minY+1),180*(devicePixelRatio||1));
        this.drawOffset={x:(this.canvas.width-(maxX-minX+1)*this.cellSize)/2-minX*this.cellSize,y:(this.canvas.height-(maxY-minY+1)*this.cellSize)/2-minY*this.cellSize};
    }
    draw(){
        if(!this.activeController.currentGameState||this.app.view==='editor'||this.app.draftVisible)return;
        this.colors=getColorsFromCSS();this.configureCanvas();const v=this.getGameView();
        Renderer.renderStaticLayer(this.canvas,this.staticLayerCanvas,v);Renderer.drawGame(this.ctx,v);
    }
    sync(){
        const c=this.controller,s=c.currentGameState;
        this.state=!s?GAME_STATES.MENU:s.isWon?GAME_STATES.WON:s.isDead||c.pendingDeath?GAME_STATES.DEAD:GAME_STATES.PLAYING;
        const mode=c.gameMode,explore=mode==='exploration',mobile=matchMedia('(max-width:768px)').matches;
        document.getElementById('mode-display').textContent=s?(explore?'探索模式':'死亡循环'):'加载地图以开始';
        for(const [id,text] of [['player-health-display',s?(explore?'生命: '+s.player.hp:'循环: '+s.loopCount):''],['player-steps-display',s?'步数: '+s.player.steps:''],['player-keys-display',s?'钥匙: '+s.player.keys:'']])document.getElementById(id).textContent=text;
        const proximity=document.getElementById('ghost-proximity-display');proximity.hidden=!s||!explore;
        if(s)proximity.textContent='周围鬼数: '+s.layerStates[s.player.layer].ghosts.filter(g=>Math.abs(g.x-s.player.x)<=1&&Math.abs(g.y-s.player.y)<=1).length;
        document.getElementById('dpad-control').hidden=!mobile||!s;
        document.getElementById('full-vision-control').hidden=!explore||!s;
        document.getElementById('view-options-controls').hidden=!s||(!mobile&&!explore);
        const notice=document.getElementById('death-notice');notice.hidden=!s||(!c.pendingDeath&&!s.isDead);
        document.getElementById('death-message').textContent=s?c._deathStats().message:'';
        document.getElementById('revive-btn').disabled=!c.canRevive;
        document.getElementById('win-notice').hidden=!s?.isWon;
        document.getElementById('win-notice').textContent=s?.isWon?c._winStats().text:'';
        this.syncButtons();this.updateDpadVisibility();this.app.renderMap();
    }
    syncButtons(){
        const c=this.controller;document.getElementById('undo-btn').disabled=!c.canUndo;document.getElementById('redo-btn').disabled=!c.canRedo;
        for(const id of ['reset-map-btn','save-btn','save-map-local','solve-map-btn','save-menu-btn'])document.getElementById(id).disabled=!c.mapData;
    }
    processAction(action){
        if(this.app.view!=='play'||this.state!==GAME_STATES.PLAYING||this.app.dialogOpen||this.app.loading)return null;
        const next=this.controller.processAction(action);
        if(next){this.app.gameChanged();this.animateTrails();}return next;
    }
    movePlayer(dx,dy){return this.processAction({type:'MOVE',payload:{dx,dy}});}
    useStair(){const layer=this.controller.currentGameState?.player.layer;if(layer!==undefined&&this.controller.viewLayer!==layer)this.switchToLayer(layer);return this.processAction({type:'USE_STAIR'});}
    handleUndo(){this.stopAutoMove();if(this.controller.undo().ok)this.app.gameChanged();}
    handleRedo(){this.stopAutoMove();if(this.controller.redo().ok)this.app.gameChanged();}
    resetCurrentMap(){this.stopAutoMove();if(this.controller.reset().ok)this.app.gameChanged();}
    revivePlayer(){this.controller.revive();this.sync();}
    updateDpadVisibility(){UI.updateDpadVisibility(this.app.view!=='play'||this.state!==GAME_STATES.PLAYING||this.app.dialogOpen);}
    stopAutoMove(){clearInterval(this.autoMoveInterval);this.autoMoveInterval=null;clearInterval(this.dpadInterval);this.dpadInterval=null;this.stopDpad?.();}
    animateTrails(){
        cancelAnimationFrame(this.animationFrameId);const until=Date.now()+550;
        const frame=()=>{if(this.app.view!=='play'||Date.now()>until)return;pruneTrails(this.controller.currentGameState,this.controller.viewLayer,Date.now());this.draw();this.animationFrameId=requestAnimationFrame(frame);};
        this.animationFrameId=requestAnimationFrame(frame);
    }
    switchToLayer(index){const a=this.activeController;if(!a.mapDefinition||index<0||index>=a.mapDefinition.layerCount)return;a.viewLayer=index;this.draw();this.app.renderLayers();}
    showToast(message,duration=2500,type='info'){this.app.notify(message,type);}
    showConfirm(message,fn){this.app.confirm(message,fn);}
    startGame(map,code){return this.app.loadMap(map,code);}
    openReplay(mapData,actions,mapCode){
        this.pauseReplay();const def=new MapDefinition(mapData),history=new ActionHistory(def,actions);
        this.replay={mapData,mapDefinition:def,history,mapCode,currentStep:0,currentGameState:history.stateAt(0),viewLayer:def.playerStart.layer};
        this.replayVision=true;document.getElementById('replay-full-vision').checked=true;this.syncReplay();
    }
    async seekReplay(step,pause=true){
        if(!this.replay)return;
        if(pause)this.pauseReplay();const r=this.replay;step=Math.max(0,Math.min(r.history.actions.length,Math.floor(step||0)));
        this.seekAbort?.abort();this.seekAbort=new AbortController();const signal=this.seekAbort.signal;
        try {const state=await r.history.stateAtAsync(step,{signal});if(signal.aborted||this.replay!==r)return;r.currentStep=step;r.currentGameState=state;r.viewLayer=state.player.layer;this.syncReplay();}
        catch(e){if(e.name!=='AbortError')this.showToast(e.message,3000,'error');}
    }
    syncReplay(){
        const r=this.replay;document.getElementById('replay-empty').hidden=!!r;document.getElementById('replay-controls').hidden=!r;if(!r)return;
        const s=r.currentGameState,explore=r.mapDefinition.gameMode==='exploration';
        document.getElementById('replay-mode-display').textContent=(explore?'探索模式':'死亡循环');
        document.getElementById('replay-health-display').textContent=explore?'生命: '+s.player.hp:'循环: '+s.loopCount;
        document.getElementById('replay-keys-display').textContent='钥匙: '+s.player.keys;
        document.getElementById('replay-proximity-display').hidden=!explore;
        document.getElementById('replay-proximity-display').textContent='周围鬼数: '+s.layerStates[s.player.layer].ghosts.filter(g=>Math.abs(g.x-s.player.x)<=1&&Math.abs(g.y-s.player.y)<=1).length;
        document.getElementById('replay-vision-control').hidden=!explore;
        for(const id of ['replay-step-input','replay-step-range']){const e=document.getElementById(id);e.max=r.history.actions.length;e.value=r.currentStep;}
        document.getElementById('replay-total').textContent=r.history.actions.length;
        document.getElementById('replay-prev-btn').disabled=r.currentStep===0;document.getElementById('replay-next-btn').disabled=r.currentStep===r.history.actions.length;
        document.getElementById('replay-play-btn').disabled=r.history.actions.length===0;
        document.getElementById('replay-return-btn').hidden=!this.app.solutionOrigin;
        document.getElementById('replay-return-btn').textContent=this.app.solutionOrigin?.view==='editor'?'返回编辑':'返回游玩';
        this.app.renderMap();
    }
    playReplay(){
        if(!this.replay||this.replayPlaying||!this.replay.history.actions.length)return;
        if(this.replay.currentStep>=this.replay.history.actions.length){this.seekReplay(0).then(()=>this.playReplay());return;}
        this.replayPlaying=true;const generation=++this.replayRun;document.getElementById('replay-play-btn').textContent='暂停';
        const next=async()=>{if(!this.replayPlaying||generation!==this.replayRun||this.app.view!=='replay')return;await this.seekReplay(this.replay.currentStep+1,false);if(generation!==this.replayRun)return;if(this.replay.currentStep<this.replay.history.actions.length)this.replayTimer=setTimeout(next,400/this.replaySpeed);else this.pauseReplay();};
        this.replayTimer=setTimeout(next,400/this.replaySpeed);
    }
    pauseReplay(){this.replayPlaying=false;this.replayRun++;clearTimeout(this.replayTimer);this.seekAbort?.abort();const b=document.getElementById('replay-play-btn');if(b)b.textContent='播放';}
    setSpeed(speed){if(![.25,.5,1,2,4].includes(speed))return;const was=this.replayPlaying;this.pauseReplay();this.replaySpeed=speed;document.getElementById('replay-speed').value=speed;if(was)this.playReplay();}
    changeSpeed(delta){const speeds=[.25,.5,1,2,4],index=speeds.indexOf(this.replaySpeed);this.setSpeed(speeds[Math.max(0,Math.min(4,index+delta))]);}
    handleKey(event){Input.handleKeyPress(this,event);}
}
