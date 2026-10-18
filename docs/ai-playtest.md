# AI 自主试玩 skill

手动调用，让 AI 读取文字局面、自主选择动作，由真实游戏引擎推进，最后交付实际过程、关键发现、评价、感受与回放。普通 ChatGPT 聊天优先，兼容 Codex；不通过程序搜索通关路线。

## 下载与使用

[下载最新版本](https://github.com/Pre-rice/ghost-maze/releases/latest) · [全部历史版本](https://github.com/Pre-rice/ghost-maze/releases)

- `ghostmaze-playtest-skill.zip`：独立技能包。
- `ghostmaze-playtest-plugin.zip`：同一个技能的插件封装，不含在线服务。
- `SHA256SUMS.txt`、`manifest.json`：下载校验与固定引擎版本。

使用当前账号支持的技能上传／插件安装入口。安装后显式选择“鬼迷宫试玩”或用 @ 调用；Codex 在仓库中可用 `$ghostmaze-playtest`。仓库文件和 Release 下载不会自动安装到 ChatGPT。普通聊天需能读取随包资源、实际执行 JavaScript 并返回结果、连续保存 session 或传递恢复码；具体安装能力以宿主为准。

```text
用鬼迷宫试玩这个地图：〈地图链接或分享码〉。自主完成，交付过程、评价和感受。

不读取规则，自主探索；沿用本对话已有经验。

要求最短步数通关，交付过程与感受。
```

默认知道规则、地图答案未知。探索规则模式不读取独立规则文件；最短挑战只提供行动前已证明的目标步数，不提供路线，也不提供中途剩余距离。提供 map+save 可从存档继续；map+replay 默认忽略回放，避免获得答案。同一对话可继承实际经验，不能伪装失忆或首次盲玩。

详细规范与文字局面含义见[技能源](../.agents/skills/ghostmaze-playtest/SKILL.md)、[操作说明](../.agents/skills/ghostmaze-playtest/references/controls.md)和[运行方法](../.agents/skills/ghostmaze-playtest/references/runtime.md)。

## 过程、感受与恢复

一次调用自主操作和试错，不逐步等待指示。记录困惑、认识变化与实际验证；没有明显顿悟、尚未通关或执行中断时如实交付，不要求每张图都称赞。

记录保留撤销掉的尝试、死亡、重置、存档和笔记，交付正式站回放与完整试玩文件。AI 体验与真人反馈分别保存，不自动写入训练库或地图集。直接执行的未知规则模式依靠“不读源码”的规范，不构成技术保密隔离。

每个版本固定随包引擎；旧试玩记录用原版本恢复，不能中途静默换规则。1.0.0 的实际 JavaScript 工程演练、完整记录和提示条件随[历史版本](https://github.com/Pre-rice/ghost-maze/releases/tag/playtest-v1.0.0)保留。

## 维护与发布

唯一源码为 `.agents/skills/ghostmaze-playtest/` 与本体 `src/playtest/`、`src/core/`；没有独立远程服务。修改规则或技能后，从本体生成资产并更新技能版本；只改网页或地图集不发布技能新版。

```sh
node scripts/package-playtest.mjs
node scripts/package-playtest.mjs --check
npm test
node scripts/prepare-playtest-release.mjs --output artifacts/ghostmaze-playtest
```

版本号在打包脚本中唯一维护，采用 `playtest-vX.Y.Z` 标签，与网站版本独立。准备脚本校验源码资产，生成独立包／插件包、manifest、SHA256SUMS、源码提交与使用说明；输出目录不进 Git。

完成提交并同步 main 后，给发布提交打匹配版本标签并推送。GitHub Actions 只在 `playtest-v*` 标签触发：核对标签与版本、运行本体测试、打包，先上传到发布草稿，再公开 Release。已发布版本不可覆盖；失败保留草稿便于查证，不将不完整安装包标成正式版本。

三个既有版本从原交付目录迁入 Release，ZIP 保持原字节；来源提交、校验及原验证记录随版本保留。历史标签对应当时源码，不重新运行旧版机制生成新包。 [迁移及公开下载核验](archive/playtest-release-migration-20261018.json)记录三个版本、六个安装包的原件一致性和源码标签。

## 已验收与账号端反馈

随包引擎与源码、独立运行、连续操作、恢复、最短目标只返回步数及 Codex 脚本适配有工程验收；原验证记录在对应 Release。源码改动后仍需按本次实际测试报告结果。

2026-10-18，用户实际反馈：**“普通 ChatGPT 账号端可安装，效果尚可。”** 安装可用性已有用户确认；具体关卡、操作记录与分模式细节尚未提供，不扩大为全部场景已验收。[反馈原文与范围](archive/playtest-account-feedback-20261018.json)。历史工程验证和原 Release 记录保留，不重写为新的账号端测试。
