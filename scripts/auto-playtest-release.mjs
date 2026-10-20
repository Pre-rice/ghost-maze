import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

/**
 * 自动发版判断：上次发布之后，随包引擎或技能内容有没有变化，需不需要升版本。
 * 只读判断默认不写文件；加 --apply 才把版本号写进打包脚本并重新生成资产。
 *
 * 用法：node scripts/auto-playtest-release.mjs [--latest-tag playtest-vX.Y.Z] [--apply]
 * 输出：{ release, version, previous, changedFiles, applied }
 */
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const value = name => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
const apply = args.includes('--apply');
const latestTag = value('--latest-tag') || '';

/** 打包内容只由这些路径决定：技能目录、试玩源码、引擎、vendor 与打包脚本本身。 */
const PACKAGED_PATHS = ['.agents/skills/ghostmaze-playtest', 'src/playtest', 'src/core', 'src/vendor/pako.js', 'scripts/package-playtest.mjs'];

const git = (...argv) => execFileSync('git', argv, { cwd: root, encoding: 'utf8' }).trim();
const PACKAGE_SCRIPT = resolve(root, 'scripts/package-playtest.mjs');

const readVersion = () => {
    const text = readFileSync(PACKAGE_SCRIPT, 'utf8');
    const match = /version: '(\d+)\.(\d+)\.(\d+)'/.exec(text);
    if (!match) throw new Error('打包脚本里找不到版本号');
    return { text, match: match[0], parts: [Number(match[1]), Number(match[2]), Number(match[3])] };
};
const tagParts = tag => {
    const match = /^playtest-v(\d+)\.(\d+)\.(\d+)$/.exec(tag || '');
    return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null;
};
const rank = parts => parts[0] * 1e6 + parts[1] * 1e3 + parts[2];
const bumpPatch = parts => [parts[0], parts[1], parts[2] + 1];
const format = parts => parts.join('.');

// 与上次发布比较：改了打包路径里的任何东西才需要发版。
// 标签在本地不存在（浅克隆或标签被清理）时按“需要发版”处理，由 CI 的 fetch-depth: 0 保证正常情况能取到。
const hasLatestTag = latestTag ? (() => { try { git('rev-parse', '--verify', `refs/tags/${latestTag}`); return true; } catch { return false; } })() : false;
const changed = hasLatestTag ? git('diff', '--name-only', `${latestTag}..HEAD`, '--', ...PACKAGED_PATHS) : '';
const release = !hasLatestTag || changed.length > 0;

// 版本号取“打包脚本里的版本”和“上次发布版本”的较大者；都没动过才 +1。
const current = readVersion();
const released = tagParts(latestTag);
const version = !released || rank(current.parts) > rank(released) ? current.parts : bumpPatch(released);

const result = {
    release,
    version: format(version),
    previous: latestTag || null,
    changedFiles: changed ? changed.split('\n').length : 0,
    applied: false,
};

if (release && apply) {
    if (format(current.parts) !== format(version)) {
        writeFileSync(PACKAGE_SCRIPT, current.text.replace(current.match, `version: '${format(version)}'`), 'utf8');
    }
    // 重生成资产：manifest 的 version 与 engine 同步到新版本。
    execFileSync(process.execPath, [PACKAGE_SCRIPT], { cwd: root, stdio: 'inherit' });
    execFileSync(process.execPath, [PACKAGE_SCRIPT, '--check', '--release-tag', `playtest-v${format(version)}`], { cwd: root, stdio: 'inherit' });
    result.applied = true;
}

console.log(JSON.stringify(result));
