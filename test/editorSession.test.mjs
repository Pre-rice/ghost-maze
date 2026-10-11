/**
 * editorSession（EditorDocument）测试：编辑器会话唯一数据源的行为锁定。
 * 覆盖：blank/load/toMapData/toShareMapData/saveCurrentLayer/switchLayer/
 * 增删层/applyLayerMode/编辑操作（墙/格/擦除/楼梯/清空）/resize/hasStartPoint/validate。
 */
import { test, suite, summary, assert, assertEq, assertDeepEq } from './_assert.mjs';
import { EditorDocument } from '../src/editor/editorSession.js';
import { WALL_TYPES as WT, START_ROOM_SIZE, getStartRoomY } from '../src/core/constants.js';
import { generateFullMaze } from '../src/core/mazeGenerator.js';

suite('editorSession');

const W = (type, extra = {}) => ({ type, keys: 0, ...extra });

// 构造一个带内容的单层 regular mapData
function makeMapData(over = {}) {
    const width = 10, height = 10;
    const hWalls = Array(height + 1).fill(null).map(() => Array(width).fill(null).map(() => W(WT.EMPTY)));
    const vWalls = Array(height).fill(null).map(() => Array(width + 1).fill(null).map(() => W(WT.EMPTY)));
    return {
        width, height,
        hWalls, vWalls,
        endPos: { x: 8, y: 1 },
        initialGhosts: [{ x: 3, y: 3, id: 0 }, { x: 6, y: 6, id: 1 }],
        items: [{ x: 2, y: 5, type: 'key' }],
        buttons: [{ x: 4, y: 4, direction: { dx: 0, dy: -1 }, letter: 'A' }],
        activeCells: Array(height).fill(null).map(() => Array(width).fill(true)),
        editorMode: 'regular',
        customStartPos: null,
        multiLayerMode: false,
        layerCount: 1,
        layers: [],
        stairs: [],
        ...over
    };
}

// ---------- 装载 / 导出 ----------

test('blank: regular 外圈 SOLID + 起始房间出口 DOOR + startPos', () => {
    const doc = EditorDocument.blank(10, 10, 'regular');
    assertEq(doc.width, 10);
    assertEq(doc.height, 10);
    assertEq(doc.mode, 'regular');
    // 外圈边界
    for (let x = 0; x < 10; x++) {
        assertEq(doc.hWalls[0][x].type, WT.SOLID, '上边界 SOLID');
        assertEq(doc.hWalls[10][x].type, WT.SOLID, '下边界 SOLID');
    }
    for (let y = 0; y < 10; y++) {
        assertEq(doc.vWalls[y][0].type, WT.SOLID, '左边界 SOLID');
        assertEq(doc.vWalls[y][10].type, WT.SOLID, '右边界 SOLID');
    }
    // 起始房间出口 DOOR（与 createStartRoomLayout 一致）
    const roomY = getStartRoomY(10);
    assertEq(doc.hWalls[roomY][1].type, WT.DOOR, '上方出口 DOOR');
    assertEq(doc.vWalls[roomY + 1][START_ROOM_SIZE].type, WT.DOOR, '右侧出口 DOOR');
    assertEq(doc.startPos.x, 1);
    assertEq(doc.startPos.y, 8, 'startPos = {1, height-2}');
    // 房间内畅通
    assertEq(doc.hWalls[roomY + 1][1].type, WT.EMPTY, '房间内 EMPTY');
});

test('blank: free 模式无边界墙（全 EMPTY）', () => {
    const doc = EditorDocument.blank(10, 10, 'free');
    for (let x = 0; x < 10; x++) {
        assertEq(doc.hWalls[0][x].type, WT.EMPTY, 'free 上边界 EMPTY');
        assertEq(doc.hWalls[10][x].type, WT.EMPTY, 'free 下边界 EMPTY');
    }
    assertEq(doc.activeCells.every(r => r.every(v => v)), true, 'free 激活格默认全 true');
});

test('load: 单层深拷贝装载（改编辑器不影响源 mapData）', () => {
    const source = makeMapData();
    const doc = EditorDocument.fromMapData(source);
    assertEq(doc.width, 10);
    assertDeepEq(doc.endPos, { x: 8, y: 1 }, 'endPos 展开复制');
    assertEq(doc.ghosts.length, 2);
    // 修改编辑器数据不影响源
    doc.hWalls[5][5] = W(WT.SOLID);
    doc.ghosts.push({ x: 9, y: 9 });
    assertEq(source.hWalls[5][5].type, WT.EMPTY, '源 hWalls 不受影响');
    assertEq(source.initialGhosts.length, 2, '源 ghosts 不受影响');
});

