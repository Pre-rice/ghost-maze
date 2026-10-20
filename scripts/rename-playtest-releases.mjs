import { execFileSync } from 'node:child_process';

/**
 * 把已发布的试玩 Release 名称与说明里的旧中文名统一成当前名称。
 * 只改标题与说明文字，不动任何安装包附件；重复执行没有副作用。
 * 需要已登录的 gh（CI 里用 GH_TOKEN）；--check 只报告不修改。
 */
const NAME = '鬼迷宫AI试玩';
const OLD_NAMES = ['鬼迷宫自主试玩', '鬼迷宫试玩'];
const check = process.argv.includes('--check');

const gh = (...argv) => execFileSync('gh', argv, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

const releases = JSON.parse(gh('api', 'repos/{owner}/{repo}/releases?per_page=100'));
const changes = [];
for (const release of releases) {
    const match = /^playtest-v(\d+\.\d+\.\d+)$/.exec(release.tag_name);
    if (!match) continue;
    const version = match[1];
    const name = `${NAME} ${version}`;
    let body = release.body || '';
    for (const old of OLD_NAMES) body = body.split(old).join(NAME);
    const titleChanged = release.name !== name;
    const bodyChanged = body !== (release.body || '');
    if (!titleChanged && !bodyChanged) continue;
    changes.push({ tag: release.tag_name, name, titleChanged, bodyChanged });
    if (check) continue;
    const args = ['api', '--method', 'PATCH', `repos/{owner}/{repo}/releases/${release.id}`];
    if (titleChanged) args.push('--raw-field', 'name=' + name);
    if (bodyChanged) args.push('--raw-field', 'body=' + body);
    gh(...args);
}
console.log(JSON.stringify({ checked: check, changed: changes.length, releases: changes }));
