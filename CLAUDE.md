# 鬼迷宫 (Ghost Maze) — 项目开发指南

> 本文件为项目级开发文档，供后续开发（尤其是 **AI 算法生成/通关迷宫**）快速上手使用。

## 1. 项目简介

一款纯前端 2D 迷宫探索生存游戏：玩家需要在迷宫与战争迷雾中探索，躲避会主动追捕的鬼魂，收集钥匙开启数字门，最终抵达绿色终点。

- **技术栈**：原生 ES Module + Canvas 2D，**无框架、无构建工具、无新依赖**。
- **入口**：`index.html` → `<script type="module" src="src/main.js">`（[index.html:368](index.html#L368)）。
- **唯一外部依赖**：CDN 加载的 `pako`（[index.html:367](index.html#L367)），用于分享码 deflate 压缩（`window.pako`）；测试用 Node 内置 `node:zlib` 模拟（[test/helpers/browser-env.mjs](test/helpers/browser-env.mjs)）。
- **运行方式**：任意静态 HTTP 服务器（如 `npx serve`）。**不能直接用 `file://` 打开**（ESM 跨域限制）。
- **在线地址**：https://ghostmaze.novic.cc
- **测试**：`npm test`（Node 内置运行器 `node test/run-all.mjs`，自研断言，零新依赖；含 golden 地图与逻辑回归快照）。

## 2. 架构与模块依赖

```
index.html
 ├── styles.css（CSS 变量主题）
 ├── pako (CDN) ────────────────┐ 分享码压缩
 └── src/main.js（主类 GhostMazeGame，挂 window.game）
      ├── core/                # 纯逻辑，零 DOM
      │   ├── constants.js        常量枚举（无依赖）
      │   ├── gameState.js        GameState 动态快照类（无依赖）
      │   ├── mapDefinition.js    静态地图定义 MapDefinition（出生点解析 _findPlayerStart）
      │   ├── gameLogic.js        纯函数游戏逻辑 GameLogic
      │   ├── gameController.js   GameController 游戏控制器（PLAYING 态装配/历史/复活/胜负/分享码）
      │   ├── dataSerializer.js   分享码 v3 编/解码
      │   ├── mazeGenerator.js    迷宫生成（纯随机，待替换）
      │   └── pathfinding.js      按钮热点/距离场/玩家寻路（唯一公共版）
      ├── editor/               # 编辑器纯逻辑，零 DOM
      │   ├── editor.js           编辑器纯算法（墙命中/占用/校验/起始房间）
      │   └── editorSession.js    EditorDocument：编辑器态唯一数据源
      ├── view/                 # 渲染与投影
      │   ├── viewSlice.js        权威源 → 渲染/输入只读投影
      │   └── renderer.js         Canvas 渲染（只读 view 对象）
      ├── ui.js                  纯 UI 工具（无依赖）
      ├── layerManager.js        多层地图图层/层面板
      ├── inputHandler.js        键盘/D-pad/鼠标输入
      └── themeManager.js        明/暗/自动三档主题
```

**数据源规则（Phase 4 重构核心，务必遵守）**：运行期两个权威源互斥——

- `PLAYING`（PLAYING/DEAD/WON）= `MapDefinition` + `GameState`，装配在 `GameController`（`this.controller`）。
- `EDITOR` = `EditorDocument`（`this.editorDoc`），编辑器会话的唯一数据源。
- 渲染/输入一律读 `viewSlice` 只读投影（`computeGameView` / `computeEditorView`），**不直接读宿主/数据源散字段**；投影字段是引用不拷贝（读多写零）。
- 编辑器 = 临时草稿区，编辑不持久化；**分享码就是它的「保存」按钮**。
- 起点统一 `mapDef.playerStart`（`_findPlayerStart`：regular = `startPos` / free = 各层 `customStartPos`）。

**核心分层（重要）**：

- `MapDefinition`（[mapDefinition.js](src/core/mapDefinition.js)）：**静态、不可变**的地图定义。由 `mapData` 构建；每层拆成 `initialWalls` + `initialEntities`。
- `GameState`（[gameState.js](src/core/gameState.js)）：某一时刻的**完整动态快照**（玩家、各层鬼/物品/墙体当前状态、已探索区域）。
- `GameLogic`（[gameLogic.js](src/core/gameLogic.js)）：**纯函数**状态迁移。`createInitialState(mapDef)` 建初始态；`calculateNextState(state, action, mapDef)` 返回新 `GameState`。**不做任何 UI 更新**。
- `GameController`（[gameController.js](src/core/gameController.js)）：游戏态控制器——`startGame/processAction/undo/rewind/revive`、历史与存档、胜负统计、分享码装配；UI 副作用经注入回调（`onSync/onWin/onDeath`）回到 main。
- `EditorDocument`（[editorSession.js](src/editor/editorSession.js)）：编辑器态唯一数据源——`fromMapData/blank` 装载、全部写操作（`toggleWall/setWall/toggleDoor/setLocked/setOneWay/toggleLetterDoor/setEnd/setStart/toggleGhost/toggleKey/toggleButton/placeStair` 等）、`saveCurrentLayer/switchLayer/增删层`、`toMapData/toShareMapData`、`validate`。
- `GhostMazeGame`（[main.js](src/main.js)）：主类——绑定 UI / 渲染调度（`draw`/`drawEditor` 走投影）/ 编辑器薄委托（写操作转发 `editorDoc.*`）/ 分享码 URL / D-pad。

**已知死代码**：无（Phase 1/7 已清理；`historyManager.js`、`ghostMazeGame.js` 已删除）。

## 3. 核心数据结构

### 3.1 墙体索引约定（易错，务必牢记）

墙体分横、竖两组二维数组（[mazeGenerator.js](src/core/mazeGenerator.js) 生成，编辑器同约定）：

- `hWalls`：`(height+1) 行 × width 列`。`hWalls[y][x]` = 格子 `(x,y)` **上方**的墙；`hWalls[y+1][x]` = 其**下方**的墙。
- `vWalls`：`height 行 × (width+1) 列`。`vWalls[y][x]` = 格子 `(x,y)` **左侧**的墙；`vWalls[y][x+1]` = 其**右侧**的墙。

方向取墙统一用 `getWallInDirection`（[pathfinding.js](src/core/pathfinding.js)）：`dx=1→vWalls[y][x+1]`、`dx=-1→vWalls[y][x]`、`dy=1→hWalls[y+1][x]`、`dy=-1→hWalls[y][x]`。

### 3.2 墙类型

见 [constants.js:1-9](src/core/constants.js#L1-L9)：

| 类型 | 值 | 玩家可否通过 | 备注 |
|---|---|---|---|
| EMPTY | 0 | 可 | 空地 |
| SOLID | 1 | 否 | 实心墙 |
| DOOR | 2 | **可** | 装饰性门，自由通行 |
| LOCKED | 3 | 需钥匙 | 数字门，需 `keys >= wall.keys`，**通过后消耗为 EMPTY** |
| ONE_WAY | 4 | 按方向 | 单向门，需方向匹配 `wall.direction` |
| GLASS | 5 | 否 | 玻璃，**不可过但可视** |
| LETTER_DOOR | 6 | 需开关 | 字母门，`currentState==='open'` 才可过，由按钮切换 |

墙对象为 `{ type, keys: 0 }`；`LOCKED` 携带 `keys`（所需钥匙数），`ONE_WAY` 携带 `direction:{dx,dy}`，`LETTER_DOOR` 携带 `letter` 与 `initialState/currentState`。

### 3.3 `mapData` 完整形状（生成器/分享码/编辑器共用）

以 [mazeGenerator.js](src/core/mazeGenerator.js) `generateFullMaze` 的返回值为基准：

```js
{
  width, height,
  hWalls, vWalls,          // 墙二维数组（见 3.1）
  activeCells,             // height×width 布尔数组，标记可活动格（free 模式可为任意形状）
  items: [{x, y, type:'key'}],
  buttons: [{x, y, direction, letter}],
  initialGhosts: [{x, y, id}],
  startPos: {x, y},        // 玩家起点（regular 模式固定左下 3×3 起始房间，startPos={1, height-2}）
  endPos: {x, y},          // 终点
  editorMode: 'regular' | 'free',
  customStartPos: {x,y}|null,
  multiLayerMode: bool,
  layerCount: number,
  layers: [{hWalls, vWalls, activeCells, ghosts, items, buttons, stairs, endPos, customStartPos}],
  stairs: [{x, y, layer, direction:'up'|'down'}]  // 全局跨层楼梯
}
```

> **AI 生成器只需产出同一形状的对象**，即可无缝接入分享码、编辑器与游戏（`startGame(mapData)` 是统一入口）。**注意**：当前生成器固定单层，产物 `layers: []`（MapDefinition 构造时落到顶层数据，行为等价）；多层只能由编辑器/分享码产生。

### 3.4 MapDefinition 与 GameState 的关系

- `MapDefinition` 把每层拆成静态两部分：`initialWalls: {h, v}` + `initialEntities: {ghosts, items, buttons, stairs, endPos, customStartPos}`。玩家出生点由 `_findPlayerStart` 决定（regular = 顶层 `startPos`；free = 扫描各层 `customStartPos`，默认 `{1, height-2}`）。
- `GameState` 保存动态部分：`player`、每层 `layerStates[i].{ghosts, items, wallStates}`、`seenCells`（每层一个布尔矩阵，战争迷雾永久揭示记录）。
- 单层兼容：`layerCount===1` 且无 `layers` 时，第 0 层用顶层数据。

### 3.5 多层地图与楼梯

- 数据模型已完备：`layers[]` 每层独立，`stairs` 是全局数组。玩家站上楼梯格按空格切换层（见 `gameLogic.calculateNextState` 的 `USE_STAIR`）。
- **必须配对**：目标层同 x/y 需存在反向楼梯才可通行；编辑器放置一次会 push 一对配对楼梯。
- 注意：**当前生成器固定单层**（`multiLayerMode:false, layerCount:1, stairs:[]`），多层只能由编辑器/分享码产生。

## 4. 游戏机制要点

### 4.1 玩家移动与碰撞（`gameLogic.calculateNextState` 的 `MOVE`）

- 四方向，一次 1 格，**无斜向**；`activeCells` 为 false 的格不可进入。
- 碰撞顺序：边界 → `activeCells` → 两格间墙类型：
  - SOLID/GLASS → 阻挡；
  - ONE_WAY → 方向不匹配阻挡；
  - LOCKED → `p.keys < wall.keys` 阻挡，通过后**把墙体状态置为 EMPTY**（一次性消耗门）；
  - LETTER_DOOR → `currentState !== 'open'` 阻挡。

### 4.2 钥匙与数字门

- 钥匙拾取：每次成功动作后执行，`p.keys++` 并移除物品。钥匙计数**全局共享**（跨层）。
- 数字门通过后消费为 EMPTY，鬼也因此能穿过已开启的锁门（走动态 `wallStates`）。

### 4.3 幽灵 AI（对生成器设计最关键）

核心在 [gameLogic.js](src/core/gameLogic.js)：移动 / 视野 / 寻路三分支。

- **同步节奏**：玩家每成功走 1 格，鬼同步走 1 步（1:1）。
- **直线视野触发追捕**：要求鬼与玩家**同行或同列**，且中间无阻挡墙（非 EMPTY 且非 GLASS 的墙都阻挡，已开 LETTER_DOOR 除外）。看到后沿 BFS 最短路径追捕（每次只走 `path[1]`）。
- **失去目标**：只朝"玩家上一位置"走 1 步，**无持久记忆**；若仍看不到，下一回合回到静止。
- **看不到玩家时鬼完全不动**（无巡逻、无游荡）。
- 跨层：不能自由跨层，仅当玩家站在楼梯上时，配对层同格的鬼会瞬移过来追。

### 4.4 对生成器关键的不对称性清单

- 鬼**不能**穿 LOCKED/DOOR/ONE_WAY/GLASS，但能**透过玻璃看到玩家**（视野与移动不对称）。
- 玩家能透过玻璃看，但玻璃不可通行。
- 鬼的追捕**完全依赖可见性**：走廊的"直线视野"设计直接决定鬼能否威胁玩家——这是"有游戏性"生成的核心抓手（设计长直走廊 = 高威胁；多拐弯 = 庇护空间）。
- 已开字母门：鬼可透过看、可穿过；但对玩家的视野射线而言，**即使已开字母门也挡视线**（与鬼不对称）。

### 4.5 视野与战争迷雾

- `seenCells` 永久记录已探索格，未 seen 且未开调试视野的格子渲染为迷雾。
- 可见性 = 已探索格 + 四方向射线投射（遇阻挡墙停止）。**自动寻路只能规划已探索区域**。
- regular 模式固定揭示左下 3×3 出生房间。

### 4.6 胜负

- **胜利**：玩家位于当前层 `endPos` 即胜，无其它条件。
- **失败**：探索模式 `hp<=0`（被鬼抓到扣 1 hp 并回出生点）；死亡循环模式 `stamina<=0`。

## 5. 当前地图生成器与缺陷

生成入口：`generateFullMaze(width, height, ghostCount=3)`（[mazeGenerator.js](src/core/mazeGenerator.js)），唯一调用点 `GhostMazeGame.generateNewRandomMap()`（[main.js](src/main.js)），由"随机生成新地图"按钮触发。

**流程**：初始化全实心墙 → 打通左下 3×3 起始房间 → DFS 回溯生成完美迷宫 → 随机拆墙约 8% → BFS 最远死角选终点 → 2% 概率随机放普通门 → 终点旁放锁门 keys:3 → 随机放鬼 3 只 → 放 4 把钥匙、死角优先。

**缺陷清单（后续 AI 生成要解决的目标）**：

1. **无游戏性**：DFS 完美迷宫 + 随机拆墙 + 随机撒点，结构千篇一律、无主题、无策略深度；没有为"直线视野追鬼""钥匙→锁门抉择"等核心机制做任何针对性设计。
2. **可解性无保障（最关键）**：钥匙(4) 与锁门需求(3) 只是"数量够"的硬编码启发式，**没有任何可达性/先后顺序校验**——钥匙可能被锁门隔开、孤立在不可达区域，导致玩家永远到不了终点。运行时**没有解性验证**：不可解时游戏只是软锁死（不崩溃、不判负，无限游荡）。
3. **钥匙/门/鬼纯随机**：门放置概率固定 2% 纯随机撒点；鬼随机放置无策略（不区分高/低威胁走廊）；钥匙 4 把无设计意图。
4. **无难度分级**：没有按地图大小/结构/鬼数调整难度曲线。
5. **无多层生成**：数据模型支持多层+楼梯，但生成器固定单层。

## 6. 可复用的算法/工具

- `pathfinding.js`（[pathfinding.js](src/core/pathfinding.js)）：
  - `calculateDistances(startNode, ...)`——无权 BFS 距离场，把 SOLID/LOCKED/ONE_WAY 当阻挡（**无视钥匙数**，纯拓扑距离）。
  - `findPlayerPath(start, end, config)`——BFS 路径，**已带钥匙感知**（LOCKED 需 `playerKeys >= keys` 才放行），且只走已探索格。适合做可解性验证的骨架。
- `mazeGenerator.js`：`createEmptyWalls`、`calculateDistances`（注意与 pathfinding 版判定不同——只把非 EMPTY 当阻挡）、`findFarthestEndCell`、`isPosInStartRoom`。
- **注意**：`mazeGenerator.js` 与 `pathfinding.js` 各有一个 `calculateDistances`，对墙的通过性判定**不一致**，跨模块引用时勿混用。

## 7. 开发方向：AI 算法生成/通关迷宫（重点）

**目标**：用 AI 算法替代当前的纯随机生成，产出**有游戏性且保证可解**的迷宫；并实现**求解器**用于自动通关验证与难度评估。"生成"是重点，"通关"服务于验证与难度设计。

**"游戏性"在本游戏中的落点**（基于第 4 节的机制）：

- **视野与追鬼**：利用"直线视野"设计走廊与岔路——长直走廊让鬼有威胁、拐角与房间提供庇护；鬼位应放在高视野价值的位置，而非纯随机。
- **钥匙→锁门路径抉择**：让每把锁门前的钥匙构成"绕路/冒险"的取舍（钥匙在鬼的巡逻视野内或需走回头路）。
- **可解性硬约束**：终点必须可达；**每把锁门所需钥匙必须在其"钥匙序"中先行可达**（先拿到 ≥ keys 把钥匙才能开对应锁）；多层时所有层经楼梯连通。
- **迷雾公平性**：可解路径应落在玩家"看到就能利用"的可视可达范围内。

**建议路线（供后续会话参考，非本次实现）**：

1. **可解性验证器**：复用 BFS + 钥匙感知寻路，实现"给定 mapData → 是否存在一条从起点到终点、可满足所有钥匙约束的路径"的判定（含多层）。
2. **过程式约束生成**：先设计主路径（起点→终点）→ 主干道旁挂锁门房间与钥匙房间 → 用墙体/拐弯设计视野关系 → 布置鬼与庇护点。
3. **评分/进化方法**：定义可量化的游戏性指标（路径长度/钥匙序深度/视野暴露度/死路数等），对候选地图打分或做进化搜索。
4. **求解器**：实现自动通关（含幽灵躲避），用于验证可解性、校准难度分级、测试新生成器回归。
5. **可选扩展**：多层地图生成（数据模型已支持，需填充配对 `stairs` 并保证层间连通）。

**当前无任何现成验证器**：钥匙够不够开全部锁、跨层连通、终点可达均无现成逻辑（`mazeGenerator` 的距离场不含钥匙约束）。这是新功能，需自行实现。

## 8. 开发约定

- **全部代码注释、文档、交流使用中文**。
- 保持**原生 ES Module、无构建工具、无新依赖**的现状；新增模块用 `import ... from './xxx.js'` 相对路径。
- 模块风格：尽量写成**纯函数/无 DOM 依赖**（参考 `gameLogic.js`、`pathfinding.js`、`editor.js`、`ui.js`），由 `main.js` 主类统一调度 UI。
- **改动数据形状时务必注意**：分享码协议 **v3**（`PROTOCOL_VERSION = 0x03`，见 [docs/protocol-v2.md](docs/protocol-v2.md)）——版本头 + 线性位流解析，**无启发式解码**；新增字段需更新编/解码器与协议文档，旧码预期报「分享码无效」。
- **数据源纪律（Phase 4 红线）**：游戏态读 `computeGameView`/controller 权威源，编辑器态读 `computeEditorView`/`editorDoc`；**禁止**在 main/inputHandler 里直读已删除的宿主镜像字段（width/hWalls/ghosts 等）。写操作一律走 `editorDoc.*`（编辑器）或 `controller.*`（游戏）。
- 修改生成器时，唯一调用点 [main.js](src/main.js) `generateNewRandomMap` 期望返回完整的 `mapData` 结构（见 3.3），尺寸限制 8–20。
- **改代码后跑 `npm test`**：11 个测试文件（dataSerializer/gameLogic/mapDefinition/editor/editorSession/gameController/mazeGenerator/pathfinding/inputHandler/viewSlice/clickToMove），含 golden 快照（[test/golden/](test/golden/)）。
