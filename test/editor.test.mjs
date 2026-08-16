/**
 * editor 纯算法测试：toggleWall 循环 / isWallEditable / 占用检查 /
 * eraseEntityAtPos / isValidStairPlacement / toggleActiveCell /
 * validateMapForPlay / getWallAtPos
 */
import { test, suite, summary, assert, assertEq, assertDeepEq } from './_assert.mjs';
import {
    createBlankEditorMap, createEmptyWalls, isPosInStartRoom, isWallEditable,
    isCellOccupied, isValidStairPlacement,
    createStartRoomLayout, validateMapForPlay, getWallAtPos,
} from '../src/editor/editor.js';
import { WALL_TYPES as WT, EDITOR_TOOLS, START_ROOM_SIZE } from '../src/constants.js';

suite('editor');

const W = (type, extra = {}) => ({ type, keys: 0, ...extra });

test('isWallEditable: regular 模式外圈与起始房间不可编辑', () => {
    // 10×10：roomY = 7，起始房间 x∈[0,2], y∈[7,9]
    const editable = (x, y, type) => isWallEditable({ x, y, type }, 'regular', 10, 10);
    assertEq(editable(0, 0, 'h'), false, '上边界不可编辑');
    assertEq(editable(0, 10, 'h'), false, '下边界不可编辑');
    assertEq(editable(0, 0, 'v'), false, '左边界不可编辑');
    assertEq(editable(10, 0, 'v'), false, '右边界不可编辑');
    assertEq(editable(1, 8, 'h'), false, '起始房间内不可编辑');
    assertEq(editable(1, 8, 'v'), false, '起始房间内不可编辑（v）');
    assertEq(editable(3, 8, 'v'), false, '起始房间右侧竖墙不可编辑');
    assertEq(editable(5, 4, 'h'), true, '内部墙体可编辑');
});

test('isWallEditable: free 模式需要相邻格都激活', () => {
    const activeCells = [[true, true], [true, false]];
    // h 墙 (x=0,y=1)：上方格 activeCells[0][0]=true，下方格 activeCells[1][0]=true → 可编辑
    assertEq(isWallEditable({ x: 0, y: 1, type: 'h' }, 'free', 2, 2, activeCells), true);
    // h 墙 (x=1,y=1)：下方格 activeCells[1][1]=false → 不可编辑
    assertEq(isWallEditable({ x: 1, y: 1, type: 'h' }, 'free', 2, 2, activeCells), false);
    // v 墙 (x=1,y=0)：左侧格 activeCells[0][0]=true，右侧格 activeCells[0][1]=true → 可编辑
    assertEq(isWallEditable({ x: 1, y: 0, type: 'v' }, 'free', 2, 2, activeCells), true);
    // v 墙 (x=1,y=1)：右侧格 activeCells[1][1]=false → 不可编辑
    assertEq(isWallEditable({ x: 1, y: 1, type: 'v' }, 'free', 2, 2, activeCells), false);
});

test('isCellOccupied: 鬼/钥匙/终点/楼梯占用；按钮不阻止（可共存）', () => {
    const entities = {
        ghosts: [{ x: 0, y: 0 }],
        items: [{ x: 1, y: 1 }],
        endPos: { x: 2, y: 2 },
        customStartPos: { x: 3, y: 3 },
        stairs: [{ x: 4, y: 4, layer: 0 }],
        buttons: [{ x: 5, y: 5 }],
        currentLayer: 0,
    };
    assertEq(isCellOccupied(0, 0, entities), true, '鬼占用');
    assertEq(isCellOccupied(1, 1, entities), true, '钥匙占用');
    assertEq(isCellOccupied(2, 2, entities), true, '终点占用');
    assertEq(isCellOccupied(3, 3, entities), true, '自由起点占用');
    assertEq(isCellOccupied(4, 4, entities), true, '楼梯占用');
    assertEq(isCellOccupied(5, 5, entities), false, '按钮不阻止放置');
    assertEq(isCellOccupied(6, 6, entities), false, '空位可放置');
});

test('isValidStairPlacement: 活动格/重复/边界层/目标层实体判定（完整版）', () => {
    const config = (over = {}) => ({
        activeCells: [[true, true], [false, true]],
        stairs: [{ x: 0, y: 0, layer: 0, direction: 'up' }],
        currentLayer: 0, layerCount: 3,
        layers: [
            null,
            { activeCells: [[true, true], [false, true]], ghosts: [], items: [], endPos: null, customStartPos: null },
            { activeCells: [[true, true], [false, true]], ghosts: [], items: [], endPos: null, customStartPos: null },
        ],
        isCellOccupied: () => false,
        ...over
    });
    assertEq(isValidStairPlacement(0, 0, 'up', config()), false, '已有楼梯');
    assertEq(isValidStairPlacement(0, 1, 'up', config()), false, '非活动格');
    assertEq(isValidStairPlacement(1, 1, 'up', config()), true, '合法放置');
    assertEq(isValidStairPlacement(1, 1, 'up', config({ currentLayer: 2 })), false, '顶层不能放 up 楼梯');
    assertEq(isValidStairPlacement(1, 1, 'down', config({ currentLayer: 0 })), false, '底层不能放 down 楼梯');
    // 目标层该格非活动
    assertEq(isValidStairPlacement(1, 1, 'up', config({ layers: [null, { activeCells: [[true, true], [false, false]], ghosts: [], items: [], endPos: null, customStartPos: null }] })), false, '目标层非活动格');
    // 当前层占用
    assertEq(isValidStairPlacement(1, 1, 'up', config({ isCellOccupied: () => true })), false, '当前层占用不可放');
    // 目标层有实体
    assertEq(isValidStairPlacement(1, 1, 'up', config({ layers: [null, { activeCells: [[true, true], [false, true]], ghosts: [{ x: 1, y: 1 }], items: [], endPos: null, customStartPos: null }] })), false, '目标层有鬼不可放');
    assertEq(isValidStairPlacement(1, 1, 'up', config({ layers: [null, { activeCells: [[true, true], [false, true]], ghosts: [], items: [], endPos: { x: 1, y: 1 }, customStartPos: null }] })), false, '目标层有终点不可放');
    // 目标层已有非配对楼梯
    const stairsWithPaired = [{ x: 0, y: 0, layer: 0, direction: 'up' }, { x: 1, y: 1, layer: 1, direction: 'up' }];
    assertEq(isValidStairPlacement(1, 1, 'up', config({ stairs: stairsWithPaired })), false, '目标层已有非配对楼梯');
});

