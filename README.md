# 鬼迷宫

纯前端迷宫解谜游戏。玩家收集钥匙、切换门、引动和安置鬼，抵达终点；支持探索／死亡循环、单层／多层、地图分享、撤回与同页回放。

[正式游戏](https://ghostmaze.novic.cc/) · [四栏目独立预览](https://ghostmaze-ui-preview-20261012.prerice.chatgpt.site)

当前四栏目重整已获用户明确批准，正式发布到main；后续站点改动仍需先预览并认可。新版只有首页，地图／游玩／回放／编辑切换右框，帮助为弹窗。

## 地图与设计

地图集现十三张，按首次交付顺序排列。《楼间》按用户最新决定撤出，原版证书留档，本轮五图按用户提供版本更新，《周转》《同行》加入。新版地图栏目按最新要求展示方形全景、格数和鬼数，探索预览有限视野；无评述、钥匙数或参考解法。游玩“求解”在栏目内展示最优步数和回放入口。

- [AI自主试玩skill](docs/ai-playtest.md)：手动调用，交付自主试玩过程、关键发现、评价与感受。
- [地图集设计小册](docs/map-design-guide.md)：给人查阅的基本信息、设计思想、尤里卡时刻与真实简评；内容包含解谜关键。
- [持续设计方法](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/methodology.md)：依据正反反馈形成的经验、设计卡与反馈循环。
- [地图总目录](docs/ai-map-catalog.md)：全部已保存作品、对照、参考及反馈来源，按需查证；历史图不自动获得现行规则或趣味认证。

## 本地运行与验收

本体无需安装依赖，用静态HTTP服务运行，不能直接 file://。使用 Node.js 22.21.1；本体 npm test，两仓统一验收从同级 AI 仓 npm run cloud:check。共用服务从 AI 仓 npm run cloud:serve -- 4206，入口 /game/。

地图和回放分享直接复制地址栏，回放默认暂停；存档与回放复用同一操作编码：?map=地图码、&save=操作码、&replay=操作码；未完成草稿为?draft=草稿码。新码协议见[分享说明](docs/share-codes.md)，不通过猜测旧码兼容历史记录。

以两个 main 开发，完成及时提交推送。GitHub main 自动部署至 Vercel；只核验推送，不检查正式站或部署。地图试玩、回放使用正式域名；Sites只作站点改动预览，用户自行访问。

[协作指引](AGENTS.md) · [文档索引](docs/README.md) · [当前架构](docs/architecture.md) · [云端准备与私人资料](docs/codex-cloud.md)

当前按用户要求恢复主线，skill后续优化等待实际使用反馈；新图只有明确选入才上架。旧产品升级、发布与验收过程完整保留在[历史档案](docs/archive/README.md)，旧数字不表示当前状态。
