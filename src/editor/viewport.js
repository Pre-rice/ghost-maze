/** 用相对于聚焦尺寸的倍率缩放，宽高比往返变化时不累积缩小。 */
export function fitScale(frame,width,height,cap) {
    return Math.max(.01,Math.min((width-48)/frame.width,(height-48)/frame.height,cap));
}

export function resizeView(view,frame,oldSize,newSize,cap) {
    if(oldSize.width===newSize.width&&oldSize.height===newSize.height)return view;
    const ratio=fitScale(frame,newSize.width,newSize.height,cap)/fitScale(frame,oldSize.width,oldSize.height,cap);
    return {
        scale:view.scale*ratio,
        x:newSize.width/2-(oldSize.width/2-view.x)*ratio,
        y:newSize.height/2-(oldSize.height/2-view.y)*ratio
    };
}
