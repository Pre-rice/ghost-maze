import { CanvasApp } from './canvasApp.js';
import { WALL_TYPES, GAME_STATES, EDITOR_TOOLS, MAP_SIZE_MIN, MAP_SIZE_MAX } from './core/constants.js';
import { DataSerializer } from './core/dataSerializer.js';
import { computeEditorView } from './view/viewSlice.js';
import { EditorDocument } from './editor/editorSession.js';
import * as InputHandler from './inputHandler.js';
import * as LayerManager from './layerManager.js';
import { mapURL } from './shareLinks.js';
import { SolutionDialog } from './solver/solutionDialog.js';

class EditorApp extends CanvasApp {
    constructor() {
        super();
        this.state = GAME_STATES.EDITOR;
        this.editor = { active: true, tool: EDITOR_TOOLS.WALL, isDragging: false, didDrag: false, dragAxis: null,
            lastDragPos: null, hoveredWall: null, hoveredButtonHotspot: null, gridDragAction: null,
            stairPlacement: null, isRightClickErasing: false, rightClickMousePos: null, previousToolBeforeRightClick: null };
        this.editorDoc = EditorDocument.blank(10, 10);
        this.editorMapSizeInput = document.getElementById('editor-map-size-input');
        this.clearMapConfirmOverlay = document.getElementById('clear-map-confirm-overlay');
        this.clearEntitiesBtn = document.getElementById('confirm-clear-entities-btn');
        this.resetGridsBtn = document.getElementById('confirm-reset-grids-btn');
        this.clearGridsBtn = document.getElementById('confirm-clear-grids-btn');
        this.clearCancelBtn = document.getElementById('confirm-clear-cancel-btn');
        this.solverDialog = new SolutionDialog({ onReplay: ({ href }) => location.assign(href + '&solve=1') });
        this.bindUI();
        const code = new URLSearchParams(location.search).get('map');
        if (!code || !this.loadFromShareCode(code)) this.syncDocument();
    }
    getView() { return this._editorView(); }
    _editorView() {
        return computeEditorView(this.editorDoc, { canvas: this.canvas, staticLayerCanvas: this.staticLayerCanvas,
            state: this.state, cellSize: this.cellSize, colors: this.colors, padding: this.padding, editor: this.editor });
    }
    syncDocument() {
        this.editorMapSizeInput.value = this.editorDoc.width;
        this.cellSize = (this.canvas.width - 2 * this.padding) / Math.max(this.editorDoc.width, this.editorDoc.height);
        document.getElementById('editor-initial-health').value = this.editorDoc.initialHealth;
        this.setGameMode(this.editorDoc.gameMode);
        this.updateEditorUIForMode(); this.updateLayerModeUI(); this.updateLayerPanel();
        this._renderStaticLayer(); this.draw(); this.updateURL();
    }
    bindUI() {
        const on = (id, fn, event = 'click') => document.getElementById(id).addEventListener(event, fn);
        on('editor-mode-exploration-btn', () => this.setGameMode('exploration'));
        on('editor-mode-death-loop-btn', () => this.setGameMode('death-loop'));
        on('editor-initial-health', event => { this.editorDoc.initialHealth = Number(event.target.value); this.updateURL(); }, 'change');
        on('editor-map-size-input', () => this.resizeAndClearEditor(), 'change');
        on('play-edited-map-btn', () => this.playEditedMap());
        on('solve-edited-map-btn', () => this.solveEditedMap());
        on('clear-map-btn', () => this.clearEditorMap());
        on('edit-type-regular-btn', () => this.attemptSetEditorMode('regular'));
        on('edit-type-free-btn', () => this.attemptSetEditorMode('free'));
        on('layer-mode-single-btn', () => this.setLayerMode(false));
        on('layer-mode-multi-btn', () => this.setLayerMode(true));
        on('layer-add-btn', () => this.addLayer()); on('layer-remove-btn', () => this.removeLayer());
        document.querySelectorAll('.tool-btn').forEach(btn => btn.addEventListener('click', () => this.setEditorTool(btn.id.split('-')[1])));
        window.addEventListener('keydown', event => { if (!this.solverDialog.open) InputHandler.handleEditorKeyPress(this, event); });
        const bindings = { mousedown: 'handleCanvasMouseDown', mousemove: 'handleCanvasMouseMove', mouseup: 'handleCanvasMouseUp', mouseleave: 'handleCanvasMouseLeave' };
        for (const [event, method] of Object.entries(bindings)) this.canvas.addEventListener(event, e => { e.preventDefault(); InputHandler[method](this, e); });
        for (const event of ['contextmenu', 'dragstart', 'selectstart']) this.canvas.addEventListener(event, e => e.preventDefault());
        for (const [event, method] of Object.entries({ touchstart: 'handleCanvasMouseDown', touchmove: 'handleCanvasMouseMove', touchend: 'handleCanvasMouseUp', touchcancel: 'handleCanvasMouseUp' })) {
            this.canvas.addEventListener(event, e => { e.preventDefault(); if (e.changedTouches[0]) InputHandler[method](this, e.changedTouches[0]); }, { passive: false });
        }
    }
    setGameMode(mode) {
        this.editorDoc.gameMode = mode;
        const exploration = mode === 'exploration';
        document.getElementById('editor-mode-exploration-btn').classList.toggle('active', exploration);
        document.getElementById('editor-mode-death-loop-btn').classList.toggle('active', !exploration);
        document.getElementById('initial-health-container').style.display = exploration ? 'flex' : 'none';
        this.updateURL();
    }
    switchToLayer(index) {
        if (index === this.editorDoc.currentLayer) return;
        this.editorDoc.saveCurrentLayer(); this.editorDoc.switchLayer(index);
        this._renderStaticLayer(); this.draw(); this.updateLayerPanel();
    }
    updateLayerPanel() {
        const doc = this.editorDoc;
        LayerManager.updateLayerPanelUI({ multiLayerMode: doc.multiLayerMode, layerCount: doc.layerCount,
            currentLayer: doc.currentLayer, playerLayer: doc.playerLayer, editorActive: true,
            hasStartPoint: doc.hasStartPoint(), onLayerClick: index => this.switchToLayer(index) });
    }
    generateShareCode() {
        return DataSerializer.generateShareCode(this.editorDoc.toMapData());
    }
    updateURL() {
        const result = this.generateShareCode();
        const url = result.success ? mapURL(result.code, { editor: true }) : new URL('editor.html', location.href).toString();
        if (url !== location.href) history.replaceState({}, '', url);
        document.getElementById('editor-home-btn').href = result.success ? mapURL(result.code) : './';
    }
    solveEditedMap() {
        const result = this.generateShareCode();
        if (!result.success) { this.showToast(result.error, 3000, 'error'); return; }
        this.solverDialog.show(this.editorDoc.toMapData(), result.code);
    }
    playEditedMap() {
        const result = this.generateShareCode();
        if (!result.success) { this.showToast(result.error, 3000, 'error'); return; }
        window.open(mapURL(result.code), '_blank', 'noopener');
    }
    loadFromShareCode(code) {
        const result = DataSerializer.loadFromShareCode(code);
        if (!result.success) { this.showToast(result.error, 3000, 'error'); return false; }
        this.editorDoc = EditorDocument.fromMapData(result.data.mapData); this.syncDocument();
        this.showToast('地图加载成功', 2000, 'success');
        return true;
    }
        toggleWall(wall, targetType = WALL_TYPES.SOLID) {
            this.editorDoc.toggleWall(wall, targetType);
            this.drawEditor();
        }

