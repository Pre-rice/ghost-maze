/* 自动生成，禁止手改；由scripts/package-playtest.mjs从本体生成。
 * pako许可随包附带；引擎 sha256:045d5a8353422b89980b2d2f0e2a1bf4bebdada54436f8d37792fc42bc675441
 */
(function(){
const __factories={"src/playtest/public.js":function(__load){
const { startSession, dispatchSession, reconstruct, publicSession, encodeSession, decodeSession, exportSession } = __load("src/playtest/session.js");
const { formatBoard } = __load("src/playtest/observation.js");

function createPlaytestAPI(build) {
    const revision = build.engine;
    return Object.freeze({ version: build.version, engine: revision,
        start: options => startSession(options, revision),
        command: (session, command) => dispatchSession(session, command, revision),
        observe: session => { const runtime = reconstruct(session, revision); return { board: runtime.board, info: publicSession(session, runtime) }; },
        save: session => encodeSession(session, revision), restore: token => decodeSession(token, revision),
        history: (session, { from = 1, limit = 20 } = {}) => {
            if (!Number.isInteger(from) || from < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) throw new RangeError('历史范围无效');
            return reconstruct(session, revision, { trace: true }).records.slice(from - 1, from - 1 + limit);
        },
        export: session => exportSession(session, revision), formatBoard });
}

return {"createPlaytestAPI":createPlaytestAPI};
},
"src/playtest/session.js":function(__load){
const { GameLogic } = __load("src/core/gameLogic.js");
const { MapDefinition } = __load("src/core/mapDefinition.js");
const { DataSerializer } = __load("src/core/dataSerializer.js");
const { ReplaySerializer } = __load("src/core/replaySerializer.js");
const { actionFromName } = __load("src/core/actions.js");
const { toBase64, fromBase64, crc32, unpack } = __load("src/core/binaryCodec.js");
const { observeBoard, describeVisibleChange } = __load("src/playtest/observation.js");
const { plainCopy, textBytes, bytesText } = __load("src/playtest/portable.js");

const movement = new Set(['act', 'undo', 'redo', 'reset', 'restart', 'load']);
const inputActions = new Set(['U', 'D', 'L', 'R', 'STAIR']);
const maxEvents = 100000;

function parseSource(source) {
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
function reconstruct(session, revision, { trace = false } = {}) {
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

function goalProgress(session, runtime) {
    if (session.challenge !== 'shortest') return null;
    const target = session.target || { status: 'pending', steps: null };
    const route = runtime.frame.route, aligned = route.length >= runtime.prefix.length && runtime.prefix.every((a, i) => a === route[i]);
    const steps = aligned ? route.length - runtime.prefix.length : null;
    const noNewDeaths = runtime.frame.deaths === runtime.origin.deaths;
    return { status: target.status, targetSteps: target.steps ?? null, stepsSinceStart: steps,
        eligible: aligned && noNewDeaths, met: target.status === 'solved' && runtime.state.isWon && aligned && noNewDeaths && steps === target.steps };
}

function publicSession(session, runtime) {
    return { engine: session.engine, rules: session.rules, challenge: session.challenge,
        priorKnowledge: session.priorKnowledge, inheritedExperience: session.inheritedExperience,
        origin: session.save ? 'save' : 'map', events: session.events.length,
        canUndo: runtime.cursor > 0, canRedo: runtime.cursor + 1 < runtime.frames.length,
        checkpoints: [...runtime.checkpoints.values()].map(p => ({ id: p.id, label: p.label, step: p.actions.length })),
        goal: goalProgress(session, runtime) };
}

function startSession(options, revision) {
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

function dispatchSession(source, command, revision) {
    const session = plainCopy(source), cleaned = cleanCommand(command);
    checkSession(session, revision);
    if (session.events.length >= maxEvents) throw new RangeError('本次记录已满，请导出保存');
    if (session.challenge === 'shortest' && session.target?.status !== 'solved' && movement.has(cleaned.type)) throw new RangeError('最短目标尚未得到证明，请先准备目标步数');
    session.events.push({ at: new Date().toISOString(), command: cleaned });
    const runtime = reconstruct(session, revision, { trace: 'last' });
    return { session, board: runtime.board, info: publicSession(session, runtime), lastEvent: runtime.records.at(-1) };
}

function encodeSession(session, revision) {
    reconstruct(session, revision);
    const bytes = textBytes(JSON.stringify(session));
    if (bytes.length > 16 * 1024 * 1024) throw new RangeError('记录过长，请保存JSON文件');
    const compressed = globalThis.window.pako.deflateRaw(bytes);
    return 'GM1.' + crc32(bytes).toString(16).padStart(8, '0') + '.' + toBase64(compressed);
}

function decodeSession(token, revision) {
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

function exportSession(session, revision) {
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

function targetOrigin(session, revision) {
    checkSession(session, revision);
    if (session.challenge !== 'shortest') throw new RangeError('本次未请求最短步数挑战');
    if (session.events.some(e => movement.has(e.command.type))) throw new RangeError('目标只能在试玩行动前计算，不能查询中间局面的剩余距离');
    return reconstruct(session, revision);
}

return {"parseSource":parseSource,"reconstruct":reconstruct,"goalProgress":goalProgress,"publicSession":publicSession,"startSession":startSession,"dispatchSession":dispatchSession,"encodeSession":encodeSession,"decodeSession":decodeSession,"exportSession":exportSession,"targetOrigin":targetOrigin};
},
"src/core/gameLogic.js":function(__load){
const { WALL_TYPES, START_ROOM_SIZE } = __load("src/core/constants.js");
const { GameState } = __load("src/core/gameState.js");
const { directionIndex } = __load("src/core/mapDataUtils.js");

// ==================================================
//  GameLogic: 纯函数模块，处理所有游戏逻辑
// ==================================================

const GameLogic = {
    /**
     * 从 MapDefinition 创建游戏初始状态
     */
    createInitialState(mapDef) {
        // 创建每层的动态状态
        const layerStates = mapDef.layers.map((layerDef, layerIndex) => {
            // 复制初始墙体状态
            const hWallStates = layerDef.initialWalls.h.map(row => 
                row.map(wall => ({
                    type: wall.type,
                    keys: wall.keys || 0,
                    direction: wall.direction ? { ...wall.direction } : null,
                    letter: wall.letter || null,
                    initialState: wall.initialState || 'closed',
                    currentState: wall.initialState || 'closed'
                }))
            );
            const vWallStates = layerDef.initialWalls.v.map(row => 
                row.map(wall => ({
                    type: wall.type,
                    keys: wall.keys || 0,
                    direction: wall.direction ? { ...wall.direction } : null,
                    letter: wall.letter || null,
                    initialState: wall.initialState || 'closed',
                    currentState: wall.initialState || 'closed'
                }))
            );

            return {
                ghosts: layerDef.initialEntities.ghosts.map((g, idx) => ({
                    x: g.x,
                    y: g.y,
                    id: g.id !== undefined ? g.id : idx,
                    trail: []
                })),
                items: layerDef.initialEntities.items.map(i => ({
                    x: i.x,
                    y: i.y,
                    type: i.type || 'key'
                })),
                wallStates: { h: hWallStates, v: vWallStates }
            };
        });

        // 创建每层的视野
        const seenCells = [];
        for (let i = 0; i < mapDef.layerCount; i++) {
            seenCells.push(
                Array(mapDef.height).fill(null).map(() => Array(mapDef.width).fill(false))
            );
        }

        const initialState = new GameState({
            player: {
                x: mapDef.playerStart.x,
                y: mapDef.playerStart.y,
                layer: mapDef.playerStart.layer,
                hp: mapDef.initialHealth,
                keys: 0,
                steps: 0,
                trail: []
            },
            loopCount: 0,
            layerStates: layerStates,
            seenCells: seenCells,
            isRevivalPoint: true
        });

        // 出生也算抵达：同格钥匙、碰撞和终点与普通入场一致，不推进鬼或计步。
        this.handleItemPickup(initialState, mapDef);
        this.checkCollisions(initialState, mapDef);
        this.checkWinLossConditions(initialState, mapDef);
        return this.updateVisibility(initialState, mapDef);
    },

    /**
     * 根据动作计算下一个状态
     * @returns {GameState} 新状态，如果无变化则返回原状态
     */
    calculateNextState(currentState, action, mapDef, { trails = true, visibility = true, ghostDiagnostics = null } = {}) {
        if (currentState.isDead || currentState.isWon) {
            // 特殊情况：复活动作
            if (currentState.isDead && action.type === 'REVIVE') {
                return this.handleRevive(currentState, mapDef);
            }
            return currentState;
        }

        const nextState = currentState.clone();
        const originalPlayerPos = { 
            x: currentState.player.x, 
            y: currentState.player.y, 
            layer: currentState.player.layer 
        };

        let stateChanged = false;
        let isStairAction = false;

        switch (action.type) {
            case 'MOVE':
                if (directionIndex(action.payload) < 0) return currentState;
                stateChanged = this.handleMove(nextState, action.payload, mapDef, trails);
                break;
            case 'USE_STAIR':
                stateChanged = this.handleUseStair(nextState, mapDef);
                isStairAction = true;
                break;
            case 'REVIVE':
                return currentState;
            default:
                return currentState;
        }

        if (!stateChanged) {
            return currentState;
        }

        nextState.player.steps++;

        // 按顺序处理玩家操作后的所有变化
        this.handleItemPickup(nextState, mapDef);

        // 已有鬼占着落脚格时先判接触，终点不能豁免已经发生的碰撞。
        this.checkCollisions(nextState, mapDef);
        if (nextState.isDead) {
            if (visibility) this.updateVisibility(nextState, mapDef);
            nextState.isRevivalPoint = false;
            return nextState;
        }

        // 玩家已踩到终点：立即判胜，先于鬼的移动/碰撞（避免同回合被鬼咬死导致 isWon/isDead 并存）
        if (this._isPlayerOnEndPos(nextState, mapDef)) {
            nextState.isWon = true;
            nextState.isRevivalPoint = false;
            if (visibility) this.updateVisibility(nextState, mapDef);
            return nextState;
        }

        if (isStairAction) {
            // 玩家使用楼梯：原层追离开的格子，到达层追玩家的新位置
            const threatened = this.moveGhostsAfterStair(nextState, originalPlayerPos, mapDef, trails, ghostDiagnostics);
            this.checkCollisions(nextState, mapDef, threatened);
        } else {
            // 普通移动：处理鬼的移动（包括跨楼梯追踪）
            const threatened = this.moveGhostsWithStairChase(nextState, originalPlayerPos, mapDef, trails, ghostDiagnostics);
            this.checkCollisions(nextState, mapDef, threatened);
        }
        
        this.checkCollisions(nextState, mapDef);
        if (visibility) this.updateVisibility(nextState, mapDef);
        this.checkWinLossConditions(nextState, mapDef);

        nextState.isRevivalPoint = false;
        return nextState;
    },

    /**
     * 处理移动动作
     */
    handleMove(state, direction, mapDef, trails = true) {
        const p = state.player;
        const playerLayer = p.layer;
        const layerDef = mapDef.layers[playerLayer];
        const layerState = state.layerStates[playerLayer];
        
        // 检查是否按下了按钮
        const buttons = layerDef.initialEntities.buttons || [];
        const button = buttons.find(b => 
            b.x === p.x && 
            b.y === p.y && 
            b.direction.dx === direction.dx && 
            b.direction.dy === direction.dy
        );
        if (button) {
            return this.handlePressButton(state, { letter: button.letter }, mapDef);
        }

        const newX = p.x + direction.dx;
        const newY = p.y + direction.dy;

        // 边界检查
        if (newX < 0 || newX >= mapDef.width || newY < 0 || newY >= mapDef.height) {
            return false;
        }

        // 检查目标格子是否是有效地图方格
        if (!layerDef.activeCells[newY][newX]) {
            return false;
        }

        // 获取墙体
        const wallState = this._getWallBetween(p, { x: newX, y: newY }, layerState.wallStates, direction);
        const wallDef = wallState;

        if (wallDef && wallDef.type !== WALL_TYPES.EMPTY) {
            // 实心墙或玻璃墙不可通过
            if (wallDef.type === WALL_TYPES.SOLID || wallDef.type === WALL_TYPES.GLASS) {
                return false;
            }
            // 单向门检查方向
            if (wallDef.type === WALL_TYPES.ONE_WAY) {
                if (!wallDef.direction || direction.dx !== wallDef.direction.dx || direction.dy !== wallDef.direction.dy) {
                    return false;
                }
            }
            // 数字门检查钥匙数量
            if (wallDef.type === WALL_TYPES.LOCKED) {
                if (p.keys < (wallDef.keys || 0)) {
                    return false;
                }
                // 消耗门：将墙体类型设为空
                if (wallState) {
                    const axis = direction.dx ? 'v' : 'h';
                    const x = p.x + (direction.dx === 1 ? 1 : 0);
                    const y = p.y + (direction.dy === 1 ? 1 : 0);
                    state.setWall(playerLayer, axis, x, y, { type: WALL_TYPES.EMPTY, keys: 0 });
                }
            }
            // 字母门检查开关状态
            if (wallDef.type === WALL_TYPES.LETTER_DOOR) {
                if (wallState && wallState.currentState === 'closed') {
                    return false;
                }
            }
        }

        // 添加轨迹
        if (trails) {
            p.trail.unshift({ x: p.x, y: p.y, timestamp: Date.now() });
            if (p.trail.length > 10) p.trail.pop();
        }

        // 更新玩家位置
        p.x = newX;
        p.y = newY;

        return true;
    },

    /**
     * 处理使用楼梯
     */
    handleUseStair(state, mapDef) {
        if (!mapDef.multiLayerMode) return false;

        const p = state.player;
        const stairs = mapDef.stairs;
        
        // 查找玩家位置的楼梯
        const stair = stairs.find(s => 
            s.x === p.x && 
            s.y === p.y && 
            s.layer === p.layer
        );

        if (!stair) return false;

        // 计算目标层
        const targetLayer = stair.direction === 'up' ? p.layer + 1 : p.layer - 1;
        if (targetLayer < 0 || targetLayer >= mapDef.layerCount) return false;

        // 检查目标层是否有对应楼梯
        const targetStair = stairs.find(s =>
            s.x === p.x &&
            s.y === p.y &&
            s.layer === targetLayer &&
            s.direction === (stair.direction === 'up' ? 'down' : 'up')
        );

        if (!targetStair) return false;

        // 执行上下楼
        p.layer = targetLayer;

        return true;
    },

    /**
     * 处理按下按钮
     */
    handlePressButton(state, payload, mapDef) {
        const letter = payload.letter;
        const walls = mapDef.letterWalls.get(letter) || [];
        for (const { layer, axis, x, y } of walls) {
            const wall = state.layerStates[layer].wallStates[axis][y][x];
            state.setWall(layer, axis, x, y, { currentState: wall.currentState === 'closed' ? 'open' : 'closed' });
        }
        return walls.length > 0;
    },

    /**
     * 处理物品拾取
     */
    handleItemPickup(state, mapDef) {
        const p = state.player;
        const items = state.layerStates[p.layer].items;
        
        const itemIndex = items.findIndex(item => item.x === p.x && item.y === p.y);
        if (itemIndex > -1) {
            const item = items[itemIndex];
            if (item.type === 'key') {
                p.keys++;
            }
            items.splice(itemIndex, 1);
        }
    },

    /** 从可见位置和当前墙态提出意图；仍看得到操作后玩家的鬼优先。 */
    _getGhostMoveIntents(ghosts, playerBefore, playerAfter, layerDef, layerState) {
        const intents = [];
        for (const ghost of ghosts) {
            const seesAfter = !!playerAfter && this._canGhostSeePlayer(ghost, playerAfter, layerDef, layerState);
            const sawBefore = this._canGhostSeePlayer(ghost, playerBefore, layerDef, layerState);
            const target = seesAfter ? playerAfter : sawBefore ? playerBefore : null;
            if (!target) continue;
            const path = this._findShortestPath(ghost, target, layerDef, layerState);
            if (path && path.length > 1) intents.push({ ghost, nextStep: path[1], seesAfter });
        }
        return intents;
    },

    /** 上下楼与移动一样推进一回合：原层追旧位置，到达层追新位置。 */
    moveGhostsAfterStair(state, originalPlayerPos, mapDef, trails = true, diagnostics = null) {
        const layer = originalPlayerPos.layer, ghosts = state.layerStates[layer].ghosts;
        const intents = this._getGhostMoveIntents(ghosts, originalPlayerPos, null, mapDef.layers[layer], state.layerStates[layer]);
        const result = this._resolveGhostMoveConflicts(ghosts, intents, trails);
        if (diagnostics) diagnostics.push(...result.conflicts.map(c => ({ ...c, layer })));
        // 入场前已检查目标楼梯格的占位；到达层的鬼仍要正常追击一次。
        const targetLayer = state.player.layer, targetGhosts = state.layerStates[targetLayer].ghosts;
        const targetIntents = this._getGhostMoveIntents(targetGhosts, null, state.player, mapDef.layers[targetLayer], state.layerStates[targetLayer]);
        const targetResult = this._resolveGhostMoveConflicts(targetGhosts, targetIntents, trails, state.player);
        if (diagnostics) diagnostics.push(...targetResult.conflicts.map(c => ({ ...c, layer: targetLayer })));
        return targetResult.captured;
    },

    /** 普通追击与楼梯入场一起争位，楼梯不绕过占位或冲突规则。 */
    moveGhostsWithStairChase(state, originalPlayerPos, mapDef, trails = true, diagnostics = null) {
        const layer = state.player.layer, ghosts = state.layerStates[layer].ghosts;
        const intents = this._getGhostMoveIntents(ghosts, originalPlayerPos, state.player, mapDef.layers[layer], state.layerStates[layer]);
        if (mapDef.multiLayerMode) intents.push(...this._getGhostStairChaseIntents(state, originalPlayerPos, mapDef));
        const result = this._resolveGhostMoveConflicts(ghosts, intents, trails, state.player, intent => {
            if (intent.fromLayer === undefined) return;
            const source = state.layerStates[intent.fromLayer].ghosts;
            source.splice(source.indexOf(intent.ghost), 1);
            ghosts.push(intent.ghost);
            intent.ghost.trail = [];
        });
        if (diagnostics) diagnostics.push(...result.conflicts.map(c => ({ ...c, layer })));
        return result.captured;
    },

    /** 配对楼梯格互为相邻格；站上去即可互见，不能等离开后才追击。 */
    _getGhostStairChaseIntents(state, originalPlayerPos, mapDef) {
        const playerAfter = state.player;
        const findOpposite = pos => {
            const stair = mapDef.stairs.find(s => s.x === pos.x && s.y === pos.y && s.layer === pos.layer);
            if (!stair) return null;
            const fromLayer = stair.direction === 'up' ? pos.layer + 1 : pos.layer - 1;
            const paired = mapDef.stairs.find(s => s.x === stair.x && s.y === stair.y && s.layer === fromLayer && s.direction !== stair.direction);
            return paired ? { fromLayer, paired } : null;
        };
        const before = findOpposite(originalPlayerPos), after = findOpposite(playerAfter);
        const intents = new Map();
        // 新位置优先：跨层鬼能直接看到站在配对端点的玩家。
        for (const [opposite, target, seesAfter] of [[after, playerAfter, true], [before, originalPlayerPos, false]]) {
            if (!opposite) continue;
            const { fromLayer, paired } = opposite;
            for (const ghost of state.layerStates[fromLayer].ghosts) {
                if (ghost.x !== paired.x || ghost.y !== paired.y || intents.has(ghost)) continue;
                intents.set(ghost, { ghost, nextStep: { x: target.x, y: target.y }, seesAfter, fromLayer });
            }
        }
        return [...intents.values()];
    },

    /**
     * 先按目标格一次性裁定：夹击玩家时共同入格；空格有新目标视线者优先，同级并列共同入格。
     * 再按空位推进整条追逐队列；鬼不会交换占位，也不使用编号或列表顺序。
     */
    _resolveGhostMoveConflicts(ghosts, moveIntents, trails = true, player = null, onMove = null) {
        const groups = new Map(), conflicts = [], winners = [];
        const captured = !!player && moveIntents.some(i => i.nextStep.x === player.x && i.nextStep.y === player.y);
        for (const intent of moveIntents) {
            const key = `${intent.nextStep.x},${intent.nextStep.y}`;
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(intent);
        }
        for (const contenders of groups.values()) {
            const priority = contenders.some(i => i.seesAfter);
            const preferred = contenders.filter(i => !!i.seesAfter === priority);
            const capturesPlayer = !!player && contenders[0].nextStep.x === player.x && contenders[0].nextStep.y === player.y;
            if (capturesPlayer) winners.push(...contenders);
            else winners.push(...preferred);
            if (contenders.length > 1) conflicts.push({
                target: { ...contenders[0].nextStep },
                contenders: contenders.map(i => ({ from: { x: i.ghost.x, y: i.ghost.y }, seesAfter: !!i.seesAfter, fromLayer: i.fromLayer })),
                decision: capturesPlayer ? 'player_capture_overlap' : preferred.length === 1 ? 'visible_target_priority' : 'equal_priority_overlap',
                capturesPlayer
            });
        }
        let pending = winners;
        while (pending.length) {
            const occupied = new Set(ghosts.map(g => `${g.x},${g.y}`));
            const ready = pending.filter(i => !occupied.has(`${i.nextStep.x},${i.nextStep.y}`));
            if (!ready.length) break;
            const moved = new Set(ready);
            for (const intent of ready) {
                const { ghost, nextStep } = intent;
                if (trails) {
                    ghost.trail.unshift({ x: ghost.x, y: ghost.y, timestamp: Date.now() });
                    if (ghost.trail.length > 5) ghost.trail.pop();
                }
                ghost.x = nextStep.x; ghost.y = nextStep.y;
                if (onMove) onMove(intent);
            }
            pending = pending.filter(i => !moved.has(i));
        }
        return { captured, conflicts };
    },

    /**
     * 检查碰撞
     */
    checkCollisions(state, mapDef, threatened = false) {
        if (state.isDead) return;
        const p = state.player;
        const ghosts = state.layerStates[p.layer].ghosts;
        
        if (threatened || ghosts.some(g => g.x === p.x && g.y === p.y)) {
            state.isDead = true;
            state.deathReason = 'ghost';
            
            if (mapDef.gameMode === 'exploration') {
                p.hp--;
            }
        }
    },

    /**
     * 更新视野
     */
    updateVisibility(state, mapDef) {
        const p = state.player;
        const layer = p.layer;
        const writtenRows = new Set();
        const mark = (li, x, y) => {
            if (state.seenCells[li][y][x]) return;
            const key = `${li},${y}`;
            if (!writtenRows.has(key)) {
                state.seenCells[li] = state.seenCells[li].slice();
                state.seenCells[li][y] = state.seenCells[li][y].slice();
                writtenRows.add(key);
            }
            state.seenCells[li][y][x] = true;
        };
        const layerDef = mapDef.layers[layer];
        const layerState = state.layerStates[layer];

        // 常规模式：揭示出生房间
        if (mapDef.editorMode === 'regular') {
            const roomY = mapDef.height - START_ROOM_SIZE;
            for (let y = roomY; y < roomY + START_ROOM_SIZE; y++) {
                for (let x = 0; x < START_ROOM_SIZE; x++) {
                    if (y >= 0 && y < mapDef.height && x >= 0 && x < mapDef.width) {
                        mark(layer, x, y);
                    }
                }
            }
        } else {
            // 自由模式：揭示起点
            const start = layerDef.initialEntities.customStartPos;
            if (start && state.seenCells[layer][start.y] && start.x >= 0 && start.x < mapDef.width) {
                mark(layer, start.x, start.y);
            }
        }

        // 玩家当前位置可见
        mark(layer, p.x, p.y);

        // 四方向射线投射
        const castRay = (dx, dy) => {
            let x = p.x + dx;
            let y = p.y + dy;
            
            while (x >= 0 && x < mapDef.width && y >= 0 && y < mapDef.height) {
                // 检查是否是有效格子
                if (!layerDef.activeCells[y][x]) break;

                // 检查墙体
                let wall;
                if (dx === 1) wall = layerState.wallStates.v[p.y][x];
                else if (dx === -1) wall = layerState.wallStates.v[p.y][x + 1];
                else if (dy === 1) wall = layerState.wallStates.h[y][p.x];
                else if (dy === -1) wall = layerState.wallStates.h[y + 1][p.x];

                if (wall && wall.type !== WALL_TYPES.EMPTY && wall.type !== WALL_TYPES.GLASS) {
                    // 已打开的字母门不阻挡玩家视野（与幽灵视野 _canGhostSeePlayer 保持一致，且与渲染层画成敞开相符）
                    if (!(wall.type === WALL_TYPES.LETTER_DOOR && wall.currentState === 'open')) {
                        break;
                    }
                }

                mark(layer, x, y);
                x += dx;
                y += dy;
            }
        };

        castRay(1, 0);
        castRay(-1, 0);
        castRay(0, 1);
        castRay(0, -1);

        // 多层模式：楼梯视野穿透
        if (mapDef.multiLayerMode) {
            const playerStair = mapDef.stairs.find(s => 
                s.x === p.x && s.y === p.y && s.layer === p.layer
            );
            if (playerStair) {
                const targetLayer = playerStair.direction === 'up' ? p.layer + 1 : p.layer - 1;
                if (targetLayer >= 0 && targetLayer < mapDef.layerCount && state.seenCells[targetLayer]) {
                    mark(targetLayer, p.x, p.y);
                }
            }
        }

        return state;
    },

    /**
     * 检查胜利/失败条件
     */
    checkWinLossConditions(state, mapDef) {
        const p = state.player;
        const layerDef = mapDef.layers[p.layer];
        const endPos = layerDef.initialEntities.endPos;

        // 检查胜利
        if (!state.isDead && endPos && p.x === endPos.x && p.y === endPos.y) {
            state.isWon = true;
        }

        // 检查失败
        if (mapDef.gameMode === 'exploration' && p.hp <= 0) {
            state.isDead = true;
            state.deathReason = 'no_hp';
        }
    },

    /**
     * 判断玩家是否已到达当前层终点
     */
    _isPlayerOnEndPos(state, mapDef) {
        const p = state.player;
        const layerDef = mapDef.layers[p.layer];
        const endPos = layerDef.initialEntities.endPos;
        return !!endPos && p.x === endPos.x && p.y === endPos.y;
    },

    /**
     * 处理复活
     */
    isSpawnOccupied(state, mapDef) {
        const start = mapDef.playerStart;
        return state.layerStates[start.layer].ghosts.some(g => g.x === start.x && g.y === start.y);
    },

    handleRevive(currentState, mapDef) {
        if (!currentState.isDead) return currentState;
        if (mapDef.gameMode === 'exploration') {
            if (currentState.player.hp > 0 && !this.isSpawnOccupied(currentState, mapDef)) {
                const nextState = currentState.clone();
                nextState.isDead = false;
                nextState.deathReason = '';
                
                // 回到出生点
                nextState.player.x = mapDef.playerStart.x;
                nextState.player.y = mapDef.playerStart.y;
                nextState.player.layer = mapDef.playerStart.layer;
                nextState.player.trail = [];
                nextState.isRevivalPoint = true;
                
                return this.updateVisibility(nextState, mapDef);
            }
        } else {
            // 死亡循环模式：重置但保留视野
            const nextState = this.createInitialState(mapDef);
            nextState.loopCount = currentState.loopCount + 1;
            nextState.seenCells = currentState.seenCells.slice();
            nextState.isRevivalPoint = true;
            return this.updateVisibility(nextState, mapDef);
        }
        
        return currentState;
    },

    // === 辅助函数 ===

    _getWallBetween(pos1, pos2, walls, direction) {
        if (direction.dx === 1) return walls.v[pos1.y] ? walls.v[pos1.y][pos1.x + 1] : null;
        if (direction.dx === -1) return walls.v[pos1.y] ? walls.v[pos1.y][pos1.x] : null;
        if (direction.dy === 1) return walls.h[pos1.y + 1] ? walls.h[pos1.y + 1][pos1.x] : null;
        if (direction.dy === -1) return walls.h[pos1.y] ? walls.h[pos1.y][pos1.x] : null;
        return null;
    },

    _canGhostSeePlayer(ghost, playerPos, layerDef, layerState) {
        if (!playerPos || (ghost.x !== playerPos.x && ghost.y !== playerPos.y)) return false;

        const wallStates = layerState.wallStates;

        if (ghost.x === playerPos.x) {
            const startY = Math.min(ghost.y, playerPos.y);
            const endY = Math.max(ghost.y, playerPos.y);
            for (let y = startY; y < endY; y++) {
                // 虚空不是可透视的通道，与玩家射线一样中断视线。
                if (!layerDef.activeCells[y + 1]?.[ghost.x]) return false;
                const wall = wallStates.h[y + 1][ghost.x];
                if (wall && wall.type !== WALL_TYPES.EMPTY && wall.type !== WALL_TYPES.GLASS) {
                    if (!(wall.type === WALL_TYPES.LETTER_DOOR && wall.currentState === 'open')) {
                        return false;
                    }
                }
            }
        } else {
            const startX = Math.min(ghost.x, playerPos.x);
            const endX = Math.max(ghost.x, playerPos.x);
            for (let x = startX; x < endX; x++) {
                if (!layerDef.activeCells[ghost.y]?.[x + 1]) return false;
                const wall = wallStates.v[ghost.y][x + 1];
                if (wall && wall.type !== WALL_TYPES.EMPTY && wall.type !== WALL_TYPES.GLASS) {
                    if (!(wall.type === WALL_TYPES.LETTER_DOOR && wall.currentState === 'open')) {
                        return false;
                    }
                }
            }
        }
        return true;
    },

    _findShortestPath(start, end, layerDef, layerState) {
        const width = layerDef.activeCells[0].length, height = layerDef.activeCells.length;
        const first = start.y * width + start.x, target = end.y * width + end.x;
        const parents = new Int32Array(width * height).fill(-1);
        const queue = new Int32Array(width * height);
        let head = 0, tail = 1;
        queue[0] = first; parents[first] = first;
        const neighbors = [{ dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }];
        while (head < tail) {
            const cell = queue[head++], x = cell % width, y = Math.floor(cell / width);
            if (cell === target) {
                const path = [];
                for (let at = target;; at = parents[at]) {
                    path.push({ x: at % width, y: Math.floor(at / width) });
                    if (at === first) return path.reverse();
                }
            }
            for (const direction of neighbors) {
                const nx = x + direction.dx, ny = y + direction.dy;
                if (nx < 0 || ny < 0 || nx >= width || ny >= height || !layerDef.activeCells[ny][nx]) continue;
                const next = ny * width + nx;
                if (parents[next] !== -1) continue;
                const wall = this._getWallBetween({ x, y }, { x: nx, y: ny }, layerState.wallStates, direction);
                if (wall && wall.type !== WALL_TYPES.EMPTY && !(wall.type === WALL_TYPES.LETTER_DOOR && wall.currentState === 'open')) continue;
                parents[next] = cell; queue[tail++] = next;
            }
        }
        return null;
    }
};

return {"GameLogic":GameLogic};
},
"src/core/constants.js":function(__load){
const WALL_TYPES = {
    EMPTY: 0,
    SOLID: 1,
    DOOR: 2,
    LOCKED: 3,
    ONE_WAY: 4,
    GLASS: 5,
    LETTER_DOOR: 6
};

// 起始房间（出生点）固定为左下角 3×3
const START_ROOM_SIZE = 3;
const getStartRoomY = (height) => height - START_ROOM_SIZE;

// 画布边距（四周留白，游戏态与编辑器态共用）
const EDITOR_PADDING = 15;

// 地图尺寸边界（随机生成 / 编辑器改尺寸共用）
const MAP_SIZE_MIN = 8;
const MAP_SIZE_MAX = 20;

// 随机生成默认鬼数量
const DEFAULT_GHOST_COUNT = 3;

// 按键/D-pad 连续移动与自动寻路的步进间隔（ms）
const MOVE_INTERVAL_MS = 200;

const GAME_STATES = {
    MENU: 'menu',
    PLAYING: 'playing',
    DEAD: 'dead',
    WON: 'won',
    REPLAY: 'replay',
    EDITOR: 'editor'
};

const EDITOR_TOOLS = {
    WALL: 'wall',
    GLASS: 'glass',
    DOOR: 'door',
    ONE_WAY: 'oneway',
    LOCK: 'lock',
    LETTER_DOOR: 'letter',
    BUTTON: 'button',
    GHOST: 'ghost',
    KEY: 'key',
    START: 'start',
    END: 'end',
    STAIR: 'stair',
    ERASER: 'eraser',
    GRID: 'grid'
};

return {"WALL_TYPES":WALL_TYPES,"START_ROOM_SIZE":START_ROOM_SIZE,"getStartRoomY":getStartRoomY,"EDITOR_PADDING":EDITOR_PADDING,"MAP_SIZE_MIN":MAP_SIZE_MIN,"MAP_SIZE_MAX":MAP_SIZE_MAX,"DEFAULT_GHOST_COUNT":DEFAULT_GHOST_COUNT,"MOVE_INTERVAL_MS":MOVE_INTERVAL_MS,"GAME_STATES":GAME_STATES,"EDITOR_TOOLS":EDITOR_TOOLS};
},
"src/core/gameState.js":function(__load){
/** 完整动态局面；历史间共用未改变的墙行与探索行。 */
class GameState {
    constructor(data) {
        Object.assign(this, {
            loopCount: 0, isDead: false, isWon: false, deathReason: '', isRevivalPoint: false
        }, structuredClone(data));
    }

    clone() {
        const next = Object.create(GameState.prototype);
        Object.assign(next, this);
        next.player = { ...this.player, trail: this.player.trail.slice() };
        next.layerStates = this.layerStates.map(layer => ({
            ghosts: layer.ghosts.map(g => ({ ...g, trail: (g.trail || []).slice() })),
            items: layer.items.slice(),
            wallStates: layer.wallStates
        }));
        next.seenCells = this.seenCells.slice();
        return next;
    }

    /** 写墙时只复制所属行，不触及历史或地图定义。 */
    setWall(layer, axis, x, y, changes) {
        const previous = this.layerStates[layer].wallStates;
        this.layerStates[layer].wallStates = { ...previous, [axis]: previous[axis].slice() };
        const rows = this.layerStates[layer].wallStates[axis];
        rows[y] = rows[y].slice();
        rows[y][x] = { ...rows[y][x], ...changes };
    }
}

return {"GameState":GameState};
},
"src/core/mapDataUtils.js":function(__load){
const { WALL_TYPES, MAP_SIZE_MIN, MAP_SIZE_MAX } = __load("src/core/constants.js");
const { isValidButtonAttachment } = __load("src/core/pathfinding.js");

const emptyWall = () => ({ type: WALL_TYPES.EMPTY, keys: 0 });

function hasWallGrid(layer, width, height) {
    return Array.isArray(layer.hWalls) && layer.hWalls.length === height + 1 &&
        layer.hWalls.every(row => Array.isArray(row) && row.length === width) &&
        Array.isArray(layer.vWalls) && layer.vWalls.length === height &&
        layer.vWalls.every(row => Array.isArray(row) && row.length === width + 1);
}

function isActiveAt(activeCells, x, y, width, height) {
    if (x < 0 || x >= width || y < 0 || y >= height) return false;
    return activeCells ? activeCells[y]?.[x] === true : true;
}

/** 门、玻璃和可编辑墙段必须连接两个活动格；外圈与虚空边界不可改成通路。 */
function isInteriorWall(wall, width, height, activeCells = null) {
    if (!wall || !Number.isInteger(wall.x) || !Number.isInteger(wall.y)) return false;
    const { x, y, type } = wall;
    if (type === 'h') return isActiveAt(activeCells, x, y - 1, width, height) && isActiveAt(activeCells, x, y, width, height);
    if (type === 'v') return isActiveAt(activeCells, x - 1, y, width, height) && isActiveAt(activeCells, x, y, width, height);
    return false;
}

function normalizeLayerVoidWalls(layer, width, height) {
    if (!layer || !hasWallGrid(layer, width, height)) return layer;
    const { activeCells } = layer;
    if (activeCells && (activeCells.length !== height || activeCells.some(row => !Array.isArray(row) || row.length !== width))) return layer;

    const hAbove = Array(width).fill(0);
    const hTotals = Array(width).fill(0);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) if (isActiveAt(activeCells, x, y, width, height)) hTotals[x]++;
    }

    let hChanged = false;
    const hWalls = layer.hWalls.map((row, y) => row.map((wall, x) => {
        const above = hAbove[x] > 0;
        const below = hTotals[x] > hAbove[x];
        const voidOnly = !isActiveAt(activeCells, x, y - 1, width, height) &&
            !isActiveAt(activeCells, x, y, width, height);
        const validWallType = wall && Number.isInteger(wall.type) && wall.type >= WALL_TYPES.EMPTY && wall.type <= WALL_TYPES.LETTER_DOOR;
        const canAffectSight = above && below;
        if (voidOnly && validWallType && wall.type !== WALL_TYPES.EMPTY && !canAffectSight) {
            hChanged = true;
            return emptyWall();
        }
        return wall;
    }).map((cell, x) => {
        if (y < height && isActiveAt(activeCells, x, y, width, height)) hAbove[x]++;
        return cell;
    }));

    const vLeft = Array(height).fill(0);
    const vTotals = Array(height).fill(0);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) if (isActiveAt(activeCells, x, y, width, height)) vTotals[y]++;
    }

    let vChanged = false;
    const vWalls = layer.vWalls.map((row, y) => row.map((wall, x) => {
        const left = vLeft[y] > 0;
        const right = vTotals[y] > vLeft[y];
        const voidOnly = !isActiveAt(activeCells, x - 1, y, width, height) &&
            !isActiveAt(activeCells, x, y, width, height);
        const validWallType = wall && Number.isInteger(wall.type) && wall.type >= WALL_TYPES.EMPTY && wall.type <= WALL_TYPES.LETTER_DOOR;
        const canAffectSight = left && right;
        const normalized = voidOnly && validWallType && wall.type !== WALL_TYPES.EMPTY && !canAffectSight
            ? (vChanged = true, emptyWall()) : wall;
        if (x < width && isActiveAt(activeCells, x, y, width, height)) vLeft[y]++;
        return normalized;
    }));

    return hChanged || vChanged ? { ...layer, hWalls, vWalls } : layer;
}

/** 清理不会参与移动、渲染或任何活动格直线视线的虚空墙段；不改原对象 */
function normalizeVoidWalls(mapData) {
    if (!mapData || !Number.isInteger(mapData.width) || !Number.isInteger(mapData.height)) return mapData;
    const { width, height } = mapData;
    let result = normalizeLayerVoidWalls(mapData, width, height);
    if (Array.isArray(mapData.layers)) {
        const layers = mapData.layers.map(layer => normalizeLayerVoidWalls(layer, width, height));
        if (layers.some((layer, index) => layer !== mapData.layers[index])) result = { ...result, layers };
    }
    return result;
}

/** 校验所有层的按钮仍依附在实心墙或活动区边界上 */
function validateButtonAttachments(mapData) {
    if (!mapData) return { valid: false, error: '地图数据无效。' };
    const { width, height, editorMode } = mapData;
    const layers = [mapData, ...(Array.isArray(mapData.layers) ? mapData.layers : [])];
    for (let index = 0; index < layers.length; index++) {
        const layer = layers[index];
        if (!layer) continue;
        const buttons = layer.buttons || [];
        if (!Array.isArray(buttons)) return { valid: false, error: '按钮数据无效。' };
        for (const button of buttons) {
            if (!isValidButtonAttachment(button, {
                width, height, editorMode, activeCells: layer.activeCells,
                hWalls: layer.hWalls, vWalls: layer.vWalls
            })) {
                return { valid: false, error: '按钮必须依附在实心墙或活动区边界上。' };
            }
        }
    }
    return { valid: true };
}

const copy = value => structuredClone(value);
const point = value => value ? { x: value.x, y: value.y } : null;
const uint = value => Number.isInteger(value) && value >= 0 && value <= 0xffffffff;
const DIRECTIONS = Object.freeze([{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }]);
const directionIndex = direction => DIRECTIONS.findIndex(d => d.dx === direction?.dx && d.dy === direction?.dy);

/** 地图对象的唯一装配入口；各层数据只保留一份，已有 JSON 作品也由此接入。 */
function normalizeMapData(source) {
    if (!source || typeof source !== 'object') throw new RangeError('需要地图数据');
    const data = normalizeVoidWalls(source);
    const { width, height } = data;
    const layerCount = data.layerCount ?? (data.layers?.length || 1);
    const layers = Array.from({ length: layerCount }, (_, index) => {
        const layer = data.layers?.[index] || (index === 0 ? { ...data, ghosts: data.initialGhosts } : {});
        const cleanWall = (wall, axis, x, y) => {
            if (!wall || !Number.isInteger(wall.type) || wall.type < 0 || wall.type > WALL_TYPES.LETTER_DOOR) throw new RangeError('墙类型无效');
            if (wall.type > WALL_TYPES.SOLID && !isInteriorWall({ type: axis, x, y }, width, height, layer.activeCells)) {
                const adjacent = isActiveAt(layer.activeCells, x, y, width, height) ||
                    isActiveAt(layer.activeCells, axis === 'v' ? x - 1 : x, axis === 'h' ? y - 1 : y, width, height);
                return { type: adjacent ? WALL_TYPES.SOLID : WALL_TYPES.EMPTY, keys: 0 };
            }
            const result = { type: wall.type, keys: wall.type === WALL_TYPES.LOCKED ? (wall.keys ?? 0) : 0 };
            if (wall.type === WALL_TYPES.ONE_WAY) result.direction = copy(wall.direction);
            if (wall.type === WALL_TYPES.LETTER_DOOR) {
                result.letter = wall.letter;
                result.initialState = wall.initialState ?? 'closed';
            }
            return result;
        };
        return {
            hWalls: layer.hWalls?.map((row, y) => row.map((wall, x) => cleanWall(wall, 'h', x, y))) || [],
            vWalls: layer.vWalls?.map((row, y) => row.map((wall, x) => cleanWall(wall, 'v', x, y))) || [],
            activeCells: copy(layer.activeCells || Array.from({ length: height }, () => Array(width).fill(true))),
            ghosts: (layer.ghosts || []).map((g, id) => ({ ...point(g), id })),
            items: (layer.items || []).map(item => ({ ...point(item), type: item.type ?? 'key' })),
            buttons: (layer.buttons || []).map(b => ({ ...point(b), direction: copy(b.direction), letter: b.letter })),
            endPos: point(layer.endPos), customStartPos: point(layer.customStartPos)
        };
    });
    const editorMode = data.editorMode ?? 'regular';
    if (editorMode === 'regular' && !layers.some(layer => layer.customStartPos)) layers[0].customStartPos = point(data.startPos || { x: 1, y: height - 2 });
    return {
        width, height, editorMode, gameMode: data.gameMode ?? 'exploration',
        initialHealth: data.gameMode === 'death-loop' ? 5 : (data.initialHealth ?? 5),
        multiLayerMode: layerCount > 1, layerCount, layers,
        stairs: (data.stairs || []).map(s => ({ ...point(s), layer: s.layer, direction: s.direction }))
            .sort((a, b) => a.layer - b.layer || a.y - b.y || a.x - b.x)
    };
}

/** 游玩、编辑导出、AI 与两类分享码共用的完整校验。失败不修改输入。 */
function validateMapData(source, { requireEnd = true } = {}) {
    try {
        const require = (condition, message) => { if (!condition) throw new RangeError(message); };
        require(source && typeof source === 'object', '地图数据无效');
        for (const name of ['width', 'height']) require(Number.isInteger(source[name]) && source[name] >= MAP_SIZE_MIN && source[name] <= MAP_SIZE_MAX, '地图尺寸必须为 8 到 20');
        const count = source.layerCount ?? (source.layers?.length || 1);
        require(Number.isInteger(count) && count >= 1 && count <= 10, '层数必须为 1 到 10');
        require(source.layers == null || (Array.isArray(source.layers) && (source.layers.length === count || (count === 1 && source.layers.length === 0))), '层数据与层数不一致');
        require(count === 1 || source.layers?.length === count, '缺少层数据');
        require(source.initialHealth == null || (uint(source.initialHealth) && source.initialHealth > 0), '初始生命必须为 1 到 4294967295 的整数');
        require(Array.isArray(source.stairs ?? []), '楼梯数据无效');
        // 先检查原始墙参数，不能让虚空规范化掩盖坏数据。
        const rawLayers = source.layers?.length ? [...(source.hWalls ? [source] : []), ...source.layers] : [source];
        for (const layer of rawLayers) {
            require(layer && hasWallGrid(layer, source.width, source.height), '墙数组尺寸无效');
            for (const wall of [...layer.hWalls.flat(), ...layer.vWalls.flat()]) {
                require(wall && Number.isInteger(wall.type) && wall.type >= WALL_TYPES.EMPTY && wall.type <= WALL_TYPES.LETTER_DOOR, '墙类型无效');
                if (wall.type === WALL_TYPES.LOCKED) require(uint(wall.keys ?? 0), '数字门门槛超出整数范围');
                if (wall.type === WALL_TYPES.ONE_WAY) require(directionIndex(wall.direction) >= 0, '单向门方向无效');
                if (wall.type === WALL_TYPES.LETTER_DOOR) require(/^[A-Z]$/.test(wall.letter ?? '') && ['open', 'closed'].includes(wall.initialState ?? 'closed'), '字母门参数无效');
            }
            for (const axis of ['h', 'v']) layer[axis + 'Walls'].forEach((row, y) => row.forEach((wall, x) => {
                require(wall.type <= WALL_TYPES.SOLID || isInteriorWall({ type: axis, x, y }, source.width, source.height, layer.activeCells),
                    '门和玻璃只能位于两个活动格之间，地图边界必须是墙');
            }));
            for (const name of ['ghosts', 'initialGhosts', 'items', 'buttons']) require(layer[name] == null || Array.isArray(layer[name]), '实体列表无效');
        }
        source.layers?.forEach((layer, li) => {
            if (layer.stairs == null) return;
            require(Array.isArray(layer.stairs), '楼梯数据无效');
            const order = stairs => stairs.map(s => `${s.layer},${s.x},${s.y},${s.direction}`).sort();
            require(JSON.stringify(order(layer.stairs)) === JSON.stringify(order((source.stairs || []).filter(s => s.layer === li))), '层内与全局楼梯数据冲突');
        });
        // 旧作品对象若带第零层副本，必须一致，不能悄悄选取其中一份。
        if (source.layers?.length && source.hWalls) {
            const top = normalizeMapData({ ...source, layers: [], layerCount: 1, stairs: [] }).layers[0];
            const first = normalizeMapData({ ...source, hWalls: undefined }).layers[0];
            for (const key of ['hWalls', 'vWalls', 'activeCells', 'ghosts', 'items', 'buttons', 'endPos']) {
                require(JSON.stringify(top[key]) === JSON.stringify(first[key]), '顶层与第零层数据冲突');
            }
        }
        const data = normalizeMapData(source);
        require(['regular', 'free'].includes(data.editorMode), '编辑类型无效');
        require(['exploration', 'death-loop'].includes(data.gameMode), '游戏模式无效');
        const grid = (rows, h, w) => Array.isArray(rows) && rows.length === h && rows.every(row => Array.isArray(row) && row.length === w);
        const validPoint = (p, li) => p && Number.isInteger(p.x) && Number.isInteger(p.y) && data.layers[li]?.activeCells[p.y]?.[p.x] === true;
        const letter = value => typeof value === 'string' && /^[A-Z]$/.test(value);
        let starts = 0, ends = 0;
        data.layers.forEach((layer, li) => {
            require(grid(layer.activeCells, data.height, data.width) && layer.activeCells.flat().every(v => typeof v === 'boolean'), '活动格数组无效');
            require(layer.activeCells.flat().some(Boolean), '每层至少需要一个活动格');
            require(grid(layer.hWalls, data.height + 1, data.width) && grid(layer.vWalls, data.height, data.width + 1), '墙数组尺寸无效');
            for (const wall of [...layer.hWalls.flat(), ...layer.vWalls.flat()]) {
                if (wall.type === WALL_TYPES.LOCKED) require(uint(wall.keys), '数字门门槛超出整数范围');
                if (wall.type === WALL_TYPES.ONE_WAY) require(directionIndex(wall.direction) >= 0, '单向门方向无效');
                if (wall.type === WALL_TYPES.LETTER_DOOR) require(letter(wall.letter) && ['open', 'closed'].includes(wall.initialState), '字母门参数无效');
            }
            for (const name of ['ghosts', 'items', 'buttons']) {
                const seen = new Set();
                require(layer[name].length <= data.width * data.height * (name === 'buttons' ? 4 : 1), '实体数量超出地图范围');
                for (const entry of layer[name]) {
                    require(validPoint(entry, li), '实体必须位于活动格');
                    const key = `${entry.x},${entry.y}` + (name === 'buttons' ? `,${directionIndex(entry.direction)}` : '');
                    require(!seen.has(key), '同一位置有重复实体'); seen.add(key);
                    if (name === 'items') require(entry.type === 'key', '物品类型无效');
                    if (name === 'buttons') require(directionIndex(entry.direction) >= 0 && letter(entry.letter), '按钮参数无效');
                }
            }
            for (const name of ['customStartPos', 'endPos']) if (layer[name]) {
                require(validPoint(layer[name], li), '起点或终点必须位于活动格');
                if (name === 'customStartPos') {
                    require(!layer.ghosts.some(g => g.x === layer[name].x && g.y === layer[name].y), '出生点不能与鬼重叠');
                    starts++;
                } else ends++;
            }
        });
        require(starts === 1, '必须有且只有一个出生点');
        require(!requireEnd || ends > 0, '请先设置终点');
        const occupied = new Set();
        for (const stair of data.stairs) {
            require(count > 1 && Number.isInteger(stair.layer) && validPoint(stair, stair.layer) && ['up', 'down'].includes(stair.direction), '楼梯位置或方向无效');
            const key = `${stair.layer},${stair.x},${stair.y}`;
            require(!occupied.has(key), '同格楼梯重复'); occupied.add(key);
            const target = stair.layer + (stair.direction === 'up' ? 1 : -1);
            require(data.stairs.some(s => s.layer === target && s.x === stair.x && s.y === stair.y && s.direction !== stair.direction), '楼梯缺少反向配对');
        }
        const buttons = validateButtonAttachments(data);
        require(buttons.valid, buttons.error);
        return { valid: true, mapData: data };
    } catch (error) { return { valid: false, error: error.message }; }
}

return {"isInteriorWall":isInteriorWall,"normalizeVoidWalls":normalizeVoidWalls,"validateButtonAttachments":validateButtonAttachments,"DIRECTIONS":DIRECTIONS,"directionIndex":directionIndex,"normalizeMapData":normalizeMapData,"validateMapData":validateMapData};
},
"src/core/pathfinding.js":function(__load){
const { WALL_TYPES, getStartRoomY } = __load("src/core/constants.js");

/**
 * Pathfinding 模块 - 路径查找算法
 */

/**
 * 获取指定方向的墙壁
 * @param {number} x - 当前x坐标
 * @param {number} y - 当前y坐标
 * @param {number} dx - x方向 (-1, 0, 1)
 * @param {number} dy - y方向 (-1, 0, 1)
 * @param {Array} hWalls - 横墙数组
 * @param {Array} vWalls - 竖墙数组
 * @returns {object|null} 墙壁对象或null
 */
function getWallInDirection(x, y, dx, dy, hWalls, vWalls) {
    if (dx === 1) return vWalls[y][x + 1];
    else if (dx === -1) return vWalls[y][x];
    else if (dy === 1) return hWalls[y + 1][x];
    else if (dy === -1) return hWalls[y][x];
    return null;
}

/** 检查按钮是否仍依附在实心墙或活动区边界上 */
function isValidButtonAttachment(button, config = {}) {
    const { width, height, activeCells, hWalls, vWalls, editorMode } = config;
    const { x, y, direction } = button || {};
    const isCardinal = direction && ((direction.dx === 0 && Math.abs(direction.dy) === 1) ||
        (direction.dy === 0 && Math.abs(direction.dx) === 1));
    if (!Number.isInteger(width) || !Number.isInteger(height) || !Number.isInteger(x) || !Number.isInteger(y) ||
        x < 0 || x >= width || y < 0 || y >= height || !isCardinal) return false;
    const isActive = (cx, cy) => cx >= 0 && cx < width && cy >= 0 && cy < height &&
        (activeCells ? activeCells[cy]?.[cx] === true : true);
    if (!isActive(x, y)) return false;

    const nx = x + direction.dx, ny = y + direction.dy;
    let wall;
    if (direction.dx === 1) wall = vWalls?.[y]?.[x + 1];
    else if (direction.dx === -1) wall = vWalls?.[y]?.[x];
    else if (direction.dy === 1) wall = hWalls?.[y + 1]?.[x];
    else wall = hWalls?.[y]?.[x];
    if (!wall || (wall.type !== WALL_TYPES.SOLID && isActive(nx, ny))) return false;

    const roomYStart = getStartRoomY(height);
    const isTopBoundary = direction.dy === -1 && y === roomYStart && x < 3;
    const isRightBoundary = direction.dx === 1 && x === 2 && y >= roomYStart;
    return !(editorMode === 'regular' && (isTopBoundary || isRightBoundary));
}

/**
 * 计算从起点到所有可达点的距离（BFS）
 * @param {object} startNode - 起点 {x, y}
 * @param {number} width - 地图宽度
 * @param {number} height - 地图高度
 * @param {Array} hWalls - 横墙数组
 * @param {Array} vWalls - 竖墙数组
 * @returns {Array} 二维距离数组
 */
function calculateDistances(startNode, width, height, hWalls, vWalls) {
    const distances = Array(height).fill(null).map(() => Array(width).fill(Infinity));
    const queue = [{ x: startNode.x, y: startNode.y, dist: 0 }];
    distances[startNode.y][startNode.x] = 0;
    
    while (queue.length > 0) {
        const { x, y, dist } = queue.shift();
        const neighbors = [
            { dx: 0, dy: -1 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 }
        ];
        
        for (const { dx, dy } of neighbors) {
            const nx = x + dx;
            const ny = y + dy;
            
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const wall = getWallInDirection(x, y, dx, dy, hWalls, vWalls);
                
                // 玩家通行规则：GLASS 双方不可穿（与 findPlayerPath 一致）；DOOR/已开字母门可穿
                if (wall && [WALL_TYPES.SOLID, WALL_TYPES.LOCKED, WALL_TYPES.ONE_WAY, WALL_TYPES.GLASS].includes(wall.type)) {
                    continue;
                }
                
                if (distances[ny][nx] === Infinity) {
                    distances[ny][nx] = dist + 1;
                    queue.push({ x: nx, y: ny, dist: dist + 1 });
                }
            }
        }
    }
    
    return distances;
}

/**
 * 查找玩家从起点到终点的路径（考虑可见性和墙壁）
 * @param {object} start - 起点 {x, y}
 * @param {object} end - 终点 {x, y}
 * @param {object} config - 配置对象
 * @returns {Array|null} 路径数组或null
 */
function findPlayerPath(start, end, config) {
    const { width, height, hWalls, vWalls, seenCells, debugVision, playerKeys } = config;
    
    const queue = [[{ x: start.x, y: start.y }]];
    const visited = new Set([`${start.x},${start.y}`]);
    
    while (queue.length > 0) {
        const path = queue.shift();
        const { x, y } = path[path.length - 1];
        
        if (x === end.x && y === end.y) {
            return path;
        }
        
        const neighbors = [
            { dx: 0, dy: -1 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 }
        ];
        
        for (const { dx, dy } of neighbors) {
            const nx = x + dx;
            const ny = y + dy;
            const key = `${nx},${ny}`;
            
            if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited.has(key)) {
                // 检查可见性
                if (!seenCells[ny][nx] && !debugVision) {
                    continue;
                }
                
                const wall = getWallInDirection(x, y, dx, dy, hWalls, vWalls);
                let isBlocked = false;
                
                if (wall) {
                    if (wall.type === WALL_TYPES.SOLID ||
                        wall.type === WALL_TYPES.GLASS ||
                        (wall.type === WALL_TYPES.LOCKED && playerKeys < wall.keys)) {
                        isBlocked = true;
                    } else if (wall.type === WALL_TYPES.ONE_WAY &&
                               (!wall.direction || dx !== wall.direction.dx || dy !== wall.direction.dy)) {
                        isBlocked = true;
                    } else if (wall.type === WALL_TYPES.LETTER_DOOR && wall.currentState !== 'open') {
                        // 关着的字母门不可通行（与真实移动 handleMove 一致；currentState 缺失时按关闭处理）
                        isBlocked = true;
                    }
                }
                
                if (isBlocked) {
                    continue;
                }
                
                visited.add(key);
                const newPath = [...path, { x: nx, y: ny }];
                queue.push(newPath);
            }
        }
    }
    
    return null;
}

/**
 * 获取按钮热点位置
 * @param {number} mouseX - 鼠标X坐标
 * @param {number} mouseY - 鼠标Y坐标
 * @param {object} config - 配置对象
 * @returns {object|null} 按钮热点信息或null
 */
function getButtonHotspotAtPos(mouseX, mouseY, config) {
    const { cellSize, width, height, activeCells, hWalls, vWalls, editorMode } = config;
    const cs = cellSize;
    
    let cellX = Math.floor(mouseX / cs);
    let cellY = Math.floor(mouseY / cs);
    
    const isValidCell = (cx, cy) => cx >= 0 && cx < width && cy >= 0 && cy < height;
    
    if (!isValidCell(cellX, cellY)) {
        const localX = mouseX - cellX * cs;
        const localY = mouseY - cellY * cs;
        const tolerance = cs * 0.3;
        
        if (localX > cs - tolerance && isValidCell(cellX + 1, cellY)) cellX++;
        else if (localX < tolerance && isValidCell(cellX - 1, cellY)) cellX--;
        else if (localY > cs - tolerance && isValidCell(cellX, cellY + 1)) cellY++;
        else if (localY < tolerance && isValidCell(cellX, cellY - 1)) cellY--;
        else return null;
    }
    
    if (!isValidCell(cellX, cellY) || !activeCells[cellY][cellX]) {
        return null;
    }
    
    const localX = mouseX - cellX * cs;
    const localY = mouseY - cellY * cs;
    let direction = null;
    
    if (localY < localX && localY < -localX + cs) direction = { dx: 0, dy: -1 };
    else if (localY > localX && localY > -localX + cs) direction = { dx: 0, dy: 1 };
    else if (localY > localX && localY < -localX + cs) direction = { dx: -1, dy: 0 };
    else if (localY < localX && localY > -localX + cs) direction = { dx: 1, dy: 0 };
    
    if (!direction) return null;
    
    const button = { x: cellX, y: cellY, direction };
    return isValidButtonAttachment(button, { width, height, activeCells, hWalls, vWalls, editorMode }) ? button : null;
}

return {"isValidButtonAttachment":isValidButtonAttachment,"calculateDistances":calculateDistances,"findPlayerPath":findPlayerPath,"getButtonHotspotAtPos":getButtonHotspotAtPos};
},
"src/core/mapDefinition.js":function(__load){
const { normalizeMapData } = __load("src/core/mapDataUtils.js");

/** 静态地图；所有入口均装配为同一份层数据。 */
class MapDefinition {
    constructor(source) {
        const data = normalizeMapData(source);
        this.width = data.width;
        this.height = data.height;
        this.gameMode = data.gameMode;
        this.initialHealth = data.initialHealth;
        this.editorMode = data.editorMode;
        this.multiLayerMode = data.multiLayerMode;
        this.layerCount = data.layerCount;
        this.stairs = data.stairs;
        this.layers = data.layers.map((layer, index) => ({
            activeCells: layer.activeCells,
            initialWalls: { h: layer.hWalls, v: layer.vWalls },
            initialEntities: {
                ghosts: layer.ghosts, items: layer.items, buttons: layer.buttons,
                stairs: data.stairs.filter(s => s.layer === index),
                endPos: layer.endPos, customStartPos: layer.customStartPos
            }
        }));
        const index = data.layers.findIndex(layer => layer.customStartPos);
        const start = data.layers[index]?.customStartPos || { x: 1, y: data.height - 2 };
        this.playerStart = { ...start, layer: Math.max(0, index) };
        // 反复按按钮无需每次扫描整图；索引仍只引用静态定义。
        this.letterWalls = new Map();
        this.layers.forEach((layer, li) => {
            for (const axis of ['h', 'v']) layer.initialWalls[axis].forEach((row, y) => row.forEach((wall, x) => {
                if (wall.letter) {
                    if (!this.letterWalls.has(wall.letter)) this.letterWalls.set(wall.letter, []);
                    this.letterWalls.get(wall.letter).push({ layer: li, axis, x, y });
                }
            }));
        });
    }
}

return {"MapDefinition":MapDefinition};
},
"src/core/dataSerializer.js":function(__load){
const { WALL_TYPES : W } = __load("src/core/constants.js");
const { validateMapData, DIRECTIONS, directionIndex } = __load("src/core/mapDataUtils.js");
const { BitWriter, BitReader, bitWidth, fromBase64, shortestCode, unpack, crc32 } = __load("src/core/binaryCodec.js");

function checked(source) {
    const result = validateMapData(source);
    if (!result.valid) throw new RangeError(result.error);
    return result.mapData;
}
function positions(layer) {
    const cells = [];
    layer.activeCells.forEach((row, y) => row.forEach((active, x) => { if (active) cells.push({ x, y }); }));
    return cells;
}

/** 唯一地图内容布局；CRC 固定使用未压缩的 00 墙表示。 */
function encodeMapContent(data, scheme = 0) {
    const writer = new BitWriter();
    const startLayer = data.layers.findIndex(layer => layer.customStartPos);
    writer.write(data.width - 8, 4); writer.write(data.height - 8, 4);
    writer.write(Number(data.editorMode === 'free'), 1);
    writer.write(Number(data.gameMode === 'death-loop'), 1);
    writer.write(Number(data.layerCount > 1), 1);
    const customHealth = data.gameMode === 'exploration' && data.initialHealth !== 5;
    writer.write(Number(customHealth), 1); writer.write(scheme, 2);
    if (data.layerCount > 1) writer.write(data.layerCount - 2, 4);
    if (customHealth) writer.uint(data.initialHealth - 1);
    if (data.layerCount > 1) writer.write(startLayer, bitWidth(data.layerCount));
    for (let li = 0; li < data.layerCount; li++) {
        const layer = data.layers[li], cells = positions(layer), bits = bitWidth(cells.length);
        const indices = new Map(cells.map((p, index) => [p.y * data.width + p.x, index]));
        const writePoint = p => writer.write(indices.get(p.y * data.width + p.x), bits);
        const all = cells.length === data.width * data.height;
        writer.write(Number(all), 1);
        if (!all) for (const row of layer.activeCells) for (const active of row) writer.write(Number(active), 1);
        writer.write(Number(!!layer.endPos), 1);
        if (layer.endPos) writePoint(layer.endPos);
        if (li === startLayer) writePoint(layer.customStartPos);
        for (const name of ['ghosts', 'items', 'buttons']) {
            const entries = layer[name];
            writer.write(Number(entries.length > 0), 1);
            if (entries.length) writer.uint(entries.length - 1);
            for (const entry of entries) {
                writePoint(entry);
                if (name === 'buttons') {
                    writer.write(directionIndex(entry.direction), 2);
                    writer.write(entry.letter.charCodeAt(0) - 65, 5);
                }
            }
        }
        const walls = [...layer.hWalls.flat(), ...layer.vWalls.flat()];
        for (const wall of walls) {
            const type = wall.type;
            if (scheme === 0) {
                if (type === W.EMPTY) writer.write(0, 1);
                else if (type === W.SOLID) writer.write(2, 2);
                else { writer.write(3, 2); writer.write(type - 2, 3); }
            } else if (scheme === 1) writer.write(type, 3);
            else {
                for (let i = 0; i < type; i++) writer.write(1, 1);
                writer.write(0, 1);
            }
        }
        for (const wall of walls) {
            if (wall.type === W.LOCKED) writer.uint(wall.keys);
            else if (wall.type === W.ONE_WAY) writer.write(directionIndex(wall.direction), 2);
            else if (wall.type === W.LETTER_DOOR) {
                writer.write(wall.letter.charCodeAt(0) - 65, 5);
                writer.write(Number(wall.initialState === 'open'), 1);
            }
        }
    }
    if (data.layerCount > 1) {
        const pairs = data.stairs.filter(s => s.direction === 'up');
        writer.uint(pairs.length);
        for (const stair of pairs) {
            writer.write(stair.layer, bitWidth(data.layerCount - 1));
            const cells = positions(data.layers[stair.layer]);
            writer.write(cells.findIndex(p => p.x === stair.x && p.y === stair.y), bitWidth(cells.length));
        }
    }
    return writer.finish();
}

function decodeMapContent(bytes) {
    const reader = new BitReader(bytes);
    const width = reader.read(4) + 8, height = reader.read(4) + 8;
    if (width > 20 || height > 20) throw new RangeError('地图尺寸无效');
    const editorMode = reader.read(1) ? 'free' : 'regular';
    const gameMode = reader.read(1) ? 'death-loop' : 'exploration';
    const multi = reader.read(1), health = reader.read(1), scheme = reader.read(2);
    if (scheme === 3 || (health && gameMode === 'death-loop')) throw new RangeError('地图控制信息无效');
    const layerCount = multi ? reader.read(4) + 2 : 1;
    if (layerCount > 10) throw new RangeError('层数无效');
    const initialHealth = health ? reader.uint() + 1 : 5;
    if (initialHealth > 0xffffffff || (health && initialHealth === 5)) throw new RangeError('初始生命无效');
    const startLayer = multi ? reader.read(bitWidth(layerCount)) : 0;
    if (startLayer >= layerCount) throw new RangeError('出生层无效');
    const layers = [];
    for (let li = 0; li < layerCount; li++) {
        const all = reader.read(1);
        const activeCells = Array.from({ length: height }, () => Array.from({ length: width }, () => all ? true : !!reader.read(1)));
        const cells = positions({ activeCells }), bits = bitWidth(cells.length);
        if (!cells.length) throw new RangeError('地图层没有活动格');
        const readPoint = () => {
            const index = reader.read(bits);
            if (index >= cells.length) throw new RangeError('位置超出活动格范围');
            return { ...cells[index] };
        };
        const endPos = reader.read(1) ? readPoint() : null;
        const customStartPos = li === startLayer ? readPoint() : null;
        const layer = { activeCells, endPos, customStartPos };
        for (const name of ['ghosts', 'items', 'buttons']) {
            const count = reader.read(1) ? reader.uint() + 1 : 0;
            if (count > cells.length * (name === 'buttons' ? 4 : 1)) throw new RangeError('实体数量无效');
            layer[name] = Array.from({ length: count }, (_, id) => {
                const p = readPoint();
                if (name === 'ghosts') p.id = id;
                if (name === 'items') p.type = 'key';
                if (name === 'buttons') {
                    p.direction = { ...DIRECTIONS[reader.read(2)] };
                    const letter = reader.read(5);
                    if (letter >= 26) throw new RangeError('按钮字母无效');
                    p.letter = String.fromCharCode(65 + letter);
                }
                return p;
            });
        }
        const walls = Array.from({ length: (height + 1) * width + height * (width + 1) }, () => {
            let type;
            if (scheme === 0) type = !reader.read(1) ? W.EMPTY : (!reader.read(1) ? W.SOLID : reader.read(3) + 2);
            else if (scheme === 1) type = reader.read(3);
            else { type = 0; while (reader.read(1)) { if (++type > W.LETTER_DOOR) throw new RangeError('墙类型无效'); } }
            if (type > W.LETTER_DOOR) throw new RangeError('墙类型无效');
            return { type, keys: 0 };
        });
        for (const wall of walls) {
            if (wall.type === W.LOCKED) wall.keys = reader.uint();
            else if (wall.type === W.ONE_WAY) wall.direction = { ...DIRECTIONS[reader.read(2)] };
            else if (wall.type === W.LETTER_DOOR) {
                const letter = reader.read(5);
                if (letter >= 26) throw new RangeError('门字母无效');
                wall.letter = String.fromCharCode(65 + letter);
                wall.initialState = reader.read(1) ? 'open' : 'closed';
            }
        }
        layer.hWalls = Array.from({ length: height + 1 }, (_, y) => walls.slice(y * width, (y + 1) * width));
        const offset = (height + 1) * width;
        layer.vWalls = Array.from({ length: height }, (_, y) => walls.slice(offset + y * (width + 1), offset + (y + 1) * (width + 1)));
        layers.push(layer);
    }
    const stairs = [];
    if (multi) {
        const count = reader.uint();
        if (count > width * height * Math.floor(layerCount / 2)) throw new RangeError('楼梯数量无效');
        for (let i = 0; i < count; i++) {
            const li = reader.read(bitWidth(layerCount - 1));
            if (li >= layerCount - 1) throw new RangeError('楼梯层无效');
            const cells = positions(layers[li]), index = reader.read(bitWidth(cells.length));
            if (index >= cells.length) throw new RangeError('楼梯位置无效');
            stairs.push({ ...cells[index], layer: li, direction: 'up' }, { ...cells[index], layer: li + 1, direction: 'down' });
        }
    }
    reader.end();
    return checked({ width, height, editorMode, gameMode, layerCount, initialHealth, layers, stairs });
}

function mapCRC32(source) { return crc32(encodeMapContent(checked(source), 0)); }

const DataSerializer = {
    generateShareCode(source) {
        try {
            const data = checked(source);
            const code = shortestCode([0, 1, 2].map(scheme => ({ bytes: encodeMapContent(data, scheme), control: 0 })), control => Uint8Array.of(control));
            const result = this.loadFromShareCode(code);
            if (!result.success || JSON.stringify(result.data.mapData) !== JSON.stringify(data)) throw new RangeError('地图分享码往返核对失败');
            return { success: true, code };
        } catch (error) { return { success: false, error: error.message }; }
    },
    loadFromShareCode(code) {
        try {
            const bytes = fromBase64(code, 131072);
            if (bytes.length < 2 || (bytes[0] & 254)) throw new RangeError('地图分享码控制信息无效');
            const mapData = decodeMapContent(unpack(bytes.subarray(1), bytes[0] & 1, 131072));
            return { success: true, data: { mapData, gameMode: mapData.gameMode, initialHealth: mapData.initialHealth } };
        } catch (error) { return { success: false, error: '分享码无效：' + error.message }; }
    }
};

return {"encodeMapContent":encodeMapContent,"decodeMapContent":decodeMapContent,"mapCRC32":mapCRC32,"DataSerializer":DataSerializer};
},
"src/core/binaryCodec.js":function(__load){
/** 两类分享码共用的位流、整数、校验与压缩工具。 */
class BitWriter {
    bytes = []; value = 0; used = 0; length = 0;
    write(value, bits) {
        if (!Number.isInteger(value) || value < 0 || value >= 2 ** bits) {
            if (!(bits === 0 && value === 0)) throw new RangeError('数值超出位宽');
        }
        for (let bit = bits - 1; bit >= 0; bit--) {
            this.value = this.value * 2 + (Math.floor(value / 2 ** bit) % 2);
            this.used++; this.length++;
            if (this.used === 8) { this.bytes.push(this.value); this.value = 0; this.used = 0; }
        }
    }
    uint(value) {
        if (!Number.isInteger(value) || value < 0 || value > 0xffffffff) throw new RangeError('整数超出范围');
        do {
            const part = value % 128; value = Math.floor(value / 128);
            this.write(part + (value ? 128 : 0), 8);
        } while (value);
    }
    finish() { return Uint8Array.from(this.used ? [...this.bytes, this.value * 2 ** (8 - this.used)] : this.bytes); }
}

class BitReader {
    position = 0;
    constructor(bytes) { this.bytes = bytes; }
    get remaining() { return this.bytes.length * 8 - this.position; }
    read(bits) {
        if (bits < 0 || this.remaining < bits) throw new RangeError('分享码已截断');
        let value = 0;
        for (let bit = 0; bit < bits; bit++, this.position++) {
            value = value * 2 + ((this.bytes[this.position >> 3] >> (7 - (this.position % 8))) & 1);
        }
        return value;
    }
    uint() {
        let value = 0;
        for (let i = 0; i < 5; i++) {
            const part = this.read(8);
            if (i === 4 && part > 15) throw new RangeError('整数超出范围');
            value += (part & 127) * 2 ** (i * 7);
            if (part < 128) {
                if (i && part === 0) throw new RangeError('整数表示有多余字节');
                return value;
            }
        }
        throw new RangeError('整数已截断');
    }
    end(padding = this.remaining) {
        if (this.remaining !== padding || padding > 7 || this.read(padding) !== 0) throw new RangeError('分享码尾部有多余数据');
    }
}

const bitWidth = count => count <= 1 ? 0 : Math.ceil(Math.log2(count));
function toBase64(bytes) {
    let text = '';
    for (let offset = 0; offset < bytes.length; offset += 8192) text += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
    return btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromBase64(text, maxBytes = 1048576) {
    if (typeof text !== 'string' || !/^[A-Za-z0-9_-]+$/.test(text) || text.length % 4 === 1 || text.length > maxBytes * 4 / 3 + 4) throw new RangeError('分享码字符或长度无效');
    const bytes = Uint8Array.from(atob(text.replace(/-/g, '+').replace(/_/g, '/')), ch => ch.charCodeAt(0));
    if (toBase64(bytes) !== text) throw new RangeError('分享码尾部无效');
    return bytes;
}
function unpack(bytes, compressed, limit) {
    if (!compressed) {
        if (bytes.length > limit) throw new RangeError('分享码内容过长');
        return bytes;
    }
    const pako = globalThis.window?.pako;
    if (!pako) throw new Error('压缩组件未加载');
    if (!pako.Inflate) {
        const output = pako.inflateRaw(bytes, { maxOutputLength: limit });
        if (output.length > limit) throw new RangeError('分享码内容过长');
        return output;
    }
    const inflater = new pako.Inflate({ raw: true });
    const parts = []; let length = 0;
    inflater.onData = part => {
        length += part.length;
        if (length > limit) throw new RangeError('分享码内容过长');
        parts.push(part);
    };
    inflater.push(bytes, true);
    if (inflater.err || !inflater.ended || inflater.strm.total_in !== bytes.length) throw new RangeError('压缩内容无效或有多余数据');
    const output = new Uint8Array(length); let offset = 0;
    for (const part of parts) { output.set(part, offset); offset += part.length; }
    return output;
}
/** 同长度时保留最先给出的候选：原文、墙表示优先级均由调用顺序确定。 */
function shortestCode(candidates, prefix) {
    const pako = globalThis.window?.pako;
    if (!pako) throw new Error('压缩组件未加载');
    let best = null;
    // 所有原文先比较，保证同长时优先原文。
    for (const compressed of [false, true]) for (const candidate of candidates) {
        const options = compressed ? [{ level: 9 }, { level: 9, strategy: 3 }] : [null];
        for (const option of options) {
            const body = option ? pako.deflateRaw(candidate.bytes, option) : candidate.bytes;
            const head = prefix(candidate.control | Number(compressed));
            const joined = new Uint8Array(head.length + body.length);
            joined.set(head); joined.set(body, head.length);
            const code = toBase64(joined);
            if (!best || code.length < best.length) best = code;
        }
    }
    return best;
}
const crcTable = Uint32Array.from({ length: 256 }, (_, n) => {
    for (let i = 0; i < 8; i++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
    return n >>> 0;
});
function crc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
}


return {"BitWriter":BitWriter,"BitReader":BitReader,"bitWidth":bitWidth,"toBase64":toBase64,"fromBase64":fromBase64,"unpack":unpack,"shortestCode":shortestCode,"crc32":crc32};
},
"src/core/replaySerializer.js":function(__load){
const { ACTION_NAMES } = __load("src/core/actions.js");
const { BitWriter, BitReader, fromBase64, unpack, shortestCode } = __load("src/core/binaryCodec.js");
const { mapCRC32 } = __load("src/core/dataSerializer.js");

const MAX_ACTIONS = 1000000;
function sparse(actions) {
    const writer = new BitWriter(), stairs = [];
    actions.forEach((action, index) => { if (action === 'STAIR') stairs.push(index + 1); });
    if (stairs.length) {
        writer.uint(stairs.length);
        let previous = 0;
        for (const step of stairs) { writer.uint(step - previous - 1); previous = step; }
    }
    let directions = 0;
    for (const action of actions) if (action !== 'STAIR') { writer.write(ACTION_NAMES.indexOf(action), 2); directions++; }
    return { bytes: writer.finish(), control: Number(stairs.length > 0) * 4 + ((4 - directions % 4) % 4) * 8 };
}
function baseFive(actions) {
    const writer = new BitWriter(), remaining = actions.length % 3;
    for (let index = 0; index < actions.length; index += 3) {
        const group = actions.slice(index, index + 3);
        writer.write(group.reduce((value, action) => value * 5 + ACTION_NAMES.indexOf(action), 0), [0, 3, 5, 7][group.length]);
    }
    return { bytes: writer.finish(), control: 2 + remaining * 4 + ((8 - writer.length % 8) % 8) * 16 };
}
function decodeActions(control, bytes) {
    const reader = new BitReader(bytes), actions = [];
    if (control & 2) {
        if (control & 128) throw new RangeError('回放控制信息无效');
        const rest = (control >> 2) & 3, padding = (control >> 4) & 7;
        if (rest === 3) throw new RangeError('回放末组无效');
        const tailBits = [0, 3, 5][rest], bits = reader.remaining - padding - tailBits;
        if (bits < 0 || bits % 7 || bits / 7 * 3 + rest > MAX_ACTIONS) throw new RangeError('回放长度无效');
        const group = (length, countBits) => {
            let value = reader.read(countBits);
            if (value >= 5 ** length) throw new RangeError('回放操作无效');
            const entries = Array(length);
            for (let i = length - 1; i >= 0; i--) { entries[i] = ACTION_NAMES[value % 5]; value = Math.floor(value / 5); }
            actions.push(...entries);
        };
        for (let i = 0; i < bits / 7; i++) group(3, 7);
        if (rest) group(rest, tailBits);
        reader.end(padding);
    } else {
        if (control & 224) throw new RangeError('回放控制信息无效');
        const padding = ((control >> 3) & 3) * 2, stairs = [];
        if (control & 4) {
            const count = reader.uint();
            if (count === 0 || count > MAX_ACTIONS) throw new RangeError('楼梯操作数量无效');
            let previous = 0;
            for (let i = 0; i < count; i++) { previous += reader.uint() + 1; stairs.push(previous); }
        }
        const directions = (reader.remaining - padding) / 2, total = directions + stairs.length;
        if (directions < 0 || !Number.isInteger(directions) || total > MAX_ACTIONS || stairs.at(-1) > total) throw new RangeError('楼梯步号或回放长度无效');
        let stairIndex = 0;
        for (let step = 1; step <= total; step++) {
            if (step === stairs[stairIndex]) { actions.push('STAIR'); stairIndex++; }
            else actions.push(ACTION_NAMES[reader.read(2)]);
        }
        reader.end(padding);
    }
    return actions;
}
const ReplaySerializer = {
    generateShareCode(mapData, actions) {
        try {
            if (!Array.isArray(actions) || actions.length > MAX_ACTIONS || actions.some(action => !ACTION_NAMES.includes(action))) throw new RangeError('回放操作无效');
            const crc = mapCRC32(mapData);
            const prefix = control => Uint8Array.of(control, crc >>> 24, (crc >>> 16) & 255, (crc >>> 8) & 255, crc & 255);
            const code = shortestCode([sparse(actions), baseFive(actions)], prefix);
            const result = this.loadFromShareCode(mapData, code);
            if (!result.success || result.actions.join(',') !== actions.join(',')) throw new RangeError('回放分享码往返核对失败');
            return { success: true, code };
        } catch (error) { return { success: false, error: error.message }; }
    },
    loadFromShareCode(mapData, code) {
        try {
            const bytes = fromBase64(code);
            if (bytes.length < 5) throw new RangeError('回放已截断');
            const crc = ((bytes[1] * 2 ** 24) + (bytes[2] << 16) + (bytes[3] << 8) + bytes[4]) >>> 0;
            if (crc !== mapCRC32(mapData)) throw new RangeError('回放与当前地图不匹配');
            const actions = decodeActions(bytes[0], unpack(bytes.subarray(5), bytes[0] & 1, 1048576));
            return { success: true, actions };
        } catch (error) { return { success: false, error: '回放码无效：' + error.message }; }
    }
};


return {"ReplaySerializer":ReplaySerializer};
},
"src/core/actions.js":function(__load){
const { DIRECTIONS, directionIndex } = __load("src/core/mapDataUtils.js");

const ACTION_NAMES = Object.freeze(['U', 'D', 'L', 'R', 'STAIR']);
const actions = Object.freeze(ACTION_NAMES.map((name, index) => index === 4
    ? Object.freeze({ type: 'USE_STAIR' })
    : Object.freeze({ type: 'MOVE', payload: Object.freeze({ ...DIRECTIONS[index] }) })));
function actionFromName(name) {
    const index = ACTION_NAMES.indexOf(name);
    if (index < 0) throw new TypeError('仅允许上下左右或楼梯操作');
    return actions[index];
}
function actionToName(action) {
    const index = action.type === 'USE_STAIR' ? 4 : action.type === 'MOVE' ? directionIndex(action.payload) : -1;
    if (index < 0) throw new TypeError('仅允许上下左右或楼梯操作');
    return ACTION_NAMES[index];
}


return {"ACTION_NAMES":ACTION_NAMES,"actionFromName":actionFromName,"actionToName":actionToName};
},
"src/playtest/observation.js":function(__load){
const { WALL_TYPES : W } = __load("src/core/constants.js");

const kinds = { [W.SOLID]: 'wall', [W.DOOR]: 'door', [W.LOCKED]: 'number-door',
    [W.ONE_WAY]: 'one-way-door', [W.GLASS]: 'glass', [W.LETTER_DOOR]: 'letter-door' };
const directions = value => value.dx === 1 ? 'R' : value.dx === -1 ? 'L' : value.dy === 1 ? 'D' : 'U';
const point = value => [value.x + 1, value.y + 1];

/** 与网页逐格/逐边相同的可见条件；从不返回 GameState、鬼编号或意图。 */
function observeBoard(definition, state, { layer = state.player.layer, fullVision = false } = {}) {
    if (!Number.isInteger(layer) || layer < 0 || layer >= definition.layerCount) throw new RangeError('楼层不存在');
    const def = definition.layers[layer], dynamic = state.layerStates[layer];
    const full = definition.gameMode === 'death-loop' || fullVision;
    const active = (x, y) => !!def.activeCells[y]?.[x];
    const visible = (x, y) => active(x, y) && (full || !!state.seenCells[layer][y]?.[x]);
    const marks = def.activeCells.map((row, y) => row.map((cell, x) => !cell ? '×' : visible(x, y) ? '·' : '?'));
    const entities = [];
    const add = (kind, value, extra = {}) => {
        if (visible(value.x, value.y)) entities.push({ kind, at: point(value), ...extra });
    };
    if (layer === state.player.layer) entities.push({ kind: 'player', at: point(state.player) });
    if (definition.playerStart.layer === layer) add('spawn', definition.playerStart);
    if (def.initialEntities.endPos) add('exit', def.initialEntities.endPos);
    const ghosts = new Map();
    for (const g of dynamic.ghosts) if (visible(g.x, g.y)) {
        const key = `${g.x},${g.y}`, entry = ghosts.get(key) || { kind: 'ghost', at: point(g), count: 0 };
        entry.count++; ghosts.set(key, entry);
    }
    entities.push(...[...ghosts.values()].sort((a, b) => a.at[1] - b.at[1] || a.at[0] - b.at[0]));
    for (const item of dynamic.items) add('key', item);
    for (const button of def.initialEntities.buttons) add('button', button, { letter: button.letter, facing: directions(button.direction) });
    for (const stair of definition.stairs.filter(s => s.layer === layer)) add('stair', stair, { direction: stair.direction });
    // 同格完整内容仍在entities；网格用一个主标记帮助直接观察空间关系。
    const glyphs = { spawn: 'O', button: 'B', stair: 'S', exit: 'E', key: 'K', ghost: 'G', player: 'P' };
    const ranks = Object.keys(glyphs), occupied = new Map();
    for (const entity of entities) {
        const key = entity.at.join(','), rank = ranks.indexOf(entity.kind);
        if (rank >= (occupied.get(key) ?? -1)) {
            occupied.set(key, rank); marks[entity.at[1] - 1][entity.at[0] - 1] = glyphs[entity.kind];
        }
    }
    const rows = marks.map(row => row.join(' '));
    const edges = [];
    const edge = (a, b, wall) => {
        // 轮廓由方格行给出，接壤虚空始终实墙；内部边只在网页可见时列出。
        if (!active(...a) || !active(...b) || !(visible(...a) || visible(...b)) || wall.type === W.EMPTY) return;
        const value = { between: [a.map(n => n + 1), b.map(n => n + 1)], kind: kinds[wall.type] };
        if (wall.type === W.LOCKED) value.number = wall.keys;
        if (wall.type === W.ONE_WAY) value.direction = directions(wall.direction);
        if (wall.type === W.LETTER_DOOR) { value.letter = wall.letter; value.state = wall.currentState; }
        edges.push(value);
    };
    for (let y = 0; y < definition.height; y++) for (let x = 0; x < definition.width; x++) {
        if (x + 1 < definition.width) edge([x, y], [x + 1, y], dynamic.wallStates.v[y][x + 1]);
        if (y + 1 < definition.height) edge([x, y], [x, y + 1], dynamic.wallStates.h[y + 1][x]);
    }
    const stats = { steps: state.player.steps, keys: state.player.keys };
    if (definition.gameMode === 'death-loop') stats.loops = state.loopCount;
    else {
        stats.health = state.player.hp;
        stats.nearbyGhosts = state.layerStates[state.player.layer].ghosts.filter(g =>
            Math.abs(g.x - state.player.x) <= 1 && Math.abs(g.y - state.player.y) <= 1).length;
    }
    return { format: 'ghostmaze-board-v1', gameMode: definition.gameMode, view: full ? 'full' : 'explored',
        layer: layer + 1, layers: definition.layerCount, player: { layer: state.player.layer + 1, at: point(state.player) },
        status: state.isDead ? 'stopped' : state.isWon ? 'won' : 'playing', stats,
        grid: { width: definition.width, height: definition.height, rows }, entities, edges };
}

function describeVisibleChange(before, after, { effective = false, death = false, revived = false } = {}) {
    const ghosts = board => board.entities.filter(e => e.kind === 'ghost');
    return { effective, death, revived, playerBefore: before.player, playerAfter: after.player,
        ghostsBefore: before.layer === after.layer ? ghosts(before) : null, ghostsAfter: ghosts(after),
        statsBefore: before.stats, statsAfter: after.stats };
}

function formatBoard(board) {
    const lines = [`第${board.layer}/${board.layers}层 · ${board.gameMode} · ${board.status}`,
        `列x：${Array.from({ length: board.grid.width }, (_, i) => i + 1).join(' ')}`];
    board.grid.rows.forEach((row, i) => lines.push(`y=${i + 1} ${row}`));
    lines.push('元件：' + JSON.stringify(board.entities), '内部墙门：' + JSON.stringify(board.edges));
    return lines.join('\n');
}

return {"observeBoard":observeBoard,"describeVisibleChange":describeVisibleChange,"formatBoard":formatBoard};
},
"src/playtest/portable.js":function(__load){
/** 受限 JavaScript 环境的标准能力补充；不包含任何游戏规则。 */
function installPortableGlobals(pako) {
    const root = globalThis;
    if (!root.structuredClone) root.structuredClone = function copy(value, seen = new Map()) {
        if (value === null || typeof value !== 'object') return value;
        if (seen.has(value)) return seen.get(value);
        if (value instanceof Date) return new Date(value.getTime());
        if (ArrayBuffer.isView(value)) return new value.constructor(value);
        const result = Array.isArray(value) ? [] : value instanceof Set ? new Set() : value instanceof Map ? new Map() : {};
        seen.set(value, result);
        if (value instanceof Set) for (const item of value) result.add(copy(item, seen));
        else if (value instanceof Map) for (const [key, item] of value) result.set(copy(key, seen), copy(item, seen));
        else for (const key of Object.keys(value)) result[key] = copy(value[key], seen);
        return result;
    };
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    if (!root.btoa) root.btoa = text => {
        let output = '';
        for (let i = 0; i < text.length; i += 3) {
            const a = text.charCodeAt(i), b = text.charCodeAt(i + 1), c = text.charCodeAt(i + 2);
            if (a > 255 || b > 255 || c > 255) throw new RangeError('Base64只接收字节');
            output += alphabet[a >> 2] + alphabet[(a & 3) << 4 | (Number.isNaN(b) ? 0 : b >> 4)] +
                (Number.isNaN(b) ? '=' : alphabet[(b & 15) << 2 | (Number.isNaN(c) ? 0 : c >> 6)]) +
                (Number.isNaN(c) ? '=' : alphabet[c & 63]);
        }
        return output;
    };
    if (!root.atob) root.atob = text => {
        if (typeof text !== 'string' || !/^[A-Za-z0-9+/]*={0,2}$/.test(text) || text.length % 4 === 1) throw new RangeError('Base64无效');
        let value = 0, bits = 0, output = '';
        for (const ch of text.replace(/=+$/, '')) {
            value = value * 64 + alphabet.indexOf(ch); bits += 6;
            if (bits >= 8) { bits -= 8; output += String.fromCharCode(value >> bits & 255); value &= (1 << bits) - 1; }
        }
        return output;
    };
    if (!root.performance) root.performance = { now: () => Date.now() };
    if (!root.window) root.window = {};
    if (pako) root.window.pako = pako;
}

function plainCopy(value) { return JSON.parse(JSON.stringify(value)); }

function textBytes(text) {
    const bytes = [];
    for (const ch of text) {
        const n = ch.codePointAt(0);
        if (n < 128) bytes.push(n);
        else if (n < 2048) bytes.push(192 | n >> 6, 128 | n & 63);
        else if (n < 65536) bytes.push(224 | n >> 12, 128 | n >> 6 & 63, 128 | n & 63);
        else bytes.push(240 | n >> 18, 128 | n >> 12 & 63, 128 | n >> 6 & 63, 128 | n & 63);
    }
    return Uint8Array.from(bytes);
}

function bytesText(bytes) {
    let output = '';
    for (let i = 0; i < bytes.length;) {
        const a = bytes[i++]; let n;
        if (a < 128) n = a;
        else if (a < 224) n = (a & 31) << 6 | bytes[i++] & 63;
        else if (a < 240) n = (a & 15) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
        else n = (a & 7) << 18 | (bytes[i++] & 63) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
        output += String.fromCodePoint(n);
    }
    return output;
}

return {"installPortableGlobals":installPortableGlobals,"plainCopy":plainCopy,"textBytes":textBytes,"bytesText":bytesText};
}};
const __cache=Object.create(null);function __load(id){return __cache[id]||(__cache[id]=__factories[id](__load));}
const __pako=(function(){var module={exports:{}};var exports=module.exports;
/*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).pako={})}(this,(function(t){"use strict";function e(t){let e=t.length;for(;--e>=0;)t[e]=0}const a=256,i=286,n=30,s=15,r=new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]),o=new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]),l=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]),h=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),d=new Array(576);e(d);const _=new Array(60);e(_);const f=new Array(512);e(f);const c=new Array(256);e(c);const u=new Array(29);e(u);const w=new Array(n);function m(t,e,a,i,n){this.static_tree=t,this.extra_bits=e,this.extra_base=a,this.elems=i,this.max_length=n,this.has_stree=t&&t.length}let b,g,p;function k(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e}e(w);const v=t=>t<256?f[t]:f[256+(t>>>7)],y=(t,e)=>{t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255},x=(t,e,a)=>{t.bi_valid>16-a?(t.bi_buf|=e<<t.bi_valid&65535,y(t,t.bi_buf),t.bi_buf=e>>16-t.bi_valid,t.bi_valid+=a-16):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=a)},z=(t,e,a)=>{x(t,a[2*e],a[2*e+1])},A=(t,e)=>{let a=0;do{a|=1&t,t>>>=1,a<<=1}while(--e>0);return a>>>1},E=(t,e,a)=>{const i=new Array(16);let n,r,o=0;for(n=1;n<=s;n++)o=o+a[n-1]<<1,i[n]=o;for(r=0;r<=e;r++){let e=t[2*r+1];0!==e&&(t[2*r]=A(i[e]++,e))}},R=t=>{let e;for(e=0;e<i;e++)t.dyn_ltree[2*e]=0;for(e=0;e<n;e++)t.dyn_dtree[2*e]=0;for(e=0;e<19;e++)t.bl_tree[2*e]=0;t.dyn_ltree[512]=1,t.opt_len=t.static_len=0,t.sym_next=t.matches=0},Z=t=>{t.bi_valid>8?y(t,t.bi_buf):t.bi_valid>0&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0},U=(t,e,a,i)=>{const n=2*e,s=2*a;return t[n]<t[s]||t[n]===t[s]&&i[e]<=i[a]},S=(t,e,a)=>{const i=t.heap[a];let n=a<<1;for(;n<=t.heap_len&&(n<t.heap_len&&U(e,t.heap[n+1],t.heap[n],t.depth)&&n++,!U(e,i,t.heap[n],t.depth));)t.heap[a]=t.heap[n],a=n,n<<=1;t.heap[a]=i},D=(t,e,i)=>{let n,s,l,h,d=0;if(0!==t.sym_next)do{n=255&t.pending_buf[t.sym_buf+d++],n+=(255&t.pending_buf[t.sym_buf+d++])<<8,s=t.pending_buf[t.sym_buf+d++],0===n?z(t,s,e):(l=c[s],z(t,l+a+1,e),h=r[l],0!==h&&(s-=u[l],x(t,s,h)),n--,l=v(n),z(t,l,i),h=o[l],0!==h&&(n-=w[l],x(t,n,h)))}while(d<t.sym_next);z(t,256,e)},T=(t,e)=>{const a=e.dyn_tree,i=e.stat_desc.static_tree,n=e.stat_desc.has_stree,r=e.stat_desc.elems;let o,l,h,d=-1;for(t.heap_len=0,t.heap_max=573,o=0;o<r;o++)0!==a[2*o]?(t.heap[++t.heap_len]=d=o,t.depth[o]=0):a[2*o+1]=0;for(;t.heap_len<2;)h=t.heap[++t.heap_len]=d<2?++d:0,a[2*h]=1,t.depth[h]=0,t.opt_len--,n&&(t.static_len-=i[2*h+1]);for(e.max_code=d,o=t.heap_len>>1;o>=1;o--)S(t,a,o);h=r;do{o=t.heap[1],t.heap[1]=t.heap[t.heap_len--],S(t,a,1),l=t.heap[1],t.heap[--t.heap_max]=o,t.heap[--t.heap_max]=l,a[2*h]=a[2*o]+a[2*l],t.depth[h]=(t.depth[o]>=t.depth[l]?t.depth[o]:t.depth[l])+1,a[2*o+1]=a[2*l+1]=h,t.heap[1]=h++,S(t,a,1)}while(t.heap_len>=2);t.heap[--t.heap_max]=t.heap[1],((t,e)=>{const a=e.dyn_tree,i=e.max_code,n=e.stat_desc.static_tree,r=e.stat_desc.has_stree,o=e.stat_desc.extra_bits,l=e.stat_desc.extra_base,h=e.stat_desc.max_length;let d,_,f,c,u,w,m=0;for(c=0;c<=s;c++)t.bl_count[c]=0;for(a[2*t.heap[t.heap_max]+1]=0,d=t.heap_max+1;d<573;d++)_=t.heap[d],c=a[2*a[2*_+1]+1]+1,c>h&&(c=h,m++),a[2*_+1]=c,_>i||(t.bl_count[c]++,u=0,_>=l&&(u=o[_-l]),w=a[2*_],t.opt_len+=w*(c+u),r&&(t.static_len+=w*(n[2*_+1]+u)));if(0!==m){do{for(c=h-1;0===t.bl_count[c];)c--;t.bl_count[c]--,t.bl_count[c+1]+=2,t.bl_count[h]--,m-=2}while(m>0);for(c=h;0!==c;c--)for(_=t.bl_count[c];0!==_;)f=t.heap[--d],f>i||(a[2*f+1]!==c&&(t.opt_len+=(c-a[2*f+1])*a[2*f],a[2*f+1]=c),_--)}})(t,e),E(a,d,t.bl_count)},O=(t,e,a)=>{let i,n,s=-1,r=e[1],o=0,l=7,h=4;for(0===r&&(l=138,h=3),e[2*(a+1)+1]=65535,i=0;i<=a;i++)n=r,r=e[2*(i+1)+1],++o<l&&n===r||(o<h?t.bl_tree[2*n]+=o:0!==n?(n!==s&&t.bl_tree[2*n]++,t.bl_tree[32]++):o<=10?t.bl_tree[34]++:t.bl_tree[36]++,o=0,s=n,0===r?(l=138,h=3):n===r?(l=6,h=3):(l=7,h=4))},I=(t,e,a)=>{let i,n,s=-1,r=e[1],o=0,l=7,h=4;for(0===r&&(l=138,h=3),i=0;i<=a;i++)if(n=r,r=e[2*(i+1)+1],!(++o<l&&n===r)){if(o<h)do{z(t,n,t.bl_tree)}while(0!=--o);else 0!==n?(n!==s&&(z(t,n,t.bl_tree),o--),z(t,16,t.bl_tree),x(t,o-3,2)):o<=10?(z(t,17,t.bl_tree),x(t,o-3,3)):(z(t,18,t.bl_tree),x(t,o-11,7));o=0,s=n,0===r?(l=138,h=3):n===r?(l=6,h=3):(l=7,h=4)}};let F=!1;const L=(t,e,a,i)=>{x(t,0+(i?1:0),3),Z(t),y(t,a),y(t,~a),a&&t.pending_buf.set(t.window.subarray(e,e+a),t.pending),t.pending+=a};var N=(t,e,i,n)=>{let s,r,o=0;t.level>0?(2===t.strm.data_type&&(t.strm.data_type=(t=>{let e,i=4093624447;for(e=0;e<=31;e++,i>>>=1)if(1&i&&0!==t.dyn_ltree[2*e])return 0;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return 1;for(e=32;e<a;e++)if(0!==t.dyn_ltree[2*e])return 1;return 0})(t)),T(t,t.l_desc),T(t,t.d_desc),o=(t=>{let e;for(O(t,t.dyn_ltree,t.l_desc.max_code),O(t,t.dyn_dtree,t.d_desc.max_code),T(t,t.bl_desc),e=18;e>=3&&0===t.bl_tree[2*h[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e})(t),s=t.opt_len+3+7>>>3,r=t.static_len+3+7>>>3,r<=s&&(s=r)):s=r=i+5,i+4<=s&&-1!==e?L(t,e,i,n):4===t.strategy||r===s?(x(t,2+(n?1:0),3),D(t,d,_)):(x(t,4+(n?1:0),3),((t,e,a,i)=>{let n;for(x(t,e-257,5),x(t,a-1,5),x(t,i-4,4),n=0;n<i;n++)x(t,t.bl_tree[2*h[n]+1],3);I(t,t.dyn_ltree,e-1),I(t,t.dyn_dtree,a-1)})(t,t.l_desc.max_code+1,t.d_desc.max_code+1,o+1),D(t,t.dyn_ltree,t.dyn_dtree)),R(t),n&&Z(t)},B={_tr_init:t=>{F||((()=>{let t,e,a,h,k;const v=new Array(16);for(a=0,h=0;h<28;h++)for(u[h]=a,t=0;t<1<<r[h];t++)c[a++]=h;for(c[a-1]=h,k=0,h=0;h<16;h++)for(w[h]=k,t=0;t<1<<o[h];t++)f[k++]=h;for(k>>=7;h<n;h++)for(w[h]=k<<7,t=0;t<1<<o[h]-7;t++)f[256+k++]=h;for(e=0;e<=s;e++)v[e]=0;for(t=0;t<=143;)d[2*t+1]=8,t++,v[8]++;for(;t<=255;)d[2*t+1]=9,t++,v[9]++;for(;t<=279;)d[2*t+1]=7,t++,v[7]++;for(;t<=287;)d[2*t+1]=8,t++,v[8]++;for(E(d,287,v),t=0;t<n;t++)_[2*t+1]=5,_[2*t]=A(t,5);b=new m(d,r,257,i,s),g=new m(_,o,0,n,s),p=new m(new Array(0),l,0,19,7)})(),F=!0),t.l_desc=new k(t.dyn_ltree,b),t.d_desc=new k(t.dyn_dtree,g),t.bl_desc=new k(t.bl_tree,p),t.bi_buf=0,t.bi_valid=0,R(t)},_tr_stored_block:L,_tr_flush_block:N,_tr_tally:(t,e,i)=>(t.pending_buf[t.sym_buf+t.sym_next++]=e,t.pending_buf[t.sym_buf+t.sym_next++]=e>>8,t.pending_buf[t.sym_buf+t.sym_next++]=i,0===e?t.dyn_ltree[2*i]++:(t.matches++,e--,t.dyn_ltree[2*(c[i]+a+1)]++,t.dyn_dtree[2*v(e)]++),t.sym_next===t.sym_end),_tr_align:t=>{x(t,2,3),z(t,256,d),(t=>{16===t.bi_valid?(y(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):t.bi_valid>=8&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)})(t)}};var C=(t,e,a,i)=>{let n=65535&t|0,s=t>>>16&65535|0,r=0;for(;0!==a;){r=a>2e3?2e3:a,a-=r;do{n=n+e[i++]|0,s=s+n|0}while(--r);n%=65521,s%=65521}return n|s<<16|0};const M=new Uint32Array((()=>{let t,e=[];for(var a=0;a<256;a++){t=a;for(var i=0;i<8;i++)t=1&t?3988292384^t>>>1:t>>>1;e[a]=t}return e})());var H=(t,e,a,i)=>{const n=M,s=i+a;t^=-1;for(let a=i;a<s;a++)t=t>>>8^n[255&(t^e[a])];return-1^t},j={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"},K={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_MEM_ERROR:-4,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8};const{_tr_init:P,_tr_stored_block:Y,_tr_flush_block:G,_tr_tally:X,_tr_align:W}=B,{Z_NO_FLUSH:q,Z_PARTIAL_FLUSH:J,Z_FULL_FLUSH:Q,Z_FINISH:V,Z_BLOCK:$,Z_OK:tt,Z_STREAM_END:et,Z_STREAM_ERROR:at,Z_DATA_ERROR:it,Z_BUF_ERROR:nt,Z_DEFAULT_COMPRESSION:st,Z_FILTERED:rt,Z_HUFFMAN_ONLY:ot,Z_RLE:lt,Z_FIXED:ht,Z_DEFAULT_STRATEGY:dt,Z_UNKNOWN:_t,Z_DEFLATED:ft}=K,ct=258,ut=262,wt=42,mt=113,bt=666,gt=(t,e)=>(t.msg=j[e],e),pt=t=>2*t-(t>4?9:0),kt=t=>{let e=t.length;for(;--e>=0;)t[e]=0},vt=t=>{let e,a,i,n=t.w_size;e=t.hash_size,i=e;do{a=t.head[--i],t.head[i]=a>=n?a-n:0}while(--e);e=n,i=e;do{a=t.prev[--i],t.prev[i]=a>=n?a-n:0}while(--e)};let yt=(t,e,a)=>(e<<t.hash_shift^a)&t.hash_mask;const xt=t=>{const e=t.state;let a=e.pending;a>t.avail_out&&(a=t.avail_out),0!==a&&(t.output.set(e.pending_buf.subarray(e.pending_out,e.pending_out+a),t.next_out),t.next_out+=a,e.pending_out+=a,t.total_out+=a,t.avail_out-=a,e.pending-=a,0===e.pending&&(e.pending_out=0))},zt=(t,e)=>{G(t,t.block_start>=0?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,xt(t.strm)},At=(t,e)=>{t.pending_buf[t.pending++]=e},Et=(t,e)=>{t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e},Rt=(t,e,a,i)=>{let n=t.avail_in;return n>i&&(n=i),0===n?0:(t.avail_in-=n,e.set(t.input.subarray(t.next_in,t.next_in+n),a),1===t.state.wrap?t.adler=C(t.adler,e,n,a):2===t.state.wrap&&(t.adler=H(t.adler,e,n,a)),t.next_in+=n,t.total_in+=n,n)},Zt=(t,e)=>{let a,i,n=t.max_chain_length,s=t.strstart,r=t.prev_length,o=t.nice_match;const l=t.strstart>t.w_size-ut?t.strstart-(t.w_size-ut):0,h=t.window,d=t.w_mask,_=t.prev,f=t.strstart+ct;let c=h[s+r-1],u=h[s+r];t.prev_length>=t.good_match&&(n>>=2),o>t.lookahead&&(o=t.lookahead);do{if(a=e,h[a+r]===u&&h[a+r-1]===c&&h[a]===h[s]&&h[++a]===h[s+1]){s+=2,a++;do{}while(h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&s<f);if(i=ct-(f-s),s=f-ct,i>r){if(t.match_start=e,r=i,i>=o)break;c=h[s+r-1],u=h[s+r]}}}while((e=_[e&d])>l&&0!=--n);return r<=t.lookahead?r:t.lookahead},Ut=t=>{const e=t.w_size;let a,i,n;do{if(i=t.window_size-t.lookahead-t.strstart,t.strstart>=e+(e-ut)&&(t.window.set(t.window.subarray(e,e+e-i),0),t.match_start-=e,t.strstart-=e,t.block_start-=e,t.insert>t.strstart&&(t.insert=t.strstart),vt(t),i+=e),0===t.strm.avail_in)break;if(a=Rt(t.strm,t.window,t.strstart+t.lookahead,i),t.lookahead+=a,t.lookahead+t.insert>=3)for(n=t.strstart-t.insert,t.ins_h=t.window[n],t.ins_h=yt(t,t.ins_h,t.window[n+1]);t.insert&&(t.ins_h=yt(t,t.ins_h,t.window[n+3-1]),t.prev[n&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=n,n++,t.insert--,!(t.lookahead+t.insert<3)););}while(t.lookahead<ut&&0!==t.strm.avail_in)},St=(t,e)=>{let a,i,n,s=t.pending_buf_size-5>t.w_size?t.w_size:t.pending_buf_size-5,r=0,o=t.strm.avail_in;do{if(a=65535,n=t.bi_valid+42>>3,t.strm.avail_out<n)break;if(n=t.strm.avail_out-n,i=t.strstart-t.block_start,a>i+t.strm.avail_in&&(a=i+t.strm.avail_in),a>n&&(a=n),a<s&&(0===a&&e!==V||e===q||a!==i+t.strm.avail_in))break;r=e===V&&a===i+t.strm.avail_in?1:0,Y(t,0,0,r),t.pending_buf[t.pending-4]=a,t.pending_buf[t.pending-3]=a>>8,t.pending_buf[t.pending-2]=~a,t.pending_buf[t.pending-1]=~a>>8,xt(t.strm),i&&(i>a&&(i=a),t.strm.output.set(t.window.subarray(t.block_start,t.block_start+i),t.strm.next_out),t.strm.next_out+=i,t.strm.avail_out-=i,t.strm.total_out+=i,t.block_start+=i,a-=i),a&&(Rt(t.strm,t.strm.output,t.strm.next_out,a),t.strm.next_out+=a,t.strm.avail_out-=a,t.strm.total_out+=a)}while(0===r);return o-=t.strm.avail_in,o&&(o>=t.w_size?(t.matches=2,t.window.set(t.strm.input.subarray(t.strm.next_in-t.w_size,t.strm.next_in),0),t.strstart=t.w_size,t.insert=t.strstart):(t.window_size-t.strstart<=o&&(t.strstart-=t.w_size,t.window.set(t.window.subarray(t.w_size,t.w_size+t.strstart),0),t.matches<2&&t.matches++,t.insert>t.strstart&&(t.insert=t.strstart)),t.window.set(t.strm.input.subarray(t.strm.next_in-o,t.strm.next_in),t.strstart),t.strstart+=o,t.insert+=o>t.w_size-t.insert?t.w_size-t.insert:o),t.block_start=t.strstart),t.high_water<t.strstart&&(t.high_water=t.strstart),r?4:e!==q&&e!==V&&0===t.strm.avail_in&&t.strstart===t.block_start?2:(n=t.window_size-t.strstart,t.strm.avail_in>n&&t.block_start>=t.w_size&&(t.block_start-=t.w_size,t.strstart-=t.w_size,t.window.set(t.window.subarray(t.w_size,t.w_size+t.strstart),0),t.matches<2&&t.matches++,n+=t.w_size,t.insert>t.strstart&&(t.insert=t.strstart)),n>t.strm.avail_in&&(n=t.strm.avail_in),n&&(Rt(t.strm,t.window,t.strstart,n),t.strstart+=n,t.insert+=n>t.w_size-t.insert?t.w_size-t.insert:n),t.high_water<t.strstart&&(t.high_water=t.strstart),n=t.bi_valid+42>>3,n=t.pending_buf_size-n>65535?65535:t.pending_buf_size-n,s=n>t.w_size?t.w_size:n,i=t.strstart-t.block_start,(i>=s||(i||e===V)&&e!==q&&0===t.strm.avail_in&&i<=n)&&(a=i>n?n:i,r=e===V&&0===t.strm.avail_in&&a===i?1:0,Y(t,t.block_start,a,r),t.block_start+=a,xt(t.strm)),r?3:1)},Dt=(t,e)=>{let a,i;for(;;){if(t.lookahead<ut){if(Ut(t),t.lookahead<ut&&e===q)return 1;if(0===t.lookahead)break}if(a=0,t.lookahead>=3&&(t.ins_h=yt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==a&&t.strstart-a<=t.w_size-ut&&(t.match_length=Zt(t,a)),t.match_length>=3)if(i=X(t,t.strstart-t.match_start,t.match_length-3),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=3){t.match_length--;do{t.strstart++,t.ins_h=yt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart}while(0!=--t.match_length);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=yt(t,t.ins_h,t.window[t.strstart+1]);else i=X(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(i&&(zt(t,!1),0===t.strm.avail_out))return 1}return t.insert=t.strstart<2?t.strstart:2,e===V?(zt(t,!0),0===t.strm.avail_out?3:4):t.sym_next&&(zt(t,!1),0===t.strm.avail_out)?1:2},Tt=(t,e)=>{let a,i,n;for(;;){if(t.lookahead<ut){if(Ut(t),t.lookahead<ut&&e===q)return 1;if(0===t.lookahead)break}if(a=0,t.lookahead>=3&&(t.ins_h=yt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=2,0!==a&&t.prev_length<t.max_lazy_match&&t.strstart-a<=t.w_size-ut&&(t.match_length=Zt(t,a),t.match_length<=5&&(t.strategy===rt||3===t.match_length&&t.strstart-t.match_start>4096)&&(t.match_length=2)),t.prev_length>=3&&t.match_length<=t.prev_length){n=t.strstart+t.lookahead-3,i=X(t,t.strstart-1-t.prev_match,t.prev_length-3),t.lookahead-=t.prev_length-1,t.prev_length-=2;do{++t.strstart<=n&&(t.ins_h=yt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart)}while(0!=--t.prev_length);if(t.match_available=0,t.match_length=2,t.strstart++,i&&(zt(t,!1),0===t.strm.avail_out))return 1}else if(t.match_available){if(i=X(t,0,t.window[t.strstart-1]),i&&zt(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return 1}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(i=X(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<2?t.strstart:2,e===V?(zt(t,!0),0===t.strm.avail_out?3:4):t.sym_next&&(zt(t,!1),0===t.strm.avail_out)?1:2};function Ot(t,e,a,i,n){this.good_length=t,this.max_lazy=e,this.nice_length=a,this.max_chain=i,this.func=n}const It=[new Ot(0,0,0,0,St),new Ot(4,4,8,4,Dt),new Ot(4,5,16,8,Dt),new Ot(4,6,32,32,Dt),new Ot(4,4,16,16,Tt),new Ot(8,16,32,32,Tt),new Ot(8,16,128,128,Tt),new Ot(8,32,128,256,Tt),new Ot(32,128,258,1024,Tt),new Ot(32,258,258,4096,Tt)];function Ft(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=ft,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new Uint16Array(1146),this.dyn_dtree=new Uint16Array(122),this.bl_tree=new Uint16Array(78),kt(this.dyn_ltree),kt(this.dyn_dtree),kt(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new Uint16Array(16),this.heap=new Uint16Array(573),kt(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new Uint16Array(573),kt(this.depth),this.sym_buf=0,this.lit_bufsize=0,this.sym_next=0,this.sym_end=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}const Lt=t=>{if(!t)return 1;const e=t.state;return!e||e.strm!==t||e.status!==wt&&57!==e.status&&69!==e.status&&73!==e.status&&91!==e.status&&103!==e.status&&e.status!==mt&&e.status!==bt?1:0},Nt=t=>{if(Lt(t))return gt(t,at);t.total_in=t.total_out=0,t.data_type=_t;const e=t.state;return e.pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=2===e.wrap?57:e.wrap?wt:mt,t.adler=2===e.wrap?0:1,e.last_flush=-2,P(e),tt},Bt=t=>{const e=Nt(t);var a;return e===tt&&((a=t.state).window_size=2*a.w_size,kt(a.head),a.max_lazy_match=It[a.level].max_lazy,a.good_match=It[a.level].good_length,a.nice_match=It[a.level].nice_length,a.max_chain_length=It[a.level].max_chain,a.strstart=0,a.block_start=0,a.lookahead=0,a.insert=0,a.match_length=a.prev_length=2,a.match_available=0,a.ins_h=0),e},Ct=(t,e,a,i,n,s)=>{if(!t)return at;let r=1;if(e===st&&(e=6),i<0?(r=0,i=-i):i>15&&(r=2,i-=16),n<1||n>9||a!==ft||i<8||i>15||e<0||e>9||s<0||s>ht||8===i&&1!==r)return gt(t,at);8===i&&(i=9);const o=new Ft;return t.state=o,o.strm=t,o.status=wt,o.wrap=r,o.gzhead=null,o.w_bits=i,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=n+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+3-1)/3),o.window=new Uint8Array(2*o.w_size),o.head=new Uint16Array(o.hash_size),o.prev=new Uint16Array(o.w_size),o.lit_bufsize=1<<n+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new Uint8Array(o.pending_buf_size),o.sym_buf=o.lit_bufsize,o.sym_end=3*(o.lit_bufsize-1),o.level=e,o.strategy=s,o.method=a,Bt(t)};var Mt={deflateInit:(t,e)=>Ct(t,e,ft,15,8,dt),deflateInit2:Ct,deflateReset:Bt,deflateResetKeep:Nt,deflateSetHeader:(t,e)=>Lt(t)||2!==t.state.wrap?at:(t.state.gzhead=e,tt),deflate:(t,e)=>{if(Lt(t)||e>$||e<0)return t?gt(t,at):at;const a=t.state;if(!t.output||0!==t.avail_in&&!t.input||a.status===bt&&e!==V)return gt(t,0===t.avail_out?nt:at);const i=a.last_flush;if(a.last_flush=e,0!==a.pending){if(xt(t),0===t.avail_out)return a.last_flush=-1,tt}else if(0===t.avail_in&&pt(e)<=pt(i)&&e!==V)return gt(t,nt);if(a.status===bt&&0!==t.avail_in)return gt(t,nt);if(a.status===wt&&0===a.wrap&&(a.status=mt),a.status===wt){let e=ft+(a.w_bits-8<<4)<<8,i=-1;if(i=a.strategy>=ot||a.level<2?0:a.level<6?1:6===a.level?2:3,e|=i<<6,0!==a.strstart&&(e|=32),e+=31-e%31,Et(a,e),0!==a.strstart&&(Et(a,t.adler>>>16),Et(a,65535&t.adler)),t.adler=1,a.status=mt,xt(t),0!==a.pending)return a.last_flush=-1,tt}if(57===a.status)if(t.adler=0,At(a,31),At(a,139),At(a,8),a.gzhead)At(a,(a.gzhead.text?1:0)+(a.gzhead.hcrc?2:0)+(a.gzhead.extra?4:0)+(a.gzhead.name?8:0)+(a.gzhead.comment?16:0)),At(a,255&a.gzhead.time),At(a,a.gzhead.time>>8&255),At(a,a.gzhead.time>>16&255),At(a,a.gzhead.time>>24&255),At(a,9===a.level?2:a.strategy>=ot||a.level<2?4:0),At(a,255&a.gzhead.os),a.gzhead.extra&&a.gzhead.extra.length&&(At(a,255&a.gzhead.extra.length),At(a,a.gzhead.extra.length>>8&255)),a.gzhead.hcrc&&(t.adler=H(t.adler,a.pending_buf,a.pending,0)),a.gzindex=0,a.status=69;else if(At(a,0),At(a,0),At(a,0),At(a,0),At(a,0),At(a,9===a.level?2:a.strategy>=ot||a.level<2?4:0),At(a,3),a.status=mt,xt(t),0!==a.pending)return a.last_flush=-1,tt;if(69===a.status){if(a.gzhead.extra){let e=a.pending,i=(65535&a.gzhead.extra.length)-a.gzindex;for(;a.pending+i>a.pending_buf_size;){let n=a.pending_buf_size-a.pending;if(a.pending_buf.set(a.gzhead.extra.subarray(a.gzindex,a.gzindex+n),a.pending),a.pending=a.pending_buf_size,a.gzhead.hcrc&&a.pending>e&&(t.adler=H(t.adler,a.pending_buf,a.pending-e,e)),a.gzindex+=n,xt(t),0!==a.pending)return a.last_flush=-1,tt;e=0,i-=n}let n=new Uint8Array(a.gzhead.extra);a.pending_buf.set(n.subarray(a.gzindex,a.gzindex+i),a.pending),a.pending+=i,a.gzhead.hcrc&&a.pending>e&&(t.adler=H(t.adler,a.pending_buf,a.pending-e,e)),a.gzindex=0}a.status=73}if(73===a.status){if(a.gzhead.name){let e,i=a.pending;do{if(a.pending===a.pending_buf_size){if(a.gzhead.hcrc&&a.pending>i&&(t.adler=H(t.adler,a.pending_buf,a.pending-i,i)),xt(t),0!==a.pending)return a.last_flush=-1,tt;i=0}e=a.gzindex<a.gzhead.name.length?255&a.gzhead.name.charCodeAt(a.gzindex++):0,At(a,e)}while(0!==e);a.gzhead.hcrc&&a.pending>i&&(t.adler=H(t.adler,a.pending_buf,a.pending-i,i)),a.gzindex=0}a.status=91}if(91===a.status){if(a.gzhead.comment){let e,i=a.pending;do{if(a.pending===a.pending_buf_size){if(a.gzhead.hcrc&&a.pending>i&&(t.adler=H(t.adler,a.pending_buf,a.pending-i,i)),xt(t),0!==a.pending)return a.last_flush=-1,tt;i=0}e=a.gzindex<a.gzhead.comment.length?255&a.gzhead.comment.charCodeAt(a.gzindex++):0,At(a,e)}while(0!==e);a.gzhead.hcrc&&a.pending>i&&(t.adler=H(t.adler,a.pending_buf,a.pending-i,i))}a.status=103}if(103===a.status){if(a.gzhead.hcrc){if(a.pending+2>a.pending_buf_size&&(xt(t),0!==a.pending))return a.last_flush=-1,tt;At(a,255&t.adler),At(a,t.adler>>8&255),t.adler=0}if(a.status=mt,xt(t),0!==a.pending)return a.last_flush=-1,tt}if(0!==t.avail_in||0!==a.lookahead||e!==q&&a.status!==bt){let i=0===a.level?St(a,e):a.strategy===ot?((t,e)=>{let a;for(;;){if(0===t.lookahead&&(Ut(t),0===t.lookahead)){if(e===q)return 1;break}if(t.match_length=0,a=X(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,a&&(zt(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,e===V?(zt(t,!0),0===t.strm.avail_out?3:4):t.sym_next&&(zt(t,!1),0===t.strm.avail_out)?1:2})(a,e):a.strategy===lt?((t,e)=>{let a,i,n,s;const r=t.window;for(;;){if(t.lookahead<=ct){if(Ut(t),t.lookahead<=ct&&e===q)return 1;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=3&&t.strstart>0&&(n=t.strstart-1,i=r[n],i===r[++n]&&i===r[++n]&&i===r[++n])){s=t.strstart+ct;do{}while(i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&n<s);t.match_length=ct-(s-n),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=3?(a=X(t,1,t.match_length-3),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(a=X(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),a&&(zt(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,e===V?(zt(t,!0),0===t.strm.avail_out?3:4):t.sym_next&&(zt(t,!1),0===t.strm.avail_out)?1:2})(a,e):It[a.level].func(a,e);if(3!==i&&4!==i||(a.status=bt),1===i||3===i)return 0===t.avail_out&&(a.last_flush=-1),tt;if(2===i&&(e===J?W(a):e!==$&&(Y(a,0,0,!1),e===Q&&(kt(a.head),0===a.lookahead&&(a.strstart=0,a.block_start=0,a.insert=0))),xt(t),0===t.avail_out))return a.last_flush=-1,tt}return e!==V?tt:a.wrap<=0?et:(2===a.wrap?(At(a,255&t.adler),At(a,t.adler>>8&255),At(a,t.adler>>16&255),At(a,t.adler>>24&255),At(a,255&t.total_in),At(a,t.total_in>>8&255),At(a,t.total_in>>16&255),At(a,t.total_in>>24&255)):(Et(a,t.adler>>>16),Et(a,65535&t.adler)),xt(t),a.wrap>0&&(a.wrap=-a.wrap),0!==a.pending?tt:et)},deflateEnd:t=>{if(Lt(t))return at;const e=t.state.status;return t.state=null,e===mt?gt(t,it):tt},deflateSetDictionary:(t,e)=>{let a=e.length;if(Lt(t))return at;const i=t.state,n=i.wrap;if(2===n||1===n&&i.status!==wt||i.lookahead)return at;if(1===n&&(t.adler=C(t.adler,e,a,0)),i.wrap=0,a>=i.w_size){0===n&&(kt(i.head),i.strstart=0,i.block_start=0,i.insert=0);let t=new Uint8Array(i.w_size);t.set(e.subarray(a-i.w_size,a),0),e=t,a=i.w_size}const s=t.avail_in,r=t.next_in,o=t.input;for(t.avail_in=a,t.next_in=0,t.input=e,Ut(i);i.lookahead>=3;){let t=i.strstart,e=i.lookahead-2;do{i.ins_h=yt(i,i.ins_h,i.window[t+3-1]),i.prev[t&i.w_mask]=i.head[i.ins_h],i.head[i.ins_h]=t,t++}while(--e);i.strstart=t,i.lookahead=2,Ut(i)}return i.strstart+=i.lookahead,i.block_start=i.strstart,i.insert=i.lookahead,i.lookahead=0,i.match_length=i.prev_length=2,i.match_available=0,t.next_in=r,t.input=o,t.avail_in=s,i.wrap=n,tt},deflateInfo:"pako deflate (from Nodeca project)"};const Ht=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);var jt=function(t){const e=Array.prototype.slice.call(arguments,1);for(;e.length;){const a=e.shift();if(a){if("object"!=typeof a)throw new TypeError(a+"must be non-object");for(const e in a)Ht(a,e)&&(t[e]=a[e])}}return t},Kt=t=>{let e=0;for(let a=0,i=t.length;a<i;a++)e+=t[a].length;const a=new Uint8Array(e);for(let e=0,i=0,n=t.length;e<n;e++){let n=t[e];a.set(n,i),i+=n.length}return a};let Pt=!0;try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(t){Pt=!1}const Yt=new Uint8Array(256);for(let t=0;t<256;t++)Yt[t]=t>=252?6:t>=248?5:t>=240?4:t>=224?3:t>=192?2:1;Yt[254]=Yt[254]=1;var Gt=t=>{if("function"==typeof TextEncoder&&TextEncoder.prototype.encode)return(new TextEncoder).encode(t);let e,a,i,n,s,r=t.length,o=0;for(n=0;n<r;n++)a=t.charCodeAt(n),55296==(64512&a)&&n+1<r&&(i=t.charCodeAt(n+1),56320==(64512&i)&&(a=65536+(a-55296<<10)+(i-56320),n++)),o+=a<128?1:a<2048?2:a<65536?3:4;for(e=new Uint8Array(o),s=0,n=0;s<o;n++)a=t.charCodeAt(n),55296==(64512&a)&&n+1<r&&(i=t.charCodeAt(n+1),56320==(64512&i)&&(a=65536+(a-55296<<10)+(i-56320),n++)),a<128?e[s++]=a:a<2048?(e[s++]=192|a>>>6,e[s++]=128|63&a):a<65536?(e[s++]=224|a>>>12,e[s++]=128|a>>>6&63,e[s++]=128|63&a):(e[s++]=240|a>>>18,e[s++]=128|a>>>12&63,e[s++]=128|a>>>6&63,e[s++]=128|63&a);return e},Xt=(t,e)=>{const a=e||t.length;if("function"==typeof TextDecoder&&TextDecoder.prototype.decode)return(new TextDecoder).decode(t.subarray(0,e));let i,n;const s=new Array(2*a);for(n=0,i=0;i<a;){let e=t[i++];if(e<128){s[n++]=e;continue}let r=Yt[e];if(r>4)s[n++]=65533,i+=r-1;else{for(e&=2===r?31:3===r?15:7;r>1&&i<a;)e=e<<6|63&t[i++],r--;r>1?s[n++]=65533:e<65536?s[n++]=e:(e-=65536,s[n++]=55296|e>>10&1023,s[n++]=56320|1023&e)}}return((t,e)=>{if(e<65534&&t.subarray&&Pt)return String.fromCharCode.apply(null,t.length===e?t:t.subarray(0,e));let a="";for(let i=0;i<e;i++)a+=String.fromCharCode(t[i]);return a})(s,n)},Wt=(t,e)=>{(e=e||t.length)>t.length&&(e=t.length);let a=e-1;for(;a>=0&&128==(192&t[a]);)a--;return a<0||0===a?e:a+Yt[t[a]]>e?a:e};var qt=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0};const Jt=Object.prototype.toString,{Z_NO_FLUSH:Qt,Z_SYNC_FLUSH:Vt,Z_FULL_FLUSH:$t,Z_FINISH:te,Z_OK:ee,Z_STREAM_END:ae,Z_DEFAULT_COMPRESSION:ie,Z_DEFAULT_STRATEGY:ne,Z_DEFLATED:se}=K;function re(t){this.options=jt({level:ie,method:se,chunkSize:16384,windowBits:15,memLevel:8,strategy:ne},t||{});let e=this.options;e.raw&&e.windowBits>0?e.windowBits=-e.windowBits:e.gzip&&e.windowBits>0&&e.windowBits<16&&(e.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new qt,this.strm.avail_out=0;let a=Mt.deflateInit2(this.strm,e.level,e.method,e.windowBits,e.memLevel,e.strategy);if(a!==ee)throw new Error(j[a]);if(e.header&&Mt.deflateSetHeader(this.strm,e.header),e.dictionary){let t;if(t="string"==typeof e.dictionary?Gt(e.dictionary):"[object ArrayBuffer]"===Jt.call(e.dictionary)?new Uint8Array(e.dictionary):e.dictionary,a=Mt.deflateSetDictionary(this.strm,t),a!==ee)throw new Error(j[a]);this._dict_set=!0}}function oe(t,e){const a=new re(e);if(a.push(t,!0),a.err)throw a.msg||j[a.err];return a.result}re.prototype.push=function(t,e){const a=this.strm,i=this.options.chunkSize;let n,s;if(this.ended)return!1;for(s=e===~~e?e:!0===e?te:Qt,"string"==typeof t?a.input=Gt(t):"[object ArrayBuffer]"===Jt.call(t)?a.input=new Uint8Array(t):a.input=t,a.next_in=0,a.avail_in=a.input.length;;)if(0===a.avail_out&&(a.output=new Uint8Array(i),a.next_out=0,a.avail_out=i),(s===Vt||s===$t)&&a.avail_out<=6)this.onData(a.output.subarray(0,a.next_out)),a.avail_out=0;else{if(n=Mt.deflate(a,s),n===ae)return a.next_out>0&&this.onData(a.output.subarray(0,a.next_out)),n=Mt.deflateEnd(this.strm),this.onEnd(n),this.ended=!0,n===ee;if(0!==a.avail_out){if(s>0&&a.next_out>0)this.onData(a.output.subarray(0,a.next_out)),a.avail_out=0;else if(0===a.avail_in)break}else this.onData(a.output)}return!0},re.prototype.onData=function(t){this.chunks.push(t)},re.prototype.onEnd=function(t){t===ee&&(this.result=Kt(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg};var le={Deflate:re,deflate:oe,deflateRaw:function(t,e){return(e=e||{}).raw=!0,oe(t,e)},gzip:function(t,e){return(e=e||{}).gzip=!0,oe(t,e)},constants:K};const he=16209;var de=function(t,e){let a,i,n,s,r,o,l,h,d,_,f,c,u,w,m,b,g,p,k,v,y,x,z,A;const E=t.state;a=t.next_in,z=t.input,i=a+(t.avail_in-5),n=t.next_out,A=t.output,s=n-(e-t.avail_out),r=n+(t.avail_out-257),o=E.dmax,l=E.wsize,h=E.whave,d=E.wnext,_=E.window,f=E.hold,c=E.bits,u=E.lencode,w=E.distcode,m=(1<<E.lenbits)-1,b=(1<<E.distbits)-1;t:do{c<15&&(f+=z[a++]<<c,c+=8,f+=z[a++]<<c,c+=8),g=u[f&m];e:for(;;){if(p=g>>>24,f>>>=p,c-=p,p=g>>>16&255,0===p)A[n++]=65535&g;else{if(!(16&p)){if(0==(64&p)){g=u[(65535&g)+(f&(1<<p)-1)];continue e}if(32&p){E.mode=16191;break t}t.msg="invalid literal/length code",E.mode=he;break t}k=65535&g,p&=15,p&&(c<p&&(f+=z[a++]<<c,c+=8),k+=f&(1<<p)-1,f>>>=p,c-=p),c<15&&(f+=z[a++]<<c,c+=8,f+=z[a++]<<c,c+=8),g=w[f&b];a:for(;;){if(p=g>>>24,f>>>=p,c-=p,p=g>>>16&255,!(16&p)){if(0==(64&p)){g=w[(65535&g)+(f&(1<<p)-1)];continue a}t.msg="invalid distance code",E.mode=he;break t}if(v=65535&g,p&=15,c<p&&(f+=z[a++]<<c,c+=8,c<p&&(f+=z[a++]<<c,c+=8)),v+=f&(1<<p)-1,v>o){t.msg="invalid distance too far back",E.mode=he;break t}if(f>>>=p,c-=p,p=n-s,v>p){if(p=v-p,p>h&&E.sane){t.msg="invalid distance too far back",E.mode=he;break t}if(y=0,x=_,0===d){if(y+=l-p,p<k){k-=p;do{A[n++]=_[y++]}while(--p);y=n-v,x=A}}else if(d<p){if(y+=l+d-p,p-=d,p<k){k-=p;do{A[n++]=_[y++]}while(--p);if(y=0,d<k){p=d,k-=p;do{A[n++]=_[y++]}while(--p);y=n-v,x=A}}}else if(y+=d-p,p<k){k-=p;do{A[n++]=_[y++]}while(--p);y=n-v,x=A}for(;k>2;)A[n++]=x[y++],A[n++]=x[y++],A[n++]=x[y++],k-=3;k&&(A[n++]=x[y++],k>1&&(A[n++]=x[y++]))}else{y=n-v;do{A[n++]=A[y++],A[n++]=A[y++],A[n++]=A[y++],k-=3}while(k>2);k&&(A[n++]=A[y++],k>1&&(A[n++]=A[y++]))}break}}break}}while(a<i&&n<r);k=c>>3,a-=k,c-=k<<3,f&=(1<<c)-1,t.next_in=a,t.next_out=n,t.avail_in=a<i?i-a+5:5-(a-i),t.avail_out=n<r?r-n+257:257-(n-r),E.hold=f,E.bits=c};const _e=15,fe=new Uint16Array([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0]),ce=new Uint8Array([16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78]),ue=new Uint16Array([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0]),we=new Uint8Array([16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64]);var me=(t,e,a,i,n,s,r,o)=>{const l=o.bits;let h,d,_,f,c,u,w=0,m=0,b=0,g=0,p=0,k=0,v=0,y=0,x=0,z=0,A=null;const E=new Uint16Array(16),R=new Uint16Array(16);let Z,U,S,D=null;for(w=0;w<=_e;w++)E[w]=0;for(m=0;m<i;m++)E[e[a+m]]++;for(p=l,g=_e;g>=1&&0===E[g];g--);if(p>g&&(p=g),0===g)return n[s++]=20971520,n[s++]=20971520,o.bits=1,0;for(b=1;b<g&&0===E[b];b++);for(p<b&&(p=b),y=1,w=1;w<=_e;w++)if(y<<=1,y-=E[w],y<0)return-1;if(y>0&&(0===t||1!==g))return-1;for(R[1]=0,w=1;w<_e;w++)R[w+1]=R[w]+E[w];for(m=0;m<i;m++)0!==e[a+m]&&(r[R[e[a+m]]++]=m);if(0===t?(A=D=r,u=20):1===t?(A=fe,D=ce,u=257):(A=ue,D=we,u=0),z=0,m=0,w=b,c=s,k=p,v=0,_=-1,x=1<<p,f=x-1,1===t&&x>852||2===t&&x>592)return 1;for(;;){Z=w-v,r[m]+1<u?(U=0,S=r[m]):r[m]>=u?(U=D[r[m]-u],S=A[r[m]-u]):(U=96,S=0),h=1<<w-v,d=1<<k,b=d;do{d-=h,n[c+(z>>v)+d]=Z<<24|U<<16|S|0}while(0!==d);for(h=1<<w-1;z&h;)h>>=1;if(0!==h?(z&=h-1,z+=h):z=0,m++,0==--E[w]){if(w===g)break;w=e[a+r[m]]}if(w>p&&(z&f)!==_){for(0===v&&(v=p),c+=b,k=w-v,y=1<<k;k+v<g&&(y-=E[k+v],!(y<=0));)k++,y<<=1;if(x+=1<<k,1===t&&x>852||2===t&&x>592)return 1;_=z&f,n[_]=p<<24|k<<16|c-s|0}}return 0!==z&&(n[c+z]=w-v<<24|64<<16|0),o.bits=p,0};const{Z_FINISH:be,Z_BLOCK:ge,Z_TREES:pe,Z_OK:ke,Z_STREAM_END:ve,Z_NEED_DICT:ye,Z_STREAM_ERROR:xe,Z_DATA_ERROR:ze,Z_MEM_ERROR:Ae,Z_BUF_ERROR:Ee,Z_DEFLATED:Re}=K,Ze=16180,Ue=16190,Se=16191,De=16192,Te=16194,Oe=16199,Ie=16200,Fe=16206,Le=16209,Ne=t=>(t>>>24&255)+(t>>>8&65280)+((65280&t)<<8)+((255&t)<<24);function Be(){this.strm=null,this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new Uint16Array(320),this.work=new Uint16Array(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}const Ce=t=>{if(!t)return 1;const e=t.state;return!e||e.strm!==t||e.mode<Ze||e.mode>16211?1:0},Me=t=>{if(Ce(t))return xe;const e=t.state;return t.total_in=t.total_out=e.total=0,t.msg="",e.wrap&&(t.adler=1&e.wrap),e.mode=Ze,e.last=0,e.havedict=0,e.flags=-1,e.dmax=32768,e.head=null,e.hold=0,e.bits=0,e.lencode=e.lendyn=new Int32Array(852),e.distcode=e.distdyn=new Int32Array(592),e.sane=1,e.back=-1,ke},He=t=>{if(Ce(t))return xe;const e=t.state;return e.wsize=0,e.whave=0,e.wnext=0,Me(t)},je=(t,e)=>{let a;if(Ce(t))return xe;const i=t.state;return e<0?(a=0,e=-e):(a=5+(e>>4),e<48&&(e&=15)),e&&(e<8||e>15)?xe:(null!==i.window&&i.wbits!==e&&(i.window=null),i.wrap=a,i.wbits=e,He(t))},Ke=(t,e)=>{if(!t)return xe;const a=new Be;t.state=a,a.strm=t,a.window=null,a.mode=Ze;const i=je(t,e);return i!==ke&&(t.state=null),i};let Pe,Ye,Ge=!0;const Xe=t=>{if(Ge){Pe=new Int32Array(512),Ye=new Int32Array(32);let e=0;for(;e<144;)t.lens[e++]=8;for(;e<256;)t.lens[e++]=9;for(;e<280;)t.lens[e++]=7;for(;e<288;)t.lens[e++]=8;for(me(1,t.lens,0,288,Pe,0,t.work,{bits:9}),e=0;e<32;)t.lens[e++]=5;me(2,t.lens,0,32,Ye,0,t.work,{bits:5}),Ge=!1}t.lencode=Pe,t.lenbits=9,t.distcode=Ye,t.distbits=5},We=(t,e,a,i)=>{let n;const s=t.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new Uint8Array(s.wsize)),i>=s.wsize?(s.window.set(e.subarray(a-s.wsize,a),0),s.wnext=0,s.whave=s.wsize):(n=s.wsize-s.wnext,n>i&&(n=i),s.window.set(e.subarray(a-i,a-i+n),s.wnext),(i-=n)?(s.window.set(e.subarray(a-i,a),0),s.wnext=i,s.whave=s.wsize):(s.wnext+=n,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=n))),0};var qe={inflateReset:He,inflateReset2:je,inflateResetKeep:Me,inflateInit:t=>Ke(t,15),inflateInit2:Ke,inflate:(t,e)=>{let a,i,n,s,r,o,l,h,d,_,f,c,u,w,m,b,g,p,k,v,y,x,z=0;const A=new Uint8Array(4);let E,R;const Z=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);if(Ce(t)||!t.output||!t.input&&0!==t.avail_in)return xe;a=t.state,a.mode===Se&&(a.mode=De),r=t.next_out,n=t.output,l=t.avail_out,s=t.next_in,i=t.input,o=t.avail_in,h=a.hold,d=a.bits,_=o,f=l,x=ke;t:for(;;)switch(a.mode){case Ze:if(0===a.wrap){a.mode=De;break}for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(2&a.wrap&&35615===h){0===a.wbits&&(a.wbits=15),a.check=0,A[0]=255&h,A[1]=h>>>8&255,a.check=H(a.check,A,2,0),h=0,d=0,a.mode=16181;break}if(a.head&&(a.head.done=!1),!(1&a.wrap)||(((255&h)<<8)+(h>>8))%31){t.msg="incorrect header check",a.mode=Le;break}if((15&h)!==Re){t.msg="unknown compression method",a.mode=Le;break}if(h>>>=4,d-=4,y=8+(15&h),0===a.wbits&&(a.wbits=y),y>15||y>a.wbits){t.msg="invalid window size",a.mode=Le;break}a.dmax=1<<a.wbits,a.flags=0,t.adler=a.check=1,a.mode=512&h?16189:Se,h=0,d=0;break;case 16181:for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(a.flags=h,(255&a.flags)!==Re){t.msg="unknown compression method",a.mode=Le;break}if(57344&a.flags){t.msg="unknown header flags set",a.mode=Le;break}a.head&&(a.head.text=h>>8&1),512&a.flags&&4&a.wrap&&(A[0]=255&h,A[1]=h>>>8&255,a.check=H(a.check,A,2,0)),h=0,d=0,a.mode=16182;case 16182:for(;d<32;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.head&&(a.head.time=h),512&a.flags&&4&a.wrap&&(A[0]=255&h,A[1]=h>>>8&255,A[2]=h>>>16&255,A[3]=h>>>24&255,a.check=H(a.check,A,4,0)),h=0,d=0,a.mode=16183;case 16183:for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.head&&(a.head.xflags=255&h,a.head.os=h>>8),512&a.flags&&4&a.wrap&&(A[0]=255&h,A[1]=h>>>8&255,a.check=H(a.check,A,2,0)),h=0,d=0,a.mode=16184;case 16184:if(1024&a.flags){for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.length=h,a.head&&(a.head.extra_len=h),512&a.flags&&4&a.wrap&&(A[0]=255&h,A[1]=h>>>8&255,a.check=H(a.check,A,2,0)),h=0,d=0}else a.head&&(a.head.extra=null);a.mode=16185;case 16185:if(1024&a.flags&&(c=a.length,c>o&&(c=o),c&&(a.head&&(y=a.head.extra_len-a.length,a.head.extra||(a.head.extra=new Uint8Array(a.head.extra_len)),a.head.extra.set(i.subarray(s,s+c),y)),512&a.flags&&4&a.wrap&&(a.check=H(a.check,i,c,s)),o-=c,s+=c,a.length-=c),a.length))break t;a.length=0,a.mode=16186;case 16186:if(2048&a.flags){if(0===o)break t;c=0;do{y=i[s+c++],a.head&&y&&a.length<65536&&(a.head.name+=String.fromCharCode(y))}while(y&&c<o);if(512&a.flags&&4&a.wrap&&(a.check=H(a.check,i,c,s)),o-=c,s+=c,y)break t}else a.head&&(a.head.name=null);a.length=0,a.mode=16187;case 16187:if(4096&a.flags){if(0===o)break t;c=0;do{y=i[s+c++],a.head&&y&&a.length<65536&&(a.head.comment+=String.fromCharCode(y))}while(y&&c<o);if(512&a.flags&&4&a.wrap&&(a.check=H(a.check,i,c,s)),o-=c,s+=c,y)break t}else a.head&&(a.head.comment=null);a.mode=16188;case 16188:if(512&a.flags){for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(4&a.wrap&&h!==(65535&a.check)){t.msg="header crc mismatch",a.mode=Le;break}h=0,d=0}a.head&&(a.head.hcrc=a.flags>>9&1,a.head.done=!0),t.adler=a.check=0,a.mode=Se;break;case 16189:for(;d<32;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}t.adler=a.check=Ne(h),h=0,d=0,a.mode=Ue;case Ue:if(0===a.havedict)return t.next_out=r,t.avail_out=l,t.next_in=s,t.avail_in=o,a.hold=h,a.bits=d,ye;t.adler=a.check=1,a.mode=Se;case Se:if(e===ge||e===pe)break t;case De:if(a.last){h>>>=7&d,d-=7&d,a.mode=Fe;break}for(;d<3;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}switch(a.last=1&h,h>>>=1,d-=1,3&h){case 0:a.mode=16193;break;case 1:if(Xe(a),a.mode=Oe,e===pe){h>>>=2,d-=2;break t}break;case 2:a.mode=16196;break;case 3:t.msg="invalid block type",a.mode=Le}h>>>=2,d-=2;break;case 16193:for(h>>>=7&d,d-=7&d;d<32;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if((65535&h)!=(h>>>16^65535)){t.msg="invalid stored block lengths",a.mode=Le;break}if(a.length=65535&h,h=0,d=0,a.mode=Te,e===pe)break t;case Te:a.mode=16195;case 16195:if(c=a.length,c){if(c>o&&(c=o),c>l&&(c=l),0===c)break t;n.set(i.subarray(s,s+c),r),o-=c,s+=c,l-=c,r+=c,a.length-=c;break}a.mode=Se;break;case 16196:for(;d<14;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(a.nlen=257+(31&h),h>>>=5,d-=5,a.ndist=1+(31&h),h>>>=5,d-=5,a.ncode=4+(15&h),h>>>=4,d-=4,a.nlen>286||a.ndist>30){t.msg="too many length or distance symbols",a.mode=Le;break}a.have=0,a.mode=16197;case 16197:for(;a.have<a.ncode;){for(;d<3;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.lens[Z[a.have++]]=7&h,h>>>=3,d-=3}for(;a.have<19;)a.lens[Z[a.have++]]=0;if(a.lencode=a.lendyn,a.lenbits=7,E={bits:a.lenbits},x=me(0,a.lens,0,19,a.lencode,0,a.work,E),a.lenbits=E.bits,x){t.msg="invalid code lengths set",a.mode=Le;break}a.have=0,a.mode=16198;case 16198:for(;a.have<a.nlen+a.ndist;){for(;z=a.lencode[h&(1<<a.lenbits)-1],m=z>>>24,b=z>>>16&255,g=65535&z,!(m<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(g<16)h>>>=m,d-=m,a.lens[a.have++]=g;else{if(16===g){for(R=m+2;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(h>>>=m,d-=m,0===a.have){t.msg="invalid bit length repeat",a.mode=Le;break}y=a.lens[a.have-1],c=3+(3&h),h>>>=2,d-=2}else if(17===g){for(R=m+3;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}h>>>=m,d-=m,y=0,c=3+(7&h),h>>>=3,d-=3}else{for(R=m+7;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}h>>>=m,d-=m,y=0,c=11+(127&h),h>>>=7,d-=7}if(a.have+c>a.nlen+a.ndist){t.msg="invalid bit length repeat",a.mode=Le;break}for(;c--;)a.lens[a.have++]=y}}if(a.mode===Le)break;if(0===a.lens[256]){t.msg="invalid code -- missing end-of-block",a.mode=Le;break}if(a.lenbits=9,E={bits:a.lenbits},x=me(1,a.lens,0,a.nlen,a.lencode,0,a.work,E),a.lenbits=E.bits,x){t.msg="invalid literal/lengths set",a.mode=Le;break}if(a.distbits=6,a.distcode=a.distdyn,E={bits:a.distbits},x=me(2,a.lens,a.nlen,a.ndist,a.distcode,0,a.work,E),a.distbits=E.bits,x){t.msg="invalid distances set",a.mode=Le;break}if(a.mode=Oe,e===pe)break t;case Oe:a.mode=Ie;case Ie:if(o>=6&&l>=258){t.next_out=r,t.avail_out=l,t.next_in=s,t.avail_in=o,a.hold=h,a.bits=d,de(t,f),r=t.next_out,n=t.output,l=t.avail_out,s=t.next_in,i=t.input,o=t.avail_in,h=a.hold,d=a.bits,a.mode===Se&&(a.back=-1);break}for(a.back=0;z=a.lencode[h&(1<<a.lenbits)-1],m=z>>>24,b=z>>>16&255,g=65535&z,!(m<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(b&&0==(240&b)){for(p=m,k=b,v=g;z=a.lencode[v+((h&(1<<p+k)-1)>>p)],m=z>>>24,b=z>>>16&255,g=65535&z,!(p+m<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}h>>>=p,d-=p,a.back+=p}if(h>>>=m,d-=m,a.back+=m,a.length=g,0===b){a.mode=16205;break}if(32&b){a.back=-1,a.mode=Se;break}if(64&b){t.msg="invalid literal/length code",a.mode=Le;break}a.extra=15&b,a.mode=16201;case 16201:if(a.extra){for(R=a.extra;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.length+=h&(1<<a.extra)-1,h>>>=a.extra,d-=a.extra,a.back+=a.extra}a.was=a.length,a.mode=16202;case 16202:for(;z=a.distcode[h&(1<<a.distbits)-1],m=z>>>24,b=z>>>16&255,g=65535&z,!(m<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(0==(240&b)){for(p=m,k=b,v=g;z=a.distcode[v+((h&(1<<p+k)-1)>>p)],m=z>>>24,b=z>>>16&255,g=65535&z,!(p+m<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}h>>>=p,d-=p,a.back+=p}if(h>>>=m,d-=m,a.back+=m,64&b){t.msg="invalid distance code",a.mode=Le;break}a.offset=g,a.extra=15&b,a.mode=16203;case 16203:if(a.extra){for(R=a.extra;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.offset+=h&(1<<a.extra)-1,h>>>=a.extra,d-=a.extra,a.back+=a.extra}if(a.offset>a.dmax){t.msg="invalid distance too far back",a.mode=Le;break}a.mode=16204;case 16204:if(0===l)break t;if(c=f-l,a.offset>c){if(c=a.offset-c,c>a.whave&&a.sane){t.msg="invalid distance too far back",a.mode=Le;break}c>a.wnext?(c-=a.wnext,u=a.wsize-c):u=a.wnext-c,c>a.length&&(c=a.length),w=a.window}else w=n,u=r-a.offset,c=a.length;c>l&&(c=l),l-=c,a.length-=c;do{n[r++]=w[u++]}while(--c);0===a.length&&(a.mode=Ie);break;case 16205:if(0===l)break t;n[r++]=a.length,l--,a.mode=Ie;break;case Fe:if(a.wrap){for(;d<32;){if(0===o)break t;o--,h|=i[s++]<<d,d+=8}if(f-=l,t.total_out+=f,a.total+=f,4&a.wrap&&f&&(t.adler=a.check=a.flags?H(a.check,n,f,r-f):C(a.check,n,f,r-f)),f=l,4&a.wrap&&(a.flags?h:Ne(h))!==a.check){t.msg="incorrect data check",a.mode=Le;break}h=0,d=0}a.mode=16207;case 16207:if(a.wrap&&a.flags){for(;d<32;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(4&a.wrap&&h!==(4294967295&a.total)){t.msg="incorrect length check",a.mode=Le;break}h=0,d=0}a.mode=16208;case 16208:x=ve;break t;case Le:x=ze;break t;case 16210:return Ae;default:return xe}return t.next_out=r,t.avail_out=l,t.next_in=s,t.avail_in=o,a.hold=h,a.bits=d,(a.wsize||f!==t.avail_out&&a.mode<Le&&(a.mode<Fe||e!==be))&&We(t,t.output,t.next_out,f-t.avail_out),_-=t.avail_in,f-=t.avail_out,t.total_in+=_,t.total_out+=f,a.total+=f,4&a.wrap&&f&&(t.adler=a.check=a.flags?H(a.check,n,f,t.next_out-f):C(a.check,n,f,t.next_out-f)),t.data_type=a.bits+(a.last?64:0)+(a.mode===Se?128:0)+(a.mode===Oe||a.mode===Te?256:0),(0===_&&0===f||e===be)&&x===ke&&(x=Ee),x},inflateEnd:t=>{if(Ce(t))return xe;let e=t.state;return e.window&&(e.window=null),t.state=null,ke},inflateGetHeader:(t,e)=>{if(Ce(t))return xe;const a=t.state;return 0==(2&a.wrap)?xe:(a.head=e,e.done=!1,ke)},inflateSetDictionary:(t,e)=>{const a=e.length;let i,n,s;return Ce(t)?xe:(i=t.state,0!==i.wrap&&i.mode!==Ue?xe:i.mode===Ue&&(n=1,n=C(n,e,a,0),n!==i.check)?ze:(s=We(t,e,a,a),s?(i.mode=16210,Ae):(i.havedict=1,ke)))},inflateInfo:"pako inflate (from Nodeca project)"};var Je=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1};const Qe=Object.prototype.toString,{Z_NO_FLUSH:Ve,Z_FINISH:$e,Z_OK:ta,Z_STREAM_END:ea,Z_NEED_DICT:aa,Z_STREAM_ERROR:ia,Z_DATA_ERROR:na,Z_MEM_ERROR:sa}=K;function ra(t){this.options=jt({chunkSize:65536,windowBits:15,to:""},t||{});const e=this.options;e.raw&&e.windowBits>=0&&e.windowBits<16&&(e.windowBits=-e.windowBits,0===e.windowBits&&(e.windowBits=-15)),!(e.windowBits>=0&&e.windowBits<16)||t&&t.windowBits||(e.windowBits+=32),e.windowBits>15&&e.windowBits<48&&0==(15&e.windowBits)&&(e.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new qt,this.strm.avail_out=0;let a=qe.inflateInit2(this.strm,e.windowBits);if(a!==ta)throw new Error(j[a]);if(this.header=new Je,qe.inflateGetHeader(this.strm,this.header),e.dictionary&&("string"==typeof e.dictionary?e.dictionary=Gt(e.dictionary):"[object ArrayBuffer]"===Qe.call(e.dictionary)&&(e.dictionary=new Uint8Array(e.dictionary)),e.raw&&(a=qe.inflateSetDictionary(this.strm,e.dictionary),a!==ta)))throw new Error(j[a])}function oa(t,e){const a=new ra(e);if(a.push(t),a.err)throw a.msg||j[a.err];return a.result}ra.prototype.push=function(t,e){const a=this.strm,i=this.options.chunkSize,n=this.options.dictionary;let s,r,o;if(this.ended)return!1;for(r=e===~~e?e:!0===e?$e:Ve,"[object ArrayBuffer]"===Qe.call(t)?a.input=new Uint8Array(t):a.input=t,a.next_in=0,a.avail_in=a.input.length;;){for(0===a.avail_out&&(a.output=new Uint8Array(i),a.next_out=0,a.avail_out=i),s=qe.inflate(a,r),s===aa&&n&&(s=qe.inflateSetDictionary(a,n),s===ta?s=qe.inflate(a,r):s===na&&(s=aa));a.avail_in>0&&s===ea&&a.state.wrap>0&&0!==t[a.next_in];)qe.inflateReset(a),s=qe.inflate(a,r);switch(s){case ia:case na:case aa:case sa:return this.onEnd(s),this.ended=!0,!1}if(o=a.avail_out,a.next_out&&(0===a.avail_out||s===ea))if("string"===this.options.to){let t=Wt(a.output,a.next_out),e=a.next_out-t,n=Xt(a.output,t);a.next_out=e,a.avail_out=i-e,e&&a.output.set(a.output.subarray(t,t+e),0),this.onData(n)}else this.onData(a.output.length===a.next_out?a.output:a.output.subarray(0,a.next_out));if(s!==ta||0!==o){if(s===ea)return s=qe.inflateEnd(this.strm),this.onEnd(s),this.ended=!0,!0;if(0===a.avail_in)break}}return!0},ra.prototype.onData=function(t){this.chunks.push(t)},ra.prototype.onEnd=function(t){t===ta&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=Kt(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg};var la={Inflate:ra,inflate:oa,inflateRaw:function(t,e){return(e=e||{}).raw=!0,oa(t,e)},ungzip:oa,constants:K};const{Deflate:ha,deflate:da,deflateRaw:_a,gzip:fa}=le,{Inflate:ca,inflate:ua,inflateRaw:wa,ungzip:ma}=la;var ba=ha,ga=da,pa=_a,ka=fa,va=ca,ya=ua,xa=wa,za=ma,Aa=K,Ea={Deflate:ba,deflate:ga,deflateRaw:pa,gzip:ka,Inflate:va,inflate:ya,inflateRaw:xa,ungzip:za,constants:Aa};t.Deflate=ba,t.Inflate=va,t.constants=Aa,t.default=Ea,t.deflate=ga,t.deflateRaw=pa,t.gzip=ka,t.inflate=ya,t.inflateRaw=xa,t.ungzip=za,Object.defineProperty(t,"__esModule",{value:!0})}));

return module.exports;})();
__load('src/playtest/portable.js').installPortableGlobals(__pako);
return __load("src/playtest/public.js")["createPlaytestAPI"]({"version":"1.0.0","engine":"sha256:045d5a8353422b89980b2d2f0e2a1bf4bebdada54436f8d37792fc42bc675441","format":"ghostmaze-playtest-v1"});
})();
