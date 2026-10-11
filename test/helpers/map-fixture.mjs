/** 入口合法的可配置地图；用来测试小场景而不降低正式入口的校验。 */
export function makeMap(overrides = {}) {
    const width = overrides.width ?? 8, height = overrides.height ?? 8;
    const empty = () => ({ type: 0, keys: 0 });
    return {
        width, height, editorMode: 'free', gameMode: 'exploration', initialHealth: 5,
        hWalls: Array.from({ length: height + 1 }, () => Array.from({ length: width }, empty)),
        vWalls: Array.from({ length: height }, () => Array.from({ length: width + 1 }, empty)),
        activeCells: Array.from({ length: height }, () => Array(width).fill(true)),
        customStartPos: { x: 0, y: 0 }, endPos: { x: width - 1, y: height - 1 },
        initialGhosts: [], items: [], buttons: [], stairs: [], layers: [], layerCount: 1,
        ...overrides
    };
}
