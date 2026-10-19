import {safeGet,safeSet} from '../storage.js';

const KEY='ghostmaze-mobile-map-share-v1';
/** 手机调整上下两区比例，所有栏目共用同一尺寸；电脑仍用原左右布局。 */
export class MobileLayout {
    constructor(){
        this.layout=document.querySelector('.site-layout');this.stage=document.getElementById('map-stage');this.divider=document.getElementById('layout-divider');
        const saved=Number(safeGet(KEY));this.share=saved>=.2&&saved<=.7?saved:null;this.apply();
        window.addEventListener('resize',()=>{this.apply();this.sync();});
        this.divider.addEventListener('pointerdown',e=>{
            if(e.button!==0)return;e.preventDefault();this.divider.setPointerCapture(e.pointerId);
            this.drag={y:e.clientY,height:this.stage.getBoundingClientRect().height};this.divider.classList.add('dragging');
        });
        this.divider.addEventListener('pointermove',e=>{if(this.drag)this.set((this.drag.height+e.clientY-this.drag.y)/this.layout.clientHeight);});
        for(const type of ['pointerup','pointercancel','lostpointercapture'])this.divider.addEventListener(type,()=>{if(this.drag){this.drag=null;this.divider.classList.remove('dragging');this.save();}});
        this.divider.addEventListener('dblclick',()=>this.reset());
        this.resize=new ResizeObserver(()=>this.sync());this.resize.observe(this.stage);this.sync();
    }
    limits(){const h=this.layout.clientHeight,min=Math.max(.2,150/h);return {min,max:Math.max(min,Math.min(.7,1-194/h))};}
    set(value){const {min,max}=this.limits();this.share=Math.max(min,Math.min(max,value));this.apply();}
    apply(){if(this.share===null){this.layout.style.removeProperty('--mobile-map-share');return;}const {min,max}=this.limits();this.layout.style.setProperty('--mobile-map-share',Math.max(min,Math.min(max,this.share))*100+'%');}
    save(){safeSet(KEY,String(this.stage.getBoundingClientRect().height/this.layout.clientHeight));}
    reset(){this.share=null;this.apply();safeSet(KEY,'');}
    sync(){
        if(!matchMedia('(max-width:768px)').matches)return;
        const {min,max}=this.limits(),value=Math.round(this.stage.getBoundingClientRect().height/this.layout.clientHeight*100);
        this.divider.setAttribute('aria-valuemin',String(Math.round(min*100)));this.divider.setAttribute('aria-valuemax',String(Math.round(max*100)));this.divider.setAttribute('aria-valuenow',String(value));this.divider.setAttribute('aria-valuetext','地图 '+value+'%，面板 '+(100-value)+'%');
    }
}
