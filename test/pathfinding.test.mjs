/**
 * pathfinding 测试：距离场 BFS / 玩家寻路（墙阻挡、钥匙门）/ 按钮热点
 */
import { test, suite, summary, assert, assertEq, assertDeepEq } from './_assert.mjs';
import { calculateDistances, findPlayerPath, getButtonHotspotAtPos } from '../src/core/pathfinding.js';
import { WALL_TYPES as WT } from '../src/core/constants.js';

suite('pathfinding');

const W = (type, extra = {}) => ({ type, keys: 0, ...extra });
const emptyRow = (n) => Array.from({ length: n }, () => W(WT.EMPTY));

test('calculateDistances: 直线走廊 BFS 距离正确', () => {
    // 1×4 走廊（3 格），无障碍
    const hWalls = [emptyRow(3), emptyRow(3)];
    const vWalls = [emptyRow(4)];
    const d = calculateDistances({ x: 0, y: 0 }, 3, 1, hWalls, vWalls);
    assertDeepEq(d[0], [0, 1, 2], '距离递增');
});

test('calculateDistances: SOLID/LOCKED 阻挡，DOOR 可通过', () => {
    const vWalls = [[W(WT.EMPTY), W(WT.SOLID), W(WT.LOCKED, { keys: 1 }), W(WT.EMPTY)]];
    const hWalls = [emptyRow(3), emptyRow(3)];
    const d = calculateDistances({ x: 0, y: 0 }, 3, 1, hWalls, vWalls);
    assertEq(d[0][0], 0);
    assertEq(d[0][1], Infinity, 'SOLID 挡');
    assertEq(d[0][2], Infinity, 'LOCKED 挡');
});

test('findPlayerPath: 无障碍直线路径', () => {
    const config = {
        width: 3, height: 1,
        hWalls: [emptyRow(3), emptyRow(3)],
        vWalls: [emptyRow(4)],
        seenCells: [[true, true, true]],
        debugVision: true,
        playerKeys: 0,
    };
    const path = findPlayerPath({ x: 0, y: 0 }, { x: 2, y: 0 }, config);
    assert(path, '路径存在');
    assertDeepEq(path, [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }], '最短路径');
});

test('findPlayerPath: SOLID/GLASS 阻挡无路径', () => {
    const config = {
        width: 3, height: 1,
        hWalls: [emptyRow(3), emptyRow(3)],
        vWalls: [[W(WT.EMPTY), W(WT.SOLID), W(WT.EMPTY), W(WT.EMPTY)]],
        seenCells: [[true, true, true]],
        debugVision: true,
        playerKeys: 0,
    };
    assertEq(findPlayerPath({ x: 0, y: 0 }, { x: 2, y: 0 }, config), null, 'SOLID 挡无路径');
    const glassConfig = {
        ...config,
        vWalls: [[W(WT.EMPTY), W(WT.GLASS), W(WT.EMPTY), W(WT.EMPTY)]],
    };
    assertEq(findPlayerPath({ x: 0, y: 0 }, { x: 2, y: 0 }, glassConfig), null, 'GLASS 挡无路径');
});

test('findPlayerPath: LOCKED 钥匙不足挡 / 足够可过', () => {
    const base = {
        width: 3, height: 1,
        hWalls: [emptyRow(3), emptyRow(3)],
        vWalls: [[W(WT.EMPTY), W(WT.LOCKED, { keys: 1 }), W(WT.EMPTY), W(WT.EMPTY)]],
        seenCells: [[true, true, true]],
        debugVision: true,
    };
    assertEq(findPlayerPath({ x: 0, y: 0 }, { x: 2, y: 0 }, { ...base, playerKeys: 0 }), null, '无钥匙不可过');
    const path = findPlayerPath({ x: 0, y: 0 }, { x: 2, y: 0 }, { ...base, playerKeys: 1 });
    assert(path, '有钥匙可过');
    assertEq(path.length, 3, '路径长度 3');
});

test('findPlayerPath: 不可见格阻挡（视野外无法寻路）', () => {
    const config = {
        width: 3, height: 1,
        hWalls: [emptyRow(3), emptyRow(3)],
        vWalls: [emptyRow(4)],
        seenCells: [[true, true, false]],
        debugVision: false,
        playerKeys: 0,
    };
    assertEq(findPlayerPath({ x: 0, y: 0 }, { x: 2, y: 0 }, config), null, '视野外不可寻路');
    assertEq(findPlayerPath({ x: 0, y: 0 }, { x: 1, y: 0 }, config) !== null, true, '视野内可寻路');
});

test('findPlayerPath: 全图视野下也不穿过虚空', () => {
    // 3×1 中间格是虚空：全图视野且都可见时也不能直穿，虚空格本身也不可达
    const config = {
        width: 3, height: 1,
        hWalls: [emptyRow(3), emptyRow(3)],
        vWalls: [emptyRow(4)],
        seenCells: [[true, true, true]],
        debugVision: true,
        playerKeys: 0,
        activeCells: [[true, false, true]],
    };
    assertEq(findPlayerPath({ x: 0, y: 0 }, { x: 2, y: 0 }, config), null, '虚空不可穿过');
    assertEq(findPlayerPath({ x: 0, y: 0 }, { x: 1, y: 0 }, config), null, '虚空格不可达');
});

test('getButtonHotspotAtPos: 贴墙方向热点命中，非贴墙不命中', () => {
    const cellSize = 100;
    const empty = () => ({ type: 0, keys: 0 });
    const solid = () => ({ type: 1, keys: 0 });
    // 3×3：边界墙 SOLID（热点必须贴 SOLID 墙才可放置按钮）
    const config = {
        cellSize, width: 3, height: 3,
        hWalls: [[solid(), solid(), solid()], [empty(), empty(), empty()], [empty(), empty(), empty()], [solid(), solid(), solid()]],
        vWalls: [[solid(), empty(), empty(), solid()], [solid(), empty(), empty(), solid()], [solid(), empty(), empty(), solid()]],
        activeCells: [[true, true, true], [true, true, true], [true, true, true]],
    };
    // 格 (0,0)：左侧热点贴 vWalls[0][0] SOLID
    const l = getButtonHotspotAtPos(10, 50, config);
    assert(l && l.x === 0 && l.y === 0 && l.direction.dx === -1, '左侧贴墙热点命中');
    // 格 (0,0)：下方热点贴 hWalls[1][0]（内部 EMPTY → 不命中）
    const d = getButtonHotspotAtPos(50, 90, config);
    assertEq(d, null, '非贴墙热点不命中');
});

summary('pathfinding');
