import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInThisContext } from 'node:vm';

// Node只是Codex/可用脚本环境的装载与文件适配器；核心资产本身不依赖Node。
const skillRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const api = runInThisContext(readFileSync(resolve(skillRoot, 'assets/playtest.js'), 'utf8'));
const argument = process.argv.indexOf('--session');
const file = resolve(argument < 0 ? 'work/ghostmaze-playtest/session.json' : process.argv[argument + 1]);
try {
    const request = JSON.parse(readFileSync(0, 'utf8'));
    let session = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null, result;
    if (request.op === 'start') result = api.start(request);
    else if (request.op === 'restore') result = api.restore(request.token);
    else if (!session) throw new Error('尚未开始试玩');
    else if (request.op === 'observe') result = api.observe(session);
    else if (request.op === 'command') result = api.command(session, request.command);
    else if (request.op === 'target') {
        const target = runInThisContext(readFileSync(resolve(skillRoot, 'assets/target.js'), 'utf8'));
        result = target.prepare(session, request.budget);
    } else if (request.op === 'export') {
        const record = api.export(session);
        const stamp = session.startedAt.replace(/[^\dTZ]/g, '-');
        const exportFile = resolve(request.file || `work/ghostmaze-playtest/record-${stamp}.json`);
        mkdirSync(dirname(exportFile), { recursive: true }); writeFileSync(exportFile, JSON.stringify(record, null, 2) + '\n');
        console.log(JSON.stringify({ success: true, file: exportFile, status: record.status, stats: record.stats,
            goal: record.conditions.goal, replay: record.currentReplay, attempts: record.attempts, notes: record.notes }));
        process.exit(0);
    } else throw new Error('不支持的请求');
    if (result.session) {
        session = result.session; mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file + '.tmp', JSON.stringify(session)); renameSync(file + '.tmp', file);
    }
    const visible = result.board ? { board: result.board, info: result.info, change: result.lastEvent?.change } : { target: result.target };
    console.log(JSON.stringify({ success: true, ...visible }));
} catch (error) { console.log(JSON.stringify({ success: false, error: error.message })); process.exitCode = 1; }
