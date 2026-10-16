import { GAME_STATES } from '../core/constants.js';
import { deathPositionOf } from '../core/stepOutcome.js';

/**
 * viewSlice - 视图快照（渲染/输入的唯一读取通道）
 *
 * 从权威源计算只读投影（字段引用，不拷贝；读多写零）：
 *   computeGameView   - 游戏态（PLAYING/DEAD/WON）：MapDefinition + GameState + viewLayer
 *   computeEditorView - 编辑器态（EDITOR）：EditorDocument + 宿主编辑器交互状态
 *   pruneTrails       - 在权威源上修剪视觉轨迹
 * 渲染层 renderer.js 只依赖本模块的 view 对象，不直接读宿主/数据源。
 */

/**
 * computeGameView - 游戏态（PLAYING/DEAD/WON）只读投影
 * 权威源：MapDefinition（静态）+ GameState（动态）+ 视图层 viewLayer。
 * 字段引用不拷贝（读多写零）；宿主渲染参数（画布/尺寸/主题等）经 renderParams 注入。
 */
export function computeGameView({ mapDef, gameState, viewLayer }, renderParams) {
    const layerDef = mapDef.layers[viewLayer];
    const layerState = gameState.layerStates[viewLayer];
    // 当步重生已由历史完成；游玩死亡提示和回放当步都显示在死亡位置。
    const death = renderParams.state === GAME_STATES.DEAD || renderParams.state === GAME_STATES.REPLAY
        ? deathPositionOf(gameState) : null;
    const player = death ? { ...gameState.player, ...death } : gameState.player;
    return {
        // 宿主渲染参数（非数据源）
        canvas: renderParams.canvas,
        staticLayerCanvas: renderParams.staticLayerCanvas,
        state: renderParams.state,
        cellSize: renderParams.cellSize,
        colors: renderParams.colors,
        drawOffset: renderParams.drawOffset,
        debugVision: mapDef.gameMode === 'death-loop' || renderParams.debugVision,
        // 权威源投影（引用，不拷贝）
        width: mapDef.width,
        height: mapDef.height,
        activeCells: layerDef.activeCells,
        seenCells: gameState.seenCells[viewLayer],
        hWalls: layerState.wallStates.h,
        vWalls: layerState.wallStates.v,
        ghosts: layerState.ghosts,
        items: layerState.items,
        buttons: layerDef.initialEntities.buttons,
        stairs: mapDef.stairs,
        endPos: layerDef.initialEntities.endPos,
        player,
        playerLayer: player.layer,
        currentLayer: viewLayer,
        multiLayerMode: mapDef.multiLayerMode,
    };
}

/**
 * computeEditorView - 编辑器态（EDITOR）只读投影
 * 权威源：EditorDocument（doc）；UI 交互状态（tool/hoveredWall 等）在宿主 editor 对象，
 * editor.mode 强制取 doc.mode（单一来源，防漂移）。宿主渲染参数经 renderParams 注入。
 */
export function computeEditorView(doc, renderParams) {
    return {
        // 宿主渲染参数（非数据源）
        canvas: renderParams.canvas,
        staticLayerCanvas: renderParams.staticLayerCanvas,
        state: renderParams.state,
        cellSize: renderParams.cellSize,
        colors: renderParams.colors,
        padding: renderParams.padding,
        // 权威源投影（EditorDocument，字段引用不拷贝）
        width: doc.width,
        height: doc.height,
        activeCells: doc.activeCells,
        hWalls: doc.hWalls,
        vWalls: doc.vWalls,
        ghosts: doc.ghosts,
        items: doc.items,
        buttons: doc.buttons,
        stairs: doc.stairs,
        endPos: doc.endPos,
        customStartPos: doc.customStartPos,
        startPos: doc.startPos,
        currentLayer: doc.currentLayer,
        // UI 交互状态来自宿主 editor；mode 强制取 doc（数据源唯一）
        editor: { ...renderParams.editor, mode: doc.mode },
    };
}

/**
 * pruneTrails - 在权威源上修剪视觉轨迹（player + viewLayer 层鬼）
 * 原宿主只剪镜像副本（玩家）或同引用（鬼），两不对称（玩家轨迹陈旧泄漏）；
 * 投影化后统一在权威 GameState 上剪，剪与画（view 层）一致。
 * 只就地修改当前 GameState——历史旧状态是不同对象，不跨历史污染。
 */
export function pruneTrails(gameState, viewLayer, now, lifetime = 500) {
    if (!gameState || !gameState.player) return;
    gameState.player.trail = gameState.player.trail.filter(p => now - p.timestamp < lifetime);
    const ls = gameState.layerStates[viewLayer];
    if (ls) ls.ghosts.forEach(g => { if (g.trail) g.trail = g.trail.filter(p => now - p.timestamp < lifetime); });
}
