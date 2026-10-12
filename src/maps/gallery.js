import { aiMaps } from './ai-gallery.js';
import { DataSerializer } from '../core/dataSerializer.js';
import { MapDefinition } from '../core/mapDefinition.js';
import { GameLogic } from '../core/gameLogic.js';
import { GAME_STATES } from '../core/constants.js';
import { computeGameView } from '../view/viewSlice.js';
import { renderStaticLayer, drawGame } from '../view/renderer.js';
import { initThemeManager, getColorsFromCSS } from '../themeManager.js';
import { mapURL } from '../shareLinks.js';

// 展示列表仅由明确上架决定维护，不按生成数量或机器评分自动扩充。
const grid = document.getElementById('ai-map-grid'), previews = [];
const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
};
const link = (className, text, href) => {
    const node = element('a', className, text);
    node.href = href; node.target = '_blank'; node.rel = 'noopener';
    return node;
};
for (const map of aiMaps) {
    const decoded = DataSerializer.loadFromShareCode(map.mapCode);
    if (!decoded.success) throw new Error('地图集载入失败：' + map.title);
    const definition = new MapDefinition(decoded.data.mapData), state = GameLogic.createInitialState(definition);
    const layer = definition.layers[0];
    const article = element('article', 'map-card'), canvas = element('canvas', 'map-preview');
    canvas.width = 480; canvas.height = 320; canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', map.title + '地图初态');
    article.append(canvas);
    const body = element('div', 'map-card-body');
    body.append(element('h3', '', map.title));
    body.append(element('p', 'map-meta', layer.activeCells.flat().filter(Boolean).length + ' 格 · ' + layer.initialEntities.ghosts.length + ' 只鬼 · ' + layer.initialEntities.items.length + ' 把钥匙'));
    body.append(element('p', 'map-review', map.review));
    body.append(link('button map-play', '游玩地图', mapURL(map.mapCode)));
    const solution = element('details', 'map-solution');
    solution.append(element('summary', '', '查看参考解法（剧透）'));
    solution.append(element('p', '', map.steps + ' 步参考路线。打开后默认暂停，可逐步观看。'));
    solution.append(link('', '打开参考回放 ↗', mapURL(map.mapCode, { replay: map.replayCode })));
    body.append(solution); article.append(body); grid.append(article);
    previews.push({ canvas, definition, state, staticCanvas: document.createElement('canvas') });
}
document.getElementById('gallery-count').textContent = aiMaps.length + ' 张';
function drawPreviews() {
    const colors = getColorsFromCSS();
    for (const { canvas, definition: mapDef, state: gameState, staticCanvas } of previews) {
        const cells = mapDef.layers[0].activeCells.flatMap((row, y) => row.flatMap((active, x) => active ? [[x, y]] : []));
        const minX = Math.min(...cells.map(c => c[0])), maxX = Math.max(...cells.map(c => c[0]));
        const minY = Math.min(...cells.map(c => c[1])), maxY = Math.max(...cells.map(c => c[1]));
        const cellSize = Math.min((canvas.width - 40) / (maxX - minX + 1), (canvas.height - 40) / (maxY - minY + 1));
        const view = computeGameView({ mapDef, gameState, viewLayer: 0 }, { canvas, staticLayerCanvas: staticCanvas,
            state: GAME_STATES.PLAYING, cellSize, colors, debugVision: true,
            drawOffset: { x: (canvas.width - (maxX - minX + 1) * cellSize) / 2 - minX * cellSize,
                y: (canvas.height - (maxY - minY + 1) * cellSize) / 2 - minY * cellSize } });
        renderStaticLayer(canvas, staticCanvas, view); drawGame(canvas.getContext('2d'), view);
    }
}
initThemeManager(drawPreviews); drawPreviews();
