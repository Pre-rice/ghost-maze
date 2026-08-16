import { WALL_TYPES, EDITOR_TOOLS, START_ROOM_SIZE, getStartRoomY } from '../core/constants.js';
import * as Editor from './editor.js';
import { createNewLayer, cleanupStairsOnLayerRemove } from '../layerManager.js';

/**
 * EditorDocument - 编辑器会话的唯一数据源（纯逻辑，零 DOM）
 *
 * 负责编辑器状态的全部读改写：从 mapData 装载 / 编辑操作 / 导出 mapData。
 * 行为与 GhostMazeGame 原编辑器实现逐行对应（Phase 3a 行为锁定）；
 * 画布坐标换算（cellSize）、渲染、DOM 交互不属于本类，由调用方负责。
 *
 * 状态字段（与层数据的关系）：
 *   - 单层（multiLayerMode=false）：hWalls/vWalls/activeCells/ghosts/items/buttons/
 *     endPos/customStartPos 即当前编辑数据；layers 为空
 *   - 多层（multiLayerMode=true）：当前层字段与 layers[currentLayer] 保持同引用，
 *     switchLayer 时整体切换；stairs 为全局数组（跨层配对）
 *   - playerLayer：出生层索引（游戏启动时玩家所在层）
 */
export class EditorDocument {
    constructor() {
        this.width = 10;
        this.height = 10;
        this.mode = 'regular';           // 'regular' | 'free'
        this.multiLayerMode = false;
        this.layerCount = 1;
        this.currentLayer = 0;
        this.playerLayer = 0;
        this.startPos = { x: 1, y: 8 };  // regular 模式固定起点（createBlank 时按尺寸重设）
        this.hWalls = [];
        this.vWalls = [];
        this.activeCells = [];
        this.ghosts = [];
        this.items = [];
        this.buttons = [];
        this.endPos = null;
        this.customStartPos = null;
        this.stairs = [];
        this.layers = [];
    }

    /** 空白文档（按模式创建空白墙布局） */
    static blank(width, height, mode = 'regular', multiLayerMode = false) {
        const doc = new EditorDocument();
        doc.mode = mode;
        doc.multiLayerMode = multiLayerMode;
        doc.createBlank(width, height);
        return doc;
    }

    /** 从 mapData 装载（对应 GhostMazeGame.enterEditorMode 的纯数据部分） */
    static fromMapData(mapData) {
        const doc = new EditorDocument();
        doc.load(mapData);
        return doc;
    }

    // ---------- 装载 / 导出 ----------

    /**
     * 装载 mapData 为编辑状态（行为逐行对应 enterEditorMode L810-846）。
     * 起点层：仅由层内 customStartPos 扫描推导（与 MapDefinition._findPlayerStart 一致，无 v1 残留回退）。
     */
    load(mapData) {
        this.width = mapData.width;
        this.height = mapData.height;
        this.startPos = { x: 1, y: this.height - 2 };
        this.customStartPos = mapData.customStartPos || null;
        if (mapData.multiLayerMode && mapData.layers) {
            this.customStartPos = null;
            for (let i = 0; i < mapData.layers.length; i++) {
                if (mapData.layers[i] && mapData.layers[i].customStartPos) {
                    this.customStartPos = mapData.layers[i].customStartPos;
                    break;
                }
            }
        }
        this.activeCells = mapData.activeCells || Array(this.height).fill(null).map(() => Array(this.width).fill(true));
        this.mode = mapData.editorMode || 'regular';
        this.multiLayerMode = mapData.multiLayerMode || false;
        this.layerCount = mapData.layerCount || 1;
        this.currentLayer = 0;
        this.stairs = JSON.parse(JSON.stringify(mapData.stairs || []));
        this.layers = JSON.parse(JSON.stringify(mapData.layers || []));
        if (this.multiLayerMode && this.layers.length > 0) {
            // 起点层：层内 customStartPos 扫描（与 MapDefinition._findPlayerStart free 分支一致）
            let startLayerIndex = 0;
            for (let i = 0; i < this.layers.length; i++) {
                if (this.layers[i] && this.layers[i].customStartPos) { startLayerIndex = i; break; }
            }
            this.currentLayer = startLayerIndex;
            this.playerLayer = startLayerIndex;
            const layerData = this.layers[this.currentLayer];
            if (layerData) {
                this.hWalls = layerData.hWalls;
                this.vWalls = layerData.vWalls;
                this.endPos = layerData.endPos;
                this.ghosts = layerData.ghosts;
                this.items = layerData.items;
                this.buttons = layerData.buttons;
                this.activeCells = layerData.activeCells;
                this.customStartPos = layerData.customStartPos;
            }
        } else {
            this.hWalls = JSON.parse(JSON.stringify(mapData.hWalls));
            this.vWalls = JSON.parse(JSON.stringify(mapData.vWalls));
            this.endPos = mapData.endPos ? { ...mapData.endPos } : null;
            this.ghosts = JSON.parse(JSON.stringify(mapData.initialGhosts || []));
            this.items = JSON.parse(JSON.stringify(mapData.items || []));
            this.buttons = JSON.parse(JSON.stringify(mapData.buttons || []));
        }
    }

