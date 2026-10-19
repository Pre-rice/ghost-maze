/**
 * 元件绘制尺寸：渲染器与编辑器命中判定共用一套数值，擦除与按钮点击都按画出来的形状算。
 * 长度均以格宽为单位；描边线宽在这里统一给出，绘制和命中都调用同一份。
 */
export const SHAPE = {
    circleRadius: .35,   // 鬼、出生点、终点
    keyRadius: .3,       // 钥匙（菱形半对角线）
    buttonLength: .5,    // 按钮长条长度
    buttonWidth: .2,     // 按钮长条贴着墙的那条边厚度
    stairSize: .7        // 楼梯方块边长
};

/** 抗锯齿会把线画到几何边界外不到一个像素，命中判定留这一像素余量。 */
const ANTIALIAS = 1;

/**
 * 与渲染一致的描边宽度（px）。绘制与命中判定都必须从这里取，否则又会出现“按线的中心算”的偏差。
 * @param {'wall'|'thinWall'|'button'|'stair'} kind - 元件种类；数字门和单向门的墙线更细，用 thinWall
 * @param {number} cellSize - 格宽
 * @param {boolean} [isHighlight] - 放置预览高亮时的加粗线宽
 */
export function strokeWidth(kind, cellSize, isHighlight = false) {
    if (isHighlight) return kind === 'stair' ? Math.max(3.5, cellSize / 12) : Math.max(3, cellSize / 8);
    if (kind === 'stair') return Math.max(2.5, cellSize / 14);
    if (kind === 'thinWall') return Math.max(3, cellSize / 12);
    if (kind === 'button') return Math.max(2, cellSize / 10);
    return Math.max(2, cellSize / 10);
}

/** 圆形命中：鬼、出生点、终点。都是实心圆，半径就是画出来的半径。 */
export function hitsCircle(px, py, cellX, cellY, cellSize) {
    const radius = cellSize * SHAPE.circleRadius;
    return Math.hypot(px - (cellX + .5) * cellSize, py - (cellY + .5) * cellSize) <= radius;
}

/** 菱形命中：钥匙。实心菱形，半对角线就是画出来的尺寸。 */
export function hitsKey(px, py, cellX, cellY, cellSize) {
    const size = cellSize * SHAPE.keyRadius;
    return Math.abs(px - (cellX + .5) * cellSize) + Math.abs(py - (cellY + .5) * cellSize) <= size;
}

/** 按钮描边路径的像素矩形（就是 drawButton 里 p1～p4 画的那段矩形），不含线宽。 */
export function buttonRect(button, cellSize) {
    const length = cellSize * SHAPE.buttonLength, width = cellSize * SHAPE.buttonWidth;
    const centerX = (button.x + .5) * cellSize, centerY = (button.y + .5) * cellSize;
    const { dx, dy } = button.direction;
    if (dy === -1) return { x: centerX - length / 2, y: button.y * cellSize, width: length, height: width };
    if (dy === 1) return { x: centerX - length / 2, y: (button.y + 1) * cellSize - width, width: length, height: width };
    if (dx === -1) return { x: button.x * cellSize, y: centerY - length / 2, width, height: length };
    return { x: (button.x + 1) * cellSize - width, y: centerY - length / 2, width, height: length };
}

/**
 * 按钮命中：贴到画出来的外沿。描边以路径为中心向外各伸出半个线宽，
 * 只有贴着墙的那一条边是平头端点，所以外沿到墙线为止，不越过本格。
 * @param {number} slack - 额外容差（以格宽为单位），默认 0
 */
export function hitsButton(px, py, button, cellSize, slack = 0) {
    const rect = buttonRect(button, cellSize);
    const pad = strokeWidth('button', cellSize) / 2 + ANTIALIAS + cellSize * slack;
    return px >= Math.max(rect.x - pad, button.x * cellSize) && px <= Math.min(rect.x + rect.width + pad, (button.x + 1) * cellSize) &&
        py >= Math.max(rect.y - pad, button.y * cellSize) && py <= Math.min(rect.y + rect.height + pad, (button.y + 1) * cellSize);
}

/** 楼梯方块命中：画出来的 0.7 格方块加上四周半个线宽。 */
export function hitsStair(px, py, cellX, cellY, cellSize) {
    const half = (cellSize * SHAPE.stairSize + strokeWidth('stair', cellSize)) / 2 + ANTIALIAS;
    const centerX = (cellX + .5) * cellSize, centerY = (cellY + .5) * cellSize;
    return Math.abs(px - centerX) <= half && Math.abs(py - centerY) <= half;
}

/** 墙线命中宽度：画出来的墙线的一半，再加一像素抗锯齿余量。 */
export function wallHitThreshold(cellSize) {
    return strokeWidth('wall', cellSize) / 2 + ANTIALIAS;
}
