import { WALL_TYPES, getStartRoomY } from './constants.js';

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
export function isValidButtonAttachment(button, config = {}) {
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
export function calculateDistances(startNode, width, height, hWalls, vWalls) {
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
 * 查找玩家从起点到终点的路径（考虑可见性、墙壁与活动格）
 * @param {object} start - 起点 {x, y}
 * @param {object} end - 终点 {x, y}
 * @param {object} config - 配置对象
 * @returns {Array|null} 路径数组或null
 */
export function findPlayerPath(start, end, config) {
    const { width, height, hWalls, vWalls, seenCells, debugVision, playerKeys, activeCells } = config;
    
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
                // 虚空不是通道：全图视野下也不能穿过非活动格，否则点击自动移动会绕出地图。
                if (activeCells && !activeCells[ny]?.[nx]) continue;
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
export function getButtonHotspotAtPos(mouseX, mouseY, config) {
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
