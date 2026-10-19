import { WALL_TYPES, GAME_STATES, EDITOR_TOOLS, START_ROOM_SIZE, getStartRoomY } from '../core/constants.js';
import { SHAPE, strokeWidth } from './shapes.js';

/**
 * Renderer 模块 - 处理所有Canvas绘制相关的功能
 *
 * 原子绘制函数（drawWallOrDoor/drawItem/drawStair/drawButton/drawCircle…）与
 * 组合渲染函数（drawGame/drawEditor/renderStaticLayer/drawCorners）。
 * 组合渲染函数只读 view 对象（见 view/viewSlice.js），不依赖宿主实例。
 */

/**
 * 绘制墙或门
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x1 - 起点x
 * @param {number} y1 - 起点y
 * @param {number} x2 - 终点x
 * @param {number} y2 - 终点y
 * @param {object} wallObject - 墙对象
 * @param {number} cellSize - 单元格大小
 * @param {object} colors - 颜色配置
 * @param {string} gameState - 游戏状态
 * @param {boolean} isHighlight - 是否高亮
 */
export function drawWallOrDoor(ctx, x1, y1, x2, y2, wallObject, cellSize, colors, gameState, isHighlight = false) {
    const type = wallObject.type;
    
    ctx.strokeStyle = isHighlight ? colors.hoverHighlight : colors.wall;
    ctx.lineWidth = strokeWidth([WALL_TYPES.LOCKED, WALL_TYPES.ONE_WAY].includes(type) ? 'thinWall' : 'wall', cellSize, isHighlight);
    
    if (type === WALL_TYPES.SOLID) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
    } else if (type === WALL_TYPES.GLASS) {
        const isHorizontal = y1 === y2;
        const lineLength = cellSize * 0.2;
        const offset = lineLength / 2;
        const points = [
            { x: x1 * 5 / 6 + x2 * 1 / 6, y: y1 * 5 / 6 + y2 * 1 / 6 },
            { x: (x1 + x2) / 2, y: (y1 + y2) / 2 },
            { x: x1 * 1 / 6 + x2 * 5 / 6, y: y1 * 1 / 6 + y2 * 5 / 6 }
        ];
        for (const p of points) {
            if (isHorizontal) {
                ctx.moveTo(p.x - offset, p.y + offset);
                ctx.lineTo(p.x + offset, p.y - offset);
            } else {
                ctx.moveTo(p.x - offset, p.y + offset);
                ctx.lineTo(p.x + offset, p.y - offset);
            }
        }
    } else if (type === WALL_TYPES.LOCKED || type === WALL_TYPES.ONE_WAY || type === WALL_TYPES.LETTER_DOOR) {
        let isLetterDoorOpen = (type === WALL_TYPES.LETTER_DOOR) && 
            (gameState === GAME_STATES.EDITOR ? wallObject.initialState === 'open' : wallObject.currentState === 'open');
        if (isLetterDoorOpen) return;
        
        const isHorizontal = y1 === y2;
        const lockWidth = cellSize * 0.2;
        if (isHorizontal) {
            ctx.rect(x1, y1 - lockWidth / 2, cellSize, lockWidth);
        } else {
            ctx.rect(x1 - lockWidth / 2, y1, lockWidth, cellSize);
        }
    } else if (type === WALL_TYPES.DOOR) {
        const isHorizontal = y1 === y2;
        const length = isHorizontal ? x2 - x1 : y2 - y1;
        const gap = length / 3;
        if (isHorizontal) {
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1 + gap, y1);
            ctx.moveTo(x2 - gap, y2);
            ctx.lineTo(x2, y2);
        } else {
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1, y1 + gap);
            ctx.moveTo(x2, y2 - gap);
            ctx.lineTo(x2, y2);
        }
    }
}

/**
 * 绘制箭头（用于单向门）
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x1 - 起点x
 * @param {number} y1 - 起点y
 * @param {number} x2 - 终点x
 * @param {number} y2 - 终点y
 * @param {object} direction - 方向
 * @param {string} color - 颜色
 * @param {boolean} withStroke - 是否描边
 * @param {number} cellSize - 单元格大小
 */
export function drawArrow(ctx, x1, y1, x2, y2, direction, color, withStroke, cellSize) {
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    const fontSize = cellSize * 0.6;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    
    if (direction.dx === 1) ctx.rotate(0);
    else if (direction.dx === -1) ctx.rotate(Math.PI);
    else if (direction.dy === 1) ctx.rotate(Math.PI / 2);
    else if (direction.dy === -1) ctx.rotate(-Math.PI / 2);
    
    ctx.scale(0.8, 1.0);
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (withStroke) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText('>', 0, 0);
    }
    ctx.fillStyle = color;
    ctx.fillText('>', 0, 0);
    
    ctx.restore();
}

