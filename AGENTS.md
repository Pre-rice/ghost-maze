# 鬼迷宫 — 项目开发指南

## 2026-10-11 云端迁移（最新工作约定）

- 两仓默认以 `main` 开发，及时提交验收成果；需要隔离分支先说明原因，不静默创建长期开发分支。
- 云端同时接入本体与 AI 仓库，保持同级目录。先读 [docs/codex-cloud.md](docs/codex-cloud.md)，再执行 AI 仓 `npm run cloud:check`；运行版本见 `.nvmrc`。
- 不依赖本机聊天、绝对路径、已运行服务或本机配置。当前迁移只准备开发环境，不部署线上、不生成题或训练模型。
- 真人录制、反馈与历史证据通过私人资料包迁移，原件按字节保留；不把环境保存当作 Git 提交，不因校验失败擅自更新锁或原件。

更新：2026-10-11。当前实现以[交付记录](docs/architecture-delivery-20261011.md)与[分享协议](docs/share-codes.md)为准。[执行方案](docs/architecture-execution-plan-20261011.md)保留为获批时的方案，不是待实施清单。

## 开发约束

- 所有交流、文档、注释用简体中文，英文技术名词除外。
- 保护用户已有修改，不擅自回退、删除或覆盖；不擅自替换用户明确方案。影响目标、范围或行为的不确定性先沟通，已获授权的实施不重复请求确认。
- 用最少代码解决问题；原生 ES Module + Canvas 2D，无框架、构建工具或新增依赖。
- 通过静态 HTTP 服务运行，不能直接用 `file://`。已有压缩库在 `src/vendor/pako.js`，不再依赖 CDN。
- 修改后运行 `npm test`；当前 14 文件、148 项检查通过。规则变更还需同步 AI 规则锁、证书与相关回归。
- 不把无伤证书、必要性、解长或搜索成本当作人类趣味验收。

## 页面与模块

| 入口／模块 | 职责 |
| --- | --- |
| `index.html` → `src/main.js` | 载入、游玩、同页回放；`window.game` |
| `editor.html` → `src/editorMain.js` | 独立制作和修改；`window.editorApp` |
| `help.html` | 产品规则和操作说明 |
| `src/canvasApp.js` | 两页共用画布和渲染调度 |
| `src/shareLinks.js` | 地图、回放、编辑网址装配 |
| `src/core/mapDataUtils.js` | 唯一地图装配、虚空墙规范化、完整合法性校验 |
| `MapDefinition`／`GameState` | 静态地图／某一时刻动态局面 |
| `GameLogic` | 零 DOM 的规则迁移、复活、视野；游玩、AI、回放共用 |
| `GameController` | 当前游玩局、操作历史、存档、复活边界、回放加载 |
| `ActionHistory` | 有效操作日志、可重建局面缓存、同步／分段跳步 |
| `actions.js`／`replaySerializer.js` | 五种动作及地图绑定的操作码 |
| `dataSerializer.js`／`binaryCodec.js` | 地图码与两类码共用位流／压缩 |
| `EditorDocument` | 独立编辑器唯一数据源 |
| `viewSlice.js`／`renderer.js` | 只读投影／Canvas 绘制 |
| `pathfinding.js` | 公共寻路、墙方向与按钮依附 |
| `ui.js`、`inputHandler.js`、`themeManager.js` | 界面、输入和主题 |
| `storage.js` | localStorage 安全读写 |

运行期游玩权威源为 `controller.mapDefinition` 和 `controller.currentGameState`；编辑权威源为 `editorDoc`。绘制和输入通过 `computeGameView`／`computeEditorView` 读投影，不在宿主增加地图散字段镜像。写入走 controller 或 editorDoc，渲染器只读。

`GhostMazeGame.state` 是应用状态；`GameState` 是游戏数据状态。游玩显示层为 `controller.viewLayer`，编辑层为 `editorDoc.currentLayer`。回放有自己的地图、历史和局面，观看不替换原局；确认“加载该步”才接管。

编辑器另开标签，试玩另开游戏页；草稿仅在原编辑标签保留。游玩不能修改作者设置，简单显示选项可直接操作。地图码是编辑器的保存和分享方式，游戏存档不持久化。

主题仅深色、浅色两档，首次按系统偏好初始化。电脑隐藏方向面板及开关。回放默认暂停，地图和回放直接复制地址栏链接分享；有效编辑自动更新链接。新建随机地图先设置大小、模式和探索初始生命，确认后才替换当前地图。

## 唯一地图形状

```js
{
    width, height,                    // 8～20
    editorMode: 'regular' | 'free',
    gameMode: 'exploration' | 'death-loop',
    initialHealth,                    // 探索生命，默认 5；无体力
    multiLayerMode, layerCount,        // 1～10 层
    layers: [{
        hWalls, vWalls, activeCells,
        ghosts: [{ x, y, id }],
        items: [{ x, y, type: 'key' }],
        buttons: [{ x, y, direction, letter }],
        endPos, customStartPos
    }],
    stairs: [{ x, y, layer, direction: 'up' | 'down' }]
}
```

各层只保留一份数据，恰有一个出生点；regular 的默认出生点经装配写入第零层，free 明确设置。允许每层一个终点，至少一个终点才可游玩或分享。鬼顺序保留，不按压缩需要重排。

