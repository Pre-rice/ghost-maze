import { GameLogic } from '../core/gameLogic.js';
import { MapDefinition } from '../core/mapDefinition.js';
import { DataSerializer } from '../core/dataSerializer.js';
import { ReplaySerializer } from '../core/replaySerializer.js';
import { actionFromName } from '../core/actions.js';
import { toBase64, fromBase64, crc32, unpack } from '../core/binaryCodec.js';
import { observeBoard, describeVisibleChange } from './observation.js';
import { plainCopy, textBytes, bytesText } from './portable.js';

const movement = new Set(['act', 'undo', 'redo', 'reset', 'restart', 'load']);
const inputActions = new Set(['U', 'D', 'L', 'R', 'STAIR']);
const maxEvents = 100000;

export function parseSource(source) {
    if (typeof source !== 'string') throw new TypeError('请提供地图分享码或地图链接');
    source = source.trim();
    let map = source, save = null;
    if (/^https?:\/\//i.test(source)) {
        // 只解析参数，不访问网页，也不加载链接中可能附带的参考回放。
        const query = source.split('?')[1]?.split('#')[0] || '';
        const parameters = {};
        for (const entry of query.split('&')) {
            const [key, ...rest] = entry.split('=');
            if (Object.hasOwn(parameters, key)) throw new RangeError('链接含重复参数');
            parameters[key] = decodeURIComponent(rest.join('='));
        }
        map = parameters.map; save = parameters.save || null;
        if (!map) throw new RangeError('链接没有地图码');
    }
    const result = DataSerializer.loadFromShareCode(map);
    if (!result.success) throw new RangeError(result.error);
    return { map, save, data: result.data.mapData };
}

function decodeRoute(data, code) {
    const result = ReplaySerializer.loadFromShareCode(data, code);
    if (!result.success) throw new RangeError(result.error);
    return result.actions;
}

function moveFrame(frame, action, definition) {
    const physical = GameLogic.calculateNextState(frame.state, actionFromName(action), definition, { trails: false });
    if (physical === frame.state) return { frame, effective: false, death: false, revived: false, attemptedRoute: frame.route };
    const attemptedRoute = [...frame.route, action], death = physical.isDead;
    const state = death ? GameLogic.handleRevive(physical, definition) : physical;
    const revived = death && state !== physical && !state.isDead;
    const loop = death && definition.gameMode === 'death-loop' && revived;
    return { effective: true, death, revived, attemptedRoute,
        frame: { state, route: loop ? [] : attemptedRoute, deaths: loop ? 0 : frame.deaths + Number(death) } };
}

function routeFrames(definition, actions) {
    const frames = [{ state: GameLogic.createInitialState(definition), route: [], deaths: 0 }];
    actions.forEach((name, index) => {
        const result = moveFrame(frames.at(-1), name, definition);
        if (!result.effective || result.death && definition.gameMode === 'death-loop' && index < actions.length - 1) {
            throw new RangeError('存档包含无法执行的步骤');
        }
        frames.push(result.frame);
    });
    return frames;
}

function checkSession(session, revision) {
    if (!session || session.schema !== 1 || session.engine !== revision) throw new RangeError('试玩记录版本与当前引擎不一致，请使用对应版本的安装包');
    if (!Array.isArray(session.events) || session.events.length > maxEvents) throw new RangeError('试玩记录格式或长度无效');
    if (!['known', 'discover'].includes(session.rules) || !['normal', 'shortest'].includes(session.challenge)) throw new RangeError('试玩条件无效');
    if (session.fullVision && !session.allowFullVision) throw new RangeError('未授权开启全图视野');
}

function cleanCommand(command) {
    if (typeof command === 'string') command = { type: 'act', action: command };
    if (!command || typeof command.type !== 'string') throw new TypeError('操作格式无效');
    switch (command.type) {
        case 'act':
            if (!inputActions.has(command.action)) throw new RangeError('只支持U/D/L/R/STAIR单步输入');
            return { type: 'act', action: command.action };
        case 'undo': case 'redo': case 'reset': case 'restart': return { type: command.type };
        case 'view':
            if (!Number.isInteger(command.layer)) throw new RangeError('查看楼层需填写整数');
            return { type: 'view', layer: command.layer };
        case 'checkpoint': return { type: command.type, label: String(command.label || '').slice(0, 160) };
        case 'load': case 'deleteCheckpoint': return { type: command.type, id: String(command.id || '').slice(0, 80) };
        case 'note': {
            const kind = command.kind || 'observation';
            if (!['observation', 'plan', 'hypothesis', 'discovery', 'feeling', 'experience', 'hint'].includes(kind)) throw new RangeError('笔记类型无效');
            const text = String(command.text || '').trim();
            if (!text || text.length > 10000) throw new RangeError('笔记须为1至10000字');
            return { type: 'note', kind, text };
        }
        default: throw new RangeError('不支持该操作');
    }
}