/**
 * 绘制墙体覆盖层（数字、字母等）
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {object} config - 配置对象
 */
export function drawWallOverlays(ctx, config) {
    const { hWalls, vWalls, width, height, cellSize, seenCells, 
            debugVision, colors, inGame, activeCells, drawArrowFn } = config;
    
    const drawTextOnWall = (x1, y1, x2, y2, text, color) => {
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;
        const fontSize = cellSize * 0.4;
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText(text.toString(), centerX, centerY);
        ctx.fillStyle = color;
        ctx.fillText(text.toString(), centerX, centerY);
    };
    
    // 横墙
    for (let y = 1; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const wall = hWalls[y][x];
            if (!wall || wall.type === WALL_TYPES.EMPTY) continue;
            if (activeCells && !(activeCells[y][x] && activeCells[y - 1][x])) continue;
            
            const isVisible = !inGame || debugVision || 
                (seenCells[y - 1] && seenCells[y - 1][x]) || (seenCells[y] && seenCells[y][x]);
            if (!isVisible) continue;
            
            if (wall.type === WALL_TYPES.LOCKED) {
                drawTextOnWall(x * cellSize, y * cellSize, (x + 1) * cellSize, y * cellSize, wall.keys, colors.key);
            } else if (wall.type === WALL_TYPES.LETTER_DOOR) {
                drawTextOnWall(x * cellSize, y * cellSize, (x + 1) * cellSize, y * cellSize, wall.letter, colors.key);
            } else if (wall.type === WALL_TYPES.ONE_WAY && wall.direction) {
                if (drawArrowFn) {
                    drawArrowFn(x * cellSize, y * cellSize, (x + 1) * cellSize, y * cellSize, wall.direction, colors.key, true);
                } else {
                    drawArrow(ctx, x * cellSize, y * cellSize, (x + 1) * cellSize, y * cellSize, wall.direction, colors.key, true, cellSize);
                }
            }
        }
    }
    
    // 竖墙
    for (let y = 0; y < height; y++) {
        for (let x = 1; x < width; x++) {
            const wall = vWalls[y][x];
            if (!wall || wall.type === WALL_TYPES.EMPTY) continue;
            if (activeCells && !(activeCells[y][x] && activeCells[y][x - 1])) continue;
            
            const isVisible = !inGame || debugVision || 
                (seenCells[y] && seenCells[y][x - 1]) || (seenCells[y] && seenCells[y][x]);
            if (!isVisible) continue;
            
            if (wall.type === WALL_TYPES.LOCKED) {
                drawTextOnWall(x * cellSize, y * cellSize, x * cellSize, (y + 1) * cellSize, wall.keys, colors.key);
            } else if (wall.type === WALL_TYPES.LETTER_DOOR) {
                drawTextOnWall(x * cellSize, y * cellSize, x * cellSize, (y + 1) * cellSize, wall.letter, colors.key);
            } else if (wall.type === WALL_TYPES.ONE_WAY && wall.direction) {
                if (drawArrowFn) {
                    drawArrowFn(x * cellSize, y * cellSize, x * cellSize, (y + 1) * cellSize, wall.direction, colors.key, true);
                } else {
                    drawArrow(ctx, x * cellSize, y * cellSize, x * cellSize, (y + 1) * cellSize, wall.direction, colors.key, true, cellSize);
                }
            }
        }
    }
}

/**
 * 绘制圆形（玩家、鬼、终点等）
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - 网格x坐标
 * @param {number} y - 网格y坐标
 * @param {number} cellSize - 单元格大小
 * @param {string} color - 颜色
 * @param {number} alpha - 透明度
 */
export function drawCircle(ctx, x, y, cellSize, color, alpha = 1.0) {
    if (alpha <= 0) return;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, cellSize * SHAPE.circleRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1.0;
}

/**
 * 绘制物品（钥匙等）
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {object} item - 物品对象
 * @param {number} cellSize - 单元格大小
 * @param {object} colors - 颜色配置
 */
export function drawItem(ctx, item, cellSize, colors) {
    if (item.type === 'key') {
        const centerX = item.x * cellSize + cellSize / 2;
        const centerY = item.y * cellSize + cellSize / 2;
        const size = cellSize * SHAPE.keyRadius;
        ctx.fillStyle = colors.key;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - size);
        ctx.lineTo(centerX + size, centerY);
        ctx.lineTo(centerX, centerY + size);
        ctx.lineTo(centerX - size, centerY);
        ctx.closePath();
        ctx.fill();
    }
}