    /** 导出游玩用 mapData（对应 playEditedMap 的 editedMapData） */
    toMapData() {
        return {
            width: this.width, height: this.height, hWalls: this.hWalls, vWalls: this.vWalls,
            endPos: this.endPos,
            initialGhosts: this.ghosts.map((g, i) => ({ x: g.x, y: g.y, id: i })),
            items: this.items, buttons: this.buttons,
            activeCells: this.activeCells, editorMode: this.mode, customStartPos: this.customStartPos,
            multiLayerMode: this.multiLayerMode, layerCount: this.layerCount,
            layers: JSON.parse(JSON.stringify(this.layers)),
            stairs: JSON.parse(JSON.stringify(this.stairs))
        };
    }

    /** 导出分享码用 mapData（对应 generateShareCode 编辑器分支 sourceData） */
    toShareMapData(gameMode, initialHealth, initialStamina) {
        this.saveCurrentLayer();
        let layer0Data = {
            hWalls: this.hWalls, vWalls: this.vWalls, endPos: this.endPos,
            ghosts: this.ghosts, items: this.items, buttons: this.buttons || [],
            activeCells: this.activeCells, customStartPos: this.customStartPos
        };
        if (this.multiLayerMode && this.layers && this.layers[0]) { layer0Data = this.layers[0]; }
        return {
            width: this.width, height: this.height, hWalls: layer0Data.hWalls, vWalls: layer0Data.vWalls,
            endPos: layer0Data.endPos, initialGhosts: layer0Data.ghosts, items: layer0Data.items,
            buttons: layer0Data.buttons, gameMode: gameMode,
            initialHealth: initialHealth, initialStamina: initialStamina,
            activeCells: layer0Data.activeCells, editorMode: this.mode, customStartPos: layer0Data.customStartPos,
            multiLayerMode: this.multiLayerMode, layerCount: this.layerCount,
            layers: this.layers, stairs: this.stairs
        };
    }

    // ---------- 尺寸 / 图层 ----------

