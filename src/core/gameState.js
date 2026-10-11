/** 完整动态局面；历史间共用未改变的墙行与探索行。 */
export class GameState {
    constructor(data) {
        Object.assign(this, {
            loopCount: 0, isDead: false, isWon: false, deathReason: '', isRevivalPoint: false
        }, structuredClone(data));
    }

    clone() {
        const next = Object.create(GameState.prototype);
        Object.assign(next, this);
        next.player = { ...this.player, trail: this.player.trail.slice() };
        next.layerStates = this.layerStates.map(layer => ({
            ghosts: layer.ghosts.map(g => ({ ...g, trail: (g.trail || []).slice() })),
            items: layer.items.slice(),
            wallStates: layer.wallStates
        }));
        next.seenCells = this.seenCells.slice();
        return next;
    }

    /** 写墙时只复制所属行，不触及历史或地图定义。 */
    setWall(layer, axis, x, y, changes) {
        const previous = this.layerStates[layer].wallStates;
        this.layerStates[layer].wallStates = { ...previous, [axis]: previous[axis].slice() };
        const rows = this.layerStates[layer].wallStates[axis];
        rows[y] = rows[y].slice();
        rows[y][x] = { ...rows[y][x], ...changes };
    }
}
