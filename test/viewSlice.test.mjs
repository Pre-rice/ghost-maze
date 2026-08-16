/**
 * viewSlice / renderer 组合渲染测试
 *  1. createGameView/createEditorView 组装：字段与宿主引用一致
 *  2. renderStaticLayer/drawGame/drawEditor/drawCorners 用 mock canvas 跑通
 *     G1 尺寸的完整渲染路径（不抛异常 = 组合函数自足，未访问 undefined 字段）
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { test, suite, summary, assert, assertEq } from './_assert.mjs';
import { createGameView, createEditorView, computeGameView, pruneTrails } from '../src/view/viewSlice.js';
import { MapDefinition } from '../src/core/mapDefinition.js';
import { GameLogic } from '../src/core/gameLogic.js';
import * as Renderer from '../src/view/renderer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const G1 = JSON.parse(readFileSync(join(__dirname, 'golden/maps.json'), 'utf-8'))['G1-demo'];

suite('viewSlice');

// ---------- 视图快照组装 ----------

test('createGameView: 字段与宿主引用一致（读多写零）', () => {
    const host = {
        canvas: {}, staticLayerCanvas: {}, state: 'PLAYING', cellSize: 40, colors: {},
        drawOffset: { x: 0, y: 0 }, debugVision: false, width: 10, height: 10,
        activeCells: [], seenCells: [], hWalls: [], vWalls: [], ghosts: [], items: [],
        buttons: [], stairs: [], endPos: null, player: {}, playerLayer: 0,
        currentLayer: 0, multiLayerMode: false,
    };
    const view = createGameView(host);
    assertEq(view.hWalls, host.hWalls, 'hWalls 引用');
    assertEq(view.player, host.player, 'player 引用');
    assertEq(view.width, 10);
    assertEq(view.state, 'PLAYING');
    assert('staticLayerCanvas' in view, '含静态层画布');
});

test('createEditorView: 字段与宿主引用一致', () => {
    const host = {
        canvas: {}, staticLayerCanvas: {}, state: 'EDITOR', editor: { mode: 'regular' },
        cellSize: 40, colors: {}, padding: 15, width: 10, height: 10,
        activeCells: [], hWalls: [], vWalls: [], ghosts: [], items: [], buttons: [],
        stairs: [], endPos: null, customStartPos: null, startPos: { x: 1, y: 8 },
        currentLayer: 0,
    };
    const view = createEditorView(host);
    assertEq(view.editor, host.editor, 'editor 引用');
    assertEq(view.padding, 15);
    assertEq(view.startPos, host.startPos, 'startPos 引用');
});

// ---------- 权威源投影（Phase 4 computeGameView / pruneTrails） ----------

// 用 G1 canonical 构造权威源（MapDefinition + GameLogic 初始态）
const makeAuthSources = (over = {}) => {
    const mapDef = new MapDefinition({
        ...G1.canonical, ...over,
        gameMode: G1.gameMode, initialHealth: G1.initialHealth, initialStamina: G1.initialStamina,
    });
    return { mapDef, gameState: GameLogic.createInitialState(mapDef) };
};

// 全激活格（本段局部定义，避免依赖下方渲染段的 fullCells 声明顺序）
const cells = (w, h) => Array.from({ length: h }, () => Array(w).fill(true));

test('computeGameView: 投影字段 === 权威源引用（读多写零）', () => {
    const { mapDef, gameState } = makeAuthSources();
    const renderParams = {
        canvas: {}, staticLayerCanvas: {}, state: 'PLAYING', cellSize: 40,
        colors: {}, drawOffset: { x: 0, y: 0 }, debugVision: true,
    };
    const view = computeGameView({ mapDef, gameState, viewLayer: 0 }, renderParams);
    assertEq(view.width, mapDef.width);
    assertEq(view.height, mapDef.height);
    assertEq(view.hWalls, gameState.layerStates[0].wallStates.h, 'hWalls === 权威');
    assertEq(view.vWalls, gameState.layerStates[0].wallStates.v, 'vWalls === 权威');
    assertEq(view.activeCells, mapDef.layers[0].activeCells, 'activeCells === 权威');
    assertEq(view.seenCells, gameState.seenCells[0], 'seenCells === 权威');
    assertEq(view.ghosts, gameState.layerStates[0].ghosts, 'ghosts === 权威');
    assertEq(view.items, gameState.layerStates[0].items, 'items === 权威');
    assertEq(view.buttons, mapDef.layers[0].initialEntities.buttons, 'buttons === 权威');
    assertEq(view.stairs, mapDef.stairs, 'stairs === 权威');
    assertEq(view.endPos, mapDef.layers[0].initialEntities.endPos, 'endPos === 权威');
    assertEq(view.player, gameState.player, 'player === 权威');
    assertEq(view.playerLayer, gameState.player.layer, 'playerLayer 取权威');
    assertEq(view.currentLayer, 0, 'currentLayer = 视图层');
    assertEq(view.multiLayerMode, mapDef.multiLayerMode);
    // 宿主渲染参数注入（非数据源）
    assertEq(view.cellSize, 40);
    assertEq(view.state, 'PLAYING');
    assertEq(view.debugVision, true);
});

test('computeGameView: viewLayer 2 号层投影正确（多层映射到对应层）', () => {
    // 多层地图：layer 1 含鬼
    const layer1 = {
        hWalls: JSON.parse(JSON.stringify(G1.canonical.hWalls)),
        vWalls: JSON.parse(JSON.stringify(G1.canonical.vWalls)),
        activeCells: cells(10, 10),
        ghosts: [{ x: 5, y: 5, id: 0 }],
        items: [], buttons: [], endPos: null, customStartPos: null, stairs: [],
    };
    const { mapDef, gameState } = makeAuthSources({ multiLayerMode: true, layerCount: 2, layers: [null, layer1] });
    const renderParams = { canvas: {}, staticLayerCanvas: {}, state: 'PLAYING', cellSize: 40, colors: {}, drawOffset: { x: 0, y: 0 }, debugVision: true };
    const view = computeGameView({ mapDef, gameState, viewLayer: 1 }, renderParams);
    assertEq(view.ghosts, gameState.layerStates[1].ghosts, 'ghosts 取第 1 层');
    assertEq(view.currentLayer, 1);
    assertEq(view.multiLayerMode, true);
});

test('pruneTrails: 权威源上剪陈旧轨迹（player + viewLayer 鬼）', () => {
    const { mapDef, gameState } = makeAuthSources();
    const now = 10000;
    gameState.player.trail = [
        { x: 1, y: 8, timestamp: now - 100 },   // 新鲜
        { x: 1, y: 7, timestamp: now - 900 },   // 陈旧
    ];
    const g0 = gameState.layerStates[0].ghosts[0];
    g0.trail = [
        { x: 3, y: 3, timestamp: now - 100 },   // 新鲜
        { x: 3, y: 4, timestamp: now - 600 },   // 陈旧
    ];
    pruneTrails(gameState, 0, now, 500);
    assertEq(gameState.player.trail.length, 1, '玩家陈旧轨迹被剪');
    assertEq(gameState.player.trail[0].timestamp, now - 100, '保留新鲜轨迹');
    assertEq(g0.trail.length, 1, 'viewLayer 鬼陈旧轨迹被剪');
    // 幂等：重复调用不改变
    pruneTrails(gameState, 0, now, 500);
    assertEq(gameState.player.trail.length, 1, '重复调用幂等');
});

test('pruneTrails: 只剪 viewLayer 层鬼，不碰其它层', () => {
    const layer1 = {
        hWalls: JSON.parse(JSON.stringify(G1.canonical.hWalls)),
        vWalls: JSON.parse(JSON.stringify(G1.canonical.vWalls)),
        activeCells: cells(10, 10),
        ghosts: [{ x: 5, y: 5, id: 0 }],
        items: [], buttons: [], endPos: null, customStartPos: null, stairs: [],
    };
    const { mapDef, gameState } = makeAuthSources({ multiLayerMode: true, layerCount: 2, layers: [null, layer1] });
    const now = 10000;
    gameState.layerStates[0].ghosts.forEach(g => { g.trail = [{ x: 1, y: 1, timestamp: now - 900 }]; });
    gameState.layerStates[1].ghosts.forEach(g => { g.trail = [{ x: 5, y: 5, timestamp: now - 900 }]; });
    pruneTrails(gameState, 0, now, 500);
    assertEq(gameState.layerStates[0].ghosts[0].trail.length, 0, 'viewLayer 0 鬼轨迹被剪');
    assertEq(gameState.layerStates[1].ghosts[0].trail.length, 1, '其它层鬼轨迹不动');
});

// ---------- 组合渲染（mock canvas 全路径跑通） ----------

// 返回一个把所有方法变为 no-op 的 mock 2D 上下文
const makeCtx = () => new Proxy({
    canvas: { width: 800, height: 800 },
    measureText: () => ({ width: 0 }),
}, {
    get(t, p) {
        if (p in t) return t[p];
        if (typeof p === 'string') {
            if (!(p in t)) t[p] = () => {};
            return t[p];
        }
        return undefined;
    },
    set(t, p, v) { t[p] = v; return true; },
});

const makeCanvas = (ctx) => ({ width: 800, height: 800, getContext: () => ctx });

const fullCells = (w, h) => Array.from({ length: h }, () => Array(w).fill(true));
const seenAll = (w, h) => Array.from({ length: h }, () => Array(w).fill(true));

const baseGameView = () => {
    const c = G1.canonical;
    return {
        canvas: {}, staticLayerCanvas: {},
        state: 'PLAYING', cellSize: 40,
        colors: {
            wall: '#000', ground: '#eee', gridLine: '#ccc', unexplored: '#ddd',
            player: '#0a0', ghost: '#f00', endPoint: '#00f', key: '#ff0',
            voidGrid: '#999', text: '#000', border: '#ccc', startRoomHighlight: 'rgba(0,200,0,0.1)',
            hoverHighlight: '#ff0',
        },
        drawOffset: { x: 0, y: 0 }, debugVision: true,
        width: c.width, height: c.height,
        activeCells: c.activeCells || fullCells(c.width, c.height),
        seenCells: seenAll(c.width, c.height),
        hWalls: c.hWalls, vWalls: c.vWalls,
        // trail 是运行期 GameState 字段，静态 golden 数据里没有，渲染层需要
        ghosts: (c.initialGhosts || []).map(g => ({ ...g, trail: [] })),
        items: c.items, buttons: c.buttons,
        stairs: c.stairs || [], endPos: c.endPos,
        player: { x: 1, y: 8, trail: [] }, playerLayer: 0, currentLayer: 0,
        multiLayerMode: false,
    };
};

test('renderStaticLayer: G1 尺寸跑通（含 EDITOR 状态分支）', () => {
    const ctx = makeCtx();
    const main = makeCanvas(ctx);
    const staticCanvas = makeCanvas(ctx);
    const view = baseGameView();
    Renderer.renderStaticLayer(main, staticCanvas, view);
    // EDITOR 分支（虚空虚线）
    Renderer.renderStaticLayer(main, staticCanvas, { ...view, state: 'EDITOR' });
    assert(true, '无异常');
});

test('drawGame: G1 全路径跑通（debugVision 全可见）', () => {
    const ctx = makeCtx();
    Renderer.drawGame(ctx, baseGameView());
    assert(true, '无异常');
});

test('drawGame: 未探索视野路径（debugVision=false）跑通', () => {
    const ctx = makeCtx();
    const view = baseGameView();
    view.debugVision = false;
    Renderer.drawGame(ctx, view);
    assert(true, '无异常');
});

test('drawCorners: 游戏态与编辑器态跑通', () => {
    const ctx = makeCtx();
    const view = baseGameView();
    Renderer.drawCorners(ctx, view, false);
    Renderer.drawCorners(ctx, view, true);
    assert(true, '无异常');
});

test('drawEditor: G1 尺寸全路径跑通（regular 与 free 模式）', () => {
    const c = G1.canonical;
    const editor = {
        active: true, mode: 'regular', tool: 1, isDragging: false, didDrag: false,
        dragAxis: null, lastDragPos: null, hoveredWall: null, hoveredButtonHotspot: null,
        gridDragAction: null, stairPlacement: null, isRightClickErasing: false,
        rightClickMousePos: null, previousToolBeforeRightClick: null,
    };
    const base = {
        canvas: {}, staticLayerCanvas: {},
        state: 'EDITOR', cellSize: 40, padding: 15,
        colors: {
            wall: '#000', ground: '#eee', gridLine: '#ccc', unexplored: '#ddd',
            player: '#0a0', ghost: '#f00', endPoint: '#00f', key: '#ff0',
            voidGrid: '#999', text: '#000', border: '#ccc', startRoomHighlight: 'rgba(0,200,0,0.1)',
            hoverHighlight: '#ff0',
        },
        width: c.width, height: c.height,
        activeCells: c.activeCells || fullCells(c.width, c.height),
        hWalls: c.hWalls, vWalls: c.vWalls,
        ghosts: c.initialGhosts, items: c.items, buttons: c.buttons,
        stairs: c.stairs || [], endPos: c.endPos,
        customStartPos: null, startPos: { x: 1, y: 8 }, currentLayer: 0,
    };
    const ctx = makeCtx();
    Renderer.drawEditor(ctx, { ...base, editor });
    Renderer.drawEditor(ctx, { ...base, editor: { ...editor, mode: 'free' } });
    // 悬停墙预览分支（绘制高亮墙 + 单向门箭头）
    Renderer.drawEditor(ctx, { ...base, editor: {
        ...editor, hoveredWall: { x: 1, y: 1, type: 'h', direction: { dx: 1, dy: 0 } },
        tool: 4,
    } });
    assert(true, '无异常');
});

summary('viewSlice');
