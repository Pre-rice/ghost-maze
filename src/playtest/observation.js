import { WALL_TYPES as W } from '../core/constants.js';

const kinds = { [W.SOLID]: 'wall', [W.DOOR]: 'door', [W.LOCKED]: 'number-door',
    [W.ONE_WAY]: 'one-way-door', [W.GLASS]: 'glass', [W.LETTER_DOOR]: 'letter-door' };
const directions = value => value.dx === 1 ? 'R' : value.dx === -1 ? 'L' : value.dy === 1 ? 'D' : 'U';
const point = value => [value.x + 1, value.y + 1];

/** 与网页逐格/逐边相同的可见条件；从不返回 GameState、鬼编号或意图。 */
export function observeBoard(definition, state, { layer = state.player.layer, fullVision = false } = {}) {
    if (!Number.isInteger(layer) || layer < 0 || layer >= definition.layerCount) throw new RangeError('楼层不存在');
    const def = definition.layers[layer], dynamic = state.layerStates[layer];
    const full = definition.gameMode === 'death-loop' || fullVision;
    const active = (x, y) => !!def.activeCells[y]?.[x];
    const visible = (x, y) => active(x, y) && (full || !!state.seenCells[layer][y]?.[x]);
    const marks = def.activeCells.map((row, y) => row.map((cell, x) => !cell ? '×' : visible(x, y) ? '·' : '?'));
    const entities = [];
    const add = (kind, value, extra = {}) => {
        if (visible(value.x, value.y)) entities.push({ kind, at: point(value), ...extra });
    };
    if (layer === state.player.layer) entities.push({ kind: 'player', at: point(state.player) });
    if (definition.playerStart.layer === layer) add('spawn', definition.playerStart);
    if (def.initialEntities.endPos) add('exit', def.initialEntities.endPos);
    const ghosts = new Map();
    for (const g of dynamic.ghosts) if (visible(g.x, g.y)) {
        const key = `${g.x},${g.y}`, entry = ghosts.get(key) || { kind: 'ghost', at: point(g), count: 0 };
        entry.count++; ghosts.set(key, entry);
    }
    entities.push(...[...ghosts.values()].sort((a, b) => a.at[1] - b.at[1] || a.at[0] - b.at[0]));
    for (const item of dynamic.items) add('key', item);
    for (const button of def.initialEntities.buttons) add('button', button, { letter: button.letter, facing: directions(button.direction) });
    for (const stair of definition.stairs.filter(s => s.layer === layer)) add('stair', stair, { direction: stair.direction });
    // 同格完整内容仍在entities；网格用一个主标记帮助直接观察空间关系。
    const glyphs = { spawn: 'O', button: 'B', stair: 'S', exit: 'E', key: 'K', ghost: 'G', player: 'P' };
    const ranks = Object.keys(glyphs), occupied = new Map();
    for (const entity of entities) {
        const key = entity.at.join(','), rank = ranks.indexOf(entity.kind);
        if (rank >= (occupied.get(key) ?? -1)) {
            occupied.set(key, rank); marks[entity.at[1] - 1][entity.at[0] - 1] = glyphs[entity.kind];
        }
    }
    const rows = marks.map(row => row.join(' '));
    const edges = [];
    const edge = (a, b, wall) => {
        // 轮廓由方格行给出，接壤虚空始终实墙；内部边只在网页可见时列出。
        if (!active(...a) || !active(...b) || !(visible(...a) || visible(...b)) || wall.type === W.EMPTY) return;
        const value = { between: [a.map(n => n + 1), b.map(n => n + 1)], kind: kinds[wall.type] };
        if (wall.type === W.LOCKED) value.number = wall.keys;
        if (wall.type === W.ONE_WAY) value.direction = directions(wall.direction);
        if (wall.type === W.LETTER_DOOR) { value.letter = wall.letter; value.state = wall.currentState; }
        edges.push(value);
    };
    for (let y = 0; y < definition.height; y++) for (let x = 0; x < definition.width; x++) {
        if (x + 1 < definition.width) edge([x, y], [x + 1, y], dynamic.wallStates.v[y][x + 1]);
        if (y + 1 < definition.height) edge([x, y], [x, y + 1], dynamic.wallStates.h[y + 1][x]);
    }
    const stats = { steps: state.player.steps, keys: state.player.keys };
    if (definition.gameMode === 'death-loop') stats.loops = state.loopCount;
    else {
        stats.health = state.player.hp;
        stats.nearbyGhosts = state.layerStates[state.player.layer].ghosts.filter(g =>
            Math.abs(g.x - state.player.x) <= 1 && Math.abs(g.y - state.player.y) <= 1).length;
    }
    return { format: 'ghostmaze-board-v1', gameMode: definition.gameMode, view: full ? 'full' : 'explored',
        layer: layer + 1, layers: definition.layerCount, player: { layer: state.player.layer + 1, at: point(state.player) },
        status: state.isDead ? 'stopped' : state.isWon ? 'won' : 'playing', stats,
        grid: { width: definition.width, height: definition.height, rows }, entities, edges };
}

export function describeVisibleChange(before, after, { effective = false, death = false, revived = false } = {}) {
    const ghosts = board => board.entities.filter(e => e.kind === 'ghost');
    return { effective, death, revived, playerBefore: before.player, playerAfter: after.player,
        ghostsBefore: before.layer === after.layer ? ghosts(before) : null, ghostsAfter: ghosts(after),
        statsBefore: before.stats, statsAfter: after.stats };
}

export function formatBoard(board) {
    const lines = [`第${board.layer}/${board.layers}层 · ${board.gameMode} · ${board.status}`,
        `列x：${Array.from({ length: board.grid.width }, (_, i) => i + 1).join(' ')}`];
    board.grid.rows.forEach((row, i) => lines.push(`y=${i + 1} ${row}`));
    lines.push('元件：' + JSON.stringify(board.entities), '内部墙门：' + JSON.stringify(board.edges));
    return lines.join('\n');
}
