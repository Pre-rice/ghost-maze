/**
 * viewSlice - 视图快照（渲染/输入的唯一读取通道）
 *
 * 3c 阶段：把渲染函数对宿主「散字段」的读取收敛为对 view 对象的读取——
 * createGameView / createEditorView 从宿主（GhostMazeGame）组装一份渲染所需
 * 的视图数据快照（字段引用，不拷贝；读多写零）。
 *
 * Phase 4 统一数据源后：改为从权威源（GameState + MapDefinition / EditorDocument）
 * 计算只读投影，宿主散字段（hWalls/ghosts/…镜像）删除，本模块成为投影计算的落点。
 * 渲染层 renderer.js 只依赖本模块的 view 对象，不直接读宿主。
 */

/** 游戏态（PLAYING/DEAD/WON）渲染视图：从宿主组装渲染所需字段 */
export function createGameView(host) {
    return {
        // 画布上下文（由调用方传入；此处仅登记引用供渲染层使用）
        canvas: host.canvas,
        staticLayerCanvas: host.staticLayerCanvas,
        state: host.state,
        cellSize: host.cellSize,
        colors: host.colors,
        drawOffset: host.drawOffset,
        debugVision: host.debugVision,
        width: host.width,
        height: host.height,
        activeCells: host.activeCells,
        seenCells: host.seenCells,
        hWalls: host.hWalls,
        vWalls: host.vWalls,
        ghosts: host.ghosts,
        items: host.items,
        buttons: host.buttons,
        stairs: host.stairs,
        endPos: host.endPos,
        player: host.player,
        playerLayer: host.playerLayer,
        currentLayer: host.currentLayer,
        multiLayerMode: host.multiLayerMode,
    };
}

/** 编辑器态渲染视图：从宿主组装渲染所需字段 */
export function createEditorView(host) {
    return {
        canvas: host.canvas,
        staticLayerCanvas: host.staticLayerCanvas,
        state: host.state,
        editor: host.editor,
        cellSize: host.cellSize,
        colors: host.colors,
        padding: host.padding,
        width: host.width,
        height: host.height,
        activeCells: host.activeCells,
        hWalls: host.hWalls,
        vWalls: host.vWalls,
        ghosts: host.ghosts,
        items: host.items,
        buttons: host.buttons,
        stairs: host.stairs,
        endPos: host.endPos,
        customStartPos: host.customStartPos,
        startPos: host.startPos,
        currentLayer: host.currentLayer,
    };
}

/**
 * computeGameView - 游戏态（PLAYING/DEAD/WON）只读投影
 * 权威源：MapDefinition（静态）+ GameState（动态）+ 视图层 viewLayer。
 * 字段引用不拷贝（读多写零）；宿主渲染参数（画布/尺寸/主题等）经 renderParams 注入。
 * renderer 消费字段集与 createGameView 完全一致，渲染层零改动。
 */
export function computeGameView({ mapDef, gameState, viewLayer }, renderParams) {
    const layerDef = mapDef.layers[viewLayer];
    const layerState = gameState.layerStates[viewLayer];
    return {
        // 宿主渲染参数（非数据源）
        canvas: renderParams.canvas,
        staticLayerCanvas: renderParams.staticLayerCanvas,
        state: renderParams.state,
        cellSize: renderParams.cellSize,
        colors: renderParams.colors,
        drawOffset: renderParams.drawOffset,
        debugVision: renderParams.debugVision,
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
        player: gameState.player,
        playerLayer: gameState.player.layer,
        currentLayer: viewLayer,
        multiLayerMode: mapDef.multiLayerMode,
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
