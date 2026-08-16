/**
 * InputHandler 冒烟测试（防回归锁）
 * 背景：Phase 3d 迁移时 getMousePos 内引用原版闭包变量 canvas，独立模块作用域缺失
 *       → 点击移动、编辑器鼠标全部 ReferenceError（测试全绿却功能全坏）。
 * 本测试用最小 DOM mock 加载 inputHandler.js，调用全部鼠标入口，断言不抛错。
 * 目的：锁定「模块级变量缺失」类迁移 bug 不再复发。
 */
import { deflateRawSync } from 'node:zlib';
import { test, suite, summary, assert, assertEq } from './_assert.mjs';

// 必须在动态 import inputHandler 之前完成 DOM mock（该模块顶层引用 document）
globalThis.window = globalThis.window || { pako: { deflateRaw: (d) => deflateRawSync(d), inflateRaw: null } };
if (typeof globalThis.atob !== 'function') globalThis.atob = (s) => Buffer.from(s, 'base64').toString('binary');
if (typeof globalThis.btoa !== 'function') globalThis.btoa = (s) => Buffer.from(s, 'binary').toString('base64');

const canvasEl = {
    width: 500, height: 500,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 500, height: 500 }),
};
globalThis.document = {
    getElementById: (id) => (id === 'game-canvas' ? canvasEl : null),
    querySelectorAll: () => [],
    addEventListener: () => {},
};
globalThis.window.addEventListener = () => {};

const InputHandler = await import('../src/inputHandler.js');

suite('inputHandler 冒烟');

// 构造最小游戏对象：覆盖鼠标函数访问到的全部字段与方法
const makeGame = () => {
    const wallBorder = Array.from({ length: 11 }, (_, y) =>
        Array.from({ length: 10 }, (_, x) => ({ type: (y === 0 || y === 10 || x === 0 || x === 9) ? 1 : 0 })));
    const wallV = Array.from({ length: 10 }, (_, y) =>
        Array.from({ length: 11 }, (_, x) => ({ type: (x === 0 || x === 10 || y === 0 || y === 9) ? 1 : 0 })));
    return {
        state: 'playing', width: 10, height: 10, cellSize: 50,
        player: { x: 1, y: 1, keys: 0 },
        seenCells: Array.from({ length: 10 }, () => Array(10).fill(true)),
        debugVision: false,
        drawOffset: { x: 0, y: 0 }, padding: 15,
        hWalls: wallBorder, vWalls: wallV,
        activeCells: Array.from({ length: 10 }, () => Array(10).fill(true)),
        ghosts: [], items: [], buttons: [], stairs: [], layers: [],
        customStartPos: null, endPos: null,
        layerCount: 1, currentLayer: 0, multiLayerMode: false,
        // Phase 4：游戏分支读 controller 权威源（多层判断/视图层）+ getGameView() 投影
        controller: {
            mapDefinition: { multiLayerMode: false },
            viewLayer: 0,
            currentGameState: { player: { layer: 0 } },
        },
        editor: {
            active: false, mode: 'regular', tool: 'wall',
            isDragging: false, didDrag: false, dragAxis: null, lastDragPos: null,
            hoveredWall: null, hoveredButtonHotspot: null, gridDragAction: null,
            stairPlacement: null, isRightClickErasing: false, rightClickMousePos: null,
        },
        movePlayer() {}, stopAutoMove() {}, drawEditor() {}, eraseAtPos() {},
        setEditorTool() {}, eraseButtonsOnWall() {}, eraseStairAt() {},
        _renderStaticLayer() {}, isWallEditable() { return true; },
        isCellOccupiedInEditor() { return false; }, isPosInStartRoom() { return false; },
        showToast() {},
        getGameView() {
            return {
                width: this.width, height: this.height, cellSize: this.cellSize,
                hWalls: this.hWalls, vWalls: this.vWalls,
                seenCells: this.seenCells, debugVision: this.debugVision,
                player: this.player,
            };
        },
    };
};

test('模块可加载：canvas 引用有效', () => {
    assert(typeof InputHandler.getMousePos === 'function');
});

test('getMousePos：坐标换算正确（无 ReferenceError）', () => {
    const g = makeGame();
    const pos = InputHandler.getMousePos(g, { clientX: 100, clientY: 100 });
    assert(pos.x === 100 && pos.y === 100, `期望 {100,100} 实际 {${pos.x},${pos.y}}`);
});

test('handleCanvasClick：相邻格走 movePlayer', () => {
    const g = makeGame();
    let moved = false;
    g.movePlayer = () => { moved = true; };
    InputHandler.handleCanvasClick(g, { clientX: 50, clientY: 100 }); // (1,1)->(1,2)
    assert(moved, '相邻格点击应触发 movePlayer');
});

test('handleCanvasClick：远距点击走寻路（不抛错）', () => {
    const g = makeGame();
    let moved = 0;
    g.movePlayer = (dx, dy) => { moved++; };
    // 关掉自动移动定时器（Node 无 rAF 终止时机）
    const origSet = globalThis.setInterval;
    globalThis.setInterval = () => 0;
    try {
        InputHandler.handleCanvasClick(g, { clientX: 400, clientY: 400 }); // (8,8) 远距
        assert(moved >= 1, '远距点击应开始寻路移动');
    } finally {
        globalThis.setInterval = origSet;
    }
});

