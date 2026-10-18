import { test, suite, summary, assert } from './_assert.mjs';
import { SHAPE, hitsButton, hitsCircle, hitsKey, hitsStair, buttonRect } from '../src/view/shapes.js';

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

test('按钮命中：只认长条本身，不外扩；远处不命中', () => {
    const cs = 40, button = { x: 2, y: 3, direction: { dx: 0, dy: -1 } };
    const rect = buttonRect(button, cs), cx = rect.x + rect.width / 2;
    assert(hitsButton(cx, 3 * cs + 2, button, cs), '长条内命中');
    assert(!hitsButton(cx, 3 * cs - 2, button, cs), '长条外（原外扩容差处）不命中');
    assert(!hitsButton(cx, 3 * cs + cs * SHAPE.buttonWidth + 10, button, cs), '长条内侧远处不命中');
    assert(!hitsButton(3 * cs, 3 * cs + 2, button, cs), '长条两侧远处不命中');
});

test('圆形与菱形按绘制半径命中', () => {
    const cs = 40;
    assert(hitsCircle(4 * cs + cs / 2, 5 * cs + cs / 2, 4, 5, cs), '圆心命中');
    assert(hitsCircle(4 * cs + cs / 2 + cs * SHAPE.circleRadius - 1, 5 * cs + cs / 2, 4, 5, cs), '半径内命中');
    assert(!hitsCircle(4 * cs + 2, 5 * cs + 2, 4, 5, cs), '角落不命中圆');
    assert(hitsKey(4 * cs + cs / 2, 5 * cs + cs / 2, 4, 5, cs), '菱形中心命中');
    assert(!hitsKey(4 * cs + 2, 5 * cs + 2, 4, 5, cs), '角落不命中菱形');
});

test('楼梯方块按绘制的 0.7 格方块命中', () => {
    const cs = 40;
    assert(hitsStair(4 * cs + cs / 2, 5 * cs + cs / 2, 4, 5, cs), '方块中心命中');
    assert(!hitsStair(4 * cs + 1, 5 * cs + 1, 4, 5, cs), '方格角落不命中');
});

summary('shapes');