test('load: 多层装载 currentLayer 取 customStartPos 层扫描（无 v1 playerStartLayer 回退）', () => {
    const layers = [
        { hWalls: [], vWalls: [], activeCells: [], ghosts: [{ x: 0, y: 0 }], items: [], buttons: [],
          endPos: null, customStartPos: null },
        { hWalls: [], vWalls: [], activeCells: [], ghosts: [], items: [], buttons: [],
          endPos: { x: 1, y: 1 }, customStartPos: { x: 2, y: 2 } },
    ];
    // 扫描到 layer 1 有 customStartPos → currentLayer = 1（playerStartLayer 残留字段已忽略）
    const doc1 = EditorDocument.fromMapData(makeMapData({
        multiLayerMode: true, layerCount: 2, layers, playerStartLayer: 1
    }));
    assertEq(doc1.currentLayer, 1, 'customStartPos 扫描层索引');
    assertEq(doc1.playerLayer, 1);
    assertDeepEq(doc1.customStartPos, { x: 2, y: 2 }, 'customStartPos 从层数据装载');
    // 无 playerStartLayer：同样扫描层内 customStartPos（行为一致）
    const doc2 = EditorDocument.fromMapData(makeMapData({
        multiLayerMode: true, layerCount: 2, layers, playerStartLayer: undefined
    }));
    assertEq(doc2.currentLayer, 1, 'customStartPos 扫描层索引');
    // 各层均无 customStartPos → 回退第 0 层
    const doc3 = EditorDocument.fromMapData(makeMapData({
        multiLayerMode: true, layerCount: 2, layers: [
            { hWalls: [], vWalls: [], activeCells: [], ghosts: [], items: [], buttons: [], endPos: null, customStartPos: null },
            { hWalls: [], vWalls: [], activeCells: [], ghosts: [], items: [], buttons: [], endPos: null, customStartPos: null },
        ]
    }));
    assertEq(doc3.currentLayer, 0, '无 customStartPos 时回退到第 0 层');
});

test('load: activeCells 缺失时默认全 true', () => {
    const m = makeMapData({ activeCells: undefined });
    const doc = EditorDocument.fromMapData(m);
    assertEq(doc.activeCells.length, 10);
    assertEq(doc.activeCells[9][9], true, '默认全 true');
});

test('load: 随机生成地图完整保留（进编辑器不丢墙/实体/终点）', () => {
    // 回归锁：main.js startGame 赋值 this.mapData 后，enterEditorMode 用 fromMapData 装载
    // 当前地图——必须逐墙逐实体保留，只允许初始房间外的要素「原样进入编辑器」。
    const mapData = generateFullMaze(10, 10, 3);
    const doc = EditorDocument.fromMapData(mapData);
    assertEq(doc.width, 10); assertEq(doc.height, 10);
    assertEq(doc.mode, 'regular'); assertEq(doc.multiLayerMode, false);
    for (let y = 0; y <= 10; y++) {
        for (let x = 0; x < 10; x++) {
            assertEq(doc.hWalls[y][x].type, mapData.hWalls[y][x].type, `hWalls[${y}][${x}] 保留`);
        }
    }
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x <= 10; x++) {
            assertEq(doc.vWalls[y][x].type, mapData.vWalls[y][x].type, `vWalls[${y}][${x}] 保留`);
        }
    }
    assertDeepEq(doc.endPos, mapData.endPos, '终点保留');
    assertEq(doc.ghosts.length, mapData.initialGhosts.length, '鬼保留');
    assertEq(doc.items.length, mapData.items.length, '钥匙保留');
});

test('toMapData: initialGhosts 补 id + layers/stairs 深拷贝', () => {
    const doc = EditorDocument.fromMapData(makeMapData());
    doc.stairs = [{ x: 1, y: 1, layer: 0, direction: 'up' }];
    const out = doc.toMapData();
    assertEq(out.layers[0].ghosts[0].id, 0, '鬼补 id');
    assertEq(out.layers[0].ghosts[1].id, 1);
    assertEq(out.editorMode, 'regular');
    // 修改导出结果不影响 doc（layers/stairs 深拷贝）
    out.stairs.push({ x: 9, y: 9, layer: 0, direction: 'down' });
    assertEq(doc.stairs.length, 1, 'stairs 深拷贝');
    out.layers.push({});
    assertEq(doc.layers.length, 1, 'layers 深拷贝');
});

