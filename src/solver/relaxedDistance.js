import { WALL_TYPES as W } from '../core/constants.js';
/** 仅放宽门、按钮与鬼；保留实墙、玻璃、活动格和配对楼梯，给出可证明的距离下界。 */
export function relaxedDistance(definition) {
    const { width, height, layers, stairs } = definition;
    const fields = layers.map(() => new Int32Array(width * height).fill(-1)), queue = [];
    const visit = (li, x, y, d) => { if (x < 0 || y < 0 || x >= width || y >= height || !layers[li]?.activeCells[y][x] || fields[li][y * width + x] !== -1) return; fields[li][y * width + x] = d; queue.push([li, x, y]); };
    layers.forEach((l, li) => { const end = l.initialEntities.endPos; if (end) visit(li, end.x, end.y, 0); });
    for (let head = 0; head < queue.length; head++) {
        const [li, x, y] = queue[head], walls = layers[li].initialWalls, d = fields[li][y * width + x] + 1;
        for (const [dx, dy] of [[0,-1],[1,0],[0,1],[-1,0]]) { const wall = dx ? walls.v[y][x + (dx === 1 ? 1 : 0)] : walls.h[y + (dy === 1 ? 1 : 0)][x]; if (wall.type !== W.SOLID && wall.type !== W.GLASS) visit(li, x + dx, y + dy, d); }
        const stair = stairs.find(s => s.layer === li && s.x === x && s.y === y);
        if (stair) visit(li + (stair.direction === 'up' ? 1 : -1), x, y, d);
    }
    return state => { const p = state.player, d = fields[p.layer][p.y * width + p.x]; return d < 0 ? Infinity : d; };
}
