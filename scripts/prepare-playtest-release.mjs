import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

// 发布准备不执行试玩，也不更改引擎或已生成资产。
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const value = name => args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
const outputArg = value('--output');
if (!outputArg || outputArg.startsWith('--')) throw new Error('需要 --output <独立输出目录>');
const tagArg = value('--tag');
if (args.some((arg, i) => !['--output', '--tag'].includes(arg) && !['--output', '--tag'].includes(args[i - 1]))) throw new Error('未知参数');
const output = resolve(outputArg);
if (existsSync(output)) throw new Error('输出目录已存在，请使用新目录，不能覆盖已有安装包');
const checkArgs = ['scripts/package-playtest.mjs', '--check'];
if (args.includes('--tag')) {
    if (!tagArg || tagArg.startsWith('--')) throw new Error('--tag 缺少版本标签');
    checkArgs.push('--release-tag', tagArg);
}
execFileSync(process.execPath, checkArgs, { cwd: root, stdio: 'pipe' });
const manifest = JSON.parse(readFileSync(resolve(root, '.agents/skills/ghostmaze-playtest/assets/manifest.json'), 'utf8'));
const tag = tagArg || `playtest-v${manifest.version}`;
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const dirty = execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], { cwd: root, encoding: 'utf8' }).trim() !== '';
if (tagArg && dirty) throw new Error('正式标签发布必须来自干净的已提交源码');
mkdirSync(output, { recursive: true });
execFileSync(process.execPath, ['scripts/package-playtest.mjs', '--output', output], { cwd: root, stdio: 'pipe' });
writeFileSync(resolve(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
const sha = name => createHash('sha256').update(readFileSync(resolve(output, name))).digest('hex');
const verification = { version: manifest.version, tag, engine: manifest.engine, sourceCommit: commit, sourceWorktreeDirty: dirty,
    sourcePackageCheckPassed: true, ordinaryChatAccountInstallTested: false,
    note: '准备脚本不冒称已运行测试或账号端验收；正式发布由标签工作流先运行 npm test。' };
writeFileSync(resolve(output, 'verification.json'), JSON.stringify(verification, null, 2) + '\n');
const notes = `# 鬼迷宫自主试玩 ${manifest.version}\n\n手动调用，文字局面、真实引擎、自主操作，交付过程、评价、感受和回放。支持已知／探索规则、普通通关／最短目标步数挑战。\n\n下载 ghostmaze-playtest-skill.zip；需要插件包装时用 ghostmaze-playtest-plugin.zip。下载不会自动安装到聊天账号。\n\n[使用说明](https://github.com/Pre-rice/ghost-maze/blob/${commit}/docs/ai-playtest.md) · [对应源码](https://github.com/Pre-rice/ghost-maze/tree/${commit}/.agents/skills/ghostmaze-playtest)\n\n引擎固定为 ${manifest.engine}；旧记录请使用原版本恢复。SHA256SUMS.txt 核对下载文件。\n\n本次发布不将工程验证当作账号端逐项验收；安装与使用的实际反馈见使用说明。\n`;
writeFileSync(resolve(output, 'release-notes.md'), notes);
const files = ['ghostmaze-playtest-skill.zip', 'ghostmaze-playtest-plugin.zip', 'manifest.json', 'verification.json'];
writeFileSync(resolve(output, 'SHA256SUMS.txt'), files.map(name => `${sha(name)}  ${name}\n`).join(''));
console.log(JSON.stringify({ output, tag, version: manifest.version, engine: manifest.engine, sourceCommit: commit, sourceWorktreeDirty: dirty }));
