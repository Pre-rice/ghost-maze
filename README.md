# 鬼迷宫

纯前端迷宫解谜游戏。玩家收集钥匙、切换门、引动和安置鬼，抵达终点；支持探索／死亡循环、单层／多层、地图分享、撤回与同页回放。

[正式游戏](https://ghostmaze.novic.cc/) · [地图集](https://ghostmaze.novic.cc/maps.html) · [编辑器](https://ghostmaze.novic.cc/editor.html) · [帮助](https://ghostmaze.novic.cc/help.html)

## 地图与设计

地图集现十二张，按首次交付顺序排列。《楼间》按用户决定作为基础多层入门关加入，原十一张地图和证书保持。地图集不展示图像、评述或参考解法，仅有基本数量和试玩入口；试玩中的“求解”提供最优解回放。

- [地图集设计小册](docs/map-design-guide.md)：给人查阅的基本信息、设计思想、尤里卡时刻与真实简评；内容包含解谜关键。
- [持续设计方法](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/methodology.md)：依据正反反馈形成的经验、设计卡与反馈循环。
- [地图总目录](docs/ai-map-catalog.md)：全部已保存作品、对照、参考及反馈来源，按需查证；历史图不自动获得现行规则或趣味认证。

## 本地运行与验收

本体无需安装依赖，用静态HTTP服务运行，不能直接 file://。使用 Node.js 22.21.1；本体 npm test，两仓统一验收从同级 AI 仓 npm run cloud:check。共用服务从 AI 仓 npm run cloud:serve -- 4206，入口 /game/。

地图和回放分享直接复制地址栏，回放默认暂停：?map=地图码 与 ?map=地图码&replay=操作码。新码协议见[分享说明](docs/share-codes.md)，不通过猜测旧码兼容历史记录。

以两个 main 开发，完成及时提交推送。GitHub main 自动部署至 Vercel；只核验推送，不检查正式站或部署。地图试玩、回放使用正式域名；Sites只作站点改动预览，用户自行访问。

[协作指引](AGENTS.md) · [文档索引](docs/README.md) · [当前架构](docs/architecture.md) · [云端准备与私人资料](docs/codex-cloud.md)

当前阶段已完成上架排序与设计文档重整，交付报告后按用户要求暂停；没有新出题或启动训练。旧产品升级、发布与验收过程完整保留在[历史档案](docs/archive/README.md)，旧数字不表示当前状态。