test('toShareMapData: 多层用 layers[0] 作为 layer0Data（不导出 startPos/playerStartLayer）', () => {
    const layers = [
        { hWalls: [[W(WT.EMPTY)]], vWalls: [[W(WT.EMPTY)]], activeCells: [[true]], ghosts: [], items: [],
          buttons: [], endPos: { x: 0, y: 0 }, customStartPos: null },
    ];
    const doc = EditorDocument.fromMapData(makeMapData({
        multiLayerMode: true, layerCount: 1, layers, playerStartLayer: 0
    }));
    doc.playerLayer = 0;
    const out = doc.toShareMapData('death-loop', 5, 100);
    assertEq(out.gameMode, 'death-loop');
    assertEq(out.initialHealth, 5);
    assertEq(out.initialStamina, undefined);
    assertEq(out.playerStartLayer, undefined, 'v1 残留字段不再导出');
    assertEq(out.startPos, undefined, 'startPos 不再导出（出生点由 customStartPos/顶层 startPos 推导）');
    assertDeepEq(out.layers[0].endPos, { x: 0, y: 0 }, 'layer0Data 取 layers[0]');
});

// ---------- 图层 ----------

test('saveCurrentLayer + switchLayer: 层间切换数据保持（同引用）', () => {
    const doc = EditorDocument.blank(10, 10, 'regular', true);
    doc.saveCurrentLayer();
    // 层 0 放一堵墙
    doc.hWalls[3][3] = W(WT.SOLID);
    doc.ghosts.push({ x: 5, y: 5 });
    doc.saveCurrentLayer();
    assertEq(doc.layers[0].hWalls[3][3].type, WT.SOLID, '层 0 墙已保存');
    assertEq(doc.layers[0].ghosts.length, 1, '层 0 鬼已保存');
    // 切换层 0 → 新建层 1 → 切换回层 0
    doc.addLayer();
    assertEq(doc.layerCount, 2);
    doc.switchLayer(1);
    assertEq(doc.currentLayer, 1);
    assertEq(doc.ghosts.length, 0, '新层无鬼');
    doc.switchLayer(0);
    assertEq(doc.hWalls[3][3].type, WT.SOLID, '切回层 0 墙还在');
    assertEq(doc.ghosts.length, 1, '切回层 0 鬼还在');
});

test('addLayer: 最多 10 层', () => {
    const doc = EditorDocument.blank(10, 10, 'regular', true);
    for (let i = 0; i < 9; i++) assertEq(doc.addLayer(), true, `第 ${i + 2} 层添加`);
    assertEq(doc.layerCount, 10);
    assertEq(doc.addLayer(), false, '第 11 层被拒');
    assertEq(doc.layerCount, 10);
});

test('removeLayer: 底层不可删 + 顶层删除强制切换 + 楼梯清理', () => {
    const doc = EditorDocument.blank(10, 10, 'regular', true);
    doc.addLayer();
    doc.addLayer();
    doc.switchLayer(1);
    doc.placeStair(1, 1, 'up'); // 层1 up → 层2 down 配对
    assertEq(doc.stairs.length, 2, '配对楼梯');
    // 删除顶层（层 3），当前层 1 不受影响
    const r1 = doc.removeLayer();
    assertEq(r1.ok, true);
    assertEq(r1.switched, false, '当前层未越界不切换');
    assertEq(doc.layerCount, 2);
    // 删除层3（配对楼梯的宿主层）后：层2 的 up 指向已删的层3、层3 的 down 本身在被删层 → 全部清理
    assertEq(doc.stairs.length, 0, '指向被删层的楼梯全部清理');
    // 删除顶层（层 2），当前层 1 → 强制切到层 1（现为顶层）
    const r2 = doc.removeLayer();
    assertEq(r2.ok, true);
    assertEq(r2.switched, true, '当前层越界强制切换');
    assertEq(doc.currentLayer, 0);
    assertEq(doc.layerCount, 1);
    assertEq(doc.stairs.length, 0, '配对楼梯随层删除被清理');
    // 底层不可删
    const r3 = doc.removeLayer();
    assertEq(r3.ok, false, '初始层不可删除');
    assertEq(r3.message, '初始的1层不可删除！');
});

test('applyLayerMode: 单层→多层保留内容 → 切回单层取第一层', () => {
    const doc = EditorDocument.blank(10, 10, 'regular');
    doc.hWalls[4][4] = W(WT.SOLID);
    doc.endPos = { x: 7, y: 7 };
    doc.applyLayerMode(true);
    assertEq(doc.multiLayerMode, true);
    assertEq(doc.layerCount, 1);
    assertEq(doc.stairs.length, 0, '切多层清空楼梯');
    assertEq(doc.layers[0].hWalls[4][4].type, WT.SOLID, '内容进入层 0');
    assertDeepEq(doc.layers[0].endPos, { x: 7, y: 7 });
    doc.applyLayerMode(false);
    assertEq(doc.multiLayerMode, false);
    assertEq(doc.hWalls[4][4].type, WT.SOLID, '切回单层取第一层');
    assertEq(doc.layers.length, 0, '切回单层清空 layers');
});

// ---------- 编辑操作 ----------

