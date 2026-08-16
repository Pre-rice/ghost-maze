/**
 * 一次性 golden 采集脚本（不入测试流程）：
 *   对 G1 canonical（demo-夹缝求生）跑固定动作脚本，固化每步关键状态字段
 *   → test/golden/logic.json。gameLogic 行为回归快照以此为黄金标准。
 * 运行：node test/helpers/gen-logic-golden.mjs
 * 注意：任何「有意」的行为改动（经用户把关）都要重跑本脚本更新快照。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { MapDefinition } from '../../src/core/mapDefinition.js';
import { GameLogic } from '../../src/core/gameLogic.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const goldenMaps = JSON.parse(readFileSync(join(__dirname, '../golden/maps.json'), 'utf-8'));
const canonical = goldenMaps['G1-demo'].canonical;

// 游戏端装配：gameMode/initialHealth/initialStamina 补全（与 gen-golden.mjs 一致）
const source = { ...canonical, gameMode: 'death-loop', initialHealth: 5, initialStamina: 100 };
const mapDef = new MapDefinition(source);
let state = GameLogic.createInitialState(mapDef);

// 固定动作脚本：从 {1,8} 出发向上（鬼在 {1,7} 正上方，路径天然覆盖死亡/复活/拾取/门交互分支）
const ACTIONS = [
    { type: 'MOVE', payload: { dx: 0, dy: -1 } },   // 1. 向上（撞鬼?）
    { type: 'MOVE', payload: { dx: 1, dy: 0 } },    // 2. 向右
    { type: 'MOVE', payload: { dx: 1, dy: 0 } },    // 3. 向右（拾钥匙 {3,8}?）
    { type: 'MOVE', payload: { dx: 0, dy: -1 } },   // 4. 向上
    { type: 'MOVE', payload: { dx: 1, dy: 0 } },    // 5. 向右
    { type: 'MOVE', payload: { dx: 1, dy: 0 } },    // 6. 向右
    { type: 'MOVE', payload: { dx: 0, dy: -1 } },   // 7. 向上
    { type: 'MOVE', payload: { dx: 0, dy: -1 } },   // 8. 向上
    { type: 'MOVE', payload: { dx: 1, dy: 0 } },    // 9. 向右
    { type: 'MOVE', payload: { dx: 1, dy: 0 } },    // 10. 向右
    { type: 'MOVE', payload: { dx: 0, dy: 1 } },    // 11. 向下
    { type: 'MOVE', payload: { dx: 0, dy: -1 } },   // 12. 向上
    { type: 'REVIVE' },                              // 13. 复活（若死亡）
    { type: 'MOVE', payload: { dx: 0, dy: -1 } },   // 14. 向上
    { type: 'MOVE', payload: { dx: 1, dy: 0 } },    // 15. 向右
    { type: 'MOVE', payload: { dx: 0, dy: -1 } },   // 16. 向上（逼近终点 {4,1}）
];

// 每步快照：只记录确定性字段（trail 的 timestamp 是 Date.now()，只记长度）
const snapshot = () => ({
    p: {
        x: state.player.x, y: state.player.y, layer: state.player.layer,
        hp: state.player.hp, stamina: state.player.stamina, keys: state.player.keys,
        steps: state.player.steps, trailLen: state.player.trail.length
    },
    loopCount: state.loopCount,
    isDead: state.isDead, isWon: state.isWon, deathReason: state.deathReason,
    isRevivalPoint: state.isRevivalPoint,
    ghosts: state.layerStates.map(ls => ls.ghosts.map(g => ({ x: g.x, y: g.y }))),
    seen: state.seenCells.map(rows => rows.map(row => row.filter(Boolean).length)),
    itemsLeft: state.layerStates.map(ls => ls.items.length),
    // 动态墙体状态摘要（只锁 LOCKED(3)/LETTER_DOOR(6)——其余类型的 currentState 恒定，无信息量）
    doorStates: state.layerStates.map(ls => ({
        h: ls.wallStates.h.map(row => row.map((w, x) => (w.type === 3 || w.type === 6) ? { x, type: w.type, currentState: w.currentState, keys: w.keys } : null).filter(Boolean)),
        v: ls.wallStates.v.map(row => row.map((w, x) => (w.type === 3 || w.type === 6) ? { x, type: w.type, currentState: w.currentState, keys: w.keys } : null).filter(Boolean))
    })),
});

const steps = [snapshot()];
for (const action of ACTIONS) {
    state = GameLogic.calculateNextState(state, action, mapDef);
    steps.push(snapshot());
}

writeFileSync(join(__dirname, '../golden/logic.json'), JSON.stringify(steps, null, 2));
console.log(`logic golden 已写入 test/golden/logic.json（${steps.length} 步快照，动作 ${ACTIONS.length} 步）`);
