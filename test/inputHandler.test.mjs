/**
 * InputHandler 冒烟测试（防回归锁）
 * 背景：Phase 3d 迁移时 getMousePos 内引用原版闭包变量 canvas，独立模块作用域缺失
 *       → 点击移动、编辑器鼠标全部 ReferenceError（测试全绿却功能全坏）。
 * 本测试用最小 DOM mock 加载 inputHandler.js，调用全部鼠标入口，断言不抛错。
 * 目的：锁定「模块级变量缺失」类迁移 bug 不再复发。
 */
import { deflateRawSync } from 'node:zlib';
import { test, suite, summary, assert, assertEq, assertDeepEq } from './_assert.mjs';
import { WALL_TYPES } from '../src/core/constants.js';
import { EditorDocument } from '../src/editor/editorSession.js';

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

// 构造最小游戏对象：覆盖鼠标函数访问到的全部字段与方法。
// 编辑器权威源 = editorDoc（EditorDocument）；host 镜像字段（width/hWalls/…）由
// syncEditorMirrors 桥接指向 doc（对应 main.js Step 5 的 _syncEditorMirrors）。
const makeGame = () => {
    const g = {
        state: 'playing', cellSize: 50,
        player: { x: 1, y: 1, keys: 0 },
        seenCells: Array.from({ length: 10 }, () => Array(10).fill(true)),
        debugVision: false,
        drawOffset: { x: 0, y: 0 }, padding: 15,
        editorDoc: EditorDocument.blank(10, 10, 'regular', false),
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
        movePlayer() {}, stopAutoMove() {}, drawEditor() {}, setEditorTool() {},
        _renderStaticLayer() {}, showToast() {},
        // —— 编辑器薄委托（对应 main.js Step 5：写操作委托 editorDoc + 镜像同步）——
        syncEditorMirrors() {
            const d = this.editorDoc;
            this.width = d.width; this.height = d.height;
            this.hWalls = d.hWalls; this.vWalls = d.vWalls;
            this.activeCells = d.activeCells;
            this.ghosts = d.ghosts; this.items = d.items; this.buttons = d.buttons; this.stairs = d.stairs;
            this.customStartPos = d.customStartPos; this.endPos = d.endPos;
            this.layerCount = d.layerCount; this.currentLayer = d.currentLayer;
            this.multiLayerMode = d.multiLayerMode; this.playerLayer = d.playerLayer;
        },
        toggleWall(wall, type) { this.editorDoc.toggleWall(wall, type); this.syncEditorMirrors(); this.drawEditor(); },
        toggleActiveCell(x, y, action) { this.editorDoc.toggleActiveCell(x, y, action); this.syncEditorMirrors(); this._renderStaticLayer(); this.drawEditor(); },
        setWall(wall, type) { this.editorDoc.setWall(wall, type); this.syncEditorMirrors(); this.drawEditor(); },
        toggleDoor(wall) { this.editorDoc.toggleDoor(wall); this.syncEditorMirrors(); this.drawEditor(); },
        setLocked(wall, keys) { this.editorDoc.setLocked(wall, keys); this.syncEditorMirrors(); this.drawEditor(); },
        toggleLetterDoor(wall, letter) { this.editorDoc.toggleLetterDoor(wall, letter); this.syncEditorMirrors(); this.drawEditor(); },
        setOneWay(wall, direction) { this.editorDoc.setOneWay(wall, direction); this.syncEditorMirrors(); this.drawEditor(); },
        setEnd(x, y) { this.editorDoc.setEnd(x, y); this.syncEditorMirrors(); this.drawEditor(); },
        setStart(x, y) { this.editorDoc.setStart(x, y); this.syncEditorMirrors(); this.drawEditor(); },
        toggleGhost(x, y) { this.editorDoc.toggleGhost(x, y); this.syncEditorMirrors(); this.drawEditor(); },
        toggleKey(x, y) { this.editorDoc.toggleKey(x, y); this.syncEditorMirrors(); this.drawEditor(); },
        toggleButton(hotspot, letter) { this.editorDoc.toggleButton(hotspot, letter); this.syncEditorMirrors(); this.drawEditor(); },
        eraseStairAt(x, y, layer) { this.editorDoc.eraseStairAt(x, y, layer); this.syncEditorMirrors(); },
        placeStair(x, y, direction) { const ok = this.editorDoc.placeStair(x, y, direction); this.syncEditorMirrors(); return ok; },
        isValidStairPlacement(x, y, direction) { return this.editorDoc.isValidStairPlacement(x, y, direction); },
        eraseAtPos(pos) { this.editorDoc.eraseAt(pos, this.cellSize); this.syncEditorMirrors(); },
        isWallEditable(wall) { return this.editorDoc.isWallEditable(wall); },
        isCellOccupiedInEditor(x, y) { return this.editorDoc.isCellOccupied(x, y); },
        isPosInStartRoom(x, y) { return this.editorDoc.isPosInStartRoom(x, y); },
        getGameView() {
            return {
                width: this.width, height: this.height, cellSize: this.cellSize,
                hWalls: this.hWalls, vWalls: this.vWalls,
                seenCells: this.seenCells, debugVision: this.debugVision,
                player: this.player,
            };
        },
    };
    g.syncEditorMirrors();
    return g;
};