test('handleCanvasMouseDown：编辑器 wall 工具按下不抛错', () => {
    const g = makeGame();
    g.editor.active = true;
    InputHandler.handleCanvasMouseDown(g, { button: 0, clientX: 75, clientY: 75 });
    assert(true);
});

test('handleCanvasMouseDown：橡皮擦工具按下调用 eraseAtPos', () => {
    const g = makeGame();
    g.editor.active = true;
    g.editor.tool = 'eraser';
    let erased = false;
    g.eraseAtPos = () => { erased = true; };
    InputHandler.handleCanvasMouseDown(g, { button: 0, clientX: 75, clientY: 75 });
    assert(erased, '橡皮擦按下应触发 eraseAtPos');
});

test('handleCanvasMouseUp：门工具放置不抛错', () => {
    const g = makeGame();
    g.editor.active = true;
    g.editor.tool = 'door';
    g.editor.isDragging = true;
    g.editor.didDrag = false;
    InputHandler.handleCanvasMouseUp(g, { button: 0, clientX: 75, clientY: 75 });
    assert(true);
});

test('handleCanvasMouseLeave：清除悬停状态不抛错', () => {
    const g = makeGame();
    g.editor.active = true;
    InputHandler.handleCanvasMouseLeave(g, {});
    assert(true);
});

test('findPlayerPath：直接寻路可用', () => {
    const g = makeGame();
    const path = InputHandler.findPlayerPath(g, { x: 1, y: 1 }, { x: 8, y: 8 });
    assert(Array.isArray(path) && path.length >= 1, '应有路径');
});

test('handleCanvasClick：直线点击逐步移动，delta 恒单格，精确到达目标（防闭包快照累积跳格）', () => {
    const g = makeGame();
    g.player = { x: 1, y: 1, keys: 0 }; // 沿 y 轴向下直线
    const deltas = [];
    let timerCbs = [];
    const origSetInterval = globalThis.setInterval;
    const origClearInterval = globalThis.clearInterval;
    globalThis.setInterval = (cb) => { timerCbs.push(cb); return 1; };
    globalThis.clearInterval = () => { timerCbs.length = 0; };
    let stopCalls = 0;
    // 模拟真实 stopAutoMove：清理定时器（真实实现会 clearInterval）
    g.stopAutoMove = () => { stopCalls++; timerCbs.length = 0; };
    g.movePlayer = (dx, dy) => { deltas.push([dx, dy]); g.player.x += dx; g.player.y += dy; return true; };
    try {
        InputHandler.handleCanvasClick(g, { clientX: 50, clientY: 450 }); // 目标格 {1,9}
        assertEq(deltas.length, 1, '首次立即走一步');
        assertEq(g.player.y, 2, '首次走到 y=2');
        // 固定次数触发定时器：8 步走完 + 多余触发让 move() 命中终点条件停止
        for (let i = 0; i < 12; i++) {
            for (const cb of [...timerCbs]) cb();
        }
        assertEq(g.player.y, 9, '精确到达目标行 y=9');
        assertEq(g.player.x, 1, 'x 方向不变');
        assertEq(stopCalls, 2, '开始时一次 + 到达后一次停止');
        // 每一步都是单格增量（杜绝 delta=2/3 的跳格）
        for (const d of deltas) {
            assert(Math.abs(d[0]) + Math.abs(d[1]) === 1, `每步单格，实际 delta=${JSON.stringify(d)}`);
        }
    } finally {
        globalThis.setInterval = origSetInterval;
        globalThis.clearInterval = origClearInterval;
    }
});

test('handleCanvasClick：路径中某步失败则停止，不累积跳格', () => {
    const g = makeGame();
    g.player = { x: 1, y: 1, keys: 0 };
    let timerCbs = [];
    const origSetInterval = globalThis.setInterval;
    const origClearInterval = globalThis.clearInterval;
    globalThis.setInterval = (cb) => { timerCbs.push(cb); return 1; };
    globalThis.clearInterval = () => { timerCbs.length = 0; };
    let stopCalls = 0;
    // 模拟真实 stopAutoMove：清理定时器（真实实现会 clearInterval）
    g.stopAutoMove = () => { stopCalls++; timerCbs.length = 0; };
    let call = 0;
    g.movePlayer = (dx, dy) => {
        call++;
        if (call === 3) return null; // 第 3 步撞墙失败：玩家原地不动
        g.player.x += dx; g.player.y += dy; return true;
    };
    try {
        InputHandler.handleCanvasClick(g, { clientX: 50, clientY: 450 }); // 目标 {1,9}
        assertEq(call, 1, '首次走一步');
        timerCbs[0](); // 第 2 步成功
        assertEq(g.player.y, 3, '第 2 步到 y=3');
        timerCbs[0](); // 第 3 步失败 → 停止，定时器清空
        assertEq(g.player.y, 3, '失败后玩家原地不动（无跳格）');
        assertEq(stopCalls, 2, '失败触发停止');
        assertEq(timerCbs.length, 0, '失败后定时器已清空');
    } finally {
        globalThis.setInterval = origSetInterval;
        globalThis.clearInterval = origClearInterval;
    }
});

summary('inputHandler 冒烟');
