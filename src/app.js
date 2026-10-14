import { galleryMarkup } from './maps/galleryScreen.js';
import {
    GhostMazeGame
} from './main.js';
import {
    EditorApp
} from './editorMain.js';
import {
    editorMarkup
} from './editor/panel.js';
import {
    populateGallery
} from './maps/gallery.js';
import {
    helpContent
} from './helpContent.js';
import {
    GameController
} from './core/gameController.js';
import {
    ReplaySerializer
} from './core/replaySerializer.js';
import {
    mapURL
} from './shareLinks.js';
import {
    safeGet,safeSet
} from './storage.js';
class Application {
    constructor(){
        const path=location.pathname,view=path.endsWith('maps.html')?'maps':path.endsWith('help.html')?'help':path.endsWith('editor.html')?'editor':history.state?.view??'play';
        this.view='play';
        this.records=new Map();
        this.sequence=0;
        this.navigationSuspended=false;
        document.body.insertAdjacentHTML('beforeend',editorMarkup()+galleryMarkup+`<section id="help-screen" hidden>${helpContent}</section>`);
        window.app=this;
        this.game=window.game=new GhostMazeGame();
        this.editor=window.editorApp=new EditorApp(this);
        populateGallery(document.getElementById('ai-map-grid'));
        document.getElementById('edit-map-btn').onclick=e=>{
            e.preventDefault();
            this.enterEditor();
        };
        document.addEventListener('click',e=>{
            if(e.defaultPrevented)return;const theme=e.target.closest('[data-theme-action]');if(theme){
                document.getElementById('theme-toggle-btn').click();this.editor.draw();return;
            }const a=e.target.closest('a');if(!a||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0||a.closest('#solver-dialog'))return;const url=new URL(a.href);if(url.origin!==location.origin)return;const dest=url.pathname.endsWith('maps.html')?'maps':url.pathname.endsWith('help.html')?'help':url.pathname.endsWith('editor.html')?'editor':url.pathname===new URL('./',location.href).pathname?'play':null;if(!dest)return;e.preventDefault();if(dest==='editor'){
                this.enterEditor();return;
            }if(dest==='play'&&url.searchParams.get('map')&&url.searchParams.get('map')!==this.game.mapCode){
                this.capture();this.navigationSuspended=true;this.view='play';this.game.controller=this.newController();this.game.loadFromShareCode(url.searchParams.get('map'),url.searchParams.get('replay'));this.editor.loaded=false;this.replayOrigin=null;this.playOrigin=null;this.editorReturn=null;this.navigationSuspended=false;this.navigate('play',url.href,true,false);
            }else this.navigate(dest,dest==='play'&&this.game.mapCode?mapURL(this.game.mapCode):url.href);
        });
        window.addEventListener('popstate',()=>this.restoreHistory());
        window.addEventListener('pagehide',()=>{
            try{
                sessionStorage.setItem('ghostmaze-session-view',JSON.stringify({
                    view:this.view,map:location.search,editor:this.editor.workspace.snapshot()
                }));
            }catch{
            }
        });
        this.entry=Number.isSafeInteger(history.state?.entry)?history.state.entry:++this.sequence;
        this.sequence=Math.max(this.sequence,this.entry);
        if(view==='editor'){
            this.editor.enter(this.game.controller.mapData,this.game.mapCode);
            this.editorCode=this.game.mapCode;
            try{
                const saved=JSON.parse(sessionStorage.getItem('ghostmaze-session-view'));
                if(saved?.view==='editor'&&saved.map===location.search)this.editor.workspace.restore(saved.editor);
            }catch{
            }this.view='editor';
            this.render();
            history.replaceState({
                view:'editor',entry:this.entry
            },'',this.editorCode?mapURL(this.editorCode):new URL('./',location.href));
        }         else {
            this.view=view;
            this.render();
            history.replaceState({
                view,entry:this.entry
            },'',location.href);
        }         this.capture();
    }
    capture(){
        if(!this.game)return;
        this.records.set(this.entry,{
            view:this.view,controller:this.game.controller,mapCode:this.game.mapCode,replay:this.game.replay,workspace:this.editor?.workspace,sourceCode:this.editor?.sourceCode,editorLoaded:this.editor?.loaded,replayOrigin:this.replayOrigin,playOrigin:this.playOrigin,debugVision:this.game.debugVision,playVision:this.game.playVision,editorReturn:this.editorReturn
        });
    }
    navigate(view,url=null,push=true,save=true){
        if(save)this.capture();
        this.view=view;
        this.render();
        if(push){
            this.entry=++this.sequence;
            history.pushState({
                view,entry:this.entry
            },'',url??(view==='maps'||view==='help'?new URL(view+'.html',location.href):location.href));
        }else history.replaceState({
            view,entry:this.entry
        },'',url??location.href);
        this.capture();
    }
    render(){
        this.game.stopAutoMove();
        this.game.pauseReplay();
        this.game.stopAnimationLoop();
        this.game.hideAllOverlays();
        for(const name of ['play','editor','maps','help'])document.getElementById(name+'-screen').hidden=this.view!==name;
        document.title=this.view==='editor'?'鬼迷宫 · 地图编辑器':this.view==='maps'?'鬼迷宫 · 地图集':this.view==='help'?'鬼迷宫 · 帮助':'鬼迷宫';
        if(this.view==='play'&&this.game.activeController.currentGameState){
            if(this.game.replay){
                this.game.state='replay';
                this.game.configureCanvas();
                this.game.syncReplay();
                document.getElementById('replay-close-btn').textContent=this.replayOrigin?.view==='editor'?'返回编辑':'返回游玩';
            }else {this.game.syncGame();const current=this.game.controller.currentGameState;if(current.isWon)this.game.showOutcome('win',this.game.controller._winStats().text);else if(current.isDead){const stats=this.game.controller._deathStats();this.game.showOutcome(stats.overlay,stats.message);}}
        }else this.game.state='menu';
        if(this.view==='editor')this.editor.sync();
        this.game.updateDpadVisibility();
    }
    mapURL(code,replay){
        if(this.navigationSuspended||this.view!=='play')return;
        history.replaceState({
            view:this.view,entry:this.entry
        },'',mapURL(code,{
            replay
        }));
    }
    editorURL(code){
        if(this.view==='editor')history.replaceState({
            view:'editor',entry:this.entry
        },'',mapURL(code));
    }
    enterEditor(){
        if(!this.playOrigin)this.editorReturn={
            controller:this.game.controller,mapCode:this.game.mapCode,replay:this.game.replay,replayOrigin:this.replayOrigin,debugVision:this.game.debugVision,playVision:this.game.playVision,href:location.href
        };
        const source=this.game.replay?this.game.replay.mapData:this.game.controller.mapData,code=this.game.replay?this.game.replay.mapCode:this.game.mapCode;
        if(!this.editor.loaded||(this.editor.code().code!==code&&this.editor.sourceCode!==code))this.editor.enter(source,code);
        this.editorCode=this.editor.code().code;
        this.navigate('editor',this.editorCode?mapURL(this.editorCode):new URL('./',location.href));
    }
    leaveEditor(){
        const origin=this.playOrigin??this.editorReturn;
        if(origin){
            this.game.controller=origin.controller;
            this.game.mapCode=origin.mapCode;
            this.game.replay=origin.replay??null;
            this.replayOrigin=origin.replayOrigin;
            this.game.debugVision=origin.debugVision??false;
            this.game.playVision=origin.playVision;
            document.getElementById('full-vision-toggle').checked=this.game.debugVision;
        }this.playOrigin=null;
        this.editorReturn=null;
        this.navigate('play',origin?.href??(this.game.mapCode?mapURL(this.game.mapCode):new URL('./',location.href)));
    }
    tryEditor(){
        const encoded=this.editor.code();
        if(!encoded.success){
            this.editor.notify(encoded.error);
            return;
        }this.capture();
        this.playOrigin??=this.editorReturn??{
            controller:this.game.controller,mapCode:this.game.mapCode,href:location.href,debugVision:this.game.debugVision
        };
        this.game.controller=this.newController();
        this.navigationSuspended=true;
        this.view='play';
        this.game.startGame(this.editor.editorDoc.toMapData(),encoded.code);
        this.game.hideAllOverlays();
        this.navigationSuspended=false;
        this.navigate('play',mapURL(encoded.code),true,false);
    }
    newController(){
        return new GameController({
            onSync:()=>this.game.syncGame(),onWin:s=>{
                if(!this.game.replay)this.game.showOutcome('win',s.text);
            },onDeath:s=>{
                if(!this.game.replay)this.game.showOutcome(s.overlay,s.message);
            },onHistoryChange:()=>this.game.updateHistoryButtons()
        });
    }
    solveEditor(){
        const encoded=this.editor.code();
        if(!encoded.success){
            this.editor.notify(encoded.error);
            return;
        }this.game.solverDialog.show(this.editor.editorDoc.toMapData(),encoded.code);
    }
    watchReplay(map,actions,mapCode,code){
        this.capture();
        this.replayOrigin={
            view:'play',map,mapCode,popup:false
        };
        this.navigationSuspended=true;
        this.game.openReplay(map,actions,mapCode,code);
        this.navigationSuspended=false;
        this.navigate('play',mapURL(mapCode,{
            replay:code
        }),true,false);
    }
    prepareReplayLoad(){
        this.capture();
        if(this.replayOrigin?.view==='editor'){
            this.playOrigin??=this.editorReturn??{
                controller:this.game.controller,mapCode:this.game.mapCode,href:location.href,debugVision:this.game.debugVision
            };
            this.game.controller=this.newController();
        }this.replayOrigin=null;
        this.navigationSuspended=true;
    }
    finishReplayLoad(){
        this.navigationSuspended=false;
        this.navigate('play',mapURL(this.game.mapCode),true,false);
    }     openSolution({
        code,mapCode
    }){
        const map=this.game.solverDialog.mapData,route=ReplaySerializer.loadFromShareCode(map,code);
        if(!route.success){
            this.game.showToast(route.error,4000,'error');
            return;
        }this.capture();
        this.replayOrigin={
            view:this.view,workspace:this.editor.workspace,map,mapCode,popup:true
        };
        this.navigationSuspended=true;
        this.view='play';
        this.game.openReplay(map,route.actions,mapCode,code);
        this.game.returnToSolutions=true;
        this.navigationSuspended=false;
        this.navigate('play',mapURL(mapCode,{
            replay:code
        }),true,false);
        document.getElementById('replay-close-btn').textContent=this.replayOrigin.view==='editor'?'返回编辑':'返回游玩';
    }
    closeReplay(){
        const origin=this.replayOrigin;
        if(!origin){
            this.game.closeReplay();
            this.navigate('play',this.game.mapCode?mapURL(this.game.mapCode):new URL('./',location.href),false);
            return;
        }this.game.closeReplay(false);
        this.replayOrigin=null;
        let same=true;
        if(origin.view==='editor'){
            this.editor.workspace=origin.workspace;
            const current=this.editor.code();
            same=current.success&&current.code===origin.mapCode;
            this.navigate('editor',current.success?mapURL(current.code):mapURL(origin.mapCode),false);
        }else this.navigate('play',mapURL(this.game.mapCode),false);
        if(origin.popup!==false&&same)this.game.solverDialog.show(origin.map,origin.mapCode);
        else if(!same)this.game.solverDialog.reset(this.editor.code().code);
    }
    restoreHistory(){
        const returning=this.game.replay&&this.replayOrigin;
        const state=history.state,record=this.records.get(state?.entry);
        this.entry=state?.entry??++this.sequence;
        this.sequence=Math.max(this.sequence,this.entry);
        if(record){
            this.game.controller=record.controller;
            this.game.mapCode=record.mapCode;
            this.game.replay=record.replay;
            this.replayOrigin=record.replayOrigin;
            this.playOrigin=record.playOrigin;
            this.editorReturn=record.editorReturn;
            this.game.debugVision=record.debugVision;
            this.game.playVision=record.playVision;
            document.getElementById('full-vision-toggle').checked=!!record.debugVision;
            if(record.workspace){
                this.editor.workspace=record.workspace;
                this.editor.sourceCode=record.sourceCode;this.editor.loaded=record.editorLoaded;
            }this.view=record.view;
            this.render();
            if(returning&&returning.popup!==false&&this.view===returning.view)this.game.solverDialog.show(returning.map,returning.mapCode);
        }else{
            const p=new URLSearchParams(location.search);
            this.view=state?.view??(location.pathname.endsWith('maps.html')?'maps':location.pathname.endsWith('help.html')?'help':'play');
            if(this.view==='play'&&p.get('map')){
                this.navigationSuspended=true;
                this.game.loadFromShareCode(p.get('map'),p.get('replay'));
                this.navigationSuspended=false;
            }this.render();
        }
    }
} document.addEventListener('DOMContentLoaded',()=>{
    window.app=new Application();
});