/**
 * 绘制楼梯
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {object} stair - 楼梯对象
 * @param {number} cellSize - 单元格大小
 * @param {object} colors - 颜色配置
 * @param {boolean} isHighlight - 是否高亮
 * @param {number} alpha - 透明度
 */
export function drawStair(ctx, stair, cellSize, colors, isHighlight = false, alpha = 1.0) {
    const x = stair.x * cellSize;
    const y = stair.y * cellSize;
    const size = cellSize * SHAPE.stairSize;
    const offset = (cellSize - size) / 2;
    
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = isHighlight ? colors.hoverHighlight : colors.wall;
    ctx.lineWidth = strokeWidth('stair', cellSize, isHighlight);
    ctx.lineJoin = 'miter'; // 确保直角不出现凹陷
    ctx.lineCap = 'square'; // 确保线条端点平整
    
    // 绘制楼梯图标：三个方框锯齿加上两条完整边的密闭楼梯状图形
    // 向上楼梯：左低右高，向下楼梯：左高右低
    const left = x + offset;
    const top = y + offset;
    const stepWidth = size / 3;
    const stepHeight = size / 3;
    
    ctx.beginPath();
    
    if (stair.direction === 'up') {
        // 向上楼梯：左低右高
        // 从左下角开始顺时针绘制
        ctx.moveTo(left, top + size);                    // 左下角
        ctx.lineTo(left, top + size - stepHeight);       // 左边第一台阶
        ctx.lineTo(left + stepWidth, top + size - stepHeight);  // 第一台阶水平线
        ctx.lineTo(left + stepWidth, top + size - 2 * stepHeight);  // 第二台阶垂直线
        ctx.lineTo(left + 2 * stepWidth, top + size - 2 * stepHeight);  // 第二台阶水平线
        ctx.lineTo(left + 2 * stepWidth, top);           // 第三台阶垂直线到顶部
        ctx.lineTo(left + size, top);                    // 顶边
        ctx.lineTo(left + size, top + size);             // 右边
        ctx.closePath();                                  // 回到左下角
    } else {
        // 向下楼梯：左高右低
        // 从左下角开始顺时针绘制
        ctx.moveTo(left, top + size);                    // 左下角
        ctx.lineTo(left, top);                           // 左边到顶部
        ctx.lineTo(left + stepWidth, top);               // 顶边第一段
        ctx.lineTo(left + stepWidth, top + stepHeight);  // 第一台阶向下
        ctx.lineTo(left + 2 * stepWidth, top + stepHeight);  // 第二台阶水平线
        ctx.lineTo(left + 2 * stepWidth, top + 2 * stepHeight);  // 第二台阶向下
        ctx.lineTo(left + size, top + 2 * stepHeight);   // 第三台阶水平线
        ctx.lineTo(left + size, top + size);             // 右边到底部
        ctx.closePath();                                  // 回到左下角
    }
    
    // 只描线，不填充内部颜色。
    ctx.stroke();

    ctx.restore();
}

/**
 * 绘制按钮
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {object} button - 按钮对象
 * @param {number} cellSize - 单元格大小
 * @param {object} colors - 颜色配置
 * @param {boolean} isHighlight - 是否高亮
 */