test('toggleWall: SOLID↔EMPTY 循环 + 替换 SOLID 清按钮 + 保留 keys', () => {
    const doc = EditorDocument.blank(10, 10, 'regular');
    const wall = { x: 4, y: 4, type: 'h' };
    doc.toggleWall(wall, WT.SOLID);
    assertEq(doc.hWalls[4][4].type, WT.SOLID, '放置 SOLID');
    doc.toggleWall(wall, WT.SOLID);
    assertEq(doc.hWalls[4][4].type, WT.EMPTY, '再点变 EMPTY');
    // 按钮依附测试：SOLID 墙上挂按钮（(4,4) 上方格 (4,3) 的下边按钮 dy=1），SOLID→EMPTY 时清除
    doc.toggleWall(wall, WT.SOLID);
    doc.buttons.push({ x: 4, y: 3, direction: { dx: 0, dy: 1 }, letter: 'A' });
    doc.toggleWall(wall, WT.SOLID);
    assertEq(doc.buttons.length, 0, 'SOLID→EMPTY 清除依附按钮');
    // LOCKED 墙原地切 EMPTY 保留 keys？不——keys 字段保留（原地改 type）
    doc.hWalls[5][5] = W(WT.LOCKED, { keys: 3 });
    doc.toggleWall({ x: 5, y: 5, type: 'h' }, WT.EMPTY);
    assertEq(doc.hWalls[5][5].type, WT.EMPTY, 'LOCKED→EMPTY');
});

test('toggleActiveCell: remove 清实体 + 清四周墙 + 清起点/终点', () => {
    const doc = EditorDocument.blank(10, 10, 'regular');
    doc.endPos = { x: 3, y: 3 };
    doc.customStartPos = { x: 3, y: 3 };
    doc.ghosts.push({ x: 3, y: 3 });
    doc.items.push({ x: 3, y: 3, type: 'key' });
    doc.hWalls[3][3] = W(WT.SOLID);
    doc.toggleActiveCell(3, 3, 'remove');
    assertEq(doc.activeCells[3][3], false, '格去激活');
    assertEq(doc.ghosts.length, 0, '鬼清除');
    assertEq(doc.items.length, 0, '钥匙清除');
    assertEq(doc.endPos, null, '终点清除');
    assertEq(doc.customStartPos, null, '起点清除');
    assertEq(doc.hWalls[3][3].type, 0, '四周墙清空 (上)');
    assertEq(doc.hWalls[4][3].type, 0, '四周墙清空 (下)');
    assertEq(doc.vWalls[3][3].type, 0, '四周墙清空 (左)');
    assertEq(doc.vWalls[3][4].type, 0, '四周墙清空 (右)');
    // 再激活
    doc.toggleActiveCell(3, 3, 'add');
    assertEq(doc.activeCells[3][3], true, '格重新激活');
});

test('eraseAt: 擦墙 + 擦实体；regular 起始房间实体受保护', () => {
    const doc = EditorDocument.blank(10, 10, 'regular');
    // 内部墙 (4,4)：画布坐标 (4*40+1, 4*40+1) 靠近左/上边界 → 命中竖墙 (4,4) 或横墙 (4,4)
    doc.hWalls[4][4] = W(WT.SOLID);
    doc.ghosts.push({ x: 4, y: 4 });
    doc.eraseAt({ x: 4 * 40 + 5, y: 4 * 40 + 5 }, 40);
    assertEq(doc.hWalls[4][4].type, WT.EMPTY, '墙擦除');
    assertEq(doc.ghosts.length, 0, '实体擦除');
    // 起始房间 (1, 8)：regular 下实体受保护
    doc.ghosts.push({ x: 1, y: 8 });
    doc.eraseAt({ x: 1 * 40 + 5, y: 8 * 40 + 5 }, 40);
    assertEq(doc.ghosts.length, 1, '起始房间实体受保护');
    // free 模式无保护
    const free = EditorDocument.blank(10, 10, 'free');
    free.ghosts.push({ x: 1, y: 8 });
    free.eraseAt({ x: 1 * 40 + 5, y: 8 * 40 + 5 }, 40);
    assertEq(free.ghosts.length, 0, 'free 模式无保护');
});

test('eraseStairAt + placeStair: 配对放置与配对删除', () => {
    const doc = EditorDocument.blank(10, 10, 'regular', true);
    doc.addLayer();
    doc.switchLayer(0);
    assertEq(doc.placeStair(2, 2, 'up'), true, '合法放置');
    assertEq(doc.stairs.length, 2, '成对放置');
    assertEq(doc.stairs[0].layer, 0);
    assertEq(doc.stairs[1].layer, 1, '配对在目标层');
    assertEq(doc.placeStair(2, 2, 'up'), false, '已有楼梯不可再放');
    doc.eraseStairAt(2, 2, 0);
    assertEq(doc.stairs.length, 0, '配对一并删除');
});

