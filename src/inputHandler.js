import { GAME_STATES, WALL_TYPES, EDITOR_TOOLS } from './core/constants.js';
import * as Editor from './editor/editor.js';
import * as Pathfinding from './core/pathfinding.js';

/**
 * InputHandler 模块 - 处理所有输入事件（键盘、鼠标、触摸）
 */

// 模块级 canvas 引用（与原版 ghostMazeGame.js 的闭包变量一致）。
// 鼠标坐标换算 getMousePos 需要访问画布尺寸，独立模块内不能依赖 main.js 的闭包，
// 故在模块顶层获取同一 DOM 元素（index.html 以 type="module" 加载，DOM 已就绪）。
const canvas = document.getElementById('game-canvas');

/**
 * 绑定D-pad控制器事件
 * @param {object} game - 游戏实例
 */
export function bindDpadControls(game) {
    let dpadInterval = null;

    const handleDpadPress = (dx, dy) => {
        if (game.state !== GAME_STATES.PLAYING) return;

        if (game.controller.mapDefinition?.multiLayerMode && game.controller.viewLayer !== game.controller.currentGameState?.player?.layer) {
            game.switchToLayer(game.controller.currentGameState.player.layer);
        }

        clearInterval(game.autoMoveInterval);
        clearInterval(dpadInterval);
        game.movePlayer(dx, dy);
        dpadInterval = setInterval(() => game.movePlayer(dx, dy), 200);
    };

    const handleCenterPress = () => {
        if (game.state !== GAME_STATES.PLAYING) return;

        if (game.controller.mapDefinition?.multiLayerMode && game.controller.viewLayer !== game.controller.currentGameState?.player?.layer) {
            game.switchToLayer(game.controller.currentGameState.player.layer);
        }

        game.useStair();
    };

    const handleDpadRelease = () => {
        clearInterval(dpadInterval);
    };

    const addListeners = (element, dx, dy) => {
        if (!element) return;
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleDpadPress(dx, dy);
        }, { passive: false });
        element.addEventListener('mousedown', () => handleDpadPress(dx, dy));
    };

    addListeners(document.getElementById('dpad-up'), 0, -1);
    addListeners(document.getElementById('dpad-down'), 0, 1);
    addListeners(document.getElementById('dpad-left'), -1, 0);
    addListeners(document.getElementById('dpad-right'), 1, 0);

    const centerBtn = document.getElementById('dpad-center');
    if (centerBtn) {
        centerBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleCenterPress();
        }, { passive: false });
        centerBtn.addEventListener('mousedown', handleCenterPress);
    }

    document.addEventListener('touchend', handleDpadRelease);
    document.addEventListener('mouseup', handleDpadRelease);

    // 返回清理函数
    return () => {
        clearInterval(dpadInterval);
    };
}

        export function handleKeyPress(game, e) {
            // 编辑器模式的快捷键处理
            if (game.state === GAME_STATES.EDITOR && game.editor.active) {
                handleEditorKeyPress(game, e);
                return;
            }
            if (game.state !== GAME_STATES.PLAYING) return;
            game.stopAutoMove();
            if (game.controller.mapDefinition?.multiLayerMode && game.controller.viewLayer !== game.controller.currentGameState?.player?.layer) { game.switchToLayer(game.controller.currentGameState.player.layer); }
            let dx = 0, dy = 0;
            switch (e.key) {
                case 'ArrowUp': case 'w': dy = -1; break;
                case 'ArrowDown': case 's': dy = 1; break;
                case 'ArrowLeft': case 'a': dx = -1; break;
                case 'ArrowRight': case 'd': dx = 1; break;
                case ' ': e.preventDefault(); game.useStair(); return;
                default: return;
            }
            e.preventDefault(); game.movePlayer(dx, dy);
        }
        export function handleEditorKeyPress(game, e) {
            // 获取所有可见的工具按钮
            const getVisibleTools = () => {
                const toolBtns = document.querySelectorAll('.tool-btn');
                const visibleTools = [];
                toolBtns.forEach(btn => {
                    if (btn.style.display !== 'none') {
                        const toolName = btn.id.split('-')[1];
                        visibleTools.push(toolName);
                    }
                });
                return visibleTools;
            };

            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    // 向上切换图层
                    if (game.multiLayerMode) {
                        e.preventDefault();
                        const nextLayer = game.currentLayer >= game.layerCount - 1 ? 0 : game.currentLayer + 1;
                        game.switchToLayer(nextLayer);
                    }
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    // 向下切换图层
                    if (game.multiLayerMode) {
                        e.preventDefault();
                        const prevLayer = game.currentLayer <= 0 ? game.layerCount - 1 : game.currentLayer - 1;
                        game.switchToLayer(prevLayer);
                    }
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    // 向左切换工具
                    e.preventDefault();
                    {
                        const visibleTools = getVisibleTools();
                        const currentIndex = visibleTools.indexOf(game.editor.tool);
                        const nextIndex = currentIndex <= 0 ? visibleTools.length - 1 : currentIndex - 1;
                        game.setEditorTool(visibleTools[nextIndex]);
                    }
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    // 向右切换工具
                    e.preventDefault();
                    {
                        const visibleTools = getVisibleTools();
                        const currentIndex = visibleTools.indexOf(game.editor.tool);
                        const nextIndex = currentIndex >= visibleTools.length - 1 ? 0 : currentIndex + 1;
                        game.setEditorTool(visibleTools[nextIndex]);
                    }
                    break;
                case ' ':
                    // 空格键：回到起点所在的图层
                    e.preventDefault();
                    if (game.multiLayerMode) {
                        game.switchToLayer(game.playerLayer);
                    }
                    break;
            }
        }
        export function getMousePos(game, e) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height;
            const mx = (e.clientX - rect.left) * scaleX; const my = (e.clientY - rect.top) * scaleY;
            if (game.state === GAME_STATES.PLAYING) { return { x: mx - game.drawOffset.x, y: my - game.drawOffset.y }; }
            return { x: mx - (game.padding || 0), y: my - (game.padding || 0) };
        }
        export function handleCanvasClick(game, e) {
            if (game.state !== GAME_STATES.PLAYING || game.editor.active) return;
            game.stopAutoMove();
            const view = game.getGameView();
            const pos = getMousePos(game, e);
            const targetX = Math.floor(pos.x / view.cellSize); const targetY = Math.floor(pos.y / view.cellSize);
            if (targetX < 0 || targetX >= view.width || targetY < 0 || targetY >= view.height) return;
            const dx = targetX - view.player.x; const dy = targetY - view.player.y;
            if (Math.abs(dx) + Math.abs(dy) === 1) {
                // 相邻格：先等效方向键单步（支持穿门进黑暗格 / 触发按钮）
                const result = game.movePlayer(dx, dy);
                // 已产生效果（移动/按按钮等状态变化）→ 单步完成，结束
                if (result !== null) return;
                // 单步无效（撞墙等）且目标非黑暗 → 降级为寻路绕行
                if (!view.seenCells[targetY][targetX] && !view.debugVision) return;
            } else if (!view.seenCells[targetY][targetX] && !view.debugVision) {
                // 远距：目标必须已探索
                return;
            }
            const path = findPlayerPath(game, { x: view.player.x, y: view.player.y }, { x: targetX, y: targetY });
            if (path && path.length > 1) {
                let currentStep = 1;
                const move = () => {
                    if (currentStep >= path.length || game.state !== GAME_STATES.PLAYING) { game.stopAutoMove(); return; }
                    const nextPos = path[currentStep];
                    // 每次动态读取当前玩家位置：view 是点击时的闭包快照，若复用它，delta 会
                    // 相对固定起点累积（第 2 步跳 2 格、第 3 步跳 3 格…）→ 跳格/瞬移。
                    // 必须基于当前玩家位置计算单格增量。
                    const current = game.getGameView();
                    const beforeX = current.player.x; const beforeY = current.player.y;
                    game.movePlayer(nextPos.x - beforeX, nextPos.y - beforeY);
                    // 玩家位置未推进（撞墙失败/触发按钮等不移动动作）→ 路径失效，立即停止，
                    // 防止 currentStep 前进后 delta 累积成跳格。
                    const after = game.getGameView();
                    if (after.player.x === beforeX && after.player.y === beforeY) { game.stopAutoMove(); return; }
                    currentStep++;
                };
                move();
                if (path.length > 2) { game.autoMoveInterval = setInterval(move, 200); }
            }
        }


        export function handleCanvasMouseDown(game, e) {
            if (!game.editor.active) return;
            
            // 右键点击处理（自动切换到橡皮擦工具）
            if (e.button === 2) {
                e.preventDefault();
                // 保存当前工具，以便松开右键后恢复
                if (game.editor.tool !== EDITOR_TOOLS.ERASER) {
                    game.editor.previousToolBeforeRightClick = game.editor.tool;
                    game.setEditorTool(EDITOR_TOOLS.ERASER);
                }
                game.editor.isRightClickErasing = true;
                const pos = getMousePos(game, e);
                game.editor.rightClickMousePos = pos;
                game.eraseAtPos(pos);
                return;
            }
            
            game.editor.isDragging = true; game.editor.didDrag = false; game.editor.hoveredWall = null;
            const pos = getMousePos(game, e);
            
            // 橡皮擦工具处理
            if (game.editor.tool === EDITOR_TOOLS.ERASER) {
                game.editor.rightClickMousePos = pos;
                game.eraseAtPos(pos);
                return;
            }
            
            if (game.editor.tool === EDITOR_TOOLS.GRID && game.editor.mode === 'free') {
                const cellX = Math.floor(pos.x / game.cellSize); const cellY = Math.floor(pos.y / game.cellSize);
                if (cellX >= 0 && cellX < game.width && cellY >= 0 && cellY < game.height) {
                    game.editor.gridDragAction = game.activeCells[cellY][cellX] ? 'remove' : 'add';
                    toggleActiveCell(game, cellX, cellY, game.editor.gridDragAction);
                }
            } else if (game.editor.tool === EDITOR_TOOLS.STAIR && game.multiLayerMode) {
                const cellX = Math.floor(pos.x / game.cellSize); const cellY = Math.floor(pos.y / game.cellSize);
                if (cellX >= 0 && cellX < game.width && cellY >= 0 && cellY < game.height) {
                    const existingStair = game.stairs.find(s => s.x === cellX && s.y === cellY && s.layer === game.currentLayer);
                    if (existingStair) { game.eraseStairAt(cellX, cellY, game.currentLayer); game.drawEditor(); }
                    else {
                        let direction = (pos.y - cellY * game.cellSize) < game.cellSize / 2 ? 'up' : 'down';
                        if (!isValidStairPlacement(game, cellX, cellY, direction)) {
                            const otherDirection = direction === 'up' ? 'down' : 'up';
                            if (isValidStairPlacement(game, cellX, cellY, otherDirection)) { direction = otherDirection; }
                        }
                        if (isValidStairPlacement(game, cellX, cellY, direction)) { game.editor.stairPlacement = { x: cellX, y: cellY, direction, layer: game.currentLayer }; }
                        else { game.showToast('无效放置', 1500, 'error'); }
                        game.drawEditor();
                    }
                }
            } else if (game.editor.tool === EDITOR_TOOLS.WALL || game.editor.tool === EDITOR_TOOLS.GLASS) {
                const wall = getWallAtPos(game, pos.x, pos.y);
                if (wall && game.isWallEditable(wall)) {
                    game.editor.dragAxis = wall.type;
                    const type = game.editor.tool === EDITOR_TOOLS.GLASS ? WALL_TYPES.GLASS : WALL_TYPES.SOLID;
                    toggleWall(game, wall, type); game.editor.lastDragPos = wall;
                } else { game.editor.dragAxis = null; }
            } else if (game.editor.tool === EDITOR_TOOLS.ONE_WAY) {
                const wall = getWallAtPos(game, pos.x, pos.y);
                if (wall && game.isWallEditable(wall)) {
                    // 单向门不是SOLID墙，需要清除依附的按钮
                    const currentWallObj = wall.type === 'h' ? game.hWalls[wall.y][wall.x] : game.vWalls[wall.y][wall.x];
                    if (currentWallObj.type === WALL_TYPES.SOLID) {
                        game.eraseButtonsOnWall(wall);
                    }
                    const direction = getMouseSideOfWall(game, pos.x, pos.y, wall);
                    const newWall = { type: WALL_TYPES.ONE_WAY, direction: direction };
                    if (wall.type === 'h') game.hWalls[wall.y][wall.x] = newWall; else game.vWalls[wall.y][wall.x] = newWall;
                    game.editor.lastDragPos = wall; game.drawEditor();
                }
            }
        }

        export function handleCanvasMouseMove(game, e) {
            if (!game.editor.active) return;
            const pos = getMousePos(game, e);
            
            // 右键拖动橡皮擦
            if (game.editor.isRightClickErasing) {
                game.editor.rightClickMousePos = pos;
                game.eraseAtPos(pos);
                return;
            }
            
            // 橡皮擦工具：始终显示指示点，拖动时擦除
            if (game.editor.tool === EDITOR_TOOLS.ERASER) {
                game.editor.rightClickMousePos = pos;
                if (game.editor.isDragging) {
                    game.eraseAtPos(pos);
                } else {
                    game.drawEditor();
                }
                return;
            }
            
            if (game.editor.tool === EDITOR_TOOLS.GRID && game.editor.mode === 'free') {
                const cellX = Math.floor(pos.x / game.cellSize); const cellY = Math.floor(pos.y / game.cellSize);
                if (game.editor.isDragging) {
                    game.editor.hoveredWall = null; game.editor.didDrag = true;
                    if (cellX >= 0 && cellX < game.width && cellY >= 0 && cellY < game.height) {
                        const currentStatus = game.activeCells[cellY][cellX];
                        if ((game.editor.gridDragAction === 'add' && !currentStatus) || (game.editor.gridDragAction === 'remove' && currentStatus)) {
                            toggleActiveCell(game, cellX, cellY, game.editor.gridDragAction);
                        }
                    }
                } else {
                    if (!game.editor.hoveredWall || game.editor.hoveredWall.x !== cellX || game.editor.hoveredWall.y !== cellY) {
                        game.editor.hoveredWall = { x: cellX, y: cellY }; game.drawEditor();
                    }
                }
                return;
            }
            if (game.editor.tool === EDITOR_TOOLS.STAIR && game.multiLayerMode) {
                if (game.editor.stairPlacement && game.editor.isDragging) {
                    const cellX = game.editor.stairPlacement.x; const cellY = game.editor.stairPlacement.y;
                    let direction = (pos.y - cellY * game.cellSize) < game.cellSize / 2 ? 'up' : 'down';
                    if (!isValidStairPlacement(game, cellX, cellY, direction)) {
                        const otherDirection = direction === 'up' ? 'down' : 'up';
                        if (isValidStairPlacement(game, cellX, cellY, otherDirection)) { direction = otherDirection; }
                    }
                    if (game.editor.stairPlacement.direction !== direction) {
                        game.editor.stairPlacement.direction = direction; game.editor.didDrag = true; game.drawEditor();
                    }
                } else if (!game.editor.isDragging) {
                    const cellX = Math.floor(pos.x / game.cellSize); const cellY = Math.floor(pos.y / game.cellSize);
                    if (cellX >= 0 && cellX < game.width && cellY >= 0 && cellY < game.height && game.activeCells[cellY][cellX]) {
                        const existingStair = game.stairs.find(s => s.x === cellX && s.y === cellY && s.layer === game.currentLayer);
                        if (!existingStair) {
                            let direction = (pos.y - cellY * game.cellSize) < game.cellSize / 2 ? 'up' : 'down';
                            let valid = isValidStairPlacement(game, cellX, cellY, direction);
                            if (!valid) {
                                const otherDirection = direction === 'up' ? 'down' : 'up';
                                if (isValidStairPlacement(game, cellX, cellY, otherDirection)) { direction = otherDirection; valid = true; }
                            }
                            if (valid) {
                                const newPlacement = { x: cellX, y: cellY, direction, layer: game.currentLayer };
                                if (!game.editor.stairPlacement || game.editor.stairPlacement.x !== newPlacement.x || game.editor.stairPlacement.y !== newPlacement.y || game.editor.stairPlacement.direction !== newPlacement.direction) {
                                    game.editor.stairPlacement = newPlacement; game.drawEditor();
                                }
                            } else if (game.editor.stairPlacement) { game.editor.stairPlacement = null; game.drawEditor(); }
                        } else if (game.editor.stairPlacement) { game.editor.stairPlacement = null; game.drawEditor(); }
                    } else if (game.editor.stairPlacement) { game.editor.stairPlacement = null; game.drawEditor(); }
                }
                return;
            }
            const isWallTool = [EDITOR_TOOLS.WALL, EDITOR_TOOLS.DOOR, EDITOR_TOOLS.LOCK, EDITOR_TOOLS.ONE_WAY, EDITOR_TOOLS.GLASS, EDITOR_TOOLS.LETTER_DOOR].includes(game.editor.tool);
            if (!game.editor.isDragging) {
                let needsRedraw = false;
                if (isWallTool) {
                    const wall = getWallAtPos(game, pos.x, pos.y);
                    if (game.editor.hoveredButtonHotspot) { game.editor.hoveredButtonHotspot = null; needsRedraw = true; }
                    if (wall && game.isWallEditable(wall)) {
                        if (!game.editor.hoveredWall || game.editor.hoveredWall.x !== wall.x || game.editor.hoveredWall.y !== wall.y || game.editor.hoveredWall.type !== wall.type) {
                            game.editor.hoveredWall = wall; needsRedraw = true;
                        }
                        if (game.editor.tool === EDITOR_TOOLS.ONE_WAY) {
                            const direction = getMouseSideOfWall(game, pos.x, pos.y, wall);
                            if (!game.editor.hoveredWall.direction || game.editor.hoveredWall.direction.dx !== direction.dx || game.editor.hoveredWall.direction.dy !== direction.dy) {
                                game.editor.hoveredWall.direction = direction; needsRedraw = true;
                            }
                        }
                    } else if (game.editor.hoveredWall) { game.editor.hoveredWall = null; needsRedraw = true; }
                } else if (game.editor.tool === EDITOR_TOOLS.BUTTON) {
                    const hotspot = getButtonHotspotAtPos(game, pos.x, pos.y);
                    if (game.editor.hoveredWall) { game.editor.hoveredWall = null; needsRedraw = true; }
                    if (hotspot?.x !== game.editor.hoveredButtonHotspot?.x || hotspot?.y !== game.editor.hoveredButtonHotspot?.y || hotspot?.direction.dx !== game.editor.hoveredButtonHotspot?.direction.dx) {
                        game.editor.hoveredButtonHotspot = hotspot; needsRedraw = true;
                    }
                } else {
                    if (game.editor.hoveredWall) { game.editor.hoveredWall = null; needsRedraw = true; }
                    if (game.editor.hoveredButtonHotspot) { game.editor.hoveredButtonHotspot = null; needsRedraw = true; }
                }
                if (needsRedraw) { game.drawEditor(); }
                return;
            }
            game.editor.didDrag = true; game.editor.hoveredWall = null;
            if ((game.editor.tool === EDITOR_TOOLS.WALL || game.editor.tool === EDITOR_TOOLS.GLASS) && game.editor.dragAxis) {
                let wall;
                if (game.editor.dragAxis === 'h') { wall = { type: 'h', x: Math.floor(pos.x / game.cellSize), y: game.editor.lastDragPos.y }; }
                else { wall = { type: 'v', x: game.editor.lastDragPos.x, y: Math.floor(pos.y / game.cellSize) }; }
                if (wall && game.isWallEditable(wall) && (wall.x !== game.editor.lastDragPos.x || wall.y !== game.editor.lastDragPos.y)) {
                    const newType = game.editor.tool === EDITOR_TOOLS.GLASS ? WALL_TYPES.GLASS : WALL_TYPES.SOLID;
                    if (wall.type === 'h') game.hWalls[wall.y][wall.x] = { type: newType }; else game.vWalls[wall.y][wall.x] = { type: newType };
                    game.drawEditor(); game.editor.lastDragPos = wall;
                }
            } else if (game.editor.tool === EDITOR_TOOLS.ONE_WAY && game.editor.lastDragPos) {
                const wallData = game.editor.lastDragPos;
                const newDirection = getMouseSideOfWall(game, pos.x, pos.y, wallData);
                let currentWall = (wallData.type === 'h') ? game.hWalls[wallData.y][wallData.x] : game.vWalls[wallData.y][wallData.x];
                if (currentWall && currentWall.type === WALL_TYPES.ONE_WAY && (currentWall.direction.dx !== newDirection.dx || currentWall.direction.dy !== newDirection.dy)) {
                    currentWall.direction = newDirection; game.drawEditor();
                }
            }
        }

        export function toggleActiveCell(game, x, y, action) {
            if (x < 0 || x >= game.width || y < 0 || y >= game.height) return;
            const newState = (action === 'add');
            if (game.activeCells[y][x] === newState) return;
            game.activeCells[y][x] = newState;
            if (!newState) {
                if (game.customStartPos && game.customStartPos.x === x && game.customStartPos.y === y) game.customStartPos = null;
                if (game.endPos && game.endPos.x === x && game.endPos.y === y) game.endPos = null;
                game.ghosts = game.ghosts.filter(g => g.x !== x || g.y !== y);
                game.items = game.items.filter(i => i.x !== x || i.y !== y);
                game.buttons = game.buttons.filter(b => b.x !== x || b.y !== y);
                game.eraseStairAt(x, y, game.currentLayer);
                game.hWalls[y][x] = { type: 0 }; game.hWalls[y + 1][x] = { type: 0 };
                game.vWalls[y][x] = { type: 0 }; game.vWalls[y][x + 1] = { type: 0 };
            }
            game._renderStaticLayer(); game.drawEditor();
        }

        export function isValidStairPlacement(game, x, y, direction) {
            // 完整校验逻辑收敛在 Editor.isValidStairPlacement（当前层/目标层双向检查）
            return Editor.isValidStairPlacement(x, y, direction, {
                activeCells: game.activeCells,
                stairs: game.stairs,
                currentLayer: game.currentLayer,
                layerCount: game.layerCount,
                layers: game.layers,
                isCellOccupied: (cx, cy) => game.isCellOccupiedInEditor(cx, cy)
            });
        }

        export function placeStair(game, x, y, direction) {
            if (!isValidStairPlacement(game, x, y, direction)) { game.showToast('无效放置', 2000, 'error'); return false; }
            const targetLayer = direction === 'up' ? game.currentLayer + 1 : game.currentLayer - 1;
            const pairedDirection = direction === 'up' ? 'down' : 'up';
            game.stairs.push({ x, y, direction, layer: game.currentLayer });
            game.stairs.push({ x, y, direction: pairedDirection, layer: targetLayer });
            return true;
        }

        export function handleCanvasMouseUp(game, e) {
            if (!game.editor.active) return;
            
            // 右键松开时结束橡皮擦模式并恢复之前的工具
            if (e.button === 2 || game.editor.isRightClickErasing) {
                game.editor.isRightClickErasing = false;
                game.editor.rightClickMousePos = null;
                // 恢复右键按下前的工具
                if (game.editor.previousToolBeforeRightClick) {
                    game.setEditorTool(game.editor.previousToolBeforeRightClick);
                    game.editor.previousToolBeforeRightClick = null;
                }
                game.drawEditor();
                return;
            }
            
            // 橡皮擦工具松开时不清除指示点（保持显示），只重置拖动状态
            if (game.editor.tool === EDITOR_TOOLS.ERASER) {
                // 不清除 rightClickMousePos，让圆点继续显示
                game.editor.isDragging = false;
                game.editor.didDrag = false;
                game.drawEditor();
                return;
            }
            
            game.editor.gridDragAction = null;
            if (game.editor.tool === EDITOR_TOOLS.STAIR && game.editor.stairPlacement) {
                const { x, y, direction } = game.editor.stairPlacement;
                placeStair(game, x, y, direction);
                game.editor.stairPlacement = null; game.drawEditor();
                game.editor.isDragging = false; game.editor.didDrag = false; return;
            }
            if (game.editor.isDragging && !game.editor.didDrag) {
                const pos = getMousePos(game, e);
                const cx = Math.floor(pos.x / game.cellSize); const cy = Math.floor(pos.y / game.cellSize);
                const wall = getWallAtPos(game, pos.x, pos.y);
                if (wall && game.isWallEditable(wall)) {
                    if (game.editor.tool === EDITOR_TOOLS.DOOR) {
                        const wallRef = wall.type === 'h' ? game.hWalls[wall.y][wall.x] : game.vWalls[wall.y][wall.x];
                        // 门不是SOLID墙，需要清除依附的按钮
                        if (wallRef.type === WALL_TYPES.SOLID) {
                            game.eraseButtonsOnWall(wall);
                        }
                        wallRef.type = wallRef.type === WALL_TYPES.DOOR ? WALL_TYPES.EMPTY : WALL_TYPES.DOOR;
                    } else if (game.editor.tool === EDITOR_TOOLS.LOCK) {
                        const wallRef = wall.type === 'h' ? game.hWalls[wall.y][wall.x] : game.vWalls[wall.y][wall.x];
                        const numStr = prompt('请输入锁需要的钥匙数量:', '0');
                        if (numStr !== null) {
                            const keys = parseInt(numStr);
                            if (!isNaN(keys) && keys >= 0) {
                                // 数字门不是SOLID墙，需要清除依附的按钮
                                if (wallRef.type === WALL_TYPES.SOLID) {
                                    game.eraseButtonsOnWall(wall);
                                }
                                const newWall = { type: WALL_TYPES.LOCKED, keys: keys };
                                if (wall.type === 'h') game.hWalls[wall.y][wall.x] = newWall; else game.vWalls[wall.y][wall.x] = newWall;
                            } else { game.showToast('请输入一个有效的非负整数。', 3000, 'error'); }
                        }
                    } else if (game.editor.tool === EDITOR_TOOLS.LETTER_DOOR) {
                        const wallRef = wall.type === 'h' ? game.hWalls[wall.y][wall.x] : game.vWalls[wall.y][wall.x];
                        if (wallRef.type === WALL_TYPES.LETTER_DOOR) { wallRef.initialState = (wallRef.initialState === 'open') ? 'closed' : 'open'; }
                        else {
                            const letter = prompt('请输入一个字母:', 'A');
                            if (letter && /^[a-zA-Z]$/.test(letter)) {
                                // 字母门不是SOLID墙，需要清除依附的按钮
                                if (wallRef.type === WALL_TYPES.SOLID) {
                                    game.eraseButtonsOnWall(wall);
                                }
                                const newWall = { type: WALL_TYPES.LETTER_DOOR, letter: letter.toUpperCase(), initialState: 'closed' };
                                if (wall.type === 'h') game.hWalls[wall.y][wall.x] = newWall; else game.vWalls[wall.y][wall.x] = newWall;
                            } else if (letter !== null) { game.showToast('请输入单个英文字母。', 3000, 'error'); }
                        }
                    }
                }
                if (game.editor.tool === EDITOR_TOOLS.BUTTON) {
                    const hotspot = getButtonHotspotAtPos(game, pos.x, pos.y);
                    if (hotspot && game.activeCells[hotspot.y][hotspot.x]) {
                        const existingButtonIndex = game.buttons.findIndex(b => b.x === hotspot.x && b.y === hotspot.y && b.direction.dx === hotspot.direction.dx && b.direction.dy === hotspot.direction.dy);
                        if (existingButtonIndex > -1) { game.buttons.splice(existingButtonIndex, 1); }
                        else {
                            const letter = prompt('请输入一个字母:', 'A');
                            if (letter && /^[a-zA-Z]$/.test(letter)) { game.buttons.push({ ...hotspot, letter: letter.toUpperCase() }); }
                            else if (letter !== null) { game.showToast('请输入单个英文字母。', 3000, 'error'); }
                        }
                    }
                }
                if (cx >= 0 && cx < game.width && cy >= 0 && cy < game.height && game.activeCells[cy][cx]) {
                    const allowed = game.editor.mode === 'free' ? true : !game.isPosInStartRoom(cx, cy);
                    if (allowed) {
                        const isOccupied = game.isCellOccupiedInEditor(cx, cy);
                        switch (game.editor.tool) {
                            case EDITOR_TOOLS.END: if (!isOccupied || (game.endPos && game.endPos.x === cx && game.endPos.y === cy)) { game.endPos = { x: cx, y: cy }; } break;
                            case EDITOR_TOOLS.START:
                                if (game.editor.mode === 'free' && (!isOccupied || (game.customStartPos && game.customStartPos.x === cx && game.customStartPos.y === cy))) {
                                    if (game.multiLayerMode) {
                                        game._saveCurrentLayerData();
                                        for (let i = 0; i < game.layerCount; i++) { if (game.layers[i]) { game.layers[i].customStartPos = null; } }
                                    }
                                    game.customStartPos = { x: cx, y: cy }; game.playerLayer = game.currentLayer; game.updateLayerPanel();
                                } break;
                            case EDITOR_TOOLS.GHOST:
                                const existingGhostIndex = game.ghosts.findIndex(g => g.x === cx && g.y === cy);
                                if (existingGhostIndex > -1) game.ghosts.splice(existingGhostIndex, 1); else if (!isOccupied) game.ghosts.push({ x: cx, y: cy });
                                break;
                            case EDITOR_TOOLS.KEY:
                                const existingItemIndex = game.items.findIndex(i => i.x === cx && i.y === cy);
                                if (existingItemIndex > -1 && game.items[existingItemIndex].type === 'key') game.items.splice(existingItemIndex, 1); else if (!isOccupied) game.items.push({ x: cx, y: cy, type: 'key' });
                                break;
                        }
                    }
                }
                game.drawEditor();
            }
            game.editor.isDragging = false; game.editor.didDrag = false;
            game.editor.dragAxis = null; game.editor.lastDragPos = null;
        }

        export function handleCanvasMouseLeave(game, e) {
            // 清除所有悬停状态
            if (game.editor.hoveredWall) { game.editor.hoveredWall = null; game.drawEditor(); }
            if (game.editor.hoveredButtonHotspot) { game.editor.hoveredButtonHotspot = null; game.drawEditor(); }
            // 如果正在右键橡皮擦，也要停止
            if (game.editor.isRightClickErasing) {
                game.editor.isRightClickErasing = false;
                game.editor.rightClickMousePos = null;
                game.drawEditor();
            }
            // 橡皮擦工具：鼠标移出画布后清除小圆点
            if (game.editor.tool === EDITOR_TOOLS.ERASER) {
                game.editor.rightClickMousePos = null;
                game.drawEditor();
            }
            game.editor.dragAxis = null; game.editor.lastDragPos = null;
        }

        export function getWallAtPos(game, mouseX, mouseY) {
            return Editor.getWallAtPos(mouseX, mouseY, game.cellSize, game.width, game.height, game.editor.tool);
        }

        export function getButtonHotspotAtPos(game, mouseX, mouseY) {
            return Pathfinding.getButtonHotspotAtPos(mouseX, mouseY, {
                cellSize: game.cellSize,
                width: game.width,
                height: game.height,
                activeCells: game.activeCells,
                hWalls: game.hWalls,
                vWalls: game.vWalls,
                editorMode: game.editor.mode
            });
        }

        export function toggleWall(game, wall, targetType = WALL_TYPES.SOLID) {
            const { x, y, type } = wall;
            let currentWallObj;
            if (type === 'h' && y >= 0 && y <= game.height && x >= 0 && x < game.width) {
                currentWallObj = game.hWalls[y][x];
                const newType = currentWallObj.type === targetType ? WALL_TYPES.EMPTY : targetType;
                // 如果要清空墙类型或用非SOLID类型替换SOLID墙，先清除依附的按钮
                // 按钮只能依附在SOLID墙上，替换为其他任何类型都需要清除按钮
                if (newType === WALL_TYPES.EMPTY || (currentWallObj.type === WALL_TYPES.SOLID && newType !== WALL_TYPES.SOLID)) {
                    game.eraseButtonsOnWall(wall);
                }
                game.hWalls[y][x].type = newType;
            } else if (type === 'v' && x >= 0 && x <= game.width && y >= 0 && y < game.height) {
                currentWallObj = game.vWalls[y][x];
                const newType = currentWallObj.type === targetType ? WALL_TYPES.EMPTY : targetType;
                // 如果要清空墙类型或用非SOLID类型替换SOLID墙，先清除依附的按钮
                if (newType === WALL_TYPES.EMPTY || (currentWallObj.type === WALL_TYPES.SOLID && newType !== WALL_TYPES.SOLID)) {
                    game.eraseButtonsOnWall(wall);
                }
                game.vWalls[y][x].type = newType;
            }
            game.drawEditor();
        }

        export function getMouseSideOfWall(game, mouseX, mouseY, wall) {
            const cs = game.cellSize;
            if (wall.type === 'h') { return (mouseY > wall.y * cs) ? { dx: 0, dy: 1 } : { dx: 0, dy: -1 }; }
            else { return (mouseX > wall.x * cs) ? { dx: 1, dy: 0 } : { dx: -1, dy: 0 }; }
        }

        export function findPlayerPath(game, start, end) {
            // 读只读投影（Phase 4：权威源经 computeGameView 投影，不再读宿主镜像）
            const view = game.getGameView();
            return Pathfinding.findPlayerPath(start, end, {
                width: view.width,
                height: view.height,
                hWalls: view.hWalls,
                vWalls: view.vWalls,
                seenCells: view.seenCells,
                debugVision: view.debugVision,
                playerKeys: view.player.keys
            });
        }
