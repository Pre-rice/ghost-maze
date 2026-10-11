import { normalizeMapData } from './mapDataUtils.js';

/** 静态地图；所有入口均装配为同一份层数据。 */
export class MapDefinition {
    constructor(source) {
        const data = normalizeMapData(source);
        this.width = data.width;
        this.height = data.height;
        this.gameMode = data.gameMode;
        this.initialHealth = data.initialHealth;
        this.editorMode = data.editorMode;
        this.multiLayerMode = data.multiLayerMode;
        this.layerCount = data.layerCount;
        this.stairs = data.stairs;
        this.layers = data.layers.map((layer, index) => ({
            activeCells: layer.activeCells,
            initialWalls: { h: layer.hWalls, v: layer.vWalls },
            initialEntities: {
                ghosts: layer.ghosts, items: layer.items, buttons: layer.buttons,
                stairs: data.stairs.filter(s => s.layer === index),
                endPos: layer.endPos, customStartPos: layer.customStartPos
            }
        }));
        const index = data.layers.findIndex(layer => layer.customStartPos);
        const start = data.layers[index]?.customStartPos || { x: 1, y: data.height - 2 };
        this.playerStart = { ...start, layer: Math.max(0, index) };
        // 反复按按钮无需每次扫描整图；索引仍只引用静态定义。
        this.letterWalls = new Map();
        this.layers.forEach((layer, li) => {
            for (const axis of ['h', 'v']) layer.initialWalls[axis].forEach((row, y) => row.forEach((wall, x) => {
                if (wall.letter) {
                    if (!this.letterWalls.has(wall.letter)) this.letterWalls.set(wall.letter, []);
                    this.letterWalls.get(wall.letter).push({ layer: li, axis, x, y });
                }
            }));
        });
    }
}
