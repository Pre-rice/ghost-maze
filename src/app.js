import { initThemeManager } from './themeManager.js';
import { safeGet,safeSet } from './storage.js';
import { aiMaps } from './maps/ai-gallery.js';
import { LocalLibrary,readRoute,routeURL } from './site/localLibrary.js';
import { CardViews } from './site/cards.js';
import { PanelScroll } from './site/panelScroll.js';
import { MobileLayout } from './site/mobileLayout.js';

const AUTO='ghostmaze-editor-draft-v3';
const byId=id=>document.getElementById(id);
const idle=fn=>window.requestIdleCallback?requestIdleCallback(fn,{timeout:1800}):setTimeout(fn,180);
export class Application {
    constructor(){
        this.view='maps';this.playPanel=null;this.scrolls={};this.loadToken=0;this.hasLoadedMap=false;this.recoverAllowed=!location.search;this.replaySource='current';this.replayDirty=true;
        this.library=new LocalLibrary();this.cards=new CardViews(this);this.mapCode=null;this.draftVisible=false;window.app=this;
        initThemeManager();this.bind();this.panelScroll=new PanelScroll();this.mobileLayout=new MobileLayout();this.renderLibraries();performance.mark('ghostmaze-shell-ready');try{const route=readRoute(location.href);this.showColumn(route.draft?'editor':route.replay?'replay':route.map?'play':'maps');}catch{}this.boot();
    }
    get dialogOpen(){return !!document.querySelector('dialog[open]');}
    notify(message,type='info'){const el=byId('toast-notification');clearTimeout(this.toastTimer);el.textContent=message;el.className='toast show '+(type==='info'?'':type);this.toastTimer=setTimeout(()=>el.classList.remove('show'),3500);}
    bind(){
        document.querySelectorAll('[data-column]').forEach(b=>b.onclick=()=>this.switchColumn(b.dataset.column));
        document.querySelectorAll('[data-close-dialog]').forEach(b=>b.onclick=()=>byId(b.dataset.closeDialog).close());
        for(const d of document.querySelectorAll('dialog'))d.addEventListener('close',()=>this.game?.updateDpadVisibility());
        byId('help-btn').onclick=async()=>{this.game?.stopAutoMove();this.game?.pauseReplay();byId('help-dialog').showModal();this.game?.updateDpadVisibility();try{const m=await this.helpModule();byId('help-body').innerHTML=m.helpContent;}catch{byId('help-body').textContent='帮助加载失败，请关闭后重试。';}};
        byId('theme-toggle').addEventListener('click',()=>requestAnimationFrame(()=>{this.game?.resize();if(this.view==='editor'||this.draftVisible)this.editor?.draw();this.cards.refreshVisible();}));
        const premium=byId('premium-section'),summary=premium.querySelector('summary');
        summary.addEventListener('click',async e=>{
            if(premium.open||this.cards.isReady(byId('premium-map-grid')))return;
            e.preventDefault();this.premiumWanted=!this.premiumWanted;
            if(this.premiumLoading)return;
            this.premiumLoading=true;summary.setAttribute('aria-busy','true');
            try{const ready=await this.cards.preload(byId('premium-map-grid'));if(ready&&this.premiumWanted)premium.open=true;else if(!ready&&this.premiumWanted)this.notify('地图预览加载失败，请刷新后重试','error');}
            finally{this.premiumLoading=false;this.premiumWanted=false;summary.removeAttribute('aria-busy');}
        });
        byId('generate-map-btn').onclick=()=>{this.randomModule().then(m=>m.warmRandomGenerator()).catch(()=>{});this.game?.stopAutoMove();byId('new-map-dialog').showModal();byId('new-map-health').focus();this.game?.updateDpadVisibility();};
        byId('new-map-form').onsubmit=e=>{e.preventDefault();this.generateMap();};
        byId('new-map-dialog').addEventListener('close',()=>this.generationAbort?.abort());
        byId('load-link-btn').onclick=()=>{const raw=byId('load-link-input').value.trim();if(!raw)return;this.loadURL(/^[A-Za-z0-9_-]+$/.test(raw)?routeURL({map:raw}):raw);};
        byId('load-link-input').addEventListener('keydown',e=>{if(e.key==='Enter')byId('load-link-btn').click();});
        for(const [id,panel] of [['save-menu-btn','save'],['solve-map-btn','solve']])byId(id).addEventListener('click',()=>this.openPlayPanel(panel));
        byId('save-btn').onclick=()=>{const result=this.game.controller.save();if(result.ok){this.renderPoints();this.notify('已在第 '+result.step+' 步建立存档点');}else this.notify(result.error,'error');};
        byId('save-map-local').onclick=()=>this.saveLocal('map',routeURL({map:this.mapCode}));
        byId('solver-continue-btn').onclick=()=>this.solver?.continue();byId('solver-more-btn').onclick=()=>this.solver?.more();
        this.library.subscribe(()=>this.renderLibraries());
        for(const [id,key] of [['local-section','locals'],['premium-section','premium'],['draft-section','drafts']]){const value=safeGet('ghostmaze-fold-'+key);if(id==='premium-section')byId(id).open=false;else if(value!==null)byId(id).open=value==='open';byId(id).addEventListener('toggle',()=>safeSet('ghostmaze-fold-'+key,byId(id).open?'open':'closed'));}
        window.addEventListener('keydown',e=>this.key(e));window.addEventListener('popstate',()=>this.loadURL(location.href,{replace:true}));
        document.addEventListener('visibilitychange',()=>{if(document.hidden){this.game?.pauseReplay();this.game?.stopAutoMove();}});
        new ResizeObserver(()=>this.game?.resize()).observe(document.querySelector('.canvas-host'));
    }
    async generateMap(){
        if(this.generationAbort)return;
        const size=Number(byId('new-map-size').value),health=Number(byId('new-map-health').value);
        if(!Number.isInteger(size)||size<8||size>20||!Number.isInteger(health)||health<1||health>0xffffffff)return;
        const abort=new AbortController(),button=byId('new-map-form').querySelector('[type=submit]');
        this.generationAbort=abort;button.disabled=true;button.textContent='正在生成…';byId('new-map-form').setAttribute('aria-busy','true');
        try{
            const {generateRandomMap}=await this.randomModule();
            const code=await generateRandomMap(size,health,{signal:abort.signal});
            if(!abort.signal.aborted&&await this.loadURL(routeURL({map:code})))byId('new-map-dialog').close();
        }catch(error){if(error.name!=='AbortError')this.notify(error.message,'error');}
        finally{if(this.generationAbort===abort){this.generationAbort=null;button.disabled=false;button.textContent='生成';byId('new-map-form').removeAttribute('aria-busy');}}
    }
    randomModule(){return this.randomPromise??=import('./site/randomMap.js').catch(error=>{this.randomPromise=null;throw error;});}
    async boot(){
        let route;try{route=readRoute(location.href);}catch(error){this.notify(error.message,'error');}
        if(route?.map||route?.draft)await this.loadURL(location.href,{replace:true,initial:true});else await this.ensureRuntime();
        performance.mark('ghostmaze-current-ready');
        idle(()=>{this.ensureEditor().catch(()=>{});this.helpModule().catch(()=>{});this.getSolver().catch(()=>{});this.randomModule().then(m=>m.warmRandomGenerator()).catch(()=>{});this.cards.preload(byId('premium-map-grid'));});
    }
    async ensureRuntime(){
        if(!this.runtimePromise)this.runtimePromise=(async()=>{
            const [main,codec,controller,replay,history]=await Promise.all([import('./main.js'),import('./core/dataSerializer.js'),import('./core/gameController.js'),import('./core/replaySerializer.js'),import('./core/actionHistory.js'),import('./vendor/pako.js')]);
            this.runtime={...codec,...controller,...replay,...history};this.game=window.game=new main.GhostMazeGame(this);window.dispatchEvent(new CustomEvent('ghostmaze:runtime-ready'));return this.runtime;
        })();return this.runtimePromise;
    }
    async ensureEditor(){if(!this.editorPromise)this.editorPromise=(async()=>{await this.ensureRuntime();const {EditorApp}=await import('./editorMain.js');this.editor=window.editorApp=new EditorApp(this);performance.mark('ghostmaze-editor-ready');return this.editor;})();return this.editorPromise;}
    async getSolver(){if(!this.solverPromise)this.solverPromise=(async()=>{const {SolveService}=await import('./solver/solveService.js');this.solver=new SolveService(this);if(this.mapCode&&this.game?.controller.mapData)this.solver.prepare(this.game.controller.mapData,this.mapCode,true);return this.solver;})();return this.solverPromise;}
    helpModule(){return this.helpPromise??=import('./helpContent.js');}
    async thumbnailModule(){await this.ensureRuntime();return this.thumbnailsPromise??=import('./site/thumbnails.js');}
    setURL(route,{push=false}={}){const url=routeURL(route);if(push&&url!==location.href)history.pushState({},'',url);else if(url!==location.href)history.replaceState({},'',url);}
    async loadMap(map,code=null){await this.ensureRuntime();const encoded=code?{success:true,code}:this.runtime.DataSerializer.generateShareCode(map);if(!encoded.success){this.notify(encoded.error,'error');return false;}return this.loadURL(routeURL({map:encoded.code}));}
    async loadURL(input,{replace=false,initial=false}={}){
        const token=++this.loadToken;this.loading=true;byId('map-loading').hidden=false;this.game?.stopAutoMove();this.game?.pauseReplay();
        try{
            const route=readRoute(input);await this.ensureRuntime();
            if(route.draft){const [{decodeDraft},editor]=await Promise.all([import('./editor/draftCodec.js'),this.ensureEditor()]);const result=decodeDraft(route.draft);if(!result.success)throw new Error(result.error);if(token!==this.loadToken)return false;
                this.game.clear();this.mapCode=null;this.draftVisible=true;editor.loaded=false;editor.enter(null,null,result.snapshot);this.hasLoadedMap=true;this.recoverAllowed=false;safeSet(AUTO,'');this.solutionOrigin=null;this.replaySource='current';this.setURL(route,{push:!replace});this.showColumn('editor');editor.fit();this.renderLibraries();return true;
            }
            if(!route.map){if(token!==this.loadToken)return false;this.game.clear();this.editor&&(this.editor.loaded=false);this.mapCode=null;this.draftVisible=false;this.hasLoadedMap=false;this.recoverAllowed=true;this.solutionOrigin=null;this.setURL({}, {push:!replace});this.showColumn('maps');return true;}
            const decoded=this.runtime.DataSerializer.loadFromShareCode(route.map);if(!decoded.success)throw new Error(decoded.error);
            const candidate=new this.runtime.GameController();const started=candidate.startGame(decoded.data.mapData);if(!started.success)throw new Error(started.error);
            let actions=null;if(route.save||route.replay){const replay=this.runtime.ReplaySerializer.loadFromShareCode(candidate.mapData,route.save||route.replay);if(!replay.success)throw new Error(replay.error);actions=replay.actions;if(route.save)await candidate.loadActionsAsync(candidate.mapData,actions);}
            if(token!==this.loadToken)return false;
            this.mapCode=route.map;this.draftVisible=false;this.game.install(candidate,route.map);this.editor&&(this.editor.loaded=false);this.hasLoadedMap=true;this.recoverAllowed=false;safeSet(AUTO,'');this.solutionOrigin=null;this.replayDirty=true;clearTimeout(this.editorSolveTimer);this.solver?.invalidate();
            this.setURL(route,{push:!replace});
            if(route.replay){this.replaySource='external';this.game.openReplay(candidate.mapData,actions,route.map);this.showColumn('replay');}
            else {this.replaySource='current';this.showColumn('play');}
            this.playPanel=null;this.syncPlayPanel();this.renderPoints();idle(()=>{if(token===this.loadToken)this.getSolver().then(s=>{if(token===this.loadToken)s.prepare(candidate.mapData,route.map,true);});});return true;
        }catch(error){if(token===this.loadToken)this.notify(error.message,'error');return false;}
        finally{if(token===this.loadToken){this.loading=false;byId('map-loading').hidden=true;this.renderMap();this.game?.updateDpadVisibility();}}
    }
    async switchColumn(view){
        if(this.loading)return;await this.ensureRuntime();this.game.stopAutoMove();this.game.pauseReplay();
        if(this.editor?.loaded&&(this.view==='editor'||this.draftVisible)){this.editor.cancelGesture();if(view==='play'||view==='replay'){const valid=this.editor.code();if(!valid.success){this.notify('草稿尚未完成：'+valid.error,'error');return;}if(!this.game.controller.mapData){const c=new this.runtime.GameController();c.startGame(this.editor.editorDoc.toMapData());this.mapCode=valid.code;this.game.install(c,valid.code);}}}
        if(view==='editor'){
            const editor=await this.ensureEditor();if(!editor.loaded){let recovered=null;
                if(this.recoverAllowed&&!this.hasLoadedMap){const code=safeGet(AUTO);if(code){const {decodeDraft}=await import('./editor/draftCodec.js');const decoded=decodeDraft(code);if(decoded.success){recovered=decoded.snapshot;this.draftVisible=true;this.setURL({draft:code});}}}
                editor.enter(this.game.controller.mapData,this.mapCode,recovered);
            }
            this.showColumn(view);return;
        }
        if(view==='play'&&!this.game.controller.mapData){this.notify('加载地图以开始');return;}
        if(view==='replay'&&this.game.controller.mapData&&this.replaySource==='current')this.refreshCurrentReplay();
        this.showColumn(view);
    }
    showColumn(view){
        if(view!=='editor')this.editor?.properties.hide();
        this.scrolls[this.view]=byId('panel-scroll').scrollTop;this.view=view;
        for(const name of ['maps','play','replay','editor']){byId('pane-'+name).hidden=view!==name;byId('tab-'+name).setAttribute('aria-selected',String(view===name));}
        byId('panel-scroll').scrollTop=this.scrolls[view]||0;
        if(view==='editor')this.editor?.sync();else if(view==='replay')this.game?.syncReplay();else this.game?.sync();
        this.game?.updateDpadVisibility();this.renderMap();
    }
    renderMap(){
        if(!this.game)return;const editing=this.view==='editor'||this.draftVisible;
        const loaded=editing?!!this.editor?.loaded:!!this.game.activeController.currentGameState;
        byId('map-empty').hidden=loaded;
        if(editing&&this.editor?.loaded)this.editor.draw();else if(loaded)this.game.draw();else this.game.ctx.clearRect(0,0,this.game.canvas.width,this.game.canvas.height);
        this.renderLayers();
    }
    renderLayers(){
        const bar=byId('layer-panel'),editing=this.view==='editor'||this.draftVisible,doc=editing?this.editor?.editorDoc:null,a=this.game?.activeController,count=doc?.layerCount||a?.mapDefinition?.layerCount||1,current=doc?.currentLayer??a?.viewLayer??0;
        const focus=document.activeElement,focused=bar.contains(focus)?{id:focus.id,layer:focus.dataset.layer}:null;
        bar.hidden=count===1;
        if(count===1){bar.replaceChildren();delete bar.dataset.structure;if(focused)(byId(this.view==='editor'?'layer-mode-single-btn':'tab-'+this.view))?.focus({preventScroll:true});return;}
        const playerLayer=doc?doc.playerLayer:a?.currentGameState?.player.layer,hasStart=!doc||doc.hasStartPoint();
        const vertical=matchMedia('(min-width:769px)').matches,key=[count,!!doc,vertical].join(':');
        if(!vertical){const slots=count+2,max=Math.max(1,Math.floor((bar.clientWidth+6)/40));bar.style.setProperty('--layer-columns',String(Math.ceil(slots/Math.ceil(slots/max))));}
        if(bar.dataset.structure!==key){
            bar.replaceChildren();bar.dataset.structure=key;
            const step=add=>{
                if(!doc){const slot=document.createElement('span');slot.className='layer-slot';slot.setAttribute('aria-hidden','true');bar.append(slot);return;}
                const b=document.createElement('button');b.id=add?'layer-add-btn':'layer-remove-btn';b.className='secondary layer-step';b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+(add?'M5 12h14M12 5v14':'M5 12h14')+'"/></svg>';b.title=b.ariaLabel=add?'添加楼层':'删除顶层';b.disabled=add&&count>=10;b.onclick=()=>add?this.editor.addLayer():this.editor.removeLayer();bar.append(b);
            };
            // 游玩和回放也保留加减号的空位，手机换行不会改变地图区高度。
            step(vertical);
            for(let n=0;n<count;n++){const i=vertical?count-1-n:n,b=document.createElement('button');b.textContent=String(i+1);b.dataset.layer=i;b.setAttribute('aria-label','查看第'+(i+1)+'层');b.onclick=()=>{if(doc)this.editor.switchToLayer(i);else this.game.switchToLayer(i);};bar.append(b);}
            step(!vertical);
        }
        for(const b of bar.querySelectorAll('[data-layer]')){const i=Number(b.dataset.layer);b.className='layer-btn'+(i===current?' active':' secondary')+(hasStart&&i===playerLayer?' player-layer':'');b.setAttribute('aria-current',String(i===current));b.setAttribute('aria-pressed',String(i===current));}
        if(focused&&!bar.contains(document.activeElement)){const target=focused.layer!==undefined?bar.querySelector('[data-layer="'+focused.layer+'"]'):byId(focused.id);(target&&!target.disabled?target:bar.querySelector('[data-layer="'+current+'"]'))?.focus({preventScroll:true});}
    }

