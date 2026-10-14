import { WALL_TYPES, MAP_SIZE_MIN, MAP_SIZE_MAX } from './constants.js';
import { isValidButtonAttachment } from './pathfinding.js';

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
export function isInteriorWall(wall, width, height, activeCells = null) {
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
export function normalizeVoidWalls(mapData) {
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
export function validateButtonAttachments(mapData) {
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
export const DIRECTIONS = Object.freeze([{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }]);
export const directionIndex = direction => DIRECTIONS.findIndex(d => d.dx === direction?.dx && d.dy === direction?.dy);

/** 地图对象的唯一装配入口；各层数据只保留一份，已有 JSON 作品也由此接入。 */
export function normalizeMapData(source) {
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
export function validateMapData(source, { requireEnd = true } = {}) {
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
