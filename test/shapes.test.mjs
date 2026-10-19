import { test, suite, summary, assert } from './_assert.mjs';
import { SHAPE, strokeWidth, hitsButton, hitsCircle, hitsKey, hitsStair, buttonRect, wallHitThreshold } from '../src/view/shapes.js';

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

test('按钮命中含画出来的线宽：到外沿为止，贴墙一侧不越过墙线', () => {
    const cs = 40, button = { x: 2, y: 3, direction: { dx: 0, dy: -1 } };
    const rect = buttonRect(button, cs), cx = rect.x + rect.width / 2;
    assert(strokeWidth('button', cs) === 4, '线宽与绘制同源：40 格宽下 4px');
    assert(hitsButton(cx, rect.y, button, cs), '压在路径上命中');
    assert(hitsButton(cx, rect.y + rect.height + 2, button, cs), '路径外半个线宽内命中（画出来的外沿）');
    assert(!hitsButton(cx, rect.y + rect.height + 4, button, cs), '外沿之外不命中');
    assert(hitsButton(rect.x - 2, rect.y + 4, button, cs), '两侧外沿同样命中');
    assert(!hitsButton(rect.x - 4, rect.y + 4, button, cs), '两侧外沿之外不命中');
    assert(!hitsButton(cx, rect.y - 2, button, cs), '贴墙一侧是平头端点，不越过墙线');
    assert(!hitsButton(3 * cs + 2, rect.y + 4, button, cs), '长条两端之外不命中');
    // 右贴墙的按钮：外沿到墙线为止，不伸进邻格。
    const right = { x: 2, y: 3, direction: { dx: 1, dy: 0 } };
    assert(hitsButton(3 * cs - 1, 3 * cs + cs / 2, right, cs), '贴着墙线命中');
    assert(!hitsButton(3 * cs + 1, 3 * cs + cs / 2, right, cs), '越过墙线进入邻格不命中');
});

test('圆形与菱形按绘制半径命中', () => {
    const cs = 40;
    assert(hitsCircle(4 * cs + cs / 2, 5 * cs + cs / 2, 4, 5, cs), '圆心命中');
    assert(hitsCircle(4 * cs + cs / 2 + cs * SHAPE.circleRadius - 1, 5 * cs + cs / 2, 4, 5, cs), '半径内命中');
    assert(!hitsCircle(4 * cs + 2, 5 * cs + 2, 4, 5, cs), '角落不命中圆');
    assert(hitsKey(4 * cs + cs / 2, 5 * cs + cs / 2, 4, 5, cs), '菱形中心命中');
    assert(!hitsKey(4 * cs + 2, 5 * cs + 2, 4, 5, cs), '角落不命中菱形');
});

test('楼梯按 0.7 方格加线宽命中', () => {
    const cs = 40, half = (cs * SHAPE.stairSize + strokeWidth('stair', cs)) / 2 + 1;
    const cx = 4 * cs + cs / 2, cy = 5 * cs + cs / 2;
    assert(hitsStair(cx, cy, 4, 5, cs), '方块中心命中');
    assert(hitsStair(cx + half - .5, cy, 4, 5, cs), '到画出来的外沿为止');
    assert(!hitsStair(cx + half + .5, cy, 4, 5, cs), '外沿之外不命中');
    assert(!hitsStair(4 * cs + 1, 5 * cs + 1, 4, 5, cs), '方格角落不命中');
});

test('墙线命中宽度等于画出来的线宽的一半再加一像素', () => {
    const cs = 40;
    assert(strokeWidth('wall', cs) === 4, '墙线宽与绘制同源');
    assert(wallHitThreshold(cs) === 3, '一半线宽加一像素抗锯齿余量');
    assert(strokeWidth('thinWall', cs) === 3.3333333333333335, '数字门与单向门更细');
});

summary('shapes');
