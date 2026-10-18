/** 电脑端小地图统一按6×6的最小显示格宽；手机端为0，仍按实际跨度铺满。 */
export const SMALL_MAP_MIN_SPAN = 6;

/** 当前布局下的最小格宽：手机返回0，电脑返回6。 */
export function smallMapMinSpan() {
    if (!globalThis.matchMedia) return 0;
    return globalThis.matchMedia('(max-width:768px)').matches ? 0 : SMALL_MAP_MIN_SPAN;
}

/** 用相对于聚焦尺寸的倍率缩放，宽高比往返变化时不累积缩小；宽高都不超过minSpan时才放大到minSpan。 */
export function fitScale(frame, width, height, cap, minSpan = 0) {
    const small = minSpan > 0 && frame.width <= minSpan && frame.height <= minSpan;
    return Math.max(.01, Math.min((width - 48) / (small ? minSpan : frame.width), (height - 48) / (small ? minSpan : frame.height), cap));
}

export function resizeView(view, frame, oldSize, newSize, cap, minSpan = 0) {
    if (oldSize.width === newSize.width && oldSize.height === newSize.height) return view;
    const ratio = fitScale(frame, newSize.width, newSize.height, cap, minSpan) / fitScale(frame, oldSize.width, oldSize.height, cap, minSpan);
    return {
        scale: view.scale * ratio,
        x: newSize.width / 2 - (oldSize.width / 2 - view.x) * ratio,
        y: newSize.height / 2 - (oldSize.height / 2 - view.y) * ratio
    };
}