export function drawButton(ctx, button, cellSize, colors, isHighlight = false) {
    const centerX = button.x * cellSize + cellSize / 2;
    const centerY = button.y * cellSize + cellSize / 2;
    const buttonLength = cellSize * SHAPE.buttonLength;
    const buttonWidth = cellSize * SHAPE.buttonWidth;
    
    let p1, p2, p3, p4;
    
    if (button.direction.dy === -1) { // 上
        p1 = { x: centerX - buttonLength / 2, y: button.y * cellSize };
        p2 = { x: centerX + buttonLength / 2, y: button.y * cellSize };
        p3 = { x: centerX + buttonLength / 2, y: button.y * cellSize + buttonWidth };
        p4 = { x: centerX - buttonLength / 2, y: button.y * cellSize + buttonWidth };
    } else if (button.direction.dy === 1) { // 下
        p1 = { x: centerX - buttonLength / 2, y: (button.y + 1) * cellSize - buttonWidth };
        p2 = { x: centerX + buttonLength / 2, y: (button.y + 1) * cellSize - buttonWidth };
        p3 = { x: centerX + buttonLength / 2, y: (button.y + 1) * cellSize };
        p4 = { x: centerX - buttonLength / 2, y: (button.y + 1) * cellSize };
    } else if (button.direction.dx === -1) { // 左
        p1 = { x: button.x * cellSize, y: centerY - buttonLength / 2 };
        p2 = { x: button.x * cellSize + buttonWidth, y: centerY - buttonLength / 2 };
        p3 = { x: button.x * cellSize + buttonWidth, y: centerY + buttonLength / 2 };
        p4 = { x: button.x * cellSize, y: centerY + buttonLength / 2 };
    } else { // 右
        p1 = { x: (button.x + 1) * cellSize - buttonWidth, y: centerY - buttonLength / 2 };
        p2 = { x: (button.x + 1) * cellSize, y: centerY - buttonLength / 2 };
        p3 = { x: (button.x + 1) * cellSize, y: centerY + buttonLength / 2 };
        p4 = { x: (button.x + 1) * cellSize - buttonWidth, y: centerY + buttonLength / 2 };
    }
    
    ctx.strokeStyle = isHighlight ? colors.hoverHighlight : colors.wall;
    ctx.lineWidth = strokeWidth('button', cellSize, isHighlight);
    ctx.beginPath();
    // 只绘制三边（跳过与墙重合的一边）
    if (button.direction.dy === -1) { // 上：跳过p1->p2（顶边）
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p2.x, p2.y);
    } else if (button.direction.dy === 1) { // 下：跳过p3->p4（底边）
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p4.x, p4.y);
    } else if (button.direction.dx === -1) { // 左：跳过p1->p4（左边）
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
    } else { // 右：跳过p2->p3（右边）
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.lineTo(p3.x, p3.y);
    }
    ctx.stroke();
}

/**
 * 按钮上的字母：单独一层，必须画在放置预览高亮之上（长条本身在高亮之下）。
 * 与字母门使用同一字体大小 cellSize * 0.4。
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {object} button - 按钮对象
 * @param {number} cellSize - 单元格大小
 * @param {object} colors - 颜色配置
 */
