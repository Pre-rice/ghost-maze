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
