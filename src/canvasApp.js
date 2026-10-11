import * as UI from './ui.js';
import * as Renderer from './view/renderer.js';
import * as ThemeManager from './themeManager.js';
import { EDITOR_PADDING } from './core/constants.js';

/** 两页面共用画布与提示；地图数据仍由各自权威源提供。 */
export class CanvasApp {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.staticLayerCanvas = document.createElement('canvas');
        this.staticLayerCtx = this.staticLayerCanvas.getContext('2d');
        this.padding = EDITOR_PADDING; this.cellSize = 0; this.drawOffset = { x: 0, y: 0 };
        this.toastElement = document.getElementById('toast-notification');
        this.toastTimeout = null;
        ThemeManager.initThemeManager(() => this.refreshTheme());
        this.colors = ThemeManager.getColorsFromCSS();
    }
    refreshTheme() {
        this.colors = ThemeManager.getColorsFromCSS();
        if (!this.cellSize) { this.showInitialMessage(); return; }
        this._renderStaticLayer(); this.draw();
    }
    showInitialMessage() {
        Renderer.showInitialMessage(this.ctx, { canvasWidth: this.canvas.width, canvasHeight: this.canvas.height, padding: this.padding, colors: this.colors });
    }
    showToast(message, duration = 3000, type = 'info') { UI.showToast(this.toastElement, message, duration, type, this); }
    showConfirm(message, onConfirm) {
        UI.showConfirm(document.getElementById('confirm-overlay'), document.getElementById('confirm-message'),
            document.getElementById('confirm-yes-btn'), document.getElementById('confirm-no-btn'), message, onConfirm);
    }
    _renderStaticLayer() { Renderer.renderStaticLayer(this.canvas, this.staticLayerCanvas, this.getView()); }
    draw() {
        if (!this.cellSize) return;
        if (this.editor.active) Renderer.drawEditor(this.ctx, this.getView());
        else Renderer.drawGame(this.ctx, this.getView());
    }
}

