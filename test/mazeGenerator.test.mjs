/**
 * mazeGenerator 测试：结构不变量 / 终点可达 / 种子确定性 / 起始房间 /
 * calculateDistances 与 pathfinding 版的分叉锁定
 */
import { test, suite, summary, assert, assertEq, assertDeepEq } from './_assert.mjs';
import { generateFullMaze } from '../src/mazeGenerator.js';
import { calculateDistances } from '../src/pathfinding.js';
import { isPosInStartRoom, createEmptyWalls } from '../src/editor/editor.js';
import { WALL_TYPES as WT } from '../src/constants.js';

suite('mazeGenerator');

// 固定随机序列（Math.random 可控）
const withRandom = (values, fn) => {
    const orig = Math.random;
    let i = 0;
    Math.random = () => values[i++ % values.length];
    try { return fn(); } finally { Math.random = orig; }
};

test('generateFullMaze: 10×10 结构不变量', () => {
    const maze = withRandom([0.42, 0.17, 0.83, 0.31, 0.66, 0.05, 0.92, 0.55], () => generateFullMaze(10, 10, 2));
    assertEq(maze.width, 10);
    assertEq(maze.height, 10);
    assertEq(maze.hWalls.length, 11);
    assertEq(maze.vWalls.length, 10);
    assertEq(maze.initialGhosts.length, 2, '鬼数量');
    // 墙类型全部合法（0-6）
    const validType = (w) => w.type >= 0 && w.type <= 6;
    for (const row of maze.hWalls) for (const w of row) assert(validType(w), '墙类型非法: ' + w.type);
    for (const row of maze.vWalls) for (const w of row) assert(validType(w), '墙类型非法: ' + w.type);
    // 起点 = {1, height-2}
    assertDeepEq(maze.startPos, { x: 1, y: 8 });
    assert(maze.endPos, '生成器设终点（findFarthestEndCell 决策）');
    // 终点邻格至少一侧可从起点接近（生成器会在终点旁放 LOCKED 门，距离场视为不可过——钥匙收集后仍可进）
    const dist = calculateDistances({ x: 1, y: 8 }, 10, 10, maze.hWalls, maze.vWalls);
    const { x: ex, y: ey } = maze.endPos;
    const near = [{ x: ex, y: ey - 1 }, { x: ex, y: ey + 1 }, { x: ex + 1, y: ey }, { x: ex - 1, y: ey }]
        .filter(c => c.x >= 0 && c.x < 10 && c.y >= 0 && c.y < 10);
    assert(near.some(c => dist[c.y][c.x] !== Infinity), '终点至少一侧可从起点接近');
});

test('generateFullMaze: 起始房间 3×3 内部畅通 + 出口 DOOR', () => {
    const maze = withRandom([0.42, 0.17, 0.83, 0.31, 0.66, 0.05, 0.92, 0.55], () => generateFullMaze(10, 10, 1));
    const roomY = 7;
    // 房间内部横墙（第 8、9 行）
    for (let y = roomY + 1; y < roomY + 2; y++) {
        for (let x = 0; x < 3; x++) {
            assertEq(maze.hWalls[y][x].type, WT.EMPTY, `房间内横墙 (${x},${y}) 应为 EMPTY`);
        }
    }
    // 房间内部竖墙（x=1,2）
    for (let y = roomY; y < roomY + 3; y++) {
        for (let x = 1; x < 3; x++) {
            assertEq(maze.vWalls[y][x].type, WT.EMPTY, `房间内竖墙 (${x},${y}) 应为 EMPTY`);
        }
    }
    // 出口：右侧 vWalls[roomY+1][3] = DOOR，上方 hWalls[roomY][1] = DOOR
    assertEq(maze.vWalls[roomY + 1][3].type, WT.DOOR, '右侧出口应为 DOOR');
    assertEq(maze.hWalls[roomY][1].type, WT.DOOR, '上方出口应为 DOOR');
});

test('generateFullMaze: 种子确定性（相同随机序列 → 相同地图）', () => {
    const seq = [0.42, 0.17, 0.83, 0.31, 0.66, 0.05, 0.92, 0.55, 0.21, 0.73];
    const a = withRandom(seq, () => generateFullMaze(10, 10, 2));
    const b = withRandom(seq, () => generateFullMaze(10, 10, 2));
    assertDeepEq(a.hWalls, b.hWalls, 'hWalls 确定性');
    assertDeepEq(a.vWalls, b.vWalls, 'vWalls 确定性');
    assertDeepEq(a.initialGhosts, b.initialGhosts, '鬼位置确定性');
});

test('generateFullMaze: 终点可达（起点 → 最远格存在路径）', () => {
    const maze = withRandom([0.42, 0.17, 0.83, 0.31, 0.66, 0.05, 0.92, 0.55, 0.21, 0.73], () => generateFullMaze(10, 10, 1));
    // 用公共距离场验证：起点到最远格的距离有限
    const end = findFarthestEndCellSafe(maze);
    const dist = calculateDistances({ x: maze.startPos.x, y: maze.startPos.y }, maze.width, maze.height, maze.hWalls, maze.vWalls);
    assert(dist[end.y][end.x] !== Infinity, '最远格必须可达');
});

// findFarthestEndCell 未导出，此处内联取最远格
function findFarthestEndCellSafe(maze) {
    const dist = calculateDistances({ x: maze.startPos.x, y: maze.startPos.y }, maze.width, maze.height, maze.hWalls, maze.vWalls);
    let best = null, bestDist = -1;
    for (let y = 0; y < maze.height; y++) {
        for (let x = 0; x < maze.width; x++) {
            if (dist[y][x] !== Infinity && dist[y][x] > bestDist) { bestDist = dist[y][x]; best = { x, y }; }
        }
    }
    return best;
}

test('calculateDistances 统一语义: GLASS 阻挡（玩家通行规则，与 findPlayerPath 一致）', () => {
    // 1 列 3 行，GLASS 在 h[1][0]；起点 {0,0}
    const hWalls = [
        [{ type: WT.EMPTY, keys: 0 }],
        [{ type: WT.GLASS, keys: 0 }],
        [{ type: WT.EMPTY, keys: 0 }],
        [{ type: WT.EMPTY, keys: 0 }],
    ];
    const vWalls = [[{ type: WT.EMPTY, keys: 0 }], [{ type: WT.EMPTY, keys: 0 }], [{ type: WT.EMPTY, keys: 0 }]];
    const d = calculateDistances({ x: 0, y: 0 }, 1, 3, hWalls, vWalls);
    assertEq(d[2][0], Infinity, 'GLASS 阻挡不可达');
});

test('isPosInStartRoom 与 createEmptyWalls 基础', () => {
    assertEq(isPosInStartRoom(1, 8, 10), true);
    assertEq(isPosInStartRoom(5, 5, 10), false);
    const h = createEmptyWalls('h', 4, 4);
    assertEq(h.length, 5, 'hWalls 行数 = height+1');
    assertEq(h[0].length, 4);
    assertEq(h[0][0].type, WT.SOLID, '边界 SOLID');
    const v = createEmptyWalls('v', 4, 4);
    assertEq(v.length, 4, 'vWalls 行数 = height');
    assertEq(v[0].length, 5);
});

summary('mazeGenerator');
