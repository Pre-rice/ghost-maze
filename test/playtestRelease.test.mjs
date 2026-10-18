import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { runInNewContext } from 'node:vm';
import { suite, test, summary, assert, assertEq, assertDeepEq } from './_assert.mjs';
import { installBrowserEnv } from './helpers/browser-env.mjs';
import { makeMap } from './helpers/map-fixture.mjs';
import { DataSerializer } from '../src/core/dataSerializer.js';

installBrowserEnv();
suite('playtestRelease');
const root = new URL('../', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('../.agents/skills/ghostmaze-playtest/assets/manifest.json', import.meta.url)));
test('错误版本标签在生成和发布前拒绝', () => {
    const result = spawnSync(process.execPath, ['scripts/package-playtest.mjs', '--check', '--release-tag', 'playtest-v999.0.0'], { cwd: root, encoding: 'utf8' });
    assert(result.status !== 0); assert(result.stderr.includes('标签必须匹配技能版本'));
});
test('两种安装包解压后可独立操作恢复，重复构建一致且禁止覆盖', () => {
    const temp = mkdtempSync(join(tmpdir(), 'ghostmaze-packages-'));
    try {
        for (const name of ['a', 'b']) execFileSync(process.execPath, ['scripts/package-playtest.mjs', '--output', join(temp, name)], { cwd: root, stdio: 'pipe' });
        for (const kind of ['skill', 'plugin']) {
            const archive = 'ghostmaze-playtest-' + kind + '.zip';
            assert(readFileSync(join(temp, 'a', archive)).equals(readFileSync(join(temp, 'b', archive))), '相同来源的 ZIP 逐字节相同');
        }
        const inspect = [
            'import pathlib,zipfile,json,sys',
            'base=pathlib.Path(sys.argv[1])',
            "for kind in ['skill','plugin']:",
            " with zipfile.ZipFile(base/'a'/('ghostmaze-playtest-'+kind+'.zip')) as z:",
            '  assert z.testzip() is None',
            "  prefix='ghostmaze-playtest/' if kind=='skill' else 'ghostmaze-playtest/skills/ghostmaze-playtest/'",
            "  assert all(n.startswith('ghostmaze-playtest/') and '..' not in pathlib.PurePosixPath(n).parts for n in z.namelist())",
            "  assert z.read(prefix+'SKILL.md').decode().startswith('---\\nname: ghostmaze-playtest\\n')",
            "  assert 'allow_implicit_invocation: false' in z.read(prefix+'agents/openai.yaml').decode()",
            "  if kind=='plugin':",
            "   p=json.loads(z.read('ghostmaze-playtest/plugin.json'));assert p['name']=='ghostmaze-playtest';assert p['$schema']=='https://agent-plugins.org/schemas/1.0.0/plugin.schema.json'",
            '  z.extractall(base/kind)'
        ].join('\n');
        execFileSync('python3', ['-c', inspect, temp]);
        for (const kind of ['skill', 'plugin']) {
            const prefix = kind === 'skill' ? 'ghostmaze-playtest' : 'ghostmaze-playtest/skills/ghostmaze-playtest';
            const text = readFileSync(join(temp, kind, prefix, 'assets/playtest.js'), 'utf8');
            const api = runInNewContext(text, {});
            assertEq(api.engine, manifest.engine);
            const code = DataSerializer.generateShareCode(makeMap()); assert(code.success);
            const first = api.start({ source: code.code, rules: 'discover' });
            const moved = api.command(first.session, 'R');
            const restored = runInNewContext(text, {}).restore(api.save(moved.session));
            assertDeepEq(restored.board, moved.board);
            assertEq(restored.board.stats.steps, 1);
        }
        const overwrite = spawnSync(process.execPath, ['scripts/package-playtest.mjs', '--output', join(temp, 'a')], { cwd: root, encoding: 'utf8' });
        assert(overwrite.status !== 0); assert(overwrite.stderr.includes('不能覆盖已有安装包'));
    } finally { rmSync(temp, { recursive: true, force: true }); }
});
summary();
