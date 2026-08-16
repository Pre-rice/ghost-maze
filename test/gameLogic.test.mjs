/**
 * GameLogic 行为回归测试
 *  1. G1 行为快照：对 G1 canonical 重跑固定动作脚本，每步状态与 golden/logic.json 深等
 *  2. 关键规则锁定（小地图手写场景）：
 *     门通行（LOCKED 钥匙/DOOR/GLASS/SOLID/ONE_WAY/LETTER_DOOR）、按钮开门、
 *     拾取、鬼 AI（直线视线/追捕/失目标 1 步/DOOR 挡视线/GLASS 不挡视线）、
 *     先判胜（踩终点同回合鬼咬无效）、USE_STAIR 换层、REVIVE 重置
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { test, suite, summary, assert, assertEq, assertDeepEq } from './_assert.mjs';
import { MapDefinition } from '../src/mapDefinition.js';
import { GameLogic } from '../src/gameLogic.js';
import { WALL_TYPES as WT } from '../src/constants.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

suite('gameLogic');

// ==================== 小地图构造助手 ====================

const W = (type, extra = {}) => ({ type, keys: 0, ...extra });
const row = (n, f) => Array.from({ length: n }, (_, i) => f(i));
const emptyRow = (n) => row(n, () => W(WT.EMPTY));

// 构造 MapDefinition：只需给出关键墙/实体，其余全 EMPTY
// 注意：小地图必须显式 startPos——MapDefinition 默认起点是 {1, height-2}，height=1 时会出界
const makeDef = (data) => new MapDefinition({
    width: data.width, height: data.height,
    startPos: data.startPos || { x: 0, y: 0 },
    hWalls: data.hWalls || row(data.height + 1, () => emptyRow(data.width)),
    vWalls: data.vWalls || row(data.height, () => emptyRow(data.width + 1)),
    endPos: data.endPos || null,
    initialGhosts: data.ghosts || [],
    items: data.items || [],
    buttons: data.buttons || [],
    stairs: data.stairs || [],
    layers: data.layers,
    multiLayerMode: !!data.layers,
    layerCount: data.layers ? data.layers.length : 1,
    editorMode: 'regular',
    gameMode: data.gameMode || 'death-loop',
    initialHealth: 5,
    initialStamina: 100,
});

const up = { dx: 0, dy: -1 }, down = { dx: 0, dy: 1 }, left = { dx: -1, dy: 0 }, right = { dx: 1, dy: 0 };
const MOVE = (d) => ({ type: 'MOVE', payload: d });
const REVIVE = { type: 'REVIVE' };

const play = (mapDef, actions) => {
    let s = GameLogic.createInitialState(mapDef);
    const states = [s];
    for (const a of actions) {
        s = GameLogic.calculateNextState(s, a, mapDef);
        states.push(s);
    }
    return states;
};

// ==================== 1. G1 行为快照 ====================

test('G1 行为快照：17 步全等 golden（机制变更必须先更新快照）', () => {
    const goldenMaps = JSON.parse(readFileSync(join(__dirname, 'golden/maps.json'), 'utf-8'));
    const goldenLogic = JSON.parse(readFileSync(join(__dirname, 'golden/logic.json'), 'utf-8'));
    const canonical = goldenMaps['G1-demo'].canonical;
    const mapDef = new MapDefinition({ ...canonical, gameMode: 'death-loop', initialHealth: 5, initialStamina: 100 });

    const ACTIONS = [
        MOVE(up), MOVE(right), MOVE(right), MOVE(up), MOVE(right), MOVE(right),
        MOVE(up), MOVE(up), MOVE(right), MOVE(right), MOVE(down), MOVE(up),
        REVIVE, MOVE(up), MOVE(right), MOVE(up),
    ];
    let state = GameLogic.createInitialState(mapDef);
    const steps = [state];
    for (const a of ACTIONS) { state = GameLogic.calculateNextState(state, a, mapDef); steps.push(state); }

    const snapshot = (s) => ({
        p: {
            x: s.player.x, y: s.player.y, layer: s.player.layer,
            hp: s.player.hp, stamina: s.player.stamina, keys: s.player.keys,
            steps: s.player.steps, trailLen: s.player.trail.length
        },
        loopCount: s.loopCount, isDead: s.isDead, isWon: s.isWon,
        deathReason: s.deathReason, isRevivalPoint: s.isRevivalPoint,
        ghosts: s.layerStates.map(ls => ls.ghosts.map(g => ({ x: g.x, y: g.y }))),
        seen: s.seenCells.map(rows => rows.map(r => r.filter(Boolean).length)),
        itemsLeft: s.layerStates.map(ls => ls.items.length),
        doorStates: s.layerStates.map(ls => ({
            h: ls.wallStates.h.map(r => r.map((w, x) => (w.type === 3 || w.type === 6) ? { x, type: w.type, currentState: w.currentState, keys: w.keys } : null).filter(Boolean)),
            v: ls.wallStates.v.map(r => r.map((w, x) => (w.type === 3 || w.type === 6) ? { x, type: w.type, currentState: w.currentState, keys: w.keys } : null).filter(Boolean))
        })),
    });

    const actual = steps.map(snapshot);
    assertEq(actual.length, goldenLogic.length, '步数必须一致');
    for (let i = 0; i < actual.length; i++) {
        assertDeepEq(actual[i], goldenLogic[i], `第 ${i} 步快照`);
    }
});

// ==================== 2. 关键规则 ====================

test('LOCKED 门: 钥匙不足撞门失败，钥匙足够通过且不消耗', () => {
    // 1×3 走廊：玩家 {0,0}，钥匙 {1,0}，LOCKED vWalls[0][2] keys:1（{2,0} 左侧）
    const noKeyMap = makeDef({ width: 3, height: 1, vWalls: [[W(WT.EMPTY), W(WT.EMPTY), W(WT.LOCKED, { keys: 1 }), W(WT.EMPTY)]] });
    const sStep1 = GameLogic.calculateNextState(GameLogic.createInitialState(noKeyMap), MOVE(right), noKeyMap);
    assertDeepEq({ x: sStep1.player.x, y: sStep1.player.y }, { x: 1, y: 0 }, '第一步正常走到门前');
    const sNoKey = GameLogic.calculateNextState(sStep1, MOVE(right), noKeyMap);
    assertDeepEq({ x: sNoKey.player.x, y: sNoKey.player.y }, { x: 1, y: 0 }, '无钥匙撞门失败（位置不变）');
    assertEq(sNoKey.player.steps, 1, '撞门失败不计数');

    // 有钥匙：捡钥匙 → 过门
    const mapDef = makeDef({
        width: 3, height: 1,
        vWalls: [[W(WT.EMPTY), W(WT.EMPTY), W(WT.LOCKED, { keys: 1 }), W(WT.EMPTY)]],
        items: [{ x: 1, y: 0 }],
    });
    const s0 = GameLogic.createInitialState(mapDef);
    const s1 = GameLogic.calculateNextState(s0, MOVE(right), mapDef);
    assertEq(s1.player.keys, 1, '拾取钥匙');
    const s2 = GameLogic.calculateNextState(s1, MOVE(right), mapDef);
    assertDeepEq({ x: s2.player.x, y: s2.player.y }, { x: 2, y: 0 }, '钥匙足够通过');
    assertEq(s2.player.keys, 1, '过 LOCKED 不消耗钥匙');
    assertEq(s2.layerStates[0].wallStates.v[0][2].type, WT.EMPTY, 'LOCKED 门已开启（墙置空）');
});

test('DOOR: 玩家可穿门断视线（见「甩鬼」），鬼不可穿 DOOR', () => {
    // 3 格走廊：玩家 {1,0}，鬼 {2,0}，DOOR v[0][2]（{1,0} 与 {2,0} 之间）
    // 玩家向左后鬼仍能看到玩家，但追捕路径被 DOOR 挡住 → 鬼原地不动
    const mapDef = makeDef({
        width: 3, height: 1,
        startPos: { x: 1, y: 0 },
        vWalls: [[W(WT.EMPTY), W(WT.EMPTY), W(WT.DOOR), W(WT.EMPTY)]],
        ghosts: [{ x: 2, y: 0 }],
    });
    const s1 = GameLogic.calculateNextState(GameLogic.createInitialState(mapDef), MOVE(left), mapDef);
    assertDeepEq({ x: s1.player.x, y: s1.player.y }, { x: 0, y: 0 }, '玩家穿门侧无障碍');
    assertDeepEq({ x: s1.layerStates[0].ghosts[0].x, y: s1.layerStates[0].ghosts[0].y }, { x: 2, y: 0 }, '鬼不可穿 DOOR（追捕路径被挡）');
    assert(!s1.isDead, '鬼被 DOOR 挡住，玩家安全');
});

test('SOLID/GLASS: 双方不可穿', () => {
    const mapDef = makeDef({
        width: 3, height: 1,
        vWalls: [[W(WT.EMPTY), W(WT.SOLID), W(WT.EMPTY), W(WT.EMPTY)]],
        ghosts: [{ x: 2, y: 0 }],
    });
    const s = GameLogic.calculateNextState(GameLogic.createInitialState(mapDef), MOVE(right), mapDef);
    assertDeepEq({ x: s.player.x, y: s.player.y }, { x: 0, y: 0 }, 'SOLID 不可穿');
    assertEq(s.player.steps, 0, '移动失败不计数');
});

test('先判胜: 踩终点同回合即使鬼咬也判胜', () => {
    // 玩家 {0,0}，终点 {1,0}，鬼 {1,1}（同列无墙，视线清晰）
    const mapDef = makeDef({
        width: 2, height: 2,
        endPos: { x: 1, y: 0 },
        ghosts: [{ x: 1, y: 1 }],
    });
    const s = GameLogic.calculateNextState(GameLogic.createInitialState(mapDef), MOVE(right), mapDef);
    assertEq(s.isWon, true, '先判胜：踩终点即胜');
    assertEq(s.isDead, false, '同回合鬼咬无效（isWon/isDead 不得并存）');
});

test('鬼 1:1 追尾必咬: 撞进鬼格即死', () => {
    // 2 格走廊，玩家 {1,0}，鬼 {0,0} 相邻，玩家向左移进鬼格
    const mapDef = makeDef({
        width: 2, height: 1,
        startPos: { x: 1, y: 0 },
        ghosts: [{ x: 0, y: 0 }],
    });
    const s = GameLogic.calculateNextState(GameLogic.createInitialState(mapDef), MOVE(left), mapDef);
    assertEq(s.isDead, true, '撞进鬼格被咬死');
    assertEq(s.deathReason, 'ghost', '死亡原因 = ghost');
});

test('甩鬼: 穿 DOOR 断视线后鬼只朝上一位置走 1 步', () => {
    // 3 格走廊：玩家 {1,0}，鬼 {2,0}，DOOR v[0][1]（{0,0} 与 {1,0} 之间）
    // 玩家向左穿门到 {0,0}：鬼视线被 DOOR 挡 → 失去目标 → 朝玩家上一位置走 1 步
    const mapDef = makeDef({
        width: 3, height: 1,
        startPos: { x: 1, y: 0 },
        vWalls: [[W(WT.EMPTY), W(WT.DOOR), W(WT.EMPTY), W(WT.EMPTY)]],
        ghosts: [{ x: 2, y: 0 }],
    });
    const s = GameLogic.calculateNextState(GameLogic.createInitialState(mapDef), MOVE(left), mapDef);
    assertDeepEq({ x: s.player.x, y: s.player.y }, { x: 0, y: 0 }, '玩家穿门成功');
    assert(!s.isDead, '穿门断视线，未被咬');
    assertDeepEq({ x: s.layerStates[0].ghosts[0].x, y: s.layerStates[0].ghosts[0].y }, { x: 1, y: 0 }, '鬼朝玩家上一位置走 1 步');
});

test('DOOR 挡鬼视线: 视线被挡则鬼完全不动', () => {
    // 1 列 3 行，DOOR h[2][0]（{0,1} 与 {0,2} 之间）；玩家 {0,1}，鬼 {0,2}
    // 玩家向上到 {0,0}，鬼全程被 DOOR 挡视线 → 不动
    const mapDef = makeDef({
        width: 1, height: 3,
        startPos: { x: 0, y: 1 },
        hWalls: [[W(WT.EMPTY)], [W(WT.EMPTY)], [W(WT.DOOR)], [W(WT.EMPTY)]],
        ghosts: [{ x: 0, y: 2 }],
    });
    const s = GameLogic.calculateNextState(GameLogic.createInitialState(mapDef), MOVE(up), mapDef);
    assertDeepEq({ x: s.player.x, y: s.player.y }, { x: 0, y: 0 }, '玩家向上成功');
    assertDeepEq({ x: s.layerStates[0].ghosts[0].x, y: s.layerStates[0].ghosts[0].y }, { x: 0, y: 2 }, 'DOOR 挡视线，鬼不动');
});

test('GLASS 不挡视线（_canGhostSeePlayer 直接断言，对照 DOOR）', () => {
    // 1 列 3 行：GLASS 在 {0,0} 与 {0,1} 之间（h[1][0]），鬼 {0,2} 看 {0,0}
    const glassMap = makeDef({
        width: 1, height: 3,
        hWalls: [[W(WT.EMPTY)], [W(WT.GLASS)], [W(WT.EMPTY)], [W(WT.EMPTY)]],
        ghosts: [{ x: 0, y: 2 }],
    });
    const glassState = GameLogic.createInitialState(glassMap);
    assertEq(
        GameLogic._canGhostSeePlayer({ x: 0, y: 2 }, { x: 0, y: 0 }, glassMap.layers[0], glassState.layerStates[0]),
        true, 'GLASS 不挡鬼视线');

    // 对照：DOOR 挡视线
    const doorMap = makeDef({
        width: 1, height: 3,
        hWalls: [[W(WT.EMPTY)], [W(WT.DOOR)], [W(WT.EMPTY)], [W(WT.EMPTY)]],
        ghosts: [{ x: 0, y: 2 }],
    });
    const doorState = GameLogic.createInitialState(doorMap);
    assertEq(
        GameLogic._canGhostSeePlayer({ x: 0, y: 2 }, { x: 0, y: 0 }, doorMap.layers[0], doorState.layerStates[0]),
        false, 'DOOR 挡鬼视线');
});

test('按钮开门: PRESS_BUTTON 打开字母门（再按关闭 = toggle 语义）', () => {
    // 1×3 走廊：LETTER_DOOR vWalls[0][1]（closed），按钮 {0,0} 朝右
    const mapDef = makeDef({
        width: 3, height: 1,
        vWalls: [[W(WT.EMPTY), W(WT.LETTER_DOOR, { letter: 'A', initialState: 'closed' }), W(WT.EMPTY), W(WT.EMPTY)]],
        buttons: [{ x: 0, y: 0, direction: right, letter: 'A' }],
    });
    const s1 = GameLogic.calculateNextState(GameLogic.createInitialState(mapDef), { type: 'PRESS_BUTTON', payload: { letter: 'A' } }, mapDef);
    assertEq(s1.layerStates[0].wallStates.v[0][1].currentState, 'open', '按钮后门开');
    const s2 = GameLogic.calculateNextState(s1, { type: 'PRESS_BUTTON', payload: { letter: 'A' } }, mapDef);
    assertEq(s2.layerStates[0].wallStates.v[0][1].currentState, 'closed', '再按关闭（toggle）');
});

test('按钮自动触发: 朝按钮方向移动等同按按钮', () => {
    const mapDef = makeDef({
        width: 3, height: 1,
        vWalls: [[W(WT.EMPTY), W(WT.LETTER_DOOR, { letter: 'B', initialState: 'closed' }), W(WT.EMPTY), W(WT.EMPTY)]],
        buttons: [{ x: 0, y: 0, direction: right, letter: 'B' }],
    });
    const s = GameLogic.calculateNextState(GameLogic.createInitialState(mapDef), MOVE(right), mapDef);
    assertEq(s.layerStates[0].wallStates.v[0][1].currentState, 'open', '朝按钮方向移动触发开门');
});

test('USE_STAIR: 多层换层', () => {
    // 2 层 2×1：第 0 层楼梯 {1,0} up → 第 1 层 {1,0} down
    const mapDef = makeDef({
        width: 2, height: 1,
        hWalls: [emptyRow(2), emptyRow(2)],
        stairs: [{ x: 1, y: 0, layer: 0, direction: 'up' }, { x: 1, y: 0, layer: 1, direction: 'down' }],
        layers: [
            { hWalls: [emptyRow(2), emptyRow(2)], vWalls: [emptyRow(3)], activeCells: [[true, true]], ghosts: [], items: [], buttons: [], stairs: [{ x: 1, y: 0, layer: 0, direction: 'up' }], endPos: null, customStartPos: null },
            { hWalls: [emptyRow(2), emptyRow(2)], vWalls: [emptyRow(3)], activeCells: [[true, true]], ghosts: [], items: [], buttons: [], stairs: [{ x: 1, y: 0, layer: 1, direction: 'down' }], endPos: null, customStartPos: null },
        ],
    });
    const s0 = GameLogic.createInitialState(mapDef);
    assertEq(s0.player.layer, 0, '初始在第 0 层');
    const s1 = GameLogic.calculateNextState(s0, MOVE(right), mapDef); // 走到 {1,0} 楼梯
    const s2 = GameLogic.calculateNextState(s1, { type: 'USE_STAIR' }, mapDef);
    assertEq(s2.player.layer, 1, '使用楼梯后换层');
    assertDeepEq({ x: s2.player.x, y: s2.player.y }, { x: 1, y: 0 }, '楼梯位置不变');
});

test('REVIVE: 死亡后复活回存档点并重置', () => {
    const mapDef = makeDef({
        width: 2, height: 1,
        startPos: { x: 1, y: 0 },
        ghosts: [{ x: 0, y: 0 }],
    });
    const s1 = GameLogic.calculateNextState(GameLogic.createInitialState(mapDef), MOVE(left), mapDef);
    assertEq(s1.isDead, true, '先被咬死');
    const s2 = GameLogic.calculateNextState(s1, REVIVE, mapDef);
    assertEq(s2.isDead, false, '复活后未死');
    assertEq(s2.loopCount, 1, '循环次数 +1');
    assertEq(s2.player.hp, 5, '血量重置');
    assertEq(s2.player.stamina, 100, '体力重置');
    assertDeepEq({ x: s2.player.x, y: s2.player.y }, { x: 1, y: 0 }, '回到玩家出生点（playerStart）');
});

summary('gameLogic');