/** 完整记录仅含输入与笔记；物理局面始终由共同引擎重新推导。 */
export function reconstruct(session, revision, { trace = false } = {}) {
    checkSession(session, revision);
    const parsed = parseSource(session.map), definition = new MapDefinition(parsed.data);
    const sourceRoute = session.save ? decodeRoute(parsed.data, session.save) : [];
    let frames = routeFrames(definition, sourceRoute), cursor = frames.length - 1;
    const origin = frames.at(-1), prefix = origin.route.slice();
    let layer = origin.state.player.layer;
    const checkpoints = new Map(), records = [], routes = [];
    const board = () => observeBoard(definition, frames[cursor].state, { layer, fullVision: session.fullVision });
    const append = frame => { frames.length = cursor + 1; frames.push(frame); cursor++; layer = frame.state.player.layer; };
    for (const [index, event] of session.events.entries()) {
        const command = cleanCommand(event.command);
        const capture = trace === true || trace === 'last' && index === session.events.length - 1;
        const before = capture ? board() : null;
        let effective = false, death = false, revived = false, message = null;
        const current = frames[cursor];
        if (command.type === 'act') {
            const result = moveFrame(current, command.action, definition);
            ({ effective, death, revived } = result);
            if (effective) {
                append(result.frame);
                if (capture && (death || result.frame.state.isWon)) routes.push({ event: index + 1,
                    kind: death ? 'death' : 'win', actions: result.attemptedRoute });
            }
        } else if (command.type === 'undo') {
            if (cursor > 0) { cursor--; effective = true; layer = frames[cursor].state.player.layer; }
        } else if (command.type === 'redo') {
            if (cursor + 1 < frames.length) { cursor++; effective = true; layer = frames[cursor].state.player.layer; }
        } else if (command.type === 'reset' || command.type === 'restart') {
            if (capture && current.route.length) routes.push({ event: index + 1, kind: command.type, actions: current.route.slice() });
            append(command.type === 'restart' ? origin : { state: GameLogic.createInitialState(definition), route: [], deaths: 0 });
            effective = true;
        } else if (command.type === 'view') {
            if (command.layer < 1 || command.layer > definition.layerCount) throw new RangeError('楼层不存在');
            layer = command.layer - 1;
        } else if (command.type === 'checkpoint') {
            checkpoints.set(`s${index + 1}`, { id: `s${index + 1}`, label: command.label,
                actions: current.route.slice(), event: index + 1 });
        } else if (command.type === 'load') {
            const checkpoint = checkpoints.get(command.id);
            if (checkpoint) { frames = routeFrames(definition, checkpoint.actions); cursor = frames.length - 1;
                layer = frames[cursor].state.player.layer; effective = true; }
            else message = '该存档点不存在';
        } else if (command.type === 'deleteCheckpoint') checkpoints.delete(command.id);
        if (capture) {
            const after = board();
            records.push({ event: index + 1, at: event.at, command, effective, message, board: after,
                change: describeVisibleChange(before, after, { effective, death, revived }) });
        }
    }
    return { data: parsed.data, definition, state: frames[cursor].state, frame: frames[cursor], prefix,
        origin, layer, cursor, frames, checkpoints, records, routes, board: board() };
}

export function goalProgress(session, runtime) {
    if (session.challenge !== 'shortest') return null;
    const target = session.target || { status: 'pending', steps: null };
    const route = runtime.frame.route, aligned = route.length >= runtime.prefix.length && runtime.prefix.every((a, i) => a === route[i]);
    const steps = aligned ? route.length - runtime.prefix.length : null;
    const noNewDeaths = runtime.frame.deaths === runtime.origin.deaths;
    return { status: target.status, targetSteps: target.steps ?? null, stepsSinceStart: steps,
        eligible: aligned && noNewDeaths, met: target.status === 'solved' && runtime.state.isWon && aligned && noNewDeaths && steps === target.steps };
}

export function publicSession(session, runtime) {
    return { engine: session.engine, rules: session.rules, challenge: session.challenge,
        priorKnowledge: session.priorKnowledge, inheritedExperience: session.inheritedExperience,
        origin: session.save ? 'save' : 'map', events: session.events.length,
        canUndo: runtime.cursor > 0, canRedo: runtime.cursor + 1 < runtime.frames.length,
        checkpoints: [...runtime.checkpoints.values()].map(p => ({ id: p.id, label: p.label, step: p.actions.length })),
        goal: goalProgress(session, runtime) };
}

