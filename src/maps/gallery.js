import { aiMaps } from './ai-gallery.js';
import { initThemeManager } from '../themeManager.js';
import { mapURL } from '../shareLinks.js';

// 展示列表仅由明确上架决定维护，不按生成数量或机器评分自动扩充。
const grid = document.getElementById('ai-map-grid');
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
    const article = element('article', 'map-card');
    const body = element('div', 'map-card-body');
    body.append(element('h3', '', map.title));
    const actions = element('div', 'map-card-actions');
    actions.append(link('button map-play', '游玩地图', mapURL(map.mapCode)));
    actions.append(link('map-solution', '参考解法 ↗', mapURL(map.mapCode, { replay: map.replayCode })));
    body.append(actions); article.append(body); grid.append(article);
}
document.getElementById('gallery-count').textContent = aiMaps.length + ' 张';
initThemeManager();
