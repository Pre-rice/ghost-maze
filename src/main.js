import { WALL_TYPES, GAME_STATES, EDITOR_TOOLS, START_ROOM_SIZE, getStartRoomY } from './core/constants.js';
import { DataSerializer } from './core/dataSerializer.js';
import { GameController } from './core/gameController.js';

// 导入新的模块化组件
import * as UI from './ui.js';
import * as Renderer from './view/renderer.js';
import { createGameView, createEditorView, computeGameView, pruneTrails } from './view/viewSlice.js';
import * as MazeGenerator from './core/mazeGenerator.js';
import * as InputHandler from './inputHandler.js';
import * as Editor from './editor/editor.js';
import * as LayerManager from './layerManager.js';
import * as Pathfinding from './core/pathfinding.js';
import * as ThemeManager from './themeManager.js';

// 监听DOM内容加载完成事件，确保在操作DOM之前所有元素都已准备好
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    
    // 初始化主题管理器
    ThemeManager.initThemeManager(() => {
        if (typeof game !== 'undefined' && game) {
            game.refreshTheme();
        }
    });

    /**
     * 游戏主类，封装了所有游戏逻辑、状态和UI交互
     */
    class GhostMazeGame {
        constructor() {
            // 缓存常用的DOM元素引用，提高性能
            this.healthDisplay = document.getElementById('player-health-display');
            this.keysDisplay = document.getElementById('player-keys-display');
            this.stepsDisplay = document.getElementById('player-steps-display');
            this.ghostProximityDisplay = document.getElementById('ghost-proximity-display');
            this.mapSizeInput = document.getElementById('map-size-input');
            this.editorMapSizeInput = document.getElementById('editor-map-size-input');
            this.toastElement = document.getElementById('toast-notification');
            this.confirmOverlay = document.getElementById('confirm-overlay');
            this.confirmMessage = document.getElementById('confirm-message');
            this.confirmYesBtn = document.getElementById('confirm-yes-btn');
            this.confirmNoBtn = document.getElementById('confirm-no-btn');

            this.clearMapConfirmOverlay = document.getElementById('clear-map-confirm-overlay');
            this.clearEntitiesBtn = document.getElementById('confirm-clear-entities-btn');
            this.resetGridsBtn = document.getElementById('confirm-reset-grids-btn');
            this.clearGridsBtn = document.getElementById('confirm-clear-grids-btn');
            this.clearCancelBtn = document.getElementById('confirm-clear-cancel-btn');
            
            // 用于管理定时器和动画帧的ID
            this.toastTimeout = null;
            this.animationFrameId = null;
            this.autoMoveInterval = null;
            this.dpadInterval = null;

            // 为静态背景层创建离屏Canvas，用于性能优化
            this.staticLayerCanvas = document.createElement('canvas');
            this.staticLayerCtx = this.staticLayerCanvas.getContext('2d');
            
            // 从CSS变量中获取颜色值，便于在Canvas绘图中统一风格
            this.updateColors();
            
            // 核心游戏状态
            this.state = GAME_STATES.MENU;
            this.gameMode = 'exploration';
            this.initialHealth = 5;
            this.initialStamina = 100;
            this.padding = 15;
            this.cellSize = 0;  // 无地图时无意义；startGame/enterEditorMode 按地图尺寸重算
            this.mapData = null;

            // 新增：视口偏移（用于居中非标准地图）
            this.drawOffset = { x: 0, y: 0 };

            // 编辑器工作字段（游戏态不再同步/读取——渲染/输入走 viewSlice 投影与 controller 权威源；
            // 这些字段仅编辑器方法读写，Step 6 编辑器投影化后删除）
            this.player = { x: 1, y: 1, hp: 5, stamina: 100, trail: [], keys: 0 , steps: 0};

            // 鬼和物品
            this.ghosts = [];
            this.ghostCount = 3;
            this.items = [];
            this.buttons = [];

            // 地图结构数据
            this.hWalls = [];
            this.vWalls = [];
            this.startPos = { x: 1, y: 1 };
            this.endPos = { x: 0, y: 0 };
            this.customStartPos = null; // 新增：自定义起点
            this.activeCells = []; // 新增：有效地图方格位图
            this.stairs = []; // 新增：楼梯数据 [{x, y, layer, direction: 'up'|'down'}]
            
            // 多层地图相关状态
            this.multiLayerMode = false; // 是否为多层地图模式
            this.layerCount = 1; // 当前图层数量
            this.currentLayer = 0; // 当前显示/编辑的图层（0-based索引，0是最底层）
            this.playerLayer = 0; // 玩家当前所在图层
            this.layers = []; // 存储所有图层数据的数组，每层包含 {hWalls, vWalls, activeCells, ghosts, items, buttons, stairs, endPos}
            
            // 视野系统
            this.seenCells = [];
            this.debugVision = false;

            // 编辑器状态
            this.editor = {
                active: false,
                mode: 'regular', // 'regular' or 'free'
                tool: EDITOR_TOOLS.WALL,
                isDragging: false,
                didDrag: false,
                dragAxis: null,
                lastDragPos: null,
                hoveredWall: null,
                hoveredButtonHotspot: null,
                gridDragAction: null, // 'add' or 'remove'
                stairPlacement: null, // 楼梯放置状态 {x, y, direction: 'up'|'down'}
                isRightClickErasing: false, // 右键橡皮擦状态
                rightClickMousePos: null, // 右键擦除时的鼠标位置
                previousToolBeforeRightClick: null // 右键擦除前的工具，用于松开右键后恢复
            };

            // 移动端虚拟方向键(D-pad)状态
            this.dpad = {
                element: document.getElementById('dpad-controls'),
                grip: document.getElementById('dpad-center'), // Fix 8: 中键替代grip
                isDragging: false,
                isResizing: false,
                startX: 0,
                startY: 0,
                initialLeft: 0,
                initialTop: 0,
                initialDist: 0,
                currentScale: 1
            };

            // 游戏控制器（纯逻辑数据流；UI 副作用经注入回调回到本类）
            this.controller = new GameController({
                onSync: () => {
                    this._renderStaticLayer();
                    this.draw();
                    this.updateUIDisplays();
                    this.updateLayerPanel();
                    this.updateHistoryButtons();
                },
                onWin: (stats) => {
                    this.stopAutoMove(); this.stopAnimationLoop(); this.state = GAME_STATES.WON;
                    this.draw();
                    document.getElementById('win-stats').textContent = stats.text;
                    document.getElementById('win-overlay').style.display = 'flex';
                },
                onDeath: (stats) => {
                    this.stopAutoMove(); this.stopAnimationLoop(); this.state = GAME_STATES.DEAD;
                    this.draw();
                    if (stats.overlay === 'game-over') {
                        document.getElementById('game-over-overlay').style.display = 'flex';
                    } else {
                        document.getElementById('death-message').textContent = stats.message;
                        document.getElementById('revive-btn').textContent = '复活';
                        document.getElementById('death-overlay').style.display = 'flex';
                    }
                },
                onHistoryChange: () => this.updateHistoryButtons()
            });

            // 绑定所有UI事件并显示初始欢迎信息
            this.bindUI();
            this.showInitialMessage();
            // 页面加载时尝试从 URL 查询参数或 hash 读取分享码
            this.loadShareCodeFromURL();
        }

        updateColors() {
            this.colors = ThemeManager.getColorsFromCSS();
        }

        refreshTheme() {
            this.updateColors();
            if (this.state === GAME_STATES.MENU) {
                this.showInitialMessage();
            } else {
                this._renderStaticLayer();
                this.draw();
            }
        }

        loadShareCodeFromURL() {
            const params = new URLSearchParams(window.location.search);
            let code = params.get("map");
            if (!code && window.location.hash) {
                code = window.location.hash.substring(1);
            }
            if (!code) return;
            this.showToast("检测到分享码，正在加载…", 2000);
            this.loadFromShareCode(code);
        }

        showInitialMessage() {
            Renderer.showInitialMessage(ctx, {
                canvasWidth: canvas.width,
                canvasHeight: canvas.height,
                padding: this.padding,
                colors: this.colors
            });
        }

        /**
         * 显示一个短暂的顶部通知 (Toast)
         */
        showToast(message, duration = 3000, type = 'info') {
            UI.showToast(this.toastElement, message, duration, type, this);
        }

        /**
         * 显示一个确认对话框
         */
        showConfirm(message, onConfirm) {
            UI.showConfirm(this.confirmOverlay, this.confirmMessage, this.confirmYesBtn, this.confirmNoBtn, message, onConfirm);
        }

        /**
         * 隐藏所有游戏状态浮窗
         */
        hideAllOverlays() {
            UI.hideAllOverlays();
        }

        /**
         * 重置当前地图到初始状态
         */
        resetCurrentMap() {
            if (!this.controller.mapData) {
                this.showToast("没有可重置的地图。请先生成一个新地图。", 3000, 'error');
                return;
            }
            this.startGame(this.controller.mapData);
        }

        bindUI() {
            document.getElementById('home-btn').addEventListener('click', () => { window.location.href = window.location.pathname; });
            // 编辑器模式的首页按钮
            document.getElementById('editor-home-btn').addEventListener('click', () => { window.location.href = window.location.pathname; });
            document.getElementById('generate-map-btn').addEventListener('click', () => this.generateNewRandomMap());
            document.getElementById('reset-map-btn').addEventListener('click', () => this.resetCurrentMap());
            document.getElementById('edit-map-btn').addEventListener('click', () => this.enterEditorMode());
            document.getElementById('copy-share-code-btn').addEventListener('click', () => this.copyShareCode());
            document.getElementById('editor-copy-share-code-btn').addEventListener('click', () => this.copyShareCode(true));
            document.getElementById('load-share-code-btn').addEventListener('click', () => this._loadCodeFromClipboard(false));
            document.getElementById('editor-load-share-code-btn').addEventListener('click', () => this._loadCodeFromClipboard(true));
            document.getElementById('debug-vision-toggle').addEventListener('change', (e) => {
                this.debugVision = e.target.checked;
                this.draw();
                if (this.state === GAME_STATES.PLAYING) { this.updateProximityWarning(); }
            });
            document.getElementById('mode-exploration-btn').addEventListener('click', () => this.setGameMode('exploration'));
            document.getElementById('mode-death-loop-btn').addEventListener('click', () => this.setGameMode('death-loop'));
            document.getElementById('editor-mode-exploration-btn').addEventListener('click', () => this.setGameMode('exploration', true));
            document.getElementById('editor-mode-death-loop-btn').addEventListener('click', () => this.setGameMode('death-loop', true));
            document.getElementById('revive-btn').addEventListener('click', () => this.revivePlayer());
            document.getElementById('game-over-replay-btn').addEventListener('click', () => this.resetCurrentMap());
            document.getElementById('game-over-new-map-btn').addEventListener('click', () => this.generateNewRandomMap());
            document.getElementById('win-replay-btn').addEventListener('click', () => this.resetCurrentMap());
            document.getElementById('win-new-map-btn').addEventListener('click', () => this.generateNewRandomMap());
            document.querySelectorAll('.tool-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // 获取按钮的id，找到tool-后面的部分
                    const toolName = e.currentTarget.id.split('-')[1];
                    this.setEditorTool(toolName);
                });
            });
            this.editorMapSizeInput.addEventListener('change', () => this.resizeAndClearEditor());
            document.getElementById('play-edited-map-btn').addEventListener('click', () => this.playEditedMap());
            document.getElementById('clear-map-btn').addEventListener('click', () => this.clearEditorMap());
            window.addEventListener('keydown', (e) => this.handleKeyPress(e));
            const touchWrapper = (handler) => (e) => { if (this.editor.active) { e.preventDefault(); handler(e.changedTouches[0]); } };
            canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
            canvas.addEventListener('mousedown', (e) => {
                // 在编辑器模式下，始终阻止默认行为（防止浏览器手势和选中文字等）
                if (this.editor.active) {
                    e.preventDefault();
                }
                this.handleCanvasMouseDown(e);
            });
            canvas.addEventListener('mousemove', (e) => {
                // 在编辑器模式下，如果正在右键拖动，阻止默认行为（防止浏览器手势）
                if (this.editor.active && (this.editor.isRightClickErasing || this.editor.isDragging)) {
                    e.preventDefault();
                }
                this.handleCanvasMouseMove(e);
            });
            canvas.addEventListener('mouseup', (e) => this.handleCanvasMouseUp(e));
            canvas.addEventListener('mouseleave', (e) => this.handleCanvasMouseLeave(e));
            // 右键相关事件处理（用于编辑器模式的橡皮擦功能）
            canvas.addEventListener('contextmenu', (e) => { if (this.editor.active) e.preventDefault(); });
            // 防止在编辑器模式下右键拖动时触发浏览器手势
            canvas.addEventListener('dragstart', (e) => { if (this.editor.active) e.preventDefault(); });
            // 防止浏览器默认的选中行为
            canvas.addEventListener('selectstart', (e) => { if (this.editor.active) e.preventDefault(); });
            canvas.addEventListener('touchstart', touchWrapper(this.handleCanvasMouseDown.bind(this)), { passive: false });
            canvas.addEventListener('touchmove', touchWrapper(this.handleCanvasMouseMove.bind(this)), { passive: false });
            canvas.addEventListener('touchend', touchWrapper(this.handleCanvasMouseUp.bind(this)), { passive: false });
            canvas.addEventListener('touchcancel', touchWrapper(this.handleCanvasMouseUp.bind(this)), { passive: false });
            this.bindDpadControls();
            document.getElementById('dpad-toggle').addEventListener('change', (e) => { this.updateDpadVisibility(); });
            this.initializeDpadTouchControls();
            document.getElementById('undo-btn').addEventListener('click', () => this.handleUndo());
            document.getElementById('save-btn').addEventListener('click', () => this.handleSave());
            document.getElementById('rewind-btn').addEventListener('click', () => this.handleRewind());
            document.getElementById('edit-type-regular-btn').addEventListener('click', () => this.attemptSetEditorMode('regular'));
            document.getElementById('edit-type-free-btn').addEventListener('click', () => this.attemptSetEditorMode('free'));
            document.getElementById('layer-mode-single-btn').addEventListener('click', () => this.setLayerMode(false));
            document.getElementById('layer-mode-multi-btn').addEventListener('click', () => this.setLayerMode(true));
            document.getElementById('layer-add-btn').addEventListener('click', () => this.addLayer());
            document.getElementById('layer-remove-btn').addEventListener('click', () => this.removeLayer());
        }

        initializeDpadTouchControls() {
            UI.initializeDpadTouchControls(this.dpad);
        }

        setGameMode(newMode, fromEditor = false) {
            if (this.gameMode === newMode && !fromEditor) return;
            this.gameMode = newMode;
            this.controller.gameMode = newMode;
            const isExploration = newMode === 'exploration';
            document.getElementById('mode-exploration-btn').classList.toggle('active', isExploration);
            document.getElementById('mode-death-loop-btn').classList.toggle('active', !isExploration);
            document.getElementById('editor-mode-exploration-btn').classList.toggle('active', isExploration);
            document.getElementById('editor-mode-death-loop-btn').classList.toggle('active', !isExploration);
            document.getElementById('status-bar-exploration').style.display = isExploration ? 'flex' : 'none';
            document.getElementById('status-bar-death-loop').style.display = isExploration ? 'none' : 'flex';
            document.getElementById('initial-health-container').style.display = isExploration ? 'flex' : 'none';
            document.getElementById('initial-stamina-container').style.display = isExploration ? 'none' : 'flex';
            if (this.state !== GAME_STATES.MENU && this.state !== GAME_STATES.EDITOR) {
                this.resetCurrentMap();
            }
            this.updateUIDisplays();
        }

        updateDpadVisibility() {
            UI.updateDpadVisibility(this.editor.active);
        }

        bindDpadControls() {
            InputHandler.bindDpadControls(this);
        }

        startAnimationLoop() {
            if (this.animationFrameId) return;
            const loop = () => {
                const now = Date.now();
                // 轨迹修剪在权威源上（Phase 4 投影化；原镜像只剪副本，玩家轨迹陈旧泄漏）
                pruneTrails(this.controller.currentGameState, this.controller.viewLayer, now);
                if (this.state === GAME_STATES.PLAYING) {
                    this.draw();
                    this.animationFrameId = requestAnimationFrame(loop);
                } else {
                    this.stopAnimationLoop();
                }
            };
            this.animationFrameId = requestAnimationFrame(loop);
        }

        stopAnimationLoop() {
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
        }

        startGame(mapData) {
            this.stopAnimationLoop();
            this.state = GAME_STATES.PLAYING;
            this.padding = 15;
            this.cellSize = (canvas.width - 2 * this.padding) / mapData.width;
            // 数据流在控制器（onSync 回调触发渲染，cellSize 需先就绪）
            this.controller.startGame(mapData);
            this.calculateDrawOffset();
            this.hideAllOverlays();
            this.startAnimationLoop();
            setTimeout(() => {
                const result = this.generateShareCode();
                if (result.success) {
                    this.updateURLWithShareCode(result.code);
                }
            }, 0);
        }

        processAction(action) {
            if ((this.state !== GAME_STATES.PLAYING && this.state !== GAME_STATES.DEAD) || !this.controller.currentGameState) return;
            // 数据流与胜负回调在控制器（onSync 触发渲染）；渲染顺序保持：推进 → 渲染 → 胜负分发
            this.controller.processAction(action);
        }

        calculateDrawOffset() {
            if (this.state === GAME_STATES.EDITOR) { this.drawOffset = { x: 0, y: 0 }; return; }
            const md = this.controller.mapDefinition;
            if (!md) { this.drawOffset = { x: 0, y: 0 }; return; }
            let minX = md.width, maxX = 0, minY = md.height, maxY = 0;
            let hasActive = false;
            for (const layerData of md.layers) {
                if (!layerData || !layerData.activeCells) continue;
                for (let y = 0; y < md.height; y++) {
                    for (let x = 0; x < md.width; x++) {
                        if (layerData.activeCells[y] && layerData.activeCells[y][x]) {
                            hasActive = true;
                            minX = Math.min(minX, x); maxX = Math.max(maxX, x);
                            minY = Math.min(minY, y); maxY = Math.max(maxY, y);
                        }
                    }
                }
            }
            if (!hasActive) { this.drawOffset = { x: 0, y: 0 }; return; }
            const activeW = (maxX - minX + 1) * this.cellSize;
            const activeH = (maxY - minY + 1) * this.cellSize;
            const offsetX = (canvas.width - activeW) / 2 - (minX * this.cellSize);
            const offsetY = (canvas.height - activeH) / 2 - (minY * this.cellSize);
            this.drawOffset = { x: offsetX, y: offsetY };
        }

        generateNewRandomMap() {
            const size = parseInt(this.mapSizeInput.value);
            if (size < 8 || size > 20) {
                this.showToast('地图大小必须在 8 到 20 之间。', 3000, 'error');
                return;
            }
            // 随机地图总是使用默认的生命和体力值
            this.controller.initialHealth = 5;
            this.controller.initialStamina = 100;
            // 使用 MazeGenerator 模块生成完整地图
            const mapData = MazeGenerator.generateFullMaze(size, size, this.ghostCount);
            this.startGame(mapData);
        }

        handleKeyPress(e) { InputHandler.handleKeyPress(this, e); }
        handleEditorKeyPress(e) { InputHandler.handleEditorKeyPress(this, e); }


        useStair() { if (this.controller.mapDefinition?.multiLayerMode) { this.processAction({ type: 'USE_STAIR' }); } }
        movePlayer(dx, dy) { if (this.state === GAME_STATES.PLAYING) { this.processAction({ type: 'MOVE', payload: { dx, dy } }); } }
        pressButton(letter) { this.processAction({ type: 'PRESS_BUTTON', payload: { letter } }); }

        updateUIDisplays() {
            const state = this.controller.currentGameState;
            UI.updateUIDisplays({
                gameMode: this.gameMode,
                player: state?.player,
                loopCount: state?.loopCount ?? 0,
                healthDisplay: this.healthDisplay,
                keysDisplay: this.keysDisplay,
                stepsDisplay: this.stepsDisplay
            });
            this.updateProximityWarning();
        }

        updateProximityWarning() {
            const state = this.controller.currentGameState;
            // 编辑器模式无实时鬼/视野数据，直接跳过（seenCells 可能为空或旧尺寸，访问会越界崩溃）
            if (this.state === GAME_STATES.EDITOR || !state) return;
            // 多层下视图层可能 ≠ 玩家层：警告统计必须针对玩家所在层的数据（鬼、视野），而非当前视图层
            const layerIndex = state.player.layer;
            const layerState = state.layerStates[layerIndex];
            const seen = state.seenCells[layerIndex];
            if (!layerState || !seen || !seen.length) return;
            UI.updateProximityWarning({
                gameMode: this.gameMode,
                ghosts: layerState.ghosts,
                player: state.player,
                seenCells: seen,
                debugVision: this.debugVision,
                ghostProximityDisplay: this.ghostProximityDisplay
            });
        }

        revivePlayer() {
            this.processAction({ type: 'REVIVE' });
            this.state = GAME_STATES.PLAYING;
            this.hideAllOverlays();
            this.startAnimationLoop();
        }
        // 胜负展示（handleWin/handlePlayerDeath）已迁入构造函数的注入回调（onWin/onDeath）