export function drawButtonLetter(ctx, button, cellSize, colors) {
    if (!button.letter) return;
    const centerX = button.x * cellSize + cellSize / 2;
    const centerY = button.y * cellSize + cellSize / 2;
    const buttonWidth = cellSize * SHAPE.buttonWidth;
    const { dx, dy } = button.direction;
    const letterCenterX = dy !== 0 ? centerX : (dx === -1 ? button.x * cellSize + buttonWidth / 2 : (button.x + 1) * cellSize - buttonWidth / 2);
    const letterCenterY = dy === -1 ? button.y * cellSize + buttonWidth / 2 : dy === 1 ? (button.y + 1) * cellSize - buttonWidth / 2 : centerY;
    ctx.font = `bold ${cellSize * 0.4}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.strokeText(button.letter, letterCenterX, letterCenterY);
    ctx.fillStyle = colors.key;
    ctx.fillText(button.letter, letterCenterX, letterCenterY);
}

/**
 * 显示初始欢迎信息
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {object} config - 配置对象
 */
export function showInitialMessage(ctx, config) {
    const { canvasWidth, canvasHeight, padding, colors } = config;
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.strokeStyle = colors.border || '#d9d9d9';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(padding, padding, canvasWidth - 2 * padding, canvasHeight - 2 * padding);
    ctx.setLineDash([]);
    ctx.fillStyle = colors.text;
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('加载地图以开始', canvasWidth / 2, canvasHeight / 2);
}

/**
 * 检查边界是否应该绘制
 * @param {number} bx - 边界X坐标
 * @param {number} by - 边界Y坐标
 * @param {boolean} isH - 是否为水平边界
 * @param {Array} activeCells - 活动单元格数组
 * @param {number} width - 地图宽度
 * @param {number} height - 地图高度
 * @returns {boolean}
 */
export function shouldDrawBoundary(bx, by, isH, activeCells, width, height) {
    if (isH) {
        const up = (by > 0 && by <= height && activeCells[by-1]) ? activeCells[by-1][bx] : false;
        const down = (by >= 0 && by < height && activeCells[by]) ? activeCells[by][bx] : false;
        return up !== down;
    } else {
        const left = (bx > 0 && bx <= width && activeCells[by]) ? activeCells[by][bx-1] : false;
        const right = (bx >= 0 && bx < width && activeCells[by]) ? activeCells[by][bx] : false;
        return left !== right;
    }
}

// ==================== 组合渲染（吸收自 ghostMazeGame 活副本，Phase 3c） ====================

/**
 * 渲染静态层（地面格 + 网格线；编辑器模式画虚空虚线）
 * @param {HTMLCanvasElement} mainCanvas - 主画布（尺寸来源）
 * @param {HTMLCanvasElement} staticCanvas - 静态层画布
 * @param {object} view - 视图快照（computeGameView/computeEditorView 投影产物）
 */
export function renderStaticLayer(mainCanvas, staticCanvas, view) {
    staticCanvas.width = mainCanvas.width;
    staticCanvas.height = mainCanvas.height;
    const ctx = staticCanvas.getContext('2d');
    const cs = view.cellSize;
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    // 地面缓存与墙和元件使用同一个视口，避免包络居中时边缘被裁掉。
    ctx.save();
    ctx.translate(view.drawOffset?.x || 0, view.drawOffset?.y || 0);
    for (let y = 0; y < view.height; y++) {
        for (let x = 0; x < view.width; x++) {
            if (view.activeCells[y] && view.activeCells[y][x]) {
                ctx.fillStyle = view.colors.ground; ctx.fillRect(x * cs, y * cs, cs, cs);
                ctx.strokeStyle = view.colors.gridLine; ctx.lineWidth = 1; ctx.strokeRect(x * cs, y * cs, cs, cs);
            } else if (view.state === GAME_STATES.EDITOR) {
                ctx.fillStyle = "rgba(0,0,0,0)"; ctx.strokeStyle = view.colors.voidGrid;
                ctx.lineWidth = 0.5; ctx.setLineDash([2, 2]); ctx.strokeRect(x * cs, y * cs, cs, cs); ctx.setLineDash([]);
            }
        }
    }
    ctx.restore();
}

/**
 * 绘制墙线交点处的实心方块（实体墙/门/活性区边界的连贯视觉）
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {object} view - 视图快照
 * @param {boolean} isEditor - 编辑器模式（跳过视野裁剪）
 */
export function drawCorners(ctx, view, isEditor = false) {
    const cs = view.cellSize; const w = Math.max(2, cs / 10);
    ctx.fillStyle = view.colors.wall;
    const { width, height, hWalls, vWalls, activeCells, seenCells, debugVision } = view;
    const isActive = (cx, cy) => (cx >= 0 && cx < width && cy >= 0 && cy < height) ? activeCells[cy][cx] : false;
    // 参与直角补块的墙类型：实心墙 + 门（DOOR/LOCKED/ONE_WAY/LETTER_DOOR）——墙/门与墙/门
    // 成直角时交点补一个方块，保证直角边缘连贯（无折线）。GLASS 画装饰短斜线，不参与。
    const isCornerWall = (wt) => wt === WALL_TYPES.SOLID || wt === WALL_TYPES.DOOR ||
        wt === WALL_TYPES.LOCKED || wt === WALL_TYPES.ONE_WAY || wt === WALL_TYPES.LETTER_DOOR;
    const hasCornerWall = (type, wx, wy) => {
        const isH = type === 'h';
        if (wx < 0 || wy < 0 || wx >= (isH ? width : width + 1) || wy >= (isH ? height + 1 : height)) return false;
        const ax = isH ? wx : wx - 1, ay = isH ? wy - 1 : wy;
        const firstActive = isActive(ax, ay), secondActive = isActive(wx, wy);
        if (!firstActive && !secondActive) return false;
        const isBoundary = firstActive !== secondActive;
        if (!isEditor && !debugVision && !isBoundary &&
            !(firstActive && seenCells[ay][ax]) && !(secondActive && seenCells[wy][wx])) return false;
        const wall = (isH ? hWalls : vWalls)[wy][wx];
        if (wall.type === WALL_TYPES.EMPTY) return isBoundary && (!isEditor || view.editor.mode === 'free');
        if (wall.type === WALL_TYPES.LETTER_DOOR &&
            (isEditor ? wall.initialState : wall.currentState) === 'open') return false;
        return isCornerWall(wall.type);
    };
    for (let y = 0; y <= height; y++) {
        for (let x = 0; x <= width; x++) {
            const hasHLeft = hasCornerWall('h', x - 1, y); const hasHRight = hasCornerWall('h', x, y);
            const hasVUp = hasCornerWall('v', x, y - 1); const hasVDown = hasCornerWall('v', x, y);
            // 只有实际绘出的横、竖墙段相交才补角；同一直线的接缝不补方块。
            if (!(hasHLeft || hasHRight) || !(hasVUp || hasVDown)) continue;
            if (!isEditor && !debugVision) {
                const isPureInternal = (x > 0 && x < width && y > 0 && y < height &&
                    isActive(x - 1, y - 1) && isActive(x, y - 1) && isActive(x - 1, y) && isActive(x, y));
                if (isPureInternal && !(seenCells[y - 1][x - 1] || seenCells[y - 1][x] || seenCells[y][x - 1] || seenCells[y][x])) continue;
            }
            ctx.fillRect(x * cs - w / 2, y * cs - w / 2, w, w);
        }
    }
}

/**
 * 游戏态全量渲染（吸收 ghostMazeGame.draw 活副本）
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {object} view - 视图快照（computeGameView 投影产物）
 */
export function drawGame(ctx, view) {
    const cs = view.cellSize; const now = Date.now();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save(); ctx.translate(view.drawOffset.x, view.drawOffset.y);
    ctx.drawImage(view.staticLayerCanvas, -view.drawOffset.x, -view.drawOffset.y);
    const drawTrail = (arr, color) => arr.forEach(p => {
        if (view.seenCells[p.y][p.x] || view.debugVision) {
            const age = now - p.timestamp; const alpha = 0.3 * (1 - age / 500);
            drawCircle(ctx, p.x, p.y, cs, color, alpha);
        }
    });
    drawTrail(view.player.trail, view.colors.player);
    view.ghosts.forEach(ghost => drawTrail(ghost.trail, view.colors.ghost));
    for (let y = 0; y < view.height; y++) {
        for (let x = 0; x < view.width; x++) {
            if (view.activeCells[y][x] && !view.seenCells[y][x] && !view.debugVision) {
                ctx.fillStyle = view.colors.unexplored; ctx.fillRect(x * cs, y * cs, cs, cs);
            }
        }
    }
    ctx.beginPath();
    for (let y = 0; y <= view.height; y++) {
        for (let x = 0; x < view.width; x++) {
            const isBoundary = shouldDrawBoundary(x, y, true, view.activeCells, view.width, view.height);
            const isActiveRow = (y < view.height && view.activeCells[y][x]) || (y > 0 && view.activeCells[y - 1][x]);
            if (!isActiveRow && !isBoundary) continue;
            const isVisible = isBoundary || view.debugVision || (y < view.height && view.activeCells[y][x] && view.seenCells[y][x]) || (y > 0 && view.activeCells[y - 1][x] && view.seenCells[y - 1][x]);
            if (isVisible) {
                if (isBoundary) drawWallOrDoor(ctx, x * cs, y * cs, (x + 1) * cs, y * cs, { type: WALL_TYPES.SOLID }, cs, view.colors, view.state);
                else if (view.hWalls[y][x].type !== WALL_TYPES.EMPTY) drawWallOrDoor(ctx, x * cs, y * cs, (x + 1) * cs, y * cs, view.hWalls[y][x], cs, view.colors, view.state);
            }
        }
    }
    for (let y = 0; y < view.height; y++) {
        for (let x = 0; x <= view.width; x++) {
            const isBoundary = shouldDrawBoundary(x, y, false, view.activeCells, view.width, view.height);
            const isActiveCol = (x < view.width && view.activeCells[y][x]) || (x > 0 && view.activeCells[y][x - 1]);
            if (!isActiveCol && !isBoundary) continue;
            const isVisible = isBoundary || view.debugVision || (x < view.width && view.activeCells[y][x] && view.seenCells[y][x]) || (x > 0 && view.activeCells[y][x - 1] && view.seenCells[y][x - 1]);
            if (isVisible) {
                if (isBoundary) drawWallOrDoor(ctx, x * cs, y * cs, x * cs, (y + 1) * cs, { type: WALL_TYPES.SOLID }, cs, view.colors, view.state);
                else if (view.vWalls[y][x].type !== WALL_TYPES.EMPTY) drawWallOrDoor(ctx, x * cs, y * cs, x * cs, (y + 1) * cs, view.vWalls[y][x], cs, view.colors, view.state);
            }
        }
    }
    ctx.stroke();
    drawCorners(ctx, view, false);
    view.stairs.filter(s => s.layer === view.currentLayer).forEach(stair => {
        if (view.seenCells[stair.y][stair.x] || view.debugVision) { drawStair(ctx, stair, cs, view.colors); }
    });
    if (view.endPos && (view.seenCells[view.endPos.y][view.endPos.x] || view.debugVision)) { drawCircle(ctx, view.endPos.x, view.endPos.y, cs, view.colors.endPoint); }
    // 玩家先画、鬼后画：两者重合时鬼显示在玩家上面。
    if (!view.multiLayerMode || view.currentLayer === view.playerLayer) { drawCircle(ctx, view.player.x, view.player.y, cs, view.colors.player); }
    view.ghosts.forEach(ghost => { if (view.seenCells[ghost.y][ghost.x] || view.debugVision) { drawCircle(ctx, ghost.x, ghost.y, cs, view.colors.ghost); } });
    view.items.forEach(item => { if (view.seenCells[item.y][item.x] || view.debugVision) { drawItem(ctx, item, cs, view.colors); } });
    view.buttons.forEach(button => { if (view.seenCells[button.y][button.x] || view.debugVision) { drawButton(ctx, button, cs, view.colors); } });
    view.buttons.forEach(button => { if (view.seenCells[button.y][button.x] || view.debugVision) { drawButtonLetter(ctx, button, cs, view.colors); } });
    drawWallOverlays(ctx, { ...view, inGame: true });
    // 重合数量也必须可见，不能让一只鬼和多只鬼呈现为相同局面。
    const counts = new Map();
    view.ghosts.forEach(g => {
        if (view.seenCells[g.y][g.x] || view.debugVision) {
            const key = `${g.x},${g.y}`;
            counts.set(key, { x: g.x, y: g.y, count: (counts.get(key)?.count || 0) + 1 });
        }
    });
    for (const { x, y, count } of counts.values()) if (count > 1) {
        const cx = (x + 0.77) * cs, cy = (y + 0.23) * cs;
        ctx.save(); ctx.globalAlpha = 1; ctx.fillStyle = view.colors.ghost;
        ctx.beginPath(); ctx.arc(cx, cy, cs * 0.16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = `bold ${Math.max(10, cs * 0.23)}px sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(count), cx, cy);
        ctx.restore();
    }
    ctx.restore();
}

