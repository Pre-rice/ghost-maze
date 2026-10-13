import { test, suite, summary, assert, assertEq, assertDeepEq } from './_assert.mjs';
import { makeMap } from './helpers/map-fixture.mjs';
import { MapDefinition } from '../src/core/mapDefinition.js';
import { GameLogic } from '../src/core/gameLogic.js';
import { WALL_TYPES as W } from '../src/core/constants.js';

suite('stairEquivalence');
const move = (dx, dy) => ({ type: 'MOVE', payload: { dx, dy } });
const stair = { type: 'USE_STAIR' };
const positions = state => state.layerStates.map(layer => layer.ghosts.map(g => [g.x, g.y]).sort((a,b) => a[0]-b[0] || a[1]-b[1]));
const fixture = ({ start = { x: 3, y: 3 }, startLayer = 0, ghosts = [[], []], change = null } = {}) => {
    const base = makeMap({ endPos: null });
    const source = { ...base, multiLayerMode: true, layerCount: 2,
        stairs: [{ x: 3, y: 3, layer: 0, direction: 'up' }, { x: 3, y: 3, layer: 1, direction: 'down' }],
        layers: [0,1].map(layer => ({
            hWalls: base.hWalls.map(row => row.map(w => ({ ...w }))),
            vWalls: base.vWalls.map(row => row.map(w => ({ ...w }))),
            activeCells: base.activeCells.map(row => row.slice()),
            ghosts: ghosts[layer], items: [], buttons: [], endPos: null,
            customStartPos: layer === startLayer ? start : null
        })) };
    if (change) change(source);
    return new MapDefinition(source);
};
const advance = (def, action) => GameLogic.calculateNextState(GameLogic.createInitialState(def), action, def, { trails: false, visibility: false });

test('上下两端都一样：走上楼梯格就被另一端的鬼当步追到，编号无关', () => {
    for (const layer of [0,1]) for (const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) for (const id of [0,91]) {
        const ghosts = [[],[]]; ghosts[1-layer] = [{ x:3, y:3, id }];
        const def = fixture({ startLayer:layer, start:{ x:3-dx, y:3-dy }, ghosts });
        const state = advance(def, move(dx,dy));
        assert(state.isDead); assertEq(state.player.hp,4); assertEq(state.player.steps,1);
        assertDeepEq(positions(state)[layer], [[3,3]]); assertDeepEq(positions(state)[1-layer], []);
    }
});

test('走到楼梯口遭追击，与三格水平通道走到中格遭追击等价', () => {
    const horizontal = new MapDefinition(makeMap({ customStartPos:{ x:2,y:3 }, initialGhosts:[{ x:4,y:3 }], endPos:null }));
    const a = advance(horizontal, move(1,0));
    const b = advance(fixture({ start:{ x:3,y:2 }, ghosts:[[],[{ x:3,y:3 }]] }), move(0,1));
    assertEq(a.isDead,b.isDead); assert(a.isDead); assertEq(a.player.hp,b.player.hp);
    assertEq(a.player.steps,b.player.steps);
});

test('上下楼到相邻鬼面前，与水平移动到相邻鬼面前等价', () => {
    for (const layer of [0,1]) {
        const ghosts=[[],[]]; ghosts[1-layer]=[{ x:3,y:4 }];
        const a=advance(fixture({ startLayer:layer, ghosts }),stair);
        const horizontal=new MapDefinition(makeMap({ customStartPos:{ x:2,y:3 }, initialGhosts:[{ x:4,y:3 }], endPos:null }));
        const b=advance(horizontal,move(1,0));
        assertEq(a.isDead,b.isDead); assert(a.isDead); assertEq(a.player.hp,b.player.hp);
    }
});

test('上下楼时原层追旧格、到达层追新格，各只走一步', () => {
    for(const layer of [0,1]) {
        const ghosts=[[],[]]; ghosts[layer]=[{ x:3,y:5 }]; ghosts[1-layer]=[{ x:5,y:3 }];
        const state=advance(fixture({ startLayer:layer,ghosts }),stair);
        assert(!state.isDead); assertDeepEq(positions(state)[layer],[[3,4]]);
        assertDeepEq(positions(state)[1-layer],[[4,3]]);
    }
});

test('原层鬼当步抵达离开的楼梯口，不能同一步再跨楼梯', () => {
    for(const layer of [0,1]) {
        const ghosts=[[],[]]; ghosts[layer]=[{ x:3,y:4 }];
        const def=fixture({ startLayer:layer,ghosts });
        const arrived=advance(def,stair);
        assert(!arrived.isDead); assertDeepEq(positions(arrived)[layer],[[3,3]]);
        const escaped=GameLogic.calculateNextState(arrived,move(1,0),def,{ trails:false,visibility:false });
        assert(!escaped.isDead); assertDeepEq(positions(escaped)[layer],[]);
        assertDeepEq(positions(escaped)[1-layer],[[3,3]]);
    }
});

test('离开楼梯后另一端的鬼只到旧楼梯格，不获得拐角外的新视线', () => {
    for(const layer of [0,1]) {
        const ghosts=[[],[]]; ghosts[1-layer]=[{ x:3,y:3 }];
        const state=advance(fixture({ startLayer:layer,ghosts }),move(1,0));
        assert(!state.isDead); assertDeepEq(positions(state)[layer],[[3,3]]);
        assertDeepEq(positions(state)[1-layer],[]);
    }
});

test('到达层追击仍遵循门和玻璃的通行规则', () => {
    for(const layer of [0,1]) for(const wall of [
        { type:W.EMPTY, dies:true }, { type:W.LETTER_DOOR, letter:'A', initialState:'open', dies:true },
        { type:W.LETTER_DOOR, letter:'A', initialState:'closed', dies:false },
        { type:W.DOOR, dies:false }, { type:W.LOCKED, keys:0, dies:false },
        { type:W.GLASS, dies:false }, { type:W.SOLID, dies:false }
    ]) {
        const ghosts=[[],[]]; ghosts[1-layer]=[{ x:3,y:4 }];
        const def=fixture({ startLayer:layer,ghosts,change:source => {
            source.layers[1-layer].activeCells.forEach((row,y)=>row.forEach((_,x)=>row[x]=x===3&&(y===3||y===4)));
            source.layers[1-layer].hWalls[4][3]={ ...wall,keys:wall.keys||0 };
        } });
        const state=advance(def,stair); assertEq(state.isDead,wall.dies);
    }
});

test('使用楼梯进入已有鬼的格子，只判一次死亡，不让鬼多走', () => {
    const def=fixture({ ghosts:[[],[{ x:3,y:3 }]] });
    const state=advance(def,stair);
    assert(state.isDead); assertEq(state.player.hp,4); assertDeepEq(positions(state),[[],[[3,3]]]);
});

test('没有楼梯的无效操作不计步也不推进鬼', () => {
    const def=fixture({ start:{ x:2,y:3 },ghosts:[[{ x:2,y:5 }],[]] });
    const before=GameLogic.createInitialState(def);
    const after=GameLogic.calculateNextState(before,stair,def);
    assertEq(before,after); assertEq(after.player.steps,0);
});

summary();
