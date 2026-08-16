/**
 * MapDefinition 归一化测试：构造/深拷贝/空层/出生点推导/楼梯过滤
 */
import { test, suite, summary, assert, assertEq, assertDeepEq } from './_assert.mjs';
import { MapDefinition } from '../src/core/mapDefinition.js';
import { WALL_TYPES as WT } from '../src/core/constants.js';

suite('mapDefinition');

const W = (type, extra = {}) => ({ type, keys: 0, ...extra });
const emptyRow = (n) => Array.from({ length: n }, () => W(WT.EMPTY));
const baseData = (over = {}) => ({
    width: 3, height: 2,
    hWalls: [[W(WT.SOLID), W(WT.EMPTY), W(WT.EMPTY)], [W(WT.EMPTY), W(WT.DOOR), W(WT.EMPTY)], [W(WT.EMPTY), W(WT.EMPTY), W(WT.EMPTY)]],
    vWalls: [emptyRow(4), emptyRow(4)],
    endPos: { x: 2, y: 1 },
    initialGhosts: [{ x: 0, y: 1 }],
    items: [{ x: 1, y: 0 }],
    buttons: [{ x: 0, y: 0, direction: { dx: 1, dy: 0 }, letter: 'A' }],
    stairs: [{ x: 1, y: 1, layer: 0, direction: 'up' }],
    gameMode: 'death-loop', initialHealth: 5, initialStamina: 100, editorMode: 'regular',
    ...over
});

test('单层构造: 尺寸/模式/层数/实体展开', () => {
    const md = new MapDefinition(baseData());
    assertEq(md.width, 3);
    assertEq(md.height, 2);
    assertEq(md.gameMode, 'death-loop');
    assertEq(md.initialHealth, 5);
    assertEq(md.initialStamina, 100);
    assertEq(md.layerCount, 1);
    assertEq(md.layers.length, 1);
    // 第 0 层展开
    const l0 = md.layers[0];
    assertEq(l0.initialWalls.h.length, 3, 'hWalls 行数 = height+1');
    assertEq(l0.initialWalls.h[0][0].type, WT.SOLID, '墙体类型透传');
    assertEq(l0.initialWalls.h[1][1].type, WT.DOOR);
    assertEq(l0.initialWalls.v.length, 2, 'vWalls 行数 = height');
    assertEq(l0.initialWalls.v[0].length, 4, 'vWalls 列数 = width+1');
    assertEq(l0.initialEntities.ghosts.length, 1);
    assertEq(l0.initialEntities.items.length, 1);
    assertEq(l0.initialEntities.buttons.length, 1);
    assertDeepEq(l0.initialEntities.endPos, { x: 2, y: 1 });
    assertEq(l0.activeCells.length, 2, 'activeCells 缺省 = 全启用');
    assertEq(l0.activeCells[0][0], true);
    // 楼梯过滤：第 0 层只含本层
    assertEq(l0.initialEntities.stairs.length, 1);
    assertDeepEq(l0.initialEntities.stairs[0], { x: 1, y: 1, layer: 0, direction: 'up' });
});

test('深拷贝隔离: 修改源数据不影响 mapDef', () => {
    const data = baseData();
    const md = new MapDefinition(data);
    // 修改源数组
    data.hWalls[0][0] = W(WT.EMPTY);
    data.initialGhosts[0].x = 9;
    data.endPos.x = 9;
    assertEq(md.layers[0].initialWalls.h[0][0].type, WT.SOLID, '墙体深拷贝隔离');
    assertEq(md.layers[0].initialEntities.ghosts[0].x, 0, '实体深拷贝隔离');
    assertEq(md.layers[0].initialEntities.endPos.x, 2, '终点深拷贝隔离');
});

test('空层: layerCount=2 且无 layers[1] → 全 EMPTY + 空实体', () => {
    const md = new MapDefinition(baseData({ layerCount: 2, multiLayerMode: true }));
    assertEq(md.layers.length, 2);
    const l1 = md.layers[1];
    assertEq(l1.initialWalls.h.length, 3, '空层墙维度正确');
    assertEq(l1.initialWalls.h[0][0].type, WT.EMPTY, '空层全 EMPTY');
    assertEq(l1.initialEntities.ghosts.length, 0);
    assertEq(l1.initialEntities.endPos, null);
    assertEq(l1.activeCells[0][0], true);
});

test('出生点: regular 模式默认 {1, height-2}', () => {
    const md = new MapDefinition(baseData());
    assertDeepEq(md.playerStart, { x: 1, y: 0, layer: 0 });
});

test('出生点: 显式 startPos 优先', () => {
    const md = new MapDefinition(baseData({ startPos: { x: 2, y: 1 } }));
    assertDeepEq(md.playerStart, { x: 2, y: 1, layer: 0 });
});

test('出生点: free 模式用 customStartPos（多层时定位所在层）', () => {
    const md = new MapDefinition(baseData({
        editorMode: 'free',
        customStartPos: { x: 2, y: 1 },
        layerCount: 2,
        multiLayerMode: true,
        layers: [
            { hWalls: baseData().hWalls, vWalls: baseData().vWalls, activeCells: [[true, true, true], [true, true, true]], ghosts: [], items: [], buttons: [], stairs: [], endPos: null, customStartPos: null },
            { hWalls: baseData().hWalls, vWalls: baseData().vWalls, activeCells: [[true, true, true], [true, true, true]], ghosts: [], items: [], buttons: [], stairs: [], endPos: null, customStartPos: { x: 1, y: 0 } },
        ],
    }));
    assertDeepEq(md.playerStart, { x: 1, y: 0, layer: 1 }, '起点 = 带 customStartPos 的层');
});

test('出生点: free 模式无 customStartPos → 回退默认起点', () => {
    const md = new MapDefinition(baseData({ editorMode: 'free' }));
    assertDeepEq(md.playerStart, { x: 1, y: 0, layer: 0 }, '回退 {1, height-2}');
});

summary('mapDefinition');
