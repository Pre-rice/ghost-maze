/**
 * 统一测试入口：依次运行 test/ 下全部 *.test.mjs（每个测试文件独立进程，summary 会 process.exit）
 */
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const testDir = dirname(fileURLToPath(import.meta.url));
const testFiles = readdirSync(testDir).filter(f => f.endsWith('.test.mjs')).sort();

let failed = 0;
for (const f of testFiles) {
    const r = spawnSync(process.execPath, [join(testDir, f)], { stdio: 'inherit' });
    if (r.status !== 0) failed++;
}
if (failed > 0) {
    console.error(`\n✗ ${failed} 个测试文件失败`);
    process.exit(1);
}
console.log(`\n✓ 全部 ${testFiles.length} 个测试文件通过`);
