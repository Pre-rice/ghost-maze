import { GAME_STATES, WALL_TYPES, EDITOR_TOOLS, MOVE_INTERVAL_MS } from './core/constants.js';
import * as Editor from './editor/editor.js';
import * as Pathfinding from './core/pathfinding.js';

/**
 * InputHandler 模块 - 处理所有输入事件（键盘、鼠标、触摸）
 */

// 模块级 canvas 引用（与原版 ghostMazeGame.js 的闭包变量一致）。
// 鼠标坐标换算 getMousePos 需要访问画布尺寸，独立模块内不能依赖 main.js 的闭包，
// 故在模块顶层获取同一 DOM 元素（index.html 以 type="module" 加载，DOM 已就绪）。
const canvas = document.getElementById('game-canvas');

// 统一用户输入出口（行为零风险，仍用全局 prompt；将来若换异步模态输入框，只改这一处）
const askForInput = (message, defaultValue) => prompt(message, defaultValue);

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
        dpadInterval = setInterval(() => game.movePlayer(dx, dy), MOVE_INTERVAL_MS);
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
                    if (game.editorDoc.multiLayerMode) {
                        e.preventDefault();
                        const nextLayer = game.editorDoc.currentLayer >= game.editorDoc.layerCount - 1 ? 0 : game.editorDoc.currentLayer + 1;
                        game.switchToLayer(nextLayer);
                    }
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    // 向下切换图层
                    if (game.editorDoc.multiLayerMode) {
                        e.preventDefault();
                        const prevLayer = game.editorDoc.currentLayer <= 0 ? game.editorDoc.layerCount - 1 : game.editorDoc.currentLayer - 1;
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
                    if (game.editorDoc.multiLayerMode) {
                        game.switchToLayer(game.editorDoc.playerLayer);
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
                if (path.length > 2) { game.autoMoveInterval = setInterval(move, MOVE_INTERVAL_MS); }
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

            if (game.editor.tool === EDITOR_TOOLS.GRID && game.editorDoc.mode === 'free') {
                const cellX = Math.floor(pos.x / game.cellSize); const cellY = Math.floor(pos.y / game.cellSize);
                if (cellX >= 0 && cellX < game.editorDoc.width && cellY >= 0 && cellY < game.editorDoc.height) {
                    game.editor.gridDragAction = game.editorDoc.activeCells[cellY][cellX] ? 'remove' : 'add';
                    game.toggleActiveCell(cellX, cellY, game.editor.gridDragAction);
                }
            } else if (game.editor.tool === EDITOR_TOOLS.STAIR && game.editorDoc.multiLayerMode) {
                const cellX = Math.floor(pos.x / game.cellSize); const cellY = Math.floor(pos.y / game.cellSize);
                if (cellX >= 0 && cellX < game.editorDoc.width && cellY >= 0 && cellY < game.editorDoc.height) {
                    const existingStair = game.editorDoc.stairs.find(s => s.x === cellX && s.y === cellY && s.layer === game.editorDoc.currentLayer);
                    if (existingStair) { game.eraseStairAt(cellX, cellY, game.editorDoc.currentLayer); game.drawEditor(); }
                    else {
                        let direction = (pos.y - cellY * game.cellSize) < game.cellSize / 2 ? 'up' : 'down';
                        if (!game.isValidStairPlacement(cellX, cellY, direction)) {
                            const otherDirection = direction === 'up' ? 'down' : 'up';
                            if (game.isValidStairPlacement(cellX, cellY, otherDirection)) { direction = otherDirection; }
                        }
                        if (game.isValidStairPlacement(cellX, cellY, direction)) { game.editor.stairPlacement = { x: cellX, y: cellY, direction, layer: game.editorDoc.currentLayer }; }
                        else { game.showToast('无效放置', 1500, 'error'); }
                        game.drawEditor();
                    }
                }
            } else if (game.editor.tool === EDITOR_TOOLS.WALL || game.editor.tool === EDITOR_TOOLS.GLASS) {
                const wall = getWallAtPos(game, pos.x, pos.y);
                if (wall && game.isWallEditable(wall)) {
                    game.editor.dragAxis = wall.type;
                    const type = game.editor.tool === EDITOR_TOOLS.GLASS ? WALL_TYPES.GLASS : WALL_TYPES.SOLID;
                    game.toggleWall(wall, type); game.editor.lastDragPos = wall;
                } else { game.editor.dragAxis = null; }
            } else if (game.editor.tool === EDITOR_TOOLS.ONE_WAY) {
                const wall = getWallAtPos(game, pos.x, pos.y);
                if (wall && game.isWallEditable(wall)) {
                    const direction = getMouseSideOfWall(game, pos.x, pos.y, wall);
                    // 委托 doc.setOneWay：SOLID 墙清按钮 + 替换/改向一并处理
                    game.setOneWay(wall, direction);
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

            if (game.editor.tool === EDITOR_TOOLS.GRID && game.editorDoc.mode === 'free') {
                const cellX = Math.floor(pos.x / game.cellSize); const cellY = Math.floor(pos.y / game.cellSize);
                if (game.editor.isDragging) {
                    game.editor.hoveredWall = null; game.editor.didDrag = true;
                    if (cellX >= 0 && cellX < game.editorDoc.width && cellY >= 0 && cellY < game.editorDoc.height) {
                        const currentStatus = game.editorDoc.activeCells[cellY][cellX];
                        if ((game.editor.gridDragAction === 'add' && !currentStatus) || (game.editor.gridDragAction === 'remove' && currentStatus)) {
                            game.toggleActiveCell(cellX, cellY, game.editor.gridDragAction);
                        }
                    }
                } else {
                    if (!game.editor.hoveredWall || game.editor.hoveredWall.x !== cellX || game.editor.hoveredWall.y !== cellY) {
                        game.editor.hoveredWall = { x: cellX, y: cellY }; game.drawEditor();
                    }
                }
                return;
            }
            if (game.editor.tool === EDITOR_TOOLS.STAIR && game.editorDoc.multiLayerMode) {
                if (game.editor.stairPlacement && game.editor.isDragging) {
                    const cellX = game.editor.stairPlacement.x; const cellY = game.editor.stairPlacement.y;
                    let direction = (pos.y - cellY * game.cellSize) < game.cellSize / 2 ? 'up' : 'down';
                    if (!game.isValidStairPlacement(cellX, cellY, direction)) {
                        const otherDirection = direction === 'up' ? 'down' : 'up';
                        if (game.isValidStairPlacement(cellX, cellY, otherDirection)) { direction = otherDirection; }
                    }
                    if (game.editor.stairPlacement.direction !== direction) {
                        game.editor.stairPlacement.direction = direction; game.editor.didDrag = true; game.drawEditor();
                    }
                } else if (!game.editor.isDragging) {
                    const cellX = Math.floor(pos.x / game.cellSize); const cellY = Math.floor(pos.y / game.cellSize);
                    if (cellX >= 0 && cellX < game.editorDoc.width && cellY >= 0 && cellY < game.editorDoc.height && game.editorDoc.activeCells[cellY][cellX]) {
                        const existingStair = game.editorDoc.stairs.find(s => s.x === cellX && s.y === cellY && s.layer === game.editorDoc.currentLayer);
                        if (!existingStair) {
                            let direction = (pos.y - cellY * game.cellSize) < game.cellSize / 2 ? 'up' : 'down';
                            let valid = game.isValidStairPlacement(cellX, cellY, direction);
                            if (!valid) {
                                const otherDirection = direction === 'up' ? 'down' : 'up';
                                if (game.isValidStairPlacement(cellX, cellY, otherDirection)) { direction = otherDirection; valid = true; }
                            }
                            if (valid) {
                                const newPlacement = { x: cellX, y: cellY, direction, layer: game.editorDoc.currentLayer };
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
                    // 拖拽画墙走 setWall 替换语义（勿用 toggleWall 翻转）
                    game.setWall(wall, newType);
                    game.editor.lastDragPos = wall;
                }
            } else if (game.editor.tool === EDITOR_TOOLS.ONE_WAY && game.editor.lastDragPos) {
                const wallData = game.editor.lastDragPos;
                const newDirection = getMouseSideOfWall(game, pos.x, pos.y, wallData);
                let currentWall = (wallData.type === 'h') ? game.editorDoc.hWalls[wallData.y][wallData.x] : game.editorDoc.vWalls[wallData.y][wallData.x];
                if (currentWall && currentWall.type === WALL_TYPES.ONE_WAY && (currentWall.direction.dx !== newDirection.dx || currentWall.direction.dy !== newDirection.dy)) {
                    game.setOneWay(wallData, newDirection);
                }
            }
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
                if (!game.placeStair(x, y, direction)) { game.showToast('无效放置', 2000, 'error'); }
                game.editor.stairPlacement = null; game.drawEditor();
                game.editor.isDragging = false; game.editor.didDrag = false; return;
            }
            if (game.editor.isDragging && !game.editor.didDrag) {
                const pos = getMousePos(game, e);
                const cx = Math.floor(pos.x / game.cellSize); const cy = Math.floor(pos.y / game.cellSize);
                const wall = getWallAtPos(game, pos.x, pos.y);
                if (wall && game.isWallEditable(wall)) {
                    if (game.editor.tool === EDITOR_TOOLS.DOOR) {
                        game.toggleDoor(wall);
                    } else if (game.editor.tool === EDITOR_TOOLS.LOCK) {
                        const numStr = askForInput('请输入锁需要的钥匙数量:', '0');
                        if (numStr !== null) {
                            const keys = parseInt(numStr);
                            if (!isNaN(keys) && keys >= 0) { game.setLocked(wall, keys); }
                            else { game.showToast('请输入一个有效的非负整数。', 3000, 'error'); }
                        }
                    } else if (game.editor.tool === EDITOR_TOOLS.LETTER_DOOR) {
                        const wallRef = wall.type === 'h' ? game.editorDoc.hWalls[wall.y][wall.x] : game.editorDoc.vWalls[wall.y][wall.x];
                        if (wallRef.type === WALL_TYPES.LETTER_DOOR) { game.toggleLetterDoor(wall, 'A'); }
                        else {
                            const letter = askForInput('请输入一个字母:', 'A');
                            if (letter && /^[a-zA-Z]$/.test(letter)) { game.toggleLetterDoor(wall, letter); }
                            else if (letter !== null) { game.showToast('请输入单个英文字母。', 3000, 'error'); }
                        }
                    }
                }
                if (game.editor.tool === EDITOR_TOOLS.BUTTON) {
                    const hotspot = getButtonHotspotAtPos(game, pos.x, pos.y);
                    if (hotspot) {
                        const existingButtonIndex = game.editorDoc.buttons.findIndex(b => b.x === hotspot.x && b.y === hotspot.y && b.direction.dx === hotspot.direction.dx && b.direction.dy === hotspot.direction.dy);
                        if (existingButtonIndex > -1) { game.toggleButton(hotspot, 'A'); }
                        else {
                            const letter = askForInput('请输入一个字母:', 'A');
                            if (letter && /^[a-zA-Z]$/.test(letter)) { game.toggleButton(hotspot, letter); }
                            else if (letter !== null) { game.showToast('请输入单个英文字母。', 3000, 'error'); }
                        }
                    }
                }
                if (cx >= 0 && cx < game.editorDoc.width && cy >= 0 && cy < game.editorDoc.height && game.editorDoc.activeCells[cy][cx]) {
                    const allowed = game.editorDoc.mode === 'free' ? true : !game.isPosInStartRoom(cx, cy);
                    if (allowed) {
                        switch (game.editor.tool) {
                            case EDITOR_TOOLS.END: game.setEnd(cx, cy); break;
                            case EDITOR_TOOLS.START:
                                if (game.editorDoc.mode === 'free') { game.setStart(cx, cy); }
                                break;
                            case EDITOR_TOOLS.GHOST: game.toggleGhost(cx, cy); break;
                            case EDITOR_TOOLS.KEY: game.toggleKey(cx, cy); break;
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
            const doc = game.editorDoc;
            return Editor.getWallAtPos(mouseX, mouseY, game.cellSize, doc.width, doc.height, game.editor.tool);
        }

        export function getButtonHotspotAtPos(game, mouseX, mouseY) {
            const doc = game.editorDoc;
            return Pathfinding.getButtonHotspotAtPos(mouseX, mouseY, {
                cellSize: game.cellSize,
                width: doc.width,
                height: doc.height,
                activeCells: doc.activeCells,
                hWalls: doc.hWalls,
                vWalls: doc.vWalls,
                editorMode: doc.mode
            });
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
