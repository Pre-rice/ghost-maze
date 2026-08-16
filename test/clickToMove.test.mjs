/**
 * 点击移动端到端测试：真实 G1 地图 + GameController + computeGameView 投影，
 * 走完整 handleCanvasClick 寻路流程（含定时器逐步移动），锁定「点击移动精确到达」。
 *
 * 背景：Phase 3d 迁移把原版 this.player（动态实例属性，每次 move() 读取）改成闭包
 * 捕获的 view 快照，导致 delta 相对固定起点累积——第 2 步跳 2 格、第 3 步跳 3 格…
 * 用户实测「点走直线最后一步跳两格 / 复杂位置一步走到好远」。修复后 move() 每次
 * 动态读取当前玩家位置。本测试在真实引擎上验证：每步单格增量、精确到达目标。
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { installBrowserEnv } from './helpers/browser-env.mjs';
installBrowserEnv();

import { test, suite, summary, assert, assertEq, assertDeepEq } from './_assert.mjs';
import { GameController } from '../src/core/gameController.js';
import { computeGameView } from '../src/view/viewSlice.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const goldenMaps = JSON.parse(readFileSync(join(__dirname, 'golden/maps.json'), 'utf-8'));
const G1 = goldenMaps['G1-demo'];

// DOM mock：inputHandler 模块顶层 `const canvas = document.getElementById('game-canvas')`
// 必须在动态 import inputHandler 之前完成
const canvasEl = {
    width: 500, height: 500,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 500, height: 500 }),
};
globalThis.document = {
    getElementById: (id) => (id === 'game-canvas' ? canvasEl : null),
    querySelectorAll: () => [],
};
globalThis.window = globalThis.window || {};
const InputHandler = await import('../src/inputHandler.js');

suite('点击移动端到端（真实引擎）');

const makeG1 = () => {
    const c = new GameController({});
    c.gameMode = G1.gameMode;
    c.initialHealth = G1.initialHealth;
    c.initialStamina = G1.initialStamina;
    c.startGame(G1.canonical);
    const game = {
        state: 'playing', cellSize: 50, drawOffset: { x: 0, y: 0 }, autoMoveInterval: null,
        controller: c, editor: { active: false },
        getGameView() {
            return computeGameView(
                { mapDef: c.mapDefinition, gameState: c.currentGameState, viewLayer: c.viewLayer },
                { canvas: null, staticLayerCanvas: null, state: game.state, cellSize: 50, colors: {}, drawOffset: { x: 0, y: 0 }, debugVision: game._debugVision || false }
            );
        },
        movePlayer(dx, dy) { return c.movePlayer(dx, dy); },
        stopAutoMove() { if (game.autoMoveInterval) { clearInterval(game.autoMoveInterval); game.autoMoveInterval = null; } },
    };
    return { c, game };
};

// 点击格 (gx,gy) → clientX/clientY（drawOffset {0,0}、scale 1、cellSize 50）
const clickAt = (gx, gy) => ({ clientX: gx * 50, clientY: gy * 50 });

// 触发定时器，直到 move() 自行停止（到达终点或清空 timerCb）
const drainTimers = () => {
    for (let i = 0; i < 40; i++) {
        if (!globalThis.__timerCb) break;
        const cb = globalThis.__timerCb;
        cb();
    }
};

test('G1 直线 2 步 {1,8}→{3,8}：每步单格，经过 {2,8}，精确到达', () => {
    const { c, game } = makeG1();
    const deltas = [];
    const origMove = game.movePlayer;
    game.movePlayer = (dx, dy) => { deltas.push([dx, dy]); return origMove(dx, dy); };
    const origSet = globalThis.setInterval, origClear = globalThis.clearInterval;
    globalThis.__timerCb = null;
    globalThis.setInterval = (cb) => { globalThis.__timerCb = cb; return 7; };
    globalThis.clearInterval = () => { globalThis.__timerCb = null; };
    try {
        InputHandler.handleCanvasClick(game, clickAt(3, 8));
        assertEq(deltas.length, 1, '首次立即走一步');
        assertDeepEq({ x: c.currentGameState.player.x, y: c.currentGameState.player.y }, { x: 2, y: 8 }, '第一步到 {2,8}');
        drainTimers();
        assertDeepEq({ x: c.currentGameState.player.x, y: c.currentGameState.player.y }, { x: 3, y: 8 }, '精确到达 {3,8}');
        for (const d of deltas) assert(Math.abs(d[0]) + Math.abs(d[1]) === 1, `每步单格，实际 ${JSON.stringify(d)}`);
    } finally {
        globalThis.setInterval = origSet; globalThis.clearInterval = origClear; globalThis.__timerCb = null;
    }
});

// 确定性带门小地图：玩家 {1,1}，向右穿过 DOOR 到 {3,1}
const doorMap = () => {
    const W = 4, H = 3;
    const hWalls = Array(H + 1).fill(null).map((_, y) => Array(W).fill(null).map((_, x) => ({ type: (y === 0 || y === H || x === 0 || x === W - 1) ? 1 : 0, keys: 0 })));
    const vWalls = Array(H).fill(null).map((_, y) => Array(W + 1).fill(null).map((_, x) => ({ type: (x === 0 || x === W || y === 0 || y === H - 1) ? 1 : 0, keys: 0 })));
    vWalls[1][2] = { type: 2, keys: 0 }; // DOOR：格 (2,1) 左侧
    return {
        width: W, height: H, startPos: { x: 1, y: 1 },
        hWalls, vWalls, endPos: null, initialGhosts: [], items: [], buttons: [],
        activeCells: Array(H).fill(null).map(() => Array(W).fill(true)),
        editorMode: 'regular', customStartPos: null,
        multiLayerMode: false, layerCount: 1, layers: [], stairs: []
    };
};

test('确定性带门地图 {1,1}→{3,1}：穿过 DOOR 精确到达', () => {
    const c = new GameController({});
    c.gameMode = 'death-loop'; c.initialHealth = 5; c.initialStamina = 100;
    c.startGame(doorMap());
    const game = {
        state: 'playing', cellSize: 50, drawOffset: { x: 0, y: 0 }, autoMoveInterval: null,
        controller: c, editor: { active: false }, debugVision: true,
        getGameView() {
            return computeGameView(
                { mapDef: c.mapDefinition, gameState: c.currentGameState, viewLayer: c.viewLayer },
                { canvas: canvasEl, staticLayerCanvas: canvasEl, state: game.state, cellSize: 50, colors: {}, drawOffset: { x: 0, y: 0 }, debugVision: true }
            );
        },
        movePlayer(dx, dy) { return c.movePlayer(dx, dy); },
        stopAutoMove() { if (game.autoMoveInterval) { clearInterval(game.autoMoveInterval); game.autoMoveInterval = null; } },
    };
    const deltas = [];
    const origMove = game.movePlayer;
    game.movePlayer = (dx, dy) => { deltas.push([dx, dy]); return origMove(dx, dy); };
    const origSet = globalThis.setInterval, origClear = globalThis.clearInterval;
    globalThis.__timerCb = null;
    globalThis.setInterval = (cb) => { globalThis.__timerCb = cb; return 1; };
    globalThis.clearInterval = () => { globalThis.__timerCb = null; };
    try {
        InputHandler.handleCanvasClick(game, { clientX: 3 * 50 + 25, clientY: 1 * 50 + 25 });
        for (let i = 0; i < 20 && globalThis.__timerCb; i++) globalThis.__timerCb();
        assertDeepEq({ x: c.currentGameState.player.x, y: c.currentGameState.player.y }, { x: 3, y: 1 }, '穿过 DOOR 精确到达 {3,1}');
        assertEq(deltas.length, 2, '恰好 2 步');
        for (const d of deltas) assert(Math.abs(d[0]) + Math.abs(d[1]) === 1, `每步单格，实际 ${JSON.stringify(d)}`);
    } finally {
        globalThis.setInterval = origSet; globalThis.clearInterval = origClear; globalThis.__timerCb = null;
    }
});

test('G1 直线 7 步 {1,8}→{8,8}（debugVision）：每步单格，精确到达，无跳格', () => {
    const { c, game } = makeG1();
    game._debugVision = true; // 全开视野：BFS 可达远距离目标
    const deltas = [];
    const origMove = game.movePlayer;
    game.movePlayer = (dx, dy) => { deltas.push([dx, dy]); return origMove(dx, dy); };
    const origSet = globalThis.setInterval, origClear = globalThis.clearInterval;
    globalThis.__timerCb = null;
    globalThis.setInterval = (cb) => { globalThis.__timerCb = cb; return 7; };
    globalThis.clearInterval = () => { globalThis.__timerCb = null; };
    try {
        InputHandler.handleCanvasClick(game, clickAt(8, 8));
        drainTimers();
        assertDeepEq({ x: c.currentGameState.player.x, y: c.currentGameState.player.y }, { x: 8, y: 8 }, '精确到达 {8,8}');
        assertEq(deltas.length, 7, '恰好 7 步走完');
        for (const d of deltas) assert(Math.abs(d[0]) + Math.abs(d[1]) === 1, `每步单格，实际 ${JSON.stringify(d)}`);
    } finally {
        globalThis.setInterval = origSet; globalThis.clearInterval = origClear; globalThis.__timerCb = null;
    }
});

summary('点击移动端到端（真实引擎）');
