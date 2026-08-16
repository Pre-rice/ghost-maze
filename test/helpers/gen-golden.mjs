/**
 * 一次性 golden 采集脚本（不入测试流程）：
 *   从 ghost-maze-ai 的 demo-map.json 生成 G1 的 v3 分享码。
 * 运行：node test/helpers/gen-golden.mjs
 * 说明：仅只读运行 ghost-maze-ai 的 demo 地图数据（路径写死，本机项目布局），不修改该仓库。
 *       v1（旧启发式协议）已在重构中删除，码长防膨胀改为测试里的固定上限断言。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { installBrowserEnv } from './browser-env.mjs';
installBrowserEnv();

const { DataSerializer } = await import('../../src/core/dataSerializer.js');

const demoPath = 'e:/编程/ghost-maze-ai/examples/demo-map.json';
const demo = JSON.parse(readFileSync(demoPath, 'utf-8'));

// 模拟游戏端装配：补上 gameMode/initialHealth/initialStamina（demo-map.json 缺 initialHealth）
const sourceData = {
    ...demo.mapData,
    gameMode: demo.mapData.gameMode || 'death-loop',
    initialHealth: demo.mapData.initialHealth ?? 5,
    initialStamina: demo.mapData.initialStamina ?? 100
};

const v3 = DataSerializer.generateShareCode(sourceData);
if (!v3.success) throw new Error(`v3 生成失败: ${v3.error}`);
const decoded = DataSerializer.loadFromShareCode(v3.code);
if (!decoded.success) throw new Error(`v3 解码失败: ${decoded.error}`);

const golden = {
    'G1-demo': {
        code: v3.code,
        gameMode: decoded.data.gameMode,
        initialHealth: decoded.data.initialHealth,
        initialStamina: decoded.data.initialStamina,
        canonical: decoded.data.mapData
    }
};

writeFileSync('test/golden/maps.json', JSON.stringify(golden, null, 2));
console.log(`G1 golden 已写入 test/golden/maps.json`);
console.log(`v3 码长: ${v3.code.length}`);