    /** 创建空白编辑状态（内联原 editor.createBlankEditorMap 纯数据逻辑） */
    createBlank(width, height) {
        this.width = width;
        this.height = height;
        const wall = () => ({ type: WALL_TYPES.SOLID, keys: 0 });
        const empty = () => ({ type: WALL_TYPES.EMPTY, keys: 0 });
        const door = () => ({ type: WALL_TYPES.DOOR, keys: 0 });
        this.hWalls = Array(this.height + 1).fill(null).map(() => Array(this.width).fill(null).map(empty));
        this.vWalls = Array(this.height).fill(null).map(() => Array(this.width + 1).fill(null).map(empty));
        this.customStartPos = null;
        this.activeCells = Array(this.height).fill(null).map(() => Array(this.width).fill(true));
        if (this.mode === 'regular') {
            // 外圈边界
            for (let x = 0; x < this.width; x++) {
                this.hWalls[0][x] = wall();
                this.hWalls[this.height][x] = wall();
            }
            for (let y = 0; y < this.height; y++) {
                this.vWalls[y][0] = wall();
                this.vWalls[y][this.width] = wall();
            }
            // 起始房间（左下角 3×3）围墙 + 两个出口 DOOR
            const roomY = getStartRoomY(this.height);
            for (let x = 0; x < START_ROOM_SIZE; x++) this.hWalls[roomY + START_ROOM_SIZE][x] = wall();
            for (let y = roomY; y < roomY + START_ROOM_SIZE; y++) this.vWalls[y][0] = wall();
            this.hWalls[roomY][0] = wall();
            this.hWalls[roomY][2] = wall();
            this.vWalls[roomY][START_ROOM_SIZE] = wall();
            this.vWalls[roomY + 2][START_ROOM_SIZE] = wall();
            this.hWalls[roomY][1] = door();
            this.vWalls[roomY + 1][START_ROOM_SIZE] = door();
        }
        this.startPos = { x: 1, y: this.height - 2 };
        this.endPos = null;
        this.ghosts = [];
        this.items = [];
        this.buttons = [];
        this.stairs = [];
        if (this.multiLayerMode) {
            this.layers = [{
                hWalls: this.hWalls, vWalls: this.vWalls, activeCells: this.activeCells,
                ghosts: [], items: [], buttons: [], stairs: [], endPos: null, customStartPos: null
            }];
            this.layerCount = 1;
            this.currentLayer = 0;
        }
    }

    /**
     * 调整尺寸并清空（对应 resizeAndClearEditor 纯数据部分）。
     * @param {number} size - 新尺寸（8-20 的 UI 校验由调用方负责）
     * @param {boolean} wasMultiLayer - 调整前的多层状态
     * @param {number} savedLayerCount - 调整前的层数
     */
    resize(size, wasMultiLayer, savedLayerCount) {
        this.width = size;
        this.height = size;
        this.createBlank(size, size);
        if (wasMultiLayer && savedLayerCount > 1) {
            this.multiLayerMode = true;
            this.layerCount = savedLayerCount;
            this.currentLayer = 0;
            this.playerLayer = 0;
            this.stairs = [];
            this.layers = [];
            for (let i = 0; i < savedLayerCount; i++) {
                this.layers.push({
                    hWalls: Editor.createEmptyWalls('h', size, size),
                    vWalls: Editor.createEmptyWalls('v', size, size),
                    activeCells: Array(size).fill(null).map(() => Array(size).fill(true)),
                    ghosts: [], items: [], buttons: [], stairs: [], endPos: null, customStartPos: null
                });
            }
            const firstLayer = this.layers[0];
            this.hWalls = firstLayer.hWalls;
            this.vWalls = firstLayer.vWalls;
            this.activeCells = firstLayer.activeCells;
            this.ghosts = firstLayer.ghosts;
            this.items = firstLayer.items;
            this.buttons = firstLayer.buttons;
        }
    }

    /** 把当前编辑字段写回 layers[currentLayer]（对应 _saveCurrentLayerData） */
    saveCurrentLayer() {
        if (!this.multiLayerMode || this.layers.length === 0) return;
        this.layers[this.currentLayer] = {
            hWalls: this.hWalls, vWalls: this.vWalls, activeCells: this.activeCells,
            ghosts: this.ghosts, items: this.items, buttons: this.buttons,
            stairs: this.stairs.filter(s => s.layer === this.currentLayer),
            endPos: this.endPos, customStartPos: this.customStartPos
        };
    }

    /** 切换当前编辑层（对应 _switchToLayer；旧层数据需先 saveCurrentLayer） */
    switchLayer(index) {
        this.currentLayer = index;
        if (this.layers[index]) {
            const layer = this.layers[index];
            this.hWalls = layer.hWalls;
            this.vWalls = layer.vWalls;
            this.activeCells = layer.activeCells;
            this.ghosts = layer.ghosts;
            this.items = layer.items;
            this.buttons = layer.buttons;
            this.endPos = layer.endPos;
            this.customStartPos = layer.customStartPos;
        }
    }