    renderLibraries(){
        const locals=this.library.list('play').map(e=>({...e,local:true})),drafts=this.library.list('draft').map(e=>({...e,local:true}));
        byId('local-count').textContent=locals.length+' 个';byId('local-empty').hidden=!!locals.length;this.cards.fill(byId('local-map-grid'),locals);
        byId('draft-count').textContent=drafts.length+' 个';byId('draft-empty').hidden=!!drafts.length;this.cards.fill(byId('draft-grid'),drafts);
        byId('premium-count').textContent=aiMaps.length+' 张';this.cards.fill(byId('premium-map-grid'),aiMaps.map(m=>({...m,kind:'map',url:routeURL({map:m.mapCode})})));
    }
    renderPoints(){
        const points=this.game?.controller.checkpoints||[];byId('checkpoint-empty').hidden=!!points.length;
        byId('checkpoint-list').replaceChildren(...points.slice().reverse().map(p=>this.cards.make({...p,kind:'save',url:routeURL({map:this.mapCode,save:p.code})},{checkpoint:true})));
    }
    saveLocal(kind,url){try{this.library.save(kind,url);this.notify('已保存到本地');}catch(error){this.notify(error.message,'error');}}
    async saveDraft(){
        const {encodeDraft}=await import('./editor/draftCodec.js');const encoded=encodeDraft(this.editor.workspace.snapshot());
        if(!encoded.success){this.notify(encoded.error,'error');return;}this.saveLocal('draft',routeURL({draft:encoded.code}));
    }
    editorChanged(editor){
        const result=editor.code();this.solutionOrigin=null;this.replaySource='current';this.replayDirty=true;
        if(result.success){const candidate=new this.runtime.GameController();const valid=candidate.startGame(editor.editorDoc.toMapData());if(valid.success){this.mapCode=result.code;this.draftVisible=false;this.game.install(candidate,result.code);this.setURL({map:result.code});}}
        else {this.mapCode=null;this.draftVisible=true;this.game.clear();}
        const token=this.loadToken,snapshot=editor.workspace.snapshot();
        import('./editor/draftCodec.js').then(({encodeDraft})=>{if(token!==this.loadToken||!editor.loaded)return;const draft=encodeDraft(snapshot);if(draft.success){safeSet(AUTO,draft.code);if(!result.success)this.setURL({draft:draft.code});}});
        this.game.replay=null;this.game.syncReplay();this.renderPoints();
        clearTimeout(this.editorSolveTimer);this.solver?.invalidate();if(result.success)this.editorSolveTimer=setTimeout(()=>this.getSolver().then(s=>s.prepare(editor.editorDoc.toMapData(),result.code,true)),650);
    }
    gameChanged(){
        this.setURL({map:this.mapCode});this.solutionOrigin=null;this.replaySource='current';this.replayDirty=true;this.game.sync();
    }
    refreshCurrentReplay(){
        const c=this.game.controller,actions=c.replayActions,signature=this.mapCode+':'+actions.join(',');
        if(!this.game.replay||signature!==this.replaySignature||this.replayDirty){this.game.openReplay(c.mapData,actions,this.mapCode);this.replaySignature=signature;this.replayDirty=false;}
    }
    async openPlayPanel(panel){
        if(!this.game?.controller.mapData)return;this.playPanel=panel;this.syncPlayPanel();
        if(panel==='save')this.renderPoints();else {const solver=await this.getSolver();solver.prepare(this.game.controller.mapData,this.mapCode,false);solver.mount(byId('solve-pane'));solver.activate();}
    }
    syncPlayPanel(){
        byId('play-menu-content').hidden=!this.playPanel;byId('save-pane').hidden=this.playPanel!=='save';byId('solve-pane').hidden=this.playPanel!=='solve';
        byId('save-menu-btn').setAttribute('aria-expanded',String(this.playPanel==='save'));byId('solve-map-btn').setAttribute('aria-expanded',String(this.playPanel==='solve'));
        for(const [id,panel] of [['save-menu-btn','save'],['solve-map-btn','solve']])byId(id).setAttribute('aria-pressed',String(this.playPanel===panel));
    }
    saveEditorMap(){
        const code=this.editor.code();if(!code.success){this.notify('地图尚未完成：'+code.error,'error');return;}
        this.saveLocal('map',routeURL({map:code.code}));
    }
    async openSolution(mapCode,code){
        const parsed=this.runtime.DataSerializer.loadFromShareCode(mapCode),decoded=parsed.success&&this.runtime.ReplaySerializer.loadFromShareCode(parsed.data.mapData,code);
        if(!parsed.success||!decoded.success){this.notify(parsed.error||decoded.error,'error');return;}
        this.solutionOrigin={view:this.view,url:location.href,playPanel:this.playPanel};this.replaySource='external';
        this.game.openReplay(parsed.data.mapData,decoded.actions,mapCode);this.setURL({map:mapCode,replay:code},{push:true});this.showColumn('replay');
    }
    returnFromSolution(){
        const origin=this.solutionOrigin;if(!origin)return;this.game.pauseReplay();history.replaceState({},'',origin.url);this.showColumn(origin.view);
        if(origin.view==='play'){this.playPanel='solve';this.syncPlayPanel();this.solver?.mount(byId('solve-pane'));}

    }
    async loadReplayStep(){
        const r=this.game.replay;if(!r)return;this.game.pauseReplay();const actions=r.history.actions.slice(0,r.currentStep),encoded=this.runtime.ReplaySerializer.generateShareCode(r.mapData,actions);
        if(!encoded.success){this.notify(encoded.error,'error');return;}await this.loadURL(routeURL({map:r.mapCode,save:encoded.code}));
    }
    key(e){
        const target=e.target,k=e.key.toLowerCase(),typing=target?.isContentEditable||['SELECT','TEXTAREA'].includes(target?.tagName)||target?.tagName==='INPUT'&&!['checkbox','radio','range','button'].includes(target.type);
        if(this.dialogOpen||typing||this.loading)return;if(k===' '&&target?.tagName==='INPUT'&&['checkbox','radio'].includes(target.type))return;
        if(!e.ctrlKey&&!e.metaKey&&!e.altKey&&['1','2','3','4'].includes(k)){e.preventDefault();this.switchColumn(['maps','play','replay','editor'][Number(k)-1]);return;}
        const modifier=e.ctrlKey||e.metaKey;
        if(modifier&&k==='z'){if(this.view==='play'){e.preventDefault();e.shiftKey?this.game.handleRedo():this.game.handleUndo();}else if(this.view==='editor'){e.preventDefault();e.shiftKey?this.editor.redo():this.editor.undo();}return;}
        if(modifier&&k==='y'){if(this.view==='play'){e.preventDefault();this.game.handleRedo();}else if(this.view==='editor'){e.preventDefault();this.editor.redo();}return;}
        if(modifier&&k==='s'){if(this.view==='play'){e.preventDefault();const point=this.game.controller.save();if(point.ok){this.renderPoints();this.notify('已建立存档点');}else this.notify(point.error,'error');}else if(this.view==='editor'){e.preventDefault();this.saveDraft();}return;}
        if(modifier||e.altKey)return;
        if(this.view==='replay'&&this.game?.replay){
            if(k===' '){e.preventDefault();this.game.replayPlaying?this.game.pauseReplay():this.game.playReplay();}
            else if(['arrowleft','a','arrowright','d'].includes(k)){e.preventDefault();this.game.seekReplay(this.game.replay.currentStep+(['a','arrowleft'].includes(k)?-1:1));}
            else if(['arrowup','w','arrowdown','s'].includes(k)){e.preventDefault();this.game.changeSpeed(['w','arrowup'].includes(k)?1:-1);}
        }else if(this.view==='editor')this.editor?.handleKey(e);else if(this.view==='play'){if(k===' '){e.preventDefault();this.game?.useStair();}else this.game?.handleKey(e);}
    }
}
new Application();