        toggleActiveCell(x, y, action) {
            this.editorDoc.toggleActiveCell(x, y, action);
            this._renderStaticLayer(); this.drawEditor();
        }

        setWall(wall, type) {
            this.editorDoc.setWall(wall, type);
            this.drawEditor();
        }

        toggleDoor(wall) {
            this.editorDoc.toggleDoor(wall);
            this.drawEditor();
        }

        setLocked(wall, keys) {
            this.editorDoc.setLocked(wall, keys);
            this.drawEditor();
        }

        toggleLetterDoor(wall, letter) {
            this.editorDoc.toggleLetterDoor(wall, letter);
            this.drawEditor();
        }

        setOneWay(wall, direction) {
            this.editorDoc.setOneWay(wall, direction);
            this.drawEditor();
        }

        setEnd(x, y) {
            const ok = this.editorDoc.setEnd(x, y);
            this.drawEditor();
            return ok;
        }

        setStart(x, y) {
            const ok = this.editorDoc.setStart(x, y);
            this.updateLayerPanel();
            this.drawEditor();
            return ok;
        }

        toggleGhost(x, y) {
            const ok = this.editorDoc.toggleGhost(x, y);
            this.drawEditor();
            return ok;
        }

        toggleKey(x, y) {
            const ok = this.editorDoc.toggleKey(x, y);
            this.drawEditor();
            return ok;
        }