    /** 添加层（最多 10 层）。返回是否成功，toast 由调用方负责 */
    addLayer() {
        if (this.layerCount >= 10) return false;
        const newLayer = createNewLayer(this.width, this.height);
        this.layers.push(newLayer);
        this.layerCount++;
        return true;
    }

    /**
     * 删除顶层（对应 removeLayer 纯数据部分）。
     * @returns {object} {ok, message?, switched?} - switched=true 表示视图层被强制切换
     */
    removeLayer() {
        if (this.layerCount <= 1) return { ok: false, message: '初始的1层不可删除！' };
        this.saveCurrentLayer();
        this.layers.pop();
        this.layerCount--;
        const removedLayerIndex = this.layerCount;
        cleanupStairsOnLayerRemove(this.layers, removedLayerIndex);
        // 清理指向被删除层的楼梯
        this.stairs = this.stairs.filter(s => s.layer < this.layerCount);
        // 清理指向被删除层的成对楼梯
        this.stairs = this.stairs.filter(s => {
            const targetLayer = s.direction === 'up' ? s.layer + 1 : s.layer - 1;
            return targetLayer >= 0 && targetLayer < this.layerCount;
        });
        let switched = false;
        if (this.currentLayer >= this.layerCount) {
            this.currentLayer = this.layerCount - 1;
            this.switchLayer(this.currentLayer);
            switched = true;
        }
        return { ok: true, switched };
    }

    /** 切换单层/多层（对应 _applyLayerMode 纯数据部分；层级转换不丢失第一层内容） */
    applyLayerMode(isMultiLayer) {
        this.multiLayerMode = isMultiLayer;
        if (isMultiLayer) {
            this.layerCount = 1;
            this.currentLayer = 0;
            this.playerLayer = 0;
            this.stairs = [];
            this.layers = [{
                hWalls: this.hWalls, vWalls: this.vWalls, activeCells: this.activeCells,
                ghosts: this.ghosts, items: this.items, buttons: this.buttons,
                stairs: [], endPos: this.endPos, customStartPos: this.customStartPos
            }];
        } else {
            if (this.layers.length > 0) {
                const firstLayer = this.layers[0];
                this.hWalls = firstLayer.hWalls;
                this.vWalls = firstLayer.vWalls;
                this.activeCells = firstLayer.activeCells;
                this.ghosts = firstLayer.ghosts;
                this.items = firstLayer.items;
                this.buttons = firstLayer.buttons;
                this.endPos = firstLayer.endPos;
                this.customStartPos = firstLayer.customStartPos;
            }
            this.layerCount = 1;
            this.currentLayer = 0;
            this.playerLayer = 0;
            this.stairs = [];
            this.layers = [];
        }
    }

    /** 是否有起点（对应 updateLayerPanel 编辑器分支的判定；regular 恒有） */
    hasStartPoint() {
        if (this.mode === 'regular') return true;
        if (this.multiLayerMode) {
            for (let i = 0; i < this.layerCount; i++) {
                if (this.layers[i] && this.layers[i].customStartPos) return true;
            }
            return !!this.customStartPos;
        }
        return !!this.customStartPos;
    }

    // ---------- 编辑操作 ----------