test('createStartRoomLayout: 起始房间内部畅通 + 出口 DOOR（与 generateFullMaze 逐格一致）', () => {
    const solid = () => ({ type: WT.SOLID, keys: 0 });
    const hWalls = Array(11).fill(null).map(() => Array(10).fill(null).map(solid));
    const vWalls = Array(10).fill(null).map(() => Array(11).fill(null).map(solid));
    const roomY = 10 - START_ROOM_SIZE; // = 7
    createStartRoomLayout(hWalls, vWalls, roomY);
    // 房间内部横墙（第 8、9 行）
    for (let y = roomY + 1; y < roomY + 2; y++) {
        for (let x = 0; x < 3; x++) {
            assertEq(hWalls[y][x].type, WT.EMPTY, `房间内横墙 (${x},${y}) 应为 EMPTY`);
        }
    }
    // 房间内部竖墙（x=1,2）
    for (let y = roomY; y < roomY + 3; y++) {
        for (let x = 1; x < 3; x++) {
            assertEq(vWalls[y][x].type, WT.EMPTY, `房间内竖墙 (${x},${y}) 应为 EMPTY`);
        }
    }
    // 出口：右侧 vWalls[roomY+1][3] = DOOR，上方 hWalls[roomY][1] = DOOR
    assertEq(vWalls[roomY + 1][3].type, WT.DOOR, '右侧出口应为 DOOR');
    assertEq(hWalls[roomY][1].type, WT.DOOR, '上方出口应为 DOOR');
});

test('validateMapForPlay: free 模式起点/活动格校验', () => {
    const freeData = (over = {}) => ({
        width: 3, height: 3,
        activeCells: [[true, true, true], [true, true, true], [true, true, true]],
        customStartPos: { x: 1, y: 1 },
        ...over
    });
    assertEq(validateMapForPlay(freeData(), 'free').valid, true, '合法 free 图');
    const noStart = validateMapForPlay(freeData({ customStartPos: null }), 'free');
    assertEq(noStart.valid, false, '无起点不合法');
    assertEq(noStart.error, '自由模式必须设置起点！');
    const noActive = validateMapForPlay(freeData({ activeCells: [[false, false, false], [false, false, false], [false, false, false]] }), 'free');
    assertEq(noActive.valid, false, '无活动格不合法');
    assertEq(validateMapForPlay({ width: 3, height: 3 }, 'regular').valid, true, 'regular 恒有效');
});

test('getWallAtPos: GRID 工具格命中 / 越界未命中', () => {
    const hit = getWallAtPos(15, 15, 10, 3, 3, EDITOR_TOOLS.GRID);
    assertDeepEq(hit, { x: 1, y: 1, type: 'cell' }, '格命中');
    const miss = getWallAtPos(35, 15, 10, 3, 3, EDITOR_TOOLS.GRID);
    assertEq(miss, null, '越界未命中');
});

test('createBlankEditorMap: 尺寸与墙维度', () => {
    const m = createBlankEditorMap(10, 10, 'regular');
    assertEq(m.width, 10);
    assertEq(m.height, 10);
    assertEq(m.hWalls.length, 11, 'hWalls 行数 = height+1');
    assertEq(m.hWalls[0].length, 10, 'hWalls 列数 = width');
    assertEq(m.vWalls.length, 10, 'vWalls 行数 = height');
    assertEq(m.vWalls[0].length, 11, 'vWalls 列数 = width+1');
});

test('createEmptyWalls: 按 h/v 类型生成，边界为 SOLID', () => {
    // 签名：type 为 'h'/'v' 字符串（editor 版与 mazeGenerator 版重复，Phase 2 合并）
    const h = createEmptyWalls('h', 3, 2);
    assertEq(h.length, 3, 'hWalls 行数 = height+1');
    assertEq(h[0].length, 3, 'hWalls 列数 = width');
    assertEq(h[0][0].type, WT.SOLID, '上边界 SOLID');
    assertEq(h[2][0].type, WT.SOLID, '下边界 SOLID');
    assertEq(h[1][1].type, WT.EMPTY, '内部 EMPTY');
    const v = createEmptyWalls('v', 3, 2);
    assertEq(v.length, 2, 'vWalls 行数 = height');
    assertEq(v[0].length, 4, 'vWalls 列数 = width+1');
    assertEq(v[0][0].type, WT.SOLID, '左边界 SOLID');
    assertEq(v[0][3].type, WT.SOLID, '右边界 SOLID');
});

test('isPosInStartRoom: 起始房间 3×3 判定', () => {
    assertEq(isPosInStartRoom(0, 7, 10), true, '左下角');
    assertEq(isPosInStartRoom(2, 9, 10), true, '房间内');
    assertEq(isPosInStartRoom(3, 8, 10), false, '房间外');
    assertEq(isPosInStartRoom(0, 6, 10), false, '房间上方');
});

summary('editor');
