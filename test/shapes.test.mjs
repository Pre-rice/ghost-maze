import { test, suite, summary, assert } from './_assert.mjs';
import { SHAPE, strokeWidth, eraserDotRadius, hitsButton, hitsButtonStroke, hitsCircle, hitsKey, hitsStair, buttonRect, wallHitThreshold } from '../src/view/shapes.js';

suite('shapes');

test('按钮长条矩形与绘制一致：贴着对应那条边，四条边各测一次', () => {
    const cs = 40, up = buttonRect({ x: 2, y: 3, direction: { dx: 0, dy: -1 } }, cs);
    assert(up.x === 2 * cs + cs / 2 - cs * SHAPE.buttonLength / 2 && up.y === 3 * cs, '上方按钮贴顶边');
    assert(up.height === cs * SHAPE.buttonWidth, '厚度等于绘制宽度');
    const down = buttonRect({ x: 2, y: 3, direction: { dx: 0, dy: 1 } }, cs);
    assert(down.y + down.height === 4 * cs, '下方按钮贴底边');
    const left = buttonRect({ x: 2, y: 3, direction: { dx: -1, dy: 0 } }, cs);
    assert(left.x === 2 * cs && left.width === cs * SHAPE.buttonWidth, '左侧按钮贴左边');
    const right = buttonRect({ x: 2, y: 3, direction: { dx: 1, dy: 0 } }, cs);
    assert(right.x + right.width === 3 * cs, '右侧按钮贴右边');
});

test('按钮的宽容命中：长条外框加半个线宽，贴墙一侧不越过墙线', () => {
    const cs = 40, button = { x: 2, y: 3, direction: { dx: 0, dy: -1 } };
    const rect = buttonRect(button, cs), cx = rect.x + rect.width / 2;
    assert(strokeWidth('button', cs) === 4, '线宽与绘制同源：40 格宽下 4px');
    assert(hitsButton(cx, rect.y + rect.height + 2, button, cs), '路径外半个线宽内命中（画出来的外沿）');
    assert(!hitsButton(cx, rect.y + rect.height + 4, button, cs), '外沿之外不命中');
    assert(!hitsButton(cx, rect.y - 2, button, cs), '贴墙一侧是平头端点，不越过墙线');
    const right = { x: 2, y: 3, direction: { dx: 1, dy: 0 } };
    assert(hitsButton(3 * cs - 1, 3 * cs + cs / 2, right, cs), '贴着墙线命中');
    assert(!hitsButton(3 * cs + 1, 3 * cs + cs / 2, right, cs), '越过墙线进入邻格不命中');
});

test('橡皮擦按钮命中只认画出来的三边线条，中间空当不算', () => {
    const cs = 40, button = { x: 2, y: 3, direction: { dx: 1, dy: 0 } };
    const cy = 3 * cs + cs / 2, wallX = 3 * cs, barX = wallX - cs * SHAPE.buttonWidth;
    assert(hitsButtonStroke(barX, cy, button, cs), '压在竖条上命中');
    assert(hitsButtonStroke(wallX - 1, cy - cs * SHAPE.buttonLength / 2, button, cs), '压在横臂上命中');
    assert(!hitsButtonStroke(barX + cs * 0.12, cy, button, cs), '两条臂中间的空当不命中');
    assert(!hitsButtonStroke(wallX + 2, cy, button, cs), '越过墙线不命中');
    assert(hitsButtonStroke(barX - strokeWidth('button', cs) / 2 - .5, cy, button, cs), '线宽外沿以内命中');
    assert(!hitsButtonStroke(barX - strokeWidth('button', cs) / 2 - 2, cy, button, cs), '线宽外沿之外不命中');
    assert(hitsButtonStroke(barX - strokeWidth('button', cs) / 2 - 2, cy, button, cs, 2), '加上光点半径后命中');
});

test('圆形与菱形按绘制半径命中', () => {
    const cs = 40;
    assert(hitsCircle(4 * cs + cs / 2, 5 * cs + cs / 2, 4, 5, cs), '圆心命中');
    assert(hitsCircle(4 * cs + cs / 2 + cs * SHAPE.circleRadius - 1, 5 * cs + cs / 2, 4, 5, cs), '半径内命中');
    assert(!hitsCircle(4 * cs + 2, 5 * cs + 2, 4, 5, cs), '角落不命中圆');
    assert(hitsKey(4 * cs + cs / 2, 5 * cs + cs / 2, 4, 5, cs), '菱形中心命中');
    assert(!hitsKey(4 * cs + 2, 5 * cs + 2, 4, 5, cs), '角落不命中菱形');
    assert(hitsCircle(4 * cs + cs / 2 + cs * SHAPE.circleRadius + 2, 5 * cs + cs / 2, 4, 5, cs, 3), '外圈加光点半径后命中');
});

test('楼梯命中只认画出来的折线，折角外面的空当不算', () => {
    const cs = 40, stair = { x: 4, y: 5, direction: 'up' };
    const half = strokeWidth('stair', cs) / 2 + 1;             // 画出来的线宽一半加抗锯齿
    const left = 4 * cs + (cs - cs * SHAPE.stairSize) / 2;      // 轮廓左边
    const bottom = 5 * cs + (cs + cs * SHAPE.stairSize) / 2;    // 轮廓底边
    assert(hitsStair(4 * cs + cs / 2, bottom, stair, cs), '压在底边上命中');
    assert(hitsStair(left, bottom - 5, stair, cs), '压在左边上命中');
    assert(!hitsStair(4 * cs + cs / 2, bottom + half + 1, stair, cs), '底边外沿之外不命中');
    assert(!hitsStair(left + 4, 5 * cs + 10, stair, cs), '左上折角外面的空当不命中');
    assert(!hitsStair(4 * cs + cs / 2, 5 * cs + cs / 2, stair, cs), '方块正中没有线条，不命中');
    assert(hitsStair(left + 4, 5 * cs + 10, stair, cs, 15), '加上光点半径后碰到折角命中');
    const down = { x: 4, y: 5, direction: 'down' };
    assert(hitsStair(left + 2, 5 * cs + 4, down, cs), '向下楼梯顶部左边有线，命中');
});

test('墙线命中宽度等于画出来的线宽的一半再加一像素，光点半径另加', () => {
    const cs = 40;
    assert(strokeWidth('wall', cs) === 4, '墙线宽与绘制同源');
    assert(wallHitThreshold(cs) === 3, '一半线宽加一像素抗锯齿余量');
    assert(wallHitThreshold(cs, 5) === 8, '加上橡皮擦光点半径');
    assert(strokeWidth('thinWall', cs) === 3.3333333333333335, '数字门与单向门更细');
    assert(eraserDotRadius(cs) === 2, '橡皮擦光点半径等于半个墙线宽');
    assert(eraserDotRadius(100) === 5, '格宽 100 时光点直径等于墙线宽 10');
});

summary('shapes');