    /** 切换墙类型（原地改 type，保留 keys/direction；按钮只依附 SOLID，被替换时清除） */
    toggleWall(wall, targetType = WALL_TYPES.SOLID) {
        const { x, y, type } = wall;
        if (type === 'h' && y >= 0 && y <= this.height && x >= 0 && x < this.width) {
            const currentWallObj = this.hWalls[y][x];
            const newType = currentWallObj.type === targetType ? WALL_TYPES.EMPTY : targetType;
            if (newType === WALL_TYPES.EMPTY || (currentWallObj.type === WALL_TYPES.SOLID && newType !== WALL_TYPES.SOLID)) {
                this.eraseButtonsOnWall(wall);
            }
            this.hWalls[y][x].type = newType;
        } else if (type === 'v' && x >= 0 && x <= this.width && y >= 0 && y < this.height) {
            const currentWallObj = this.vWalls[y][x];
            const newType = currentWallObj.type === targetType ? WALL_TYPES.EMPTY : targetType;
            if (newType === WALL_TYPES.EMPTY || (currentWallObj.type === WALL_TYPES.SOLID && newType !== WALL_TYPES.SOLID)) {
                this.eraseButtonsOnWall(wall);
            }
            this.vWalls[y][x].type = newType;
        }
    }

    /** 定位墙引用（hWalls/vWalls 中对应坐标的实际墙对象） */
    _wallRef(wall) {
        return wall.type === 'h' ? this.hWalls[wall.y][wall.x] : this.vWalls[wall.y][wall.x];
    }

    /** 单元格是否可放置实体（边界 + 激活格） */
    _cellEditable(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height && !!this.activeCells[y] && !!this.activeCells[y][x];
    }

    /** 实体放置是否允许（regular 模式起始房间内禁止；free 恒允许） */
    _entityAllowed(x, y) {
        if (this.mode === 'free') return true;
        return !this.isPosInStartRoom(x, y);
    }

    /**
     * 拖拽画墙（替换语义，非 toggle）：WALL/GLASS 工具拖拽时直接替换为指定类型。
     * 对应 inputHandler.handleCanvasMouseMove 拖拽分支的 `= { type }` 直接赋值（不翻转、不清按钮）。
     */
    setWall(wall, type) {
        if (wall.type === 'h' && wall.y >= 0 && wall.y <= this.height && wall.x >= 0 && wall.x < this.width) {
            this.hWalls[wall.y][wall.x] = { type };
        } else if (wall.type === 'v' && wall.x >= 0 && wall.x <= this.width && wall.y >= 0 && wall.y < this.height) {
            this.vWalls[wall.y][wall.x] = { type };
        }
    }

    /** 放置/取消门（DOOR 工具点击：SOLID 墙先清依附按钮，DOOR↔EMPTY 切换） */
    toggleDoor(wall) {
        const wallRef = this._wallRef(wall);
        if (wallRef.type === WALL_TYPES.SOLID) this.eraseButtonsOnWall(wall);
        wallRef.type = wallRef.type === WALL_TYPES.DOOR ? WALL_TYPES.EMPTY : WALL_TYPES.DOOR;
    }

    /** 放置数字门（LOCK 工具点击；keys 由调用方 prompt+校验后传入；SOLID 墙先清按钮） */
    setLocked(wall, keys) {
        const wallRef = this._wallRef(wall);
        if (wallRef.type === WALL_TYPES.SOLID) this.eraseButtonsOnWall(wall);
        const newWall = { type: WALL_TYPES.LOCKED, keys };
        if (wall.type === 'h') this.hWalls[wall.y][wall.x] = newWall; else this.vWalls[wall.y][wall.x] = newWall;
    }

    /**
     * 放置/翻转字母门（LETTER_DOOR 工具点击）。
     * 已是字母门 → 翻转 initialState；否则用 letter（调用方 prompt+校验后传入）建新门并清 SOLID 按钮。
     */
    toggleLetterDoor(wall, letter) {
        const wallRef = this._wallRef(wall);
        if (wallRef.type === WALL_TYPES.LETTER_DOOR) {
            wallRef.initialState = wallRef.initialState === 'open' ? 'closed' : 'open';
        } else {
            if (wallRef.type === WALL_TYPES.SOLID) this.eraseButtonsOnWall(wall);
            const newWall = { type: WALL_TYPES.LETTER_DOOR, letter: letter.toUpperCase(), initialState: 'closed' };
            if (wall.type === 'h') this.hWalls[wall.y][wall.x] = newWall; else this.vWalls[wall.y][wall.x] = newWall;
        }
    }