/**
 * 编辑器态全量渲染（吸收 ghostMazeGame.drawEditor 活副本）
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {object} view - 视图快照（computeEditorView 投影产物）
 */
export function drawEditor(ctx, view) {
    const cs = view.cellSize;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save(); ctx.translate(view.offsetX ?? view.padding, view.offsetY ?? view.padding);
    if (view.workspaceFrame) {
        for (let y = 0; y < view.height; y++) for (let x = 0; x < view.width; x++) if (view.activeCells[y][x]) {
            ctx.fillStyle = view.colors.ground; ctx.fillRect(x * cs, y * cs, cs, cs);
            ctx.strokeStyle = view.colors.gridLine; ctx.lineWidth = 1; ctx.strokeRect(x * cs, y * cs, cs, cs);
        }
    } else ctx.drawImage(view.staticLayerCanvas, 0, 0);
    if (view.editor.mode === 'free') {
        ctx.beginPath(); ctx.strokeStyle = view.colors.voidGrid; ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
        const frame = view.workspaceFrame ?? { x: 0, y: 0, width: view.width, height: view.height };
        for (let y = frame.y; y < frame.y + frame.height; y++) { for (let x = frame.x; x < frame.x + frame.width; x++) { if (!view.activeCells[y]?.[x]) { ctx.strokeRect(x * cs, y * cs, cs, cs); } } }
        if (!view.workspaceFrame) ctx.strokeRect(0, 0, view.width * cs, view.height * cs); ctx.setLineDash([]);
    }
    if (view.editor.mode === 'regular') { ctx.fillStyle = view.colors.startRoomHighlight; ctx.fillRect(0, getStartRoomY(view.height) * cs, START_ROOM_SIZE * cs, START_ROOM_SIZE * cs); }
    ctx.beginPath();
    for (let y = 0; y <= view.height; y++) {
        for (let x = 0; x < view.width; x++) {
            const isActiveRow = (y < view.height && view.activeCells[y][x]) || (y > 0 && view.activeCells[y - 1][x]);
            if (!isActiveRow) continue;
            if (shouldDrawBoundary(x, y, true, view.activeCells, view.width, view.height)) drawWallOrDoor(ctx, x * cs, y * cs, (x + 1) * cs, y * cs, { type: WALL_TYPES.SOLID }, cs, view.colors, view.state);
            else if (view.hWalls[y][x].type !== WALL_TYPES.EMPTY) drawWallOrDoor(ctx, x * cs, y * cs, (x + 1) * cs, y * cs, view.hWalls[y][x], cs, view.colors, view.state);
        }
    }
    for (let y = 0; y < view.height; y++) {
        for (let x = 0; x <= view.width; x++) {
            const isActiveCol = (x < view.width && view.activeCells[y][x]) || (x > 0 && view.activeCells[y][x - 1]);
            if (!isActiveCol) continue;
            if (shouldDrawBoundary(x, y, false, view.activeCells, view.width, view.height)) drawWallOrDoor(ctx, x * cs, y * cs, x * cs, (y + 1) * cs, { type: WALL_TYPES.SOLID }, cs, view.colors, view.state);
            else if (view.vWalls[y][x].type !== WALL_TYPES.EMPTY) drawWallOrDoor(ctx, x * cs, y * cs, x * cs, (y + 1) * cs, view.vWalls[y][x], cs, view.colors, view.state);
        }
    }
    ctx.stroke();
    drawCorners(ctx, view, true);
    // 元件分两层：长条、方块这些灰色线条画在放置高亮之下，只有字母和数字压在高亮之上。
    view.stairs.filter(s => s.layer === view.currentLayer).forEach(s => drawStair(ctx, s, cs, view.colors));
    if (view.endPos) drawCircle(ctx, view.endPos.x, view.endPos.y, cs, view.colors.endPoint);
    if (view.customStartPos) drawCircle(ctx, view.customStartPos.x, view.customStartPos.y, cs, view.colors.player);
    view.ghosts.forEach(g => drawCircle(ctx, g.x, g.y, cs, view.colors.ghost));
    view.items.forEach(item => drawItem(ctx, item, cs, view.colors));
    view.buttons.forEach(b => drawButton(ctx, b, cs, view.colors));
    if (view.editor.mode === 'regular') drawCircle(ctx, view.startPos.x, view.startPos.y, cs, view.colors.player);
    // 放置高亮预览：画在元件线条之上、字母数字之下。
    if (view.editor.tool === EDITOR_TOOLS.GRID && view.editor.hoveredWall) {
        const { x, y } = view.editor.hoveredWall;
        if (x >= 0 && x < view.width && y >= 0 && y < view.height) { ctx.fillStyle = "rgba(255, 255, 0, 0.3)"; ctx.fillRect(x * cs, y * cs, cs, cs); }
    } else if (view.editor.hoveredWall && !view.editor.isDragging) {
        const { x, y, type, direction } = view.editor.hoveredWall;
        let wallType = 1;
        switch (view.editor.tool) {
            case EDITOR_TOOLS.DOOR: wallType = 2; break; case EDITOR_TOOLS.GLASS: wallType = 5; break;
            case EDITOR_TOOLS.LOCK: wallType = 3; break; case EDITOR_TOOLS.ONE_WAY: wallType = 4; break;
            case EDITOR_TOOLS.LETTER_DOOR: wallType = 6; break; default: wallType = 1;
        }
        const isValidWall = (type === 'h') ? (x >= 0 && x < view.width && y > 0 && y < view.height && view.activeCells[y - 1][x] && view.activeCells[y][x]) : (y >= 0 && y < view.height && x > 0 && x < view.width && view.activeCells[y][x - 1] && view.activeCells[y][x]);
        if (isValidWall) {
            ctx.beginPath(); const wallObject = { type: wallType, keys: '?', direction: direction };
            if (type === 'h') drawWallOrDoor(ctx, x * cs, y * cs, (x + 1) * cs, y * cs, wallObject, cs, view.colors, view.state, true);
            else drawWallOrDoor(ctx, x * cs, y * cs, x * cs, (y + 1) * cs, wallObject, cs, view.colors, view.state, true);
            ctx.stroke();
            if (wallObject.type === WALL_TYPES.ONE_WAY && wallObject.direction) {
                if (type === 'h') { drawArrow(ctx, x * cs, y * cs, (x + 1) * cs, y * cs, direction, 'white', false, cs); }
                else { drawArrow(ctx, x * cs, y * cs, x * cs, (y + 1) * cs, direction, 'white', false, cs); }
            }
        }
    }
    // 当前工具正要放下的元件：贴墙按钮与楼梯也一起预览。
    if (view.editor.tool === EDITOR_TOOLS.STAIR && view.editor.stairPlacement) { drawStair(ctx, view.editor.stairPlacement, cs, view.colors, !view.editor.isDragging); }
    if (view.editor.hoveredButtonHotspot) {
        const virtualButton = { x: view.editor.hoveredButtonHotspot.x, y: view.editor.hoveredButtonHotspot.y, direction: view.editor.hoveredButtonHotspot.direction };
        drawButton(ctx, virtualButton, cs, view.colors, true);
    }
    // 字母、数字（门与按钮上的参数）压在高亮之上，放置高亮不能盖住它们。
    drawWallOverlays(ctx, { ...view, inGame: false });
    view.buttons.forEach(b => drawButtonLetter(ctx, b, cs, view.colors));
    // 橡皮擦工具或右键橡皮擦时显示浅灰色大圆点提示
    if ((view.editor.tool === EDITOR_TOOLS.ERASER || view.editor.isRightClickErasing) && view.editor.rightClickMousePos) {
        ctx.fillStyle = '#aaaaaa';
        ctx.beginPath();
        ctx.arc(view.editor.rightClickMousePos.x, view.editor.rightClickMousePos.y, 8, 0, 2 * Math.PI);
        ctx.fill();
    }
    ctx.restore();
}
