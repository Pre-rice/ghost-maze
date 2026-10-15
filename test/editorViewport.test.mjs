import test from 'node:test';
import assert from 'node:assert/strict';
import {fitScale,resizeView} from '../src/editor/viewport.js';

const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('电脑与手机尺寸往返二十次后，编辑比例和中心完全恢复',()=>{
    const frame={x:0,y:0,width:8,height:8},desktop={width:756,height:756},phone={width:366,height:302};
    const original={scale:88.5,x:24,y:24};let view={...original};
    for(let i=0;i<20;i++){view=resizeView(view,frame,desktop,phone,180);view=resizeView(view,frame,phone,desktop,180);}
    for(const key of ['scale','x','y'])near(view[key],original[key]);
});

test('手动缩放和平移后，改变窗口保留倍率和正在观察的地图位置',()=>{
    const frame={x:3,y:2,width:5,height:9},cap=360;
    let size={width:1280,height:900},view={scale:fitScale(frame,1280,900,cap)*1.7,x:-60,y:110};
    const zoom=view.scale/fitScale(frame,size.width,size.height,cap),center={x:(size.width/2-view.x)/view.scale,y:(size.height/2-view.y)/view.scale};
    for(const next of [{width:780,height:420},{width:1440,height:1440},{width:320,height:240},size]){
        view=resizeView(view,frame,size,next,cap);size=next;
        near(view.scale/fitScale(frame,size.width,size.height,cap),zoom);
        near((size.width/2-view.x)/view.scale,center.x);near((size.height/2-view.y)/view.scale,center.y);
    }
});

test('达到最大格宽的单格图往返大窗和小窗不积累缩小',()=>{
    const frame={x:0,y:0,width:1,height:1},large={width:1000,height:1000},small={width:120,height:100};
    const original={scale:180,x:410,y:410};
    const next=resizeView(resizeView(original,frame,large,small,180),frame,small,large,180);
    for(const key of ['scale','x','y'])near(next[key],original[key]);
});