    /**
     * 放置/改向单向门（ONE_WAY 工具：点击放置，拖拽改方向）。
     * 已是单向门且方向不同 → 仅改方向；否则（SOLID 先清按钮）替换为新单向门。
     * 同时覆盖 inputHandler mouseDown 放置与 mouseMove 拖拽改向两种语义。
     */
    setOneWay(wall, direction) {
        const wallRef = this._wallRef(wall);
        if (wallRef.type === WALL_TYPES.SOLID) this.eraseButtonsOnWall(wall);
        if (wallRef.type === WALL_TYPES.ONE_WAY) {
            if (direction && (wallRef.direction.dx !== direction.dx || wallRef.direction.dy !== direction.dy)) {
                wallRef.direction = direction;
            }
        } else {
            const newWall = { type: WALL_TYPES.ONE_WAY, direction };
            if (wall.type === 'h') this.hWalls[wall.y][wall.x] = newWall; else this.vWalls[wall.y][wall.x] = newWall;
        }
    }

    /** 设置终点（END 工具；占用格仅当就是当前终点时允许重设）。返回是否设置成功 */
    setEnd(x, y) {
        if (!this._cellEditable(x, y) || !this._entityAllowed(x, y)) return false;
        if (!this.isCellOccupied(x, y) || (this.endPos && this.endPos.x === x && this.endPos.y === y)) {
            this.endPos = { x, y };
            return true;
        }
        return false;
    }

    /**
     * 设置起点（START 工具；仅 free 模式）。
     * 多层时先保存当前层并清空所有层 customStartPos；随后置当前层起点并更新 playerLayer。
     * 返回是否成功（占用格仅当就是当前起点时允许重设）。UI 刷新由调用方负责。
     */
    setStart(x, y) {
        if (this.mode !== 'free' || !this._cellEditable(x, y) || !this._entityAllowed(x, y)) return false;
        if (this.isCellOccupied(x, y) && !(this.customStartPos && this.customStartPos.x === x && this.customStartPos.y === y)) return false;
        if (this.multiLayerMode) {
            this.saveCurrentLayer();
            for (let i = 0; i < this.layerCount; i++) { if (this.layers[i]) { this.layers[i].customStartPos = null; } }
        }
        this.customStartPos = { x, y };
        this.playerLayer = this.currentLayer;
        return true;
    }

    /** 放置/移除鬼（GHOST 工具；有则删，无则未占用时放置） */
    toggleGhost(x, y) {
        if (!this._cellEditable(x, y) || !this._entityAllowed(x, y)) return false;
        const idx = this.ghosts.findIndex(g => g.x === x && g.y === y);
        if (idx > -1) { this.ghosts.splice(idx, 1); return true; }
        if (this.isCellOccupied(x, y)) return false;
        this.ghosts.push({ x, y });
        return true;
    }

    /** 放置/移除钥匙（KEY 工具；有 key 则删，无则未占用时放置） */
    toggleKey(x, y) {
        if (!this._cellEditable(x, y) || !this._entityAllowed(x, y)) return false;
        const idx = this.items.findIndex(i => i.x === x && i.y === y);
        if (idx > -1 && this.items[idx].type === 'key') { this.items.splice(idx, 1); return true; }
        if (this.isCellOccupied(x, y)) return false;
        this.items.push({ x, y, type: 'key' });
        return true;
    }

    /**
     * 放置/移除按钮（BUTTON 工具；同格同方向已存在则删，否则以 letter 新建）。
     * @param {object} hotspot - 按钮热点 {x, y, direction}（来自 Pathfinding.getButtonHotspotAtPos）
     */
    toggleButton(hotspot, letter) {
        if (!hotspot || !this._cellEditable(hotspot.x, hotspot.y)) return false;
        const idx = this.buttons.findIndex(b =>
            b.x === hotspot.x && b.y === hotspot.y &&
            b.direction.dx === hotspot.direction.dx && b.direction.dy === hotspot.direction.dy);
        if (idx > -1) { this.buttons.splice(idx, 1); return true; }
        this.buttons.push({ ...hotspot, letter: letter.toUpperCase() });
        return true;
    }