既有 JSON 可从单层顶层结构或一致的第零层副本接入，但不能猜测冲突。若顶层与第零层不同，或层内楼梯与全局楼梯不同，严格拒绝。保留原件，在总目录说明，不擅自覆盖一份。

所有游玩、编辑导出、AI 和分享入口使用 `validateMapData`。无终点的机制单元仅在显式 `requireEnd:false` 的研究入口允许。数字门钥匙要求为无符号 32 位整数；探索生命为 1～4294967295。

## 墙体与机制

横墙为 `(height+1)×width`：`hWalls[y][x]` 是格子上墙，`hWalls[y+1][x]` 是下墙。竖墙为 `height×(width+1)`：`vWalls[y][x]` 是左墙，`vWalls[y][x+1]` 是右墙。取方向墙复用 `getWallInDirection`。

| 墙类型 | 值 | 玩家行为 |
| --- | --- | --- |
| EMPTY | 0 | 可过 |
| SOLID | 1 | 阻挡 |
| DOOR | 2 | 自由通行，鬼不能过 |
| LOCKED | 3 | 钥匙足够可过，不扣钥匙，门消失为 EMPTY |
| ONE_WAY | 4 | 仅匹配方向可过 |
| GLASS | 5 | 不可过但可视 |
| LETTER_DOOR | 6 | 当前开时可过；按钮切换全部同字母门 |

墙判定用 `WALL_TYPES.*`，非空写 `!== WALL_TYPES.EMPTY`。墙参数分别为 keys、direction、letter 和 initialState；动态字母门另有 currentState。

成功移动、按钮、楼梯都计一步并推进鬼；无效输入不计。按钮依附实墙或活动区边界，必须通过合法性检查，不能以求解成功代替。楼梯必须在相邻层同格有反向配对，同层同格不可重复；空格使用，操作无需区分上下。

鬼依靠同行／同列直线视野，看到后走最短路一步；失去目标后的短暂追踪无持久记忆，通常不巡逻。鬼不能穿普通门、锁门、单向门或玻璃，但能透玻璃看。已开字母门对鬼可见可过，对玩家射线仍遮挡。跨层追逐只按共同规则允许的配对楼梯条件执行。

## 历史、复活与回放

- 唯一动作名：`U/D/L/R/STAIR`。原地按钮记实际方向，不猜前后局面；点击寻路记实际逐步操作。
- 操作是可分享的持久信息；局面仅为可重建临时缓存。默认每 32 步锚点和近期局面，初态与当前态保留，预算 16 MiB；不删除操作来省缓存。
- 存档是本局步号，不写 localStorage。撤回后新动作裁未来及未来存档，主动复活后不能撤回跨复活边界。
- 探索碰鬼扣生命，复活回出生点但保留物理变化与累计操作；下一操作从死亡状态推导复活，复活不占回放步。
- 死亡循环碰鬼判死，复活重置物理／步数／路线／存档，保留探索且循环加一，只保留最后轮。
- 两模式死亡可回上一个更早存档。重置地图清操作、存档、探索及全部物理变化。
- 回放入口是 `?map=地图码&replay=操作码`，默认暂停、全图，五档速度，支持跳步。操作码不写局面、探索、循环、版本或时间。
- 确认加载第 N 步后：探索视野替换为路线视野；死亡循环同图循环加一、探索取并集，并作为该轮缓存的基础视野，撤回仍保留。不同图不迁移探索。存档清除，路线换为前 N 步。
- 全图开关只影响显示，不污染探索。死亡／胜利步准确加载，不强行变为存活。

## 分享与错误处理

完整协议见 [docs/share-codes.md](docs/share-codes.md)。地图码与操作码无格式版本，无旧码解码器或启发式兼容。当前码为 Base64URL，无末尾等号；是否压缩和内容表示由控制位确定。

生成先完整校验，再编码并解回核对；非法类型、悬空按钮、楼梯冲突、数值超界、截断或多余尾数据干净失败。内部位流非法统一抛 RangeError，上层返回可显示错误，不产生 NaN 或死循环。

AI 通过同级本体模块直接使用规则，以 `ghost-maze-ai/engine.lock.json` 的文件内容锁核验。本体 core 改动后在 AI 仓运行 `node scripts/lock-engine.mjs`，并做相关证书和回归核验。搜索可保留索引、队列、启发式，禁止新增重复物理规则。

常量使用 `constants.js`，localStorage 经 `safeGet/safeSet`，prompt 经 `askForInput`。历史证据与导入工具不是运行时死代码，不能因旧规则字段而擅自删除。

## 地图与生成

首页可新建随机地图，生成参数归编辑器；现有随机生成器仍是单层 DFS 加随机点，不保证可解或谜题质量。AI 求解器与设计搜索在同级 AI 仓，已有题目见 [总目录](docs/ai-map-catalog.md)。

后续每张新图交付前：合法性 → 新地图码往返 → 共同规则证书重放 → 操作码往返 → 总目录。浏览器集中验收规则／交互升级及新增机制，不再为每张已核验 AI 路线反复整段浏览器通关。

golden 仍在 `test/golden/`；更新应保留规范地图与当前码闭环、逻辑快照，不沿用旧码兼容断言。历史作品、证据和真人原录制保留，迁移结果另存。