_renderStaticLayer() {
    // 编辑器态读镜像（Step 6 换 computeEditorView）；游戏态走权威源投影
    Renderer.renderStaticLayer(canvas, this.staticLayerCanvas, this.editor.active ? createGameView(this) : this.getGameView());
}

/** 游戏态只读投影（权威源 = controller.mapDefinition + currentGameState + viewLayer） */
getGameView() {
    return computeGameView({
        mapDef: this.controller.mapDefinition,
        gameState: this.controller.currentGameState,
        viewLayer: this.controller.viewLayer
    }, this._renderParams());
}

/** 宿主渲染参数（非数据源，供投影注入） */
_renderParams() {
    return {
        canvas,
        staticLayerCanvas: this.staticLayerCanvas,
        state: this.state,
        cellSize: this.cellSize,
        colors: this.colors,
        drawOffset: this.drawOffset,
        debugVision: this.debugVision
    };
}

draw() {
    if (this.state === GAME_STATES.MENU) return;
    if (this.editor.active) { this.drawEditor(); return; }
    Renderer.drawGame(ctx, this.getGameView());
}

drawEditor() {
    Renderer.drawEditor(ctx, createEditorView(this));
}


        enterEditorMode() {
            this.stopAnimationLoop();
            if (!this.mapData) {
                this.width = 10; this.height = 10; this.editor.mode = 'regular'; this.multiLayerMode = false;
                this.layerCount = 1; this.currentLayer = 0; this.stairs = [];
                this.createBlankEditorMap();
                this.mapData = {
                    width: this.width, height: this.height, hWalls: JSON.parse(JSON.stringify(this.hWalls)), vWalls: JSON.parse(JSON.stringify(this.vWalls)),
                    endPos: null, initialGhosts: [], items: [], activeCells: this.activeCells, editorMode: 'regular',
                    multiLayerMode: false, layerCount: 1, layers: [], stairs: []
                };
            }
            this.state = GAME_STATES.EDITOR; this.editor.active = true; this.setEditorTool(EDITOR_TOOLS.WALL);
            document.getElementById('game-controls').style.display = 'none';
            document.getElementById('editor-controls').style.display = 'block';
            this.width = this.mapData.width; this.height = this.mapData.height;
            this.startPos = { x: 1, y: this.height - 2 };
            this.customStartPos = this.mapData.customStartPos || null;
            if (this.mapData.multiLayerMode && this.mapData.layers) {
                this.customStartPos = null;
                for (let i = 0; i < this.mapData.layers.length; i++) {
                    if (this.mapData.layers[i] && this.mapData.layers[i].customStartPos) { this.customStartPos = this.mapData.layers[i].customStartPos; break; }
                }
            }
            this.activeCells = this.mapData.activeCells || Array(this.height).fill(null).map(() => Array(this.width).fill(true));
            this.editor.mode = this.mapData.editorMode || 'regular';
            this.multiLayerMode = this.mapData.multiLayerMode || false;
            this.layerCount = this.mapData.layerCount || 1;
            this.currentLayer = 0;
            // 编辑器无视野概念，重置 seenCells，避免旧尺寸残留导致后续访问越界
            this.seenCells = [];
            this.stairs = JSON.parse(JSON.stringify(this.mapData.stairs || []));
            this.layers = JSON.parse(JSON.stringify(this.mapData.layers || []));
            if (this.multiLayerMode && this.layers.length > 0) {
                let startLayerIndex = typeof this.mapData.playerStartLayer === 'number' && this.mapData.playerStartLayer < this.layerCount ? this.mapData.playerStartLayer : 0;
                if (startLayerIndex === 0) {
                    for (let i = 0; i < this.layers.length; i++) { if (this.layers[i] && this.layers[i].customStartPos) { startLayerIndex = i; break; } }
                }
                this.currentLayer = startLayerIndex; this.playerLayer = startLayerIndex;
                const layerData = this.layers[this.currentLayer];
                if (layerData) {
                    this.hWalls = layerData.hWalls; this.vWalls = layerData.vWalls; this.endPos = layerData.endPos;
                    this.ghosts = layerData.ghosts; this.items = layerData.items; this.buttons = layerData.buttons;
                    this.activeCells = layerData.activeCells; this.customStartPos = layerData.customStartPos;
                }
            } else {
                this.hWalls = JSON.parse(JSON.stringify(this.mapData.hWalls)); this.vWalls = JSON.parse(JSON.stringify(this.mapData.vWalls));
                this.endPos = this.mapData.endPos ? { ...this.mapData.endPos } : null;
                this.ghosts = JSON.parse(JSON.stringify(this.mapData.initialGhosts || []));
                this.items = JSON.parse(JSON.stringify(this.mapData.items || []));
                this.buttons = JSON.parse(JSON.stringify(this.mapData.buttons || []));
            }
            this.editorMapSizeInput.value = this.width; this.padding = 15;
            this.cellSize = (canvas.width - 2 * this.padding) / this.width;
            this.updateEditorUIForMode(); this.updateLayerModeUI(); this.updateLayerPanel();
            this._renderStaticLayer(); this.drawEditor(); this.updateDpadVisibility();
        }

        updateLayerModeUI() {
            document.getElementById('layer-mode-single-btn').classList.toggle('active', !this.multiLayerMode);
            document.getElementById('layer-mode-multi-btn').classList.toggle('active', this.multiLayerMode);
        }

        attemptSetEditorMode(mode) {
            if (this.editor.mode === mode) return;
            this.showConfirm(`切换编辑模式将清空当前地图，确定吗？`, () => {
                this.editor.mode = mode;
                if (mode === 'free') { this.resetGridsAndClearEntities(); }
                else { this.createBlankEditorMap(); this._renderStaticLayer(); this.drawEditor(); }
                this.updateEditorUIForMode();
            });
        }

        updateEditorUIForMode() {
            const isRegular = this.editor.mode === 'regular';
            document.getElementById('edit-type-regular-btn').classList.toggle('active', isRegular);
            document.getElementById('edit-type-free-btn').classList.toggle('active', !isRegular);
            document.getElementById('tool-start').style.display = isRegular ? 'none' : 'block';
            document.getElementById('tool-grid').style.display = isRegular ? 'none' : 'block';
            document.getElementById('layer-mode-container').style.display = isRegular ? 'none' : 'block';
            if (isRegular && this.multiLayerMode) {
                this.multiLayerMode = false; this.layerCount = 1; this.currentLayer = 0;
                this.updateLayerPanel();
            }
            if (isRegular && [EDITOR_TOOLS.GRID, EDITOR_TOOLS.START, EDITOR_TOOLS.STAIR].includes(this.editor.tool)) {
                this.setEditorTool(EDITOR_TOOLS.WALL);
            }
            this.updateStairToolVisibility();
        }

        updateStairToolVisibility() {
            const stairBtn = document.getElementById('tool-stair');
            const shouldShow = this.editor.mode === 'free' && this.multiLayerMode;
            stairBtn.style.display = shouldShow ? 'block' : 'none';
            if (!shouldShow && this.editor.tool === EDITOR_TOOLS.STAIR) { this.setEditorTool(EDITOR_TOOLS.WALL); }
        }

        setLayerMode(isMultiLayer) {
            if (this.multiLayerMode === isMultiLayer) return;
            if (!isMultiLayer && this.layerCount > 1) {
                this.showConfirm('地图只会保留第一层的内容，确定吗？', () => { this._applyLayerMode(false); });
            } else { this._applyLayerMode(isMultiLayer); }
        }

        _applyLayerMode(isMultiLayer) {
            this.multiLayerMode = isMultiLayer;
            document.getElementById('layer-mode-single-btn').classList.toggle('active', !isMultiLayer);
            document.getElementById('layer-mode-multi-btn').classList.toggle('active', isMultiLayer);
            if (isMultiLayer) {
                this.layerCount = 1; this.currentLayer = 0; this.playerLayer = 0; this.stairs = [];
                this.layers = [{
                    hWalls: this.hWalls, vWalls: this.vWalls, activeCells: this.activeCells, ghosts: this.ghosts,
                    items: this.items, buttons: this.buttons, stairs: [], endPos: this.endPos, customStartPos: this.customStartPos
                }];
            } else {
                if (this.layers.length > 0) {
                    const firstLayer = this.layers[0];
                    this.hWalls = firstLayer.hWalls; this.vWalls = firstLayer.vWalls; this.activeCells = firstLayer.activeCells;
                    this.ghosts = firstLayer.ghosts; this.items = firstLayer.items; this.buttons = firstLayer.buttons;
                    this.endPos = firstLayer.endPos; this.customStartPos = firstLayer.customStartPos;
                }
                this.layerCount = 1; this.currentLayer = 0; this.playerLayer = 0; this.stairs = []; this.layers = [];
            }
            this.updateLayerPanel(); this.updateStairToolVisibility();
            this._renderStaticLayer(); this.drawEditor();
        }

        addLayer() {
            if (this.layerCount >= 10) { this.showToast('最多只能添加10层地图！', 3000, 'error'); return; }
            const newLayer = LayerManager.createNewLayer(this.width, this.height);
            this.layers.push(newLayer); this.layerCount++;
            this.updateLayerPanel(); this.showToast(`已添加第 ${this.layerCount} 层`, 2000, 'success');
        }

        removeLayer() {
            if (this.layerCount <= 1) { this.showToast('初始的1层不可删除！', 3000, 'error'); return; }
            this.showConfirm(`确定要删除第 ${this.layerCount} 层吗？`, () => {
                // 保存当前层数据
                this._saveCurrentLayerData();
                
                this.layers.pop(); this.layerCount--;
                const removedLayerIndex = this.layerCount;
                LayerManager.cleanupStairsOnLayerRemove(this.layers, removedLayerIndex);
                
                // 清理全局楼梯数组中指向被删除层的楼梯
                this.stairs = this.stairs.filter(s => s.layer < this.layerCount);
                // 清理指向被删除层的成对楼梯
                this.stairs = this.stairs.filter(s => {
                    const targetLayer = s.direction === 'up' ? s.layer + 1 : s.layer - 1;
                    return targetLayer >= 0 && targetLayer < this.layerCount;
                });
                
                // 如果当前视图在被删除的顶层，强制切换到新的顶层
                if (this.currentLayer >= this.layerCount) {
                    this.currentLayer = this.layerCount - 1;
                    this._switchToLayer(this.currentLayer);
                    this._renderStaticLayer();
                    this.drawEditor();
                }
                this.updateLayerPanel(); this.showToast(`已删除第 ${this.layerCount + 1} 层`, 2000, 'success');
            });
        }

        switchToLayer(layerIndex) {
            if (layerIndex === this.currentLayer || layerIndex < 0 || layerIndex >= this.layerCount) return;
            if (this.state === GAME_STATES.EDITOR) {
                this._saveCurrentLayerData(); this._switchToLayer(layerIndex);
                this._renderStaticLayer(); this.drawEditor();
            } else if ([GAME_STATES.PLAYING, GAME_STATES.DEAD, GAME_STATES.WON].includes(this.state)) {
                // 视图层切换（权威源为 controller.viewLayer；渲染/输入经投影读对应层数据）
                this.controller.viewLayer = layerIndex;
                this._renderStaticLayer(); this.draw();
            }
            this.updateLayerPanel();
        }

        _saveCurrentLayerData() {
            if (!this.multiLayerMode || this.layers.length === 0) return;
            this.layers[this.currentLayer] = {
                hWalls: this.hWalls, vWalls: this.vWalls, activeCells: this.activeCells, ghosts: this.ghosts,
                items: this.items, buttons: this.buttons, stairs: this.stairs.filter(s => s.layer === this.currentLayer),
                endPos: this.endPos, customStartPos: this.customStartPos
            };
        }

        _switchToLayer(layerIndex) {
            this.currentLayer = layerIndex;
            if (this.layers[layerIndex]) {
                const layer = this.layers[layerIndex];
                this.hWalls = layer.hWalls; this.vWalls = layer.vWalls; this.activeCells = layer.activeCells;
                this.ghosts = layer.ghosts; this.items = layer.items; this.buttons = layer.buttons;
                this.endPos = layer.endPos; this.customStartPos = layer.customStartPos;
            }
        }

        updateLayerPanel() {
            // 检查是否有起点设置
            let hasStartPoint = false;
            let multiLayerMode, layerCount, currentLayer, playerLayer;
            if (this.editor.active) {
                // 编辑器模式：读编辑器工作字段（Step 5 后改读 editorDoc）
                multiLayerMode = this.multiLayerMode;
                layerCount = this.layerCount;
                currentLayer = this.currentLayer;
                playerLayer = this.playerLayer;
                if (this.editor.mode === 'regular') {
                    hasStartPoint = true; // 常规模式总是有起点
                } else {
                    // 自由模式下检查所有层是否有 customStartPos
                    if (this.multiLayerMode) {
                        for (let i = 0; i < this.layerCount; i++) {
                            if (this.layers[i] && this.layers[i].customStartPos) {
                                hasStartPoint = true;
                                break;
                            }
                        }
                        // 也检查当前编辑层的 customStartPos
                        if (!hasStartPoint && this.customStartPos) {
                            hasStartPoint = true;
                        }
                    } else {
                        hasStartPoint = !!this.customStartPos;
                    }
                }
            } else {
                // 游戏模式：读 controller 权威源（起点恒有）
                hasStartPoint = true;
                const md = this.controller.mapDefinition;
                multiLayerMode = md?.multiLayerMode || false;
                layerCount = md?.layerCount || 1;
                currentLayer = this.controller.viewLayer;
                playerLayer = this.controller.currentGameState?.player?.layer ?? 0;
            }

            LayerManager.updateLayerPanelUI({
                multiLayerMode, layerCount, currentLayer, playerLayer,
                editorActive: this.editor.active,
                hasStartPoint,
                onLayerClick: (i) => this.switchToLayer(i)
            });
        }

        createBlankEditorMap() {
            this.padding = 15; this.cellSize = (canvas.width - 2 * this.padding) / this.width;
            const wall = () => ({ type: WALL_TYPES.SOLID, keys: 0 });
            const empty = () => ({ type: WALL_TYPES.EMPTY, keys: 0 });
            const door = () => ({ type: WALL_TYPES.DOOR, keys: 0 });
            this.hWalls = Array(this.height + 1).fill(null).map(() => Array(this.width).fill(null).map(empty));
            this.vWalls = Array(this.height).fill(null).map(() => Array(this.width + 1).fill(null).map(empty));
            this.customStartPos = null;
            this.activeCells = Array(this.height).fill(null).map(() => Array(this.width).fill(true));
            if (this.editor.mode === 'regular') {
                for (let x = 0; x < this.width; x++) { this.hWalls[0][x] = wall(); this.hWalls[this.height][x] = wall(); }
                for (let y = 0; y < this.height; y++) { this.vWalls[y][0] = wall(); this.vWalls[y][this.width] = wall(); }
                const roomY = getStartRoomY(this.height);
                for (let x = 0; x < 3; x++) this.hWalls[roomY + 3][x] = wall();
                for (let y = roomY; y < roomY + 3; y++) this.vWalls[y][0] = wall();
                this.hWalls[roomY][0] = wall(); this.hWalls[roomY][2] = wall();
                this.vWalls[roomY][3] = wall(); this.vWalls[roomY + 2][3] = wall();
                this.hWalls[roomY][1] = door(); this.vWalls[roomY + 1][3] = door();
            }
            this.startPos = { x: 1, y: this.height - 2 };
            this.endPos = null; this.ghosts = []; this.items = []; this.buttons = []; this.stairs = [];
            if (this.multiLayerMode) {
                this.layers = [{
                    hWalls: this.hWalls, vWalls: this.vWalls, activeCells: this.activeCells, ghosts: [], items: [],
                    buttons: [], stairs: [], endPos: null, customStartPos: null
                }];
                this.layerCount = 1; this.currentLayer = 0;
            }
        }

        resizeAndClearEditor() {
            const size = parseInt(this.editorMapSizeInput.value);
            if (size < 8 || size > 20) {
                this.showToast('地图大小必须在 8 到 20 之间。', 3000, 'error');
                this.editorMapSizeInput.value = this.width; return;
            }
            const savedLayerCount = this.multiLayerMode ? this.layerCount : 1;
            const wasMultiLayer = this.multiLayerMode;
            this.width = size; this.height = size;
            this.createBlankEditorMap();
            if (wasMultiLayer && savedLayerCount > 1) {
                this.multiLayerMode = true; this.layerCount = savedLayerCount; this.currentLayer = 0;
                this.playerLayer = 0; this.stairs = []; this.layers = [];
                for (let i = 0; i < savedLayerCount; i++) {
                    this.layers.push({
                        hWalls: Editor.createEmptyWalls('h', size, size), vWalls: Editor.createEmptyWalls('v', size, size),
                        activeCells: Array(size).fill(null).map(() => Array(size).fill(true)),
                        ghosts: [], items: [], buttons: [], stairs: [], endPos: null, customStartPos: null
                    });
                }
                const firstLayer = this.layers[0];
                this.hWalls = firstLayer.hWalls; this.vWalls = firstLayer.vWalls; this.activeCells = firstLayer.activeCells;
                this.ghosts = firstLayer.ghosts; this.items = firstLayer.items; this.buttons = firstLayer.buttons;
                this.updateLayerPanel();
            }
            this._renderStaticLayer(); this.drawEditor();
        }

        playEditedMap() {
            if (this.multiLayerMode) { this._saveCurrentLayerData(); }
            if (this.editor.mode === 'free') {
                let hasStartPoint = false, startLayer = 0;
                if (this.multiLayerMode) {
                    for (let i = 0; i < this.layerCount; i++) {
                        if (this.layers[i] && this.layers[i].customStartPos) { hasStartPoint = true; startLayer = i; break; }
                    }
                } else { hasStartPoint = !!this.customStartPos; }
                if (!hasStartPoint) { this.showToast('自由模式必须设置起点！', 3000, 'error'); return; }
                this.playerLayer = startLayer;
            }
            this.editor.active = false;
            document.getElementById('game-controls').style.display = 'block';
            document.getElementById('editor-controls').style.display = 'none';
            this.initialHealth = parseInt(document.getElementById('editor-initial-health').value) || 5;
            this.initialStamina = parseInt(document.getElementById('editor-initial-stamina').value) || 100;
            if (this.multiLayerMode) { this._saveCurrentLayerData(); }
            const editedMapData = {
                width: this.width, height: this.height, hWalls: this.hWalls, vWalls: this.vWalls, endPos: this.endPos,
                initialGhosts: this.ghosts.map((g, i) => ({ x: g.x, y: g.y, id: i })), items: this.items, buttons: this.buttons,
                activeCells: this.activeCells, editorMode: this.editor.mode, customStartPos: this.customStartPos,
                multiLayerMode: this.multiLayerMode, layerCount: this.layerCount,
                layers: JSON.parse(JSON.stringify(this.layers)), stairs: JSON.parse(JSON.stringify(this.stairs))
            };
            this.startGame(editedMapData);
            this.updateDpadVisibility();
        }

        updateURLWithShareCode(code) {
            if (!code) return;
            const url = new URL(window.location.href);
            url.searchParams.set('map', code); url.hash = '';
            window.history.replaceState({}, "", url.toString());
        }

        clearEntitiesOnly() {
            const empty = () => ({ type: WALL_TYPES.EMPTY, keys: 0 });
            this.hWalls = Array(this.height + 1).fill(null).map(() => Array(this.width).fill(null).map(empty));
            this.vWalls = Array(this.height).fill(null).map(() => Array(this.width + 1).fill(null).map(empty));
            this.endPos = null; this.customStartPos = null; this.ghosts = []; this.items = []; this.buttons = [];
            
            // 清空当前层的楼梯，同时清除成对的楼梯
            const currentLayerStairs = this.stairs.filter(s => s.layer === this.currentLayer);
            currentLayerStairs.forEach(stair => {
                const pairedLayer = stair.direction === 'up' ? stair.layer + 1 : stair.layer - 1;
                const pairedDirection = stair.direction === 'up' ? 'down' : 'up';
                // 移除成对的楼梯
                this.stairs = this.stairs.filter(s => 
                    !(s.x === stair.x && s.y === stair.y && s.layer === pairedLayer && s.direction === pairedDirection)
                );
            });
            // 移除当前层的所有楼梯
            this.stairs = this.stairs.filter(s => s.layer !== this.currentLayer);
            
            // 更新层面板（起点被删除后不应显示黄色边框）
            this.updateLayerPanel();
            this.drawEditor();
        }

        clearAllGridsAndEntities() {
            this.activeCells = Array(this.height).fill(null).map(() => Array(this.width).fill(false));
            this.clearEntitiesOnly(); this._renderStaticLayer(); this.drawEditor();
        }

        resetGridsAndClearEntities() {
            this.activeCells = Array(this.height).fill(null).map(() => Array(this.width).fill(true));
            this.clearEntitiesOnly(); this._renderStaticLayer(); this.drawEditor();
        }

        showClearMapConfirm() {
            this.clearMapConfirmOverlay.style.display = 'flex';
            const hide = () => {
                this.clearMapConfirmOverlay.style.display = 'none';
                this.clearEntitiesBtn.onclick = null; this.resetGridsBtn.onclick = null;
                this.clearGridsBtn.onclick = null; this.clearCancelBtn.onclick = null;
            };
            this.clearEntitiesBtn.onclick = () => { hide(); this.clearEntitiesOnly(); };
            this.resetGridsBtn.onclick = () => { hide(); this.resetGridsAndClearEntities(); };
            this.clearGridsBtn.onclick = () => { hide(); this.clearAllGridsAndEntities(); };
            this.clearCancelBtn.onclick = hide;
        }

        clearEditorMap() {
            if (this.editor.mode === 'free') { this.showClearMapConfirm(); }
            else { this.showConfirm('你确定要清空所有墙壁、实体和物品吗？', () => { this.createBlankEditorMap(); this.drawEditor(); }); }
        }

        setEditorTool(tool) {
            this.editor.tool = tool;
            document.querySelectorAll('.tool-btn').forEach(btn => { btn.classList.toggle('active', btn.id === `tool-${tool}`); });
            this.editor.hoveredWall = null; this.drawEditor();
        }

        drawEditor() {
            Renderer.drawEditor(ctx, createEditorView(this));
        }



        isPosInStartRoom(cellX, cellY) {
            if (this.editor.mode === 'regular') {
                return Editor.isPosInStartRoom(cellX, cellY, this.height);
            }
            return false;
        }

        isWallEditable(wall) {
            return Editor.isWallEditable(wall, this.editor.mode, this.width, this.height, this.activeCells);
        }

        isCellOccupiedInEditor(x, y) {
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

        eraseAtPos(pos) {
            const wall = InputHandler.getWallAtPos(this, pos.x, pos.y);
            if (wall && this.isWallEditable(wall)) {
                // 先清除该墙上的按钮（requirement 8：按钮必须依附在墙上）
                this.eraseButtonsOnWall(wall);
                if (wall.type === 'h') this.hWalls[wall.y][wall.x] = { type: WALL_TYPES.EMPTY, keys: 0 };
                else this.vWalls[wall.y][wall.x] = { type: WALL_TYPES.EMPTY, keys: 0 };
            }
            const cellX = Math.floor(pos.x / this.cellSize); const cellY = Math.floor(pos.y / this.cellSize);
            if (this.editor.mode === 'free' || !this.isPosInStartRoom(cellX, cellY)) {
                if (this.endPos && this.endPos.x === cellX && this.endPos.y === cellY) { this.endPos = null; }
                if (this.customStartPos && this.customStartPos.x === cellX && this.customStartPos.y === cellY) { this.customStartPos = null; }
                this.ghosts = this.ghosts.filter(g => g.x !== cellX || g.y !== cellY);
                this.items = this.items.filter(i => i.x !== cellX || i.y !== cellY);
                // 擦除按钮（requirement 5）
                this.buttons = this.buttons.filter(b => b.x !== cellX || b.y !== cellY);
                this.eraseStairAt(cellX, cellY, this.currentLayer);
            }
            this.drawEditor();
        }

        // 清除依附在指定墙上的按钮（requirement 8）
        eraseButtonsOnWall(wall) {
            if (wall.type === 'h') {
                // 横墙：上方的格子按钮方向为 dy=1，下方的格子按钮方向为 dy=-1
                this.buttons = this.buttons.filter(b => {
                    // 上方格子（y = wall.y - 1）的下边按钮
                    if (b.x === wall.x && b.y === wall.y - 1 && b.direction.dy === 1) return false;
                    // 下方格子（y = wall.y）的上边按钮
                    if (b.x === wall.x && b.y === wall.y && b.direction.dy === -1) return false;
                    return true;
                });
            } else {
                // 竖墙：左方的格子按钮方向为 dx=1，右方的格子按钮方向为 dx=-1
                this.buttons = this.buttons.filter(b => {
                    // 左方格子（x = wall.x - 1）的右边按钮
                    if (b.x === wall.x - 1 && b.y === wall.y && b.direction.dx === 1) return false;
                    // 右方格子（x = wall.x）的左边按钮
                    if (b.x === wall.x && b.y === wall.y && b.direction.dx === -1) return false;
                    return true;
                });
            }
        }

        eraseStairAt(x, y, layer) {
            const stair = this.stairs.find(s => s.x === x && s.y === y && s.layer === layer);
            if (!stair) return;
            const pairedLayer = stair.direction === 'up' ? layer + 1 : layer - 1;
            const pairedDirection = stair.direction === 'up' ? 'down' : 'up';
            this.stairs = this.stairs.filter(s => !(s.x === x && s.y === y && (s.layer === layer || (s.layer === pairedLayer && s.direction === pairedDirection))));
        }

        handleCanvasClick(e) { InputHandler.handleCanvasClick(this, e); }
        handleCanvasMouseDown(e) { InputHandler.handleCanvasMouseDown(this, e); }
        handleCanvasMouseMove(e) { InputHandler.handleCanvasMouseMove(this, e); }
        handleCanvasMouseUp(e) { InputHandler.handleCanvasMouseUp(this, e); }
        handleCanvasMouseLeave(e) { InputHandler.handleCanvasMouseLeave(this, e); }
        stopAutoMove() {
            if (this.autoMoveInterval) { clearInterval(this.autoMoveInterval); this.autoMoveInterval = null; }
            if (this.dpadInterval) { clearInterval(this.dpadInterval); }
        }

        async _loadCodeFromClipboard(isEditor = false) {
            try {
                const code = await navigator.clipboard.readText();
                if (code) { this.loadFromShareCode(code, isEditor); }
                else { this.showToast('剪贴板为空。', 3000, 'error'); }
            } catch (err) {
                console.error('无法读取剪贴板内容: ', err);
                this.showToast('无法读取剪贴板。请检查浏览器权限。', 3000, 'error');
            }
        }

        generateShareCode(isEditor = false) {
            let sourceData;
            if (isEditor) {
                if (this.multiLayerMode) { this._saveCurrentLayerData(); }
                let layer0Data = {
                    hWalls: this.hWalls, vWalls: this.vWalls, endPos: this.endPos, ghosts: this.ghosts, items: this.items,
                    buttons: this.buttons || [], activeCells: this.activeCells, customStartPos: this.customStartPos
                };
                if (this.multiLayerMode && this.layers && this.layers[0]) { layer0Data = this.layers[0]; }
                sourceData = {
                    width: this.width, height: this.height, hWalls: layer0Data.hWalls, vWalls: layer0Data.vWalls,
                    endPos: layer0Data.endPos, initialGhosts: layer0Data.ghosts, items: layer0Data.items, buttons: layer0Data.buttons,
                    gameMode: this.gameMode, initialHealth: parseInt(document.getElementById('editor-initial-health').value) || 5,
                    initialStamina: parseInt(document.getElementById('editor-initial-stamina').value) || 100,
                    activeCells: layer0Data.activeCells, editorMode: this.editor.mode, customStartPos: layer0Data.customStartPos,
                    multiLayerMode: this.multiLayerMode,
                    layerCount: this.layerCount, layers: this.layers, stairs: this.stairs
                };
            } else {
                // 游戏态分享码装配在控制器
                const shareData = this.controller.buildShareSourceData();
                if (!shareData) return { success: false, error: '没有地图数据' };
                sourceData = shareData;
            }
            return DataSerializer.generateShareCode(sourceData);
        }

        loadFromShareCode(code, isEditor = false) {
            const result = this.controller.loadFromShareCode(code);
            if (result.success) {
                this._applyLoadedData(result.data.mapData, result.data.gameMode, result.data.initialHealth, result.data.initialStamina, isEditor);
            } else {
                this.showToast(result.error, 3000, 'error');
            }
        }

        _applyLoadedData(mapData, gameMode, health, stamina, isEditor) {
            if (isEditor) {
                this.setGameMode(gameMode, true);
                document.getElementById('editor-initial-health').value = health;
                document.getElementById('editor-initial-stamina').value = stamina;
                this.width = mapData.width; this.height = mapData.height;
                this.startPos = { x: 1, y: this.height - 2 }; this.editorMapSizeInput.value = this.width;
                this.padding = 15; this.cellSize = (canvas.width - 2 * this.padding) / this.width;
                this.hWalls = mapData.hWalls; this.vWalls = mapData.vWalls; this.endPos = mapData.endPos;
                this.ghosts = mapData.initialGhosts; this.items = mapData.items; this.buttons = mapData.buttons || [];
                this.activeCells = mapData.activeCells || Array(this.height).fill(null).map(() => Array(this.width).fill(true));
                this.editor.mode = mapData.editorMode || 'regular'; this.customStartPos = mapData.customStartPos;
                this.multiLayerMode = mapData.multiLayerMode || false; this.layerCount = mapData.layerCount || 1;
                this.currentLayer = 0; this.stairs = JSON.parse(JSON.stringify(mapData.stairs || []));
                this.layers = JSON.parse(JSON.stringify(mapData.layers || []));
                this.playerLayer = typeof mapData.playerStartLayer === 'number' ? mapData.playerStartLayer : 0;
                if (this.multiLayerMode) {
                    if (this.playerLayer < 0 || this.playerLayer >= this.layerCount) this.playerLayer = 0;
                    this.currentLayer = this.playerLayer;
                    if (this.layers[this.playerLayer]) {
                        const layer = this.layers[this.playerLayer];
                        this.hWalls = layer.hWalls; this.vWalls = layer.vWalls; this.activeCells = layer.activeCells;
                        this.ghosts = layer.ghosts; this.items = layer.items; this.buttons = layer.buttons;
                        this.endPos = layer.endPos; this.customStartPos = layer.customStartPos || mapData.mapStartPos || null;
                    }
                }
                this.mapData = {
                    ...mapData, hWalls: JSON.parse(JSON.stringify(this.hWalls)), vWalls: JSON.parse(JSON.stringify(this.vWalls)),
                    initialGhosts: JSON.parse(JSON.stringify(this.ghosts)), items: JSON.parse(JSON.stringify(this.items)),
                    buttons: JSON.parse(JSON.stringify(this.buttons)), endPos: this.endPos, customStartPos: this.customStartPos,
                    activeCells: JSON.parse(JSON.stringify(this.activeCells))
                };
                this.updateEditorUIForMode(); this.updateLayerModeUI(); this.updateLayerPanel();
                this._renderStaticLayer(); this.drawEditor();
            } else {
                // 游戏态加载：应用参数 + 模式切换 + 开局（控制器内完成数据流）
                this.controller.applyLoadedMap(mapData, gameMode, health, stamina, (gm) => this.setGameMode(gm));
            }
            this.showToast('地图加载成功！', 2000, 'success');
        }

        updateHistoryButtons() {
            UI.updateHistoryButtons({
                // Phase 4：读 controller 权威历史（宿主镜像已删）
                currentStep: this.controller.currentStep,
                history: this.controller.history,
                checkpoints: this.controller.checkpoints
            });
        }

        handleUndo() {
            const r = this.controller.undo();
            if (!r.ok && r.error) { this.showToast(r.error, 2000, 'error'); }
        }

        handleSave() {
            const r = this.controller.save();
            if (!r.ok) { this.showToast(r.error, 2000, 'error'); return; }
            this.showToast(`已在第 ${r.step} 步创建存档`, 2000, 'success');
        }

        handleRewind() {
            const r = this.controller.rewind();
            if (!r.ok) { this.showToast(r.error, 2000, 'error'); return; }
            this.showToast(`已回溯至存档点 (第 ${r.step} 步)`, 2000, 'success');
        }

        copyShareCode(isEditor = false) {
            const result = this.generateShareCode(isEditor);
            if (result.success) {
                const code = result.code;
                navigator.clipboard.writeText(code).then(() => {
                    this.showToast('分享码已复制到剪贴板！', 2000, 'success');
                    this.updateURLWithShareCode(code);
                }).catch(err => {
                    console.error('复制分享码失败: ', err);
                    this.showToast('复制分享码失败。', 3000, 'error');
                });
            } else {
                this.showToast(result.error || '无法生成分享码。', 3000, 'error');
            }
        }
    }

    // 创建游戏实例并挂载到 window，以便主题切换器可以访问
    window.game = new GhostMazeGame();
});
