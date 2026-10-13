> 历史资料：保留整理前的判断与过程，不代表当前任务或状态。现行入口见[文档索引](../../README.md)。

# 鬼争位与边界机制审查

## 2026-10-12 最新标准与《借影》维护

用户已明确放宽此前“所有可达分支都不得重合”的标准：夹击死亡无需处理；非最优通关走法中的重合可以忽略。当前检查遍历全部并列最优无伤无复活解，任一最优解经过非死亡重合即拒绝。不能只核验一条安全最优解。玻璃换成实墙的全物理策略一致性仍保留。下方早期严格审查和七段回放作为历史证据，不再表示六张图都需维护。

《借影》维护仅补一扇 A 门，最短恢复 59，原动作序列、玩家／鬼／取物逐步相同，控距走位安置到关闭 A 门下方的巧妙操作保留。禁止那只鬼从侧面进入这一停位，独立 A* 与 BFS 均穷尽而无伤无复活解。此前这项维护因错误分支可夹击被否决；现在用户明确允许死亡夹击，重新复核后可采用，未改变物理规则。

其他八张已确认地图的地图码和参考回放码逐字保持，九张图均通过全部最优解审查。用户优化图、《借位》、两个原种子及两个评审样例也通过。三张已退役候选不恢复；其他历史失败提案未重新求解。

验收：本体 159、AI 131 项，规则锁与原种子、11 HTTP 入口和代理来源全部通过；维护图地图码／操作码往返与按钮依附通过。浏览器14项通过、零脚本错误，核对了控距安置关键步与59步终局。私人预览已更新，当前 main 按已有发布授权同步，不检查 Vercel 或正式站。没有新谜题生成或模型训练。