        toggleButton(hotspot, letter) {
            const ok = this.editorDoc.toggleButton(hotspot, letter);
            this.drawEditor();
            return ok;
        }

        eraseAtPos(pos) {
            this.editorDoc.eraseAt(pos, this.cellSize);
            this.drawEditor();
        }

        eraseButtonsOnWall(wall) {
            this.editorDoc.eraseButtonsOnWall(wall);
        }

        eraseStairAt(x, y, layer) {
            this.editorDoc.eraseStairAt(x, y, layer);
        }

        placeStair(x, y, direction) {
            const ok = this.editorDoc.placeStair(x, y, direction);
            return ok;
        }

        isValidStairPlacement(x, y, direction) {
            return this.editorDoc.isValidStairPlacement(x, y, direction);
        }

        updateLayerModeUI() {
            document.getElementById('layer-mode-single-btn').classList.toggle('active', !this.editorDoc.multiLayerMode);
            document.getElementById('layer-mode-multi-btn').classList.toggle('active', this.editorDoc.multiLayerMode);
        }

        attemptSetEditorMode(mode) {
            if (this.editorDoc.mode === mode) return;
            this.showConfirm('切换编辑模式将清空当前地图，确定吗？', () => {
                const previous = this.editorDoc;
                this.editorDoc = EditorDocument.blank(previous.width, previous.height, mode, false);
                this.editorDoc.gameMode = previous.gameMode; this.editorDoc.initialHealth = previous.initialHealth;
                this.updateEditorUIForMode(); this.updateLayerModeUI(); this.updateLayerPanel();
                this._renderStaticLayer(); this.drawEditor();
            });
        }

        updateEditorUIForMode() {
            const isRegular = this.editorDoc.mode === 'regular';
            document.getElementById('edit-type-regular-btn').classList.toggle('active', isRegular);
            document.getElementById('edit-type-free-btn').classList.toggle('active', !isRegular);
            document.getElementById('tool-start').style.display = isRegular ? 'none' : 'block';
            document.getElementById('tool-grid').style.display = isRegular ? 'none' : 'block';
            document.getElementById('layer-mode-container').style.display = isRegular ? 'none' : 'block';
            if (isRegular && this.editorDoc.multiLayerMode) {
                this.editorDoc.multiLayerMode = false; this.editorDoc.layerCount = 1; this.editorDoc.currentLayer = 0;
                this.updateLayerPanel();
            }
            if (isRegular && [EDITOR_TOOLS.GRID, EDITOR_TOOLS.START, EDITOR_TOOLS.STAIR].includes(this.editor.tool)) {
                this.setEditorTool(EDITOR_TOOLS.WALL);
            }
            this.updateStairToolVisibility();
        }

        updateStairToolVisibility() {
            const stairBtn = document.getElementById('tool-stair');
            const shouldShow = this.editorDoc.mode === 'free' && this.editorDoc.multiLayerMode;
            stairBtn.style.display = shouldShow ? 'block' : 'none';
            if (!shouldShow && this.editor.tool === EDITOR_TOOLS.STAIR) { this.setEditorTool(EDITOR_TOOLS.WALL); }
        }