    /** 切换格激活状态（对应 toggleActiveCell 纯数据部分；去激活时清实体+清四周墙） */
    toggleActiveCell(x, y, action) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
        const newState = (action === 'add');
        if (this.activeCells[y][x] === newState) return;
        this.activeCells[y][x] = newState;
        if (!newState) {
            if (this.customStartPos && this.customStartPos.x === x && this.customStartPos.y === y) this.customStartPos = null;
            if (this.endPos && this.endPos.x === x && this.endPos.y === y) this.endPos = null;
            this.ghosts = this.ghosts.filter(g => g.x !== x || g.y !== y);
            this.items = this.items.filter(i => i.x !== x || i.y !== y);
            this.buttons = this.buttons.filter(b => b.x !== x || b.y !== y);
            this.eraseStairAt(x, y, this.currentLayer);
            this.hWalls[y][x] = { type: WALL_TYPES.EMPTY };
            this.hWalls[y + 1][x] = { type: WALL_TYPES.EMPTY };
            this.vWalls[y][x] = { type: WALL_TYPES.EMPTY };
            this.vWalls[y][x + 1] = { type: WALL_TYPES.EMPTY };
        }
    }

    /**
     * 擦除指定画布坐标处的墙与实体（对应 eraseAtPos 纯数据部分）。
     * @param {object} pos - 画布坐标 {x, y}（未含 padding 偏移，调用方负责换算）
     * @param {number} cellSize - 单元格像素尺寸
     */
    eraseAt(pos, cellSize) {
        // 墙判定恒为橡皮擦语义（原实现当前工具在可达路径下恒为 ERASER）
        const wall = Editor.getWallAtPos(pos.x, pos.y, cellSize, this.width, this.height, EDITOR_TOOLS.ERASER);
        if (wall && this.isWallEditable(wall)) {
            this.eraseButtonsOnWall(wall);
            if (wall.type === 'h') this.hWalls[wall.y][wall.x] = { type: WALL_TYPES.EMPTY, keys: 0 };
            else this.vWalls[wall.y][wall.x] = { type: WALL_TYPES.EMPTY, keys: 0 };
        }
        const cellX = Math.floor(pos.x / cellSize);
        const cellY = Math.floor(pos.y / cellSize);
        if (this.mode === 'free' || !this.isPosInStartRoom(cellX, cellY)) {
            if (this.endPos && this.endPos.x === cellX && this.endPos.y === cellY) { this.endPos = null; }
            if (this.customStartPos && this.customStartPos.x === cellX && this.customStartPos.y === cellY) { this.customStartPos = null; }
            this.ghosts = this.ghosts.filter(g => g.x !== cellX || g.y !== cellY);
            this.items = this.items.filter(i => i.x !== cellX || i.y !== cellY);
            this.buttons = this.buttons.filter(b => b.x !== cellX || b.y !== cellY);
            this.eraseStairAt(cellX, cellY, this.currentLayer);
        }
    }

    /** 清除依附在指定墙上的按钮（按钮必须依附在墙上） */
    eraseButtonsOnWall(wall) {
        if (wall.type === 'h') {
            // 横墙：上方格子的按钮方向 dy=1，下方格子的按钮方向 dy=-1
            this.buttons = this.buttons.filter(b => {
                if (b.x === wall.x && b.y === wall.y - 1 && b.direction.dy === 1) return false;
                if (b.x === wall.x && b.y === wall.y && b.direction.dy === -1) return false;
                return true;
            });
        } else {
            // 竖墙：左方格子的按钮方向 dx=1，右方格子的按钮方向 dx=-1
            this.buttons = this.buttons.filter(b => {
                if (b.x === wall.x - 1 && b.y === wall.y && b.direction.dx === 1) return false;
                if (b.x === wall.x && b.y === wall.y && b.direction.dx === -1) return false;
                return true;
            });
        }
    }

    /** 擦除指定格的楼梯及其配对楼梯 */
    eraseStairAt(x, y, layer) {
        const stair = this.stairs.find(s => s.x === x && s.y === y && s.layer === layer);
        if (!stair) return;
        const pairedLayer = stair.direction === 'up' ? layer + 1 : layer - 1;
        const pairedDirection = stair.direction === 'up' ? 'down' : 'up';
        this.stairs = this.stairs.filter(s => !(s.x === x && s.y === y && (s.layer === layer || (s.layer === pairedLayer && s.direction === pairedDirection))));
    }

    /** 放置楼梯（自动成对放置到目标层）。无效时返回 false */
    placeStair(x, y, direction) {
        if (!this.isValidStairPlacement(x, y, direction)) return false;
        const targetLayer = direction === 'up' ? this.currentLayer + 1 : this.currentLayer - 1;
        const pairedDirection = direction === 'up' ? 'down' : 'up';
        this.stairs.push({ x, y, direction, layer: this.currentLayer });
        this.stairs.push({ x, y, direction: pairedDirection, layer: targetLayer });
        return true;
    }

    /** 清空全部墙为 EMPTY（对应主类 clearEntitiesOnly 的墙清空部分；激活格/实体不动） */
    clearWalls() {
        const empty = () => ({ type: WALL_TYPES.EMPTY, keys: 0 });
        this.hWalls = Array(this.height + 1).fill(null).map(() => Array(this.width).fill(null).map(empty));
        this.vWalls = Array(this.height).fill(null).map(() => Array(this.width + 1).fill(null).map(empty));
    }

    /** 清空实体（保留墙与激活格；楼梯含配对清理，对应 clearEntitiesOnly 纯数据部分） */
    clearEntities() {
        this.endPos = null;
        this.customStartPos = null;
        this.ghosts = [];
        this.items = [];
        this.buttons = [];
        const currentLayerStairs = this.stairs.filter(s => s.layer === this.currentLayer);
        currentLayerStairs.forEach(stair => {
            const pairedLayer = stair.direction === 'up' ? stair.layer + 1 : stair.layer - 1;
            const pairedDirection = stair.direction === 'up' ? 'down' : 'up';
            this.stairs = this.stairs.filter(s =>
                !(s.x === stair.x && s.y === stair.y && s.layer === pairedLayer && s.direction === pairedDirection)
            );
        });
        this.stairs = this.stairs.filter(s => s.layer !== this.currentLayer);
    }

    /** 全部格去激活并清空实体 */
    clearAllGrids() {
        this.activeCells = Array(this.height).fill(null).map(() => Array(this.width).fill(false));
        this.clearEntities();
    }

    /** 全部格激活并清空实体 */
    resetGrids() {
        this.activeCells = Array(this.height).fill(null).map(() => Array(this.width).fill(true));
        this.clearEntities();
    }

    // ---------- 校验 ----------

    /** 游玩前校验（自由模式：必须设置起点 + 至少一个活动格） */
    validate() {
        return Editor.validateMapForPlay(this.toMapData(), this.mode);
    }

    // ---------- 查询 ----------

    isPosInStartRoom(x, y) {
        if (this.mode === 'regular') return Editor.isPosInStartRoom(x, y, this.height);
        return false;
    }

    isWallEditable(wall) {
        return Editor.isWallEditable(wall, this.mode, this.width, this.height, this.activeCells);
    }

    isCellOccupied(x, y) {
        return Editor.isCellOccupied(x, y, {
            ghosts: this.ghosts,
            items: this.items,
            buttons: this.buttons,
            endPos: this.endPos,
            customStartPos: this.customStartPos,
            stairs: this.stairs,
            currentLayer: this.currentLayer
        });
    }

    isValidStairPlacement(x, y, direction) {
        return Editor.isValidStairPlacement(x, y, direction, {
            activeCells: this.activeCells,
            stairs: this.stairs,
            currentLayer: this.currentLayer,
            layerCount: this.layerCount,
            layers: this.layers,
            isCellOccupied: (cx, cy) => this.isCellOccupied(cx, cy)
        });
    }
}
