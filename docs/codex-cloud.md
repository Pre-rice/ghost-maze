# 云端接手、验收与资料保存

更新：2026-10-15。当前云端多仓库环境已运行，两个main的写入凭据已通过实际推送验证；此前“待创建环境”“缺写凭据”是历史状态，见[旧迁移全文](archive/worklogs/codex-cloud-before-reorganization-20261013.md)。

## 接手当前任务

1. 保持同级ghost-maze与ghost-maze-ai，阅读两个AGENTS、本体[文档索引](README.md)和AI[当前状态](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/status.md)。设计前必读[方法](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/methodology.md)与[设计小册](map-design-guide.md)；按任务读[架构](architecture.md)。
2. 核对两个main、未提交修改、AI引擎内容锁与私人资料，不回退已有工作。默认main，隔离分支先说明原因。
3. Node.js22.21.1、Python3；本体不安装依赖，AI仓npm ci。运行npm run cloud:check，必须通过本体、AI、内容锁、原种子与22HTTP资产／旧独立页404／代理检查，不写真人反馈。
4. 本地联调从AI仓npm run cloud:serve -- 4206，入口/game/，四栏目在此同页切换；旧独立页404。需要实际公网预览时由本次环境取得地址，设置GHOST_MAZE_HOST=0.0.0.0和GHOST_MAZE_ORIGIN为真实协议＋主机后重启；localhost不冒充可访问链接。

当前共同规则锁为 `sha256:762b163064dac2464603c002d5a46782675f0a78274e93f68aa36555683cd91a`；2026-10-18按用户要求修正关门当步追击并获明确发布授权，《后路》按用户决定移除，其余十四张地图全部最优路线与逐步局面保持；《调度》原50步失效，现最优70步，地图本身不改。原种子、历史地图与反馈原件保持。

## 分工与避免冲突

2026-10-18按用户要求固定双边分工：云端Codex以`ghost-maze-ai`推进主线（地图设计、搜索、证书、目录与AI文档），主线需要的本体改动也由云端做（`src/core/`、`src/maps/`、试玩包脚本与资产、`releases/`及对应文档）；本地DeepSeek负责本体网页与交互（`index.html`、`styles.css`、`src/app.js`、`src/main.js`、`src/view/`、`src/editor/`、`src/site/`、`src/helpContent.js`）及其验收记录。两边都不在对方正在改的同一处动手。

| 范围 | 默认由谁改 | 约束 |
| --- | --- | --- |
| AI仓`ghost-maze-ai` | 云端 | 本地不改 |
| `src/core/`、`src/maps/` | 云端 | 本地尽量不改；确需改动（如纯显示层的完成态字段）只做最小改动，先说清缘由与影响 |
| 网页与交互（上列本体网页文件） | 本地 | 云端只在主线必须时动，改前说明 |
| 生成物：`.agents/skills/ghostmaze-playtest/assets/`、`releases/`、`src/maps/optimal-cache.js` | 改核心的那一方 | 另一方不手改，也不“修复”锁值 |
| 共享文档：AGENTS、README、docs/README、docs/architecture、docs/codex-cloud | 两边都可能改 | 只做最小改动，推送前先fetch，冲突时保留双方 |

- 开工先`git fetch`看`origin/main`；落后先`git pull --ff-only`。小步提交、尽快推送，一个可用改动推一次，缩短双边同时修改的窗口。
- 推送前再fetch；远端前进时用`git merge origin/main`正常合并，保留双方提交。禁止rebase、reset、强推或覆盖。
- 只有真实核心改动才更新共同规则锁。改`src/core/`、试玩包或最优缓存的同一方，在同一次推送里重新生成资产（`node scripts/package-playtest.mjs`）、需要时重算最优缓存与`releases/`，并保持`node scripts/package-playtest.mjs --check`通过。
- 冲突先查双方原意再合并（通常取并集），不删对方改动；合并后跑`npm test`，涉及界面再补一次浏览器验收。
- 验收各管各的：本体改动跑`npm test`并在本地浏览器验收；AI仓主线在AI仓跑`npm run cloud:check`。

## 产品入口与发布

地图与参考回放用https://ghostmaze.novic.cc/，新版地图集／编辑／回放为首页四栏目，帮助为弹窗，不打开用户侧边页。正式恢复版的旧入口不是新版兼容协议。Sites仅用于站点改动预览，用户明确验收通过后才把网站改动推送到 main。实施授权不等于发布授权，历史直接推送许可不沿用到新一轮。GitHub main推送触发Vercel部署，替代Netlify，域名未变；只核验实际推送，不检查正式站或部署。

目前无需API Key、训练服务或生产部署凭据。新地图按已授权任务设计与验证，只有用户明确选入才上架。用户2026-10-15已批准发布独立预览，现将验收版本合入main；主线恢复，后续新增站点调整仍需先预览。AI试玩skill保留，使用反馈到来后再优化。

## 私人资料与新任务

源码、当前说明、公开反馈摘要与证据通过Git保存；完整真人录制、未跟踪反馈、迁移资料与runs通过私人包保存，不公开上传私人原件。

恢复：在AI仓 `python3 scripts/restore-cloud-data.py <实际资料包路径>`，逐文件SHA-256核对，已有不同内容拒绝覆盖。新任务用最新资料包；需要保存环境安装或资料恢复流程时更新环境并重新发布，新任务仍需检查，环境保存不等于Git提交。

新增私人资料后：`python3 scripts/export-cloud-data.py artifacts/cloud-data-新日期或序号.zip`，使用新名，保留全部旧包与原件。导出会逐文件建清单并检查ZIP；按实际可用文件交付渠道提供，不能把只在临时云端存在称为用户已下载。

旧按钮时机分支与Git bundle在archives/cloud-migration，旧LLM资料在AI docs/archive；不作为另一套运行引擎或当前任务。初始云端环境准备指令、迁移源与本机备份边界保留在旧迁移全文，按需追溯。