        setLayerMode(isMultiLayer) {
            if (this.editorDoc.multiLayerMode === isMultiLayer) return;
            if (!isMultiLayer && this.editorDoc.layerCount > 1) {
                this.showConfirm('地图只会保留第一层的内容，确定吗？', () => { this._applyLayerMode(false); });
            } else { this._applyLayerMode(isMultiLayer); }
        }

        _applyLayerMode(isMultiLayer) {
            this.editorDoc.applyLayerMode(isMultiLayer);
            document.getElementById('layer-mode-single-btn').classList.toggle('active', !isMultiLayer);
            document.getElementById('layer-mode-multi-btn').classList.toggle('active', isMultiLayer);
            this.updateLayerPanel(); this.updateStairToolVisibility();
            this._renderStaticLayer(); this.drawEditor();
        }

        addLayer() {
            if (!this.editorDoc.addLayer()) { this.showToast('最多只能添加10层地图！', 3000, 'error'); return; }
            this.updateURL();
            this.updateLayerPanel(); this.showToast(`已添加第 ${this.editorDoc.layerCount} 层`, 2000, 'success');
        }

        removeLayer() {
            if (this.editorDoc.layerCount <= 1) { this.showToast('初始的1层不可删除！', 3000, 'error'); return; }
            this.showConfirm(`确定要删除第 ${this.editorDoc.layerCount} 层吗？`, () => {
                const r = this.editorDoc.removeLayer();
                if (!r.ok) { this.showToast(r.message, 3000, 'error'); return; }
                this.updateURL();
                    if (r.switched) { this._renderStaticLayer(); this.drawEditor(); }
                this.updateLayerPanel(); this.showToast(`已删除第 ${this.editorDoc.layerCount + 1} 层`, 2000, 'success');
            });
        }

        resizeAndClearEditor() {
            const size = Number(this.editorMapSizeInput.value);
            if (!Number.isInteger(size) || size < MAP_SIZE_MIN || size > MAP_SIZE_MAX) {
                this.showToast('地图大小必须在 8 到 20 之间。', 3000, 'error');
                this.editorMapSizeInput.value = this.editorDoc.width; return;
            }
            const wasMultiLayer = this.editorDoc.multiLayerMode;
            const savedLayerCount = wasMultiLayer ? this.editorDoc.layerCount : 1;
            this.editorDoc.resize(size, wasMultiLayer, savedLayerCount);
            this.syncDocument();
        }

        clearEntitiesOnly() {
            // 清空墙 + 实体 + 当前层楼梯（doc.clearWalls + doc.clearEntities 组合；doc.clearEntities 本身保留墙）
            this.editorDoc.clearWalls();
            this.editorDoc.clearEntities();
            this.updateLayerPanel();
            this.drawEditor();
        }

        clearAllGridsAndEntities() {
            this.editorDoc.clearAllGrids(); // 内含 clearEntities
            this.editorDoc.clearWalls();
            this._renderStaticLayer(); this.drawEditor();
        }

        resetGridsAndClearEntities() {
            this.editorDoc.resetGrids(); // 内含 clearEntities
            this.editorDoc.clearWalls();
            this._renderStaticLayer(); this.drawEditor();
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
            if (this.editorDoc.mode === 'free') { this.showClearMapConfirm(); }
            else { this.showConfirm('你确定要清空所有墙壁、实体和物品吗？', () => { this.editorDoc.createBlank(this.editorDoc.width, this.editorDoc.height); this.drawEditor(); }); }
        }

        setEditorTool(tool) {
            this.editor.tool = tool;
            document.querySelectorAll('.tool-btn').forEach(btn => { btn.classList.toggle('active', btn.id === `tool-${tool}`); });
            this.editor.hoveredWall = null; this.drawEditor();
        }

        drawEditor() { this.draw(); this.updateURL(); }



        isPosInStartRoom(cellX, cellY) {
            return this.editorDoc.isPosInStartRoom(cellX, cellY);
        }

        isWallEditable(wall) {
            return this.editorDoc.isWallEditable(wall);
        }

        isCellOccupiedInEditor(x, y) {
            return this.editorDoc.isCellOccupied(x, y);
        }


}
document.addEventListener('DOMContentLoaded', () => { window.editorApp = new EditorApp(); });
