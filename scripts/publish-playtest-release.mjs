import { readFileSync, readdirSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

// 认证使用 gh 的标准配置；不读取、打印或导出凭据。
const args = process.argv.slice(2), at = name => args.indexOf(name);
const directory = at('--directory') >= 0 ? args[at('--directory') + 1] : null;
if (!directory) throw new Error('需要 --directory <准备好的发布目录>');
const root = resolve(directory);
const legacy = existsSync(join(root, 'migration.json'));
const record = JSON.parse(readFileSync(join(root, legacy ? 'migration.json' : 'verification.json'), 'utf8'));
const tag = record.tag;
if (!/^playtest-v\d+\.\d+\.\d+$/.test(tag)) throw new Error('非法发布标签');
if (record.sourceWorktreeDirty) throw new Error('不能发布未提交源码');
const names = readdirSync(root).filter(name => name !== 'release-notes.md').sort();
const digest = file => createHash('sha256').update(readFileSync(file)).digest('hex');
for (const line of readFileSync(join(root, 'SHA256SUMS.txt'), 'utf8').trim().split('\n')) {
    const [, expected, name] = /^([a-f0-9]{64})  ([A-Za-z0-9._-]+)$/.exec(line) || [];
    if (!name || digest(join(root, name)) !== expected) throw new Error('发布附件校验失败：' + line);
}
const gh = (...argv) => execFileSync('gh', argv, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
// 列表用于兼容未公开且尚未创建标签的草稿；鉴权失败不能当作“版本不存在”。
const list = () => gh('api', '--paginate', '--jq', '.[] | @json', 'repos/{owner}/{repo}/releases')
    .split('\n').filter(Boolean).map(line => JSON.parse(line));
const releases = list();
let release = releases.find(row => row.tag_name === tag);
if (!release) {
    gh('release', 'create', tag, '--target', record.sourceCommit, '--draft', '--title', `鬼迷宫自主试玩 ${record.version}`, '--notes-file', join(root, 'release-notes.md'));
    release = list().find(row => row.tag_name === tag);
}
if (!release) throw new Error('发布草稿未找到');
if (release.target_commitish !== record.sourceCommit) throw new Error('同名版本的源码提交不一致，拒绝覆盖');
const expectedAssets = new Map(release.assets.map(a => [a.name, a]));
for (const name of names) {
    if (!expectedAssets.has(name)) {
        if (!release.draft) throw new Error('已发布版本缺少附件，拒绝修改：' + name);
        gh('release', 'upload', tag, join(root, name));
    }
}
const temporary = mkdtempSync(join(tmpdir(), 'ghostmaze-release-download-'));
try {
    gh('release', 'download', tag, '--dir', temporary);
    for (const name of names) if (digest(join(temporary, name)) !== digest(join(root, name))) throw new Error('远端附件与原件不同，拒绝发布：' + name);
} finally { rmSync(temporary, { recursive: true, force: true }); }
if (release.draft) gh('release', 'edit', tag, '--notes-file', join(root, 'release-notes.md'), '--draft=false', args.includes('--latest') ? '--latest' : '--latest=false');
console.log(JSON.stringify({ tag, assets: names.length, originalBytesVerified: true, published: true }));