test('模块可加载：canvas 引用有效', () => {
    assert(typeof InputHandler.getMousePos === 'function');
});

test('getMousePos：坐标换算正确（无 ReferenceError）', () => {
    const g = makeGame();
    const pos = InputHandler.getMousePos(g, { clientX: 100, clientY: 100 });
    assert(pos.x === 100 && pos.y === 100, `期望 {100,100} 实际 {${pos.x},${pos.y}}`);
});

test('handleCanvasClick：相邻格先等效方向键单步（有效果即结束）', () => {
    const g = makeGame();
    let moved = false;
    g.movePlayer = () => { moved = true; return {}; }; // 返回非 null = 有状态变化（移动/按按钮）
    InputHandler.handleCanvasClick(g, { clientX: 50, clientY: 100 }); // (1,1)->(1,2)
    assert(moved, '相邻格点击应触发 movePlayer');
});

test('handleCanvasClick：相邻格单步无效且目标非黑暗 → 降级寻路', () => {
    const g = makeGame();
    const calls = [];
    g.movePlayer = (dx, dy) => { calls.push([dx, dy]); return null; }; // 撞墙：单步无效果
    const origSet = globalThis.setInterval, origClear = globalThis.clearInterval;
    globalThis.__tcb = null;
    globalThis.setInterval = (cb) => { globalThis.__tcb = cb; return 1; };
    globalThis.clearInterval = () => { globalThis.__tcb = null; };
    try {
        InputHandler.handleCanvasClick(g, { clientX: 50, clientY: 100 }); // 相邻 {1,2}（seenCells 全 true 非黑暗）
        // 第 1 次是相邻单步尝试；单步无效降级寻路，寻路第一步再次 movePlayer
        assertEq(calls.length, 2, `单步尝试 + 寻路第一步，实际 ${calls.length} 次`);
        assertEq(calls[0][0], 0); assertEq(calls[0][1], 1, '先按相邻方向单步');
    } finally {
        globalThis.setInterval = origSet; globalThis.clearInterval = origClear; globalThis.__tcb = null;
    }
});

