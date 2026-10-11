import { test, suite, summary, assertEq } from './_assert.mjs';
import { normalizeVoidWalls, validateButtonAttachments } from '../src/core/mapDataUtils.js';
import { WALL_TYPES as W } from '../src/core/constants.js';

suite('mapDataUtils');

const makeLayer = (width, height, activeCells = Array.from({ length: height }, () => Array(width).fill(true))) => ({
    width, height,
    hWalls: Array.from({ length: height + 1 }, () => Array.from({ length: width }, () => ({ type: W.EMPTY, keys: 0 }))),
    vWalls: Array.from({ length: height }, () => Array.from({ length: width + 1 }, () => ({ type: W.EMPTY, keys: 0 }))),
    activeCells, buttons: []
});

test('按钮校验与编辑器热点规则一致，接受实墙和活动区边界', () => {
    const map = makeLayer(3, 3);
    map.vWalls[1][1] = { type: W.SOLID };
    map.buttons = [{ x: 0, y: 1, direction: { dx: 1, dy: 0 }, letter: 'A' }];
    assertEq(validateButtonAttachments(map).valid, true);

    map.vWalls[1][1] = { type: W.EMPTY };
    assertEq(validateButtonAttachments(map).valid, false);

    map.editorMode = 'free';
    map.activeCells[1][1] = false;
    map.buttons = [{ x: 0, y: 1, direction: { dx: 1, dy: 0 }, letter: 'A' }];
    assertEq(validateButtonAttachments(map).valid, true, '朝向非活动格时仍是活动区边界');
});

test('按钮必须位于活动格且朝向有效的四方向', () => {
    const map = makeLayer(3, 3);
    map.buttons = [{ x: 1, y: 1, direction: { dx: 0.5, dy: 0.5 }, letter: 'A' }];
    assertEq(validateButtonAttachments(map).valid, false);
    map.buttons = [{ x: 1, y: 1, direction: { dx: 0, dy: -1 }, letter: 'A' }];
    assertEq(validateButtonAttachments(map).valid, false, '没有实墙或虚拟边界时不能依附');
    map.activeCells[1][1] = false;
    assertEq(validateButtonAttachments(map).valid, false, '按钮格必须活动');
});

test('逐层校验按钮依附', () => {
    const map = makeLayer(3, 3);
    map.multiLayerMode = true;
    map.layerCount = 2;
    const first = { ...map };
    const second = makeLayer(3, 3);
    second.buttons = [{ x: 1, y: 1, direction: { dx: 1, dy: 0 }, letter: 'B' }];
    map.layers = [first, second];
    assertEq(validateButtonAttachments(map).valid, false, '第二层的悬空按钮应被拦截');
    second.vWalls[1][2] = { type: W.SOLID };
    assertEq(validateButtonAttachments(map).valid, true);
});

test('只清除不在任意活动格直线视线中的虚空墙，保留视线墙和活动边界', () => {
    const map = makeLayer(5, 5, Array.from({ length: 5 }, () => Array(5).fill(false)));
    map.activeCells[0][2] = true;
    map.activeCells[4][2] = true;
    map.activeCells[2][0] = true;
    map.activeCells[2][4] = true;
    for (const rows of [map.hWalls, map.vWalls]) {
        for (const row of rows) for (const wall of row) wall.type = W.SOLID;
    }

    const normalized = normalizeVoidWalls(map);
    assertEq(normalized.hWalls[1][1].type, W.EMPTY, '无活动格视线穿过的水平虚空墙已清除');
    assertEq(normalized.vWalls[1][1].type, W.EMPTY, '无活动格视线穿过的竖直虚空墙已清除');
    assertEq(normalized.hWalls[2][2].type, W.SOLID, '位于上下活动格视线上的虚空墙保留');
    assertEq(normalized.vWalls[2][2].type, W.SOLID, '位于左右活动格视线上的虚空墙保留');
    assertEq(normalized.hWalls[1][2].type, W.SOLID, '活动区边界墙保留');
    assertEq(map.hWalls[1][1].type, W.SOLID, '规范化不修改源对象');
});

test('安全规范化也覆盖多层数据', () => {
    const top = makeLayer(3, 2, [[true, false, false], [true, false, false]]);
    const other = makeLayer(3, 2, [[false, false, true], [false, false, true]]);
    for (const rows of [top.hWalls, top.vWalls, other.hWalls, other.vWalls]) {
        for (const row of rows) for (const wall of row) wall.type = W.SOLID;
    }
    const normalized = normalizeVoidWalls({ ...top, multiLayerMode: true, layerCount: 2, layers: [top, other] });
    assertEq(normalized.layers[1].hWalls[0][0].type, W.EMPTY);
    assertEq(normalized.layers[1].vWalls[0][0].type, W.EMPTY);
    assertEq(top.hWalls[0][0].type, W.SOLID);
});

summary();