[维护版与原解法](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/borrowed-shelter-overlapfix-20261012/README.md)；[最新审查](https://github.com/Pre-rice/ghost-maze-ai/blob/main/data/manifests/optimal-boundaries-20261012.json)。


更新：2026-10-12。两仓继续本地 main；私人预览已更新，正式仓库推送暂留到受影响地图的处理决定明确之后。没有访问 Vercel 或正式站。

## 最终机制

争同一格时，仍看得到操作后玩家的鬼优先；最高优先级相同者共同进入并重合。夹击玩家时所有能到达玩家格的鬼共同进入，死亡只扣一次生命。楼梯追击与本层鬼统一处理，不绕过占位和优先规则。重合格显示数量，避免隐藏鬼数。用户先后将“对称停下”改为“夹击重合”和“争空格也重合”，以最后两项为准。

鬼编号与列表排列不参与决定。所有九张图的 8086 个无伤可达局面、74840 次排列与编号互换后继比较通过，包括死亡转移。《易位》第 16／32 步局面相同，向上结果现相同；原图已废弃。

后续呈现或复用的地图必须穷尽全部无伤可达状态及每个有效操作的后继，死亡分支也检查：任何鬼重合均拒绝，玻璃全部改成实墙必须保持物理策略结果一致。预算未完成是未知，不能通过。评审包和设计档案均接入这个检查；其余历史失败提案不批量求解，不作为当前复用库。

## 九张已上架图

所有原参考动作仍能无伤通关，且各步玩家、鬼、物品和机关状态完全相同。BFS 与 A* 独立比较最优结果：

| 地图 | 原最短 | 当前最短 | 原路线仍最优 | 全部可达分支的边界 |
| --- | --- | --- | --- | --- |
| 《后路》 | 59 | 59 | 是 | 错误分支可夹击重合 |
| 《换岗》 | 68 | 68 | 是 | 错误分支可夹击重合 |
| 《换边》 | 28 | 28 | 是 | 通过 |
| 《回环》 | 70 | 70 | 是 | 错误分支可夹击重合 |
| 《回位》 | 35 | 35 | 是 | 错误分支可夹击重合 |
| 《借影》 | 59 | 57 | 否 | 错误分支可夹击重合 |
| 《归途》 | 39 | 39 | 是 | 错误分支可夹击重合 |
| 《接力》 | 31 | 31 | 是 | 通过 |
| 《错位》 | 37 | 37 | 是 | 通过 |

《借影》新 57 步最短解利用非死亡重合，原 59 步仍无伤但不再最优。《后路》《换岗》《回环》《回位》《借影》《归途》能在错误走法中夹击重合；这与最优解是否变化是两个问题。六张已确认原图和原参考码保持，维护或下架需用户决定。此前针对“双方停下”规则找到的单扇 A 门修复虽保留 59 步，却仍有夹击分支，已否决，不作为通过最终审查的维护版。

## 其他地图

用户优化图、《借位》、两个运行种子和两个默认评审样例全部穷尽通过。两个功能性玻璃精简题与《易位》已删除活跃地图文件、撤销试玩目录入口，旧证书及真实反馈只作历史保存，不继承当前规则有效性。其余未拟复用的历史母图、消融和失败编辑不审查。

## 同时清理的边界

- 终点已有鬼时先判碰撞，不能踩鬼通关。空终点仍是到达即完成，按原已确认规则在后续追击前结束。
- 同时夹击只扣一次生命，不因争格获得免死。
- 楼梯的追击和争位也与编号无关，入场鬼在同一个动作中不再多走一步。
- 出生格上的钥匙立即拾取，出生格即终点立即零步胜利；出生点不能预放鬼。
- 探索模式出生点被鬼占据时不能静默复活，死亡界面说明原因，仍可撤回、回存档或重置。

尚值得商榷的原机制是透过玻璃看见目标后，遇到等长绕路会按固定方向选路，旋转图可能改变选择。这未被改成新的玻璃规则；当前用“玻璃换墙全部物理结果一致”的设计硬检查阻止其参与解谜。按钮切门后按新门态判断视线、无效移动不推进鬼、空终点到达即胜均保留为可明确描述的一致规则。未发现还依赖编号、轨迹、计步或隐藏持久追逐记忆的迁移差异；不将这一结论扩大成任何未来元素都绝无边界。

## 验收与记录

`npm run cloud:check` 通过：本体 159、AI 129 项，共同规则锁与两份原种子、11 个 HTTP 入口及代理来源检查通过。浏览器 11 项全部通过、脚本错误为零，覆盖争位、重合数量、夹击扣血、死亡撤回、占鬼终点、出生物品／终点及复活阻断提示。

私人预览：https://ghostmaze-ui-preview-20261012.prerice.chatgpt.site。用户自行访问，不打开侧边 Page。仅进行了受影响地图的维护对照，没有新谜题交付或模型训练。

批量证据：[规则审查清单](https://github.com/Pre-rice/ghost-maze-ai/blob/main/data/manifests/rule-boundaries-20261012.json)，复用范围：[当前地图库](https://github.com/Pre-rice/ghost-maze-ai/blob/main/data/manifests/puzzle-library-policy.json)。历史资料保留，不重写旧证书。

## 重合回放（2026-10-12）

用户要求查看产生鬼重合的回放。本次把已报告的六张图各一条真实夹击见证与《借影》57 步新最短解列在一起，全部按当前共同规则逐步重放，并检查地图码／操作码往返及页面历史回放。未修改原地图或原参考解法，不将错误走法当作质量标签。

点击回放默认从第 0 步暂停；可跳到表中步骤的前一步，再向前一步观察重合。六条死亡路线在首次重合处结束；《借影》57 步路线继续到通关。

| 地图／情形 | 首次重合步骤 | 总步数 | 回放 |
| --- | --- | --- | --- |
| 《后路》· 夹击死亡 | 28 | 28 | [查看](https://ghostmaze-ui-preview-20261012.prerice.chatgpt.site/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECMwEgLEBUBIBABhgAGGEAgA&replay=ACe-0I-PJm9eD6r_) |
| 《换岗》· 夹击死亡 | 30 | 30 | [查看](https://ghostmaze-ui-preview-20261012.prerice.chatgpt.site/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQCBGYCoCQEgAAAwIMIBA&replay=EK03CdqPJm9djDqv8A) |
| 《回环》· 夹击死亡 | 15 | 15 | [查看](https://ghostmaze-ui-preview-20261012.prerice.chatgpt.site/?map=AADBweHh4eDAwAE1YEKQICGUCQAgBXCqA4gTIKAkEQACgAEQJygnEFziCc5AkBIAABAgAxAgwA&replay=COhbsb4My2aI) |
| 《回位》· 夹击死亡 | 33 | 33 | [查看](https://ghostmaze-ui-preview-20261012.prerice.chatgpt.site/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguAXOAcAcAVAAAAAXOQXOcgUgRAuIAAAAwQAwgQAwggQ&replay=GNEbJuMv2XKdACDNVkA) |
| 《借影》· 夹击死亡 | 13 | 13 | [查看](https://ghostmaze-ui-preview-20261012.prerice.chatgpt.site/?map=AADAwGHh4eHh4AEdYCF8BeCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQQgAAECGAEGIEGGA&replay=GLqy0pkgP3TA) |
| 《归途》· 夹击死亡 | 41 | 41 | [查看](https://ghostmaze-ui-preview-20261012.prerice.chatgpt.site/?map=AADAwEDg4ODg4AED4CFcAXAhwEwS4FAQC5AcgOAacAAVAAJAKAtZgXEC5yBECIAACAGBQCEGGA&replay=GHbIXDkIJ9WgM-pbo9QpgA) |
| 《借影》· 利用重合的57步通关解 | 32 | 57 | [查看](https://ghostmaze-ui-preview-20261012.prerice.chatgpt.site/?map=AADAwGHh4eHh4AEdYCF8BeCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQQgAAECGAEGIEGGA&replay=GLqy0pkgP3SYiMld8nAqnMyC1wA) |
