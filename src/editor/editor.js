import { isInteriorWall } from '../core/mapDataUtils.js';
import { WALL_TYPES, EDITOR_TOOLS, START_ROOM_SIZE, getStartRoomY } from '../core/constants.js';

/**
 * Editor 模块 - 处理地图编辑器相关功能
 */

/**
 * 创建空墙数据
 * @param {string} type - 'h' 或 'v'
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @returns {Array}
 */
export function createEmptyWalls(type, width, height) {
    const empty = () => ({ type: WALL_TYPES.EMPTY, keys: 0 });
    if (type === 'h') {
        return Array.from({ length: height + 1 }, (_, y) =>
            Array.from({ length: width }, () => (y === 0 || y === height) ? { type: WALL_TYPES.SOLID } : empty())
        );
    } else {
        return Array.from({ length: height }, () =>
            Array.from({ length: width + 1 }, (_, x) => (x === 0 || x === width) ? { type: WALL_TYPES.SOLID } : empty())
        );
    }
}

/**
 * 检查位置是否在起始房间内
 * @param {number} cellX - 单元格X
 * @param {number} cellY - 单元格Y  
 * @param {number} height - 地图高度
 * @returns {boolean}
 */
export function isPosInStartRoom(cellX, cellY, height) {
    const roomY = getStartRoomY(height);
    return cellX >= 0 && cellX < 3 && cellY >= roomY && cellY < roomY + 3;
}

/**
 * 检查墙是否可编辑
 * @param {object} wall - 墙对象 {x, y, type: 'h'|'v'}
 * @param {string} editorMode - 编辑模式
 * @param {number} width - 地图宽度
 * @param {number} height - 地图高度
 * @returns {boolean}
 */
export function isWallEditable(wall, editorMode, width, height, activeCells = null) {
    if (!isInteriorWall(wall, width, height, activeCells)) return false;
    const { x, y, type } = wall;
    const roomY = getStartRoomY(height);
    
    if (editorMode === 'free') {
        // 在自由模式下，需要检查相邻单元格是否激活
        if (activeCells) {
            const up = (type === 'h' && y > 0) ? activeCells[y - 1][x] : false;
            const down = (type === 'h' && y < height) ? activeCells[y][x] : false;
            const left = (type === 'v' && x > 0) ? activeCells[y][x - 1] : false;
            const right = (type === 'v' && x < width) ? activeCells[y][x] : false;
            if (type === 'h') return up && down;
            if (type === 'v') return left && right;
            return false;
        }
        return true;
    }
    
    // 常规模式下的边界检查
    if (type === 'h') {
        if (y === 0 || y === height) return false;
        if (x >= 0 && x < 3 && y === roomY) return false;
        if (x >= 0 && x < 3 && y >= roomY && y < roomY + 3) return false;
    } else {
        if (x === 0 || x === width) return false;
        if (y >= roomY && y < roomY + 3 && x === 3) return false;
        if (x >= 0 && x < 3 && y >= roomY && y < roomY + 3) return false;
    }
    return true;
}

/**
 * 检查单元格是否被占用
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {object} entities - 实体对象 {ghosts, items, buttons, endPos, customStartPos, stairs, currentLayer}
 * @returns {boolean}
 */
export function isCellOccupied(x, y, entities) {
    const { ghosts, items, endPos, customStartPos, stairs, currentLayer } = entities;
    // 注意：按钮(buttons)不再阻止其它元件放置（按钮可以与鬼、钥匙等共存）
    
    if (ghosts && ghosts.some(g => g.x === x && g.y === y)) return true;
    if (items && items.some(i => i.x === x && i.y === y)) return true;
    if (endPos && endPos.x === x && endPos.y === y) return true;
    if (customStartPos && customStartPos.x === x && customStartPos.y === y) return true;
    if (stairs && stairs.some(s => s.x === x && s.y === y && s.layer === currentLayer)) return true;
    
    return false;
}

/**
 * 检查楼梯放置是否有效（完整版：当前层/目标层双向校验）
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {string} direction - 方向 ('up' | 'down')
 * @param {object} config - 配置 {activeCells, stairs, currentLayer, layerCount, layers, isCellOccupied}
 * @returns {boolean}
 */
