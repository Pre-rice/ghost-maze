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
