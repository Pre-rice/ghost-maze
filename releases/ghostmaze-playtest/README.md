# 鬼迷宫试玩 · 1.0.2

已实现手动调用、自主试玩、文字局面、完整过程与感受记录，支持已知规则／探索规则、普通通关／最短挑战。引擎随包直接执行，不依赖在线服务。

- [独立skill安装包](ghostmaze-playtest-skill.zip)：用于支持技能上传的入口。
- [插件封装安装包](ghostmaze-playtest-plugin.zip)：相同skill的插件包装，不含在线工具或额外服务。
- [安装与调用说明](../../.agents/skills/ghostmaze-playtest/README.md)。
- [1.0.0工程演练报告](1.0.0/sample-report.md)及[完整记录](1.0.0/javascript-play-record.json)。
- [执行链路验收记录](verification.json)。
- [文件校验](SHA256SUMS.txt)。

在GitHub文件页选择下载原文件取得ZIP；仓库中的文件不会自动安装到ChatGPT。首次安装使用当前账号支持的技能上传／插件入口，之后在新聊天中显式选择“鬼迷宫试玩”或用@调用；Codex用`$ghostmaze-playtest`。

示例：

> 用鬼迷宫试玩这个地图：〈地图链接〉。自主完成，交付过程、评价和感受。

> 不读取规则，自主探索。

> 要求最短步数通关。

已验收：受限JavaScript连续操作、跨执行恢复、Codex脚本适配、安装包脱离仓库运行、目标步数隐藏路线，以及两仓统一检查。

**实际缺失：普通ChatGPT账号端的安装和首次调用尚未实测。**当前执行器验证不等于账号端安装完成；支持范围以宿主实际技能安装和资源执行能力为准。直接执行的未知规则模式也依靠不阅读源码的规范，不构成技术保密隔离。

本次同步按用户明确授权发布的关门当步追击修正。旧安装包、恢复码与演练证据保存在1.0.0与1.0.1目录，不静默迁移旧记录。文件由`node scripts/package-playtest.mjs --output releases/ghostmaze-playtest`生成，不手改ZIP或引擎资产。
