/**
 * GameController 测试：游戏数据流（开局/动作/历史/复活/存档回溯/胜负回调/分享码装配）
 * 用 G1 golden 地图 + 固定动作脚本与纯 GameLogic 双跑对照，锁定行为一致。
 *
 * 注意：GameLogic.calculateNextState 对撞墙等无变化动作返回同一引用，
 * 游戏历史（与原版 processAction 一致）跳过无变化动作不推进。
 * G1 起点 {1,8} 的有效移动路径（实测）：right→{2,8} right→{3,8} down→{3,9} up→{3,8}。
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { installBrowserEnv } from './helpers/browser-env.mjs';
installBrowserEnv();

import { test, suite, summary, assert, assertEq, assertDeepEq } from './_assert.mjs';
import { GameController } from '../src/core/gameController.js';
import { MapDefinition } from '../src/core/mapDefinition.js';
import { GameLogic } from '../src/core/gameLogic.js';
import { WALL_TYPES as WT } from '../src/core/constants.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const goldenMaps = JSON.parse(readFileSync(join(__dirname, 'golden/maps.json'), 'utf-8'));
const G1 = goldenMaps['G1-demo'];

suite('gameController');

const up = { dx: 0, dy: -1 }, down = { dx: 0, dy: 1 }, right = { dx: 1, dy: 0 };
const MOVE = (d) => ({ type: 'MOVE', payload: d });
const REVIVE = { type: 'REVIVE' };
// movePlayer 是 (dx, dy) 双参签名
const step = (c, d) => c.movePlayer(d.dx, d.dy);

// G1 固定动作脚本（与 gameLogic golden 快照一致）
const G1_ACTIONS = [
    MOVE(up), MOVE(right), MOVE(right), MOVE(up), MOVE(right), MOVE(right),
    MOVE(up), MOVE(up), MOVE(right), MOVE(right), MOVE(down), MOVE(up),
    REVIVE, MOVE(up), MOVE(right), MOVE(up),
];

const makeG1Controller = (ui = {}) => {
    const c = new GameController(ui);
    c.gameMode = G1.gameMode;            // 'death-loop'
    c.initialHealth = G1.initialHealth;  // 5
    c.initialStamina = G1.initialStamina; // 100
    c.startGame(G1.canonical);
    return c;
};

// ---------- 开局 ----------

test('startGame: G1 初始化（深拷贝/历史/起点/onSync）', () => {
    let syncCount = 0;
    const c = makeG1Controller({ onSync: () => syncCount++ });
    assertEq(c.mapData.width, 10);
    assertEq(c.mapData.height, 10);
    // mapData 深拷贝：改源不影响
    const source = { ...G1.canonical };
    const before = c.mapData.hWalls[0][0];
    const c2 = new GameController();
    c2.gameMode = G1.gameMode;
    c2.startGame(source);
    source.hWalls[0][0] = { type: WT.SOLID, keys: 0 };
    assertEq(c2.mapData.hWalls[0][0].type, before.type, 'mapData 深拷贝');
    // 历史与步数
    assertEq(c.history.length, 1, '初始历史 1 步');
    assertEq(c.currentStep, 0);
    assertEq(c.currentGameState.isRevivalPoint, true, '初始态是复活点');
    // 起点（G1 regular 默认：{1, height-2}={1,8}）
    assertDeepEq({ x: c.currentGameState.player.x, y: c.currentGameState.player.y }, { x: 1, y: 8 }, '默认起点 {1,8}');
    assertEq(c.currentGameState.player.layer, 0, '玩家在 0 层');
    assertEq(c.viewLayer, 0, '视图层跟随玩家层');
    // 镜像已删（Phase 4：权威源唯一）
    assertEq(c.currentLayer, undefined, 'currentLayer 镜像已删');
    assertEq(c.player, undefined, 'player 镜像已删');
    assertEq(c.hWalls, undefined, 'hWalls 镜像已删');
    assertEq(c.ghosts, undefined, 'ghosts 镜像已删');
    assertEq(c.loopCount, undefined, 'loopCount 镜像已删');
    assertEq(c.layers, undefined, 'layers 镜像已删');
    assertEq(c.seenCells, undefined, 'seenCells 镜像已删');
    assertEq(syncCount, 1, 'startGame 触发一次 onSync');
});

// ---------- 动作推进 ----------

test('processAction: G1 动作脚本逐步推进，与纯 GameLogic 双跑一致', () => {
    const c = makeG1Controller();
    // 纯 GameLogic 对照
    const mapDef = new MapDefinition({ ...G1.canonical, gameMode: G1.gameMode, initialHealth: 5, initialStamina: 100 });
    let ref = GameLogic.createInitialState(mapDef);
    let effective = 0;
    for (const a of G1_ACTIONS) {
        const prevRef = ref;
        ref = GameLogic.calculateNextState(ref, a, mapDef);
        const r = c.processAction(a);
        if (ref === prevRef) {
            // 撞墙等无变化动作：权威返回同引用，controller 返回 null 不推进
            assertEq(r, null, '权威无变化时 controller 返回 null 不推进');
            continue;
        }
        effective++;
        assert(r, '动作应产生推进');
        assertEq(c.currentStep, c.history.length - 1, 'currentStep 同步');
        assertDeepEq({ x: c.currentGameState.player.x, y: c.currentGameState.player.y },
            { x: ref.player.x, y: ref.player.y }, '玩家位置与权威一致');
        assertEq(c.currentGameState.loopCount, ref.loopCount, 'loopCount 一致');
        assertEq(c.currentGameState.player.x, ref.player.x, '玩家位置与权威一致');
        assertEq(c.currentGameState.isDead, ref.isDead);
        assertEq(c.currentGameState.isWon, ref.isWon);
    }
    // 16 动作中有 7 个撞墙无变化（golden 快照记录），有效推进 9 步
    assertEq(effective, 9, '有效推进 9 步');
    assertEq(c.history.length, 10, '10 步历史（初始 + 9）');
    assertEq(c.currentStep, 9);
    // REVIVE 在脚本中：复活点存在于历史
    const revivalSteps = c.history.filter(s => s.isRevivalPoint);
    assertEq(revivalSteps.length, 2, '初始 + REVIVE 后共 2 个复活点');
});

test('processAction: 撞墙与未知动作均返回 null 不推进', () => {
    const c = makeG1Controller();
    // G1 起点 {1,8} 上方是 SOLID 墙 → 撞墙无变化
    const r1 = c.processAction(MOVE(up));
    assertEq(r1, null, '撞墙返回 null');
    assertEq(c.currentStep, 0, '撞墙不推进');
    const r2 = c.processAction({ type: 'UNKNOWN' });
    assertEq(r2, null, '未知动作返回 null');
    assertEq(c.currentStep, 0, '未知动作不推进');
});

// ---------- 死亡与复活 ----------

// 2×2 地图：玩家 {0,0}，鬼 {1,1}——玩家右走 {1,0} 与鬼同列直线可见，鬼追咬即死
const tinyMap = () => ({
    width: 2, height: 2, startPos: { x: 0, y: 0 },
    hWalls: [[{ type: 0, keys: 0 }], [{ type: 0, keys: 0 }], [{ type: 0, keys: 0 }]],
    vWalls: [[{ type: 0, keys: 0 }, { type: 0, keys: 0 }, { type: 0, keys: 0 }], [{ type: 0, keys: 0 }, { type: 0, keys: 0 }, { type: 0, keys: 0 }]],
    endPos: null, initialGhosts: [{ x: 1, y: 1, id: 0 }], items: [], buttons: [],
    activeCells: [[true, true], [true, true]], editorMode: 'regular', customStartPos: null,
    multiLayerMode: false, layerCount: 1, layers: [], stairs: []
});

test('死亡: onDeath 回调（death-loop 模式）', () => {
    let deathStats = null;
    const c = new GameController({ onDeath: (s) => { deathStats = s; } });
    c.gameMode = 'death-loop';
    c.startGame(tinyMap());
    step(c, right);
    assertEq(c.currentGameState.isDead, true, '走进鬼的追捕路径后死亡');
    assert(deathStats, '死亡回调触发');
    assertEq(deathStats.overlay, 'death');
    assertEq(deathStats.message, '你死了');
    assertEq(c.currentGameState.deathReason, 'ghost');
    assertEq(c.currentGameState.loopCount, 0, '死亡时未复活 loopCount 不变');
    assertEq(c.currentGameState.player.hp, 5, 'death-loop 死亡不扣血（血量无意义）');
});

test('死亡: exploration 模式血量 >0 与 =0 的分支', () => {
    let stats = [];
    const c = new GameController({ onDeath: (s) => stats.push(s) });
    c.gameMode = 'exploration';
    c.initialHealth = 2;
    c.startGame(tinyMap());
    step(c, right); // 第一次死亡 → hp 2→1 → 剩余血量 >0 → death 浮窗
    assertEq(stats.length, 1);
    assertEq(stats[0].overlay, 'death', 'hp>0 时显示死亡浮窗');
    assertEq(stats[0].message, '你死了 (剩余血量 1)');
    c.revive(); // exploration 复活保留当前血量（hp=1，不回满）
    assertEq(c.currentGameState.player.hp, 1, 'exploration 复活保留血量');
    step(c, right); // 第二次死亡 → hp→0 → game-over
    assertEq(stats.length, 2);
    assertEq(stats[1].overlay, 'game-over', 'hp=0 显示游戏结束');
});

test('REVIVE: 复活点追加历史 + loopCount 递增 + 状态重置', () => {
    const c = makeG1Controller();
    step(c, right); // 有效推进 1 步
    const stepBefore = c.currentStep; // 1
    c.processAction(REVIVE);
    assertEq(c.currentStep, stepBefore + 1, 'REVIVE 也是历史一步');
    assertEq(c.currentGameState.isRevivalPoint, true, '复活后是复活点');
    assertEq(c.currentGameState.isDead, false);
    assertEq(c.currentGameState.loopCount, 1, 'loopCount 递增');
    assertDeepEq({ x: c.currentGameState.player.x, y: c.currentGameState.player.y }, { x: 1, y: 8 }, '回到起点');
    assertEq(c.currentGameState.player.stamina, 100, '体力重置');
});

// ---------- 历史 / 存档 ----------

// G1 起点有效移动序列：right right down up（4 步，{1,8}→{2,8}→{3,8}→{3,9}→{3,8}）
const move4 = (c) => { step(c, right); step(c, right); step(c, down); step(c, up); };

test('undo: 逐步回退 + 复活点保护', () => {
    const c = makeG1Controller();
    move4(c);
    assertEq(c.currentStep, 4);
    let r = c.undo();
    assertEq(r.ok, true);
    assertEq(c.currentStep, 3);
    assertEq(c.viewLayer, c.currentGameState.player.layer, 'undo 后 viewLayer 跟随');
    // 回溯到 0 步后再 undo 被拒
    c.undo(); c.undo(); c.undo();
    r = c.undo();
    assertEq(r.ok, false, '第 0 步不可再撤销');
    // 复活点保护：REVIVE 状态本身是复活点，撤销到它之后不可跨过
    c.processAction(REVIVE);
    const stepAtRevival = c.currentStep; // 1（REVIVE 状态）
    step(c, right);
    assertEq(c.currentStep, 2);
    r = c.undo();
    assertEq(r.ok, true, '可撤回到复活点状态');
    assertEq(c.currentStep, stepAtRevival, '停在复活点状态');
    r = c.undo();
    assertEq(r.ok, false, '无法跨过复活点继续撤销');
    assertEq(r.error, '无法撤回到复活点之前');
    assertEq(c.currentStep, stepAtRevival, '被拒后步数不变');
});

test('save/rewind: 存档点创建与回溯', () => {
    const c = makeG1Controller();
    step(c, right); step(c, right);
    const r1 = c.save();
    assertEq(r1.ok, true);
    assertEq(r1.step, 2);
    // 连续存档被拒
    const r2 = c.save();
    assertEq(r2.ok, false, '未移动不可重复存档');
    step(c, down);
    const r3 = c.save();
    assertEq(r3.ok, true);
    assertEq(r3.step, 3);
    // 回溯到最近更早存档点（步 3 前的最大存档 = 步 2）
    const rw = c.rewind();
    assertEq(rw.ok, true);
    assertEq(rw.step, 2);
    assertEq(c.currentStep, 2);
    // 无更早存档点时被拒（步 2 是唯一更早的）
    const rw2 = c.rewind();
    assertEq(rw2.ok, false, '没有更早的存档点');
});

test('历史裁剪: undo 后新动作剪枝未来 + 存档点过滤', () => {
    const c = makeG1Controller();
    move4(c);
    c.save();          // 存档点步 4
    step(c, right); step(c, right); // 步 6
    assertEq(c.currentStep, 6);
    c.undo(); c.undo(); // 回到步 4
    assertEq(c.currentStep, 4);
    // 新动作 → 未来历史裁剪（步 5、6 消失）
    step(c, down);
    assertEq(c.history.length, 6, '历史裁剪到 5 步 + 新 1 步');
    assertEq(c.currentStep, 5);
    // 存档点步 4 仍保留，检查点不越界
    assertEq(c.checkpoints.length, 1);
    assertEq(c.checkpoints[0], 4);
});

// ---------- 分享码 ----------

test('buildShareSourceData: 游戏态分享码装配', () => {
    const c = makeG1Controller();
    const src = c.buildShareSourceData();
    assert(src, '有地图数据');
    assertEq(src.gameMode, 'death-loop');
    assertEq(src.initialHealth, 5);
    assertEq(src.initialStamina, 100);
    assertEq(src.playerStartLayer, undefined, 'v1 残留字段不再装配');
    assertEq(src.width, 10);
    assertEq(src.editorMode, 'free');
    assertDeepEq(src.customStartPos, { x: 1, y: 8 }, 'free 模式出生点随图');
});

test('loadFromShareCode: G1 分享码解码往返', () => {
    const c = makeG1Controller();
    const result = c.loadFromShareCode(G1.code);
    assertEq(result.success, true, 'G1 码可解码');
    assertEq(result.data.mapData.width, 10);
    assertEq(result.data.gameMode, 'death-loop');
    assertEq(result.data.initialHealth, 5);
    assertEq(result.data.initialStamina, 100);
    assertDeepEq(result.data.mapData.endPos, G1.canonical.endPos, '终点一致');
    // 损坏码干净失败
    const bad = c.loadFromShareCode('AAAA');
    assertEq(bad.success, false, '损坏码失败');
    assert(bad.error, '有错误信息');
});

summary('gameController');
