# 云端接手、验收与资料保存

更新：2026-10-15。当前云端多仓库环境已运行，两个main的写入凭据已通过实际推送验证；此前“待创建环境”“缺写凭据”是历史状态，见[旧迁移全文](archive/worklogs/codex-cloud-before-reorganization-20261013.md)。

## 接手当前任务

1. 保持同级ghost-maze与ghost-maze-ai，阅读两个AGENTS、本体[文档索引](README.md)和AI[当前状态](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/status.md)。设计前必读[方法](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/methodology.md)与[设计小册](map-design-guide.md)；按任务读[架构](architecture.md)。
2. 核对两个main、未提交修改、AI引擎内容锁与私人资料，不回退已有工作。默认main，隔离分支先说明原因。
3. Node.js22.21.1、Python3；本体不安装依赖，AI仓npm ci。运行npm run cloud:check，必须通过本体、AI、内容锁、原种子与22HTTP资产／旧独立页404／代理检查，不写真人反馈。
4. 本地联调从AI仓npm run cloud:serve -- 4206，入口/game/，四栏目在此同页切换；旧独立页404。需要实际公网预览时由本次环境取得地址，设置GHOST_MAZE_HOST=0.0.0.0和GHOST_MAZE_ORIGIN为真实协议＋主机后重启；localhost不冒充可访问链接。

当前共同规则锁为 `sha256:5861b72bee934007e2679b60f38e3820ad1e2302a6d0a309bb7a59793eefb109`；core内容实际改变才更新锁并重验相关证据；本轮历史／致死步结束态更新，物理模块逐字节相同，原种子保持。原seed、历史地图、反馈与录制保持原件，不能为通过检查覆盖不同资料。

## 产品入口与发布

地图与参考回放用https://ghostmaze.novic.cc/，新版地图集／编辑／回放为首页四栏目，帮助为弹窗，不打开用户侧边页。正式恢复版的旧入口不是新版兼容协议。Sites仅用于站点改动预览，用户明确验收通过后才把网站改动推送到 main。实施授权不等于发布授权，历史直接推送许可不沿用到新一轮。GitHub main推送触发Vercel部署，替代Netlify，域名未变；只核验实际推送，不检查正式站或部署。

目前无需API Key、训练服务或生产部署凭据。新地图按已授权任务设计与验证，只有用户明确选入才上架。用户2026-10-15已批准发布独立预览，现将验收版本合入main；主线恢复，后续新增站点调整仍需先预览。AI试玩skill保留，使用反馈到来后再优化。

## 私人资料与新任务

源码、当前说明、公开反馈摘要与证据通过Git保存；完整真人录制、未跟踪反馈、迁移资料与runs通过私人包保存，不公开上传私人原件。

恢复：在AI仓 `python3 scripts/restore-cloud-data.py <实际资料包路径>`，逐文件SHA-256核对，已有不同内容拒绝覆盖。新任务用最新资料包；需要保存环境安装或资料恢复流程时更新环境并重新发布，新任务仍需检查，环境保存不等于Git提交。

新增私人资料后：`python3 scripts/export-cloud-data.py artifacts/cloud-data-新日期或序号.zip`，使用新名，保留全部旧包与原件。导出会逐文件建清单并检查ZIP；按实际可用文件交付渠道提供，不能把只在临时云端存在称为用户已下载。

旧按钮时机分支与Git bundle在archives/cloud-migration，旧LLM资料在AI docs/archive；不作为另一套运行引擎或当前任务。初始云端环境准备指令、迁移源与本机备份边界保留在旧迁移全文，按需追溯。
