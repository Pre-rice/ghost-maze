/** 面板原生滚动配叠放滑条；内容宽度不随溢出改变。 */
export class PanelScroll {
    constructor(){
        this.content=document.getElementById('panel-scroll');
        this.track=document.getElementById('panel-scrollbar');
        this.thumb=this.track.firstElementChild;
        const schedule=()=>{if(!this.frame)this.frame=requestAnimationFrame(()=>{this.frame=0;this.update();});};
        this.content.addEventListener('scroll',schedule,{passive:true});
        window.addEventListener('resize',schedule,{passive:true});
        this.resize=new ResizeObserver(schedule);
        this.resize.observe(this.content);
        document.querySelectorAll('[role=tabpanel]').forEach(pane=>this.resize.observe(pane));
        this.mutations=new MutationObserver(schedule);
        this.mutations.observe(this.content,{subtree:true,childList:true,attributes:true});
        this.track.addEventListener('pointerdown',e=>{
            if(e.button!==0)return;e.preventDefault();this.track.setPointerCapture(e.pointerId);
            const r=this.track.getBoundingClientRect(),t=this.thumb.getBoundingClientRect();
            this.drag={offset:e.target===this.thumb?e.clientY-t.top:t.height/2};this.seek(e.clientY,r);
        });
        this.track.addEventListener('pointermove',e=>{if(this.drag)this.seek(e.clientY);});
        for(const event of ['pointerup','pointercancel','lostpointercapture'])this.track.addEventListener(event,()=>{this.drag=null;});
        this.track.addEventListener('keydown',e=>{
            const delta={ArrowDown:40,ArrowUp:-40,PageDown:this.content.clientHeight*.9,PageUp:-this.content.clientHeight*.9};
            if(e.key in delta){e.preventDefault();e.stopPropagation();this.content.scrollTop+=delta[e.key];}
        });
        this.update();
    }
    seek(clientY,r=this.track.getBoundingClientRect()){
        const range=r.height-this.thumb.offsetHeight;
        if(range>0)this.content.scrollTop=Math.max(0,Math.min(1,(clientY-r.top-this.drag.offset)/range))*(this.content.scrollHeight-this.content.clientHeight);
    }
    update(){
        const c=this.content,overflow=c.scrollHeight-c.clientHeight;
        this.track.hidden=overflow<1;
        if(overflow>=1){
            const height=Math.max(24,this.track.clientHeight*c.clientHeight/c.scrollHeight);
            this.thumb.style.height=height+'px';
            this.thumb.style.transform=`translateY(${(this.track.clientHeight-height)*c.scrollTop/overflow}px)`;
            this.track.setAttribute('aria-valuemin','0');this.track.setAttribute('aria-valuemax',String(overflow));this.track.setAttribute('aria-valuenow',String(Math.round(c.scrollTop)));
        }
        const inset=document.querySelector('.site-layout').getBoundingClientRect().left;
        document.documentElement.style.setProperty('--page-inset',inset+'px');
    }
}
