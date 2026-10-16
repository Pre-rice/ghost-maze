import { installBrowserEnv } from './helpers/browser-env.mjs';
import { test, suite, summary, assert, assertEq } from './_assert.mjs';
import { DataSerializer } from '../src/core/dataSerializer.js';
import { ReplaySerializer } from '../src/core/replaySerializer.js';
import { MapDefinition } from '../src/core/mapDefinition.js';
import { ActionHistory } from '../src/core/actionHistory.js';
import { optimalCache } from '../src/maps/optimal-cache.js';
installBrowserEnv(); suite('optimalCache');
test('预置最优解仍与当前共同引擎一致：步数准确、按路线通关且不死亡', () => {
    const mapCodes = Object.keys(optimalCache.maps);
    assert(mapCodes.length > 0, '预置缓存不为空');
    for (const mapCode of mapCodes) {
        const map = DataSerializer.loadFromShareCode(mapCode);
        assert(map.success, '地图码可解码：' + mapCode);
        const cached = optimalCache.maps[mapCode], definition = new MapDefinition(map.data.mapData);
        assert(Number.isInteger(cached.steps) && cached.steps >= 0, '记录最优步数');
        assert(cached.codes.length > 0, '至少一条代表路线');
        for (const routeCode of cached.codes) {
            const route = ReplaySerializer.loadFromShareCode(map.data.mapData, routeCode);
            assert(route.success, '操作码可解码：' + routeCode);
            assertEq(route.actions.length, cached.steps, '路线步数等于记录最优步数');
            const history = new ActionHistory(definition, route.actions);
            for (const death of history.deathSteps) assert(false, `最优解第 ${death} 步死亡`);
            const state = history.stateAt(route.actions.length);
            assert(state.isWon, '路线按当前引擎通关');
            assertEq(state.player.steps, cached.steps);
        }
    }
});
summary('optimalCache');
