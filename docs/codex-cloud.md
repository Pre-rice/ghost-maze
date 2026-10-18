# 网站运行与协作

本仓库可独立开发，不需要其它仓库、训练环境或 API Key。协作标准唯一入口为[AGENTS](../AGENTS.md)；云端 Codex 负责较大改动，本地 DeepSeek 负责小修，双方以具体任务范围避免冲突。

## 接手与运行

1. 阅读 AGENTS，核对本仓 main、origin/main 和未提交修改；保留用户及另一位协作者的工作。
2. 使用 Node.js 22（已验收 22.21.1）运行测试；打包另外需要 Python 3。网站无构建步骤，无需 npm install。
3. 在本仓运行静态服务器，例如 `python3 -m http.server 8000 --bind 127.0.0.1`，访问 `http://127.0.0.1:8000/`。不能用 file://。
4. JavaScript 修改运行 `npm test`；规则或试玩运行包变化另核对 `node scripts/package-playtest.mjs --check`。纯文档检查链接与事实。

云端需要可访问的界面预览时使用 Sites，给出实际入口；localhost 不冒充用户可访问链接。四栏目共用首页，帮助为弹窗，不恢复旧独立页。

## 同步与发布

开工及推送前 fetch；可快进时快进，有双方提交时正常合并，不回退或覆盖。共享文档和生成物由当前任务负责方同步，小步提交并尽快推送。

网站界面与交互先预览，用户验收后上线；main 推送触发 Vercel。只核验推送，不检查正式站或部署。地图、回放使用 https://ghostmaze.novic.cc/。

试玩技能通过[GitHub Release](https://github.com/Pre-rice/ghost-maze/releases)分发，维护步骤见[技能说明](ai-playtest.md)。版本标签只发布技能，不改变网站部署方式。