test('clearEntities: 清实体 + 当前层楼梯配对清理；墙保留', () => {
    const doc = EditorDocument.blank(10, 10, 'regular', true);
    doc.addLayer();
    doc.switchLayer(0);
    doc.placeStair(2, 2, 'up');
    doc.hWalls[3][3] = W(WT.SOLID);
    doc.ghosts.push({ x: 5, y: 5 });
    doc.endPos = { x: 6, y: 6 };
    doc.clearEntities();
    assertEq(doc.ghosts.length, 0, '鬼清空');
    assertEq(doc.endPos, null, '终点清空');
    assertEq(doc.stairs.length, 0, '楼梯配对清空');
    assertEq(doc.hWalls[3][3].type, WT.SOLID, '墙保留');
});

test('clearAllGrids / resetGrids: 激活格全部去激活 / 激活', () => {
    const doc = EditorDocument.blank(10, 10, 'regular');
    doc.clearAllGrids();
    assertEq(doc.activeCells.every(r => r.every(v => v === false)), true, '全部去激活');
    doc.resetGrids();
    assertEq(doc.activeCells.every(r => r.every(v => v === true)), true, '全部激活');
});

// ---------- Step 4 写操作（inputHandler 内联逻辑收敛，行为锁定） ----------

test('setWall: 拖拽替换语义（非 toggle），h/v 墙按 type 定位', () => {
    const doc = EditorDocument.blank(10, 10, 'regular');
    // 横墙替换
    doc.setWall({ x: 4, y: 4, type: 'h' }, WT.SOLID);
    assertEq(doc.hWalls[4][4].type, WT.SOLID, 'h 墙变 SOLID');
    // 替换语义：同墙再拖同样类型仍为 SOLID（不翻转）
    doc.setWall({ x: 4, y: 4, type: 'h' }, WT.SOLID);
    assertEq(doc.hWalls[4][4].type, WT.SOLID, '替换不翻转');
    // keys 字段随替换消失（与原实现 { type } 直接赋值一致）
    assertEq(doc.hWalls[4][4].keys, undefined, '替换对象无 keys（与原实现一致）');
    // 竖墙替换 GLASS
    doc.setWall({ x: 5, y: 3, type: 'v' }, WT.GLASS);
    assertEq(doc.vWalls[3][5].type, WT.GLASS, 'v 墙变 GLASS');
    // 越界不崩溃
    doc.setWall({ x: 99, y: 99, type: 'h' }, WT.SOLID);
});

test('toggleDoor: DOOR↔EMPTY 切换 + SOLID 墙先清依附按钮', () => {
    const doc = EditorDocument.blank(10, 10, 'regular');
    const wall = { x: 4, y: 4, type: 'h' };
    doc.toggleDoor(wall);
    assertEq(doc.hWalls[4][4].type, WT.DOOR, 'EMPTY→DOOR');
    doc.toggleDoor(wall);
    assertEq(doc.hWalls[4][4].type, WT.EMPTY, 'DOOR→EMPTY');
    // SOLID 墙上挂按钮 → 放门时清除
    doc.toggleWall(wall, WT.SOLID);
    doc.buttons.push({ x: 4, y: 3, direction: { dx: 0, dy: 1 }, letter: 'A' }); // (4,3) 下边按钮
    doc.toggleDoor(wall);
    assertEq(doc.hWalls[4][4].type, WT.DOOR, 'SOLID→DOOR');
    assertEq(doc.buttons.length, 0, 'SOLID 墙放门清依附按钮');
});

test('setLocked: 数字门替换 + keys 携带 + SOLID 清按钮', () => {
    const doc = EditorDocument.blank(10, 10, 'regular');
    doc.setLocked({ x: 5, y: 5, type: 'h' }, 3);
    assertEq(doc.hWalls[5][5].type, WT.LOCKED, 'LOCKED 放置');
    assertEq(doc.hWalls[5][5].keys, 3, 'keys 携带');
    // SOLID 墙放锁清按钮
    doc.toggleWall({ x: 6, y: 6, type: 'h' }, WT.SOLID);
    doc.buttons.push({ x: 6, y: 5, direction: { dx: 0, dy: 1 }, letter: 'B' });
    doc.setLocked({ x: 6, y: 6, type: 'h' }, 1);
    assertEq(doc.hWalls[6][6].type, WT.LOCKED, 'SOLID→LOCKED');
    assertEq(doc.buttons.length, 0, 'SOLID 墙放锁清依附按钮');
});

