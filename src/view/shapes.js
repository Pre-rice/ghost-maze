/**
 * 元件绘制尺寸：渲染器与编辑器命中判定共用一套数值，擦除与按钮点击都按画出来的形状算。
 * 长度均以格宽为单位。
 */
export const SHAPE = {
    circleRadius: .35,   // 鬼、出生点、终点
    keyRadius: .3,       // 钥匙（菱形半对角线）
    buttonLength: .5,    // 按钮长条长度
    buttonWidth: .2,     // 按钮长条贴着墙的那条边厚度
    stairSize: .7        // 楼梯方块边长
};

/** 圆形命中：鬼、出生点、终点。 */
export function hitsCircle(px, py, cellX, cellY, cellSize) {
    const radius = cellSize * SHAPE.circleRadius;
    return Math.hypot(px - (cellX + .5) * cellSize, py - (cellY + .5) * cellSize) <= radius;
}

/** 菱形命中：钥匙。 */
export function hitsKey(px, py, cellX, cellY, cellSize) {
    const size = cellSize * SHAPE.keyRadius;
    return Math.abs(px - (cellX + .5) * cellSize) + Math.abs(py - (cellY + .5) * cellSize) <= size;
}

/** 按钮长条的像素矩形，与 drawButton 的绘制一致。 */
export function buttonRect(button, cellSize) {
    const length = cellSize * SHAPE.buttonLength, width = cellSize * SHAPE.buttonWidth;
    const centerX = (button.x + .5) * cellSize, centerY = (button.y + .5) * cellSize;
    const { dx, dy } = button.direction;
    if (dy === -1) return { x: centerX - length / 2, y: button.y * cellSize, width: length, height: width };
    if (dy === 1) return { x: centerX - length / 2, y: (button.y + 1) * cellSize - width, width: length, height: width };
    if (dx === -1) return { x: button.x * cellSize, y: centerY - length / 2, width, height: length };
    return { x: (button.x + 1) * cellSize - width, y: centerY - length / 2, width, height: length };
}

/** 按钮命中：只认长条矩形本身（外扩传 0 即可，默认不外扩）。 */
export function hitsButton(px, py, button, cellSize, slack = 0) {
    const rect = buttonRect(button, cellSize), pad = cellSize * slack;
    return px >= rect.x - pad && px <= rect.x + rect.width + pad &&
        py >= rect.y - pad && py <= rect.y + rect.height + pad;
}

/** 楼梯方块命中。 */
export function hitsStair(px, py, cellX, cellY, cellSize) {
    const size = cellSize * SHAPE.stairSize;
    const left = (cellX + .5) * cellSize - size / 2, top = (cellY + .5) * cellSize - size / 2;
    return px >= left && px <= left + size && py >= top && py <= top + size;
}
