export const WALL_TYPES = {
    EMPTY: 0,
    SOLID: 1,
    DOOR: 2,
    LOCKED: 3,
    ONE_WAY: 4,
    GLASS: 5,
    LETTER_DOOR: 6
};

// 起始房间（出生点）固定为左下角 3×3
export const START_ROOM_SIZE = 3;
export const getStartRoomY = (height) => height - START_ROOM_SIZE;

// 画布边距（四周留白，游戏态与编辑器态共用）
export const EDITOR_PADDING = 15;

// 地图尺寸边界（随机生成 / 编辑器改尺寸共用）
export const MAP_SIZE_MIN = 8;
export const MAP_SIZE_MAX = 20;

// 随机生成默认鬼数量
export const DEFAULT_GHOST_COUNT = 3;

// 按键/D-pad 连续移动与自动寻路的步进间隔（ms）
export const MOVE_INTERVAL_MS = 200;

export const GAME_STATES = {
    MENU: 'menu',
    PLAYING: 'playing',
    DEAD: 'dead',
    WON: 'won',
    EDITOR: 'editor'
};

export const EDITOR_TOOLS = {
    WALL: 'wall',
    GLASS: 'glass',
    DOOR: 'door',
    ONE_WAY: 'oneway',
    LOCK: 'lock',
    LETTER_DOOR: 'letter',
    BUTTON: 'button',
    GHOST: 'ghost',
    KEY: 'key',
    START: 'start',
    END: 'end',
    STAIR: 'stair',
    ERASER: 'eraser',
    GRID: 'grid'
};