test('toggleLetterDoor: 建门（大写 letter + closed）→ 翻转 initialState 循环', () => {
    const doc = EditorDocument.blank(10, 10, 'regular');
    const wall = { x: 4, y: 4, type: 'h' };
    doc.toggleLetterDoor(wall, 'b');
    assertEq(doc.hWalls[4][4].type, WT.LETTER_DOOR, 'LETTER_DOOR 放置');
    assertEq(doc.hWalls[4][4].letter, 'B', 'letter 大写');
    assertEq(doc.hWalls[4][4].initialState, 'closed', '初始 closed');
    doc.toggleLetterDoor(wall, 'A'); // 已是字母门 → 翻转，忽略 letter
    assertEq(doc.hWalls[4][4].initialState, 'open', '翻转 → open');
    assertEq(doc.hWalls[4][4].letter, 'B', '翻转不改 letter');
    doc.toggleLetterDoor(wall, 'A');
    assertEq(doc.hWalls[4][4].initialState, 'closed', '再翻 → closed');
    // SOLID 墙建门清按钮
    doc.toggleWall({ x: 7, y: 7, type: 'h' }, WT.SOLID);
    doc.buttons.push({ x: 7, y: 6, direction: { dx: 0, dy: 1 }, letter: 'C' });
    doc.toggleLetterDoor({ x: 7, y: 7, type: 'h' }, 'z');
    assertEq(doc.hWalls[7][7].type, WT.LETTER_DOOR, 'SOLID→LETTER_DOOR');
    assertEq(doc.buttons.length, 0, 'SOLID 墙放字母门清依附按钮');
});

test('setOneWay: 放置 + 拖拽改向 + SOLID 清按钮', () => {
    const doc = EditorDocument.blank(10, 10, 'regular');
    const wall = { x: 4, y: 4, type: 'h' };
    doc.setOneWay(wall, { dx: 0, dy: -1 });
    assertEq(doc.hWalls[4][4].type, WT.ONE_WAY, 'ONE_WAY 放置');
    assertDeepEq(doc.hWalls[4][4].direction, { dx: 0, dy: -1 }, '方向设置');
    // 拖拽改向
    doc.setOneWay(wall, { dx: 0, dy: 1 });
    assertDeepEq(doc.hWalls[4][4].direction, { dx: 0, dy: 1 }, '拖拽改向');
    // 同方向幂等
    doc.setOneWay(wall, { dx: 0, dy: 1 });
    assertDeepEq(doc.hWalls[4][4].direction, { dx: 0, dy: 1 }, '同方向不变');
    // SOLID 墙放单向门清按钮
    doc.toggleWall({ x: 6, y: 6, type: 'h' }, WT.SOLID);
    doc.buttons.push({ x: 6, y: 5, direction: { dx: 0, dy: 1 }, letter: 'D' });
    doc.setOneWay({ x: 6, y: 6, type: 'h' }, { dx: 0, dy: -1 });
    assertEq(doc.hWalls[6][6].type, WT.ONE_WAY, 'SOLID→ONE_WAY');
    assertEq(doc.buttons.length, 0, 'SOLID 墙放单向门清依附按钮');
});

test('setEnd: 空位设置 / 占用格拒绝（当前终点可重设）/ regular 起始房间拒绝', () => {
    const doc = EditorDocument.blank(10, 10, 'regular');
    assertEq(doc.setEnd(5, 5), true, '空位设置成功');
    assertDeepEq(doc.endPos, { x: 5, y: 5 }, 'endPos 设置');
    // 占用格（放鬼）拒绝
    doc.ghosts.push({ x: 6, y: 6 });
    assertEq(doc.setEnd(6, 6), false, '占用格拒绝');
    assertDeepEq(doc.endPos, { x: 5, y: 5 }, 'endPos 不变');
    // 占用格但就是当前终点 → 重设成功
    doc.ghosts.push({ x: 5, y: 5 });
    assertEq(doc.setEnd(5, 5), true, '当前终点可重设');
    assertDeepEq(doc.endPos, { x: 5, y: 5 });
    // regular 起始房间（{1,8}）拒绝
    assertEq(doc.setEnd(1, 8), false, 'regular 起始房间拒绝');
    // free 模式起始房间允许
    const free = EditorDocument.blank(10, 10, 'free');
    assertEq(free.setEnd(1, 8), true, 'free 起始房间允许');
});

