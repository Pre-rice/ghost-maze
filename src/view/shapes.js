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

/** 橡皮擦光点半径：直径等于墙线的绘制宽度。 */
export function eraserDotRadius(cellSize) {
    return strokeWidth('wall', cellSize) / 2;
}

/** 圆形命中：鬼、出生点、终点。实心圆，半径就是画出来的半径，外圈可再放宽 pad。 */
export function hitsCircle(px, py, cellX, cellY, cellSize, pad = 0) {
    const radius = cellSize * SHAPE.circleRadius + pad;
    return Math.hypot(px - (cellX + .5) * cellSize, py - (cellY + .5) * cellSize) <= radius;
}

/** 菱形命中：钥匙。实心菱形，半对角线就是画出来的尺寸，外圈可再放宽 pad。 */
export function hitsKey(px, py, cellX, cellY, cellSize, pad = 0) {
    const size = cellSize * SHAPE.keyRadius + pad;
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

/** 按钮画出来的那条折线（三边，贴着墙的一边是平头端点），绘制与命中共用。 */
export function buttonPathPoints(button, cellSize) {
    const centerX = button.x * cellSize + cellSize / 2;
    const centerY = button.y * cellSize + cellSize / 2;
    const buttonLength = cellSize * SHAPE.buttonLength;
    const buttonWidth = cellSize * SHAPE.buttonWidth;
    let p1, p2, p3, p4;
    if (button.direction.dy === -1) { // 上
        p1 = { x: centerX - buttonLength / 2, y: button.y * cellSize };
        p2 = { x: centerX + buttonLength / 2, y: button.y * cellSize };
        p3 = { x: centerX + buttonLength / 2, y: button.y * cellSize + buttonWidth };
        p4 = { x: centerX - buttonLength / 2, y: button.y * cellSize + buttonWidth };
        return [p1, p4, p3, p2];
    }
    if (button.direction.dy === 1) { // 下
        p1 = { x: centerX - buttonLength / 2, y: (button.y + 1) * cellSize - buttonWidth };
        p2 = { x: centerX + buttonLength / 2, y: (button.y + 1) * cellSize - buttonWidth };
        p3 = { x: centerX + buttonLength / 2, y: (button.y + 1) * cellSize };
        p4 = { x: centerX - buttonLength / 2, y: (button.y + 1) * cellSize };
        return [p3, p2, p1, p4];
    }
    if (button.direction.dx === -1) { // 左
        p1 = { x: button.x * cellSize, y: centerY - buttonLength / 2 };
        p2 = { x: button.x * cellSize + buttonWidth, y: centerY - buttonLength / 2 };
        p3 = { x: button.x * cellSize + buttonWidth, y: centerY + buttonLength / 2 };
        p4 = { x: button.x * cellSize, y: centerY + buttonLength / 2 };
        return [p1, p2, p3, p4];
    }
    // 右
    p1 = { x: (button.x + 1) * cellSize - buttonWidth, y: centerY - buttonLength / 2 };
    p2 = { x: (button.x + 1) * cellSize, y: centerY - buttonLength / 2 };
    p3 = { x: (button.x + 1) * cellSize, y: centerY + buttonLength / 2 };
    p4 = { x: (button.x + 1) * cellSize - buttonWidth, y: centerY + buttonLength / 2 };
    return [p2, p1, p4, p3];
}

/** 点到线段的距离。 */
function distanceToSegment(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay, lengthSquared = dx * dx + dy * dy;
    const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared));
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/** 点到一条折线（含各段之间）的距离。 */
function distanceToPolyline(px, py, points, closed = false) {
    let best = Infinity;
    for (let i = 0; i < points.length - 1; i++) best = Math.min(best, distanceToSegment(px, py, points[i].x, points[i].y, points[i + 1].x, points[i + 1].y));
    if (closed && points.length > 2) best = Math.min(best, distanceToSegment(px, py, points[points.length - 1].x, points[points.length - 1].y, points[0].x, points[0].y));
    return best;
}

/**
 * 按钮的宽容命中（游玩里点本格按钮用）：长条外框加半个线宽，中间空当也算按钮，
 * 符合“点按钮就是点那一块”的直觉。
 * @param {number} [pad] - 额外容差（像素），默认 0
 */
export function hitsButton(px, py, button, cellSize, pad = 0) {
    const rect = buttonRect(button, cellSize);
    const tolerance = strokeWidth('button', cellSize) / 2 + ANTIALIAS + pad;
    return px >= Math.max(rect.x - tolerance, button.x * cellSize) && px <= Math.min(rect.x + rect.width + tolerance, (button.x + 1) * cellSize) &&
        py >= Math.max(rect.y - tolerance, button.y * cellSize) && py <= Math.min(rect.y + rect.height + tolerance, (button.y + 1) * cellSize);
}

/**
 * 按钮的精确命中（橡皮擦用）：只认画出来的那三边线条（线宽的一半再放宽 pad），
 * 中间没画的空当不算。pad 传橡皮擦光点半径即可“光点外沿碰到才算”。
 * @param {number} [pad] - 额外容差（像素），默认 0
 */
export function hitsButtonStroke(px, py, button, cellSize, pad = 0) {
    const tolerance = strokeWidth('button', cellSize) / 2 + ANTIALIAS + pad;
    return distanceToPolyline(px, py, buttonPathPoints(button, cellSize)) <= tolerance;
}

/**
 * 楼梯的绘制轮廓（闭合折线），绘制与命中共用同一组点。
 * 向上楼梯左低右高，向下楼梯左高右低。
 */
export function stairOutlinePoints(stair, cellSize) {
    const x = stair.x * cellSize, y = stair.y * cellSize;
    const size = cellSize * SHAPE.stairSize, offset = (cellSize - size) / 2;
    const left = x + offset, top = y + offset, stepWidth = size / 3, stepHeight = size / 3;
    if (stair.direction === 'up') {
        return [
            { x: left, y: top + size },
            { x: left, y: top + size - stepHeight },
            { x: left + stepWidth, y: top + size - stepHeight },
            { x: left + stepWidth, y: top + size - 2 * stepHeight },
            { x: left + 2 * stepWidth, y: top + size - 2 * stepHeight },
            { x: left + 2 * stepWidth, y: top },
            { x: left + size, y: top },
            { x: left + size, y: top + size }
        ];
    }
    return [
        { x: left, y: top + size },
        { x: left, y: top },
        { x: left + stepWidth, y: top },
        { x: left + stepWidth, y: top + stepHeight },
        { x: left + 2 * stepWidth, y: top + stepHeight },
        { x: left + 2 * stepWidth, y: top + 2 * stepHeight },
        { x: left + size, y: top + 2 * stepHeight },
        { x: left + size, y: top + size }
    ];
}

/**
 * 楼梯命中：只认画出来的那条楼梯折线（线宽的一半再放宽 pad）。
 * 折角外面的空当没画东西，不算点中。
 * @param {object} stair - 楼梯 {x, y, direction}
 * @param {number} [pad] - 额外容差（像素），默认 0
 */
export function hitsStair(px, py, stair, cellSize, pad = 0) {
    const tolerance = strokeWidth('stair', cellSize) / 2 + ANTIALIAS + pad;
    return distanceToPolyline(px, py, stairOutlinePoints(stair, cellSize), true) <= tolerance;
}

/** 墙线命中宽度：画出来的墙线的一半，再加一像素抗锯齿余量和光点半径。 */
export function wallHitThreshold(cellSize, pad = 0) {
    return strokeWidth('wall', cellSize) / 2 + ANTIALIAS + pad;
}
