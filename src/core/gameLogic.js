import { WALL_TYPES, START_ROOM_SIZE } from './constants.js';
import { GameState } from './gameState.js';
import { directionIndex } from './mapDataUtils.js';

// ==================================================
//  GameLogic: 纯函数模块，处理所有游戏逻辑
// ==================================================

// 静态层与权威墙态作为弱引用键；不写入局面，不影响历史或编号。
const ghostDistanceCache = new WeakMap();

export const GameLogic = {
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
        const target = end.y * width + end.x;
        let byWalls = ghostDistanceCache.get(layerDef);
        if (!byWalls) { byWalls = new WeakMap(); ghostDistanceCache.set(layerDef, byWalls); }
        let targets = byWalls.get(layerState.wallStates);
        if (!targets) { targets = new Map(); byWalls.set(layerState.wallStates, targets); }
        let distances = targets.get(target);
        const neighbors = [{ dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }];
        const passable = (x, y, nx, ny, direction) => {
            if (nx < 0 || ny < 0 || nx >= width || ny >= height || !layerDef.activeCells[ny][nx]) return false;
            const wall = this._getWallBetween({ x, y }, { x: nx, y: ny }, layerState.wallStates, direction);
            return !wall || wall.type === WALL_TYPES.EMPTY || (wall.type === WALL_TYPES.LETTER_DOOR && wall.currentState === 'open');
        };
        if (!distances) {
            distances = new Int32Array(width * height).fill(-1);
            const queue = new Int32Array(width * height); let head = 0, tail = 1;
            queue[0] = target; distances[target] = 0;
            while (head < tail) {
                const cell = queue[head++], x = cell % width, y = Math.floor(cell / width);
                for (const direction of neighbors) {
                    const nx = x + direction.dx, ny = y + direction.dy, next = ny * width + nx;
                    if (!passable(x, y, nx, ny, direction) || distances[next] !== -1) continue;
                    distances[next] = distances[cell] + 1; queue[tail++] = next;
                }
            }
            if (targets.size >= 32) targets.delete(targets.keys().next().value);
            targets.set(target, distances);
        }
        let x = start.x, y = start.y;
        if (distances[y * width + x] < 0) return null;
        const path = [{ x, y }];
        while (x !== end.x || y !== end.y) {
            const distance = distances[y * width + x];
            // 保留原从鬼出发BFS的上、右、下、左等长路线选择顺序。
            const direction = neighbors.find(d => passable(x, y, x + d.dx, y + d.dy, d) && distances[(y + d.dy) * width + x + d.dx] === distance - 1);
            if (!direction) return null;
            x += direction.dx; y += direction.dy; path.push({ x, y });
        }
        return path;
    }
};