test('setStart: 仅 free；占用拒绝（当前起点可重设）；多层清全层起点 + playerLayer', () => {
    // regular 模式拒绝
    const regular = EditorDocument.blank(10, 10, 'regular');
    assertEq(regular.setStart(5, 5), false, 'regular 模式拒绝');
    assertEq(regular.customStartPos, null, 'regular 无起点');
    // free 空位设置
    const free = EditorDocument.blank(10, 10, 'free');
    assertEq(free.setStart(5, 5), true, 'free 空位设置成功');
    assertDeepEq(free.customStartPos, { x: 5, y: 5 }, 'customStartPos');
    assertEq(free.playerLayer, free.currentLayer, 'playerLayer 跟随当前层');
    // 占用格拒绝
    free.ghosts.push({ x: 6, y: 6 });
    assertEq(free.setStart(6, 6), false, '占用格拒绝');
    assertDeepEq(free.customStartPos, { x: 5, y: 5 }, '起点不变');
    // 当前起点所在格可重设
    free.ghosts.push({ x: 5, y: 5 });
    assertEq(free.setStart(5, 5), true, '当前起点可重设');
    // 多层：清所有层 customStartPos + playerLayer 更新
    const multi = EditorDocument.blank(10, 10, 'free', true);
    multi.addLayer();
    multi.layers[0].customStartPos = { x: 1, y: 1 };
    multi.layers[1].customStartPos = { x: 2, y: 2 };
    multi.currentLayer = 1;
    assertEq(multi.setStart(5, 5), true, '多层设置起点');
    assertEq(multi.layers[0].customStartPos, null, '层 0 起点清除');
    assertEq(multi.layers[1].customStartPos, null, '层 1 起点清除');
    assertDeepEq(multi.customStartPos, { x: 5, y: 5 }, '当前层起点设置');
    assertEq(multi.playerLayer, 1, 'playerLayer = currentLayer');
});

test('toggleGhost: 放置/移除 + 占用拒绝 + regular 起始房间拒绝', () => {
    const doc = EditorDocument.blank(10, 10, 'regular');
    assertEq(doc.toggleGhost(5, 5), true, '空位放置');
    assertEq(doc.ghosts.length, 1, '鬼已放置');
    assertDeepEq(doc.ghosts[0], { x: 5, y: 5 }, '鬼对象 {x,y}（id 由导出补）');
    // 同格再点 → 移除
    assertEq(doc.toggleGhost(5, 5), true, '同格再点移除');
    assertEq(doc.ghosts.length, 0, '鬼已移除');
    // 占用格拒绝
    doc.endPos = { x: 6, y: 6 };
    assertEq(doc.toggleGhost(6, 6), false, '终点格拒绝');
    // regular 起始房间拒绝
    assertEq(doc.toggleGhost(1, 8), false, 'regular 起始房间拒绝');
    const free = EditorDocument.blank(10, 10, 'free');
    assertEq(free.toggleGhost(1, 8), true, 'free 起始房间允许');
});

test('toggleKey: 放置/移除 + 占用拒绝 + regular 起始房间拒绝', () => {
    const doc = EditorDocument.blank(10, 10, 'regular');
    assertEq(doc.toggleKey(5, 5), true, '空位放置');
    assertEq(doc.items.length, 1, '钥匙已放置');
    assertDeepEq(doc.items[0], { x: 5, y: 5, type: 'key' }, '钥匙对象 {x,y,type:key}');
    // 同格再点 → 移除
    assertEq(doc.toggleKey(5, 5), true, '同格再点移除');
    assertEq(doc.items.length, 0, '钥匙已移除');
    // 非 key 物品（如宝藏）不按 key 移除——用 items 直接放一个非 key 项验证 findIndex 条件
    doc.items.push({ x: 5, y: 5, type: 'treasure' });
    assertEq(doc.toggleKey(5, 5), false, '非 key 物品不触发移除且格已占用');
    assertEq(doc.items.length, 1, 'treasure 保留');
    // 占用格拒绝
    doc.endPos = { x: 6, y: 6 };
    assertEq(doc.toggleKey(6, 6), false, '终点格拒绝');
    // regular 起始房间拒绝
    assertEq(doc.toggleKey(1, 8), false, 'regular 起始房间拒绝');
    const free = EditorDocument.blank(10, 10, 'free');
    assertEq(free.toggleKey(1, 8), true, 'free 起始房间允许');
});

test('toggleButton: 新建（大写 letter）/ 同格同方向删除 / 同格异方向共存', () => {
    const doc = EditorDocument.blank(10, 10, 'regular');
    const hotspot = { x: 4, y: 4, direction: { dx: 0, dy: -1 } };
    assertEq(doc.toggleButton(hotspot, 'a'), true, '新建按钮');
    assertEq(doc.buttons.length, 1, '按钮已放');
    assertDeepEq(doc.buttons[0], { ...hotspot, letter: 'A' }, '按钮对象含大写 letter');
    // 同格同方向再点 → 删除
    assertEq(doc.toggleButton(hotspot, 'a'), true, '同热点再点删除');
    assertEq(doc.buttons.length, 0, '按钮已删');
    // 同格异方向 → 新增不删
    doc.toggleButton(hotspot, 'B');
    doc.toggleButton({ ...hotspot, direction: { dx: 0, dy: 1 } }, 'C');
    assertEq(doc.buttons.length, 2, '同格异方向共存');
    // 无热点 → 拒绝
    assertEq(doc.toggleButton(null, 'A'), false, 'null 热点拒绝');
});

