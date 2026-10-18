import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skill = resolve(root, '.agents/skills/ghostmaze-playtest');
const sha = text => createHash('sha256').update(text).digest('hex');
const source = file => readFileSync(resolve(root, file), 'utf8');
const sources = {};
const core = readdirSync(resolve(root, 'src/core')).filter(n => n.endsWith('.js')).sort();
const digest = createHash('sha256');
for (const name of core) {
    const file = 'src/core/' + name;
    digest.update(file + ':' + sha(source(file)) + '\n');
}
const build = { version: '1.0.2', engine: 'sha256:' + digest.digest('hex'), format: 'ghostmaze-playtest-v1' };
const tagIndex = process.argv.indexOf('--release-tag');
if (tagIndex >= 0 && process.argv[tagIndex + 1] !== `playtest-v${build.version}`) {
    throw new Error('发布标签必须匹配技能版本：playtest-v' + build.version);
}

// 只处理本仓库的命名ES模块；拒绝外部依赖。包装改变模块装载方式，不改规则实现。
function bundle(entry, factory) {
    const modules = new Map();
    function visit(file) {
        if (modules.has(file)) return;
        const raw = source(file), names = [];
        sources[file] = sha(raw); modules.set(file, '');
        let code = raw.replace(/^import\s+([\s\S]*?)\s+from\s+(['"])([^'"]+)\2\s*;/gm, (_, bindings, quote, specifier) => {
            if (!specifier.startsWith('.')) throw new Error('运行包禁止外部依赖：' + file);
            const target = relative(root, resolve(root, dirname(file), specifier)).replaceAll('\\', '/');
            if (target.startsWith('../')) throw new Error('依赖越出仓库');
            visit(target);
            return `const ${bindings.replace(/\bas\b/g, ':')} = __load(${JSON.stringify(target)});`;
        });
        code = code.replace(/\bexport\s+(const|let|class|function)\s+([A-Za-z_$][\w$]*)/g, (_, kind, name) => { names.push([name, name]); return kind + ' ' + name; });
        code = code.replace(/^export\s*\{([^}]+)\}\s*;?/gm, (_, entries) => {
            for (const item of entries.split(',')) {
                const [local, exported = local] = item.trim().split(/\s+as\s+/); if (local) names.push([exported, local]);
            }
            return '';
        });
        if (/^\s*(import|export)\s/m.test(code)) throw new Error('不支持的模块语法：' + file);
        // 以字符串保存模块，保留原始换行／尾空格，不把原源码的格式问题带入生成文件。
        modules.set(file, JSON.stringify(`${code}\nreturn {${names.map(([name, local]) => `${JSON.stringify(name)}:${local}`).join(',')}};\n`));
    }
    visit(entry); visit('src/playtest/portable.js');
    const vendor = source('src/vendor/pako.js'); sources['src/vendor/pako.js'] = sha(vendor);
    return `/* 自动生成，禁止手改；由scripts/package-playtest.mjs从本体生成。\n * pako许可随包附带；引擎 ${build.engine}\n */\n(function(){\n` +
        `const __factories={${[...modules].map(([name, code]) => `${JSON.stringify(name)}:${code}`).join(',\n')}};\n` +
        `const __cache=Object.create(null);function __load(id){return __cache[id]||(__cache[id]=Function('__load',__factories[id])(__load));}\n` +
        `const __pako=(function(){var module={exports:{}};var exports=module.exports;\n${vendor}\nreturn module.exports;})();\n` +
        `__load('src/playtest/portable.js').installPortableGlobals(__pako);\n` +
        `return __load(${JSON.stringify(entry)})[${JSON.stringify(factory)}](${JSON.stringify(build)});\n})();\n`;
}

const assets = { 'playtest.js': bundle('src/playtest/public.js', 'createPlaytestAPI'),
    'target.js': bundle('src/playtest/target-public.js', 'createTargetAPI') };
const manifest = { ...build, sources, assets: Object.fromEntries(Object.entries(assets).map(([name, text]) => [name, sha(text)])) };
assets['manifest.json'] = JSON.stringify(manifest, null, 2) + '\n';
const check = process.argv.includes('--check');
for (const [name, content] of Object.entries(assets)) {
    const file = resolve(skill, 'assets', name);
    if (check) {
        if (!existsSync(file) || readFileSync(file, 'utf8') !== content) throw new Error('运行包与唯一源码不一致：' + name);
    } else { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, content); }
}
if (!check) {
    mkdirSync(resolve(skill, 'assets'), { recursive: true });
    writeFileSync(resolve(skill, 'assets/LICENSE.pako'), source('src/vendor/LICENSE.pako'));
}
const outputIndex = process.argv.indexOf('--output');
if (outputIndex >= 0) {
    if (check) throw new Error('--check不能同时写安装包');
    const outputArg = process.argv[outputIndex + 1];
    if (!outputArg || outputArg.startsWith('--')) throw new Error('--output缺少目录');
    const output = resolve(outputArg);
    if (output === skill || output.startsWith(skill + '/')) throw new Error('安装包必须输出到技能目录之外');
    for (const kind of ['skill', 'plugin']) if (existsSync(resolve(output, `ghostmaze-playtest-${kind}.zip`))) throw new Error('不能覆盖已有安装包');
    mkdirSync(output, { recursive: true });
    const plugin = { '$schema': 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json', name: 'ghostmaze-playtest',
        version: build.version, description: '手动调用的鬼迷宫AI试玩：真实引擎、文字局面、过程与感受；可选最短步数挑战。',
        author: { name: 'Pre-rice', url: 'https://github.com/Pre-rice' }, repository: 'https://github.com/Pre-rice/ghost-maze' };
    const script = `import pathlib,zipfile,sys,json\nbase=pathlib.Path(sys.argv[1]);out=pathlib.Path(sys.argv[2]);plugin=json.loads(sys.argv[3])\nfiles=[]\nfor f in sorted(base.rglob('*')):\n rel=f.relative_to(base)\n if f.is_symlink():raise ValueError('技能包不允许符号链接：'+str(rel))\n if not f.is_file():continue\n if any(p in ['__pycache__','node_modules','.git'] or p.startswith('.') for p in rel.parts):continue\n if rel.parts[0] not in ['README.md','SKILL.md','assets','agents','scripts','references']:raise ValueError('技能包包含无关文件：'+str(rel))\n files.append((str(rel),f.read_bytes()))\ndef put(z,name,data):\n info=zipfile.ZipInfo(name,date_time=(1980,1,1,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16;z.writestr(info,data,compresslevel=9)\nfor kind in ['skill','plugin']:\n p=out/('ghostmaze-playtest-'+kind+'.zip')\n with zipfile.ZipFile(p,'x',compression=zipfile.ZIP_DEFLATED) as z:\n  prefix='ghostmaze-playtest/' if kind=='skill' else 'ghostmaze-playtest/skills/ghostmaze-playtest/'\n  for name,data in files:put(z,prefix+name,data)\n  if kind=='plugin':put(z,'ghostmaze-playtest/plugin.json',(json.dumps(plugin,ensure_ascii=False,indent=2)+'\\n').encode())\n print(str(p))\n`;
    const result = spawnSync('python3', ['-c', script, skill, output, JSON.stringify(plugin)], { encoding: 'utf8' });
    if (result.status !== 0) throw new Error(result.stderr);
    process.stdout.write(result.stdout);
}
console.log(JSON.stringify({ checked: check, ...build, assets: Object.fromEntries(Object.entries(assets).map(([name, text]) => [name, Buffer.byteLength(text)])) }));
