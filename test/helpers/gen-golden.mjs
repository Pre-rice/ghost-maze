/**
 * 一次性 golden 采集脚本（不入测试流程）：
 *   从 ghost-maze-ai 的 demo-map.json 生成 G1 的 v2 分享码，并记录 v1 码长（防膨胀基线）。
 * 运行：node test/helpers/gen-golden.mjs
 * 说明：仅只读运行 ghost-maze-ai 的 demo 地图数据（路径写死，本机项目布局），不修改该仓库。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { installBrowserEnv } from './browser-env.mjs';
installBrowserEnv();

const { DataSerializer } = await import('../../src/core/dataSerializer.js');
const { DataSerializer: V1 } = await import('../../src/dataSerializer.js');

const demoPath = 'e:/编程/ghost-maze-ai/examples/demo-map.json';
const demo = JSON.parse(readFileSync(demoPath, 'utf-8'));

// 模拟游戏端装配：补上 gameMode/initialHealth/initialStamina（demo-map.json 缺 initialHealth）
const sourceData = {
    ...demo.mapData,
    gameMode: demo.mapData.gameMode || 'death-loop',
    initialHealth: demo.mapData.initialHealth ?? 5,
    initialStamina: demo.mapData.initialStamina ?? 100
};

const v2 = DataSerializer.generateShareCode(sourceData);
if (!v2.success) throw new Error(`v2 生成失败: ${v2.error}`);
const decoded = DataSerializer.loadFromShareCode(v2.code);
if (!decoded.success) throw new Error(`v2 解码失败: ${decoded.error}`);

const v1 = V1.generateShareCode(sourceData);
if (!v1.success) throw new Error(`v1 生成失败（仅基线参考）: ${v1.error}`);

const golden = {
    'G1-demo': {
        code: v2.code,
        gameMode: decoded.data.gameMode,
        initialHealth: decoded.data.initialHealth,
        initialStamina: decoded.data.initialStamina,
        v1CodeLength: v1.code.length,
        canonical: decoded.data.mapData
    }
};

writeFileSync('test/golden/maps.json', JSON.stringify(golden, null, 2));
console.log(`G1 golden 已写入 test/golden/maps.json`);
console.log(`v2 码长: ${v2.code.length}  |  v1 码长: ${v1.code.length}  |  差: ${v2.code.length - v1.code.length}`);