export function isValidStairPlacement(x, y, direction, config) {
    const { activeCells, stairs, currentLayer, layerCount, layers = [], isCellOccupied } = config;

    // 当前层该格必须活动且无楼梯
    if (!activeCells[y] || !activeCells[y][x]) return false;
    if (stairs.some(s => s.x === x && s.y === y && s.layer === currentLayer)) return false;

    // 楼层边界
    const targetLayer = direction === 'up' ? currentLayer + 1 : currentLayer - 1;
    if (targetLayer < 0 || targetLayer >= layerCount) return false;

    // 目标层该格必须活动
    const targetData = layers[targetLayer];
    if (targetData && targetData.activeCells && !targetData.activeCells[y][x]) return false;

    // 当前层该位置已有元素（起点、鬼、钥匙、终点、楼梯等）
    if (isCellOccupied && isCellOccupied(x, y)) return false;

    // 目标层该位置的元素检查
    if (targetData) {
        if (targetData.customStartPos && targetData.customStartPos.x === x && targetData.customStartPos.y === y) return false;
        if (targetData.endPos && targetData.endPos.x === x && targetData.endPos.y === y) return false;
        if (targetData.ghosts && targetData.ghosts.some(g => g.x === x && g.y === y)) return false;
        if (targetData.items && targetData.items.some(i => i.x === x && i.y === y)) return false;
        // 目标层该位置已有非配对的楼梯
        const pairedDirection = direction === 'up' ? 'down' : 'up';
        if (stairs.some(s => s.x === x && s.y === y && s.layer === targetLayer && s.direction !== pairedDirection)) return false;
    }

    return true;
}

/**
 * 布置起始房间（左下角 3×3）：内部墙体清空，设置右侧 + 上方两个出口 DOOR
 * @param {Array} hWalls - 横墙数组（维度需已创建）
 * @param {Array} vWalls - 竖墙数组
 * @param {number} roomY - 起始房间顶行（getStartRoomY(height)）
 */
export function createStartRoomLayout(hWalls, vWalls, roomY) {
    const empty = () => ({ type: WALL_TYPES.EMPTY, keys: 0 });
    const door = () => ({ type: WALL_TYPES.DOOR, keys: 0 });

    // 房间内部墙体清空
    for (let y = roomY; y < roomY + START_ROOM_SIZE; y++) {
        for (let x = 0; x < START_ROOM_SIZE; x++) {
            if (x < START_ROOM_SIZE - 1) vWalls[y][x + 1] = empty();
            if (y < roomY + START_ROOM_SIZE - 1) hWalls[y + 1][x] = empty();
        }
    }
    // 出口门：右侧 vWalls[roomY+1][3]，上方 hWalls[roomY][1]
    vWalls[roomY + 1][START_ROOM_SIZE] = door();
    hWalls[roomY][1] = door();
}

/**
 * 获取墙位置
 * @param {number} mouseX - 鼠标X
 * @param {number} mouseY - 鼠标Y
 * @param {number} cellSize - 单元格大小
 * @param {number} width - 地图宽度
 * @param {number} height - 地图高度
 * @param {string} currentTool - 当前工具
 * @param {number} [threshold] - 命中宽度（默认 0.3 格；橡皮擦按绘制粗细传更小的值）
 * @returns {object|null} 墙对象
 */
export function getWallAtPos(mouseX, mouseY, cellSize, width, height, currentTool, threshold = cellSize * 0.3) {
    const cellX = Math.floor(mouseX / cellSize);
    const cellY = Math.floor(mouseY / cellSize);
    const cellOffsetX = mouseX - cellX * cellSize;
    const cellOffsetY = mouseY - cellY * cellSize;
    
    if (currentTool === EDITOR_TOOLS.GRID) {
        if (cellX >= 0 && cellX < width && cellY >= 0 && cellY < height) {
            return { x: cellX, y: cellY, type: 'cell' };
        }
        return null;
    }
    
    let bestWall = null;
    let bestDist = threshold;
    
    // 检查上边界
    if (cellY >= 0 && cellY <= height && cellX >= 0 && cellX < width && cellOffsetY < threshold) {
        if (cellOffsetY < bestDist) {
            bestDist = cellOffsetY;
            bestWall = { x: cellX, y: cellY, type: 'h' };
        }
    }
    
    // 检查左边界
    if (cellX >= 0 && cellX <= width && cellY >= 0 && cellY < height && cellOffsetX < threshold) {
        if (cellOffsetX < bestDist) {
            bestDist = cellOffsetX;
            bestWall = { x: cellX, y: cellY, type: 'v' };
        }
    }
    
    // 检查下边界
    if (cellY + 1 >= 0 && cellY + 1 <= height && cellX >= 0 && cellX < width && cellSize - cellOffsetY < threshold) {
        if (cellSize - cellOffsetY < bestDist) {
            bestDist = cellSize - cellOffsetY;
            bestWall = { x: cellX, y: cellY + 1, type: 'h' };
        }
    }
    
    // 检查右边界
    if (cellX + 1 >= 0 && cellX + 1 <= width && cellY >= 0 && cellY < height && cellSize - cellOffsetX < threshold) {
        if (cellSize - cellOffsetX < bestDist) {
            bestWall = { x: cellX + 1, y: cellY, type: 'v' };
        }
    }
    
    return bestWall;
}

