import { readFileSync, writeFileSync } from 'node:fs';
import { installBrowserEnv } from './browser-env.mjs';
import { DataSerializer } from '../../src/core/dataSerializer.js';
installBrowserEnv();
// 从现有原始地图更新测试码；不尝试解码已弃用格式。
const path = new URL('../golden/maps.json', import.meta.url);
const maps = JSON.parse(readFileSync(path, 'utf8'));
for (const entry of Object.values(maps)) {
    const encoded = DataSerializer.generateShareCode({ ...entry.canonical, gameMode: entry.gameMode, initialHealth: entry.initialHealth });
    if (!encoded.success) throw new Error(encoded.error);
    const decoded = DataSerializer.loadFromShareCode(encoded.code);
    entry.code = encoded.code; entry.canonical = decoded.data.mapData;
    delete entry.initialStamina;
}
writeFileSync(path, JSON.stringify(maps, null, 2) + '\n');
console.log('测试地图已按新格式更新');