export function startSession(options, revision) {
    if (!options || typeof options !== 'object') throw new TypeError('缺少试玩设置');
    const source = parseSource(options.source);
    const rules = options.rules || 'known', challenge = options.challenge || 'normal';
    const session = { schema: 1, engine: revision, map: source.map, save: source.save,
        rules, challenge, fullVision: !!options.fullVision, allowFullVision: !!options.allowFullVision,
        priorKnowledge: String(options.priorKnowledge || '未声明已知本图答案；仍需结合当前对话核实'),
        inheritedExperience: String(options.inheritedExperience || ''),
        startedAt: new Date().toISOString(), events: [], target: challenge === 'shortest' ? { status: 'pending', steps: null } : null };
    const runtime = reconstruct(session, revision);
    return { session, board: runtime.board, info: publicSession(session, runtime) };
}

export function dispatchSession(source, command, revision) {
    const session = plainCopy(source), cleaned = cleanCommand(command);
    checkSession(session, revision);
    if (session.events.length >= maxEvents) throw new RangeError('本次记录已满，请导出保存');
    if (session.challenge === 'shortest' && session.target?.status !== 'solved' && movement.has(cleaned.type)) throw new RangeError('最短目标尚未得到证明，请先准备目标步数');
    session.events.push({ at: new Date().toISOString(), command: cleaned });
    const runtime = reconstruct(session, revision, { trace: 'last' });
    return { session, board: runtime.board, info: publicSession(session, runtime), lastEvent: runtime.records.at(-1) };
}

export function encodeSession(session, revision) {
    reconstruct(session, revision);
    const bytes = textBytes(JSON.stringify(session));
    if (bytes.length > 16 * 1024 * 1024) throw new RangeError('记录过长，请保存JSON文件');
    const compressed = globalThis.window.pako.deflateRaw(bytes);
    return 'GM1.' + crc32(bytes).toString(16).padStart(8, '0') + '.' + toBase64(compressed);
}

export function decodeSession(token, revision) {
    if (typeof token !== 'string' || token.length > 24 * 1024 * 1024) throw new RangeError('恢复码无效');
    const parts = token.split('.');
    if (parts.length !== 3 || parts[0] !== 'GM1' || !/^[\da-f]{8}$/.test(parts[1])) throw new RangeError('恢复码格式无效');
    const bytes = unpack(fromBase64(parts[2], 16 * 1024 * 1024), true, 16 * 1024 * 1024);
    if (crc32(bytes).toString(16).padStart(8, '0') !== parts[1]) throw new RangeError('恢复码校验失败');
    const session = JSON.parse(bytesText(bytes));
    const runtime = reconstruct(session, revision);
    return { session, board: runtime.board, info: publicSession(session, runtime) };
}

function routeLink(data, map, actions) {
    const encoded = ReplaySerializer.generateShareCode(data, actions);
    if (!encoded.success) throw new RangeError(encoded.error);
    return `https://ghostmaze.novic.cc/?map=${map}&replay=${encoded.code}`;
}

export function exportSession(session, revision) {
    const runtime = reconstruct(session, revision, { trace: true });
    const currentActions = runtime.frame.route;
    const attempts = runtime.routes.map(r => ({ event: r.event, kind: r.kind, steps: r.actions.length,
        replay: routeLink(runtime.data, session.map, r.actions) }));
    return { source: 'ai-playtest', schema: 1, engine: revision, startedAt: session.startedAt,
        conditions: publicSession(session, runtime), status: runtime.board.status,
        stats: { effectiveActions: runtime.records.filter(r => r.command.type === 'act' && r.effective).length,
            invalidInputs: runtime.records.filter(r => r.command.type === 'act' && !r.effective).length,
            deaths: runtime.records.filter(r => r.change.death).length,
            undos: runtime.records.filter(r => r.command.type === 'undo' && r.effective).length,
            resets: runtime.records.filter(r => ['reset', 'restart'].includes(r.command.type)).length,
            currentSteps: runtime.state.player.steps },
        currentReplay: currentActions.length || runtime.state.isWon ? routeLink(runtime.data, session.map, currentActions) : null,
        attempts, notes: runtime.records.filter(r => r.command.type === 'note').map(r => ({ event: r.event, ...r.command })),
        trace: runtime.records, recovery: encodeSession(session, revision) };
}

export function targetOrigin(session, revision) {
    checkSession(session, revision);
    if (session.challenge !== 'shortest') throw new RangeError('本次未请求最短步数挑战');
    if (session.events.some(e => movement.has(e.command.type))) throw new RangeError('目标只能在试玩行动前计算，不能查询中间局面的剩余距离');
    return reconstruct(session, revision);
}