test('handleCanvasClick：相邻格单步无效且目标黑暗 → 不寻路', () => {
    const g = makeGame();
    g.seenCells = Array.from({ length: 10 }, () => Array(10).fill(false)); // 全黑暗
    const calls = [];
    g.movePlayer = (dx, dy) => { calls.push([dx, dy]); return null; };
    const origSet = globalThis.setInterval, origClear = globalThis.clearInterval;
    globalThis.setInterval = () => 0;
    globalThis.clearInterval = () => {};
    try {
        InputHandler.handleCanvasClick(g, { clientX: 50, clientY: 100 }); // 相邻 {1,2} 黑暗
        assertEq(calls.length, 1, '只尝试相邻单步，不降级寻路');
    } finally {
        globalThis.setInterval = origSet; globalThis.clearInterval = origClear;
    }
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

// ==================== Step 5 编辑器委托锁（写操作走 editorDoc + 镜像同步） ====================
// 坐标换算：clientX=75 → pos=(60,60) → cell(1,1) 偏 10px → getWallAtPos 命中上边界 hWalls[1][1]
//           clientX=275 → pos=(260,260) → cell(5,5)（地图中央，非起始房间）

test('编辑器 wall 工具 mousedown → editorDoc 墙翻转 + 镜像同步', () => {
    const g = makeGame();
    g.state = 'editor';
    g.editor.active = true; g.editor.tool = 'wall';
    InputHandler.handleCanvasMouseDown(g, { button: 0, clientX: 75, clientY: 75 });
    assertEq(g.editorDoc.hWalls[1][1].type, WALL_TYPES.SOLID, 'wall 工具按下应翻转墙为 SOLID');
    assertEq(g.hWalls[1][1].type, WALL_TYPES.SOLID, '镜像字段应同步指向 doc');
});

test('编辑器 glass 工具 mousedown → editorDoc 墙 GLASS', () => {
    const g = makeGame();
    g.state = 'editor';
    g.editor.active = true; g.editor.tool = 'glass';
    InputHandler.handleCanvasMouseDown(g, { button: 0, clientX: 75, clientY: 75 });
    assertEq(g.editorDoc.hWalls[1][1].type, WALL_TYPES.GLASS);
});

test('编辑器 door 工具 mouseup（点击不拖动）→ editorDoc 墙切换 DOOR', () => {
    const g = makeGame();
    g.state = 'editor';
    g.editor.active = true; g.editor.tool = 'door';
    InputHandler.handleCanvasMouseDown(g, { button: 0, clientX: 75, clientY: 75 });
    InputHandler.handleCanvasMouseUp(g, { button: 0, clientX: 75, clientY: 75 });
    assertEq(g.editorDoc.hWalls[1][1].type, WALL_TYPES.DOOR, '点击门工具应切为 DOOR');
});

test('编辑器 lock 工具 mouseup → editorDoc 墙替换为 LOCKED（keys 来自 prompt）', () => {
    const g = makeGame();
    g.state = 'editor';
    g.editor.active = true; g.editor.tool = 'lock';
    const origPrompt = globalThis.prompt;
    globalThis.prompt = () => '3';
    try {
        InputHandler.handleCanvasMouseDown(g, { button: 0, clientX: 75, clientY: 75 });
        InputHandler.handleCanvasMouseUp(g, { button: 0, clientX: 75, clientY: 75 });
    } finally {
        globalThis.prompt = origPrompt;
    }
    const w = g.editorDoc.hWalls[1][1];
    assertEq(w.type, WALL_TYPES.LOCKED, '锁工具应替换墙为 LOCKED');
    assertEq(w.keys, 3, 'keys 应来自 prompt 输入');
});

test('编辑器 ghost 工具 mouseup → editorDoc.ghosts 新增', () => {
    const g = makeGame();
    g.state = 'editor';
    g.editor.active = true; g.editor.tool = 'ghost';
    InputHandler.handleCanvasMouseDown(g, { button: 0, clientX: 275, clientY: 275 });
    InputHandler.handleCanvasMouseUp(g, { button: 0, clientX: 275, clientY: 275 });
    assertDeepEq(g.editorDoc.ghosts, [{ x: 5, y: 5 }]);
});

test('编辑器 key 工具 mouseup → editorDoc.items 新增 key', () => {
    const g = makeGame();
    g.state = 'editor';
    g.editor.active = true; g.editor.tool = 'key';
    InputHandler.handleCanvasMouseDown(g, { button: 0, clientX: 275, clientY: 275 });
    InputHandler.handleCanvasMouseUp(g, { button: 0, clientX: 275, clientY: 275 });
    assertDeepEq(g.editorDoc.items, [{ x: 5, y: 5, type: 'key' }]);
});

test('编辑器 grid 工具（free 模式）mousedown → editorDoc.activeCells 翻转', () => {
    const g = makeGame();
    g.state = 'editor';
    g.editorDoc.mode = 'free';
    g.editor.active = true; g.editor.tool = 'grid';
    InputHandler.handleCanvasMouseDown(g, { button: 0, clientX: 275, clientY: 275 }); // cell(5,5)
    assertEq(g.editorDoc.activeCells[5][5], false, 'grid 工具应取消激活格');
    assertEq(g.activeCells[5][5], false, '镜像应同步');
});

test('编辑器 stair 工具 mouseup → editorDoc.stairs 成对新增', () => {
    const g = makeGame();
    g.state = 'editor';
    g.editorDoc = EditorDocument.blank(10, 10, 'regular', true);
    g.editorDoc.addLayer(); // layerCount=2，第 1 层为空层
    g.syncEditorMirrors();
    g.editor.active = true; g.editor.tool = 'stair';
    InputHandler.handleCanvasMouseDown(g, { button: 0, clientX: 275, clientY: 275 });
    InputHandler.handleCanvasMouseUp(g, { button: 0, clientX: 275, clientY: 275 });
    assertEq(g.editorDoc.stairs.length, 2, '楼梯应成对新增（up + down）');
    assertEq(g.editorDoc.stairs[0].layer, 0);
    assertEq(g.editorDoc.stairs[1].layer, 1);
});

test('编辑器 WALL 拖拽 → setWall 替换语义（不翻转回 EMPTY）', () => {
    const g = makeGame();
    g.state = 'editor';
    g.editor.active = true; g.editor.tool = 'wall';
    // mousedown 在 (1,1) 上边界 → SOLID
    InputHandler.handleCanvasMouseDown(g, { button: 0, clientX: 75, clientY: 75 });
    assertEq(g.editorDoc.hWalls[1][1].type, WALL_TYPES.SOLID, '起点墙已 SOLID');
    // 拖拽到 (7,1) 同排水平墙 → 替换语义（保持 SOLID 而非再翻转回 EMPTY）
    InputHandler.handleCanvasMouseMove(g, { clientX: 375, clientY: 75 });
    assertEq(g.editorDoc.hWalls[1][1].type, WALL_TYPES.SOLID, '起点墙保持 SOLID（无翻转）');
    assertEq(g.editorDoc.hWalls[1][7].type, WALL_TYPES.SOLID, '拖拽目标墙替换为 SOLID');
});

summary('inputHandler 冒烟');