// ---------- 尺寸 ----------

test('resize: 多层保持层数重建；单层退化', () => {
    const doc = EditorDocument.blank(10, 10, 'regular', true);
    doc.addLayer();
    doc.addLayer();
    doc.resize(12, true, 3);
    assertEq(doc.width, 12);
    assertEq(doc.height, 12);
    assertEq(doc.layerCount, 3, '层数保持');
    assertEq(doc.hWalls.length, 13, 'hWalls 维度重建');
    assertEq(doc.layers[0].hWalls.length, 13, '各层重建');
    assertEq(doc.layers[2].activeCells[0].length, 12);
    // 单层（wasMultiLayer=false）
    const single = EditorDocument.blank(10, 10, 'regular');
    single.resize(8, false, 1);
    assertEq(single.width, 8);
    assertEq(single.layerCount, 1);
    // 多层但只有 1 层时退化
    const deg = EditorDocument.blank(10, 10, 'regular', true);
    deg.resize(11, true, 1);
    assertEq(deg.layerCount, 1, '单层多层退化');
    assertEq(deg.layers.length, 1, 'createBlank 初始化单层');
});

// ---------- 校验 / 查询 ----------

test('hasStartPoint: regular 恒有 / free 按起点', () => {
    const regular = EditorDocument.blank(10, 10, 'regular');
    assertEq(regular.hasStartPoint(), true, 'regular 恒有起点');
    const free = EditorDocument.blank(10, 10, 'free');
    assertEq(free.hasStartPoint(), false, 'free 无起点');
    free.customStartPos = { x: 1, y: 1 };
    assertEq(free.hasStartPoint(), true, 'free 有起点');
    // 多层：层内有起点
    const multi = EditorDocument.blank(10, 10, 'free', true);
    assertEq(multi.hasStartPoint(), false, '多层无起点');
    multi.layers[0].customStartPos = { x: 1, y: 1 };
    assertEq(multi.hasStartPoint(), true, '多层层内有起点');
});

test('validate: 终点必需（regular/free 同）；free 无起点/无活动格非法', () => {
    const regular = EditorDocument.blank(10, 10, 'regular');
    const r0 = regular.validate();
    assertEq(r0.valid, false, 'regular 无终点非法');
    assertEq(r0.error, '请先设置终点');
    regular.endPos = { x: 8, y: 8 };
    assertEq(regular.validate().valid, true, 'regular 有终点合法');
    const free = EditorDocument.blank(10, 10, 'free');
    free.endPos = { x: 8, y: 8 };
    const r1 = free.validate();
    assertEq(r1.valid, false, 'free 无起点非法');
    assertEq(r1.error, '必须有且只有一个出生点');
    free.customStartPos = { x: 1, y: 1 };
    assertEq(free.validate().valid, true, 'free 有起点合法');
});

test('validate: 悬空按钮阻止游玩', () => {
    const doc = EditorDocument.blank(10, 10, 'regular');
    doc.endPos = { x: 8, y: 8 };
    doc.buttons = [{ x: 4, y: 4, direction: { dx: 0, dy: -1 }, letter: 'A' }];
    doc.hWalls[4][4] = { type: WT.EMPTY, keys: 0 };
    const result = doc.validate();
    assertEq(result.valid, false);
    assertEq(result.error, '按钮必须依附在实心墙或活动区边界上。');
});

test('查询包装: isPosInStartRoom/isWallEditable/isCellOccupied/isValidStairPlacement', () => {
    const doc = EditorDocument.blank(10, 10, 'regular');
    assertEq(doc.isPosInStartRoom(1, 8), true, '起始房间内');
    assertEq(doc.isPosInStartRoom(5, 5), false, '房间外');
    assertEq(doc.isWallEditable({ x: 5, y: 4, type: 'h' }), true, '内部墙可编辑');
    assertEq(doc.isWallEditable({ x: 0, y: 0, type: 'h' }), false, '边界墙不可编辑');
    doc.ghosts.push({ x: 3, y: 3 });
    assertEq(doc.isCellOccupied(3, 3), true, '鬼占用');
    assertEq(doc.isCellOccupied(6, 6), false, '空位');
    assertEq(doc.isValidStairPlacement(1, 1, 'up'), false, '单层无目标层');
    const multi = EditorDocument.blank(10, 10, 'regular', true);
    multi.addLayer();
    assertEq(multi.isValidStairPlacement(1, 1, 'up'), true, '多层合法放置');
});

summary('editorSession');
