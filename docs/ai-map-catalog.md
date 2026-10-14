# AI 地图总目录

[地图集设计小册](map-design-guide.md)简要解释当前十一图的设计思想与尤里卡时刻；[文档索引](README.md)区分现行约定和历史档案。本目录仍统一保存所有历史地图、参考与真实简评，按需查证。公开源码与反馈摘要使用GitHub入口；runs及私人录制链接只用于已恢复资料的本地资料库，不代表公开下载。

2026-10-14 当前地图集11张，按首次交付顺序：《错位》《接力》《归途》《借影》《回环》《回位》《换边》《换岗》《后路》《暂驻》《再借》。楼梯修正规则保持，原十一张单层图全部最优路线不变；《楼间》完成规则修补后按用户最新决定撤出；原图、修补版和先前入门评述留存。《留客》旧稿退役。下列2026-10-13／10-12段为历史快照。

## 2026-10-14 新候选：《相让》

单层16格、两鬼、一个A按钮、两反相A门、一普通门，无钥匙／玻璃／楼梯；初态可以观察，目标可见。原26格大环被短解否定，删去重复按钮与未用环路。用户认为复杂性太低、随手即解，主要只需考虑第2步后左或下；未入集。[原话及复盘](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/reciprocal-braking-review-20261014.md)。[作品与来源](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/reciprocal-braking-20261014/README.md)。

[试玩](https://ghostmaze.novic.cc/?map=AADAICg4eGAwMAEkgISgHIBACAuBACgkAAUAAUAqgRBCC5AJAWIAAAE)

<details>
<summary>设计思想与参考（含答案）</summary>

同一对鬼互换帮忙与受挡：先右鬼阻北鬼，再北鬼阻右鬼，分别准备两个停位；最后从普通门的一侧到按钮，使跟随鬼留在另一侧，安全切门。先向下脱身与直接到按钮的安全前缀分别穷尽续解无解。预期未达到挑战目标：第二次制动自动由安全路线带出，未成为新的主动规划。保留原证据和新的负反馈。

最优17，共三种上方收尾；全部最优无重合、去终点仍安全、指定实际入场与码往返一致。十项产品网页检查通过，未检查正式站或部署。[参考回放](https://ghostmaze.novic.cc/?map=AADAICg4eGAwMAEkgISgHIBACAuBACgkAAUAAUAqgRBCC5AJAWIAAAE&replay=GHQGozmZ3ZAPAA)，网站求解可查看全部最优入口。

</details>

## 2026-10-14 多层反馈与撤图

《隔岸》明确不入集：楼梯未承担关键作用，两层往返与两个普通区域往返没有区别，切层增加操作复杂度且不便观察。《楼间》按新决定撤出：每步几乎只有一种选择，毫无思考难度。保留先前认可入门用途及后来的修补，不把上架历史改写为从未获选；原十一张单层图及顺序保持。[完整评述与设计复盘](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/multilayer-rejection-20261014.md)。

## 2026-10-14 新候选：《隔岸》

两层13格、一鬼、两个A按钮、三A门、一普通门、两对楼梯，无钥匙／玻璃；出生直接在下层按钮，初态可观察。删掉原本不改变核心的下层鬼、其走廊和突出出生格。用户明确不入集；认为楼梯只增加操作与观察负担。[作品与来源](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/control-face-20261014/README.md)。

[试玩](https://ghostmaze.novic.cc/?map=AWN4wMDA2MjIwMDA4qDDwMDI0ACEICDEyLCAASjH2NwMkuVwYGWoYWBuiGFoLGAByTMyzGhUEAErdWAqAAA)

<details>
<summary>设计思想与参考（含答案）</summary>

同组门的两个按钮并不一样安全：留在上层再按A会被鬼追到，需要经普通门把鬼留在上层，回到下层远程开门，再由另一处楼梯绕回目标侧。两处可达局面只有玩家可见楼层不同，其余鬼位、门态、平面坐标、资源和生命相同。预期发现是“换控制面”，不是搬鬼必要或隐藏判定。

唯一最优19，原图所有通关都需要上层操作后下层重开；全部最优无重合、去终点仍安全，指定真正入场一致。九项产品网页检查通过，未检查正式站或部署。此前预期未获认可：用户指出改成普通区域仍有相同解谜思路；机械必要性不足以证明楼梯价值。[参考回放](https://ghostmaze.novic.cc/?map=AWN4wMDA2MjIwMDA4qDDwMDI0ACEICDEyLCAASjH2NwMkuVwYGWoYWBuiGFoLGAByTMyzGhUEAErdWAqAAA&replay=NuJdNPCoRJb52YA)。

</details>

## 2026-10-14 新候选：《腾位》

20格、三鬼、一个A按钮、一扇A门，零钥匙／普通门／玻璃；初态可以观察，出口可见。由保护位置研究逆向构造，删掉任务、整组B、第四鬼及三扇门；原件和反例留存。尚无真人评述，未入集。[作品与设计卡](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/protective-slot-20261014/README.md)。

[试玩](https://ghostmaze.novic.cc/?map=AADAAAD9_PAQEBGZYFJBkAGAAABVUlciUoqAAAAAAABAkBEIBQCgAAA)

<details>
<summary>设计思想与参考（含答案）</summary>

先让出口鬼优先进入门后，阻住侧鬼，而另一鬼继续靠近，改变左侧鬼的间距。关A后释放队列，另一鬼接替相同门后的保护位置，出口鬼改为回程追者。自然先引左鬼、或者只按A困出口鬼的前缀都经两种环境穷尽续解无解。初期制动及真实停位交接分别为原图全部通关必要；不以先后经过同格冒充保护。

唯一最优23，全部最优无重合，去终点仍安全；实际入场、全部可达动作六排列／变编号与码往返通过。七项本地产品网页检查通过，未检查正式站或部署。预期关键发现未获用户确认，不自评精妙，不继承《再借》好评。[参考回放](https://ghostmaze.novic.cc/?map=AADAAAD9_PAQEBGZYFJBkAGAAABVUlciUoqAAAAAAABAkBEIBQCgAAA&replay=CMZj1sChD0qpf1Q)。

</details>

## 2026-10-14 《楼间》规则修补

原布局仍是两层11格、一鬼、一个A按钮、两对楼梯；把初始鬼后移、目标门初态关闭，删除已经不再影响解法的普通门，保留两扇同相A门。最短19且唯一，所有通关至少两次鬼跨层；全部最优不重合、去终点仍安全、真实冷入口一致。10项产品网页检查通过，未检查正式站或部署。

这是延续已选入门位置的维护，不新增地图集位置或独立质量样本。原图、原26步证据与原评述不覆盖，修补版没有新的真人评价。[作品及来源](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/stair-relocation-repair-20261014/README.md)。

[试玩](https://ghostmaze.novic.cc/?map=AWN4wMDAwOR8gIGBiYGBgcVhgQcDGDCt4nAAMzjkQKQLkwILkG7Y6agBkWdllGmAsBQcAA)

<details>
<summary>参考与设计关键（含答案）</summary>

先开A放出鬼，再经另一处楼梯重新引近它，随后下楼带走；沿下层返回原楼梯，借转向保持距离安全取目标。不能依赖抵达楼梯口后的停顿，楼梯两端抵达即互见追击。

[回放](https://ghostmaze.novic.cc/?map=AWN4wMDAwOR8gIGBiYGBgcVhgQcDGDCt4nAAMzjkQKQLkwILkG7Y6agBkWdllGmAsBQcAA&replay=NnxkDKcpsteXxcA)。修补版沿用原多层亲缘组，不作为新的真人好评或路线。

</details>

## 2026-10-13 已退役：《留客》

两层14格、两鬼，一个A按钮。原设计利用了另一端的追击延迟，规则修正后原参考第3步死亡，穷尽无伤无复活状态后无解。未入集，撤回可交付候选；不把原22步证书当作现行有效。原件、旧判断和未获质量评价的事实保留在[生成时提交](https://github.com/Pre-rice/ghost-maze-ai/tree/084568b/examples/stair-valve-20261013)与私人研究包。[退役说明](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/stair-valve-20261013/README.md)。

## 2026-10-13 上架：《楼间》（多层入门）

原版状态：用户上架决定与原图保持；楼梯机制修正后原参考第3步死亡，原图无解，10-14已另存修补版并维护原地图集位置。以下26步与搬运证据是生成时快照，不代表当前有效。

两层共11格、一鬼、一个A按钮、两反相A门、一普通门、两对楼梯，无钥匙或玻璃。用户定位为“基础的多层谜题”，适合作为简单起始作品，让玩家了解楼梯基本机制，明确要求上架；未确认强顿悟或高难度。[真实评述](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/stair-relocation-review-20261013.md)。最初第二鬼的熟悉困鬼流程已按删减对照去除。见[作品与设计卡](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/stair-relocation-20261013/README.md)。

[正式站试玩](https://ghostmaze.novic.cc/?map=AWN4wMDAwOR8gIGBiYGBgcWxi6WBAQy0FrRAGI0gFSwOUgwODAwc3FOEoPIBgifAtAMTCwA)。网站“求解”提供全部最优解入口。

<details>
<summary>关键发现与参考（含答案）</summary>

第一次送鬼下楼，会在原开关的楼梯另一端留下危险；需要把它重新引上来，经另一条楼梯再送下去，最后借普通门让它离开楼梯位置。独立最短26，唯一最优，所有无伤通关至少三次鬼跨层；无重合、无玻璃、去终点仍安全。指定下层左侧实际入场与参考逐步一致，八项本地网站检查通过。[回放](https://ghostmaze.novic.cc/?map=AWN4wMDAwOR8gIGBiYGBgcWxi6WBAQy0FrRAGI0gFSwOUgwODAwc3FOEoPIBgifAtAMTCwA&replay=OmPml1EpstcImB8UeA)。设计者预期关键不记作用户实际顿悟；最优规划资料同步新清单，不混作高质量标签或真人路线。

</details>

<!-- current-rule-audit:start -->
## 2026-10-12 九图规则审查（当时快照）

更新：2026-10-12。以下为新规则的有效审查；后面的旧资料保留真实评述，不能作为已通过当前规则的复用名单。

鬼争位以是否仍能看到玩家新位置决定优先；地位相同者共同入格。用户最新明确：夹击死亡与非最优重合允许；全部并列最优解不得经过鬼重合。玻璃换成实墙仍须保持全部物理策略结果一致。

| 已上架地图 | 原参考路线 | 当前最短 | 原动作与鬼位相同 | 设计边界 |
| --- | --- | --- | --- | --- |
| [《后路》](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECMwEgLEBUBIBABhgAGGEAgA) | 59 | 59 | 是 | 全部最优解通过 |
| [《换岗》](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQCBGYCoCQEgAAAwIMIBA) | 68 | 68 | 是 | 全部最优解通过 |
| [《换边》](https://ghostmaze.novic.cc/?map=AWM4wZDw4UECAwNjWIMLkwIvA8MCF-4vAqwMILCFs0T4C0sDiMnEAQA) | 28 | 28 | 是 | 全部最优解通过 |
| [《回环》](https://ghostmaze.novic.cc/?map=AADBweHh4eDAwAE1YEKQICGUCQAgBXCqA4gTIKAkEQACgAEQJygnEFziCc5AkBIAABAgAxAgwA) | 70 | 70 | 是 | 全部最优解通过 |
| [《回位》](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguAXOAcAcAVAAAAAXOQXOcgUgRAuIAAAAwQAwgQAwggQ) | 35 | 35 | 是 | 全部最优解通过 |
| [《借影》](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BeCBlANArwIhKAkFMgrgcuAccAAqgAEgFQTiC5xBOcghBCAAAQIIYAQYgQYY) | 59 | 59 | 是 | 全部最优解通过 |
| [《归途》](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcAXAhwEwS4FAQC5AcgOAacAAVAAJAKAtZgXEC5yBECIAACAGBQCEGGA) | 39 | 39 | 是 | 全部最优解通过 |
| [《接力》](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAAC5xAqgTkCIEgAAAACCBCA) | 31 | 31 | 是 | 全部最优解通过 |
| [《错位》](https://ghostmaze.novic.cc/?map=AADAAPD4UNDwAAFBoAdAVgBgQBVBxchJCQFcCqAAAABCCY2gqglQTiAAAAYAQAA) | 37 | 37 | 是 | 全部最优解通过 |

《借影》维护版仅补一扇 A 门，最短恢复 59 步；原动作序列与控距安置环节保留。其余八张原图与原参考码完全保持。维护版见 [说明](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/borrowed-shelter-overlapfix-20261012/README.md)。

《易位》及两张功能性玻璃精简题已退役；后续复用只允许 [已审查清单](https://github.com/Pre-rice/ghost-maze-ai/blob/main/data/manifests/puzzle-library-policy.json) 中通过的地图。其余历史提案不参与呈现或复用，不批量消耗时间审查。

详细结果见 [边界审查](archive/reviews/rule-boundaries-20261012.md)。
<!-- current-rule-audit:end -->

## 2026-10-13 上架：《再借》

21格、两鬼、一个A按钮，两反相A门与一普通门，无钥匙/数字门/玻璃，开局中性。左上无用格、突出出生格不保留；已安置的鬼后续还需重新启用。用户评价“妙”“非常棒，很有新意”，关键发现是重新引动先前安置的鬼，帮助阻挡另一只鬼；明确要求上架，尚无真人操作录制；[作品说明](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/recruited-return-20261013/README.md)。

[正式站试玩](https://ghostmaze.novic.cc/?map=AADAAHho7Lj4AAFZ4DIyACAABVAQRISQgKqAAAABCCVCYrkVOQggAAAAEA)

<details>
<summary>参考解法（含答案）</summary>

[回放](https://ghostmaze.novic.cc/?map=AADAAHho7Lj4AAFZ4DIyACAABVAQRISQgKqAAAABCCVCYrkVOQggAAAAEA&replay=APJU70bDyl3eIDK1Wg8M1w)。独立最短44；全部最优无重合。精确完整状态核验确认原下鬼真实静止普通门西侧后，在已按至少两次A时重新移动，帮助原上鬼真的受挡停内角，其后再按A；所有通关至少三A，不说全部路线恰好三按或参考唯一。编号/码/去目标/实际入场及网页关键局面通过。自动证据不代替人类新意或挑战评价。 交付后追加[安全入困局与控距对照](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/recruited-return-20261013/README.md)，等长前缀只差公开鬼位，可解／无解由双续解核验；不冒充用户错误，原题和回放不变。

</details>

## 2026-10-13 新候选：《借舍》

23格、两鬼、一个按钮，零钥匙；开局和实际入场中性，有安全观察窗。手工房间接替构造经过逐门对照，删两扇冗余门和无用支路、缩紧守卫区；用户评价“一般”，指出左上和突出出生格冗余，困鬼及二次引鬼没有新意或难点；删格对照支持冗余，见[复盘](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/borrowed-room-review-20261013.md)。尚无真人路线，未上架。完整资料见[作品说明](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/borrowed-room-20261013/README.md)。以下历史批量统计不含本题。

[正式站试玩](https://ghostmaze.novic.cc/?map=AADAAPzP7DwYAAFS4DNKARgACqoKbopyqWATECgAAAAgxEqxyhSCECQAAACA)

<details>
<summary>参考解法（含答案）</summary>

[回放](https://ghostmaze.novic.cc/?map=AADAAPzP7DwYAAFS4DNKARgACqoKbopyqWATECgAAAAgxEqxyhSCECQAAACA&replay=CKgjVm_9IP1enKiD-pd8PA)。独立最短43；全部最优一按、无重合。最优的一次A前，两鬼需在普通门上下外侧均就位；按后仍需改变上方鬼的位置／跟随方向；两个不同最优收尾均核对，具体转弯不是唯一。玻璃换墙全部物理策略不变，仅供观察；实际入场、码往返、编号/排列及网页关键局面通过。未以这些证据代替真人精妙评价。

</details>

## 2026-10-13 上架：《暂驻》

26格、两鬼、一个按钮，无钥匙和玻璃，开局／实际入场当步中性。手工停位复用构造经有限门/通路对照、独立验证与精简，删冗余钥匙任务及门属性，保留规则外环。用户评价“好图”，认为设计简洁、也有一定挑战性，并明确要求上架；已加入地图集，尚无本题真人路线。[完整评述](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/temporary-stay-review-20261013.md)与[作品说明](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/temporary-stay-20261013/README.md)。以下历史统计未批量重扫，不包含本题。

[正式站试玩](https://ghostmaze.novic.cc/?map=AADAGPjZ-Lj4AAEK4C7KASgBQq5AgiCXAIyKqAAACQghKokUKiEEAAAAAgA)

<details>
<summary>参考解法（含答案）</summary>

[回放](https://ghostmaze.novic.cc/?map=AADAGPjZ-Lj4AAEK4C7KASgBQq5AgiCXAIyKqAAACQghKokUKiEEAAAAAgA&replay=CL4EDXnUQDZX_AKl28CM)。独立最短39；全部并列最优无重合、实际入场和码往返逐状态一致。先借另一鬼停位，按A隔开追击并打开出口，随后仍须主动引走出口前的暂驻鬼。精确位置监控证明真实停车而非经过；相关关系是全部无伤通关所需，参考具体转弯并非唯一走法。用户的真实肯定另记，不扩大为顿悟评价。

</details>

## 2026-10-13 《折返》：用户否决，不入地图集

22格、两鬼、两钥匙，无按钮和玻璃，中性开局。38个求解器状态已纳入11图508状态的规划库，未训练、不是真人评述。用户评述：“太容易想到了，也没什么新意”（2026-10-13）；明确不入地图集，暂无真人路线；[作品说明](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/returning-guard-20261013/README.md)。以下历史统计未重新扫描，不包含本题。

[试玩](https://ghostmaze.novic.cc/?map=AADIAfiI-Jj8AAGoICg0BeYAVVF1QKgUDqIqqAAAAIEKqhBCqQsOgAAAAAAQ)

<details>
<summary>参考解法（含答案）</summary>

[回放](https://ghostmaze.novic.cc/?map=AADIAfiI-Jj8AAGoICg0BeYAVVF1QKgUDqIqqAAAAIEKqhBCqQsOgAAAAAAQ&replay=EATE513_1WqH_BioP9Vw)。独立求解最短38；全部并列最优解无非死亡鬼重合、实际入场逐步状态一致。守钥匙鬼先下移再返回接手追击；六项全部通关必要、两项右侧转弯只在最优范围必要（有40步替代）。自动证据不代表真人精妙评价。

</details>

## 2026-10-13 新候选：《借道》

22格、两鬼、两钥匙，无按钮和玻璃，中性开局。已制备44个求解器规划状态，未训练，不是独立作品或真人好评。暂无用户评述与真人路线，未加入九图网页地图集；完整资料见[作品说明](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/borrowed-route-20261013/README.md)。本条当前规则证据有效，以下历史统计未重新批量扫描，不包含本题。

[试玩](https://ghostmaze.novic.cc/?map=AADIAHwo-Ln4AAEkICAsBA8AFVCSKQacJAqqAAAABHdBVCCFRECAAAAAAAg)

<details>
<summary>参考解法（含答案）</summary>

[回放](https://ghostmaze.novic.cc/?map=AADIAHwo-Ln4AAEkICAsBA8AFVCSKQacJAqqAAAABHdBVCCFRECAAAAAAAg&replay=AMmRO4T_xgqXzwLVaoPC_w)。独立求解最短44；所有并列最优解无非死亡鬼重合，实际入场与区域内逐步状态一致。主要设计关系是提前打开眼下可绕开的门，为后来的鬼安排停位；自动证据不代表人类顿悟目标已达成。

</details>


本次审查的七段 [鬼重合回放](archive/reviews/rule-boundaries-20261012.md) 已整理，包含六张图的夹击死亡见证与《借影》57 步新最短解。

## 历史资料（规则调整前）

更新：2026-10-12。游玩、AI 和回放已使用同一规则；下列码为当时格式；历史路线不自动获得现行规则证书。旧码弃用，原地图、原证据和真人录制保持原样。

扫描 587 份明确保存的地图资料，按完整地图内容去重得到 513 张；其中 496 张可生成并重新打开，414 张已有当前规则的无伤参考路线。数量包括母图、对照和实验候选，不等于正式作品数量。

本文件是地图、解法和用户评述的统一目录。默认试玩入口为正式站 `https://ghostmaze.novic.cc/`；当前目录使用 `https://ghostmaze.novic.cc/`。这是规则调整前的历史状态，不能作为现行验收。只有地图码是普通游玩，追加操作码才进入回放。

参考步数表示新规则下路线成功执行的有效操作数；本次没有重新证明这些路线最短，也没有重新评价谜题质量。按钮、移动和楼梯均计步。参考回放和路线放在折叠区。

## 用户评价为“不错”及以上的地图

以下按真实定性评述收录，不赋予数值评分；“不错但不够精妙”、看提示与看回放后的肯定均保留原有条件。未试玩的母图和改图不继承这些评价。

| 评价日期 | 地图 | 参考步数 | 用户简评与限制 | 评述依据 |
| --- | --- | --- | --- | --- |
| 2026-09-30 | [《错位》](https://ghostmaze.novic.cc/?map=AADAAPD4UNDwAAFBoAdAVgBgQBVBxchJCQFcCqAAAABCCY2gqglQTiAAAAYAQAA) | 37 | 原称“单层组合题”，2026-10-12 补正式名称；“太妙了！好设计！”；想了好一阵子，指出左上 B 门没有作用。 | [记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/worklogs/status-before-reorganization-20261013.md) |
| 2026-10-09 | [《接力》](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAAC5xAqgTkCIEgAAAACCBCA) | 31 | 原称“双鬼交接”，2026-10-12 补正式名称；“妙！”“想了好久才想出来”“媲美第一张图”；明确设计正反馈。 | [记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/twin-handoff-review-20261009.md) |
| 2026-10-09 | [《归途》](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcAXAhwEwS4FAQC5AcgOAacAAVAAJAKAtZgXEC5yBECIAACAGBQCEGGA) | 39 | 原称“永久回路”，2026-10-12 补正式名称；“不错的图”；想出解法不难，元素用途明显，可以线性推导，希望难度来自巧妙解法。 | [记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/permanent-return-review-20261009.md) |
| 2026-10-10 | [《借影》](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BeCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQQgAAECGAEGIEGGA) | 59 | 原称“借用庇护·修正版”，2026-10-12 补正式名称；看参考回放后评价“妙，好设计”；不记为无提示独立通关。 | [记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/borrowed-shelter-review-20261010.md) |
| 2026-10-10 | [《回环》](https://ghostmaze.novic.cc/?map=AADBweHh4eDAwAE1YEKQICGUCQAgBXCqA4gTIKAkEQACgAEQJygnEFziCc5AkBIAABAgAxAgwA) | 70 | “你的设计是很不错的”；比较困难、勉强可称精妙，但担忧复杂性堆砌。看五步提示后通关。 | [记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/shelter-exchange-review-20261010.md) |
| 2026-10-10 | [《回位》](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguAXOAcAcAVAAAAAXOQXOcgUgRAuIAAAAwQAwgQAwggQ) | 35 | “不错的谜题”；同时评价近期《借位》《回位》平平无奇、缺乏新意，已掌握套路后没有“妙”的感觉。已通关。 | [记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/architecture-diagnosis-handoff-20261010.md) |
| 2026-10-12 | [《换边》](https://ghostmaze.novic.cc/?map=AWM4wZDw4UECAwNjWIMLkwIvA8MCF-4vAqwMILCFs0T4C0sDiMnEAQA) | 28 | “不错”，比前面几题更巧、简洁；解法仍简单、容易想到，地图复杂性有限。有甜点单元／靠前简单关的价值，尚未达到主线挑战目标。 | [记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/room-transfer-review-20261012.md) |
| 2026-10-12 | [《换岗》](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQCBGYCoCQEgAAAwIMIBA) | 68 | “不错的谜题”；复杂性还可以、需要动脑、布局简洁，但每一步容易想到，没有眼前一亮或顿悟感。后续尽量避免开局被追，并核验从整图进入单元当步的状态一致。 | [记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/shelter-role-exchange-review-20261012.md) |
| 2026-10-12 | [《后路》](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECMwEgLEBUBIBABhgAGGEAgA) | 59 | “不错，比上一张有进步”；需要考虑先捡哪个钥匙、规划路线，但推理仍线性，很快想到。期待更精妙、有新意与再次眼前一亮；本轮暂停设计，转向本体修改。 | [记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/deferred-key-cold-entry-review-20261012.md) |
| 2026-10-13 | [《暂驻》](https://ghostmaze.novic.cc/?map=AADAGPjZ-Lj4AAEK4C7KASgBQq5AgiCXAIyKqAAACQghKokUKiEEAAAAAgA) | 39 | “好图”；设计很简洁，只有A字母门和一个0数字门，也有一定挑战性；明确要求加入地图集。未提供本题操作录制或参考使用情况。 | [记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/temporary-stay-review-20261013.md) |
| 2026-10-13 | [《再借》](https://ghostmaze.novic.cc/?map=AADAAHho7Lj4AAFZ4DIyACAABVAQRISQgKqAAAABCCVCYrkVOQggAAAAEA) | 44 | “妙！”“非常棒，很有新意”；重新引动先前安置的鬼，让它帮助阻挡另一只鬼；明确要求上架。提示／参考使用未报告，无真人录制。 | [记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/recruited-return-review-20261013.md) |

另附[用户优化图](https://ghostmaze.novic.cc/?map=AADAAHB4cDAwAAFkgCoCQEQAAKAuQJAAHAKAAAAAEBjaCUAoByAAAAAQAA)：用户亲自修改并认为关键思路更精妙；参考与真人路线均为 40 步。它是单层组合题的亲缘改图，不计为新的 AI 独立作品，详见[当时说明](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/user-refinements/README.md)。

## 已交付地图与主要对照

### 《错位》

[试玩](https://ghostmaze.novic.cc/?map=AADAAPD4UNDwAAFBoAdAVgBgQBVBxchJCQFcCqAAAABCCY2gqglQTiAAAAYAQAA) · 原称“单层组合题”，2026-10-12 补正式名称；“太妙了！好设计！”；想了好一阵子，指出左上 B 门没有作用。

地图码：`AADAAPD4UNDwAAFBoAdAVgBgQBVBxchJCQFcCqAAAABCCY2gqglQTiAAAAYAQAA`

来源：[examples/coupled-singlelayer/map.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/coupled-singlelayer/map.json)、[runs/coupled-search/final-18.json](../../ghost-maze-ai/runs/coupled-search/final-18.json)

评述依据：[2026-09-30 的记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/worklogs/status-before-reorganization-20261013.md)。

<details>
<summary>参考回放（37 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AADAAPD4UNDwAAFBoAdAVgBgQBVBxchJCQFcCqAAAABCCY2gqglQTiAAAAYAQAA&replay=GC3I0ymPKVh_qMDymP3A)

操作码：`GC3I0ymPKVh_qMDymP3A`

路线来源：examples/coupled-singlelayer/evidence.json.analysis.baseline.solution.actions

</details>

### 《归途》

[试玩](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcAXAhwEwS4FAQC5AcgOAacAAVAAJAKAtZgXEC5yBECIAACAGBQCEGGA) · 原称“永久回路”，2026-10-12 补正式名称；“不错的图”；想出解法不难，元素用途明显，可以线性推导，希望难度来自巧妙解法。

地图码：`AADAwEDg4ODg4AED4CFcAXAhwEwS4FAQC5AcgOAacAAVAAJAKAtZgXEC5yBECIAACAGBQCEGGA`

来源：[examples/permanent-return-20261009/map.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/permanent-return-20261009/map.json)

评述依据：[2026-10-09 的记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/permanent-return-review-20261009.md)。

<details>
<summary>参考回放（39 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcAXAhwEwS4FAQC5AcgOAacAAVAAJAKAtZgXEC5yBECIAACAGBQCEGGA&replay=CHbIXDkIJ9WgsPqXoz4I)

操作码：`CHbIXDkIJ9WgsPqXoz4I`

路线来源：examples/permanent-return-20261009/evidence.json.solution.solution.actions

</details>

### 《后路》

[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECMwEgLEBUBIBABhgAGGEAgA) · “不错，比上一张有进步”；需要考虑先捡哪个钥匙、规划路线，但推理仍线性，很快想到。期待更精妙、有新意与再次眼前一亮；本轮暂停设计，转向本体修改。

地图码：`AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECMwEgLEBUBIBABhgAGGEAgA`

来源：[examples/deferred-key-cold-entry-20261012/map.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/deferred-key-cold-entry-20261012/map.json)、[runs/door-continuation-20261012/minimized-cold-room-01.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/minimized-cold-room-01.json)

评述依据：[2026-10-12 的记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/deferred-key-cold-entry-review-20261012.md)。

<details>
<summary>参考回放（59 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECMwEgLEBUBIBABhgAGGEAgA&replay=CCe-0I-PJm9VxgD6r6PMlfnYAog)

操作码：`CCe-0I-PJm9VxgD6r6PMlfnYAog`

路线来源：examples/deferred-key-cold-entry-20261012/evidence.json.reference.solution.actions

</details>

### 《换边》

[试玩](https://ghostmaze.novic.cc/?map=AWM4wZDw4UECAwNjWIMLkwIvA8MCF-4vAqwMILCFs0T4C0sDiMnEAQA) · “不错”，比前面几题更巧、简洁；解法仍简单、容易想到，地图复杂性有限。有甜点单元／靠前简单关的价值，尚未达到主线挑战目标。

地图码：`AWM4wZDw4UECAwNjWIMLkwIvA8MCF-4vAqwMILCFs0T4C0sDiMnEAQA`

来源：[examples/room-transfer-20261012/map.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/room-transfer-20261012/map.json)、[examples/room-transfer-20261012/source.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/room-transfer-20261012/source.json)、[runs/door-continuation-20261012/minimized-transfer-01.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/minimized-transfer-01.json)、[runs/door-continuation-20261012/transfer-footer-0-top-2.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/transfer-footer-0-top-2.json)

评述依据：[2026-10-12 的记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/room-transfer-review-20261012.md)。

<details>
<summary>参考回放（28 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AWM4wZDw4UECAwNjWIMLkwIvA8MCF-4vAqwMILCFs0T4C0sDiMnEAQA&replay=AJOILtmM5m-reKM3)

操作码：`AJOILtmM5m-reKM3`

路线来源：examples/room-transfer-20261012/evidence.json.reference.solution.actions

</details>

### 《换岗》

[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQCBGYCoCQEgAAAwIMIBA) · “不错的谜题”；复杂性还可以、需要动脑、布局简洁，但每一步容易想到，没有眼前一亮或顿悟感。后续尽量避免开局被追，并核验从整图进入单元当步的状态一致。

地图码：`AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQCBGYCoCQEgAAAwIMIBA`

来源：[examples/shelter-role-exchange-20261012/map.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/shelter-role-exchange-20261012/map.json)、[runs/door-continuation-20261012/minimized-composite-10-trace.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/minimized-composite-10-trace.json)、[runs/door-continuation-20261012/minimized-composite-10.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/minimized-composite-10.json)

评述依据：[2026-10-12 的记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/shelter-role-exchange-review-20261012.md)。

<details>
<summary>参考回放（68 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQCBGYCoCQEgAAAwIMIBA&replay=AK03CdqPJm9djDqvo8yVV4AJm_6jIg)

操作码：`AK03CdqPJm9djDqvo8yVV4AJm_6jIg`

路线来源：examples/shelter-role-exchange-20261012/evidence.json.reference.solution.actions

</details>

### 《回环》

[试玩](https://ghostmaze.novic.cc/?map=AADBweHh4eDAwAE1YEKQICGUCQAgBXCqA4gTIKAkEQACgAEQJygnEFziCc5AkBIAABAgAxAgwA) · “你的设计是很不错的”；比较困难、勉强可称精妙，但担忧复杂性堆砌。看五步提示后通关。

地图码：`AADBweHh4eDAwAE1YEKQICGUCQAgBXCqA4gTIKAkEQACgAEQJygnEFziCc5AkBIAABAgAxAgwA`

来源：[examples/shelter-exchange-20261010/map.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/shelter-exchange-20261010/map.json)、[runs/position-relations-20261010/m-minimized.json.map](../../ghost-maze-ai/runs/position-relations-20261010/m-minimized.json)

评述依据：[2026-10-10 的记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/shelter-exchange-review-20261010.md)。

<details>
<summary>参考回放（70 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AADBweHh4eDAwAE1YEKQICGUCQAgBXCqA4gTIKAkEQACgAEQJygnEFziCc5AkBIAABAgAxAgwA&replay=EOhbsb4LzGYiMlwXjCpz6gXciDIHNcA)

操作码：`EOhbsb4LzGYiMlwXjCpz6gXciDIHNcA`

路线来源：examples/shelter-exchange-20261010/evidence.json.baseline.solution.actions

</details>

### 《回位》

[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguAXOAcAcAVAAAAAXOQXOcgUgRAuIAAAAwQAwgQAwggQ) · “不错的谜题”；同时评价近期《借位》《回位》平平无奇、缺乏新意，已掌握套路后没有“妙”的感觉。已通关。

地图码：`AADAAOHg4ODgAAE-gIKgfIMwiAACAKguAXOAcAcAVAAAAAXOQXOcgUgRAuIAAAAwQAwgQAwggQ`

来源：[examples/return-to-source-20261010/evidence.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/return-to-source-20261010/evidence.json)、[examples/return-to-source-20261010/map.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/return-to-source-20261010/map.json)、[examples/return-to-source-20261010/minimized.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/return-to-source-20261010/minimized.json)、[runs/return-to-source-20261010/independent-review.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/independent-review.json)、[runs/return-to-source-20261010/minimized-four.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/minimized-four.json)

评述依据：[2026-10-10 的记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/architecture-diagnosis-handoff-20261010.md)。

<details>
<summary>参考回放（35 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguAXOAcAcAVAAAAAXOQXOcgUgRAuIAAAAwQAwgQAwggQ&replay=CNEbJuMv5XKdACDNIhg)

操作码：`CNEbJuMv5XKdACDNIhg`

路线来源：examples/return-to-source-20261010/evidence.json.baseline.solution.actions

</details>

### 《接力》

[试玩](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAAC5xAqgTkCIEgAAAACCBCA) · 原称“双鬼交接”，2026-10-12 补正式名称；“妙！”“想了好久才想出来”“媲美第一张图”；明确设计正反馈。

地图码：`AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAAC5xAqgTkCIEgAAAACCBCA`

来源：[examples/twin-handoff-20261009/map.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/twin-handoff-20261009/map.json)、[examples/twin-handoff-20261009/source.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/twin-handoff-20261009/source.json)、[runs/irreversible-handoff-20261010/c/candidate-25.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/c/candidate-25.json)

评述依据：[2026-10-09 的记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/twin-handoff-review-20261009.md)。

<details>
<summary>参考回放（31 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAAC5xAqgTkCIEgAAAACCBCA&replay=CMnCC_w_AWlXDelACA)

操作码：`CMnCC_w_AWlXDelACA`

路线来源：examples/twin-handoff-20261009/evidence.json.solution.solution.actions

</details>

### 《借位》

[试玩](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEMgIWgOYMQgCqCcAAHOAqAAAAAAXOIEoFIE5AAAAABgABABA) · 简洁；推理线性、难度不足。

地图码：`AADAAPBwcHAAAAEMgIWgOYMQgCqCcAAHOAqAAAAAAXOIEoFIE5AAAAABgABABA`

来源：[examples/single-station-relay-20261010/map.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/single-station-relay-20261010/map.json)、[examples/single-station-relay-20261010/minimized.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/single-station-relay-20261010/minimized.json)、[runs/compact-relocation-20261010/e/minimized-10743-shelter.json.map](../../ghost-maze-ai/runs/compact-relocation-20261010/e/minimized-10743-shelter.json)

评述依据：[2026-10-10 的记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/single-station-relay-review-20261010.md)。

<details>
<summary>参考回放（31 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEMgIWgOYMQgCqCcAAHOAqAAAAAAXOIEoFIE5AAAAABgABABA&replay=CEERmQ_AtVAVoN3oCA)

操作码：`CEERmQ_AtVAVoN3oCA`

路线来源：examples/single-station-relay-20261010/evidence.json.baseline.solution.actions

</details>

### 《借影》

[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BeCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQQgAAECGAEGIEGGA) · 原称“借用庇护·修正版”，2026-10-12 补正式名称；看参考回放后评价“妙，好设计”；不记为无提示独立通关。

地图码：`AADAwGHh4eHh4AEdYCF8BeCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQQgAAECGAEGIEGGA`

来源：[examples/borrowed-shelter-wallfix-20261009/map.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/borrowed-shelter-wallfix-20261009/map.json)

评述依据：[2026-10-10 的记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/borrowed-shelter-review-20261010.md)。

<details>
<summary>参考回放（59 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BeCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQQgAAECGAEGIEGGA&replay=CLqy0pkgj90mF8CqMlf2oMzILXA)

操作码：`CLqy0pkgj90mF8CqMlf2oMzILXA`

路线来源：examples/borrowed-shelter-wallfix-20261009/evidence.json.baseline.solution.actions

</details>

### 《开路》

[试玩](https://ghostmaze.novic.cc/?map=AADIADAwsPAAAAFJgLPACAAoACAICqAAAAAAFoCQVdBCAAAAAAQ) · “太简单”“过于毫无难度”；体现用门甩鬼的基本思想，但解法明显，未达到目标质量。

地图码：`AADIADAwsPAAAAFJgLPACAAoACAICqAAAAAAFoCQVdBCAAAAAAQ`

来源：[examples/door-units-20261011/unit-02.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/door-units-20261011/unit-02.json)、[runs/door-units-20261011/bridge-minimized-3324.json.map](../../ghost-maze-ai/runs/door-units-20261011/bridge-minimized-3324.json)

评述依据：[2026-10-11 的记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/door-units-review-20261011.md)。

<details>
<summary>参考回放（21 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AADIADAwsPAAAAFJgLPACAAoACAICqAAAAAAFoCQVdBCAAAAAAQ&replay=GNia1GEDl4NUmgA)

操作码：`GNia1GEDl4NUmgA`

路线来源：examples/door-units-20261011/unit-02-evidence.json.solution.solution.actions

</details>

### 《两面》

[试玩](https://ghostmaze.novic.cc/?map=AADAAPDAwPAAAAGzgNMACqAoCgKCqAAAAAAWCCQEgIQAAAAA) · “太简单”“过于毫无难度”；体现用门甩鬼的基本思想，但解法明显，未达到目标质量。

地图码：`AADAAPDAwPAAAAGzgNMACqAoCgKCqAAAAAAWCCQEgIQAAAAA`

来源：[examples/door-units-20261011/unit-01.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/door-units-20261011/unit-01.json)、[runs/door-units-20261011/interaction-minimized-43268.json.map](../../ghost-maze-ai/runs/door-units-20261011/interaction-minimized-43268.json)

评述依据：[2026-10-11 的记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/door-units-review-20261011.md)。

<details>
<summary>参考回放（19 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AADAAPDAwPAAAAGzgNMACqAoCgKCqAAAAAAWCCQEgIQAAAAA&replay=CEha2FOrWwlTfA)

操作码：`CEha2FOrWwlTfA`

路线来源：examples/door-units-20261011/unit-01-evidence.json.solution.solution.actions

</details>

### 《先手》

[试玩](https://ghostmaze.novic.cc/?map=AADAADw8_PgAAAEwIDF0AdAQABAAAVQMWinOAEVUAAAAAAQgqoiIuMoAAAAACCAAgA) · “很容易就解出来了”“没有什么新意”；未达到目标质量。用户指出两个 A 留一个即可，已核验删右 A 仍最短 31，删左 A 仍可解。

地图码：`AADAADw8_PgAAAEwIDF0AdAQABAAAVQMWinOAEVUAAAAAAQgqoiIuMoAAAAACCAAgA`

来源：[examples/prepared-release-20261011/map.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/prepared-release-20261011/map.json)、[runs/door-challenge-20261011/minimized-pocket-01.json.map](../../ghost-maze-ai/runs/door-challenge-20261011/minimized-pocket-01.json)

评述依据：[2026-10-12 的记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/prepared-release-review-20261012.md)。

<details>
<summary>参考回放（31 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AADAADw8_PgAAAEwIDF0AdAQABAAAVQMWinOAEVUAAAAAAQgqoiIuMoAAAAACCAAgA&replay=CGA9wTHSFSn88IpXwA)

操作码：`CGA9wTHSFSn88IpXwA`

路线来源：examples/prepared-release-20261011/evidence.json.reference.solution.actions

</details>

### 《易位》

试玩（已退役，不再提供试玩） · 新候选，尚无用户试玩评价；22 格、两鬼、两钥匙，无按钮或字母门，中性入口。普通门与一次性门保留鬼位换序关系；机械核验不代表精妙，未加入网页地图集。

地图码：`AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAoA4EAVAAAE4gVoE0EUE1AiAAAAQA`

来源：[examples/queued-ghost-exchange-20261012/map.json](https://github.com/Pre-rice/ghost-maze-ai/blob/984a0c9ee53afb74e5a59f24cc8e283a31977cb5/examples/queued-ghost-exchange-20261012/map.json)、[runs/queued-ghost-exchange-20261012/research/queued-return-minimized-02.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/research/queued-return-minimized-02.json)

<details>
<summary>参考回放（57 步，含答案）</summary>

打开同页回放（已退役，不再提供试玩）

操作码：`GKZxl3AxcAKX1bAClzVaIfcAKoA`

路线来源：examples/queued-ghost-exchange-20261012/evidence.json.reference.solution.actions

</details>

### 把鬼留在门那边

[试玩](https://ghostmaze.novic.cc/?map=AADAACD4iPgAAAEGgCIA0AAEClBUCoKqAAAAAAKBOEKqhBAAAAAB) · 初批试玩：太简单。

地图码：`AADAACD4iPgAAAEGgCIA0AAEClBUCoKqAAAAAAKBOEKqhBAAAAAB`

来源：[examples/puzzle-units/unit-02.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/puzzle-units/unit-02.json)

<details>
<summary>参考回放（13 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AADAACD4iPgAAAEGgCIA0AAEClBUCoKqAAAAAAKBOEKqhBAAAAAB&replay=GNlAuyoZ_woA)

操作码：`GNlAuyoZ_woA`

路线来源：examples/puzzle-units/verification.json.trace

</details>

### 互补开关

[试玩](https://ghostmaze.novic.cc/?map=AWM4wMDQ8UOBgYHRlkGAn4GBkUPrxFImBhBgDHUq7hABsVgYHAA) · 初批试玩：太简单。

地图码：`AWM4wMDQ8UOBgYHRlkGAn4GBkUPrxFImBhBgDHUq7hABsVgYHAA`

来源：[examples/mechanism-lab/complementary-switch.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/mechanism-lab/complementary-switch.json)

<details>
<summary>参考回放（14 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AWM4wMDQ8UOBgYHRlkGAn4GBkUPrxFImBhBgDHUq7hABsVgYHAA&replay=EF0T4tGKH2PA)

操作码：`EF0T4tGKH2PA`

路线来源：examples/mechanism-lab/evidence.json.analysis.baseline.solution.actions

</details>

### 交错单层

[试玩](https://ghostmaze.novic.cc/?map=AADAAMD4MHBwAAFugCoCmDIIAoDCoU5BADgKgAAAASAiQKgXOQIgAAAEACGA) · 像样但不精妙，随便试试就过了。

地图码：`AADAAMD4MHBwAAFugCoCmDIIAoDCoU5BADgKgAAAASAiQKgXOQIgAAAEACGA`

来源：[examples/interlocked-singlelayer-20261008/map.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/interlocked-singlelayer-20261008/map.json)、[runs/interlocked-20261008/search-02/minimized-59215.json.map](../../ghost-maze-ai/runs/interlocked-20261008/search-02/minimized-59215.json)

评述依据：[2026-10-08 的记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/interlocked-review-20261008.md)。

<details>
<summary>参考回放（46 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AADAAMD4MHBwAAFugCoCmDIIAoDCoU5BADgKgAAAASAiQKgXOQIgAAAEACGA&replay=EALWgMyow1eA1aHAif1a8DA)

操作码：`EALWgMyow1eA1aHAif1a8DA`

路线来源：examples/interlocked-singlelayer-20261008/evidence.json.solution.solution.actions

</details>

### 精简题 1

试玩（已退役，不再提供试玩） · “都还可以”；不推断成对偏好。

地图码：`AWM4wfDhQwIDAwOjagMPkwPXggAlVgYQYJR3LGRyADMVAA`

来源：[examples/minimal-units-20261007/unit-01.json](https://github.com/Pre-rice/ghost-maze-ai/blob/984a0c9ee53afb74e5a59f24cc8e283a31977cb5/examples/minimal-units-20261007/unit-01.json)、[runs/20261007/hinge-5894-final-minimal.json.map](../../ghost-maze-ai/runs/20261007/hinge-5894-final-minimal.json)、[runs/20261007/hinge-5894-minimal.json.map](../../ghost-maze-ai/runs/20261007/hinge-5894-minimal.json)

评述依据：[2026-10-08 的记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/worklogs/status-before-reorganization-20261013.md)。

<details>
<summary>参考回放（18 步，含答案）</summary>

打开同页回放（已退役，不再提供试玩）

操作码：`EE7LcTLSvxmI8A`

路线来源：examples/minimal-units-20261007/unit-01-evidence.json.solution.solution.actions

</details>

### 精简题 2

试玩（已退役，不再提供试玩） · “都还可以”；不推断成对偏好。

地图码：`AADIAADAwODgAAGRgLQAAAoAAID4CoAAAAAAWgJARAiAAAA`

来源：[examples/minimal-units-20261007/unit-02.json](https://github.com/Pre-rice/ghost-maze-ai/blob/984a0c9ee53afb74e5a59f24cc8e283a31977cb5/examples/minimal-units-20261007/unit-02.json)、[runs/20261007/interference-27319-final-minimal.json.map](../../ghost-maze-ai/runs/20261007/interference-27319-final-minimal.json)、[runs/20261007/interference-27319-robust-minimal.json.map](../../ghost-maze-ai/runs/20261007/interference-27319-robust-minimal.json)

评述依据：[2026-10-08 的记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/worklogs/status-before-reorganization-20261013.md)。

<details>
<summary>参考回放（14 步，含答案）</summary>

打开同页回放（已退役，不再提供试玩）

操作码：`EGr4F_VkyVPQ`

路线来源：examples/minimal-units-20261007/unit-02-evidence.json.solution.solution.actions

</details>

### 旧管线示范图

[试玩](https://ghostmaze.novic.cc/?map=AVM6LevGKMfoGxrqwAABq0O0di1gDA0NYGoQYVjAyqDB6MDFI8KwgIUJAA) · 仅作历史示范，不作为谜题质量成果。

地图码：`AVM6LevGKMfoGxrqwAABq0O0di1gDA0NYGoQYVjAyqDB6MDFI8KwgIUJAA`

来源：[examples/demo-map.json.mapData](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/demo-map.json)

<details>
<summary>参考回放（12 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AVM6LevGKMfoGxrqwAABq0O0di1gDA0NYGoQYVjAyqDB6MDFI8KwgIUJAA&replay=AL5PuvD_IAA)

操作码：`AL5PuvD_IAA`

路线来源：迁移时有限求解；未继承旧最短证明

</details>

### 旁路对照

[试玩](https://ghostmaze.novic.cc/?map=AWM4wMDQ8UOBgYHRlkGAn4GBkUOLK0CBAQREQ9QtGh1ALBYA) · 机制对照；初批试玩太简单。

地图码：`AWM4wMDQ8UOBgYHRlkGAn4GBkUOLK0CBAQREQ9QtGh1ALBYA`

来源：[examples/mechanism-lab/bypass-control.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/mechanism-lab/bypass-control.json)

<details>
<summary>参考回放（4 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AWM4wMDQ8UOBgYHRlkGAn4GBkUOLK0CBAQREQ9QtGh1ALBYA&replay=AGa5PCo8)

操作码：`AGa5PCo8`

路线来源：examples/mechanism-lab/evidence.json.analysis.baseline.solution.actions

</details>

### 七格交接

[试玩](https://ghostmaze.novic.cc/?map=AADAAAAYEDAwAAE6ACAWBbBkMwgAAFAcgWQHAKAAAAAABICgLkBcgAAAEAggBA) · 有复杂性，但随便试试也能过。

地图码：`AADAAAAYEDAwAAE6ACAWBbBkMwgAAFAcgWQHAKAAAAAABICgLkBcgAAAEAggBA`

来源：[examples/gate-handoff-20261008/map.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/gate-handoff-20261008/map.json)、[examples/gate-handoff-20261008/source.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/gate-handoff-20261008/source.json)、[runs/foresight-20261008/handoff-3button.json.map](../../ghost-maze-ai/runs/foresight-20261008/handoff-3button.json)

评述依据：[2026-10-09 的记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/gate-handoff-review-20261009.md)。

<details>
<summary>参考回放（19 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AADAAAAYEDAwAAE6ACAWBbBkMwgAAFAcgWQHAKAAAAAABICgLkBcgAAAEAggBA&replay=CNPsSFzY8edzDA)

操作码：`CNPsSFzY8edzDA`

路线来源：examples/gate-handoff-20261008/evidence.json.solution.solution.actions

</details>

### 探头再绕行

[试玩](https://ghostmaze.novic.cc/?map=AWM4wMDwp-MHAwNjWIMEA8OqhUGirCEMIMAhGOrEAWIAAA) · 初批试玩：太简单。

地图码：`AWM4wMDwp-MHAwNjWIMEA8OqhUGirCEMIMAhGOrEAWIAAA`

来源：[examples/puzzle-units/unit-01.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/puzzle-units/unit-01.json)

<details>
<summary>参考回放（10 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AWM4wMDwp-MHAwNjWIMEA8OqhUGirCEMIMAhGOrEAWIAAA&replay=ENvVIeoX_DA)

操作码：`ENvVIeoX_DA`

路线来源：examples/puzzle-units/verification.json.trace

</details>

### 无玻璃题 1

[试玩](https://ghostmaze.novic.cc/?map=AWM4wPDhwQMGBgZGkwYRxgauBSEMogwgwMihqxDpAGJJcAAA) · 普普通通。

地图码：`AWM4wPDhwQMGBgZGkwYRxgauBSEMogwgwMihqxDpAGJJcAAA`

来源：[examples/solid-units-20261008/unit-01.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/solid-units-20261008/unit-01.json)

评述依据：[2026-10-08 的记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/selection/mechanism-selection-20261008.md)。

<details>
<summary>参考回放（20 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AWM4wPDhwQMGBgZGkwYRxgauBSEMogwgwMihqxDpAGJJcAAA&replay=ABshX8z5gXyYPw)

操作码：`ABshX8z5gXyYPw`

路线来源：examples/solid-units-20261008/unit-01-evidence.json.solution.solution.actions

</details>

### 无玻璃题 2

[试玩](https://ghostmaze.novic.cc/?map=AWM4wKDw4EECAwOjawMTIwcDCxcjowUrAwgEKLEqqIBZAA) · 重复已有思想。

地图码：`AWM4wKDw4EECAwOjawMTIwcDCxcjowUrAwgEKLEqqIBZAA`

来源：[examples/solid-units-20261008/unit-02.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/solid-units-20261008/unit-02.json)

评述依据：[2026-10-08 的记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/selection/mechanism-selection-20261008.md)。

<details>
<summary>参考回放（12 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AWM4wKDw4EECAwOjawMTIwcDCxcjowUrAwgEKLEqqIBZAA&replay=AG6p78J1Yyk)

操作码：`AG6p78J1Yyk`

路线来源：examples/solid-units-20261008/unit-02-evidence.json.solution.solution.actions

</details>

### 相向出口

[试玩](https://ghostmaze.novic.cc/?map=AADAAfBQcHBgAAENgIqgWoCA5hAKqFIDlwBwBAoAAAAFznECqBOQIgSAAAAAEIAIEIA) · 历史候选；未作为目标质量正例。

地图码：`AADAAfBQcHBgAAENgIqgWoCA5hAKqFIDlwBwBAoAAAAFznECqBOQIgSAAAAAEIAIEIA`

来源：[examples/opposed-exit-20261009/map.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/opposed-exit-20261009/map.json)、[runs/split-relay-20261009/selected-inspection.json.map](../../ghost-maze-ai/runs/split-relay-20261009/selected-inspection.json)

<details>
<summary>参考回放（32 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AADAAfBQcHBgAAENgIqgWoCA5hAKqFIDlwBwBAoAAAAFznECqBOQIgSAAAAAEIAIEIA&replay=ABwlSYk_AWlXDelACg)

操作码：`ABwlSYk_AWlXDelACg`

路线来源：examples/opposed-exit-20261009/evidence.json.solution.solution.actions

</details>

### 消耗桥

[试玩](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcAXAhwEwS4FAQC5Ac4BwDXOAAKgAFyAUBazAuIFzkCIEQAAEAAMBCCgEIMMA) · 历史候选；未作为目标质量正例。

地图码：`AADAwEDg4ODg4AED4CFcAXAhwEwS4FAQC5Ac4BwDXOAAKgAFyAUBazAuIFzkCIEQAAEAAMBCCgEIMMA`

来源：[examples/consumed-bridge-20261009/map.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/consumed-bridge-20261009/map.json)、[runs/consumed-bridge-20261009/final-inspect.json.map](../../ghost-maze-ai/runs/consumed-bridge-20261009/final-inspect.json)

<details>
<summary>参考回放（39 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcAXAhwEwS4FAQC5Ac4BwDXOAAKgAFyAUBazAuIFzkCIEQAAEAAMBCCgEIMMA&replay=CJRxe2wI9WgCc-pboz4I)

操作码：`CJRxe2wI9WgCc-pboz4I`

路线来源：examples/consumed-bridge-20261009/evidence.json.solution.solution.actions

</details>

### 用户优化图

[试玩](https://ghostmaze.novic.cc/?map=AADAAHB4cDAwAAFkgCoCQEQAAKAuQJAAHAKAAAAAEBjaCUAoByAAAAAQAA) · 用户亲自精简，认为关键思路比旧图的绕行更精妙；40 步真人路线与参考证书一致。不作为另一张 AI 独立作品。

地图码：`AADAAHB4cDAwAAFkgCoCQEQAAKAuQJAAHAKAAAAAEBjaCUAoByAAAAAQAA`

来源：[examples/user-refinements/user-01.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/user-refinements/user-01.json)、[data/generated/user-demonstration-01-v2/manifest.json.map](../../ghost-maze-ai/data/generated/user-demonstration-01-v2/manifest.json)、[data/generated/user-demonstration-01/manifest.json.map](../../ghost-maze-ai/data/generated/user-demonstration-01/manifest.json)

评述依据：[2026-09-30 的记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/user-refinements/README.md)。

<details>
<summary>参考回放（40 步，含答案）</summary>

[打开同页回放](https://ghostmaze.novic.cc/?map=AADAAHB4cDAwAAFkgCoCQEQAAKAuQJAAHAKAAAAAEBjaCUAoByAAAAAQAA&replay=AA9JdrqPIl14IMyMpdcD)

操作码：`AA9JdrqPIl14IMyMpdcD`

路线来源：examples/user-refinements/user-01-evidence.json.reference.solution.actions

</details>

## 真人路线迁移

原始真人录制保留在 `data/solutions/`；新的地图码与操作码另存，逐份按明确关联的原图重放并核对物理终局。死亡循环只迁移最后一轮，循环次数和旧探索不写入回放。旧录制的动作歧义原样保留，不声称知道未被录下的按键或完整试错。

<details>
<summary>真人路线（14 份，含答案）</summary>

- **无玻璃题 1**：20 步，[同页回放](https://ghostmaze.novic.cc/?map=AWM4wPDhwQMGBgZGkwYRxgauBSEMogwgwMihqxDpAGJJcAAA&replay=ABshX8z2gXyYPw)；[原始记录](../../ghost-maze-ai/data/solutions/038337bb-6153-44a7-922f-6ded7681abf4.json)；[迁移记录](../../ghost-maze-ai/data/generated/recordings-current/038337bb-6153-44a7-922f-6ded7681abf4.json)；原保留分支 30 项，保留动作歧义 0 项。
- **交错单层**：46 步，[同页回放](https://ghostmaze.novic.cc/?map=AADAAMD4MHBwAAFugCoCmDIIAoDCoU5BADgKgAAAASAiQKgXOQIgAAAEACGA&replay=EALWgMyA1a-A1mHAif1a8DA)；[原始记录](../../ghost-maze-ai/data/solutions/08bd69af-eb09-4c4d-92e0-0ad523951d87.json)；[迁移记录](../../ghost-maze-ai/data/generated/recordings-current/08bd69af-eb09-4c4d-92e0-0ad523951d87.json)；原保留分支 78 项，保留动作歧义 0 项。
- **无玻璃题 1**：20 步，[同页回放](https://ghostmaze.novic.cc/?map=AWM4wPDhwQMGBgZGkwYRxgauBSEMogwgwMihqxDpAGJJcAAA&replay=ABshX8z2gXyYPw)；[原始记录](../../ghost-maze-ai/data/solutions/1841c110-4e3f-4fe1-bbde-95e5b6d77a29.json)；[迁移记录](../../ghost-maze-ai/data/generated/recordings-current/1841c110-4e3f-4fe1-bbde-95e5b6d77a29.json)；原保留分支 20 项，保留动作歧义 0 项。
- **无玻璃题 2**：12 步，[同页回放](https://ghostmaze.novic.cc/?map=AWM4wKDw4EECAwOjawMTIwcDCxcjowUrAwgEKLEqqIBZAA&replay=AG6p78J1Yyk)；[原始记录](../../ghost-maze-ai/data/solutions/21098869-d1fc-4fee-8c6f-2294ebaebd94.json)；[迁移记录](../../ghost-maze-ai/data/generated/recordings-current/21098869-d1fc-4fee-8c6f-2294ebaebd94.json)；原保留分支 33 项，保留动作歧义 0 项。
- **《回位》**：37 步，[同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguAXOAcAcAVAAAAAXOQXOcgUgRAuIAAAAwQAwgQAwggQ&replay=GNEbJuMv5XKdPAiM0iGA)；[原始记录](../../ghost-maze-ai/data/solutions/3869744e-562c-4406-86fa-c99b3313b7ea.json)；[迁移记录](../../ghost-maze-ai/data/generated/recordings-current/3869744e-562c-4406-86fa-c99b3313b7ea.json)；原保留分支 37 项，保留动作歧义 0 项。
- **《接力》**：33 步，[同页回放](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAAC5xAqgTkCIEgAAAACCBCA&replay=GMnCC_w_AV-lcN6UAIA)；[原始记录](../../ghost-maze-ai/data/solutions/516979c9-663d-4c43-be20-0890b8b5c22c.json)；[迁移记录](../../ghost-maze-ai/data/generated/recordings-current/516979c9-663d-4c43-be20-0890b8b5c22c.json)；原保留分支 543 项，保留动作歧义 0 项。
- **《回位》**：39 步，[同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguAXOAcAcAVAAAAAXOQXOcgUgRAuIAAAAwQAwgQAwggQ&replay=CNEbJuMv5XKdP8CIzSIY)；[原始记录](../../ghost-maze-ai/data/solutions/77ba44f0-ae5f-488c-90c8-142c0660311c.json)；[迁移记录](../../ghost-maze-ai/data/generated/recordings-current/77ba44f0-ae5f-488c-90c8-142c0660311c.json)；原保留分支 39 项，保留动作歧义 0 项。
- **用户优化图**：40 步，[同页回放](https://ghostmaze.novic.cc/?map=AADAAHB4cDAwAAFkgCoCQEQAAKAuQJAAHAKAAAAAEBjaCUAoByAAAAAQAA&replay=AA9JdrqPIl14IMyMpdcD)；[原始记录](../../ghost-maze-ai/data/solutions/921c60cd-51e3-4638-98ba-569829fb0864.json)；[迁移记录](../../ghost-maze-ai/data/generated/recordings-current/921c60cd-51e3-4638-98ba-569829fb0864.json)；原保留分支 40 项，保留动作歧义 0 项。
- **精简题 1**：24 步，同页回放（已退役，不再提供试玩）；[原始记录](../../ghost-maze-ai/data/solutions/a628a2c3-b163-4b80-831c-e1801f0e44ab.json)；[迁移记录](../../ghost-maze-ai/data/generated/recordings-current/a628a2c3-b163-4b80-831c-e1801f0e44ab.json)；原保留分支 31 项，保留动作歧义 0 项。
- **精简题 2**：14 步，同页回放（已退役，不再提供试玩）；[原始记录](../../ghost-maze-ai/data/solutions/b7be255e-2123-411f-8edb-8981d7d9236a.json)；[迁移记录](../../ghost-maze-ai/data/generated/recordings-current/b7be255e-2123-411f-8edb-8981d7d9236a.json)；原保留分支 28 项，保留动作歧义 0 项。
- **七格交接**：19 步，[同页回放](https://ghostmaze.novic.cc/?map=AADAAAAYEDAwAAE6ACAWBbBkMwgAAFAcgWQHAKAAAAAABICgLkBcgAAAEAggBA&replay=CNPsSFzY8edzDA)；[原始记录](../../ghost-maze-ai/data/solutions/bc62283a-f4a3-4e30-a8d9-df3b67b6185c.json)；[迁移记录](../../ghost-maze-ai/data/generated/recordings-current/bc62283a-f4a3-4e30-a8d9-df3b67b6185c.json)；原保留分支 26 项，保留动作歧义 0 项。
- **《借位》**：31 步，[同页回放](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEMgIWgOYMQgCqCcAAHOAqAAAAAAXOIEoFIE5AAAAABgABABA&replay=CEERmQ_AtVAVoN3oCA)；[原始记录](../../ghost-maze-ai/data/solutions/cbbe676f-2d3f-4526-a4fa-f33aee865e84.json)；[迁移记录](../../ghost-maze-ai/data/generated/recordings-current/cbbe676f-2d3f-4526-a4fa-f33aee865e84.json)；原保留分支 31 项，保留动作歧义 0 项。
- **《归途》**：67 步，[同页回放](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcAXAhwEwS4FAQC5AcgOAacAAVAAJAKAtZgXEC5yBECIAACAGBQCEGGA&replay=CHbIXDkIJ9I6nic__51aCw_6l6M-CA)；[原始记录](../../ghost-maze-ai/data/solutions/cde0ed27-e36d-4a1b-992d-72284501777d.json)；[迁移记录](../../ghost-maze-ai/data/generated/recordings-current/cde0ed27-e36d-4a1b-992d-72284501777d.json)；原保留分支 112 项，保留动作歧义 0 项。
- **《回环》**：79 步，[同页回放](https://ghostmaze.novic.cc/?map=AADBweHh4eDAwAE1YEKQICGUCQAgBXCqA4gTIKAkEQACgAEQJygnEFziCc5AkBIAABAgAxAgwA&replay=COhbsb4LzGYgyXCJ14wqdzmCBdyIAfKfcA)；[原始记录](../../ghost-maze-ai/data/solutions/d1bb30da-c6c7-4523-a812-560436cc968d.json)；[迁移记录](../../ghost-maze-ai/data/generated/recordings-current/d1bb30da-c6c7-4523-a812-560436cc968d.json)；原保留分支 79 项，保留动作歧义 0 项。

</details>

## 撤回或数据冲突的历史图

其中两张已交付跨层图的全局楼梯表有配对楼梯，但各层楼梯表是空数组，两份数据互相矛盾。本次保留原图并列出冲突，不自动选择一份覆盖另一份。其余拒绝项为悬空按钮等既有非法资料；没有生成成功后再打不开的假入口。

- 借用庇护·撤回版：按钮必须依附在实心墙或活动区边界上。。保留来源：[examples/borrowed-shelter-20261009/map.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/borrowed-shelter-20261009/map.json)、[runs/nonlinear-20261009/minimized-n13.json.map](../../ghost-maze-ai/runs/nonlinear-20261009/minimized-n13.json)。使用上方“借用庇护·修正版”。
- 借用庇护·撤回版：按钮必须依附在实心墙或活动区边界上。。保留来源：[examples/borrowed-shelter-20261009/source.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/borrowed-shelter-20261009/source.json)、[runs/nonlinear-20261009/n13-restrictions.json.map](../../ghost-maze-ai/runs/nonlinear-20261009/n13-restrictions.json)。使用上方“借用庇护·修正版”。
- 跨层本地钥匙对照：层内与全局楼梯数据冲突。保留来源：[examples/vertical-relay/local-key-control.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/vertical-relay/local-key-control.json)。不提供可玩码。
- 跨层远程开关：层内与全局楼梯数据冲突。保留来源：[examples/vertical-relay/remote-switch.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/vertical-relay/remote-switch.json)。不提供可玩码。
- runs/coupled-search/candidate-10822：按钮必须依附在实心墙或活动区边界上。。保留来源：[runs/coupled-search/candidate-10822.json](../../ghost-maze-ai/runs/coupled-search/candidate-10822.json)。不提供可玩码。
- runs/coupled-search/candidate-12287：按钮必须依附在实心墙或活动区边界上。。保留来源：[runs/coupled-search/candidate-12287.json](../../ghost-maze-ai/runs/coupled-search/candidate-12287.json)。不提供可玩码。
- runs/coupled-search/candidate-14647：按钮必须依附在实心墙或活动区边界上。。保留来源：[runs/coupled-search/candidate-14647.json](../../ghost-maze-ai/runs/coupled-search/candidate-14647.json)。不提供可玩码。
- runs/coupled-search/candidate-19817：按钮必须依附在实心墙或活动区边界上。。保留来源：[runs/coupled-search/candidate-19817.json](../../ghost-maze-ai/runs/coupled-search/candidate-19817.json)。不提供可玩码。
- runs/coupled-search/candidate-5229：按钮必须依附在实心墙或活动区边界上。。保留来源：[runs/coupled-search/candidate-5229.json](../../ghost-maze-ai/runs/coupled-search/candidate-5229.json)。不提供可玩码。
- runs/nonlinear-20261009/search-f/candidate-1826：按钮必须依附在实心墙或活动区边界上。。保留来源：[runs/nonlinear-20261009/search-f/candidate-1826.json.map](../../ghost-maze-ai/runs/nonlinear-20261009/search-f/candidate-1826.json)。不提供可玩码。
- runs/nonlinear-20261009/search-f/candidate-2454：按钮必须依附在实心墙或活动区边界上。。保留来源：[runs/nonlinear-20261009/search-f/candidate-2454.json.map](../../ghost-maze-ai/runs/nonlinear-20261009/search-f/candidate-2454.json)。不提供可玩码。
- runs/nonlinear-20261009/search-k/candidate-1015：按钮必须依附在实心墙或活动区边界上。。保留来源：[runs/nonlinear-20261009/search-k/candidate-1015.json.map](../../ghost-maze-ai/runs/nonlinear-20261009/search-k/candidate-1015.json)。不提供可玩码。
- runs/nonlinear-20261009/search-k/candidate-1323：按钮必须依附在实心墙或活动区边界上。。保留来源：[runs/nonlinear-20261009/search-k/candidate-1323.json.map](../../ghost-maze-ai/runs/nonlinear-20261009/search-k/candidate-1323.json)。不提供可玩码。
- runs/nonlinear-20261009/search-k/candidate-1591：按钮必须依附在实心墙或活动区边界上。。保留来源：[runs/nonlinear-20261009/search-k/candidate-1591.json.map](../../ghost-maze-ai/runs/nonlinear-20261009/search-k/candidate-1591.json)。不提供可玩码。
- runs/nonlinear-20261009/search-k/candidate-2012：按钮必须依附在实心墙或活动区边界上。。保留来源：[runs/nonlinear-20261009/search-k/candidate-2012.json.map](../../ghost-maze-ai/runs/nonlinear-20261009/search-k/candidate-2012.json)。不提供可玩码。
- runs/nonlinear-20261009/search-k/candidate-4636：按钮必须依附在实心墙或活动区边界上。。保留来源：[runs/nonlinear-20261009/search-k/candidate-4636.json.map](../../ghost-maze-ai/runs/nonlinear-20261009/search-k/candidate-4636.json)。不提供可玩码。
- runs/nonlinear-20261009/search-k/candidate-587：按钮必须依附在实心墙或活动区边界上。。保留来源：[runs/nonlinear-20261009/search-k/candidate-587.json.map](../../ghost-maze-ai/runs/nonlinear-20261009/search-k/candidate-587.json)。不提供可玩码。

## 母图与已保存的实验候选

这些是过程记录，未筛为新的正式作品。相同地图的来源已合并；反馈不从母图继承到改图。

<details>
<summary>展开全部合法历史候选与新地图码</summary>

- **consumed-bridge-20261009/source**：[试玩](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcAXAxwF4UwS4FAQC5Ac4BwDXOAAKgAFyAUBazAucgXOQKoFhAAAQAAwEIKAQggww)；未作玩家质量验收。 地图码 `AADAwEDg4ODg4AED4CFcAXAxwF4UwS4FAQC5Ac4BwDXOAAKgAFyAUBazAucgXOQKoFhAAAQAAwEIKAQggww`；[examples/consumed-bridge-20261009/source.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/consumed-bridge-20261009/source.json)、[runs/consumed-bridge-20261009/manual-05.json.map](../../ghost-maze-ai/runs/consumed-bridge-20261009/manual-05.json)。
  <details><summary>参考 37 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcAXAxwF4UwS4FAQC5Ac4BwDXOAAKgAFyAUBazAucgXOQKoFhAAAQAAwEIKAQggww&replay=GDpKp5MI9WgCc-pb8OCA)；操作码 `GDpKp5MI9WgCc-pb8OCA`；路线来源：runs/consumed-bridge-20261009/manual-05.json.solution.solution.actions。

  </details>
- **deferred-key-cold-entry-20261012/source**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECMwFQFiAqAkAgAwwADDCAQA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECMwFQFiAqAkAgAwwADDCAQA`；[examples/deferred-key-cold-entry-20261012/source.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/deferred-key-cold-entry-20261012/source.json)、[runs/door-continuation-20261012/audit-cold-room-01.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/audit-cold-room-01.json)、[runs/door-continuation-20261012/cold-room-01.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/cold-room-01.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECMwFQFiAqAkAgAwwADDCAQA&replay=CMlenxSPJm9VxgD6r6PMlflwgog)；操作码 `CMlenxSPJm9VxgD6r6PMlflwgog`；路线来源：runs/door-continuation-20261012/cold-room-01.json.result.solution.actions。

  </details>
- **door-units-20261011/source-01**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPDQ8PAAAAHjgOuACqAgEAQVQAAAAACwQSoIoIQAAAAA)；未作玩家质量验收。 地图码 `AADAAPDQ8PAAAAHjgOuACqAgEAQVQAAAAACwQSoIoIQAAAAA`；[examples/door-units-20261011/source-01.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/door-units-20261011/source-01.json)。
  <details><summary>参考 19 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPDQ8PAAAAHjgOuACqAgEAQVQAAAAACwQSoIoIQAAAAA&replay=CI249o-rWwlT3A)；操作码 `CI249o-rWwlT3A`；路线来源：examples/door-units-20261011/source-01.json.baseline.solution.actions。

  </details>
- **door-units-20261011/source-02**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPAw8PAAAAFsgM1AEACqCgKAAKoAAAAABGgJBHQQgAAAAAE)；未作玩家质量验收。 地图码 `AADIAPAw8PAAAAFsgM1AEACqCgKAAKoAAAAABGgJBHQQgAAAAAE`；[examples/door-units-20261011/source-02.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/door-units-20261011/source-02.json)。
  <details><summary>参考 19 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAPAw8PAAAAFsgM1AEACqCgKAAKoAAAAABGgJBHQQgAAAAAE&replay=CAaiGTwDl4NUqA)；操作码 `CAaiGTwDl4NUqA`；路线来源：examples/door-units-20261011/source-02.json.baseline.solution.actions。

  </details>
- **interlocked-singlelayer-20261008/source**：[试玩](https://ghostmaze.novic.cc/?map=AADAAND48PDwAAE84AaAAgJcEYIApBhcg5nkKAHAqgAAAASoIkKUE5yCiAAAAAQCEACG)；未作玩家质量验收。 地图码 `AADAAND48PDwAAE84AaAAgJcEYIApBhcg5nkKAHAqgAAAASoIkKUE5yCiAAAAAQCEACG`；[examples/interlocked-singlelayer-20261008/source.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/interlocked-singlelayer-20261008/source.json)、[runs/interlocked-20261008/search-02/candidate-59215.json.map](../../ghost-maze-ai/runs/interlocked-20261008/search-02/candidate-59215.json)。
  <details><summary>参考 52 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAND48PDwAAE84AaAAgJcEYIApBhcg5nkKAHAqgAAAASoIkKUE5yCiAAAAAQCEACG&replay=ADD1sDqoyC31eA1aHAif1a8D)；操作码 `ADD1sDqoyC31eA1aHAif1a8D`；路线来源：examples/interlocked-singlelayer-20261008/source.json.solution.solution.actions。

  </details>
- **minimal-units-20261007/source-01**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wPDhwwcGBgZG1QYepgauBQFKXAsYQMDtwSZHDjCLAwA)；未作玩家质量验收。 地图码 `AWM4wPDhwwcGBgZG1QYepgauBQFKXAsYQMDtwSZHDjCLAwA`；[examples/minimal-units-20261007/source-01.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/minimal-units-20261007/source-01.json)、[runs/20261007/hinge-5894.json](../../ghost-maze-ai/runs/20261007/hinge-5894.json)。
  <details><summary>参考 18 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wPDhwwcGBgZG1QYepgauBQFKXAsYQMDtwSZHDjCLAwA&replay=EL9_HVrSvxmI8A)；操作码 `EL9_HVrSvxmI8A`；路线来源：runs/20261007/hinge-5894-evidence.json.baseline.solution.actions。

  </details>
- **minimal-units-20261007/source-02**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wPAABBgYnzTca-BqYGBwyAGRDB1iAkosDh0MDAwA)；未作玩家质量验收。 地图码 `AWM4wPAABBgYnzTca-BqYGBwyAGRDB1iAkosDh0MDAwA`；[examples/minimal-units-20261007/source-02.json](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/minimal-units-20261007/source-02.json)、[runs/20261007/interference-27319.json](../../ghost-maze-ai/runs/20261007/interference-27319.json)。
  <details><summary>参考 14 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wPAABBgYnzTca-BqYGBwyAGRDB1iAkosDh0MDAwA&replay=EOzMxxpkyVPQ)；操作码 `EOzMxxpkyVPQ`；路线来源：runs/20261007/interference-27319-evidence.json.baseline.solution.actions。

  </details>
- **opposed-exit-20261009/source**：[试玩](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAwwgFVCuXAccAcAQVQAAAAXOcQVIKcgkgigAAAGCACEAECEA)；未作玩家质量验收。 地图码 `AADAAfDw8PDwAAEEoCEyBSQCAwwgFVCuXAccAcAQVQAAAAXOcQVIKcgkgigAAAGCACEAECEA`；[examples/opposed-exit-20261009/source.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/opposed-exit-20261009/source.json)、[runs/split-relay-20261009/exit-f/candidate-32.json.map](../../ghost-maze-ai/runs/split-relay-20261009/exit-f/candidate-32.json)。
  <details><summary>参考 32 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAwwgFVCuXAccAcAQVQAAAAXOcQVIKcgkgigAAAGCACEAECEA&replay=ALtK-cLPAWlXDeZACg)；操作码 `ALtK-cLPAWlXDeZACg`；路线来源：runs/split-relay-20261009/exit-f/candidate-32.json.solution.solution.actions。

  </details>
- **permanent-return-20261009/source**：[试玩](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcAXAhwEwS4FAQC5AcgOAacAAVAALkAoC1mBcQLnIEQIgAAIAYEFAIQYY)；未作玩家质量验收。 地图码 `AADAwEDg4ODg4AED4CFcAXAhwEwS4FAQC5AcgOAacAAVAALkAoC1mBcQLnIEQIgAAIAYEFAIQYY`；[examples/permanent-return-20261009/source.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/permanent-return-20261009/source.json)。
  <details><summary>参考 39 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcAXAhwEwS4FAQC5AcgOAacAAVAALkAoC1mBcQLnIEQIgAAIAYEFAIQYY&replay=COFCEhkIJ9WgsPqXoz4I)；操作码 `COFCEhkIJ9WgsPqXoz4I`；路线来源：examples/permanent-return-20261009/evidence.json.solution.solution.actions。

  </details>
- **prepared-release-20261011/source**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPz8_PgAAAFQoDWUAlARACAABVUDForXODARVQAAAAAEcIiqIiLjKAAAAAIIIIAC)；未作玩家质量验收。 地图码 `AADAAPz8_PgAAAFQoDWUAlARACAABVUDForXODARVQAAAAAEcIiqIiLjKAAAAAIIIIAC`；[examples/prepared-release-20261011/source.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/prepared-release-20261011/source.json)。
  <details><summary>参考 31 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPz8_PgAAAFQoDWUAlARACAABVUDForXODARVQAAAAAEcIiqIiLjKAAAAAIIIIAC&replay=CPbzLFTSFSn88IpXwA)；操作码 `CPbzLFTSFSn88IpXwA`；路线来源：examples/prepared-release-20261011/evidence.json.reference.solution.actions。

  </details>
- **queued-ghost-exchange-20261012/source**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPg4fHx8eAEGIC00BM2A4QFgACqhTAhDfn7wfuBsQqgAAC_cQLaCm0L9-9Qtr0JkAAEBAAAQIADg)；未作玩家质量验收。 地图码 `AADIAPg4fHx8eAEGIC00BM2A4QFgACqhTAhDfn7wfuBsQqgAAC_cQLaCm0L9-9Qtr0JkAAEBAAAQIADg`；[examples/queued-ghost-exchange-20261012/source.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/queued-ghost-exchange-20261012/source.json)、[runs/queued-ghost-exchange-20261012/research/queued-return-audit-01.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/research/queued-return-audit-01.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAPg4fHx8eAEGIC00BM2A4QFgACqhTAhDfn7wfuBsQqgAAC_cQLaCm0L9-9Qtr0JkAAEBAAAQIADg&replay=CDZ5KPVMXACl9WwApcL1VohzCig)；操作码 `CDZ5KPVMXACl9WwApcL1VohzCig`；路线来源：迁移时有限求解；未继承旧最短证明。

  </details>
- **return-to-source-20261010/counterexample-v-2-2-1**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguAXOAcAcAVAAAAAXOQXLkCkCIFxAAAAGCAGECAGEC)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgfIMwiAACAKguAXOAcAcAVAAAAAXOQXLkCkCIFxAAAAGCAGECAGEC`；[examples/return-to-source-20261010/counterexample-v-2-2-1.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/return-to-source-20261010/counterexample-v-2-2-1.json)、[runs/return-to-source-20261010/counterexample-v-2-2-1.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/counterexample-v-2-2-1.json)。
  <details><summary>参考 41 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguAXOAcAcAVAAAAAXOQXLkCkCIFxAAAAGCAGECAGEC&replay=GJsWWf0v5XKdACDdes2ggA)；操作码 `GJsWWf0v5XKdACDdes2ggA`；路线来源：examples/return-to-source-20261010/counterexample-v-2-2-1.json.result.solution.actions。

  </details>
- **return-to-source-20261010/counterexample-v-3-2-0**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguAXOAcAcAVAAAAAXOQXOIFIEQLiAAAAMEAMIEAMIE)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgfIMwiAACAKguAXOAcAcAVAAAAAXOQXOIFIEQLiAAAAMEAMIEAMIE`；[examples/return-to-source-20261010/counterexample-v-3-2-0.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/return-to-source-20261010/counterexample-v-3-2-0.json)、[runs/return-to-source-20261010/counterexample-v-3-2-0.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/counterexample-v-3-2-0.json)。
  <details><summary>参考 33 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguAXOAcAcAVAAAAAXOQXOIFIEQLiAAAAMEAMIEAMIE&replay=GEzFjbcv5XKdACN2YIA)；操作码 `GEzFjbcv5XKdACN2YIA`；路线来源：examples/return-to-source-20261010/counterexample-v-3-2-0.json.result.solution.actions。

  </details>
- **return-to-source-20261010/empty-middle-diagnosis**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguATgHAHAFQAAAAFzkFznIFIEQLiAAAAMAMIEAMIIE)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgfIMwiAACAKguATgHAHAFQAAAAFzkFznIFIEQLiAAAAMAMIEAMIIE`；[examples/return-to-source-20261010/empty-middle-diagnosis.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/return-to-source-20261010/empty-middle-diagnosis.json)、[runs/return-to-source-20261010/counterexample-h-1-3-0.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/counterexample-h-1-3-0.json)、[runs/return-to-source-20261010/empty-middle-diagnosis.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/empty-middle-diagnosis.json)。
  <details><summary>参考 35 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguATgHAHAFQAAAAFzkFznIFIEQLiAAAAMAMIEAMIIE&replay=CMfvkSQv5XKdACDNIhg)；操作码 `CMfvkSQv5XKdACDNIhg`；路线来源：examples/return-to-source-20261010/evidence.json.baseline.solution.actions。

  </details>
- **return-to-source-20261010/source**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguQLnAOAOAKgAAAALnILnOQKQIgXEAAAAYIAYQIAYQQIA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgfIMwiAACAKguQLnAOAOAKgAAAALnILnOQKQIgXEAAAAYIAYQIAYQQIA`；[examples/return-to-source-20261010/source.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/return-to-source-20261010/source.json)、[runs/return-to-source-20261010/four-stations-4010.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/four-stations-4010.json)。
  <details><summary>参考 37 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguQLnAOAOAKgAAAALnILnOQKQIgXEAAAAYIAYQIAYQQIA&replay=GJzedJgv5XKdAyIM0iGA)；操作码 `GJzedJgv5XKdAyIM0iGA`；路线来源：examples/return-to-source-20261010/source.json.result.solution.actions。

  </details>
- **shelter-role-exchange-20261012/numeric-door-comparison**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQCBGICoCQEgAAAwIMI)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQCBGICoCQEgAAAwIMI`；[examples/shelter-role-exchange-20261012/numeric-door-comparison.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/shelter-role-exchange-20261012/numeric-door-comparison.json)、[runs/door-continuation-20261012/role-exchange-contrasts/wall-17.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/wall-17.json)、[runs/door-continuation-20261012/role-exchange-numeric-to-ordinary.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-numeric-to-ordinary.json)。
  <details><summary>参考 63 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQCBGICoCQEgAAAwIMI&replay=CO8yn8qPJm9djDqvo8yVV4D1sIKI)；操作码 `CO8yn8qPJm9djDqvo8yVV4D1sIKI`；路线来源：examples/shelter-role-exchange-20261012/numeric-door-comparison.json.reference.solution.actions。

  </details>
- **shelter-role-exchange-20261012/source**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDw8HAwMAEDIC58BceAsgPw0oXLIOAFzgRwEAAFAAs1iBzHICoJzMCUBUBIAAMCDACDAgwgQEA)；未作玩家质量验收。 地图码 `AADBsPDw8HAwMAEDIC58BceAsgPw0oXLIOAFzgRwEAAFAAs1iBzHICoJzMCUBUBIAAMCDACDAgwgQEA`；[examples/shelter-role-exchange-20261012/source.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/shelter-role-exchange-20261012/source.json)、[runs/door-continuation-20261012/manual-composite-10.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-composite-10.json)、[runs/door-continuation-20261012/probe-composite-10.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/probe-composite-10.json)。
  <details><summary>参考 68 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDw8HAwMAEDIC58BceAsgPw0oXLIOAFzgRwEAAFAAs1iBzHICoJzMCUBUBIAAMCDACDAgwgQEA&replay=AOHKj1-D6W9XgPqt4jPJVXgAmb_qAg)；操作码 `AOHKj1-D6W9XgPqt4jPJVXgAmb_qAg`；路线来源：runs/door-continuation-20261012/manual-composite-10.json.result.solution.actions。

  </details>
- **single-station-relay-20261010/source**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEMgIWgOYMQgCqCcAAHOAqAAAAAAXOIEoFxAnIAAAAAMAAIAAI)；未作玩家质量验收。 地图码 `AADAAPBwcHAAAAEMgIWgOYMQgCqCcAAHOAqAAAAAAXOIEoFxAnIAAAAAMAAIAAI`；[examples/single-station-relay-20261010/source.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/single-station-relay-20261010/source.json)、[runs/compact-relocation-20261010/e/candidate-10743.json.map](../../ghost-maze-ai/runs/compact-relocation-20261010/e/candidate-10743.json)、[runs/single-station-relay-20261010/retired-preview/source.json.map](../../ghost-maze-ai/runs/single-station-relay-20261010/retired-preview/source.json)。
  <details><summary>参考 29 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEMgIWgOYMQgCqCcAAHOAqAAAAAAXOIEoFxAnIAAAAAMAAIAAI&replay=GLhjirbAtVAVo96AgA)；操作码 `GLhjirbAtVAVo96AgA`；路线来源：runs/compact-relocation-20261010/e/candidate-10743.json.result.solution.actions。

  </details>
- **solid-units-20261008/source-01**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wPDhwwcGBgZGkwYRxgauBSEMog4MINAi1qEzAcTgYQEA)；未作玩家质量验收。 地图码 `AWM4wPDhwwcGBgZGkwYRxgauBSEMog4MINAi1qEzAcTgYQEA`；[examples/solid-units-20261008/source-01.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/solid-units-20261008/source-01.json)。
  <details><summary>参考 20 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wPDhwwcGBgZGkwYRxgauBSEMog4MINAi1qEzAcTgYQEA&replay=AMOv4qD5gXyYPw)；操作码 `AMOv4qD5gXyYPw`；路线来源：examples/solid-units-20261008/source-01.json.evaluation.baseline.solution.actions。

  </details>
- **solid-units-20261008/source-02**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wPAACBgYGNMbhBgzGESZGB4IN6xgAAJOhw6RRgEGEAAA)；未作玩家质量验收。 地图码 `AWM4wPAACBgYGNMbhBgzGESZGB4IN6xgAAJOhw6RRgEGEAAA`；[examples/solid-units-20261008/source-02.json.map](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/solid-units-20261008/source-02.json)。
  <details><summary>参考 10 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wPAACBgYGNMbhBgzGESZGB4IN6xgAAJOhw6RRgEGEAAA&replay=EKT24zV1YJA)；操作码 `EKT24zV1YJA`；路线来源：examples/solid-units-20261008/source-02.json.evaluation.baseline.solution.actions。

  </details>
- **runs/20261007/hinge-10223-minimal**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wXCg4UEBAwOjaAMLEwMXI8MCF64GBgYGRgUN1hMcYBYA)；未作玩家质量验收。 地图码 `AWM4wXCg4UEBAwOjaAMLEwMXI8MCF64GBgYGRgUN1hMcYBYA`；[runs/20261007/hinge-10223-minimal.json.map](../../ghost-maze-ai/runs/20261007/hinge-10223-minimal.json)。
  <details><summary>参考 15 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wXCg4UEBAwOjaAMLEwMXI8MCF64GBgYGRgUN1hMcYBYA&replay=CNZdC1Z4r2IM)；操作码 `CNZdC1Z4r2IM`；路线来源：runs/20261007/hinge-10223-minimal.json.evaluation.baseline.solution.actions。

  </details>
- **runs/20261007/hinge-10223**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wfABCBgYGKUaWJgPcC3wb_zM8kPUgQEIJnF-4u5QZAACJgA)；未作玩家质量验收。 地图码 `AWM4wfABCBgYGKUaWJgPcC3wb_zM8kPUgQEIJnF-4u5QZAACJgA`；[runs/20261007/hinge-10223.json](../../ghost-maze-ai/runs/20261007/hinge-10223.json)。
  <details><summary>参考 17 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wfABCBgYGKUaWJgPcC3wb_zM8kPUgQEIJnF-4u5QZAACJgA&replay=GA4DGEbSrzagwA)；操作码 `GA4DGEbSrzagwA`；路线来源：runs/20261007/hinge-10223-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/hinge-10840**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAFoYA6AHACqAgb22G97BjAFUAAAACwQUQQgqQVmgAAAAg)；未作玩家质量验收。 地图码 `AADAAPDw8PDwAAFoYA6AHACqAgb22G97BjAFUAAAACwQUQQgqQVmgAAAAg`；[runs/20261007/hinge-10840.json](../../ghost-maze-ai/runs/20261007/hinge-10840.json)。
  <details><summary>参考 17 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAFoYA6AHACqAgb22G97BjAFUAAAACwQUQQgqQVmgAAAAg&replay=GDlCSWR-yndmAA)；操作码 `GDlCSWR-yndmAA`；路线来源：runs/20261007/hinge-10840-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/hinge-12109-minimal**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wMDwICGBgYFRiKGBgdVhNgNTAwMIuLA0TADRAA)；未作玩家质量验收。 地图码 `AWM4wMDwICGBgYFRiKGBgdVhNgNTAwMIuLA0TADRAA`；[runs/20261007/hinge-12109-minimal.json.map](../../ghost-maze-ai/runs/20261007/hinge-12109-minimal.json)。
  <details><summary>参考 7 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wMDwICGBgYFRiKGBgdVhNgNTAwMIuLA0TADRAA&replay=CJOSI8e2CA)；操作码 `CJOSI8e2CA`；路线来源：runs/20261007/hinge-12109-minimal.json.evaluation.baseline.solution.actions。

  </details>
- **runs/20261007/hinge-12109**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAEioAaABACqBWwm8BbbA3BVAAAAApiCEEZgjEEIAAAAIA)；未作玩家质量验收。 地图码 `AADAAPDw8PDwAAEioAaABACqBWwm8BbbA3BVAAAAApiCEEZgjEEIAAAAIA`；[runs/20261007/hinge-12109.json](../../ghost-maze-ai/runs/20261007/hinge-12109.json)。
  <details><summary>参考 13 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAEioAaABACqBWwm8BbbA3BVAAAAApiCEEZgjEEIAAAAIA&replay=GEdc58-2Y8iA)；操作码 `GEdc58-2Y8iA`；路线来源：runs/20261007/hinge-12109-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/hinge-354**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAGAIAuAOACqAQAAgoCqAAAABZxuCKCbQSQRQAAAAQ)；未作玩家质量验收。 地图码 `AADAAPDw8PDwAAGAIAuAOACqAQAAgoCqAAAABZxuCKCbQSQRQAAAAQ`；[runs/20261007/hinge-354.json](../../ghost-maze-ai/runs/20261007/hinge-354.json)。
  <details><summary>参考 12 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAGAIAuAOACqAQAAgoCqAAAABZxuCKCbQSQRQAAAAQ&replay=AJta-CV0NVo)；操作码 `AJta-CV0NVo`；路线来源：runs/20261007/hinge-354-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/hinge-3759**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wPABCBgYGC0bRBgYuBbMvuEhOGEVAxCwKKxkUZjhwAAEDQA)；未作玩家质量验收。 地图码 `AWM4wPABCBgYGC0bRBgYuBbMvuEhOGEVAxCwKKxkUZjhwAAEDQA`；[runs/20261007/hinge-3759.json](../../ghost-maze-ai/runs/20261007/hinge-3759.json)。
  <details><summary>参考 16 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wPABCBgYGC0bRBgYuBbMvuEhOGEVAxCwKKxkUZjhwAAEDQA&replay=AIJTAJ3y2tgP)；操作码 `AIJTAJ3y2tgP`；路线来源：runs/20261007/hinge-3759-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/hinge-382-minimal**：[试玩](https://ghostmaze.novic.cc/?map=AADAAABg4OCgAAGSgDwCAAAFAsAGwICQAAAAAASBMwKQKoAAAAE)；未作玩家质量验收。 地图码 `AADAAABg4OCgAAGSgDwCAAAFAsAGwICQAAAAAASBMwKQKoAAAAE`；[runs/20261007/hinge-382-minimal.json.map](../../ghost-maze-ai/runs/20261007/hinge-382-minimal.json)。
  <details><summary>参考 16 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAABg4OCgAAGSgDwCAAAFAsAGwICQAAAAAASBMwKQKoAAAAE&replay=AMWmpQdQzbJd)；操作码 `AMWmpQdQzbJd`；路线来源：runs/20261007/hinge-382-minimal.json.evaluation.baseline.solution.actions。

  </details>
- **runs/20261007/hinge-382**：[试玩](https://ghostmaze.novic.cc/?map=AADIAODg4ODgAAHmgFwDAAqBALAHwACoAAAACUCkCdApAvqAAAAB)；未作玩家质量验收。 地图码 `AADIAODg4ODgAAHmgFwDAAqBALAHwACoAAAACUCkCdApAvqAAAAB`；[runs/20261007/hinge-382.json](../../ghost-maze-ai/runs/20261007/hinge-382.json)。
  <details><summary>参考 16 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAODg4ODgAAHmgFwDAAqBALAHwACoAAAACUCkCdApAvqAAAAB&replay=AESV8LBQzbJd)；操作码 `AESV8LBQzbJd`；路线来源：runs/20261007/hinge-382-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/hinge-6562**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAFAoAWAGACqCIMGwNgIFUAAAAClBJBW0E2gs4QAAAAQ)；未作玩家质量验收。 地图码 `AADAAPDw8PDwAAFAoAWAGACqCIMGwNgIFUAAAAClBJBW0E2gs4QAAAAQ`；[runs/20261007/hinge-6562.json](../../ghost-maze-ai/runs/20261007/hinge-6562.json)。
  <details><summary>参考 16 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAFAoAWAGACqCIMGwNgIFUAAAAClBJBW0E2gs4QAAAAQ&replay=ABsEdipda8ag)；操作码 `ABsEdipda8ag`；路线来源：runs/20261007/hinge-6562-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/interference-1503**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPDw8PDwAAF8YCYAAKoBgVgMA0FUAAAACEEUFKCVBH0AAAA)；未作玩家质量验收。 地图码 `AADIAPDw8PDwAAF8YCYAAKoBgVgMA0FUAAAACEEUFKCVBH0AAAA`；[runs/20261007/interference-1503.json](../../ghost-maze-ai/runs/20261007/interference-1503.json)。
  <details><summary>参考 15 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAPDw8PDwAAF8YCYAAKoBgVgMA0FUAAAACEEUFKCVBH0AAAA&replay=COmWvYmNgD9U)；操作码 `COmWvYmNgD9U`；路线来源：runs/20261007/interference-1503-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/interference-15505-minimal**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wMDw4cOHBgbGIw1zGhi4FgQIcDUxgICbQotwhgaQBQA)；未作玩家质量验收。 地图码 `AWM4wMDw4cOHBgbGIw1zGhi4FgQIcDUxgICbQotwhgaQBQA`；[runs/20261007/interference-15505-minimal.json.map](../../ghost-maze-ai/runs/20261007/interference-15505-minimal.json)、[runs/20261007/interference-15505-robust-minimal.json.map](../../ghost-maze-ai/runs/20261007/interference-15505-robust-minimal.json)。
  <details><summary>参考 14 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wMDw4cOHBgbGIw1zGhi4FgQIcDUxgICbQotwhgaQBQA&replay=ECHU2Y73jKlQ)；操作码 `ECHU2Y73jKlQ`；路线来源：runs/20261007/interference-15505-minimal.json.evaluation.baseline.solution.actions。

  </details>
- **runs/20261007/interference-15505**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAGCICdoAKoIgICAUCqAAAABN4gjEEIJtBb2gAAA)；未作玩家质量验收。 地图码 `AADAAPDw8PDwAAGCICdoAKoIgICAUCqAAAABN4gjEEIJtBb2gAAA`；[runs/20261007/interference-15505.json](../../ghost-maze-ai/runs/20261007/interference-15505.json)。
  <details><summary>参考 14 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAGCICdoAKoIgICAUCqAAAABN4gjEEIJtBb2gAAA&replay=EIrGyeb3jKlQ)；操作码 `EIrGyeb3jKlQ`；路线来源：runs/20261007/interference-15505-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/interference-16671**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAEsICpwAKoNwGwAAAVQAAAAKYglQQgighAAAAA)；未作玩家质量验收。 地图码 `AADAAPDw8PDwAAEsICpwAKoNwGwAAAVQAAAAKYglQQgighAAAAA`；[runs/20261007/interference-16671.json](../../ghost-maze-ai/runs/20261007/interference-16671.json)。
  <details><summary>参考 10 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAEsICpwAKoNwGwAAAVQAAAAKYglQQgighAAAAA&replay=ELpu6e8fwoA)；操作码 `ELpu6e8fwoA`；路线来源：runs/20261007/interference-16671-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/interference-167-minimal**：[试玩](https://ghostmaze.novic.cc/?map=AADAAIDw8PDAAAEIgKkACAKgANoBQUAAAAAoBJBSghBIAAAA)；未作玩家质量验收。 地图码 `AADAAIDw8PDAAAEIgKkACAKgANoBQUAAAAAoBJBSghBIAAAA`；[runs/20261007/interference-167-minimal.json.map](../../ghost-maze-ai/runs/20261007/interference-167-minimal.json)。
  <details><summary>参考 17 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAIDw8PDAAAEIgKkACAKgANoBQUAAAAAoBJBSghBIAAAA&replay=GFGztEBpj8JiAA)；操作码 `GFGztEBpj8JiAA`；路线来源：runs/20261007/interference-167-minimal.json.evaluation.baseline.solution.actions。

  </details>
- **runs/20261007/interference-167**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wPABBBgYmR5oaDCsYk5guMXAGsDAwKDRlMuqocgCYgIA)；未作玩家质量验收。 地图码 `AWM4wPABBBgYmR5oaDCsYk5guMXAGsDAwKDRlMuqocgCYgIA`；[runs/20261007/interference-167.json](../../ghost-maze-ai/runs/20261007/interference-167.json)。
  <details><summary>参考 17 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wPABBBgYmR5oaDCsYk5guMXAGsDAwKDRlMuqocgCYgIA&replay=GAZy6cFpj8CmAA)；操作码 `GAZy6cFpj8CmAA`；路线来源：runs/20261007/interference-167-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/interference-18044-robust-minimal**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wGBg8OEDAwOjZEMzA1MDUwPDKgYgYAwQ4lgwiQEIAA)；未作玩家质量验收。 地图码 `AWM4wGBg8OEDAwOjZEMzA1MDUwPDKgYgYAwQ4lgwiQEIAA`；[runs/20261007/interference-18044-robust-minimal.json.map](../../ghost-maze-ai/runs/20261007/interference-18044-robust-minimal.json)。
  <details><summary>参考 11 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wGBg8OEDAwOjZEMzA1MDUwPDKgYgYAwQ4lgwiQEIAA&replay=CFk2MmOHNwA)；操作码 `CFk2MmOHNwA`；路线来源：runs/20261007/interference-18044-robust-minimal.json.evaluation.baseline.solution.actions。

  </details>
- **runs/20261007/interference-18044**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAEbYCJQAKoEAAAG62FUAAAACiCMQRQTaClAAAA)；未作玩家质量验收。 地图码 `AADAAPDw8PDwAAEbYCJQAKoEAAAG62FUAAAACiCMQRQTaClAAAA`；[runs/20261007/interference-18044.json](../../ghost-maze-ai/runs/20261007/interference-18044.json)。
  <details><summary>参考 11 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAEbYCJQAKoEAAAG62FUAAAACiCMQRQTaClAAAA&replay=CPuleIiDdwA)；操作码 `CPuleIiDdwA`；路线来源：runs/20261007/interference-18044-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/interference-22956**：[试玩](https://ghostmaze.novic.cc/?map=AADAAODg4ODgAAHXgIcACoGwAAAICoAAAACbgVQJQIgW0AAAAA)；未作玩家质量验收。 地图码 `AADAAODg4ODgAAHXgIcACoGwAAAICoAAAACbgVQJQIgW0AAAAA`；[runs/20261007/interference-22956.json](../../ghost-maze-ai/runs/20261007/interference-22956.json)。
  <details><summary>参考 10 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAODg4ODgAAHXgIcACoGwAAAICoAAAACbgVQJQIgW0AAAAA&replay=EHu6-kdkN2A)；操作码 `EHu6-kdkN2A`；路线来源：runs/20261007/interference-22956-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/interference-5566-minimal**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wJDwoaCAgYFRq2EGAyuTwjYGpgUMQKDCqeDF4sAABAA)；未作玩家质量验收。 地图码 `AWM4wJDwoaCAgYFRq2EGAyuTwjYGpgUMQKDCqeDF4sAABAA`；[runs/20261007/interference-5566-minimal.json.map](../../ghost-maze-ai/runs/20261007/interference-5566-minimal.json)。
  <details><summary>参考 14 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wJDwoaCAgYFRq2EGAyuTwjYGpgUMQKDCqeDF4sAABAA&replay=EB47k6wufCJg)；操作码 `EB47k6wufCJg`；路线来源：runs/20261007/interference-5566-minimal.json.evaluation.baseline.solution.actions。

  </details>
- **runs/20261007/interference-5566**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wPABCBgYGP0aVjRwLWjIT2AIZQACptlNHoosCgxAAAA)；未作玩家质量验收。 地图码 `AWM4wPABCBgYGP0aVjRwLWjIT2AIZQACptlNHoosCgxAAAA`；[runs/20261007/interference-5566.json](../../ghost-maze-ai/runs/20261007/interference-5566.json)。
  <details><summary>参考 14 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wPABCBgYGP0aVjRwLWjIT2AIZQACptlNHoosCgxAAAA&replay=EL_TbHcufCJg)；操作码 `EL_TbHcufCJg`；路线来源：runs/20261007/interference-5566-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/relay-11416**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wPABCBgYGK82HGLgWnCDgYU1gAEI1ARcWRRmOzAAAQA)；未作玩家质量验收。 地图码 `AWM4wPABCBgYGK82HGLgWnCDgYU1gAEI1ARcWRRmOzAAAQA`；[runs/20261007/relay-11416.json](../../ghost-maze-ai/runs/20261007/relay-11416.json)。
  <details><summary>参考 12 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wPABCBgYGK82HGLgWnCDgYU1gAEI1ARcWRRmOzAAAQA&replay=AGOxaQI12Kc)；操作码 `AGOxaQI12Kc`；路线来源：runs/20261007/relay-11416-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/relay-11788**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAEbICtQAKoIAIADEBVAAAAAkgq3BRBFBGIAAAA)；未作玩家质量验收。 地图码 `AADAAPDw8PDwAAEbICtQAKoIAIADEBVAAAAAkgq3BRBFBGIAAAA`；[runs/20261007/relay-11788.json](../../ghost-maze-ai/runs/20261007/relay-11788.json)。
  <details><summary>参考 14 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAEbICtQAKoIAIADEBVAAAAAkgq3BRBFBGIAAAA&replay=ECUpqgJ-jHAw)；操作码 `ECUpqgJ-jHAw`；路线来源：runs/20261007/relay-11788-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/relay-15089-minimal**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wfAACBgYGMMadjJwNTAsyOBqYACCDqFGASUGIAAA)；未作玩家质量验收。 地图码 `AWM4wfAACBgYGMMadjJwNTAsyOBqYACCDqFGASUGIAAA`；[runs/20261007/relay-15089-minimal.json.map](../../ghost-maze-ai/runs/20261007/relay-15089-minimal.json)。
  <details><summary>参考 15 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wfAACBgYGMMadjJwNTAsyOBqYACCDqFGASUGIAAA&replay=CABVLX18aAc0)；操作码 `CABVLX18aAc0`；路线来源：runs/20261007/relay-15089-minimal.json.evaluation.baseline.solution.actions。

  </details>
- **runs/20261007/relay-15089**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wfAACBgYGMMadjJwNTAqZHA1MABBh1CjgBIDEAAA)；未作玩家质量验收。 地图码 `AWM4wfAACBgYGMMadjJwNTAqZHA1MABBh1CjgBIDEAAA`；[runs/20261007/relay-15089.json](../../ghost-maze-ai/runs/20261007/relay-15089.json)。
  <details><summary>参考 17 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wfAACBgYGMMadjJwNTAqZHA1MABBh1CjgBIDEAAA&replay=GHncS6R8aMhzQA)；操作码 `GHncS6R8aMhzQA`；路线来源：runs/20261007/relay-15089-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/relay-17506**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAEcYCtAAKoGwFA2QAFUAAAACVBSghBTEEIAAAA)；未作玩家质量验收。 地图码 `AADAAPDw8PDwAAEcYCtAAKoGwFA2QAFUAAAACVBSghBTEEIAAAA`；[runs/20261007/relay-17506.json](../../ghost-maze-ai/runs/20261007/relay-17506.json)。
  <details><summary>参考 14 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAEcYCtAAKoGwFA2QAFUAAAACVBSghBTEEIAAAA&replay=ELlSsR2_KHMA)；操作码 `ELlSsR2_KHMA`；路线来源：runs/20261007/relay-17506-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/relay-18998-minimal**：[试玩](https://ghostmaze.novic.cc/?map=AADAAHDQ8OAgAAHUgMYABUFiAoBQUAQAAAACIJUEIIgFAAAA)；未作玩家质量验收。 地图码 `AADAAHDQ8OAgAAHUgMYABUFiAoBQUAQAAAACIJUEIIgFAAAA`；[runs/20261007/relay-18998-minimal.json.map](../../ghost-maze-ai/runs/20261007/relay-18998-minimal.json)。
  <details><summary>参考 18 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAHDQ8OAgAAHUgMYABUFiAoBQUAQAAAACIJUEIIgFAAAA&replay=EH0hGL2TPWpN0A)；操作码 `EH0hGL2TPWpN0A`；路线来源：runs/20261007/relay-18998-minimal.json.evaluation.baseline.solution.actions。

  </details>
- **runs/20261007/relay-18998**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAGRYCpwAKoN4gADcBIKoAAAAFEEUEIIoLdiAAAA)；未作玩家质量验收。 地图码 `AADAAPDw8PDwAAGRYCpwAKoN4gADcBIKoAAAAFEEUEIIoLdiAAAA`；[runs/20261007/relay-18998.json](../../ghost-maze-ai/runs/20261007/relay-18998.json)。
  <details><summary>参考 24 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAGRYCpwAKoN4gADcBIKoAAAAFEEUEIIoLdiAAAA&replay=ALVkA0-TfClkNn0)；操作码 `ALVkA0-TfClkNn0`；路线来源：runs/20261007/relay-18998-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/relay-3269-minimal**：[试玩](https://ghostmaze.novic.cc/?map=AADAAIDwcHAwAAEMgLIACAKgkAgIAoAAAAFAIQJQIgJAAAA)；未作玩家质量验收。 地图码 `AADAAIDwcHAwAAEMgLIACAKgkAgIAoAAAAFAIQJQIgJAAAA`；[runs/20261007/relay-3269-minimal.json.map](../../ghost-maze-ai/runs/20261007/relay-3269-minimal.json)。
  <details><summary>参考 11 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAIDwcHAwAAEMgLIACAKgkAgIAoAAAAFAIQJQIgJAAAA&replay=CCtAMO0YwqA)；操作码 `CCtAMO0YwqA`；路线来源：runs/20261007/relay-3269-minimal.json.evaluation.baseline.solution.actions。

  </details>
- **runs/20261007/relay-3269**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wPABBBgYWR5oWTCsYmFicjDgWsDAwBCdxM0ismARB4gNAA)；未作玩家质量验收。 地图码 `AWM4wPABBBgYWR5oWTCsYmFicjDgWsDAwBCdxM0ismARB4gNAA`；[runs/20261007/relay-3269.json](../../ghost-maze-ai/runs/20261007/relay-3269.json)。
  <details><summary>参考 29 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wPABBBgYWR5oWTCsYmFicjDgWsDAwBCdxM0ismARB4gNAA&replay=GFXrBfQpzAtWjnwqAA)；操作码 `GFXrBfQpzAtWjnwqAA`；路线来源：runs/20261007/relay-3269-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/relay-3512**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wPAACBgYGJc0HGbgajjAwNsYwAAEwgU6AUqsCgxAAAA)；未作玩家质量验收。 地图码 `AWM4wPAACBgYGJc0HGbgajjAwNsYwAAEwgU6AUqsCgxAAAA`；[runs/20261007/relay-3512.json](../../ghost-maze-ai/runs/20261007/relay-3512.json)。
  <details><summary>参考 12 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wPAACBgYGJc0HGbgajjAwNsYwAAEwgU6AUqsCgxAAAA&replay=AOUxbi4tk3Y)；操作码 `AOUxbi4tk3Y`；路线来源：runs/20261007/relay-3512-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/relay-7156**：[试玩](https://ghostmaze.novic.cc/?map=AADIAODg4ODgAAHogLyACoAAYCA-QKgAAAAIgSgRAmgUgAAA)；未作玩家质量验收。 地图码 `AADIAODg4ODgAAHogLyACoAAYCA-QKgAAAAIgSgRAmgUgAAA`；[runs/20261007/relay-7156.json](../../ghost-maze-ai/runs/20261007/relay-7156.json)。
  <details><summary>参考 14 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAODg4ODgAAHogLyACoAAYCA-QKgAAAAIgSgRAmgUgAAA&replay=EFC4AOwJjZdw)；操作码 `EFC4AOwJjZdw`；路线来源：runs/20261007/relay-7156-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/switch-11842**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wPDgwQMGBgbGJgUlhoYGLXbLAzEPtBhAgKmIdQt3CZjJocgmwQAA)；未作玩家质量验收。 地图码 `AWM4wPDgwQMGBgbGJgUlhoYGLXbLAzEPtBhAgKmIdQt3CZjJocgmwQAA`；[runs/20261007/switch-11842.json](../../ghost-maze-ai/runs/20261007/switch-11842.json)。
  <details><summary>参考 12 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wPDgwQMGBgbGJgUlhoYGLXbLAzEPtBhAgKmIdQt3CZjJocgmwQAA&replay=ANyEnNoYMh0)；操作码 `ANyEnNoYMh0`；路线来源：runs/20261007/switch-11842-evidence.json.baseline.solution.actions。

  </details>
- **runs/20261007/switch-5907**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPDw8PAAAAE5ICAAQIAqgccAsBxsFUAAAAAArlBbkE5yCSAAAAACBADADA)；未作玩家质量验收。 地图码 `AADAAPDw8PAAAAE5ICAAQIAqgccAsBxsFUAAAAAArlBbkE5yCSAAAAACBADADA`；[runs/20261007/switch-5907.json](../../ghost-maze-ai/runs/20261007/switch-5907.json)。
  <details><summary>参考 30 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPDw8PAAAAE5ICAAQIAqgccAsBxsFUAAAAAArlBbkE5yCSAAAAACBADADA&replay=ENu4NFGAX8iFgFwNwA)；操作码 `ENu4NFGAX8iFgFwNwA`；路线来源：runs/20261007/switch-5907-evidence.json.baseline.solution.actions。

  </details>
- **runs/compact-relocation-20261010/c/candidate-4224**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBwcHBwAAENgIOgLwGwgCqCQHHAAABUAAAAC5xArkCUCIEQAAABCDAD)；未作玩家质量验收。 地图码 `AADAAPBwcHBwAAENgIOgLwGwgCqCQHHAAABUAAAAC5xArkCUCIEQAAABCDAD`；[runs/compact-relocation-20261010/c/candidate-4224.json.map](../../ghost-maze-ai/runs/compact-relocation-20261010/c/candidate-4224.json)。
  <details><summary>参考 33 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBwcHBwAAENgIOgLwGwgCqCQHHAAABUAAAAC5xArkCUCIEQAAABCDAD&replay=GMjDPwvxgPWw5rMZoIA)；操作码 `GMjDPwvxgPWw5rMZoIA`；路线来源：runs/compact-relocation-20261010/c/candidate-4224.json.result.solution.actions。

  </details>
- **runs/compact-relocation-20261010/c/candidate-7226**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wPChAAgYGHkb2hT0mQoatJoK-AqYGxhWMDAwiFs0hnA0CigxAEGThAMDAA)；未作玩家质量验收。 地图码 `AWM4wPChAAgYGHkb2hT0mQoatJoK-AqYGxhWMDAwiFs0hnA0CigxAEGThAMDAA`；[runs/compact-relocation-20261010/c/candidate-7226.json.map](../../ghost-maze-ai/runs/compact-relocation-20261010/c/candidate-7226.json)。
  <details><summary>参考 22 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wPChAAgYGHkb2hT0mQoatJoK-AqYGxhWMDAwiFs0hnA0CigxAEGThAMDAA&replay=ELIU69cNzq8FqCA)；操作码 `ELIU69cNzq8FqCA`；路线来源：runs/compact-relocation-20261010/c/candidate-7226.json.result.solution.actions。

  </details>
- **runs/compact-relocation-20261010/c/candidate-9812**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wPChAAgYGHkbmhSMmyc0aDU5FDAeYAhhYGDgnuOwo9GSScGFAQh4GJwA)；未作玩家质量验收。 地图码 `AWM4wPChAAgYGHkbmhSMmyc0aDU5FDAeYAhhYGDgnuOwo9GSScGFAQh4GJwA`；[runs/compact-relocation-20261010/c/candidate-9812.json.map](../../ghost-maze-ai/runs/compact-relocation-20261010/c/candidate-9812.json)。
  <details><summary>参考 29 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wPChAAgYGHkbmhSMmyc0aDU5FDAeYAhhYGDgnuOwo9GSScGFAQh4GJwA&replay=GIM3BYbQ-VAxlvMogA)；操作码 `GIM3BYbQ-VAxlvMogA`；路线来源：runs/compact-relocation-20261010/c/candidate-9812.json.result.solution.actions。

  </details>
- **runs/compact-relocation-20261010/d/candidate-0**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEKgISgOYMQgCqCcAAHOAqAAAAAAXOIEQLiBOQAAAAAAAQQAAY)；未作玩家质量验收。 地图码 `AADAAPBwcHAAAAEKgISgOYMQgCqCcAAHOAqAAAAAAXOIEQLiBOQAAAAAAAQQAAY`；[runs/compact-relocation-20261010/d/candidate-0.json.map](../../ghost-maze-ai/runs/compact-relocation-20261010/d/candidate-0.json)。
  <details><summary>参考 23 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEKgISgOYMQgCqCcAAHOAqAAAAAAXOIEQLiBOQAAAAAAAQQAAY&replay=CDC6O3_-h9AVwog)；操作码 `CDC6O3_-h9AVwog`；路线来源：runs/compact-relocation-20261010/d/candidate-0.json.solution.solution.actions。

  </details>
- **runs/compact-relocation-20261010/e/candidate-12051**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEEgICgWYBA4hAFUE4AAOcBUAAAAAAucQLiBcQJyAAAAADBBCBACDA)；未作玩家质量验收。 地图码 `AADAAPBwcHAAAAEEgICgWYBA4hAFUE4AAOcBUAAAAAAucQLiBcQJyAAAAADBBCBACDA`；[runs/compact-relocation-20261010/e/candidate-12051.json.map](../../ghost-maze-ai/runs/compact-relocation-20261010/e/candidate-12051.json)。
  <details><summary>参考 22 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEEgICgWYBA4hAFUE4AAOcBUAAAAAAucQLiBcQJyAAAAADBBCBACDA&replay=EIQr2Q1fQG12gCA)；操作码 `EIQr2Q1fQG12gCA`；路线来源：runs/compact-relocation-20261010/e/candidate-12051.json.result.solution.actions。

  </details>
- **runs/compact-relocation-20261010/e/candidate-13028**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEMgIKgWYMQ1BAFUE4AAOcBUAAAAAAucQIgTkCcgAAAAAgAAwAggA)；未作玩家质量验收。 地图码 `AADAAPBwcHAAAAEMgIKgWYMQ1BAFUE4AAOcBUAAAAAAucQIgTkCcgAAAAAgAAwAggA`；[runs/compact-relocation-20261010/e/candidate-13028.json.map](../../ghost-maze-ai/runs/compact-relocation-20261010/e/candidate-13028.json)。
  <details><summary>参考 22 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEMgIKgWYMQ1BAFUE4AAOcBUAAAAAAucQIgTkCcgAAAAAgAAwAggA&replay=EASkkLbbQG12oCA)；操作码 `EASkkLbbQG12oCA`；路线来源：runs/compact-relocation-20261010/e/candidate-13028.json.result.solution.actions。

  </details>
- **runs/compact-relocation-20261010/e/candidate-13133**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEHgICgVQMw0hAFUFzgAA5wFQAAAAAC5xAiBcQJyAAAAAADACCADDA)；未作玩家质量验收。 地图码 `AADAAPBwcHAAAAEHgICgVQMw0hAFUFzgAA5wFQAAAAAC5xAiBcQJyAAAAAADACCADDA`；[runs/compact-relocation-20261010/e/candidate-13133.json.map](../../ghost-maze-ai/runs/compact-relocation-20261010/e/candidate-13133.json)。
  <details><summary>参考 23 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEHgICgVQMw0hAFUFzgAA5wFQAAAAAC5xAiBcQJyAAAAAADACCADDA&replay=CDSvb6BZ_AbXpAg)；操作码 `CDSvb6BZ_AbXpAg`；路线来源：runs/compact-relocation-20261010/e/candidate-13133.json.result.solution.actions。

  </details>
- **runs/compact-relocation-20261010/e/candidate-18311**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEHgIGgWYMQmBAFUE4AcA5wFQAAAAAC5xAiBcQJyAAAAAABBCDBBDA)；未作玩家质量验收。 地图码 `AADAAPBwcHAAAAEHgIGgWYMQmBAFUE4AcA5wFQAAAAAC5xAiBcQJyAAAAAABBCDBBDA`；[runs/compact-relocation-20261010/e/candidate-18311.json.map](../../ghost-maze-ai/runs/compact-relocation-20261010/e/candidate-18311.json)。
  <details><summary>参考 32 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEHgIGgWYMQmBAFUE4AcA5wFQAAAAAC5xAiBcQJyAAAAAABBCDBBDA&replay=AL7OomH50Aad0LV6Ag)；操作码 `AL7OomH50Aad0LV6Ag`；路线来源：runs/compact-relocation-20261010/e/candidate-18311.json.result.solution.actions。

  </details>
- **runs/compact-relocation-20261010/e/candidate-20242**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEKgIWgOYMQgCqCcAAHOAqAAAAAAXOIEQLiBOQAAAAAIAAQAAI)；未作玩家质量验收。 地图码 `AADAAPBwcHAAAAEKgIWgOYMQgCqCcAAHOAqAAAAAAXOIEQLiBOQAAAAAIAAQAAI`；[runs/compact-relocation-20261010/e/candidate-20242.json.map](../../ghost-maze-ai/runs/compact-relocation-20261010/e/candidate-20242.json)。
  <details><summary>参考 29 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEKgIWgOYMQgCqCcAAHOAqAAAAAAXOIEQLiBOQAAAAAIAAQAAI&replay=GF32FgMPJl_QG16AgA)；操作码 `GF32FgMPJl_QG16AgA`；路线来源：runs/compact-relocation-20261010/e/candidate-20242.json.result.solution.actions。

  </details>
- **runs/compact-relocation-20261010/e/candidate-3283**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEKgIWgOYMQgCqCcAAHOAqAAAAAAXOIEQLiBOQAAAAAIQAQQAI)；未作玩家质量验收。 地图码 `AADAAPBwcHAAAAEKgIWgOYMQgCqCcAAHOAqAAAAAAXOIEQLiBOQAAAAAIQAQQAI`；[runs/compact-relocation-20261010/e/candidate-3283.json.map](../../ghost-maze-ai/runs/compact-relocation-20261010/e/candidate-3283.json)。
  <details><summary>参考 29 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEKgIWgOYMQgCqCcAAHOAqAAAAAAXOIEQLiBOQAAAAAIQAQQAI&replay=GJDvcLYPJl_QG16AgA)；操作码 `GJDvcLYPJl_QG16AgA`；路线来源：runs/compact-relocation-20261010/e/candidate-3283.json.result.solution.actions。

  </details>
- **runs/compact-relocation-20261010/e/candidate-4304**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEHgICgWYMQthAFUE4AAOcBUAAAAAAucQK5AuIE5AAAAABgghghghg)；未作玩家质量验收。 地图码 `AADAAPBwcHAAAAEHgICgWYMQthAFUE4AAOcBUAAAAAAucQK5AuIE5AAAAABgghghghg`；[runs/compact-relocation-20261010/e/candidate-4304.json.map](../../ghost-maze-ai/runs/compact-relocation-20261010/e/candidate-4304.json)。
  <details><summary>参考 22 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEHgICgWYMQthAFUE4AAOcBUAAAAAAucQK5AuIE5AAAAABgghghghg&replay=EHsitvLMdmzdoCA)；操作码 `EHsitvLMdmzdoCA`；路线来源：runs/compact-relocation-20261010/e/candidate-4304.json.result.solution.actions。

  </details>
- **runs/compact-relocation-20261010/e/candidate-4750**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEHgICgOYMQgCqCcAAHOAqAAAAAAXOIEQLiBOQAAAAAIAAQAAI)；未作玩家质量验收。 地图码 `AADAAPBwcHAAAAEHgICgOYMQgCqCcAAHOAqAAAAAAXOIEQLiBOQAAAAAIAAQAAI`；[runs/compact-relocation-20261010/e/candidate-4750.json.map](../../ghost-maze-ai/runs/compact-relocation-20261010/e/candidate-4750.json)。
  <details><summary>参考 38 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEHgICgOYMQgCqCcAAHOAqAAAAAAXOIEQLiBOQAAAAAIAAQAAI&replay=EDb9PsF_R6DOZfwG16Ag)；操作码 `EDb9PsF_R6DOZfwG16Ag`；路线来源：runs/compact-relocation-20261010/e/candidate-4750.json.result.solution.actions。

  </details>
- **runs/compact-relocation-20261010/e/candidate-7857**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEMgICgOYMQgCqCcAAHOAqAAAAAAXOIEQLnIE5AAAAAAAhhAhghAA)；未作玩家质量验收。 地图码 `AADAAPBwcHAAAAEMgICgOYMQgCqCcAAHOAqAAAAAAXOIEQLnIE5AAAAAAAhhAhghAA`；[runs/compact-relocation-20261010/e/candidate-7857.json.map](../../ghost-maze-ai/runs/compact-relocation-20261010/e/candidate-7857.json)。
  <details><summary>参考 24 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEMgICgOYMQgCqCcAAHOAqAAAAAAXOIEQLnIE5AAAAAAAhhAhghAA&replay=AMtGpo9rDGXRegI)；操作码 `AMtGpo9rDGXRegI`；路线来源：runs/compact-relocation-20261010/e/candidate-7857.json.result.solution.actions。

  </details>
- **runs/compact-relocation-20261010/e/minimized-10743**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEMgIWgOYMQgCqCcAAHOAqAAAAAAXOIEoEQJyAAAAADAACACA)；未作玩家质量验收。 地图码 `AADAAPBwcHAAAAEMgIWgOYMQgCqCcAAHOAqAAAAAAXOIEoEQJyAAAAADAACACA`；[runs/compact-relocation-20261010/e/minimized-10743.json.map](../../ghost-maze-ai/runs/compact-relocation-20261010/e/minimized-10743.json)、[runs/single-station-relay-20261010/retired-preview/map.json](../../ghost-maze-ai/runs/single-station-relay-20261010/retired-preview/map.json)、[runs/single-station-relay-20261010/retired-preview/minimized.json.map](../../ghost-maze-ai/runs/single-station-relay-20261010/retired-preview/minimized.json)。
  <details><summary>参考 29 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEMgIWgOYMQgCqCcAAHOAqAAAAAAXOIEoEQJyAAAAADAACACA&replay=GP_FOY_AtVAVo96AgA)；操作码 `GP_FOY_AtVAVo96AgA`；路线来源：runs/compact-relocation-20261010/e/minimized-10743.json.evaluation.baseline.solution.actions。

  </details>
- **runs/compact-relocation-20261010/e/open-lower-10743**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wPChoKCAgYGRp6F1gWWzQINWUwEDc8MKBiAQt2jUEGQqYgACAyYGBQA)；未作玩家质量验收。 地图码 `AWM4wPChoKCAgYGRp6F1gWWzQINWUwEDc8MKBiAQt2jUEGQqYgACAyYGBQA`；[runs/compact-relocation-20261010/e/open-lower-10743.json.map](../../ghost-maze-ai/runs/compact-relocation-20261010/e/open-lower-10743.json)。
  <details><summary>参考 23 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wPChoKCAgYGRp6F1gWWzQINWUwEDc8MKBiAQt2jUEGQqYgACAyYGBQA&replay=CG6GtObAtVAV6Ag)；操作码 `CG6GtObAtVAV6Ag`；路线来源：runs/compact-relocation-20261010/e/open-lower-10743.json.result.solution.actions。

  </details>
- **runs/consumed-bridge-20261009/manual-01**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAEEIAGAMgUIBIL8IAqg4oHABwACqAAAABckFZQQguEEIAAABABBgII)；未作玩家质量验收。 地图码 `AADAAPDw8PDwAAEEIAGAMgUIBIL8IAqg4oHABwACqAAAABckFZQQguEEIAAABABBgII`；[runs/consumed-bridge-20261009/manual-01.json.map](../../ghost-maze-ai/runs/consumed-bridge-20261009/manual-01.json)。
  <details><summary>参考 5 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAEEIAGAMgUIBIL8IAqg4oHABwACqAAAABckFZQQguEEIAAABABBgII&replay=GKOd5eMCAA)；操作码 `GKOd5eMCAA`；路线来源：runs/consumed-bridge-20261009/manual-01.json.solution.solution.actions。

  </details>
- **runs/consumed-bridge-20261009/manual-02**：[试玩](https://ghostmaze.novic.cc/?map=AADAwEDg4ODgAAEJgAwC4CcC8KgIBcgOAACAqAAAFyAUBazAqgXOQIgAAABACgEMMA)；未作玩家质量验收。 地图码 `AADAwEDg4ODgAAEJgAwC4CcC8KgIBcgOAACAqAAAFyAUBazAqgXOQIgAAABACgEMMA`；[runs/consumed-bridge-20261009/manual-02.json.map](../../ghost-maze-ai/runs/consumed-bridge-20261009/manual-02.json)。
  <details><summary>参考 21 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwEDg4ODgAAEJgAwC4CcC8KgIBcgOAACAqAAAFyAUBazAqgXOQIgAAABACgEMMA&replay=GPcBBQXwtWj8IIA)；操作码 `GPcBBQXwtWj8IIA`；路线来源：runs/consumed-bridge-20261009/manual-02.json.solution.solution.actions。

  </details>
- **runs/consumed-bridge-20261009/manual-03**：[试玩](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcAXAhwF4UwVAQC5AcAcAcAAKgAFyAUBazAucgXOQIgWEAABADBCgEIIMM)；未作玩家质量验收。 地图码 `AADAwEDg4ODg4AED4CFcAXAhwF4UwVAQC5AcAcAcAAKgAFyAUBazAucgXOQIgWEAABADBCgEIIMM`；[runs/consumed-bridge-20261009/manual-03.json.map](../../ghost-maze-ai/runs/consumed-bridge-20261009/manual-03.json)。
  <details><summary>参考 25 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcAXAhwF4UwVAQC5AcAcAcAAKgAFyAUBazAucgXOQIgWEAABADBCgEIIMM&replay=GDqOAzQFwwtWPCCA)；操作码 `GDqOAzQFwwtWPCCA`；路线来源：runs/consumed-bridge-20261009/manual-03.json.solution.solution.actions。

  </details>
- **runs/consumed-bridge-20261009/manual-04**：[试玩](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcAXAhwF4UwVAQC5AcAcA1zgACoABcgFAWswLnIFzkCqBYQAAEAMBCCgEIIMM)；未作玩家质量验收。 地图码 `AADAwEDg4ODg4AED4CFcAXAhwF4UwVAQC5AcAcA1zgACoABcgFAWswLnIFzkCqBYQAAEAMBCCgEIIMM`；[runs/consumed-bridge-20261009/manual-04.json.map](../../ghost-maze-ai/runs/consumed-bridge-20261009/manual-04.json)。
  <details><summary>参考 27 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcAXAhwF4UwVAQC5AcAcA1zgACoABcgFAWswLnIFzkCqBYQAAEAMBCCgEIIMM&replay=CD3O0CAI9C1WgPII)；操作码 `CD3O0CAI9C1WgPII`；路线来源：runs/consumed-bridge-20261009/manual-04.json.solution.solution.actions。

  </details>
- **runs/consumed-bridge-20261009/variant-down**：[试玩](https://ghostmaze.novic.cc/?map=AADAwEDg4ODgAAEJgAwC4CcC8KgIBcgOAAC0CoAAAXIBQFrMCqBc5AiAAAAEBCgEMMA)；未作玩家质量验收。 地图码 `AADAwEDg4ODgAAEJgAwC4CcC8KgIBcgOAAC0CoAAAXIBQFrMCqBc5AiAAAAEBCgEMMA`；[runs/consumed-bridge-20261009/variant-down.json.map](../../ghost-maze-ai/runs/consumed-bridge-20261009/variant-down.json)。
  尚无完整可验证的通关路线。
- **runs/consumed-bridge-20261009/variant-ordinary**：[试玩](https://ghostmaze.novic.cc/?map=AADAwEDg4ODgAAEJgAwC4CcC8KgIBcgOAACwCoAAAXIBQFrMCqBc5AiAAAAEAKAQww)；未作玩家质量验收。 地图码 `AADAwEDg4ODgAAEJgAwC4CcC8KgIBcgOAACwCoAAAXIBQFrMCqBc5AiAAAAEAKAQww`；[runs/consumed-bridge-20261009/variant-ordinary.json.map](../../ghost-maze-ai/runs/consumed-bridge-20261009/variant-ordinary.json)。
  <details><summary>参考 21 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwEDg4ODgAAEJgAwC4CcC8KgIBcgOAACwCoAAAXIBQFrMCqBc5AiAAAAEAKAQww&replay=GPg_U8nwtafMIIA)；操作码 `GPg_U8nwtafMIIA`；路线来源：runs/consumed-bridge-20261009/variant-ordinary.json.solution.solution.actions。

  </details>
- **runs/consumed-bridge-20261009/variant-up**：[试玩](https://ghostmaze.novic.cc/?map=AADAwEDg4ODgAAEJgAwC4CcC8KgIBcgOAAC0CoAAAXIBQFrMCqBc5AiAAAAEACgEMMA)；未作玩家质量验收。 地图码 `AADAwEDg4ODgAAEJgAwC4CcC8KgIBcgOAAC0CoAAAXIBQFrMCqBc5AiAAAAEACgEMMA`；[runs/consumed-bridge-20261009/variant-up.json.map](../../ghost-maze-ai/runs/consumed-bridge-20261009/variant-up.json)。
  <details><summary>参考 21 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwEDg4ODgAAEJgAwC4CcC8KgIBcgOAAC0CoAAAXIBQFrMCqBc5AiAAAAEACgEMMA&replay=GM5z0SPwtafMIIA)；操作码 `GM5z0SPwtafMIIA`；路线来源：runs/consumed-bridge-20261009/variant-up.json.solution.solution.actions。

  </details>
- **runs/coupled-search/candidate-12579**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPj4-Pj4AAFJ4CgiAvADAgCqhxcgQIArkKqAAAACFCJCpQlITigAAAMAIAA)；未作玩家质量验收。 地图码 `AADAAPj4-Pj4AAFJ4CgiAvADAgCqhxcgQIArkKqAAAACFCJCpQlITigAAAMAIAA`；[runs/coupled-search/candidate-12579.json](../../ghost-maze-ai/runs/coupled-search/candidate-12579.json)。
  尚无完整可验证的通关路线。
- **runs/coupled-search/preview-room**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPD4cPDwAAFBoAdAWABgQBVBxchJCAK4FUAAAACEExtBSCVBOIAAABgBAA)；未作玩家质量验收。 地图码 `AADAAPD4cPDwAAFBoAdAWABgQBVBxchJCAK4FUAAAACEExtBSCVBOIAAABgBAA`；[runs/coupled-search/preview-room.json](../../ghost-maze-ai/runs/coupled-search/preview-room.json)。
  尚无完整可验证的通关路线。
- **runs/coupled-search/refined-false-false**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPj4-Pj4AAFJ4AhAXgBgQBVQ4uQIEAVyFVAAAABChEhUoSkJxQAAAGAEAA)；未作玩家质量验收。 地图码 `AADAAPj4-Pj4AAFJ4AhAXgBgQBVQ4uQIEAVyFVAAAABChEhUoSkJxQAAAGAEAA`；[runs/coupled-search/refined-false-false.json](../../ghost-maze-ai/runs/coupled-search/refined-false-false.json)。
  尚无完整可验证的通关路线。
- **runs/coupled-search/refined-false-true**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPD4cPDwAAFBoAdAWABgQBVBxchJCAK4FUAAAACEESCkEqCcQAAADACA)；未作玩家质量验收。 地图码 `AADAAPD4cPDwAAFBoAdAWABgQBVBxchJCAK4FUAAAACEESCkEqCcQAAADACA`；[runs/coupled-search/refined-false-true.json](../../ghost-maze-ai/runs/coupled-search/refined-false-true.json)。
  尚无完整可验证的通关路线。
- **runs/coupled-search/refined-true-false**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPj4-Pj4AAFJ4AhAXgBgQBVQ4uQIEAVyFVAAAABChG0KlCUhOKAAAAwAgA)；未作玩家质量验收。 地图码 `AADAAPj4-Pj4AAFJ4AhAXgBgQBVQ4uQIEAVyFVAAAABChG0KlCUhOKAAAAwAgA`；[runs/coupled-search/refined-true-false.json](../../ghost-maze-ai/runs/coupled-search/refined-true-false.json)。
  尚无完整可验证的通关路线。
- **runs/coupled-search/refined-true-true**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPD4cPDwAAFBoAdAWABgQBVBxchJCAK4FUAAAACEEbQUglQTiAAAAYAQAA)；未作玩家质量验收。 地图码 `AADAAPD4cPDwAAFBoAdAWABgQBVBxchJCAK4FUAAAACEEbQUglQTiAAAAYAQAA`；[runs/coupled-search/refined-true-true.json](../../ghost-maze-ai/runs/coupled-search/refined-true-true.json)。
  尚无完整可验证的通关路线。
- **runs/coupled-search/short-h25-0**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPD4cPDwAAFBoAdAWABgQBVBxchJCAFwKoAAAAEIJjaCkEqCcQAAADACAA)；未作玩家质量验收。 地图码 `AADAAPD4cPDwAAFBoAdAWABgQBVBxchJCAFwKoAAAAEIJjaCkEqCcQAAADACAA`；[runs/coupled-search/short-h25-0.json](../../ghost-maze-ai/runs/coupled-search/short-h25-0.json)。
  尚无完整可验证的通关路线。
- **runs/coupled-search/short-h25-2**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPD4cPDwAAFBoAdAWABgQBVBxchJCAMXAqgAAAAQgmNoKQSoJxAAAAMAIAA)；未作玩家质量验收。 地图码 `AADAAPD4cPDwAAFBoAdAWABgQBVBxchJCAMXAqgAAAAQgmNoKQSoJxAAAAMAIAA`；[runs/coupled-search/short-h25-2.json](../../ghost-maze-ai/runs/coupled-search/short-h25-2.json)。
  尚无完整可验证的通关路线。
- **runs/coupled-search/short-h32-2**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPD4cPDwAAFBoAdAWABgQBVBxjkJIQBXAqgAAAAQgmNoKQSoJxAAAAMAIAA)；未作玩家质量验收。 地图码 `AADAAPD4cPDwAAFBoAdAWABgQBVBxjkJIQBXAqgAAAAQgmNoKQSoJxAAAAMAIAA`；[runs/coupled-search/short-h32-2.json](../../ghost-maze-ai/runs/coupled-search/short-h32-2.json)。
  尚无完整可验证的通关路线。
- **runs/coupled-search/short-h33-2**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPD4cPDwAAFBoAdAWABgQBVBxchMIQBXAqgAAAAQgmNoKQSoJxAAAAMAIAA)；未作玩家质量验收。 地图码 `AADAAPD4cPDwAAFBoAdAWABgQBVBxchMIQBXAqgAAAAQgmNoKQSoJxAAAAMAIAA`；[runs/coupled-search/short-h33-2.json](../../ghost-maze-ai/runs/coupled-search/short-h33-2.json)。
  尚无完整可验证的通关路线。
- **runs/coupled-search/short-v33-0**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPD4cPDwAAFBoAdAWABgQBVBxchJCAK4FUAAAACEExtBEEqCcQAAADACAA)；未作玩家质量验收。 地图码 `AADAAPD4cPDwAAFBoAdAWABgQBVBxchJCAK4FUAAAACEExtBEEqCcQAAADACAA`；[runs/coupled-search/short-v33-0.json](../../ghost-maze-ai/runs/coupled-search/short-v33-0.json)。
  尚无完整可验证的通关路线。
- **runs/coupled-search/short-v33-2**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPD4cPDwAAFBoAdAWABgQBVBxchJCAK4FUAAAACEExtBYQSoJxAAAAMAIAA)；未作玩家质量验收。 地图码 `AADAAPD4cPDwAAFBoAdAWABgQBVBxchJCAK4FUAAAACEExtBYQSoJxAAAAMAIAA`；[runs/coupled-search/short-v33-2.json](../../ghost-maze-ai/runs/coupled-search/short-v33-2.json)。
  尚无完整可验证的通关路线。
- **runs/deferred-key-cold-entry-20261012/entity-counter-01**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUAdhpQlwEQLkFOAAABzIFCzWIHMcgECMwEgLEBUBIBABhgAGGEAg)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUAdhpQlwEQLkFOAAABzIFCzWIHMcgECMwEgLEBUBIBABhgAGGEAg`；[runs/deferred-key-cold-entry-20261012/entity-counter-01.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/entity-counter-01.json)。
  尚无完整可验证的通关路线。
- **runs/deferred-key-cold-entry-20261012/entity-counter-02**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUAXApQlwEQLkFOAAABzIFCzWIHMcgECMwEgLEBUBIBABhgAGGEAg)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUAXApQlwEQLkFOAAABzIFCzWIHMcgECMwEgLEBUBIBABhgAGGEAg`；[runs/deferred-key-cold-entry-20261012/entity-counter-02.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/entity-counter-02.json)。
  尚无完整可验证的通关路线。
- **runs/deferred-key-cold-entry-20261012/entity-counter-03**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90BPKArgOw0oS4CIFyCnAAAA5kChZrEDmOQCBGYCQFiAqAkAgAwwADDCAQ)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90BPKArgOw0oS4CIFyCnAAAA5kChZrEDmOQCBGYCQFiAqAkAgAwwADDCAQ`；[runs/deferred-key-cold-entry-20261012/entity-counter-03.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/entity-counter-03.json)。
  尚无完整可验证的通关路线。
- **runs/deferred-key-cold-entry-20261012/entity-counter-04**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90BbKArgOw0oS4CIFyCnAAAA5kChZrEDmOQCBGYCQFiAqAkAgAwwADDCAQ)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90BbKArgOw0oS4CIFyCnAAAA5kChZrEDmOQCBGYCQFiAqAkAgAwwADDCAQ`；[runs/deferred-key-cold-entry-20261012/entity-counter-04.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/entity-counter-04.json)。
  尚无完整可验证的通关路线。
- **runs/deferred-key-cold-entry-20261012/entity-counter-05**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90BaeArgOw0oS4CIFyCnAAAA5kChZrEDmOQCBGYCQFiAqAkAgAwwADDCAQ)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90BaeArgOw0oS4CIFyCnAAAA5kChZrEDmOQCBGYCQFiAqAkAgAwwADDCAQ`；[runs/deferred-key-cold-entry-20261012/entity-counter-05.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/entity-counter-05.json)。
  尚无完整可验证的通关路线。
- **runs/deferred-key-cold-entry-20261012/entity-counter-06**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4A6BNPKArgOw0oS4CIFyCnAAAA5kChZrEDmOQCBGYCQFiAqAkAgAwwADDCAQ)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4A6BNPKArgOw0oS4CIFyCnAAAA5kChZrEDmOQCBGYCQFiAqAkAgAwwADDCAQ`；[runs/deferred-key-cold-entry-20261012/entity-counter-06.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/entity-counter-06.json)。
  <details><summary>参考 33 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4A6BNPKArgOw0oS4CIFyCnAAAA5kChZrEDmOQCBGYCQFiAqAkAgAwwADDCAQ&replay=GFgFGG-9dYMODJX4KIA)；操作码 `GFgFGG-9dYMODJX4KIA`；路线来源：runs/deferred-key-cold-entry-20261012/entity-counter-06.json.result.solution.actions。

  </details>
- **runs/deferred-key-cold-entry-20261012/entity-counter-07**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4A-BNPKArgOw0oS4CIFyCnAAAA5kChZrEDmOQCBGYCQFiAqAkAgAwwADDCAQ)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4A-BNPKArgOw0oS4CIFyCnAAAA5kChZrEDmOQCBGYCQFiAqAkAgAwwADDCAQ`；[runs/deferred-key-cold-entry-20261012/entity-counter-07.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/entity-counter-07.json)。
  <details><summary>参考 33 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4A-BNPKArgOw0oS4CIFyCnAAAA5kChZrEDmOQCBGYCQFiAqAkAgAwwADDCAQ&replay=GHItIA2Pp9cODJX4KIA)；操作码 `GHItIA2Pp9cODJX4KIA`；路线来源：runs/deferred-key-cold-entry-20261012/entity-counter-07.json.result.solution.actions。

  </details>
- **runs/deferred-key-cold-entry-20261012/entry-map**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8LAwMDED4DB0CaecBXAdhpQlwEQLkGpwIAAHMgULNYgcxyAQIzBUgLEBUBIBAAYYABhhAIA)；未作玩家质量验收。 地图码 `AADBsPDg8LAwMDED4DB0CaecBXAdhpQlwEQLkGpwIAAHMgULNYgcxyAQIzBUgLEBUBIBAAYYABhhAIA`；[runs/deferred-key-cold-entry-20261012/entry-map.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/entry-map.json)。
  <details><summary>参考 60 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8LAwMDED4DB0CaecBXAdhpQlwEQLkGpwIAAHMgULNYgcxyAQIzBUgLEBUBIBAAYYABhhAIA&replay=ALLaT1IjyZvVcYA-q-jzJX52AKI)；操作码 `ALLaT1IjyZvVcYA-q-jzJX52AKI`；路线来源：runs/deferred-key-cold-entry-20261012/entry-map.json.result.solution.actions。

  </details>
- **runs/deferred-key-cold-entry-20261012/wall-counter-01**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQkBEC5BTgAAAcyBQs1iBzHIBAjMBICxAVASAAYYABhhAI)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQkBEC5BTgAAAcyBQs1iBzHIBAjMBICxAVASAAYYABhhAI`；[runs/deferred-key-cold-entry-20261012/wall-counter-01.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-01.json)。
  <details><summary>参考 40 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQkBEC5BTgAAAcyBQs1iBzHIBAjMBICxAVASAAYYABhhAI&replay=ALH4CDMzNJmY8mb14KMi)；操作码 `ALH4CDMzNJmY8mb14KMi`；路线来源：runs/deferred-key-cold-entry-20261012/wall-counter-01.json.result.solution.actions。

  </details>
- **runs/deferred-key-cold-entry-20261012/wall-counter-02**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlAiBcgpwAAAOZAoWaxA5jkAgRmAkBYgKgJAAMMAAwwgE)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlAiBcgpwAAAOZAoWaxA5jkAgRmAkBYgKgJAAMMAAwwgE`；[runs/deferred-key-cold-entry-20261012/wall-counter-02.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-02.json)。
  尚无完整可验证的通关路线。
- **runs/deferred-key-cold-entry-20261012/wall-counter-03**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQJBTgAAAcyBQs1iBzHIBAjMBICxAVASAQYYABhhAI)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQJBTgAAAcyBQs1iBzHIBAjMBICxAVASAQYYABhhAI`；[runs/deferred-key-cold-entry-20261012/wall-counter-03.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-03.json)。
  尚无完整可验证的通关路线。
- **runs/deferred-key-cold-entry-20261012/wall-counter-04**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQKgpwAAAOZAoWaxA5jkAgRmAkBYgKgJAIMMAAwwgE)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQKgpwAAAOZAoWaxA5jkAgRmAkBYgKgJAIMMAAwwgE`；[runs/deferred-key-cold-entry-20261012/wall-counter-04.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-04.json)。
  尚无完整可验证的通关路线。
- **runs/deferred-key-cold-entry-20261012/wall-counter-05**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFAAAAcyBQs1iBzHIBAjMBICxAVASAQAYABhhAI)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFAAAAcyBQs1iBzHIBAjMBICxAVASAQAYABhhAI`；[runs/deferred-key-cold-entry-20261012/wall-counter-05.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-05.json)。
  <details><summary>参考 63 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFAAAAcyBQs1iBzHIBAjMBICxAVASAQAYABhhAI&replay=CJihYHWPJm9dYMO1gq-jzJXlw4KI)；操作码 `CJihYHWPJm9dYMO1gq-jzJXlw4KI`；路线来源：runs/deferred-key-cold-entry-20261012/wall-counter-05.json.result.solution.actions。

  </details>
- **runs/deferred-key-cold-entry-20261012/wall-counter-06**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFIAAAOZAoWaxA5jkAgRmAkBYgKgJAIAMAAwwgE)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFIAAAOZAoWaxA5jkAgRmAkBYgKgJAIAMAAwwgE`；[runs/deferred-key-cold-entry-20261012/wall-counter-06.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-06.json)。
  尚无完整可验证的通关路线。
- **runs/deferred-key-cold-entry-20261012/wall-counter-07**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAAAyBQs1iBzHIBAjMBICxAVASAQAYABhhAI)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAAAyBQs1iBzHIBAjMBICxAVASAQAYABhhAI`；[runs/deferred-key-cold-entry-20261012/wall-counter-07.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-07.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAAAyBQs1iBzHIBAjMBICxAVASAQAYABhhAI&replay=CMoZy5GPJm9VxgD6r6PMlfnYAog)；操作码 `CMoZy5GPJm9VxgD6r6PMlfnYAog`；路线来源：runs/deferred-key-cold-entry-20261012/wall-counter-07.json.result.solution.actions。

  </details>
- **runs/deferred-key-cold-entry-20261012/wall-counter-08**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABZAoWaxA5jkAgRmAkBYgKgJAIAMAAwwgE)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABZAoWaxA5jkAgRmAkBYgKgJAIAMAAwwgE`；[runs/deferred-key-cold-entry-20261012/wall-counter-08.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-08.json)。
  尚无完整可验证的通关路线。
- **runs/deferred-key-cold-entry-20261012/wall-counter-09**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABwBQs1iBzHIBAjMBICxAVASAQAYYGGEAg)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABwBQs1iBzHIBAjMBICxAVASAQAYYGGEAg`；[runs/deferred-key-cold-entry-20261012/wall-counter-09.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-09.json)。
  尚无完整可验证的通关路线。
- **runs/deferred-key-cold-entry-20261012/wall-counter-10**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAAByAoWaxA5jkAgRmAkBYgKgJAIAMMDDCAQ)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAAByAoWaxA5jkAgRmAkBYgKgJAIAMMDDCAQ`；[runs/deferred-key-cold-entry-20261012/wall-counter-10.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-10.json)。
  尚无完整可验证的通关路线。
- **runs/deferred-key-cold-entry-20261012/wall-counter-11**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzAFCzWIHMcgECMwEgLEBUBIBABhgYYQCA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzAFCzWIHMcgECMwEgLEBUBIBABhgYYQCA`；[runs/deferred-key-cold-entry-20261012/wall-counter-11.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-11.json)。
  <details><summary>参考 51 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzAFCzWIHMcgECMwEgLEBUBIBABhgYYQCA&replay=CBL-XsSPJm9dYA-q-jzJX4KI)；操作码 `CBL-XsSPJm9dYA-q-jzJX4KI`；路线来源：runs/deferred-key-cold-entry-20261012/wall-counter-11.json.result.solution.actions。

  </details>
- **runs/deferred-key-cold-entry-20261012/wall-counter-12**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCViBzHIBAjMBICxAVASAQAYYAGEAg)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCViBzHIBAjMBICxAVASAQAYYAGEAg`；[runs/deferred-key-cold-entry-20261012/wall-counter-12.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-12.json)。
  <details><summary>参考 6 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCViBzHIBAjMBICxAVASAQAYYAGEAg&replay=ENqKrU8yIA)；操作码 `ENqKrU8yIA`；路线来源：runs/deferred-key-cold-entry-20261012/wall-counter-12.json.result.solution.actions。

  </details>
- **runs/deferred-key-cold-entry-20261012/wall-counter-13**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCqxA5jkAgRmAkBYgKgJAIAMMADCAQ)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCqxA5jkAgRmAkBYgKgJAIAMMADCAQ`；[runs/deferred-key-cold-entry-20261012/wall-counter-13.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-13.json)。
  尚无完整可验证的通关路线。
- **runs/deferred-key-cold-entry-20261012/wall-counter-14**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCxWIHMcgECMwEgLEBUBIBABhgAYQCA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCxWIHMcgECMwEgLEBUBIBABhgAYQCA`；[runs/deferred-key-cold-entry-20261012/wall-counter-14.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-14.json)。
  <details><summary>参考 6 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCxWIHMcgECMwEgLEBUBIBABhgAYQCA&replay=EFfVFk4yIA)；操作码 `EFfVFk4yIA`；路线来源：runs/deferred-key-cold-entry-20261012/wall-counter-14.json.result.solution.actions。

  </details>
- **runs/deferred-key-cold-entry-20261012/wall-counter-15**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzSBzHIBAjMBICxAVASAQAYYABhhAI)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzSBzHIBAjMBICxAVASAQAYYABhhAI`；[runs/deferred-key-cold-entry-20261012/wall-counter-15.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-15.json)。
  <details><summary>参考 66 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzSBzHIBAjMBICxAVASAQAYYABhhAI&replay=EOAOzaCPJm9VxgD6r6PDaZv-dgoyIA)；操作码 `EOAOzaCPJm9VxgD6r6PDaZv-dgoyIA`；路线来源：runs/deferred-key-cold-entry-20261012/wall-counter-15.json.result.solution.actions。

  </details>
- **runs/deferred-key-cold-entry-20261012/wall-counter-16**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzVA5jkAgRmAkBYgKgJAIAMMAAwwgE)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzVA5jkAgRmAkBYgKgJAIAMMAAwwgE`；[runs/deferred-key-cold-entry-20261012/wall-counter-16.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-16.json)。
  尚无完整可验证的通关路线。
- **runs/deferred-key-cold-entry-20261012/wall-counter-17**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIDHIBAjMBICxAVASAQAYYABhAI)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIDHIBAjMBICxAVASAQAYYABhAI`；[runs/deferred-key-cold-entry-20261012/wall-counter-17.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-17.json)。
  <details><summary>参考 40 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIDHIBAjMBICxAVASAQAYYABhAI&replay=AJydhfaPJm9eD6r6PMmi)；操作码 `AJydhfaPJm9eD6r6PMmi`；路线来源：runs/deferred-key-cold-entry-20261012/wall-counter-17.json.result.solution.actions。

  </details>
- **runs/deferred-key-cold-entry-20261012/wall-counter-18**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIFjkAgRmAkBYgKgJAIAMMAAwgE)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIFjkAgRmAkBYgKgJAIAMMAAwgE`；[runs/deferred-key-cold-entry-20261012/wall-counter-18.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-18.json)。
  尚无完整可验证的通关路线。
- **runs/deferred-key-cold-entry-20261012/wall-counter-19**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHHIBAjMBICxAVASAQAYYABhhAI)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHHIBAjMBICxAVASAQAYYABhhAI`；[runs/deferred-key-cold-entry-20261012/wall-counter-19.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-19.json)。
  尚无完整可验证的通关路线。
- **runs/deferred-key-cold-entry-20261012/wall-counter-20**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHLkAgRmAkBYgKgJAIAMMAAwwgE)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHLkAgRmAkBYgKgJAIAMMAAwwgE`；[runs/deferred-key-cold-entry-20261012/wall-counter-20.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-20.json)。
  尚无完整可验证的通关路线。
- **runs/deferred-key-cold-entry-20261012/wall-counter-21**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMIBAjMBICxAVASAQAYYABhgI)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMIBAjMBICxAVASAQAYYABhgI`；[runs/deferred-key-cold-entry-20261012/wall-counter-21.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-21.json)。
  <details><summary>参考 36 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMIBAjMBICxAVASAQAYYABhgI&replay=AISeFEIz6ZjyZvXgoyI)；操作码 `AISeFEIz6ZjyZvXgoyI`；路线来源：runs/deferred-key-cold-entry-20261012/wall-counter-21.json.result.solution.actions。

  </details>
- **runs/deferred-key-cold-entry-20261012/wall-counter-22**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMUAgRmAkBYgKgJAIAMMAAwwE)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMUAgRmAkBYgKgJAIAMMAAwwE`；[runs/deferred-key-cold-entry-20261012/wall-counter-22.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-22.json)。
  尚无完整可验证的通关路线。
- **runs/deferred-key-cold-entry-20261012/wall-counter-23**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECEBICxAVASAQAYYABhhA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECEBICxAVASAQAYYABhhA`；[runs/deferred-key-cold-entry-20261012/wall-counter-23.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-23.json)。
  尚无完整可验证的通关路线。
- **runs/deferred-key-cold-entry-20261012/wall-counter-24**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECKAkBYgKgJAIAMMAAwwg)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECKAkBYgKgJAIAMMAAwwg`；[runs/deferred-key-cold-entry-20261012/wall-counter-24.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-24.json)。
  尚无完整可验证的通关路线。
- **runs/deferred-key-cold-entry-20261012/wall-counter-25**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECMQEgLEBUBIBABhgAGGEA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECMQEgLEBUBIBABhgAGGEA`；[runs/deferred-key-cold-entry-20261012/wall-counter-25.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-25.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECMQEgLEBUBIBABhgAGGEA&replay=CBt95EaPJm9VxgD6r6PMlfl4Aog)；操作码 `CBt95EaPJm9VxgD6r6PMlfl4Aog`；路线来源：runs/deferred-key-cold-entry-20261012/wall-counter-25.json.result.solution.actions。

  </details>
- **runs/deferred-key-cold-entry-20261012/wall-counter-26**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECMwEgJAVASAQAYYABhhAI)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECMwEgJAVASAQAYYABhhAI`；[runs/deferred-key-cold-entry-20261012/wall-counter-26.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-26.json)。
  <details><summary>参考 57 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECMwEgJAVASAQAYYABhhAI&replay=GBQ42HWPp9dYACZv-q-jzJX4KIA)；操作码 `GBQ42HWPp9dYACZv-q-jzJX4KIA`；路线来源：runs/deferred-key-cold-entry-20261012/wall-counter-26.json.result.solution.actions。

  </details>
- **runs/deferred-key-cold-entry-20261012/wall-counter-27**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECMwEgKgKgJAIAMMAAwwgE)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECMwEgKgKgJAIAMMAAwwgE`；[runs/deferred-key-cold-entry-20261012/wall-counter-27.json.map](../../ghost-maze-ai/runs/deferred-key-cold-entry-20261012/wall-counter-27.json)。
  <details><summary>参考 63 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECMwEgKgKgJAIAMMAAwwgE&replay=CEWJF4mPJm9VxgD6r6PMlfnVgAKI)；操作码 `CEWJF4mPJm9VxgD6r6PMlfnVgAKI`；路线来源：runs/deferred-key-cold-entry-20261012/wall-counter-27.json.result.solution.actions。

  </details>
- **runs/door-challenge-20261011/manual-pocket-01**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPj4-PgAAAFIIDJ8AfACYABVQGIRzgwAqoAAAAACCEVCJC4ygAAAAAggAIA)；未作玩家质量验收。 地图码 `AADAAPj4-PgAAAFIIDJ8AfACYABVQGIRzgwAqoAAAAACCEVCJC4ygAAAAAggAIA`；[runs/door-challenge-20261011/manual-pocket-01.json.map](../../ghost-maze-ai/runs/door-challenge-20261011/manual-pocket-01.json)。
  <details><summary>参考 33 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPj4-PgAAAFIIDJ8AfACYABVQGIRzgwAqoAAAAACCEVCJC4ygAAAAAggAIA&replay=GHAHmdX_6VJjw_klfAA)；操作码 `GHAHmdX_6VJjw_klfAA`；路线来源：runs/door-challenge-20261011/manual-pocket-01.json.result.solution.actions。

  </details>
- **runs/door-challenge-20261011/manual-pocket-02**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPz8_PgAAAFQIDWUAlACAABVUDFojnBgIqoAAAAACOERVERFxlAAAAAAQQQAEA)；未作玩家质量验收。 地图码 `AADAAPz8_PgAAAFQIDWUAlACAABVUDFojnBgIqoAAAAACOERVERFxlAAAAAAQQQAEA`；[runs/door-challenge-20261011/manual-pocket-02.json.map](../../ghost-maze-ai/runs/door-challenge-20261011/manual-pocket-02.json)。
  尚无完整可验证的通关路线。
- **runs/door-challenge-20261011/manual-pocket-03**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPz8_PgAAAFQIDWUAlARACAABVUDFojnBgIqoAAAAACOERVERFxlAAAAAAQQQAE)；未作玩家质量验收。 地图码 `AADAAPz8_PgAAAFQIDWUAlARACAABVUDFojnBgIqoAAAAACOERVERFxlAAAAAAQQQAE`；[runs/door-challenge-20261011/manual-pocket-03.json.map](../../ghost-maze-ai/runs/door-challenge-20261011/manual-pocket-03.json)。
  <details><summary>参考 27 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPz8_PgAAAFQIDWUAlARACAABVUDFojnBgIqoAAAAACOERVERFxlAAAAAAQQQAE&replay=CHhAwaDxUmPA0lfA)；操作码 `CHhAwaDxUmPA0lfA`；路线来源：runs/door-challenge-20261011/manual-pocket-03.json.result.solution.actions。

  </details>
- **runs/door-challenge-20261011/manual-pocket-04**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPz8_PgAAAFQIDWUAlARACAABVUDForXODARVQAAAAAEcIiqIiLjKAAAAAIIIIAC)；未作玩家质量验收。 地图码 `AADAAPz8_PgAAAFQIDWUAlARACAABVUDForXODARVQAAAAAEcIiqIiLjKAAAAAIIIIAC`；[runs/door-challenge-20261011/manual-pocket-04.json.map](../../ghost-maze-ai/runs/door-challenge-20261011/manual-pocket-04.json)。
  <details><summary>参考 33 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPz8_PgAAAFQIDWUAlARACAABVUDForXODARVQAAAAAEcIiqIiLjKAAAAAIIIIAC&replay=GLA3UqX9IVKfzwilfAA)；操作码 `GLA3UqX9IVKfzwilfAA`；路线来源：runs/door-challenge-20261011/manual-pocket-04.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/audit-composite-04**：[试玩](https://ghostmaze.novic.cc/?map=AADBsfHw8HAwMAEDoDCMBgiBugCARwtw0oXLIOQJc4EcBAABQALNYhGOQioJzMCUBUBIAAMCAADDAggQEA)；未作玩家质量验收。 地图码 `AADBsfHw8HAwMAEDoDCMBgiBugCARwtw0oXLIOQJc4EcBAABQALNYhGOQioJzMCUBUBIAAMCAADDAggQEA`；[runs/door-continuation-20261012/audit-composite-04.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/audit-composite-04.json)、[runs/door-continuation-20261012/manual-composite-04.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-composite-04.json)。
  <details><summary>参考 61 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsfHw8HAwMAEDoDCMBgiBugCARwtw0oXLIOQJc4EcBAABQALNYhGOQioJzMCUBUBIAAMCAADDAggQEA&replay=GIY9RumD6W9XgPqt4oj_cIVYiHCA)；操作码 `GIY9RumD6W9XgPqt4oj_cIVYiHCA`；路线来源：runs/door-continuation-20261012/manual-composite-04.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/audit-delayed-key-01**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C10CaeUBXAdhpQkBEC5BTgAAAcyBQs1iBzHIBAjMBUBYgKgJAAMMAAwwgE)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C10CaeUBXAdhpQkBEC5BTgAAAcyBQs1iBzHIBAjMBUBYgKgJAAMMAAwwgE`；[runs/door-continuation-20261012/audit-delayed-key-01.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/audit-delayed-key-01.json)、[runs/door-continuation-20261012/manual-delayed-key-01.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-delayed-key-01.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C10CaeUBXAdhpQkBEC5BTgAAAcyBQs1iBzHIBAjMBUBYgKgJAAMMAAwwgE&replay=CIFUHPiPJm9VxgD6r6PMlflwgog)；操作码 `CIFUHPiPJm9VxgD6r6PMlflwgog`；路线来源：runs/door-continuation-20261012/manual-delayed-key-01.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/audit-timed-bridge-04**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDw8DAwMAEDIC58BceAsgPw0oS4CAHAUAADIFAAs1iBzHIBQRiAqAqAkAAEAAAQYQA)；未作玩家质量验收。 地图码 `AADBsPDw8DAwMAEDIC58BceAsgPw0oS4CAHAUAADIFAAs1iBzHIBQRiAqAqAkAAEAAAQYQA`；[runs/door-continuation-20261012/audit-timed-bridge-04.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/audit-timed-bridge-04.json)。
  <details><summary>参考 37 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDw8DAwMAEDIC58BceAsgPw0oS4CAHAUAADIFAAs1iBzHIBQRiAqAqAkAAEAAAQYQA&replay=GCjCVI-M1VxgPCNXrCiA)；操作码 `GCjCVI-M1VxgPCNXrCiA`；路线来源：runs/door-continuation-20261012/audit-timed-bridge-04.json.reference.solution.actions。

  </details>
- **runs/door-continuation-20261012/cold-entry-probe-01**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQkAIFyCnAAAA5kChZrEDmOQCBYZgKgLEBUBIABhgAGGEAg)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDECIC10CaeUBXAdhpQkAIFyCnAAAA5kChZrEDmOQCBYZgKgLEBUBIABhgAGGEAg`；[runs/door-continuation-20261012/cold-entry-probe-01.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/cold-entry-probe-01.json)。
  <details><summary>参考 37 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQkAIFyCnAAAA5kChZrEDmOQCBYZgKgLEBUBIABhgAGGEAg&replay=GJzbwXA80mlg-lvXgoCA)；操作码 `GJzbwXA80mlg-lvXgoCA`；路线来源：runs/door-continuation-20261012/cold-entry-probe-01.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/cold-entry-probe-02**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQkAIDkFOAAABzIFCzWIHMcgECwzAVAWICoCQADDAAMMIBA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDECIC10CaeUBXAdhpQkAIDkFOAAABzIFCzWIHMcgECwzAVAWICoCQADDAAMMIBA`；[runs/door-continuation-20261012/cold-entry-probe-02.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/cold-entry-probe-02.json)。
  <details><summary>参考 34 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQkAIDkFOAAABzIFCzWIHMcgECwzAVAWICoCQADDAAMMIBA&replay=EIoG0kNg-XifXgA0miA)；操作码 `EIoG0kNg-XifXgA0miA`；路线来源：runs/door-continuation-20261012/cold-entry-probe-02.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/cold-entry-probe-03**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQkAIDkFOAAABzIFCzWIHMcgECmYCoCxAVASAAYYABhhAI)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDECIC10CaeUBXAdhpQkAIDkFOAAABzIFCzWIHMcgECmYCoCxAVASAAYYABhhAI`；[runs/door-continuation-20261012/cold-entry-probe-03.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/cold-entry-probe-03.json)。
  <details><summary>参考 36 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQkAIDkFOAAABzIFCzWIHMcgECmYCoCxAVASAAYYABhhAI&replay=AGdm3Plg-XgzSVXgsKI)；操作码 `AGdm3Plg-XgzSVXgsKI`；路线来源：runs/door-continuation-20261012/cold-entry-probe-03.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/cold-entry-probe-04**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwAgXIKcAAADmQKFmsQOY5AIFhmAqAsQFQEgEAGGAAYYQCA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwAgXIKcAAADmQKFmsQOY5AIFhmAqAsQFQEgEAGGAAYYQCA`；[runs/door-continuation-20261012/cold-entry-probe-04.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/cold-entry-probe-04.json)、[runs/door-continuation-20261012/cold-entry-trace-04.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/cold-entry-trace-04.json)。
  <details><summary>参考 41 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwAgXIKcAAADmQKFmsQOY5AIFhmAqAsQFQEgEAGGAAYYQCA&replay=GAuN38Vg-lvXg-q-jPpggA)；操作码 `GAuN38Vg-lvXg-q-jPpggA`；路线来源：runs/door-continuation-20261012/cold-entry-probe-04.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/cold-entry-probe-05**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwAgOQU4AAAHMgULNYgcxyAQLDMBUBYgKgJAIAMMAAwwgEA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwAgOQU4AAAHMgULNYgcxyAQLDMBUBYgKgJAIAMMAAwwgEA`；[runs/door-continuation-20261012/cold-entry-probe-05.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/cold-entry-probe-05.json)、[runs/door-continuation-20261012/cold-entry-trace-05.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/cold-entry-trace-05.json)。
  <details><summary>参考 37 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwAgOQU4AAAHMgULNYgcxyAQLDMBUBYgKgJAIAMMAAwwgEA&replay=GBLEEWlg-Xg1Xg-DloCA)；操作码 `GBLEEWlg-Xg1Xg-DloCA`；路线来源：runs/door-continuation-20261012/cold-entry-probe-05.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/cold-entry-probe-06**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwAgOQU4AAAHMgULNYgcxyAQKZgKgLEBUBIBABhgAGGEAgA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwAgOQU4AAAHMgULNYgcxyAQKZgKgLEBUBIBABhgAGGEAgA`；[runs/door-continuation-20261012/cold-entry-probe-06.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/cold-entry-probe-06.json)、[runs/door-continuation-20261012/cold-entry-trace-06.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/cold-entry-trace-06.json)。
  <details><summary>参考 39 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwAgOQU4AAAHMgULNYgcxyAQKZgKgLEBUBIBABhgAGGEAgA&replay=CEyyyTRg-Xg1Xg-sMmYI)；操作码 `CEyyyTRg-Xg1Xg-sMmYI`；路线来源：runs/door-continuation-20261012/cold-entry-probe-06.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/cold-entry-probe-07**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwHCBcgpwAAAOZAoWaxA5jkAgWGYCoCxAVASAQYAYYABhhAI)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwHCBcgpwAAAOZAoWaxA5jkAgWGYCoCxAVASAQYAYYABhhAI`；[runs/door-continuation-20261012/cold-entry-probe-07.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/cold-entry-probe-07.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/cold-entry-probe-08**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwHCA5BTgAAAcyBQs1iBzHIBAsMwFQFiAqAkAgwAwwADDCAQ)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwHCA5BTgAAAcyBQs1iBzHIBAsMwFQFiAqAkAgwAwwADDCAQ`；[runs/door-continuation-20261012/cold-entry-probe-08.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/cold-entry-probe-08.json)。
  <details><summary>参考 46 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwHCA5BTgAAAcyBQs1iBzHIBAsMwFQFiAqAkAgwAwwADDCAQ&replay=ENxyN8pg-Xg1XWDDgyV-oCA)；操作码 `ENxyN8pg-Xg1XWDDgyV-oCA`；路线来源：runs/door-continuation-20261012/cold-entry-probe-08.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/cold-entry-probe-09**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwHCA5BTgAAAcyBQs1iBzHIBApmAqAsQFQEgEGAGGAAYYQCA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwHCA5BTgAAAcyBQs1iBzHIBApmAqAsQFQEgEGAGGAAYYQCA`；[runs/door-continuation-20261012/cold-entry-probe-09.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/cold-entry-probe-09.json)。
  <details><summary>参考 48 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwHCA5BTgAAAcyBQs1iBzHIBApmAqAsQFQEgEGAGGAAYYQCA&replay=AGqz0GZg-Xg1XWDDgyV-sKI)；操作码 `AGqz0GZg-Xg1XWDDgyV-sKI`；路线来源：runs/door-continuation-20261012/cold-entry-probe-09.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/cold-entry-probe-10**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECwzAVAWICoCQCADDAAMMIBA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECwzAVAWICoCQCADDAAMMIBA`；[runs/door-continuation-20261012/cold-entry-probe-10.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/cold-entry-probe-10.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/cold-entry-probe-11**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwEQHIKcAAADmQKFmsQOY5AIFhmAqAsQFQEgEAGGAAYYQCA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwEQHIKcAAADmQKFmsQOY5AIFhmAqAsQFQEgEAGGAAYYQCA`；[runs/door-continuation-20261012/cold-entry-probe-11.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/cold-entry-probe-11.json)。
  <details><summary>参考 46 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwEQHIKcAAADmQKFmsQOY5AIFhmAqAsQFQEgEAGGAAYYQCA&replay=EHA1cXNjOXifXWDDgyV-CiA)；操作码 `EHA1cXNjOXifXWDDgyV-CiA`；路线来源：runs/door-continuation-20261012/cold-entry-probe-11.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/cold-entry-probe-12**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwEQHIKcAAADmQKFmsQOY5AIFMwFQFiAqAkAgAwwADDCAQA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwEQHIKcAAADmQKFmsQOY5AIFMwFQFiAqAkAgAwwADDCAQA`；[runs/door-continuation-20261012/cold-entry-probe-12.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/cold-entry-probe-12.json)。
  <details><summary>参考 48 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDECIC10CaeUBXAdhpQlwEQHIKcAAADmQKFmsQOY5AIFMwFQFiAqAkAgAwwADDCAQA&replay=ABxtyghjOXg1XWDDgyV-sKI)；操作码 `ABxtyghjOXg1XWDDgyV-sKI`；路线来源：runs/door-continuation-20261012/cold-entry-probe-12.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/free-open-order-101203-proposal-12953**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPDw4ODwAAEYYCUQAKoCAUHPQcQVQAAAAIQVIKQIgS0AAAABAA)；未作玩家质量验收。 地图码 `AADIAPDw4ODwAAEYYCUQAKoCAUHPQcQVQAAAAIQVIKQIgS0AAAABAA`；[runs/door-continuation-20261012/free-open-order-101203-proposal-12953.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/free-open-order-101203-proposal-12953.json)。
  <details><summary>参考 14 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAPDw4ODwAAEYYCUQAKoCAUHPQcQVQAAAAIQVIKQIgS0AAAABAA&replay=ENr5IO-VcgPw)；操作码 `ENr5IO-VcgPw`；路线来源：runs/door-continuation-20261012/free-open-order-101203-proposal-12953.json.baseline.solution.actions。

  </details>
- **runs/door-continuation-20261012/free-open-order-101203-proposal-32329**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wXCj4scPBgZGHwWNAIalnEybG-5oLWAAgilNHY6cjxhAgAUA)；未作玩家质量验收。 地图码 `AWM4wXCj4scPBgZGHwWNAIalnEybG-5oLWAAgilNHY6cjxhAgAUA`；[runs/door-continuation-20261012/free-open-order-101203-proposal-32329.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/free-open-order-101203-proposal-32329.json)。
  <details><summary>参考 13 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wXCj4scPBgZGHwWNAIalnEybG-5oLWAAgilNHY6cjxhAgAUA&replay=GP1kIsnAnWiA)；操作码 `GP1kIsnAnWiA`；路线来源：runs/door-continuation-20261012/free-open-order-101203-proposal-32329.json.baseline.solution.actions。

  </details>
- **runs/door-continuation-20261012/free-open-order-101203-proposal-37038**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wfADCBgYGKUXaFowrGpg-8TQGsIABIKKTiKK5RoMDAwcDAwA)；未作玩家质量验收。 地图码 `AWM4wfADCBgYGKUXaFowrGpg-8TQGsIABIKKTiKK5RoMDAwcDAwA`；[runs/door-continuation-20261012/free-open-order-101203-proposal-37038.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/free-open-order-101203-proposal-37038.json)。
  <details><summary>参考 15 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wfADCBgYGKUXaFowrGpg-8TQGsIABIKKTiKK5RoMDAwcDAwA&replay=CNfLRTqagPnw)；操作码 `CNfLRTqagPnw`；路线来源：runs/door-continuation-20261012/free-open-order-101203-proposal-37038.json.baseline.solution.actions。

  </details>
- **runs/door-continuation-20261012/free-open-order-101203-proposal-45332**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPDg8PAAAAGkgIcACqByAQTwKoAAAAABCC7QKqCEAAAAAAIA)；未作玩家质量验收。 地图码 `AADIAPDg8PAAAAGkgIcACqByAQTwKoAAAAABCC7QKqCEAAAAAAIA`；[runs/door-continuation-20261012/free-open-order-101203-proposal-45332.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/free-open-order-101203-proposal-45332.json)。
  <details><summary>参考 18 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAPDg8PAAAAGkgIcACqByAQTwKoAAAAABCC7QKqCEAAAAAAIA&replay=ECggW3nNlAnXwA)；操作码 `ECggW3nNlAnXwA`；路线来源：runs/door-continuation-20261012/free-open-order-101203-proposal-45332.json.baseline.solution.actions。

  </details>
- **runs/door-continuation-20261012/free-open-order-101203-proposal-77227**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPDw0PDwAAFA4CxwAKoEAxAIEAqgAAAAVIKZglQWiCYzAAAAAgA)；未作玩家质量验收。 地图码 `AADAAPDw0PDwAAFA4CxwAKoEAxAIEAqgAAAAVIKZglQWiCYzAAAAAgA`；[runs/door-continuation-20261012/free-open-order-101203-proposal-77227.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/free-open-order-101203-proposal-77227.json)。
  <details><summary>参考 13 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPDw0PDwAAFA4CxwAKoEAxAIEAqgAAAAVIKZglQWiCYzAAAAAgA&replay=GJn6R_JJ1aCA)；操作码 `GJn6R_JJ1aCA`；路线来源：runs/door-continuation-20261012/free-open-order-101203-proposal-77227.json.baseline.solution.actions。

  </details>
- **runs/door-continuation-20261012/free-open-order-101203-proposal-80820**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wfADCBgYGCUUNAIYVjUwMjKGMgABi4f7Cr-M4BIGBgYOBgYA)；未作玩家质量验收。 地图码 `AWM4wfADCBgYGCUUNAIYVjUwMjKGMgABi4f7Cr-M4BIGBgYOBgYA`；[runs/door-continuation-20261012/free-open-order-101203-proposal-80820.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/free-open-order-101203-proposal-80820.json)。
  <details><summary>参考 15 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wfADCBgYGCUUNAIYVjUwMjKGMgABi4f7Cr-M4BIGBgYOBgYA&replay=CAUrPrv0l3wI)；操作码 `CAUrPrv0l3wI`；路线来源：runs/door-continuation-20261012/free-open-order-101203-proposal-80820.json.baseline.solution.actions。

  </details>
- **runs/door-continuation-20261012/free-open-order-101203-proposal-94160**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPj4qPgAAAGBoCkQAKqEAS0EgqoAAAAACs5QghVUIsQAAAAEAAA)；未作玩家质量验收。 地图码 `AADAAPj4qPgAAAGBoCkQAKqEAS0EgqoAAAAACs5QghVUIsQAAAAEAAA`；[runs/door-continuation-20261012/free-open-order-101203-proposal-94160.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/free-open-order-101203-proposal-94160.json)。
  <details><summary>参考 18 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPj4qPgAAAGBoCkQAKqEAS0EgqoAAAAACs5QghVUIsQAAAAEAAA&replay=EIPqMLSX6DP1YA)；操作码 `EIPqMLSX6DP1YA`；路线来源：runs/door-continuation-20261012/free-open-order-101203-proposal-94160.json.baseline.solution.actions。

  </details>
- **runs/door-continuation-20261012/free-open-order-101203-proposal-98467**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPDw8ODwAAESYCowAKoEAkBQToKoAAAAF4ghBcQUgTIAAAAEAA)；未作玩家质量验收。 地图码 `AADIAPDw8ODwAAESYCowAKoEAkBQToKoAAAAF4ghBcQUgTIAAAAEAA`；[runs/door-continuation-20261012/free-open-order-101203-proposal-98467.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/free-open-order-101203-proposal-98467.json)。
  <details><summary>参考 13 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAPDw8ODwAAESYCowAKoEAkBQToKoAAAAF4ghBcQUgTIAAAAEAA&replay=GI3RZaV2CHwA)；操作码 `GI3RZaV2CHwA`；路线来源：runs/door-continuation-20261012/free-open-order-101203-proposal-98467.json.baseline.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-anticipatory-01**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C10BaeArgOw0oSAiBcgpwAAAOZAoWaxA5jkAgRmAqAsQFQEgAGGAAQYQCA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMDEC4C10BaeArgOw0oSAiBcgpwAAAOZAoWaxA5jkAgRmAqAsQFQEgAGGAAQYQCA`；[runs/door-continuation-20261012/manual-anticipatory-01.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-anticipatory-01.json)。
  <details><summary>参考 53 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C10BaeArgOw0oSAiBcgpwAAAOZAoWaxA5jkAgRmAqAsQFQEgAGGAAQYQCA&replay=GOD_JIiPJm9VxgD6r6PMlfgogA)；操作码 `GOD_JIiPJm9VxgD6r6PMlfgogA`；路线来源：runs/door-continuation-20261012/manual-anticipatory-01.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-composite-01**：[试玩](https://ghostmaze.novic.cc/?map=AADBsfHw8HAwMAEDoDCMBgiBugCARwtw0oOWQcgS5wI4CAACgAWaxCcxyESCczAlAVASAADAgAAwwIMIEBA)；未作玩家质量验收。 地图码 `AADBsfHw8HAwMAEDoDCMBgiBugCARwtw0oOWQcgS5wI4CAACgAWaxCcxyESCczAlAVASAADAgAAwwIMIEBA`；[runs/door-continuation-20261012/manual-composite-01.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-composite-01.json)。
  <details><summary>参考 4 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsfHw8HAwMAEDoDCMBgiBugCARwtw0oOWQcgS5wI4CAACgAWaxCcxyESCczAlAVASAADAgAAwwIMIEBA&replay=ADWIo3Yg)；操作码 `ADWIo3Yg`；路线来源：runs/door-continuation-20261012/manual-composite-01.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-composite-02**：[试玩](https://ghostmaze.novic.cc/?map=AADBsfHw8HAwMAEDoDCMBgiBugCARwtw0oXLIOQJc4EcBAABQALNYhOY5CJBOZgSgKgJAABgQAAYYEGECAg)；未作玩家质量验收。 地图码 `AADBsfHw8HAwMAEDoDCMBgiBugCARwtw0oXLIOQJc4EcBAABQALNYhOY5CJBOZgSgKgJAABgQAAYYEGECAg`；[runs/door-continuation-20261012/manual-composite-02.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-composite-02.json)。
  <details><summary>参考 57 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsfHw8HAwMAEDoDCMBgiBugCARwtw0oXLIOQJc4EcBAABQALNYhOY5CJBOZgSgKgJAABgQAAYYEGECAg&replay=GNdX2xqD6W9XgKt4oj9whViIcIA)；操作码 `GNdX2xqD6W9XgKt4oj9whViIcIA`；路线来源：runs/door-continuation-20261012/manual-composite-02.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-composite-03**：[试玩](https://ghostmaze.novic.cc/?map=AADBsfHw8HAwMAEDoDCMBgiBugCARwtw0oXLIOQJc4EcBAABQALNYhOY5CKgnMwJQFQEgAAwIAAMMCDCBAQ)；未作玩家质量验收。 地图码 `AADBsfHw8HAwMAEDoDCMBgiBugCARwtw0oXLIOQJc4EcBAABQALNYhOY5CKgnMwJQFQEgAAwIAAMMCDCBAQ`；[runs/door-continuation-20261012/manual-composite-03.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-composite-03.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/manual-composite-04-two-buttons-trace**：[试玩](https://ghostmaze.novic.cc/?map=AADBsfHw8HAwMAEDoDCMBgiAugRw0oXLIOQJc4EcBAABQALNYhGOQioJzMCUBUBIAAMCAADDAggQEA)；未作玩家质量验收。 地图码 `AADBsfHw8HAwMAEDoDCMBgiAugRw0oXLIOQJc4EcBAABQALNYhGOQioJzMCUBUBIAAMCAADDAggQEA`；[runs/door-continuation-20261012/manual-composite-04-two-buttons-trace.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-composite-04-two-buttons-trace.json)。
  <details><summary>参考 69 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsfHw8HAwMAEDoDCMBgiAugRw0oXLIOQJc4EcBAABQALNYhGOQioJzMCUBUBIAAMCAADDAggQEA&replay=GEtFJAuD6W9XgPqt4g_JVXgApb_qgIA)；操作码 `GEtFJAuD6W9XgPqt4g_JVXgApb_qgIA`；路线来源：runs/door-continuation-20261012/manual-composite-04-two-buttons-trace.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-composite-05**：[试玩](https://ghostmaze.novic.cc/?map=AADBsfHw8HAwMAEDoDCMBgiAugRw0oXLIOAS5wI4CAACgAWaxCcxyEVBOZgSgKgJAABgQAAYYEGECAg)；未作玩家质量验收。 地图码 `AADBsfHw8HAwMAEDoDCMBgiAugRw0oXLIOAS5wI4CAACgAWaxCcxyEVBOZgSgKgJAABgQAAYYEGECAg`；[runs/door-continuation-20261012/manual-composite-05.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-composite-05.json)。
  <details><summary>参考 50 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsfHw8HAwMAEDoDCMBgiAugRw0oXLIOAS5wI4CAACgAWaxCcxyEVBOZgSgKgJAABgQAAYYEGECAg&replay=EGpqyhWD6W9XgKt4oynfwJog)；操作码 `EGpqyhWD6W9XgKt4oynfwJog`；路线来源：runs/door-continuation-20261012/manual-composite-05.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-composite-06**：[试玩](https://ghostmaze.novic.cc/?map=AADBsfHw8HAwMAEDoDCMBgiAugRw0oXLIOAS5wI4CAACgAWaxCcxyEVBOZgSgKgJAABgQAAQYEGECAg)；未作玩家质量验收。 地图码 `AADBsfHw8HAwMAEDoDCMBgiAugRw0oXLIOAS5wI4CAACgAWaxCcxyEVBOZgSgKgJAABgQAAQYEGECAg`；[runs/door-continuation-20261012/manual-composite-06.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-composite-06.json)。
  <details><summary>参考 69 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsfHw8HAwMAEDoDCMBgiAugRw0oXLIOAS5wI4CAACgAWaxCcxyEVBOZgSgKgJAABgQAAQYEGECAg&replay=GIY5SHiD6W9XgPqt4jPJVXgAmb_qgIA)；操作码 `GIY5SHiD6W9XgPqt4jPJVXgAmb_qgIA`；路线来源：runs/door-continuation-20261012/manual-composite-06.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-composite-07**：[试玩](https://ghostmaze.novic.cc/?map=AADBsfHw8HAwMAEDoDCMBgiAugRw0oXLIOAS5wI4CAACgAWaxCcxyEVBOZgSgKgJAABgQYAYYEGECAg)；未作玩家质量验收。 地图码 `AADBsfHw8HAwMAEDoDCMBgiAugRw0oXLIOAS5wI4CAACgAWaxCcxyEVBOZgSgKgJAABgQYAYYEGECAg`；[runs/door-continuation-20261012/manual-composite-07.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-composite-07.json)。
  <details><summary>参考 48 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsfHw8HAwMAEDoDCMBgiAugRw0oXLIOAS5wI4CAACgAWaxCcxyEVBOZgSgKgJAABgQYAYYEGECAg&replay=AC7WIHmD6W9XgKt4oyX8CaI)；操作码 `AC7WIHmD6W9XgKt4oyX8CaI`；路线来源：runs/door-continuation-20261012/manual-composite-07.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-composite-08**：[试玩](https://ghostmaze.novic.cc/?map=AADBsfHw8HAwMAEDoDCMBgiAugRw0oXLIOAS5wI4CAACgAWaxCcxyEVBOZgSgKgJAABgQYAQYEGECAg)；未作玩家质量验收。 地图码 `AADBsfHw8HAwMAEDoDCMBgiAugRw0oXLIOAS5wI4CAACgAWaxCcxyEVBOZgSgKgJAABgQYAQYEGECAg`；[runs/door-continuation-20261012/manual-composite-08.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-composite-08.json)。
  <details><summary>参考 68 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsfHw8HAwMAEDoDCMBgiAugRw0oXLIOAS5wI4CAACgAWaxCcxyEVBOZgSgKgJAABgQYAQYEGECAg&replay=AMKFohSD6W9XgPqt4jPJVXgAmb_qAg)；操作码 `AMKFohSD6W9XgPqt4jPJVXgAmb_qAg`；路线来源：runs/door-continuation-20261012/manual-composite-08.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-composite-09**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDw8HAwMAEDIC58BceAsgPw0oXLIOAFzgRwEAAFAAs1iBzHICoJzMCUBUBIAAMCDADDAgwgQEA)；未作玩家质量验收。 地图码 `AADBsPDw8HAwMAEDIC58BceAsgPw0oXLIOAFzgRwEAAFAAs1iBzHICoJzMCUBUBIAAMCDADDAgwgQEA`；[runs/door-continuation-20261012/manual-composite-09.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-composite-09.json)。
  <details><summary>参考 48 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDw8HAwMAEDIC58BceAsgPw0oXLIOAFzgRwEAAFAAs1iBzHICoJzMCUBUBIAAMCDADDAgwgQEA&replay=AO6ShTOD6W9XgKt4oyX8CaI)；操作码 `AO6ShTOD6W9XgKt4oyX8CaI`；路线来源：runs/door-continuation-20261012/manual-composite-09.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-composite-11**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDw8HAwMAEDIC58BceAsgPw0oXLIOQC5wI4CAACgAWaxAY5AVBOZgSgKgJAABgQAAQYEECAgA)；未作玩家质量验收。 地图码 `AADBsPDw8HAwMAEDIC58BceAsgPw0oXLIOQC5wI4CAACgAWaxAY5AVBOZgSgKgJAABgQAAQYEECAgA`；[runs/door-continuation-20261012/manual-composite-11.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-composite-11.json)。
  <details><summary>参考 69 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDw8HAwMAEDIC58BceAsgPw0oXLIOQC5wI4CAACgAWaxAY5AVBOZgSgKgJAABgQAAQYEECAgA&replay=GBtq4WiD6W9XgPqt4g_JVXgApb_qgIA)；操作码 `GBtq4WiD6W9XgPqt4g_JVXgApb_qgIA`；路线来源：runs/door-continuation-20261012/manual-composite-11.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-timed-bridge-01**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDw8DAwMAEDIC58BceBMgPwiAUoS4CAM84FAAAyBQALNYgcxyAUEYgKgKgJAABAAAQABBhg)；未作玩家质量验收。 地图码 `AADBsPDw8DAwMAEDIC58BceBMgPwiAUoS4CAM84FAAAyBQALNYgcxyAUEYgKgKgJAABAAAQABBhg`；[runs/door-continuation-20261012/manual-timed-bridge-01.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-timed-bridge-01.json)。
  <details><summary>参考 21 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDw8DAwMAEDIC58BceBMgPwiAUoS4CAM84FAAAyBQALNYgcxyAUEYgKgKgJAABAAAQABBhg&replay=GAo27IGPYPlsKIA)；操作码 `GAo27IGPYPlsKIA`；路线来源：runs/door-continuation-20261012/manual-timed-bridge-01.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-timed-bridge-02**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDw8DAwMAEDIC58BceBMgPwiAUoS4CAM84FAAAyBQALNYgcxyAUEYgKgKgJAABAAAQABBhA)；未作玩家质量验收。 地图码 `AADBsPDw8DAwMAEDIC58BceBMgPwiAUoS4CAM84FAAAyBQALNYgcxyAUEYgKgKgJAABAAAQABBhA`；[runs/door-continuation-20261012/manual-timed-bridge-02.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-timed-bridge-02.json)。
  <details><summary>参考 39 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDw8DAwMAEDIC58BceBMgPwiAUoS4CAM84FAAAyBQALNYgcxyAUEYgKgKgJAABAAAQABBhA&replay=CDFYzEmPYNVcYDwtesKI)；操作码 `CDFYzEmPYNVcYDwtesKI`；路线来源：runs/door-continuation-20261012/manual-timed-bridge-02.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-timed-bridge-03**：[试玩](https://ghostmaze.novic.cc/?map=AADJsPDw8DAwMAEDIC58BceBMgPwiAUoS_AgDvwKAABwFAAurQP2_QCgjQFQFQEgAAgAAAAgwg)；未作玩家质量验收。 地图码 `AADJsPDw8DAwMAEDIC58BceBMgPwiAUoS_AgDvwKAABwFAAurQP2_QCgjQFQFQEgAAgAAAAgwg`；[runs/door-continuation-20261012/manual-timed-bridge-03.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-timed-bridge-03.json)。
  <details><summary>参考 41 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADJsPDw8DAwMAEDIC58BceBMgPwiAUoS_AgDvwKAABwFAAurQP2_QCgjQFQFQEgAAgAAAAgwg&replay=GKdzbq-PYNVcYDwjV6wogA)；操作码 `GKdzbq-PYNVcYDwjV6wogA`；路线来源：runs/door-continuation-20261012/manual-timed-bridge-03.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-timed-bridge-04**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDw8DAwMAEDIC58BceBMgPwiAUoS4CAHAUAADIFAAs1iBzHIBQRiAqAqAkAAEAAAQYQ)；未作玩家质量验收。 地图码 `AADBsPDw8DAwMAEDIC58BceBMgPwiAUoS4CAHAUAADIFAAs1iBzHIBQRiAqAqAkAAEAAAQYQ`；[runs/door-continuation-20261012/manual-timed-bridge-04.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-timed-bridge-04.json)。
  <details><summary>参考 37 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDw8DAwMAEDIC58BceBMgPwiAUoS4CAHAUAADIFAAs1iBzHIBQRiAqAqAkAAEAAAQYQ&replay=GM1Mw8eM1VxgPCNXrCiA)；操作码 `GM1Mw8eM1VxgPCNXrCiA`；路线来源：runs/door-continuation-20261012/manual-timed-bridge-04.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-timed-bridge-05**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDw8DAwMAEDIC58BceAsgPw0oS4CAHAUAADIFAAs1iBzHIBQRiAqAqAkAAEAAAQQQA)；未作玩家质量验收。 地图码 `AADBsPDw8DAwMAEDIC58BceAsgPw0oS4CAHAUAADIFAAs1iBzHIBQRiAqAqAkAAEAAAQQQA`；[runs/door-continuation-20261012/manual-timed-bridge-05.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-timed-bridge-05.json)。
  <details><summary>参考 34 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDw8DAwMAEDIC58BceAsgPw0oS4CAHAUAADIFAAs1iBzHIBQRiAqAqAkAAEAAAQQQA&replay=EL1GcC2M1VxgPC1rCiA)；操作码 `EL1GcC2M1VxgPC1rCiA`；路线来源：runs/door-continuation-20261012/manual-timed-bridge-05.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-timed-bridge-06**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDw8DAwMAEDIC58BceAsgPw0oS4COAcBQAAMgUACzWIHMcgFBGICoCoCQAAQQAABBhA)；未作玩家质量验收。 地图码 `AADBsPDw8DAwMAEDIC58BceAsgPw0oS4COAcBQAAMgUACzWIHMcgFBGICoCoCQAAQQAABBhA`；[runs/door-continuation-20261012/manual-timed-bridge-06.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-timed-bridge-06.json)。
  <details><summary>参考 37 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDw8DAwMAEDIC58BceAsgPw0oS4COAcBQAAMgUACzWIHMcgFBGICoCoCQAAQQAABBhA&replay=GAnLCJiM1VxgPCNXrCiA)；操作码 `GAnLCJiM1VxgPCNXrCiA`；路线来源：runs/door-continuation-20261012/manual-timed-bridge-06.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-timing-window-01**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDw8DAwMDEDIC5cBmeAsgPw0oS4COAcBTgAAAcyBQs1iBzHIBQRmAqAsQFQEgEEAGGAAQYQCA)；未作玩家质量验收。 地图码 `AADBsPDw8DAwMDEDIC5cBmeAsgPw0oS4COAcBTgAAAcyBQs1iBzHIBQRmAqAsQFQEgEEAGGAAQYQCA`；[runs/door-continuation-20261012/manual-timing-window-01.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-timing-window-01.json)。
  <details><summary>参考 37 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDw8DAwMDEDIC5cBmeAsgPw0oS4COAcBTgAAAcyBQs1iBzHIBQRmAqAsQFQEgEEAGGAAQYQCA&replay=GBr9Wq2M1XWAPrA1eCiA)；操作码 `GBr9Wq2M1XWAPrA1eCiA`；路线来源：runs/door-continuation-20261012/manual-timing-window-01.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-transfer-01**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wPDgw4MEBgbG9AYfpgR-BsYAFu4JDiIMDAwMLEc40zhPcDKA2QIA)；未作玩家质量验收。 地图码 `AWM4wPDgw4MEBgbG9AYfpgR-BsYAFu4JDiIMDAwMLEc40zhPcDKA2QIA`；[runs/door-continuation-20261012/manual-transfer-01.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-transfer-01.json)。
  <details><summary>参考 20 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wPDgw4MEBgbG9AYfpgR-BsYAFu4JDiIMDAwMLEc40zhPcDKA2QIA&replay=ADk3xWqg2dyg9w)；操作码 `ADk3xWqg2dyg9w`；路线来源：runs/door-continuation-20261012/manual-transfer-01.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-transfer-02**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wPDgw4MEBgbG9AYfpgR-BsYAFu4JkYwODEDg4zAtYU7DBAYQcHAEAA)；未作玩家质量验收。 地图码 `AWM4wPDgw4MEBgbG9AYfpgR-BsYAFu4JkYwODEDg4zAtYU7DBAYQcHAEAA`；[runs/door-continuation-20261012/manual-transfer-02.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-transfer-02.json)。
  <details><summary>参考 20 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wPDgw4MEBgbG9AYfpgR-BsYAFu4JkYwODEDg4zAtYU7DBAYQcHAEAA&replay=AI5uthyg2fYg9w)；操作码 `AI5uthyg2fYg9w`；路线来源：runs/door-continuation-20261012/manual-transfer-02.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-transfer-03**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wJDw4UECAwNjWIMLkwIvA8MCF-4JkYwODECg4zAtYU7DBAYQcHAEAA)；未作玩家质量验收。 地图码 `AWM4wJDw4UECAwNjWIMLkwIvA8MCF-4JkYwODECg4zAtYU7DBAYQcHAEAA`；[runs/door-continuation-20261012/manual-transfer-03.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-transfer-03.json)。
  <details><summary>参考 28 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wJDw4UECAwNjWIMLkwIvA8MCF-4JkYwODECg4zAtYU7DBAYQcHAEAA&replay=AHKLsBqM5m-reKM3)；操作码 `AHKLsBqM5m-reKM3`；路线来源：runs/door-continuation-20261012/manual-transfer-03.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-two-shelters-01**：[试玩](https://ghostmaze.novic.cc/?map=AADAAHDw4GBgAAEngEwCYA8AAKgjgLkFgAAUAAAAAsUEswTMBICQAAAAgAIA)；未作玩家质量验收。 地图码 `AADAAHDw4GBgAAEngEwCYA8AAKgjgLkFgAAUAAAAAsUEswTMBICQAAAAgAIA`；[runs/door-continuation-20261012/manual-two-shelters-01.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-two-shelters-01.json)。
  <details><summary>参考 17 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAHDw4GBgAAEngEwCYA8AAKgjgLkFgAAUAAAAAsUEswTMBICQAAAAgAIA&replay=GJIIe-vXg6M3AA)；操作码 `GJIIe-vXg6M3AA`；路线来源：runs/door-continuation-20261012/manual-two-shelters-01.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-two-shelters-02**：[试玩](https://ghostmaze.novic.cc/?map=AADIAHDw4GBgAAEngEwCYA8AAKgj8C_QWAAFAAAAALUEugnQEgLoAAAAQAEAAQ)；未作玩家质量验收。 地图码 `AADIAHDw4GBgAAEngEwCYA8AAKgj8C_QWAAFAAAAALUEugnQEgLoAAAAQAEAAQ`；[runs/door-continuation-20261012/manual-two-shelters-02.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-two-shelters-02.json)。
  <details><summary>参考 23 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAHDw4GBgAAEngEwCYA8AAKgj8C_QWAAFAAAAALUEugnQEgLoAAAAQAEAAQ&replay=CKhE6fKM5n2KM3A)；操作码 `CKhE6fKM5n2KM3A`；路线来源：runs/door-continuation-20261012/manual-two-shelters-02.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/manual-two-shelters-03**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wVDw4UECAwOjeoMPUwI_A8MK5Q_6FyJYGUBgK8suzgtCIBYHgwIDAA)；未作玩家质量验收。 地图码 `AWM4wVDw4UECAwOjeoMPUwI_A8MK5Q_6FyJYGUBgK8suzgtCIBYHgwIDAA`；[runs/door-continuation-20261012/manual-two-shelters-03.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/manual-two-shelters-03.json)。
  <details><summary>参考 23 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wVDw4UECAwOjeoMPUwI_A8MK5Q_6FyJYGUBgK8suzgtCIBYHgwIDAA&replay=CA_qjQ2M5n2KM3A)；操作码 `CA_qjQ2M5n2KM3A`；路线来源：runs/door-continuation-20261012/manual-two-shelters-03.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/one-control-101205-23702**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wPDjx44fDAyMEQkqUxgFWBQYQp3ZGcOZHEMZgIBFYE6aqMCSBgYwaAAA)；未作玩家质量验收。 地图码 `AWM4wPDjx44fDAyMEQkqUxgFWBQYQp3ZGcOZHEMZgIBFYE6aqMCSBgYwaAAA`；[runs/door-continuation-20261012/one-control-101205-23702.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/one-control-101205-23702.json)。
  <details><summary>参考 28 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wPDjx44fDAyMEQkqUxgFWBQYQp3ZGcOZHEMZgIBFYE6aqMCSBgYwaAAA&replay=AE1MqH3mPdUqf-Na)；操作码 `AE1MqH3mPdUqf-Na`；路线来源：runs/door-continuation-20261012/one-control-101205-23702.json.baseline.solution.actions。

  </details>
- **runs/door-continuation-20261012/one-control-101205-4058**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wHDjxo8fDAyMPAmqMgwXOB4wBLUrcPD4ca1gAAJVxVCnFrWYBgYQUGAAAA)；未作玩家质量验收。 地图码 `AWM4wHDjxo8fDAyMPAmqMgwXOB4wBLUrcPD4ca1gAAJVxVCnFrWYBgYQUGAAAA`；[runs/door-continuation-20261012/one-control-101205-4058.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/one-control-101205-4058.json)。
  <details><summary>参考 19 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wHDjxo8fDAyMPAmqMgwXOB4wBLUrcPD4ca1gAAJVxVCnFrWYBgYQUGAAAA&replay=CDSVpnr-A1aoDA)；操作码 `CDSVpnr-A1aoDA`；路线来源：runs/door-continuation-20261012/one-control-101205-4058.json.baseline.solution.actions。

  </details>
- **runs/door-continuation-20261012/one-time-probe-both-ordinary-zero-key**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrMDmeQCBGYCoCQEgAAAwIADAAgE)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrMDmeQCBGYCoCQEgAAAwIADAAgE`；[runs/door-continuation-20261012/one-time-probe-both-ordinary-zero-key.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/one-time-probe-both-ordinary-zero-key.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/one-time-probe-lower-loop-initially-shielded**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQCBGYCoCzASAAADAgwgEAA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQCBGYCoCzASAAADAgwgEAA`；[runs/door-continuation-20261012/one-time-probe-lower-loop-initially-shielded.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/one-time-probe-lower-loop-initially-shielded.json)。
  <details><summary>参考 68 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQCBGYCoCzASAAADAgwgEAA&replay=AAict2yPJm9XgPqvo8yVV4AJm_6jIg)；操作码 `AAict2yPJm9XgPqvo8yVV4AJm_6jIg`；路线来源：runs/door-continuation-20261012/one-time-probe-lower-loop-initially-shielded.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/one-time-probe-lower-ordinary-zero-key**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmeQCBGYCoCQEgAAAwIMACAQ)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmeQCBGYCoCQEgAAAwIMACAQ`；[runs/door-continuation-20261012/one-time-probe-lower-ordinary-zero-key.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/one-time-probe-lower-ordinary-zero-key.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/one-time-probe-middle-left-initially-shielded**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQMoEZgKgJASAAADAgwgABA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQMoEZgKgJASAAADAgwgABA`；[runs/door-continuation-20261012/one-time-probe-middle-left-initially-shielded.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/one-time-probe-middle-left-initially-shielded.json)。
  <details><summary>参考 68 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQMoEZgKgJASAAADAgwgABA&replay=APlR2YiPJm9djDqvo8yVV4AJm_6jIg)；操作码 `APlR2YiPJm9djDqvo8yVV4AJm_6jIg`；路线来源：runs/door-continuation-20261012/one-time-probe-middle-left-initially-shielded.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/one-time-probe-middle-right-initially-shielded**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQGYEZgKgJASAAADAgwgABA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQGYEZgKgJASAAADAgwgABA`；[runs/door-continuation-20261012/one-time-probe-middle-right-initially-shielded.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/one-time-probe-middle-right-initially-shielded.json)。
  <details><summary>参考 68 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQGYEZgKgJASAAADAgwgABA&replay=AIme6GKPJm9djDqvo8yVV4AJm_6jIg)；操作码 `AIme6GKPJm9djDqvo8yVV4AJm_6jIg`；路线来源：runs/door-continuation-20261012/one-time-probe-middle-right-initially-shielded.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/one-time-probe-upper-ordinary-zero-key**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrMDmOQCBGYCoCQEgAAAwIADCAQ)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrMDmOQCBGYCoCQEgAAAwIADCAQ`；[runs/door-continuation-20261012/one-time-probe-upper-ordinary-zero-key.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/one-time-probe-upper-ordinary-zero-key.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/one-time-probe-upper-room-zero-key**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSyCIFyCnAAAAoAFmsQOY5AIEZgKgJASAAAAAwIMIBA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSyCIFyCnAAAAoAFmsQOY5AIEZgKgJASAAAAAwIMIBA`；[runs/door-continuation-20261012/one-time-probe-upper-room-zero-key.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/one-time-probe-upper-room-zero-key.json)。
  <details><summary>参考 68 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSyCIFyCnAAAAoAFmsQOY5AIEZgKgJASAAAAAwIMIBA&replay=AOy6lmSPJm9djDqvo8yVV4AJm_6jIg)；操作码 `AOy6lmSPJm9djDqvo8yVV4AJm_6jIg`；路线来源：runs/door-continuation-20261012/one-time-probe-upper-room-zero-key.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/open-order-101202-proposal-14615**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wfCj4scPBgbG7AWaPYwKrCGKXE-YRAMYGBgY4o4ItB4SBDMTBAA)；未作玩家质量验收。 地图码 `AWM4wfCj4scPBgbG7AWaPYwKrCGKXE-YRAMYGBgY4o4ItB4SBDMTBAA`；[runs/door-continuation-20261012/open-order-101202-proposal-14615.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/open-order-101202-proposal-14615.json)、[runs/door-continuation-20261012/trace-14615.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/trace-14615.json)。
  <details><summary>参考 19 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wfCj4scPBgbG7AWaPYwKrCGKXE-YRAMYGBgY4o4ItB4SBDMTBAA&replay=CBLCBcHNo8jefA)；操作码 `CBLCBcHNo8jefA`；路线来源：runs/door-continuation-20261012/open-order-101202-proposal-14615.json.baseline.solution.actions。

  </details>
- **runs/door-continuation-20261012/open-order-101202-proposal-152502**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPh4-PgAAAEJoCccAKAFVCp4QgEKqAAAAAAhQRQruQjUAAAABAQE)；未作玩家质量验收。 地图码 `AADIAPh4-PgAAAEJoCccAKAFVCp4QgEKqAAAAAAhQRQruQjUAAAABAQE`；[runs/door-continuation-20261012/open-order-101202-proposal-152502.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/open-order-101202-proposal-152502.json)。
  <details><summary>参考 14 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAPh4-PgAAAEJoCccAKAFVCp4QgEKqAAAAAAhQRQruQjUAAAABAQE&replay=EP9Z-SSfaDyg)；操作码 `EP9Z-SSfaDyg`；路线来源：runs/door-continuation-20261012/open-order-101202-proposal-152502.json.baseline.solution.actions。

  </details>
- **runs/door-continuation-20261012/open-order-101202-proposal-164214**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wfDjx4cfDAyMTg90ehgbWEPM_Zm3MIkGMDAwMHi0eDhxgFkOAgA)；未作玩家质量验收。 地图码 `AWM4wfDjx4cfDAyMTg90ehgbWEPM_Zm3MIkGMDAwMHi0eDhxgFkOAgA`；[runs/door-continuation-20261012/open-order-101202-proposal-164214.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/open-order-101202-proposal-164214.json)、[runs/door-continuation-20261012/trace-164214.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/trace-164214.json)。
  <details><summary>参考 17 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wfDjx4cfDAyMTg90ehgbWEPM_Zm3MIkGMDAwMHi0eDhxgFkOAgA&replay=GNluIjMnyJ1PAA)；操作码 `GNluIjMnyJ1PAA`；路线来源：runs/door-continuation-20261012/open-order-101202-proposal-164214.json.baseline.solution.actions。

  </details>
- **runs/door-continuation-20261012/open-order-101202-proposal-18180**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPDQ8PDwAAEyICwsAgAFUBAlgEDvQVQAAAAIQSoIoIoLiAAAACgI)；未作玩家质量验收。 地图码 `AADIAPDQ8PDwAAEyICwsAgAFUBAlgEDvQVQAAAAIQSoIoIoLiAAAACgI`；[runs/door-continuation-20261012/open-order-101202-proposal-18180.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/open-order-101202-proposal-18180.json)、[runs/door-continuation-20261012/trace-18180.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/trace-18180.json)。
  <details><summary>参考 21 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAPDQ8PDwAAEyICwsAgAFUBAlgEDvQVQAAAAIQSoIoIoLiAAAACgI&replay=GC52va3WhzaDD0A)；操作码 `GC52va3WhzaDD0A`；路线来源：runs/door-continuation-20261012/open-order-101202-proposal-18180.json.baseline.solution.actions。

  </details>
- **runs/door-continuation-20261012/open-order-101202-proposal-183038**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOj42Pi4AAGpYC9MACAFSAgYgZzUEtCVAAAABFQooSkIIVEAAAAICg)；未作玩家质量验收。 地图码 `AADAAOj42Pi4AAGpYC9MACAFSAgYgZzUEtCVAAAABFQooSkIIVEAAAAICg`；[runs/door-continuation-20261012/open-order-101202-proposal-183038.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/open-order-101202-proposal-183038.json)。
  <details><summary>参考 14 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOj42Pi4AAGpYC9MACAFSAgYgZzUEtCVAAAABFQooSkIIVEAAAAICg&replay=EBQa3hAtZN_Q)；操作码 `EBQa3hAtZN_Q`；路线来源：runs/door-continuation-20261012/open-order-101202-proposal-183038.json.baseline.solution.actions。

  </details>
- **runs/door-continuation-20261012/open-order-101202-proposal-38556**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAGDoC-MAeAFUAyBgGpkJAqgAAAASQSoIoIQQgAAAAoC)；未作玩家质量验收。 地图码 `AADAAPDw8PDwAAGDoC-MAeAFUAyBgGpkJAqgAAAASQSoIoIQQgAAAAoC`；[runs/door-continuation-20261012/open-order-101202-proposal-38556.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/open-order-101202-proposal-38556.json)、[runs/door-continuation-20261012/trace-38556.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/trace-38556.json)。
  <details><summary>参考 23 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPDw8PDwAAGDoC-MAeAFUAyBgGpkJAqgAAAASQSoIoIQQgAAAAoC&replay=CJe1otkifcCV0pg)；操作码 `CJe1otkifcCV0pg`；路线来源：runs/door-continuation-20261012/open-order-101202-proposal-38556.json.baseline.solution.actions。

  </details>
- **runs/door-continuation-20261012/open-order-101202-proposal-44737**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPDw8HDwAAEioChMAEAFUDzgAKcEAqgAAAAUQRoIQLUFEAAAABAQ)；未作玩家质量验收。 地图码 `AADIAPDw8HDwAAEioChMAEAFUDzgAKcEAqgAAAAUQRoIQLUFEAAAABAQ`；[runs/door-continuation-20261012/open-order-101202-proposal-44737.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/open-order-101202-proposal-44737.json)。
  <details><summary>参考 13 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAPDw8HDwAAEioChMAEAFUDzgAKcEAqgAAAAUQRoIQLUFEAAAABAQ&replay=GDPNi3sNVgKA)；操作码 `GDPNi3sNVgKA`；路线来源：runs/door-continuation-20261012/open-order-101202-proposal-44737.json.baseline.solution.actions。

  </details>
- **runs/door-continuation-20261012/open-order-101202-proposal-58313**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wPADCBgYGKsSVEIYGlhDJBoYdLpWMACBklOvE0fIGQYgkGEBAA)；未作玩家质量验收。 地图码 `AWM4wPADCBgYGKsSVEIYGlhDJBoYdLpWMACBklOvE0fIGQYgkGEBAA`；[runs/door-continuation-20261012/open-order-101202-proposal-58313.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/open-order-101202-proposal-58313.json)。
  <details><summary>参考 14 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wPADCBgYGKsSVEIYGlhDJBoYdLpWMACBklOvE0fIGQYgkGEBAA&replay=EL-_CvtjFaKQ)；操作码 `EL-_CvtjFaKQ`；路线来源：runs/door-continuation-20261012/open-order-101202-proposal-58313.json.baseline.solution.actions。

  </details>
- **runs/door-continuation-20261012/probe-composite-two-buttons**：[试玩](https://ghostmaze.novic.cc/?map=AADBsfHw8HAwMAEDoDCMBgiAugRw0oXLIOQJcBHAQAAUACzWIRjkIqCczAlAVASAADAgAAwIIEBA)；未作玩家质量验收。 地图码 `AADBsfHw8HAwMAEDoDCMBgiAugRw0oXLIOQJcBHAQAAUACzWIRjkIqCczAlAVASAADAgAAwIIEBA`；[runs/door-continuation-20261012/probe-composite-two-buttons.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/probe-composite-two-buttons.json)。
  <details><summary>参考 70 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsfHw8HAwMAEDoDCMBgiAugRw0oXLIOQJcBHAQAAUACzWIRjkIqCczAlAVASAADAgAAwIIEBA&replay=EN189AaD6W9XgPqt4g_JVXgApb_qIyA)；操作码 `EN189AaD6W9XgPqt4g_JVXgApb_qIyA`；路线来源：runs/door-continuation-20261012/probe-composite-two-buttons.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/role-exchange-contrasts/entity-00**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeAOw0oSAiBcgpwAAAKABZrEDmOQCBGYCoCQEgAAAwIMIBA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeAOw0oSAiBcgpwAAAKABZrEDmOQCBGYCoCQEgAAAwIMIBA`；[runs/door-continuation-20261012/role-exchange-contrasts/entity-00.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/entity-00.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/role-exchange-contrasts/entity-01**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeALgUoSAiBcgpwAAAKABZrEDmOQCBGYCoCQEgAAAwIMIBA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeALgUoSAiBcgpwAAAKABZrEDmOQCBGYCoCQEgAAAwIMIBA`；[runs/door-continuation-20261012/role-exchange-contrasts/entity-01.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/entity-01.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/role-exchange-contrasts/entity-02**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10APAVwHYaUJARAuQU4AAAFAAs1iBzHIBAjMBUBICQAAAYEGEAgA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10APAVwHYaUJARAuQU4AAAFAAs1iBzHIBAjMBUBICQAAAYEGEAgA`；[runs/door-continuation-20261012/role-exchange-contrasts/entity-02.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/entity-02.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/role-exchange-contrasts/entity-03**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10AbAVwHYaUJARAuQU4AAAFAAs1iBzHIBAjMBUBICQAAAYEGEAgA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10AbAVwHYaUJARAuQU4AAAFAAs1iBzHIBAjMBUBICQAAAYEGEAgA`；[runs/door-continuation-20261012/role-exchange-contrasts/entity-03.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/entity-03.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/role-exchange-contrasts/entity-04**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4A6AtPAVwHYaUJARAuQU4AAAFAAs1iBzHIBAjMBUBICQAAAYEGEAgA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4A6AtPAVwHYaUJARAuQU4AAAFAAs1iBzHIBAjMBUBICQAAAYEGEAgA`；[runs/door-continuation-20261012/role-exchange-contrasts/entity-04.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/entity-04.json)。
  <details><summary>参考 15 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4A6AtPAVwHYaUJARAuQU4AAAFAAs1iBzHIBAjMBUBICQAAAYEGEAgA&replay=CPMPUsi8DSaI)；操作码 `CPMPUsi8DSaI`；路线来源：runs/door-continuation-20261012/role-exchange-contrasts/entity-04.json.reference.solution.actions。

  </details>
- **runs/door-continuation-20261012/role-exchange-contrasts/entity-05**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4A2AtPAVwHYaUJARAuQU4AAAFAAs1iBzHIBAjMBUBICQAAAYEGEAgA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4A2AtPAVwHYaUJARAuQU4AAAFAAs1iBzHIBAjMBUBICQAAAYEGEAgA`；[runs/door-continuation-20261012/role-exchange-contrasts/entity-05.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/entity-05.json)。
  <details><summary>参考 37 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4A2AtPAVwHYaUJARAuQU4AAAFAAs1iBzHIBAjMBUBICQAAAYEGEAgA&replay=GCCUTjOPVw5XgAyV-CiA)；操作码 `GCCUTjOPVw5XgAyV-CiA`；路线来源：runs/door-continuation-20261012/role-exchange-contrasts/entity-05.json.reference.solution.actions。

  </details>
- **runs/door-continuation-20261012/role-exchange-contrasts/wall-00**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBIKcAAACgAWaxA5jkAgRmAqAkBIAAMCDCAQ)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBIKcAAACgAWaxA5jkAgRmAqAkBIAAMCDCAQ`；[runs/door-continuation-20261012/role-exchange-contrasts/wall-00.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/wall-00.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/role-exchange-contrasts/wall-01**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBUFOAAABQALNYgcxyAQIzAVASAkAAGBBhAI)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBUFOAAABQALNYgcxyAQIzAVASAkAAGBBhAI`；[runs/door-continuation-20261012/role-exchange-contrasts/wall-01.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/wall-01.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/role-exchange-contrasts/wall-02**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgoAAACgAWaxA5jkAgRmAqAkBIAAACDCAQ)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgoAAACgAWaxA5jkAgRmAqAkBIAAACDCAQ`；[runs/door-continuation-20261012/role-exchange-contrasts/wall-02.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/wall-02.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/role-exchange-contrasts/wall-03**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpAAABQALNYgcxyAQIzAVASAkAAABBhAI)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpAAABQALNYgcxyAQIzAVASAkAAABBhAI`；[runs/door-continuation-20261012/role-exchange-contrasts/wall-03.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/wall-03.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/role-exchange-contrasts/wall-04**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABKxA5jkAgRmAqAkBIAAAMMIBA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABKxA5jkAgRmAqAkBIAAAMMIBA`；[runs/door-continuation-20261012/role-exchange-contrasts/wall-04.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/wall-04.json)。
  <details><summary>参考 6 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABKxA5jkAgRmAqAkBIAAAMMIBA&replay=ECVZyoAyIA)；操作码 `ECVZyoAyIA`；路线来源：runs/door-continuation-20261012/role-exchange-contrasts/wall-04.json.reference.solution.actions。

  </details>
- **runs/door-continuation-20261012/role-exchange-contrasts/wall-05**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABVYgcxyAQIzAVASAkAAAGGEAg)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABVYgcxyAQIzAVASAkAAAGGEAg`；[runs/door-continuation-20261012/role-exchange-contrasts/wall-05.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/wall-05.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/role-exchange-contrasts/wall-06**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABYrEDmOQCBGYCoCQEgAAAwwgE)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABYrEDmOQCBGYCoCQEgAAAwwgE`；[runs/door-continuation-20261012/role-exchange-contrasts/wall-06.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/wall-06.json)。
  <details><summary>参考 6 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABYrEDmOQCBGYCoCQEgAAAwwgE&replay=EIfEiLwyIA)；操作码 `EIfEiLwyIA`；路线来源：runs/door-continuation-20261012/role-exchange-contrasts/wall-06.json.reference.solution.actions。

  </details>
- **runs/door-continuation-20261012/role-exchange-contrasts/wall-07**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZpA5jkAgRmAqAkBIAAAMCDCAQA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZpA5jkAgRmAqAkBIAAAMCDCAQA`；[runs/door-continuation-20261012/role-exchange-contrasts/wall-07.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/wall-07.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/role-exchange-contrasts/wall-08**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZqgcxyAQIzAVASAkAAAGBBhAIA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZqgcxyAQIzAVASAkAAAGBBhAIA`；[runs/door-continuation-20261012/role-exchange-contrasts/wall-08.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/wall-08.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/role-exchange-contrasts/wall-09**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEBjkAgRmAqAkBIAAAMCCAQ)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEBjkAgRmAqAkBIAAAMCCAQ`；[runs/door-continuation-20261012/role-exchange-contrasts/wall-09.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/wall-09.json)。
  <details><summary>参考 42 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEBjkAgRmAqAkBIAAAMCCAQ&replay=EBLpxMOPJm9djDqvo8yaIA)；操作码 `EBLpxMOPJm9djDqvo8yaIA`；路线来源：runs/door-continuation-20261012/role-exchange-contrasts/wall-09.json.reference.solution.actions。

  </details>
- **runs/door-continuation-20261012/role-exchange-contrasts/wall-10**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrECxyAQIzAVASAkAAAGBBAI)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrECxyAQIzAVASAkAAAGBBAI`；[runs/door-continuation-20261012/role-exchange-contrasts/wall-10.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/wall-10.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/role-exchange-contrasts/wall-11**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDjkAgRmAqAkBIAAAMCDCAQA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDjkAgRmAqAkBIAAAMCDCAQA`；[runs/door-continuation-20261012/role-exchange-contrasts/wall-11.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/wall-11.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/role-exchange-contrasts/wall-12**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDlyAQIzAVASAkAAAGBBhAIA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDlyAQIzAVASAkAAAGBBhAIA`；[runs/door-continuation-20261012/role-exchange-contrasts/wall-12.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/wall-12.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/role-exchange-contrasts/wall-13**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmEAgRmAqAkBIAAAMCDAQ)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmEAgRmAqAkBIAAAMCDAQ`；[runs/door-continuation-20261012/role-exchange-contrasts/wall-13.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/wall-13.json)。
  <details><summary>参考 17 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmEAgRmAqAkBIAAAMCDAQ&replay=GLkTuEyPMlQogA)；操作码 `GLkTuEyPMlQogA`；路线来源：runs/door-continuation-20261012/role-exchange-contrasts/wall-13.json.reference.solution.actions。

  </details>
- **runs/door-continuation-20261012/role-exchange-contrasts/wall-14**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmKAQIzAVASAkAAAGBBgI)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmKAQIzAVASAkAAAGBBgI`；[runs/door-continuation-20261012/role-exchange-contrasts/wall-14.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/wall-14.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/role-exchange-contrasts/wall-15**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQCBCAqAkBIAAAMCDCA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQCBCAqAkBIAAAMCDCA`；[runs/door-continuation-20261012/role-exchange-contrasts/wall-15.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/wall-15.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/role-exchange-contrasts/wall-16**：[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQCBFAVASAkAAAGBBhA)；未作玩家质量验收。 地图码 `AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQCBFAVASAkAAAGBBhA`；[runs/door-continuation-20261012/role-exchange-contrasts/wall-16.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/role-exchange-contrasts/wall-16.json)。
  尚无完整可验证的通关路线。
- **runs/door-continuation-20261012/single-shelter-permanent-front-01**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wFDw4UECAwOjeoMPUwI_A8MK5YadLIwODECgE-Bt4HPAgwEIFBgaGAA)；未作玩家质量验收。 地图码 `AWM4wFDw4UECAwOjeoMPUwI_A8MK5YadLIwODECgE-Bt4HPAgwEIFBgaGAA`；[runs/door-continuation-20261012/single-shelter-permanent-front-01.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/single-shelter-permanent-front-01.json)。
  <details><summary>参考 33 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wFDw4UECAwOjeoMPUwI_A8MK5YadLIwODECgE-Bt4HPAgwEIFBgaGAA&replay=GENDbQeM5m3GK3ijNwA)；操作码 `GENDbQeM5m3GK3ijNwA`；路线来源：runs/door-continuation-20261012/single-shelter-permanent-front-01.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/transfer-footer-0-top-0**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wZDw4UECAwNjWIMLkwIvA8MCF-4vAqwMIDBB9YL_BSEwk0MBAA)；未作玩家质量验收。 地图码 `AWM4wZDw4UECAwNjWIMLkwIvA8MCF-4vAqwMIDBB9YL_BSEwk0MBAA`；[runs/door-continuation-20261012/transfer-footer-0-top-0.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/transfer-footer-0-top-0.json)。
  <details><summary>参考 15 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wZDw4UECAwNjWIMLkwIvA8MCF-4vAqwMIDBB9YL_BSEwk0MBAA&replay=CKwXTSiM5ncM)；操作码 `CKwXTSiM5ncM`；路线来源：runs/door-continuation-20261012/transfer-footer-0-top-0.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/transfer-footer-2-top-0**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wJDw4UECAwNjWIMLkwIvA8MCF-4JEYwODECgwpnGeYKTAQRYBAA)；未作玩家质量验收。 地图码 `AWM4wJDw4UECAwNjWIMLkwIvA8MCF-4JEYwODECgwpnGeYKTAQRYBAA`；[runs/door-continuation-20261012/transfer-footer-2-top-0.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/transfer-footer-2-top-0.json)。
  <details><summary>参考 15 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wJDw4UECAwNjWIMLkwIvA8MCF-4JEYwODECgwpnGeYKTAQRYBAA&replay=CDYnrnqM5ncM)；操作码 `CDYnrnqM5ncM`；路线来源：runs/door-continuation-20261012/transfer-footer-2-top-0.json.result.solution.actions。

  </details>
- **runs/door-continuation-20261012/transfer-footer-2-top-2**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wZDw4UECAwNjWIMLkwIvA8MCF-4vYowODECgyxTL8pdRgQEEmgA)；未作玩家质量验收。 地图码 `AWM4wZDw4UECAwNjWIMLkwIvA8MCF-4vYowODECgyxTL8pdRgQEEmgA`；[runs/door-continuation-20261012/transfer-footer-2-top-2.json.map](../../ghost-maze-ai/runs/door-continuation-20261012/transfer-footer-2-top-2.json)。
  <details><summary>参考 28 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wZDw4UECAwNjWIMLkwIvA8MCF-4vYowODECgyxTL8pdRgQEEmgA&replay=AJHd5HGM5m-reKM3)；操作码 `AJHd5HGM5m-reKM3`；路线来源：runs/door-continuation-20261012/transfer-footer-2-top-2.json.result.solution.actions。

  </details>
- **runs/door-units-20261011/lock-minimized-33258**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBw8PAAAAHqgL9AAACqCYBAEgqgAAAAAEkCIIQWSAAAAAAQ)；未作玩家质量验收。 地图码 `AADAAPBw8PAAAAHqgL9AAACqCYBAEgqgAAAAAEkCIIQWSAAAAAAQ`；[runs/door-units-20261011/lock-minimized-33258.json.map](../../ghost-maze-ai/runs/door-units-20261011/lock-minimized-33258.json)。
  <details><summary>参考 21 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBw8PAAAAHqgL9AAACqCYBAEgqgAAAAAEkCIIQWSAAAAAAQ&replay=GLlDcM-MmLWePcA)；操作码 `GLlDcM-MmLWePcA`；路线来源：runs/door-units-20261011/lock-minimized-33258.json.evaluation.baseline.solution.actions。

  </details>
- **runs/door-units-20261011/lock-minimized-9105**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wcBRUVHBwMB4oKHXQYCBQ4uxISCUAQQC3B1dBBoYGBiYAA)；未作玩家质量验收。 地图码 `AWM4wcBRUVHBwMB4oKHXQYCBQ4uxISCUAQQC3B1dBBoYGBiYAA`；[runs/door-units-20261011/lock-minimized-9105.json.map](../../ghost-maze-ai/runs/door-units-20261011/lock-minimized-9105.json)。
  <details><summary>参考 13 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wcBRUVHBwMB4oKHXQYCBQ4uxISCUAQQC3B1dBBoYGBiYAA&replay=GEcMNN1til_A)；操作码 `GEcMNN1til_A`；路线来源：runs/door-units-20261011/lock-minimized-9105.json.evaluation.baseline.solution.actions。

  </details>
- **runs/door-units-20261011/ordinary-minimized**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wPDjxwMGBgZGp4Y5DVwrGLhEGUCAMcGJwwXMAgA)；未作玩家质量验收。 地图码 `AWM4wPDjxwMGBgZGp4Y5DVwrGLhEGUCAMcGJwwXMAgA`；[runs/door-units-20261011/ordinary-minimized.json.map](../../ghost-maze-ai/runs/door-units-20261011/ordinary-minimized.json)。
  <details><summary>参考 12 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wPDjxwMGBgZGp4Y5DVwrGLhEGUCAMcGJwwXMAgA&replay=APl7XCRiXw8)；操作码 `APl7XCRiXw8`；路线来源：runs/door-units-20261011/ordinary-minimized.json.evaluation.baseline.solution.actions。

  </details>
- **runs/foresight-20261008/dual-1-1**：[试玩](https://ghostmaze.novic.cc/?map=AADAAMD4MHBwAAFugKhANgKYMggCgMKhXOQXMgOAqAAAABICJAqBc1AiAAAAQQQCADg)；未作玩家质量验收。 地图码 `AADAAMD4MHBwAAFugKhANgKYMggCgMKhXOQXMgOAqAAAABICJAqBc1AiAAAAQQQCADg`；[runs/foresight-20261008/dual-1-1.json.map](../../ghost-maze-ai/runs/foresight-20261008/dual-1-1.json)。
  <details><summary>参考 32 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAMD4MHBwAAFugKhANgKYMggCgMKhXOQXMgOAqAAAABICJAqBc1AiAAAAQQQCADg&replay=AJLaDLmow1azFqzYww)；操作码 `AJLaDLmow1azFqzYww`；路线来源：runs/foresight-20261008/dual-1-1.json.solution.solution.actions。

  </details>
- **runs/foresight-20261008/dual-1-2**：[试玩](https://ghostmaze.novic.cc/?map=AADAAMD4MHBwAAFugKlANgKYMggCgMKhXOQXMgOAqAAAABICJAqBc1AiAAAAQQQCADg)；未作玩家质量验收。 地图码 `AADAAMD4MHBwAAFugKlANgKYMggCgMKhXOQXMgOAqAAAABICJAqBc1AiAAAAQQQCADg`；[runs/foresight-20261008/dual-1-2.json.map](../../ghost-maze-ai/runs/foresight-20261008/dual-1-2.json)。
  <details><summary>参考 46 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAMD4MHBwAAFugKlANgKYMggCgMKhXOQXMgOAqAAAABICJAqBc1AiAAAAQQQCADg&replay=EBIqG6aowVjCJ_VrMWrNjDA)；操作码 `EBIqG6aowVjCJ_VrMWrNjDA`；路线来源：runs/foresight-20261008/dual-1-2.json.solution.solution.actions。

  </details>
- **runs/foresight-20261008/dual-2-1**：[试玩](https://ghostmaze.novic.cc/?map=AADAAMD4MHBwAAFugKjANgKYMggCgMKhXOQXMgOAqAAAABICJAqBc1AiAAAAQQQCADg)；未作玩家质量验收。 地图码 `AADAAMD4MHBwAAFugKjANgKYMggCgMKhXOQXMgOAqAAAABICJAqBc1AiAAAAQQQCADg`；[runs/foresight-20261008/dual-2-1.json.map](../../ghost-maze-ai/runs/foresight-20261008/dual-2-1.json)。
  <details><summary>参考 32 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAMD4MHBwAAFugKjANgKYMggCgMKhXOQXMgOAqAAAABICJAqBc1AiAAAAQQQCADg&replay=APUVB12ow1azFqzYww)；操作码 `APUVB12ow1azFqzYww`；路线来源：runs/foresight-20261008/dual-2-1.json.solution.solution.actions。

  </details>
- **runs/foresight-20261008/dual-3-2**：[试玩](https://ghostmaze.novic.cc/?map=AADAAMD4MHBwAAFugKpANgKYMggCgMKhXOQXMgOAqAAAABICJAqBc1AiAAAAQQQCADg)；未作玩家质量验收。 地图码 `AADAAMD4MHBwAAFugKpANgKYMggCgMKhXOQXMgOAqAAAABICJAqBc1AiAAAAQQQCADg`；[runs/foresight-20261008/dual-3-2.json.map](../../ghost-maze-ai/runs/foresight-20261008/dual-3-2.json)。
  <details><summary>参考 42 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAMD4MHBwAAFugKpANgKYMggCgMKhXOQXMgOAqAAAABICJAqBc1AiAAAAQQQCADg&replay=EEhLJMao2MIn9Wsxas2MMA)；操作码 `EEhLJMao2MIn9Wsxas2MMA`；路线来源：runs/foresight-20261008/dual-3-2.json.solution.solution.actions。

  </details>
- **runs/foresight-20261008/dual-3-3**：[试玩](https://ghostmaze.novic.cc/?map=AADAAMD4MHBwAAFugKvANgKYMggCgMKhXOQXMgOAqAAAABICJAqBc1AiAAAAQQQCADg)；未作玩家质量验收。 地图码 `AADAAMD4MHBwAAFugKvANgKYMggCgMKhXOQXMgOAqAAAABICJAqBc1AiAAAAQQQCADg`；[runs/foresight-20261008/dual-3-3.json.map](../../ghost-maze-ai/runs/foresight-20261008/dual-3-3.json)。
  <details><summary>参考 40 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAMD4MHBwAAFugKvANgKYMggCgMKhXOQXMgOAqAAAABICJAqBc1AiAAAAQQQCADg&replay=AK90OD2rjCJ_VrMWrNjD)；操作码 `AK90OD2rjCJ_VrMWrNjD`；路线来源：runs/foresight-20261008/dual-3-3.json.solution.solution.actions。

  </details>
- **runs/foresight-20261008/handoff-4button**：[试玩](https://ghostmaze.novic.cc/?map=AADAAAAYEDAwAAE6ACAWBuBsGQzCAAAUByBZAcAoAAAAAAEgKAuQFyAAAAQCCAGA)；未作玩家质量验收。 地图码 `AADAAAAYEDAwAAE6ACAWBuBsGQzCAAAUByBZAcAoAAAAAAEgKAuQFyAAAAQCCAGA`；[runs/foresight-20261008/handoff-4button.json.map](../../ghost-maze-ai/runs/foresight-20261008/handoff-4button.json)。
  尚无完整可验证的通关路线。
- **runs/foresight-20261008/handoff-left**：[试玩](https://ghostmaze.novic.cc/?map=AADAAAAYEDAwAAE2ACAOBuBsGQzCAAAUByBZAcAoAAAAAAEgKAuQFyAAAAQCCAEA)；未作玩家质量验收。 地图码 `AADAAAAYEDAwAAE2ACAOBuBsGQzCAAAUByBZAcAoAAAAAAEgKAuQFyAAAAQCCAEA`；[runs/foresight-20261008/handoff-left.json.map](../../ghost-maze-ai/runs/foresight-20261008/handoff-left.json)。
  <details><summary>参考 16 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAAAYEDAwAAE2ACAOBuBsGQzCAAAUByBZAcAoAAAAAAEgKAuQFyAAAAQCCAEA&replay=AAtNj9osedzD)；操作码 `AAtNj9osedzD`；路线来源：runs/foresight-20261008/handoff-left.json.solution.solution.actions。

  </details>
- **runs/foresight-20261008/handoff-proposal**：[试玩](https://ghostmaze.novic.cc/?map=AADAAAAYEDAwAAE6ACAWCOBsFQ5DMIAABQHIFkBwCgAAAAAASAoC5AXIAAABAIIAYA)；未作玩家质量验收。 地图码 `AADAAAAYEDAwAAE6ACAWCOBsFQ5DMIAABQHIFkBwCgAAAAAASAoC5AXIAAABAIIAYA`；[runs/foresight-20261008/handoff-proposal.json.map](../../ghost-maze-ai/runs/foresight-20261008/handoff-proposal.json)。
  <details><summary>参考 16 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAAAYEDAwAAE6ACAWCOBsFQ5DMIAABQHIFkBwCgAAAAAASAoC5AXIAAABAIIAYA&replay=AIjes5KwVZLD)；操作码 `AIjes5KwVZLD`；路线来源：runs/foresight-20261008/handoff-proposal.json.solution.solution.actions。

  </details>
- **runs/foresight-20261008/handoff-right**：[试玩](https://ghostmaze.novic.cc/?map=AADAAAAYEDAwAAE6ACAWBuBsGQzCAAAUByBZAcAoAAAAAAEgKAuQFyAAAAQCCAEA)；未作玩家质量验收。 地图码 `AADAAAAYEDAwAAE6ACAWBuBsGQzCAAAUByBZAcAoAAAAAAEgKAuQFyAAAAQCCAEA`；[runs/foresight-20261008/handoff-right.json.map](../../ghost-maze-ai/runs/foresight-20261008/handoff-right.json)。
  <details><summary>参考 19 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAAAYEDAwAAE6ACAWBuBsGQzCAAAUByBZAcAoAAAAAAEgKAuQFyAAAAQCCAEA&replay=CGNt4kli8edzDA)；操作码 `CGNt4kli8edzDA`；路线来源：runs/foresight-20261008/handoff-right.json.solution.solution.actions。

  </details>
- **runs/foresight-20261008/search-c/candidate-6797**：[试玩](https://ghostmaze.novic.cc/?map=AADAAMD4MHBwAAFugCwDYCmDIIAoDCoVzkFzIDgKgAAAASAiQKgXNQIgAAAEEEAgA4A)；未作玩家质量验收。 地图码 `AADAAMD4MHBwAAFugCwDYCmDIIAoDCoVzkFzIDgKgAAAASAiQKgXNQIgAAAEEEAgA4A`；[runs/foresight-20261008/search-c/candidate-6797.json.map](../../ghost-maze-ai/runs/foresight-20261008/search-c/candidate-6797.json)。
  <details><summary>参考 32 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAMD4MHBwAAFugCwDYCmDIIAoDCoVzkFzIDgKgAAAASAiQKgXNQIgAAAEEEAgA4A&replay=APwK1Tqow1azFqzYww)；操作码 `APwK1Tqow1azFqzYww`；路线来源：runs/foresight-20261008/search-c/candidate-6797.json.solution.solution.actions。

  </details>
- **runs/goal-room-core-20261010/candidate**：[试玩](https://ghostmaze.novic.cc/?map=AADAAMHA4ODgAAEsgIIgeIBA1hHAAKBcAnIHAHAFQAAAAFyBOQFIEQLiAAAAMAMIEEE)；未作玩家质量验收。 地图码 `AADAAMHA4ODgAAEsgIIgeIBA1hHAAKBcAnIHAHAFQAAAAFyBOQFIEQLiAAAAMAMIEEE`；[runs/goal-room-core-20261010/candidate.json.map](../../ghost-maze-ai/runs/goal-room-core-20261010/candidate.json)。
  <details><summary>参考 27 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAMHA4ODgAAEsgIIgeIBA1hHAAKBcAnIHAHAFQAAAAFyBOQFIEQLiAAAAMAMIEEE&replay=CCGjVksv5XKdADto)；操作码 `CCGjVksv5XKdADto`；路线来源：runs/goal-room-core-20261010/candidate.json.result.solution.actions。

  </details>
- **runs/interlocked-20261008/search-02/longest-diagnostic**：[试玩](https://ghostmaze.novic.cc/?map=AADAAODw-PDwAAFbYAqAHgIMEEIAqAUEcgXIDIVQAAAAK5AhBSQuKC5cgAAAAEAhhAgA)；未作玩家质量验收。 地图码 `AADAAODw-PDwAAFbYAqAHgIMEEIAqAUEcgXIDIVQAAAAK5AhBSQuKC5cgAAAAEAhhAgA`；[runs/interlocked-20261008/search-02/longest-diagnostic.json.map](../../ghost-maze-ai/runs/interlocked-20261008/search-02/longest-diagnostic.json)。
  <details><summary>参考 60 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAODw-PDwAAFbYAqAHgIMEEIAqAUEcgXIDIVQAAAAK5AhBSQuKC5cgAAAAEAhhAgA&replay=AOciE1ZgXAjddxiCN1ZMI3XeIPc)；操作码 `AOciE1ZgXAjddxiCN1ZMI3XeIPc`；路线来源：runs/interlocked-20261008/search-02/longest-diagnostic.json.solution.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-386**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BICBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BICBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-386.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-386.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BICBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG&replay=CII8VLsgj90mF8CqMlf2oMzILXA)；操作码 `CII8VLsgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-386.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-387**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BKCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BKCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-387.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-387.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BKCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG&replay=CMdsSzwgj90mF8CqMlf2oMzILXA)；操作码 `CMdsSzwgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-387.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-388**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BMCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BMCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-388.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-388.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BMCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG&replay=CAica7Ugj90mF8CqMlf2oMzILXA)；操作码 `CAica7Ugj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-388.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-389**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BOCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BOCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-389.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-389.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BOCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG&replay=CE3MdDIgj90mF8CqMlf2oMzILXA)；操作码 `CE3MdDIgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-389.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-390**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BQCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BQCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-390.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-390.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BQCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG&replay=CO-bBKogj90mF8CqMlf2oMzILXA)；操作码 `CO-bBKogj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-390.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-391**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BSCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BSCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-391.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-391.json)。
  <details><summary>参考 61 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BSCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG&replay=GKrLGy0guP3SYXwKoyV_agzMgtcA)；操作码 `GKrLGy0guP3SYXwKoyV_agzMgtcA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-391.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-392**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BUCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BUCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-392.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-392.json)。
  <details><summary>参考 61 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BUCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG&replay=GGU7O6Qgj97SYXwKoyV_agzMgtcA)；操作码 `GGU7O6Qgj97SYXwKoyV_agzMgtcA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-392.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-393**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BWCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BWCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-393.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-393.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BWCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG&replay=CCBrJCMgj90mF8CqMlf2oMzILXA)；操作码 `CCBrJCMgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-393.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-394**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BYCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BYCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-394.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-394.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BYCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG&replay=CCGqfPcgj90mF8CqMlf2oMzILXA)；操作码 `CCGqfPcgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-394.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-398**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BgCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BgCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-398.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-398.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BgCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG&replay=CNBQej8gj90mF8CqMlf2oMzILXA)；操作码 `CNBQej8gj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-398.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-399**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BiCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BiCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-399.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-399.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BiCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG&replay=CJUAZbggj90mF8CqMlf2oMzILXA)；操作码 `CJUAZbggj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-399.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-400**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BkCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BkCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-400.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-400.json)。
  <details><summary>参考 61 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BkCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG&replay=GFrwRTE6CP3SYXwKoyV_agzMgtcA)；操作码 `GFrwRTE6CP3SYXwKoyV_agzMgtcA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-400.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-401**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BmCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BmCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-401.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-401.json)。
  <details><summary>参考 63 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BmCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG&replay=CB-gWrY-oI_dJhfAqjJX9qDMyC1w)；操作码 `CB-gWrY-oI_dJhfAqjJX9qDMyC1w`；路线来源：runs/irreversible-handoff-20261010/a/candidate-401.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-402**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BoCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BoCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-402.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-402.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BoCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG&replay=CB5hAmKAj90mF8CqMlf2oMzILXA)；操作码 `CB5hAmKAj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-402.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-404**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BsCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BsCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-404.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-404.json)。
  <details><summary>参考 61 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BsCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG&replay=GJTBPWzKCP3SYXwKoyV_agzMgtcA)；操作码 `GJTBPWzKCP3SYXwKoyV_agzMgtcA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-404.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-405**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BuCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BuCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-405.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-405.json)。
  <details><summary>参考 63 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BuCBlANArwIhKAkFMgrgLmQccAAqgAEgFQTiC5xBOcghBCAAAQIYCAEGIEGG&replay=CNGRIuvyoI_dJhfAqjJX9qDMyC1w)；操作码 `CNGRIuvyoI_dJhfAqjJX9qDMyC1w`；路线来源：runs/irreversible-handoff-20261010/a/candidate-405.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-488**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BUCBlANArwIhKAkFMgrgLgHGQAKoABIBUE4gucQTnIIQQgAAECGAAhiBBhg)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BUCBlANArwIhKAkFMgrgLgHGQAKoABIBUE4gucQTnIIQQgAAECGAAhiBBhg`；[runs/irreversible-handoff-20261010/a/candidate-488.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-488.json)。
  <details><summary>参考 55 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BUCBlANArwIhKAkFMgrgLgHGQAKoABIBUE4gucQTnIIQQgAAECGAAhiBBhg&replay=CLz4BQEgj90mF8CqMlzeoDwtcA)；操作码 `CLz4BQEgj90mF8CqMlzeoDwtcA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-488.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-491**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BaCBlANArwIhKAkFMgrgLgHGQAKoABIBUE4gucQTnIIQQgAAECGAAhiBBhg)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BaCBlANArwIhKAkFMgrgLgHGQAKoABIBUE4gucQTnIIQQgAAECGAAhiBBhg`；[runs/irreversible-handoff-20261010/a/candidate-491.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-491.json)。
  <details><summary>参考 55 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BaCBlANArwIhKAkFMgrgLgHGQAKoABIBUE4gucQTnIIQQgAAECGAAhiBBhg&replay=CKbR10Agj90mF8CqMlzeoDwtcA)；操作码 `CKbR10Agj90mF8CqMlzeoDwtcA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-491.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-492**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BcCBlANArwIhKAkFMgrgLgHGQAKoABIBUE4gucQTnIIQQgAAECGAAhiBBhg)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BcCBlANArwIhKAkFMgrgLgHGQAKoABIBUE4gucQTnIIQQgAAECGAAhiBBhg`；[runs/irreversible-handoff-20261010/a/candidate-492.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-492.json)。
  <details><summary>参考 55 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BcCBlANArwIhKAkFMgrgLgHGQAKoABIBUE4gucQTnIIQQgAAECGAAhiBBhg&replay=COxkx3Ygj90mF8CqMlzeoDwtcA)；操作码 `COxkx3Ygj90mF8CqMlzeoDwtcA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-492.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-554**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BICBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BICBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-554.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-554.json)。
  <details><summary>参考 65 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BICBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=GMGVIDwgj90lciF8CqMlf2oMzILXAA)；操作码 `GMGVIDwgj90lciF8CqMlf2oMzILXAA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-554.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-555**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BKCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BKCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-555.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-555.json)。
  <details><summary>参考 65 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BKCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=GITFP7sgj90lciF8CqMlf2oMzILXAA)；操作码 `GITFP7sgj90lciF8CqMlf2oMzILXAA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-555.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-556**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BMCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BMCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-556.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-556.json)。
  <details><summary>参考 65 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BMCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=GEs1HzIgj90lciF8CqMlf2oMzILXAA)；操作码 `GEs1HzIgj90lciF8CqMlf2oMzILXAA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-556.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-557**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BOCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BOCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-557.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-557.json)。
  <details><summary>参考 65 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BOCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=GA5lALUgj90lciF8CqMlf2oMzILXAA)；操作码 `GA5lALUgj90lciF8CqMlf2oMzILXAA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-557.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-558**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BQCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BQCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-558.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-558.json)。
  <details><summary>参考 65 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BQCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=GKwycC0gj90lciF8CqMlf2oMzILXAA)；操作码 `GKwycC0gj90lciF8CqMlf2oMzILXAA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-558.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-559**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BSCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BSCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-559.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-559.json)。
  <details><summary>参考 67 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BSCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=COlib6oguP3SVyIXwKoyV_agzMgtcA)；操作码 `COlib6oguP3SVyIXwKoyV_agzMgtcA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-559.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-560**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BUCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BUCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-560.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-560.json)。
  <details><summary>参考 65 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BUCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=GCaSTyMgj90lciF8CqMlf2oMzILXAA)；操作码 `GCaSTyMgj90lciF8CqMlf2oMzILXAA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-560.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-561**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BWCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BWCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-561.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-561.json)。
  <details><summary>参考 65 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BWCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=GGPCUKQgj90lciF8CqMlf2oMzILXAA)；操作码 `GGPCUKQgj90lciF8CqMlf2oMzILXAA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-561.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-562**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BYCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BYCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-562.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-562.json)。
  <details><summary>参考 65 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BYCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=GGIDCHAgj90lciF8CqMlf2oMzILXAA)；操作码 `GGIDCHAgj90lciF8CqMlf2oMzILXAA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-562.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-563**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BaCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BaCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-563.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-563.json)。
  <details><summary>参考 65 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BaCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=GCdTF_cgj90mXCF8CqMlf2oMzILXAA)；操作码 `GCdTF_cgj90mXCF8CqMlf2oMzILXAA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-563.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-564**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BcCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BcCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-564.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-564.json)。
  <details><summary>参考 65 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BcCBlANArwIhKAkFMgrgLgHHAMgqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=GOijN34gj90lciF8CqMlf2oMzILXAA)；操作码 `GOijN34gj90lciF8CqMlf2oMzILXAA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-564.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-578**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BICBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BICBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-578.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-578.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BICBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=CGM44-ggj90mF8CqMlf2oMzILXA)；操作码 `CGM44-ggj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-578.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-579**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BKCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BKCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-579.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-579.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BKCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=CCZo_G8gj90mF8CqMlf2oMzILXA)；操作码 `CCZo_G8gj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-579.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-580**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BMCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BMCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-580.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-580.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BMCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=COmY3OYgj90mF8CqMlf2oMzILXA)；操作码 `COmY3OYgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-580.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-581**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BOCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BOCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-581.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-581.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BOCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=CKzIw2Egj90mF8CqMlf2oMzILXA)；操作码 `CKzIw2Egj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-581.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-582**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BQCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BQCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-582.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-582.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BQCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=CA6fs_kgj90mF8CqMlf2oMzILXA)；操作码 `CA6fs_kgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-582.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-583**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BSCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BSCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-583.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-583.json)。
  <details><summary>参考 61 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BSCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=GEvPrH4guP3SYXwKoyV_agzMgtcA)；操作码 `GEvPrH4guP3SYXwKoyV_agzMgtcA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-583.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-584**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BUCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BUCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-584.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-584.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BUCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=CIQ_jPcgj90mF8CqMlf2oMzILXA)；操作码 `CIQ_jPcgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-584.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-585**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BWCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BWCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-585.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-585.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BWCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=CMFvk3Agj90mF8CqMlf2oMzILXA)；操作码 `CMFvk3Agj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-585.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-586**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BYCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BYCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-586.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-586.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BYCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=CMCuy6Qgj90mF8CqMlf2oMzILXA)；操作码 `CMCuy6Qgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-586.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-587**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BaCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BaCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-587.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-587.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BaCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=CIX-1CMgj90mF8CqMlf2oMzILXA)；操作码 `CIX-1CMgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-587.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-588**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BcCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BcCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-588.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-588.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BcCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=CEoO9Kogj90mF8CqMlf2oMzILXA)；操作码 `CEoO9Kogj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-588.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-590**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BgCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BgCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-590.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-590.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BgCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=CDFUzWwgj90mF8CqMlf2oMzILXA)；操作码 `CDFUzWwgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-590.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-591**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BiCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BiCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-591.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-591.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BiCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=CHQE0usgj90mF8CqMlf2oMzILXA)；操作码 `CHQE0usgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-591.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-592**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BkCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BkCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-592.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-592.json)。
  <details><summary>参考 61 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BkCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=GLv08mI6CP3SYXwKoyV_agzMgtcA)；操作码 `GLv08mI6CP3SYXwKoyV_agzMgtcA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-592.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-594**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BoCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BoCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-594.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-594.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BoCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=CP9ltTGAj90mF8CqMlf2oMzILXA)；操作码 `CP9ltTGAj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-594.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-596**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BsCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BsCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-596.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-596.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BsCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=CHXFij8gj90mF8CqMlf2oMzILXA)；操作码 `CHXFij8gj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-596.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-597**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BuCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BuCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG`；[runs/irreversible-handoff-20261010/a/candidate-597.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-597.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BuCBlANArwIhKAkFMgrgLgHHAGQqgAEgFQTiC5xBOcghBCAAAQIYAQCGIEGG&replay=CDCVlbggj90mF8CqMlf2oMzILXA)；操作码 `CDCVlbggj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-597.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-731**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BaCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guZQTnIIQQgAAECGAEGIAhhg)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BaCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guZQTnIIQQgAAECGAEGIAhhg`；[runs/irreversible-handoff-20261010/a/candidate-731.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-731.json)。
  <details><summary>参考 51 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BaCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guZQTnIIQQgAAECGAEGIAhhg&replay=CAEIDqAgj90ljKhfxoi_yC1w)；操作码 `CAEIDqAgj90ljKhfxoi_yC1w`；路线来源：runs/irreversible-handoff-20261010/a/candidate-731.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-732**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BcCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guZQTnIIQQgAAECGAEGIAhhg)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BcCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guZQTnIIQQgAAECGAEGIAhhg`；[runs/irreversible-handoff-20261010/a/candidate-732.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-732.json)。
  <details><summary>参考 49 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BcCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guZQTnIIQQgAAECGAEGIAhhg&replay=GEu9HpYgj90nKoX8aIv8gtcA)；操作码 `GEu9HpYgj90nKoX8aIv8gtcA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-732.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-746**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BICBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BICBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG`；[runs/irreversible-handoff-20261010/a/candidate-746.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-746.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BICBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG&replay=CDNk0eEgj90mF8CqMlf2oMzILXA)；操作码 `CDNk0eEgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-746.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-747**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BKCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BKCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG`；[runs/irreversible-handoff-20261010/a/candidate-747.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-747.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BKCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG&replay=CHY0zmYgj90mF8CqMlf2oMzILXA)；操作码 `CHY0zmYgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-747.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-748**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BMCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BMCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG`；[runs/irreversible-handoff-20261010/a/candidate-748.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-748.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BMCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG&replay=CLnE7u8gj90mF8CqMlf2oMzILXA)；操作码 `CLnE7u8gj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-748.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-749**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BOCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BOCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG`；[runs/irreversible-handoff-20261010/a/candidate-749.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-749.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BOCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG&replay=CPyU8Wggj90mF8CqMlf2oMzILXA)；操作码 `CPyU8Wggj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-749.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-750**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BQCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BQCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG`；[runs/irreversible-handoff-20261010/a/candidate-750.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-750.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BQCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG&replay=CF7DgfAgj90mF8CqMlf2oMzILXA)；操作码 `CF7DgfAgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-750.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-751**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BSCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BSCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG`；[runs/irreversible-handoff-20261010/a/candidate-751.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-751.json)。
  <details><summary>参考 61 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BSCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG&replay=GBuTnncguP3SYXwKoyV_agzMgtcA)；操作码 `GBuTnncguP3SYXwKoyV_agzMgtcA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-751.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-753**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BWCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BWCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG`；[runs/irreversible-handoff-20261010/a/candidate-753.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-753.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BWCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG&replay=CJEzoXkgj90mF8CqMlf2oMzILXA)；操作码 `CJEzoXkgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-753.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-754**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BYCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BYCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG`；[runs/irreversible-handoff-20261010/a/candidate-754.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-754.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BYCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG&replay=CJDy-a0gj90mF8CqMlf2oMzILXA)；操作码 `CJDy-a0gj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-754.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-758**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BgCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BgCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG`；[runs/irreversible-handoff-20261010/a/candidate-758.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-758.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BgCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG&replay=CGEI_2Ugj90mF8CqMlf2oMzILXA)；操作码 `CGEI_2Ugj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-758.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-759**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BiCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BiCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG`；[runs/irreversible-handoff-20261010/a/candidate-759.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-759.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BiCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG&replay=CCRY4OIgj90mF8CqMlf2oMzILXA)；操作码 `CCRY4OIgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-759.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-760**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BkCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BkCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG`；[runs/irreversible-handoff-20261010/a/candidate-760.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-760.json)。
  <details><summary>参考 61 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BkCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG&replay=GOuowGs6CP3SYXwKoyV_agzMgtcA)；操作码 `GOuowGs6CP3SYXwKoyV_agzMgtcA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-760.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-761**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BmCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BmCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG`；[runs/irreversible-handoff-20261010/a/candidate-761.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-761.json)。
  <details><summary>参考 63 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BmCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG&replay=CK743-w-oI_dJhfAqjJX9qDMyC1w)；操作码 `CK743-w-oI_dJhfAqjJX9qDMyC1w`；路线来源：runs/irreversible-handoff-20261010/a/candidate-761.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-762**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BoCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BoCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG`；[runs/irreversible-handoff-20261010/a/candidate-762.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-762.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BoCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG&replay=CK85hziAj90mF8CqMlf2oMzILXA)；操作码 `CK85hziAj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-762.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-764**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BsCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BsCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG`；[runs/irreversible-handoff-20261010/a/candidate-764.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-764.json)。
  <details><summary>参考 61 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BsCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG&replay=GCWZuDbKCP3SYXwKoyV_agzMgtcA)；操作码 `GCWZuDbKCP3SYXwKoyV_agzMgtcA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-764.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-765**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BuCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BuCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG`；[runs/irreversible-handoff-20261010/a/candidate-765.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-765.json)。
  <details><summary>参考 63 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BuCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4guczBOcghBCAAAQIYAQYgQCGG&replay=CGDJp7HyoI_dJhfAqjJX9qDMyC1w)；操作码 `CGDJp7HyoI_dJhfAqjJX9qDMyC1w`；路线来源：runs/irreversible-handoff-20261010/a/candidate-765.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-962**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BICBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BICBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC`；[runs/irreversible-handoff-20261010/a/candidate-962.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-962.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BICBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC&replay=CHqVwEIgj90mF8CqMlf2oMzILXA)；操作码 `CHqVwEIgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-962.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-963**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BKCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BKCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC`；[runs/irreversible-handoff-20261010/a/candidate-963.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-963.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BKCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC&replay=CD_F38Ugj90mF8CqMlf2oMzILXA)；操作码 `CD_F38Ugj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-963.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-964**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BMCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BMCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC`；[runs/irreversible-handoff-20261010/a/candidate-964.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-964.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BMCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC&replay=CPA1_0wgj90mF8CqMlf2oMzILXA)；操作码 `CPA1_0wgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-964.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-965**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BOCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BOCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC`；[runs/irreversible-handoff-20261010/a/candidate-965.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-965.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BOCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC&replay=CLVl4Msgj90mF8CqMlf2oMzILXA)；操作码 `CLVl4Msgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-965.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-966**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BQCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BQCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC`；[runs/irreversible-handoff-20261010/a/candidate-966.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-966.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BQCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC&replay=CBcykFMgj90mF8CqMlf2oMzILXA)；操作码 `CBcykFMgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-966.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-967**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BSCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BSCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC`；[runs/irreversible-handoff-20261010/a/candidate-967.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-967.json)。
  <details><summary>参考 61 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BSCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC&replay=GFJij9QguP3SYXwKoyV_agzMgtcA)；操作码 `GFJij9QguP3SYXwKoyV_agzMgtcA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-967.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-968**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BUCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BUCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC`；[runs/irreversible-handoff-20261010/a/candidate-968.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-968.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BUCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC&replay=CJ2Sr10gj90mF8CqMlf2oMzILXA)；操作码 `CJ2Sr10gj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-968.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-969**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BWCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BWCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC`；[runs/irreversible-handoff-20261010/a/candidate-969.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-969.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BWCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC&replay=CNjCsNogj90mF8CqMlf2oMzILXA)；操作码 `CNjCsNogj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-969.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-970**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BYCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BYCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC`；[runs/irreversible-handoff-20261010/a/candidate-970.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-970.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BYCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC&replay=CNkD6A4gj90mF8CqMlf2oMzILXA)；操作码 `CNkD6A4gj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-970.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-971**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BaCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BaCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC`；[runs/irreversible-handoff-20261010/a/candidate-971.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-971.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BaCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC&replay=CJxT94kgj90mF8CqMlf2oMzILXA)；操作码 `CJxT94kgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-971.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-972**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BcCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BcCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC`；[runs/irreversible-handoff-20261010/a/candidate-972.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-972.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BcCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC&replay=CFOj1wAgj90mF8CqMlf2oMzILXA)；操作码 `CFOj1wAgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-972.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-974**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BgCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BgCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC`；[runs/irreversible-handoff-20261010/a/candidate-974.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-974.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BgCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC&replay=CCj57sYgj90mF8CqMlf2oMzILXA)；操作码 `CCj57sYgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-974.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-975**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BiCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BiCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC`；[runs/irreversible-handoff-20261010/a/candidate-975.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-975.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BiCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC&replay=CG2p8UEgj90mF8CqMlf2oMzILXA)；操作码 `CG2p8UEgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-975.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-976**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BkCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BkCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC`；[runs/irreversible-handoff-20261010/a/candidate-976.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-976.json)。
  <details><summary>参考 61 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BkCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC&replay=GKJZ0cg6CP3SYXwKoyV_agzMgtcA)；操作码 `GKJZ0cg6CP3SYXwKoyV_agzMgtcA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-976.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-978**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BoCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BoCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC`；[runs/irreversible-handoff-20261010/a/candidate-978.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-978.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BoCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC&replay=CObIlpuAj90mF8CqMlf2oMzILXA)；操作码 `CObIlpuAj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-978.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/a/candidate-980**：[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BsCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC)；未作玩家质量验收。 地图码 `AADAwGHh4eHh4AEdYCF8BsCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC`；[runs/irreversible-handoff-20261010/a/candidate-980.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/a/candidate-980.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BsCBlANArwIhKAkFMgrgLgHHAAKoABIBUE4gucQTnIIQRmAAAQIYAQYgQYYC&replay=CGxoqZUgj90mF8CqMlf2oMzILXA)；操作码 `CGxoqZUgj90mF8CqMlf2oMzILXA`；路线来源：runs/irreversible-handoff-20261010/a/candidate-980.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/c/candidate-1**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAAC5xAqgXOQIgSAAAAAIIEII)；未作玩家质量验收。 地图码 `AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAAC5xAqgXOQIgSAAAAAIIEII`；[runs/irreversible-handoff-20261010/c/candidate-1.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/c/candidate-1.json)。
  <details><summary>参考 31 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAAC5xAqgXOQIgSAAAAAIIEII&replay=CM-cBcA_AWlXDelACA)；操作码 `CM-cBcA_AWlXDelACA`；路线来源：runs/irreversible-handoff-20261010/c/candidate-1.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/c/candidate-11**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAACcQKoE5AiBIAAAAAgQgA)；未作玩家质量验收。 地图码 `AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAACcQKoE5AiBIAAAAAgQgA`；[runs/irreversible-handoff-20261010/c/candidate-11.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/c/candidate-11.json)。
  <details><summary>参考 30 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAACcQKoE5AiBIAAAAAgQgA&replay=EI01RN0_AWlXDelAIA)；操作码 `EI01RN0_AWlXDelAIA`；路线来源：runs/irreversible-handoff-20261010/c/candidate-11.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/c/candidate-111**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQDnAECgAAAALnECqBOQIgSAAAAAAIIEI)；未作玩家质量验收。 地图码 `AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQDnAECgAAAALnECqBOQIgSAAAAAAIIEI`；[runs/irreversible-handoff-20261010/c/candidate-111.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/c/candidate-111.json)。
  <details><summary>参考 33 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQDnAECgAAAALnECqBOQIgSAAAAAAIIEI&replay=GFq7_84_AWlXI96UAIA)；操作码 `GFq7_84_AWlXI96UAIA`；路线来源：runs/irreversible-handoff-20261010/c/candidate-111.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/c/candidate-15**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUFyA5AHAECgAAAALnOQKoE5AiBIAAAAAAggQgg)；未作玩家质量验收。 地图码 `AADAAPBQcHBgAAEMgIIgWIBA3hAFUFyA5AHAECgAAAALnOQKoE5AiBIAAAAAAggQgg`；[runs/irreversible-handoff-20261010/c/candidate-15.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/c/candidate-15.json)。
  <details><summary>参考 31 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUFyA5AHAECgAAAALnOQKoE5AiBIAAAAAAggQgg&replay=CKrkqRg_AWlXDelACA)；操作码 `CKrkqRg_AWlXDelACA`；路线来源：runs/irreversible-handoff-20261010/c/candidate-15.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/c/candidate-17**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQC4AgUAAAABc4gVQJyBECQAAAABBAhA)；未作玩家质量验收。 地图码 `AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQC4AgUAAAABc4gVQJyBECQAAAABBAhA`；[runs/irreversible-handoff-20261010/c/candidate-17.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/c/candidate-17.json)。
  <details><summary>参考 33 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQC4AgUAAAABc4gVQJyBECQAAAABBAhA&replay=GEUybb0_AWlXI96UAIA)；操作码 `GEUybb0_AWlXI96UAIA`；路线来源：runs/irreversible-handoff-20261010/c/candidate-17.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/c/candidate-20**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAAC5xAqgXOQIgSAAAAAIIEAI)；未作玩家质量验收。 地图码 `AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAAC5xAqgXOQIgSAAAAAIIEAI`；[runs/irreversible-handoff-20261010/c/candidate-20.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/c/candidate-20.json)、[runs/irreversible-handoff-20261010/d/candidate-209.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/d/candidate-209.json)。
  <details><summary>参考 31 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAAC5xAqgXOQIgSAAAAAIIEAI&replay=CP2qZ0I_AWZXDelACA)；操作码 `CP2qZ0I_AWZXDelACA`；路线来源：runs/irreversible-handoff-20261010/c/candidate-20.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/c/candidate-38**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEuA5AHAOQKAAAAAucQKoE5AuIEgAAACACBCBCDA)；未作玩家质量验收。 地图码 `AADAAPBQcHBgAAEMgIIgWIBA3hAFUEuA5AHAOQKAAAAAucQKoE5AuIEgAAACACBCBCDA`；[runs/irreversible-handoff-20261010/c/candidate-38.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/c/candidate-38.json)。
  <details><summary>参考 31 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEuA5AHAOQKAAAAAucQKoE5AuIEgAAACACBCBCDA&replay=CJJshaM_AWlXDelACA)；操作码 `CJJshaM_AWlXDelACA`；路线来源：runs/irreversible-handoff-20261010/c/candidate-38.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/c/candidate-63**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUFyA5AOcAQKAAAAAucQKoE5AiBIAAAAAAgggQg)；未作玩家质量验收。 地图码 `AADAAPBQcHBgAAEMgIIgWIBA3hAFUFyA5AOcAQKAAAAAucQKoE5AiBIAAAAAAgggQg`；[runs/irreversible-handoff-20261010/c/candidate-63.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/c/candidate-63.json)。
  <details><summary>参考 31 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUFyA5AOcAQKAAAAAucQKoE5AiBIAAAAAAgggQg&replay=COBZIww_AWlXDelACA)；操作码 `COBZIww_AWlXDelACA`；路线来源：runs/irreversible-handoff-20261010/c/candidate-63.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/c/candidate-77**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOXAHAECgAAAALnECqBOQIgSAAAAAEIIEI)；未作玩家质量验收。 地图码 `AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOXAHAECgAAAALnECqBOQIgSAAAAAEIIEI`；[runs/irreversible-handoff-20261010/c/candidate-77.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/c/candidate-77.json)。
  <details><summary>参考 31 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOXAHAECgAAAALnECqBOQIgSAAAAAEIIEI&replay=CBKXfLc_AWlXDelACA)；操作码 `CBKXfLc_AWlXDelACA`；路线来源：runs/irreversible-handoff-20261010/c/candidate-77.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/d/candidate-1039**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEuA5AHAECgAAAALnECqBOQLiBIAAAAgAggQgA)；未作玩家质量验收。 地图码 `AADAAPBQcHBgAAEMgIIgWIBA3hAFUEuA5AHAECgAAAALnECqBOQLiBIAAAAgAggQgA`；[runs/irreversible-handoff-20261010/d/candidate-1039.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/d/candidate-1039.json)。
  <details><summary>参考 31 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEuA5AHAECgAAAALnECqBOQLiBIAAAAgAggQgA&replay=CL-m8DnPAWlXDeZACA)；操作码 `CL-m8DnPAWlXDeZACA`；路线来源：runs/irreversible-handoff-20261010/d/candidate-1039.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/d/candidate-1135**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEuA5AOcAQKAAAAAucQKoE5AiBIAAAAQAwggQg)；未作玩家质量验收。 地图码 `AADAAPBQcHBgAAEMgIIgWIBA3hAFUEuA5AOcAQKAAAAAucQKoE5AiBIAAAAQAwggQg`；[runs/irreversible-handoff-20261010/d/candidate-1135.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/d/candidate-1135.json)。
  <details><summary>参考 33 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEuA5AOcAQKAAAAAucQKoE5AiBIAAAAQAwggQg&replay=GLSkPjg_AWlXI96UAIA)；操作码 `GLSkPjg_AWlXI96UAIA`；路线来源：runs/irreversible-handoff-20261010/d/candidate-1135.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/d/candidate-120**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQDnAECgAAAALnECqBOQIgSAAAAAMIIEI)；未作玩家质量验收。 地图码 `AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQDnAECgAAAALnECqBOQIgSAAAAAMIIEI`；[runs/irreversible-handoff-20261010/d/candidate-120.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/d/candidate-120.json)、[runs/irreversible-handoff-20261010/d/candidate-883.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/d/candidate-883.json)。
  <details><summary>参考 33 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQDnAECgAAAALnECqBOQIgSAAAAAMIIEI&replay=GBBtQHY_AWlXI96UAIA)；操作码 `GBBtQHY_AWlXI96UAIA`；路线来源：runs/irreversible-handoff-20261010/d/candidate-120.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/d/candidate-1223**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAAC5xAqgVyBECQAAAABBAhA)；未作玩家质量验收。 地图码 `AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAAC5xAqgVyBECQAAAABBAhA`；[runs/irreversible-handoff-20261010/d/candidate-1223.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/d/candidate-1223.json)、[runs/irreversible-handoff-20261010/d/candidate-55.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/d/candidate-55.json)。
  <details><summary>参考 31 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAAC5xAqgVyBECQAAAABBAhA&replay=CFHWl9A_AVpXDelACA)；操作码 `CFHWl9A_AVpXDelACA`；路线来源：runs/irreversible-handoff-20261010/d/candidate-1223.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/d/candidate-347**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAAC5xAqgTkC4gSAAAAAIIEEA)；未作玩家质量验收。 地图码 `AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAAC5xAqgTkC4gSAAAAAIIEEA`；[runs/irreversible-handoff-20261010/d/candidate-347.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/d/candidate-347.json)。
  <details><summary>参考 31 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAAC5xAqgTkC4gSAAAAAIIEEA&replay=CMUb76HPAWlXDeZACA)；操作码 `CMUb76HPAWlXDeZACA`；路线来源：runs/irreversible-handoff-20261010/d/candidate-347.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/e/candidate-0**：[试玩](https://ghostmaze.novic.cc/?map=AADBQUHh4eDAwAEMoCB6BFANAohSAAJAoCQRAAKAAVQKoE4gucQTnIEgJAAAYgQYAA)；未作玩家质量验收。 地图码 `AADBQUHh4eDAwAEMoCB6BFANAohSAAJAoCQRAAKAAVQKoE4gucQTnIEgJAAAYgQYAA`；[runs/irreversible-handoff-20261010/e/candidate-0.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/e/candidate-0.json)。
  <details><summary>参考 9 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBQUHh4eDAwAEMoCB6BFANAohSAAJAoCQRAAKAAVQKoE4gucQTnIEgJAAAYgQYAA&replay=GCJ282UMyAA)；操作码 `GCJ282UMyAA`；路线来源：runs/irreversible-handoff-20261010/e/candidate-0.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/e/candidate-1**：[试玩](https://ghostmaze.novic.cc/?map=AADBQUHh4eDAwAEcoCB6BFANAohSAAJAoCQRAAKAAVQKoE4gucQTnIEgJAAAYgQYAA)；未作玩家质量验收。 地图码 `AADBQUHh4eDAwAEcoCB6BFANAohSAAJAoCQRAAKAAVQKoE4gucQTnIEgJAAAYgQYAA`；[runs/irreversible-handoff-20261010/e/candidate-1.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/e/candidate-1.json)。
  <details><summary>参考 8 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBQUHh4eDAwAEcoCB6BFANAohSAAJAoCQRAAKAAVQKoE4gucQTnIEgJAAAYgQYAA&replay=AJfEAAgMyA)；操作码 `AJfEAAgMyA`；路线来源：runs/irreversible-handoff-20261010/e/candidate-1.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/e/candidate-2**：[试玩](https://ghostmaze.novic.cc/?map=AADBQUHh4eDAwAE8oCB6BFANAohSAAJAoCQRAAKAAVQKoE4gucQTnIEgJAAAYgQYAA)；未作玩家质量验收。 地图码 `AADBQUHh4eDAwAE8oCB6BFANAohSAAJAoCQRAAKAAVQKoE4gucQTnIEgJAAAYgQYAA`；[runs/irreversible-handoff-20261010/e/candidate-2.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/e/candidate-2.json)。
  <details><summary>参考 6 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBQUHh4eDAwAE8oCB6BFANAohSAAJAoCQRAAKAAVQKoE4gucQTnIEgJAAAYgQYAA&replay=ECfQ4JMMwA)；操作码 `ECfQ4JMMwA`；路线来源：runs/irreversible-handoff-20261010/e/candidate-2.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/f/candidate-0**：[试玩](https://ghostmaze.novic.cc/?map=AADBQUHh4eDAwAF8oCB6BFANAohSAAJAoCQRAAKAAVQKoE4gucQTnIEgJAAAYgQYAA)；未作玩家质量验收。 地图码 `AADBQUHh4eDAwAF8oCB6BFANAohSAAJAoCQRAAKAAVQKoE4gucQTnIEgJAAAYgQYAA`；[runs/irreversible-handoff-20261010/f/candidate-0.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/f/candidate-0.json)。
  <details><summary>参考 27 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBQUHh4eDAwAF8oCB6BFANAohSAAJAoCQRAAKAAVQKoE4gucQTnIEgJAAAYgQYAA&replay=CJyIJ-QLzGYgyXHM)；操作码 `CJyIJ-QLzGYgyXHM`；路线来源：runs/irreversible-handoff-20261010/f/candidate-0.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/f/candidate-1**：[试玩](https://ghostmaze.novic.cc/?map=AADBQUHh4eDAwAEEoCB6BFANAohSAAJAoCQRAAKAAVQKoE4gucQTnIEgJAAAYgQYAA)；未作玩家质量验收。 地图码 `AADBQUHh4eDAwAEEoCB6BFANAohSAAJAoCQRAAKAAVQKoE4gucQTnIEgJAAAYgQYAA`；[runs/irreversible-handoff-20261010/f/candidate-1.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/f/candidate-1.json)。
  <details><summary>参考 15 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBQUHh4eDAwAEEoCB6BFANAohSAAJAoCQRAAKAAVQKoE4gucQTnIEgJAAAYgQYAA&replay=CJUXCfMIfMqA)；操作码 `CJUXCfMIfMqA`；路线来源：runs/irreversible-handoff-20261010/f/candidate-1.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/g/candidate-0**：[试玩](https://ghostmaze.novic.cc/?map=AADBAUHh4eDAwAEUYCB0AdAiAGATwoAQFmBQEgiAAUAAoBVAnEFziCc5AkBIAAAQxAgwAA)；未作玩家质量验收。 地图码 `AADBAUHh4eDAwAEUYCB0AdAiAGATwoAQFmBQEgiAAUAAoBVAnEFziCc5AkBIAAAQxAgwAA`；[runs/irreversible-handoff-20261010/g/candidate-0.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/g/candidate-0.json)。
  <details><summary>参考 55 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBAUHh4eDAwAEUYCB0AdAiAGATwoAQFmBQEgiAAUAAoBVAnEFziCc5AkBIAAAQxAgwAA&replay=CFAUGkgLzGYiMlwXjCpz6gXzIA)；操作码 `CFAUGkgLzGYiMlwXjCpz6gXzIA`；路线来源：runs/irreversible-handoff-20261010/g/candidate-0.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/g/candidate-1**：[试玩](https://ghostmaze.novic.cc/?map=AADBAUHh4eDAwAEUYCB0AdAiAGATwoAQFmBXASCIABQACgFUCcQXOIJzkCQEgAABBDECDAA)；未作玩家质量验收。 地图码 `AADBAUHh4eDAwAEUYCB0AdAiAGATwoAQFmBXASCIABQACgFUCcQXOIJzkCQEgAABBDECDAA`；[runs/irreversible-handoff-20261010/g/candidate-1.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/g/candidate-1.json)。
  <details><summary>参考 59 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBAUHh4eDAwAEUYCB0AdAiAGATwoAQFmBXASCIABQACgFUCcQXOIJzkCQEgAABBDECDAA&replay=CG2s0HwLzGYiMlwXjCpz6gXcoPA)；操作码 `CG2s0HwLzGYiMlwXjCpz6gXcoPA`；路线来源：runs/irreversible-handoff-20261010/g/candidate-1.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/g/candidate-2**：[试玩](https://ghostmaze.novic.cc/?map=AADBAUHh4eDAwAEUYCB0AdAiAGATwoAQFmBXASCIABQACgFUCcQXOIJzkCQEgAABDDECDAA)；未作玩家质量验收。 地图码 `AADBAUHh4eDAwAEUYCB0AdAiAGATwoAQFmBXASCIABQACgFUCcQXOIJzkCQEgAABDDECDAA`；[runs/irreversible-handoff-20261010/g/candidate-2.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/g/candidate-2.json)。
  <details><summary>参考 55 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBAUHh4eDAwAEUYCB0AdAiAGATwoAQFmBXASCIABQACgFUCcQXOIJzkCQEgAABDDECDAA&replay=CF3cm70LzGYiMlwXjCpz6gXzIA)；操作码 `CF3cm70LzGYiMlwXjCpz6gXzIA`；路线来源：runs/irreversible-handoff-20261010/g/candidate-2.json.result.solution.actions。

  </details>
- **runs/irreversible-handoff-20261010/g/candidate-3**：[试玩](https://ghostmaze.novic.cc/?map=AADBAUHh4eDAwAEUYCB0AdAiAGATwoAQFmBXASCIABQACgFUCcQXOIJzkCQEgAABEDECDAA)；未作玩家质量验收。 地图码 `AADBAUHh4eDAwAEUYCB0AdAiAGATwoAQFmBXASCIABQACgFUCcQXOIJzkCQEgAABEDECDAA`；[runs/irreversible-handoff-20261010/g/candidate-3.json.map](../../ghost-maze-ai/runs/irreversible-handoff-20261010/g/candidate-3.json)。
  尚无完整可验证的通关路线。
- **runs/local-queue-reordering-20261012/key-return-0-0**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAuAOBAFQAABOIFaBEEUE1AiAAAAAEA)；未作玩家质量验收。 地图码 `AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAuAOBAFQAABOIFaBEEUE1AiAAAAAEA`；[runs/local-queue-reordering-20261012/key-return-0-0.json.map](../../ghost-maze-ai/runs/local-queue-reordering-20261012/key-return-0-0.json)。
  <details><summary>参考 19 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAuAOBAFQAABOIFaBEEUE1AiAAAAAEA&replay=CBIMC0wxocMyqA)；操作码 `CBIMC0wxocMyqA`；路线来源：runs/local-queue-reordering-20261012/key-return-0-0.json.result.solution.actions。

  </details>
- **runs/local-queue-reordering-20261012/key-return-0-2**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAuAOBAFQAABOIFaBNBFBNQIgAAAABA)；未作玩家质量验收。 地图码 `AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAuAOBAFQAABOIFaBNBFBNQIgAAAABA`；[runs/local-queue-reordering-20261012/key-return-0-2.json.map](../../ghost-maze-ai/runs/local-queue-reordering-20261012/key-return-0-2.json)。
  <details><summary>参考 19 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAuAOBAFQAABOIFaBNBFBNQIgAAAABA&replay=CNWvuF0xocMyqA)；操作码 `CNWvuF0xocMyqA`；路线来源：runs/local-queue-reordering-20261012/key-return-0-2.json.result.solution.actions。

  </details>
- **runs/local-queue-reordering-20261012/key-return-1-0**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAuAOBAFQAABOIFaBEEUE1AiAAAgAEA)；未作玩家质量验收。 地图码 `AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAuAOBAFQAABOIFaBEEUE1AiAAAgAEA`；[runs/local-queue-reordering-20261012/key-return-1-0.json.map](../../ghost-maze-ai/runs/local-queue-reordering-20261012/key-return-1-0.json)。
  <details><summary>参考 19 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAuAOBAFQAABOIFaBEEUE1AiAAAgAEA&replay=CGKWhowxocMyqA)；操作码 `CGKWhowxocMyqA`；路线来源：runs/local-queue-reordering-20261012/key-return-1-0.json.result.solution.actions。

  </details>
- **runs/local-queue-reordering-20261012/key-return-1-2**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAuAOBAFQAABOIFaBNBFBNQIgAAIABA)；未作玩家质量验收。 地图码 `AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAuAOBAFQAABOIFaBNBFBNQIgAAIABA`；[runs/local-queue-reordering-20261012/key-return-1-2.json.map](../../ghost-maze-ai/runs/local-queue-reordering-20261012/key-return-1-2.json)。
  <details><summary>参考 19 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAuAOBAFQAABOIFaBNBFBNQIgAAIABA&replay=CNKmEIExocMyqA)；操作码 `CNKmEIExocMyqA`；路线来源：runs/local-queue-reordering-20261012/key-return-1-2.json.result.solution.actions。

  </details>
- **runs/local-queue-reordering-20261012/key-return-2-0**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAuAOBAFQAABOIFaBEEUE1AiAABAAEA)；未作玩家质量验收。 地图码 `AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAuAOBAFQAABOIFaBEEUE1AiAABAAEA`；[runs/local-queue-reordering-20261012/key-return-2-0.json.map](../../ghost-maze-ai/runs/local-queue-reordering-20261012/key-return-2-0.json)。
  尚无完整可验证的通关路线。
- **runs/local-queue-reordering-20261012/key-return-2-2**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAuAOBAFQAABOIFaBNBFBNQIgAAQABA)；未作玩家质量验收。 地图码 `AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAuAOBAFQAABOIFaBNBFBNQIgAAQABA`；[runs/local-queue-reordering-20261012/key-return-2-2.json.map](../../ghost-maze-ai/runs/local-queue-reordering-20261012/key-return-2-2.json)。
  <details><summary>参考 35 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAuAOBAFQAABOIFaBNBFBNQIgAAQABA&replay=CNu86eUxcAKXNVohwCg)；操作码 `CNu86eUxcAKXNVohwCg`；路线来源：runs/local-queue-reordering-20261012/key-return-2-2.json.result.solution.actions。

  </details>
- **runs/position-relations-20261010/e/candidate-1062**：[试玩](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2ICKUBAGBoAQAuwLhVASDkyCuAuAcAQFUABECcoJygucQTnIIQQgAAAECGAAGIEGG)；未作玩家质量验收。 地图码 `AADBweHh4eHh4AE2ICKUBAGBoAQAuwLhVASDkyCuAuAcAQFUABECcoJygucQTnIIQQgAAAECGAAGIEGG`；[runs/position-relations-20261010/e/candidate-1062.json.map](../../ghost-maze-ai/runs/position-relations-20261010/e/candidate-1062.json)。
  <details><summary>参考 66 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2ICKUBAGBoAQAuwLhVASDkyCuAuAcAQFUABECcoJygucQTnIIQQgAAAECGAAGIEGG&replay=EGBIucX4IiV_AqnIM6XciAOXJV_AAA)；操作码 `EGBIucX4IiV_AqnIM6XciAOXJV_AAA`；路线来源：runs/position-relations-20261010/e/candidate-1062.json.result.solution.actions。

  </details>
- **runs/position-relations-20261010/e/candidate-327**：[试玩](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2ICKUBAGBoAQAuwLhVAcQcmQVwFwA4ABVAARAnKCcoLnEE5yCEEIAAEABAhhABiBBhg)；未作玩家质量验收。 地图码 `AADBweHh4eHh4AE2ICKUBAGBoAQAuwLhVAcQcmQVwFwA4ABVAARAnKCcoLnEE5yCEEIAAEABAhhABiBBhg`；[runs/position-relations-20261010/e/candidate-327.json.map](../../ghost-maze-ai/runs/position-relations-20261010/e/candidate-327.json)。
  <details><summary>参考 62 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2ICKUBAGBoAQAuwLhVAcQcmQVwFwA4ABVAARAnKCcoLnEE5yCEEIAAEABAhhABiBBhg&replay=ED7FRMgCJ18CqcgzpdyIA2cl18AA)；操作码 `ED7FRMgCJ18CqcgzpdyIA2cl18AA`；路线来源：runs/position-relations-20261010/e/candidate-327.json.result.solution.actions。

  </details>
- **runs/position-relations-20261010/e/candidate-344**：[试玩](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2ICKUBAGBoAQAuwLhVAcQcmQVwFwDjgAFUABECcoJygucQTlBCCEAACEAgQwAgAxAgw)；未作玩家质量验收。 地图码 `AADBweHh4eHh4AE2ICKUBAGBoAQAuwLhVAcQcmQVwFwDjgAFUABECcoJygucQTlBCCEAACEAgQwAgAxAgw`；[runs/position-relations-20261010/e/candidate-344.json.map](../../ghost-maze-ai/runs/position-relations-20261010/e/candidate-344.json)。
  <details><summary>参考 80 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2ICKUBAGBoAQAuwLhVAcQcmQVwFwDjgAFUABECcoJygucQTlBCCEAACEAgQwAgAxAgw&replay=ADqw67wyIl94wqnIM6VyDwp9pdyIMld8AA)；操作码 `ADqw67wyIl94wqnIM6VyDwp9pdyIMld8AA`；路线来源：runs/position-relations-20261010/e/candidate-344.json.result.solution.actions。

  </details>
- **runs/position-relations-20261010/f/candidate-1907**：[试玩](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2ICKUBBKBoAQAuwrhVASDkyCuAuAccAAqgAIgSoJygucQVxBCCEAAAAgQwAgxAgw)；未作玩家质量验收。 地图码 `AADBweHh4eHh4AE2ICKUBBKBoAQAuwrhVASDkyCuAuAccAAqgAIgSoJygucQVxBCCEAAAAgQwAgxAgw`；[runs/position-relations-20261010/f/candidate-1907.json.map](../../ghost-maze-ai/runs/position-relations-20261010/f/candidate-1907.json)。
  <details><summary>参考 68 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2ICKUBBKBoAQAuwrhVASDkyCuAuAccAAqgAIgSoJygucQVxBCCEAAAAgQwAgxAgw&replay=ANSBPvcgMmXBfAqlwYAFV8hgMld8AA)；操作码 `ANSBPvcgMmXBfAqlwYAFV8hgMld8AA`；路线来源：runs/position-relations-20261010/f/candidate-1907.json.result.solution.actions。

  </details>
- **runs/position-relations-20261010/f/candidate-393**：[试玩](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2ICKUBBKBoAQAuwLhVASDkyHK4C4BxwACqAAiBKgnEFziCcoIQQgAAgEGCGAEIIEG)；未作玩家质量验收。 地图码 `AADBweHh4eHh4AE2ICKUBBKBoAQAuwLhVASDkyHK4C4BxwACqAAiBKgnEFziCcoIQQgAAgEGCGAEIIEG`；[runs/position-relations-20261010/f/candidate-393.json.map](../../ghost-maze-ai/runs/position-relations-20261010/f/candidate-393.json)。
  <details><summary>参考 75 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2ICKUBBKBoAQAuwLhVASDkyHK4C4BxwACqAAiBKgnEFziCcoIQQgAAgEGCGAEIIEG&replay=CEiACxUyIl94wqnMy3mgyXJ_agzMgr1w)；操作码 `CEiACxUyIl94wqnMy3mgyXJ_agzMgr1w`；路线来源：runs/position-relations-20261010/f/candidate-393.json.result.solution.actions。

  </details>
- **runs/position-relations-20261010/g/candidate-2083**：[试玩](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2IEKQICGUDQAgBdgXCqA4gpkFzgLgHHAAKoACIEqCKC5xBc5yCEEIAAEBBghgBCBBBBg)；未作玩家质量验收。 地图码 `AADBweHh4eHh4AE2IEKQICGUDQAgBdgXCqA4gpkFzgLgHHAAKoACIEqCKC5xBc5yCEEIAAEBBghgBCBBBBg`；[runs/position-relations-20261010/g/candidate-2083.json.map](../../ghost-maze-ai/runs/position-relations-20261010/g/candidate-2083.json)。
  <details><summary>参考 105 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2IEKQICGUDQAgBdgXCqA4gpkFzgLgHHAAKoACIEqCKC5xBc5yCEEIAAEBBghgBCBBBBg&replay=GNCCfDkgMmXDXjCqcXIIPBaVyDwmPWl3IYDJXegD3AA)；操作码 `GNCCfDkgMmXDXjCqcXIIPBaVyDwmPWl3IYDJXegD3AA`；路线来源：runs/position-relations-20261010/g/candidate-2083.json.result.solution.actions。

  </details>
- **runs/position-relations-20261010/g/candidate-209**：[试玩](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2IEKQICGUDQAgBdgXCqAkFMgrgLgHHAOAqgAIgTlBOILnEE5yCEEIAABAhgBBABiBBBg)；未作玩家质量验收。 地图码 `AADBweHh4eHh4AE2IEKQICGUDQAgBdgXCqAkFMgrgLgHHAOAqgAIgTlBOILnEE5yCEEIAABAhgBBABiBBBg`；[runs/position-relations-20261010/g/candidate-209.json.map](../../ghost-maze-ai/runs/position-relations-20261010/g/candidate-209.json)。
  <details><summary>参考 72 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2IEKQICGUDQAgBdgXCqAkFMgrgLgHHAOAqgAIgTlBOILnEE5yCEEIAABAhgBBABiBBBg&replay=AHEHuCMgnNeMKpyD92YIMl94iDMGj1w)；操作码 `AHEHuCMgnNeMKpyD92YIMl94iDMGj1w`；路线来源：runs/position-relations-20261010/g/candidate-209.json.result.solution.actions。

  </details>
- **runs/position-relations-20261010/g/candidate-2388**：[试玩](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2IEKQICGUDQAgBdgXCqAkFMhyuAuAccAAqgAIgTlBOILnEEUEIIQAACFBDACFDECA)；未作玩家质量验收。 地图码 `AADBweHh4eHh4AE2IEKQICGUDQAgBdgXCqAkFMhyuAuAccAAqgAIgTlBOILnEEUEIIQAACFBDACFDECA`；[runs/position-relations-20261010/g/candidate-2388.json.map](../../ghost-maze-ai/runs/position-relations-20261010/g/candidate-2388.json)。
  <details><summary>参考 69 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2IEKQICGUDQAgBdgXCqAkFMhyuAuAccAAqgAIgTlBOILnEEUEIIQAACFBDACFDECA&replay=GIKnXJAgnNeMKpzMt5iDJfeIg8Gj1wA)；操作码 `GIKnXJAgnNeMKpzMt5iDJfeIg8Gj1wA`；路线来源：runs/position-relations-20261010/g/candidate-2388.json.result.solution.actions。

  </details>
- **runs/position-relations-20261010/g/candidate-2879**：[试玩](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2IEKQICGUDQAgBdgXCqAkFMgrgLgHHAAKoACIEUE4gucQSQQghAAAIEMAEMQI)；未作玩家质量验收。 地图码 `AADBweHh4eHh4AE2IEKQICGUDQAgBdgXCqAkFMgrgLgHHAAKoACIEUE4gucQSQQghAAAIEMAEMQI`；[runs/position-relations-20261010/g/candidate-2879.json.map](../../ghost-maze-ai/runs/position-relations-20261010/g/candidate-2879.json)。
  <details><summary>参考 75 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2IEKQICGUDQAgBdgXCqAkFMgrgLgHHAAKoACIEUE4gucQSQQghAAAIEMAEMQI&replay=CBc93vYjIl94MqnIP3ZggyXJ_qA8Gj1w)；操作码 `CBc93vYjIl94MqnIP3ZggyXJ_qA8Gj1w`；路线来源：runs/position-relations-20261010/g/candidate-2879.json.result.solution.actions。

  </details>
- **runs/position-relations-20261010/g/candidate-897**：[试玩](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2IEKQICGUDQAgBdgXCqA4gpkFcBcA44DgFUABECcoJxBc4gucoIQQgAAIECGAEGAGIEKG)；未作玩家质量验收。 地图码 `AADBweHh4eHh4AE2IEKQICGUDQAgBdgXCqA4gpkFcBcA44DgFUABECcoJxBc4gucoIQQgAAIECGAEGAGIEKG`；[runs/position-relations-20261010/g/candidate-897.json.map](../../ghost-maze-ai/runs/position-relations-20261010/g/candidate-897.json)。
  <details><summary>参考 74 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2IEKQICGUDQAgBdgXCqA4gpkFcBcA44DgFUABECcoJxBc4gucoIQQgAAIECGAEGAGIEKG&replay=EE1i9SUyIl94wqnMy3mIMlf6jIMwaPXA)；操作码 `EE1i9SUyIl94wqnMy3mIMlf6jIMwaPXA`；路线来源：runs/position-relations-20261010/g/candidate-897.json.result.solution.actions。

  </details>
- **runs/position-relations-20261010/h/candidate-4418**：[试玩](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2IEKQICGUDQAgBdhXCqA4g5MgrgIBxAAVQAEQJygnEFziCc5BCCEAABFAgQAAxAgwAA)；未作玩家质量验收。 地图码 `AADBweHh4eHh4AE2IEKQICGUDQAgBdhXCqA4g5MgrgIBxAAVQAEQJygnEFziCc5BCCEAABFAgQAAxAgwAA`；[runs/position-relations-20261010/h/candidate-4418.json.map](../../ghost-maze-ai/runs/position-relations-20261010/h/candidate-4418.json)。
  <details><summary>参考 58 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2IEKQICGUDQAgBdhXCqA4g5MgrgIBxAAVQAEQJygnEFziCc5BCCEAABFAgQAAxAgwAA&replay=EKpMWm-B8iJd8gqMlxw2iDIHNcA)；操作码 `EKpMWm-B8iJd8gqMlxw2iDIHNcA`；路线来源：runs/position-relations-20261010/h/candidate-4418.json.result.solution.actions。

  </details>
- **runs/position-relations-20261010/k-relations**：[试玩](https://ghostmaze.novic.cc/?map=AADBweHh4eHh4AE2IEKQICGUCQAgBXCqA4g5MgrgJA4gAKoACIE5QTiC5xBOcghBCAAAigQIAAYgQYA)；未作玩家质量验收。 地图码 `AADBweHh4eHh4AE2IEKQICGUCQAgBXCqA4g5MgrgJA4gAKoACIE5QTiC5xBOcghBCAAAigQIAAYgQYA`；[runs/position-relations-20261010/k-relations.json.map](../../ghost-maze-ai/runs/position-relations-20261010/k-relations.json)。
  尚无完整可验证的通关路线。
- **runs/position-relations-20261010/l-minimized**：[试玩](https://ghostmaze.novic.cc/?map=AADBwWHh4eHAwAEtYEKIICGMCOAeBVCqAkCZAgJAIIAoABECqgnEFyQTnIIgJAAAEGIGAA)；未作玩家质量验收。 地图码 `AADBwWHh4eHAwAEtYEKIICGMCOAeBVCqAkCZAgJAIIAoABECqgnEFyQTnIIgJAAAEGIGAA`；[runs/position-relations-20261010/l-minimized.json.map](../../ghost-maze-ai/runs/position-relations-20261010/l-minimized.json)。
  <details><summary>参考 79 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADBwWHh4eHAwAEtYEKIICGMCOAeBVCqAkCZAgJAIIAoABECqgnEFyQTnIIgJAAAEGIGAA&replay=CPloLR4LzGYiMZwXgg2nPqBdyIAVXIA9cA)；操作码 `CPloLR4LzGYiMZwXgg2nPqBdyIAVXIA9cA`；路线来源：runs/position-relations-20261010/l-minimized.json.evaluation.baseline.solution.actions。

  </details>
- **runs/prepared-release-review-20261012/remove-left-A**：[试玩](https://ghostmaze.novic.cc/?map=AADAADw8_PgAAAEwIDF0AdABAAAVQMWinOAEVUAAAAAAQgqoiIuMoAAAAACCAAg)；未作玩家质量验收。 地图码 `AADAADw8_PgAAAEwIDF0AdABAAAVQMWinOAEVUAAAAAAQgqoiIuMoAAAAACCAAg`；[runs/prepared-release-review-20261012/remove-left-A.json.map](../../ghost-maze-ai/runs/prepared-release-review-20261012/remove-left-A.json)。
  <details><summary>参考 33 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAADw8_PgAAAEwIDF0AdABAAAVQMWinOAEVUAAAAAAQgqoiIuMoAAAAACCAAg&replay=GJrxjp3TKVKfzwilfAA)；操作码 `GJrxjp3TKVKfzwilfAA`；路线来源：runs/prepared-release-review-20261012/remove-left-A.json.reference.solution.actions。

  </details>
- **runs/prepared-release-review-20261012/remove-right-A**：[试玩](https://ghostmaze.novic.cc/?map=AADAADw8_PgAAAEwIDF0AdAAAAAVQMWinOAEVUAAAAAAQgqoiIuMoAAAAACCAAg)；未作玩家质量验收。 地图码 `AADAADw8_PgAAAEwIDF0AdAAAAAVQMWinOAEVUAAAAAAQgqoiIuMoAAAAACCAAg`；[runs/prepared-release-review-20261012/remove-right-A.json.map](../../ghost-maze-ai/runs/prepared-release-review-20261012/remove-right-A.json)。
  <details><summary>参考 31 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAADw8_PgAAAEwIDF0AdAAAAAVQMWinOAEVUAAAAAAQgqoiIuMoAAAAACCAAg&replay=CKaRbZXSFSn88KhXwA)；操作码 `CKaRbZXSFSn88KhXwA`；路线来源：runs/prepared-release-review-20261012/remove-right-A.json.reference.solution.actions。

  </details>
- **runs/queued-ghost-exchange-20261012/diagnostics/remove-initialGhosts-0**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4AaAmWAFVCkCAUAcCAKgAACcQK0CaCKCagRAAAAI)；未作玩家质量验收。 地图码 `AADIAPg4OHh4OAEE4AaAmWAFVCkCAUAcCAKgAACcQK0CaCKCagRAAAAI`；[runs/queued-ghost-exchange-20261012/diagnostics/remove-initialGhosts-0.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/diagnostics/remove-initialGhosts-0.json)。
  <details><summary>参考 17 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4AaAmWAFVCkCAUAcCAKgAACcQK0CaCKCagRAAAAI&replay=GANQfVcL5wMqgA)；操作码 `GANQfVcL5wMqgA`；路线来源：runs/queued-ghost-exchange-20261012/diagnostics/remove-initialGhosts-0.json.result.solution.actions。

  </details>
- **runs/queued-ghost-exchange-20261012/diagnostics/remove-initialGhosts-1**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4AuAmWAFVCkCAUAcCAKgAACcQK0CaCKCagRAAAAI)；未作玩家质量验收。 地图码 `AADIAPg4OHh4OAEE4AuAmWAFVCkCAUAcCAKgAACcQK0CaCKCagRAAAAI`；[runs/queued-ghost-exchange-20261012/diagnostics/remove-initialGhosts-1.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/diagnostics/remove-initialGhosts-1.json)。
  <details><summary>参考 19 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4AuAmWAFVCkCAUAcCAKgAACcQK0CaCKCagRAAAAI&replay=CPbFDH4xYjwyqA)；操作码 `CPbFDH4xYjwyqA`；路线来源：runs/queued-ghost-exchange-20261012/diagnostics/remove-initialGhosts-1.json.result.solution.actions。

  </details>
- **runs/queued-ghost-exchange-20261012/diagnostics/remove-items-0**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0AWAFVCkCAUAcCAKgAACcQK0CaCKCagRAAAAI)；未作玩家质量验收。 地图码 `AADIAPg4OHh4OAEE4Cs0AWAFVCkCAUAcCAKgAACcQK0CaCKCagRAAAAI`；[runs/queued-ghost-exchange-20261012/diagnostics/remove-items-0.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/diagnostics/remove-items-0.json)。
  尚无完整可验证的通关路线。
- **runs/queued-ghost-exchange-20261012/diagnostics/remove-items-1**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0AMAFVCkCAUAcCAKgAACcQK0CaCKCagRAAAAI)；未作玩家质量验收。 地图码 `AADIAPg4OHh4OAEE4Cs0AMAFVCkCAUAcCAKgAACcQK0CaCKCagRAAAAI`；[runs/queued-ghost-exchange-20261012/diagnostics/remove-items-1.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/diagnostics/remove-items-1.json)。
  尚无完整可验证的通关路线。
- **runs/queued-ghost-exchange-20261012/diagnostics/wall-00**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAoAAgCoAAAnECtAmgigmoEQAAI)；未作玩家质量验收。 地图码 `AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAoAAgCoAAAnECtAmgigmoEQAAI`；[runs/queued-ghost-exchange-20261012/diagnostics/wall-00.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/diagnostics/wall-00.json)。
  <details><summary>参考 25 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAoAAgCoAAAnECtAmgigmoEQAAI&replay=GP0ztTvHAJViPIKA)；操作码 `GP0ztTvHAJViPIKA`；路线来源：runs/queued-ghost-exchange-20261012/diagnostics/wall-00.json.result.solution.actions。

  </details>
- **runs/queued-ghost-exchange-20261012/diagnostics/wall-01**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPg4OHh4OAEE4Cs0BMsAKqFIEAoAgQBUAAATJArECYgigmKBEAAC)；未作玩家质量验收。 地图码 `AADAAPg4OHh4OAEE4Cs0BMsAKqFIEAoAgQBUAAATJArECYgigmKBEAAC`；[runs/queued-ghost-exchange-20261012/diagnostics/wall-01.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/diagnostics/wall-01.json)。
  尚无完整可验证的通关路线。
- **runs/queued-ghost-exchange-20261012/diagnostics/wall-02**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAoAwIAqAAAJxArQJoIoJqBEAACA)；未作玩家质量验收。 地图码 `AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAoAwIAqAAAJxArQJoIoJqBEAACA`；[runs/queued-ghost-exchange-20261012/diagnostics/wall-02.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/diagnostics/wall-02.json)。
  尚无完整可验证的通关路线。
- **runs/queued-ghost-exchange-20261012/diagnostics/wall-03**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAoA4EAVAAAEECtAmgigmoEQAAA)；未作玩家质量验收。 地图码 `AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAoA4EAVAAAEECtAmgigmoEQAAA`；[runs/queued-ghost-exchange-20261012/diagnostics/wall-03.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/diagnostics/wall-03.json)。
  <details><summary>参考 11 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAoA4EAVAAAEECtAmgigmoEQAAA&replay=CBPfxXTwAqg)；操作码 `CBPfxXTwAqg`；路线来源：runs/queued-ghost-exchange-20261012/diagnostics/wall-03.json.result.solution.actions。

  </details>
- **runs/queued-ghost-exchange-20261012/diagnostics/wall-04**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPg4OHh4OAEE4Cs0BMsAKqFIEAoAyCAKgAACRArECYgigmKBEAAA)；未作玩家质量验收。 地图码 `AADAAPg4OHh4OAEE4Cs0BMsAKqFIEAoAyCAKgAACRArECYgigmKBEAAA`；[runs/queued-ghost-exchange-20261012/diagnostics/wall-04.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/diagnostics/wall-04.json)。
  尚无完整可验证的通关路线。
- **runs/queued-ghost-exchange-20261012/diagnostics/wall-05**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAoA4EAVAAAExArQJoIoJqBEAAAA)；未作玩家质量验收。 地图码 `AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAoA4EAVAAAExArQJoIoJqBEAAAA`；[runs/queued-ghost-exchange-20261012/diagnostics/wall-05.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/diagnostics/wall-05.json)。
  <details><summary>参考 11 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0BMsAKqFIEAoA4EAVAAAExArQJoIoJqBEAAAA&replay=CAITDVXwAqg)；操作码 `CAITDVXwAqg`；路线来源：runs/queued-ghost-exchange-20261012/diagnostics/wall-05.json.result.solution.actions。

  </details>
- **runs/queued-ghost-exchange-20261012/diagnostics/wall-06**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPg4OHh4OAEE4Cs0BMsAKqFIEAoAyCAKgAACZIFIExBFBMUCIAAABA)；未作玩家质量验收。 地图码 `AADAAPg4OHh4OAEE4Cs0BMsAKqFIEAoAyCAKgAACZIFIExBFBMUCIAAABA`；[runs/queued-ghost-exchange-20261012/diagnostics/wall-06.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/diagnostics/wall-06.json)。
  <details><summary>参考 57 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPg4OHh4OAEE4Cs0BMsAKqFIEAoAyCAKgAACZIFIExBFBMUCIAAABA&replay=GNgtt8IxcAKX1bAClzVaI9cAKoA)；操作码 `GNgtt8IxcAKX1bAClzVaI9cAKoA`；路线来源：runs/queued-ghost-exchange-20261012/diagnostics/wall-06.json.result.solution.actions。

  </details>
- **runs/queued-ghost-exchange-20261012/diagnostics/wall-07**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPg4OHh4OAEE4Cs0BMsAKqFIEAoAyCAKgAACZIFUCYgigmKBEAAAAg)；未作玩家质量验收。 地图码 `AADAAPg4OHh4OAEE4Cs0BMsAKqFIEAoAyCAKgAACZIFUCYgigmKBEAAAAg`；[runs/queued-ghost-exchange-20261012/diagnostics/wall-07.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/diagnostics/wall-07.json)。
  尚无完整可验证的通关路线。
- **runs/queued-ghost-exchange-20261012/diagnostics/wall-08**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPg4OHh4OAEE4Cs0BMsAKqFIEAoAyCAKgAACZIFYgRBFBMUCIAAABA)；未作玩家质量验收。 地图码 `AADAAPg4OHh4OAEE4Cs0BMsAKqFIEAoAyCAKgAACZIFYgRBFBMUCIAAABA`；[runs/queued-ghost-exchange-20261012/diagnostics/wall-08.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/diagnostics/wall-08.json)。
  尚无完整可验证的通关路线。
- **runs/queued-ghost-exchange-20261012/diagnostics/wall-09**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPg4OHh4OAEE4Cs0BMsAKqFIEAoAyCAKgAACZIFYgSgigmKBEAAAAg)；未作玩家质量验收。 地图码 `AADAAPg4OHh4OAEE4Cs0BMsAKqFIEAoAyCAKgAACZIFYgSgigmKBEAAAAg`；[runs/queued-ghost-exchange-20261012/diagnostics/wall-09.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/diagnostics/wall-09.json)。
  尚无完整可验证的通关路线。
- **runs/queued-ghost-exchange-20261012/diagnostics/wall-10**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPg4OHh4OAEE4Cs0BMsAKqFIEAoAyCAKgAACZIFYgTEEUEUCIAAABA)；未作玩家质量验收。 地图码 `AADAAPg4OHh4OAEE4Cs0BMsAKqFIEAoAyCAKgAACZIFYgTEEUEUCIAAABA`；[runs/queued-ghost-exchange-20261012/diagnostics/wall-10.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/diagnostics/wall-10.json)。
  <details><summary>参考 57 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPg4OHh4OAEE4Cs0BMsAKqFIEAoAyCAKgAACZIFYgTEEUEUCIAAABA&replay=GAoSpjIxcAKX1bAClzVYo9cAKoA)；操作码 `GAoSpjIxcAKX1bAClzVYo9cAKoA`；路线来源：runs/queued-ghost-exchange-20261012/diagnostics/wall-10.json.result.solution.actions。

  </details>
- **runs/queued-ghost-exchange-20261012/diagnostics/wall-11**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPg4OHh4OAEE4Cs0BMsAKqFIEAoAyCAKgAACZIFYgTEEUEqBEAAAAg)；未作玩家质量验收。 地图码 `AADAAPg4OHh4OAEE4Cs0BMsAKqFIEAoAyCAKgAACZIFYgTEEUEqBEAAAAg`；[runs/queued-ghost-exchange-20261012/diagnostics/wall-11.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/diagnostics/wall-11.json)。
  <details><summary>参考 57 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPg4OHh4OAEE4Cs0BMsAKqFIEAoAyCAKgAACZIFYgTEEUEqBEAAAAg&replay=GBRKgzHBcAKX1bAClzVaId8AKoA)；操作码 `GBRKgzHBcAKX1bAClzVaId8AKoA`；路线来源：runs/queued-ghost-exchange-20261012/diagnostics/wall-11.json.result.solution.actions。

  </details>
- **runs/queued-ghost-exchange-20261012/entry-map**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OCEFoCs0BMsAKqFIEAoA4EAeoEAATiBWgTQRQTUCIFAAAEA)；未作玩家质量验收。 地图码 `AADIAPg4OHh4OCEFoCs0BMsAKqFIEAoA4EAeoEAATiBWgTQRQTUCIFAAAEA`；[runs/queued-ghost-exchange-20261012/entry-map.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/entry-map.json)。
  <details><summary>参考 58 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OCEFoCs0BMsAKqFIEAoA4EAeoEAATiBWgTQRQTUCIFAAAEA&replay=EIInP2AMXACl9WwApc1WiH3ACqA)；操作码 `EIInP2AMXACl9WwApc1WiH3ACqA`；路线来源：runs/queued-ghost-exchange-20261012/entry-map.json.result.solution.actions。

  </details>
- **runs/queued-ghost-exchange-20261012/research/control-cycle-audit-01**：[试玩](https://ghostmaze.novic.cc/?map=AADIAGA4eHh4eAEEoCNMBGmAyQCgABQF-oIBvz8D9wNgKoAAAXQC2gpoL9-9BbUEyAACCAAAAQAG)；未作玩家质量验收。 地图码 `AADIAGA4eHh4eAEEoCNMBGmAyQCgABQF-oIBvz8D9wNgKoAAAXQC2gpoL9-9BbUEyAACCAAAAQAG`；[runs/queued-ghost-exchange-20261012/research/control-cycle-audit-01.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/research/control-cycle-audit-01.json)。
  <details><summary>参考 34 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAGA4eHh4eAEEoCNMBGmAyQCgABQF-oIBvz8D9wNgKoAAAXQC2gpoL9-9BbUEyAACCAAAAQAG&replay=EA3hAIZMwtVpIdfAKiA)；操作码 `EA3hAIZMwtVpIdfAKiA`；路线来源：runs/queued-ghost-exchange-20261012/research/control-cycle-audit-01.json.baseline.reference.solution.actions。

  </details>
- **runs/queued-ghost-exchange-20261012/research/corner-contention-01**：[试玩](https://ghostmaze.novic.cc/?map=AADIAGA4eHh4OAEEYCNMBGmARgABQE0FfgDgMCAKgAABdANkE_IL9ILagWQAAQACBBA)；未作玩家质量验收。 地图码 `AADIAGA4eHh4OAEEYCNMBGmARgABQE0FfgDgMCAKgAABdANkE_IL9ILagWQAAQACBBA`；[runs/queued-ghost-exchange-20261012/research/corner-contention-01.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/research/corner-contention-01.json)。
  尚无完整可验证的通关路线。
- **runs/queued-ghost-exchange-20261012/research/corner-contention-02**：[试玩](https://ghostmaze.novic.cc/?map=AADIAGA4eHh4OAEEYCNMBGmARgABQF-0E_AHAYEAVAAAC6AbaCfkF-ILagWQAAAQACBB)；未作玩家质量验收。 地图码 `AADIAGA4eHh4OAEEYCNMBGmARgABQF-0E_AHAYEAVAAAC6AbaCfkF-ILagWQAAAQACBB`；[runs/queued-ghost-exchange-20261012/research/corner-contention-02.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/research/corner-contention-02.json)。
  <details><summary>参考 19 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAGA4eHh4OAEEYCNMBGmARgABQF-0E_AHAYEAVAAAC6AbaCfkF-ILagWQAAAQACBB&replay=CDq1MLIzWogziA)；操作码 `CDq1MLIzWogziA`；路线来源：runs/queued-ghost-exchange-20261012/research/corner-contention-02.json.result.solution.actions。

  </details>
- **runs/queued-ghost-exchange-20261012/research/queued-return-minimized-01**：[试玩](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0BMuATQACqhSBAKfgOBAFQAABOIFaBNBFBNQIgAAAAEA)；未作玩家质量验收。 地图码 `AADIAPg4OHh4OAEE4Cs0BMuATQACqhSBAKfgOBAFQAABOIFaBNBFBNQIgAAAAEA`；[runs/queued-ghost-exchange-20261012/research/queued-return-minimized-01.json.map](../../ghost-maze-ai/runs/queued-ghost-exchange-20261012/research/queued-return-minimized-01.json)。
  <details><summary>参考 58 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADIAPg4OHh4OAEE4Cs0BMuATQACqhSBAKfgOBAFQAABOIFaBNBFBNQIgAAAAEA&replay=EOWj4UJMXACl9WwApc1WiH3ACqA)；操作码 `EOWj4UJMXACl9WwApc1WiH3ACqA`；路线来源：runs/queued-ghost-exchange-20261012/research/queued-return-minimized-01.json.evaluation.baseline.solution.actions。

  </details>
- **runs/regular-rooms-20261010/diagnostic-2278**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wPABCBgYGHkbVi6IaDjwj4E1gKF4OgPTCgYgEO5QF_BTmMQABAKNPAYMAA)；未作玩家质量验收。 地图码 `AWM4wPABCBgYGHkbVi6IaDjwj4E1gKF4OgPTCgYgEO5QF_BTmMQABAKNPAYMAA`；[runs/regular-rooms-20261010/diagnostic-2278.json.map](../../ghost-maze-ai/runs/regular-rooms-20261010/diagnostic-2278.json)。
  <details><summary>参考 18 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wPABCBgYGHkbVi6IaDjwj4E1gKF4OgPTCgYgEO5QF_BTmMQABAKNPAYMAA&replay=EIeDSByT9_jCoA)；操作码 `EIeDSByT9_jCoA`；路线来源：runs/regular-rooms-20261010/diagnostic-2278.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/audit-buttons-0**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgmYRAABIAWEAVBc5wJwDgDgCoAAAAC5yC5zkCkCIFxAAAAGEEAGECAGCECA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgmYRAABIAWEAVBc5wJwDgDgCoAAAAC5yC5zkCkCIFxAAAAGEEAGECAGCECA`；[runs/return-to-source-20261010/audit-buttons-0.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-buttons-0.json)。
  尚无完整可验证的通关路线。
- **runs/return-to-source-20261010/audit-buttons-1**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgnIBAABIAWEAVBc5wJwDgDgCoAAAAC5yC5zkCkCIFxAAAAGEEAGECAGCECA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgnIBAABIAWEAVBc5wJwDgDgCoAAAAC5yC5zkCkCIFxAAAAGEEAGECAGCECA`；[runs/return-to-source-20261010/audit-buttons-1.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-buttons-1.json)。
  尚无完整可验证的通关路线。
- **runs/return-to-source-20261010/audit-buttons-2**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgnIMwgBIAWEAVBc5wJwDgDgCoAAAAC5yC5zkCkCIFxAAAAGEEAGECAGCECA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgnIMwgBIAWEAVBc5wJwDgDgCoAAAAC5yC5zkCkCIFxAAAAGEEAGECAGCECA`；[runs/return-to-source-20261010/audit-buttons-2.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-buttons-2.json)。
  尚无完整可验证的通关路线。
- **runs/return-to-source-20261010/audit-buttons-3**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgnIMwiAIAWEAVBc5wJwDgDgCoAAAAC5yC5zkCkCIFxAAAAGEEAGECAGCECA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgnIMwiAIAWEAVBc5wJwDgDgCoAAAAC5yC5zkCkCIFxAAAAGEEAGECAGCECA`；[runs/return-to-source-20261010/audit-buttons-3.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-buttons-3.json)。
  尚无完整可验证的通关路线。
- **runs/return-to-source-20261010/audit-buttons-4**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgnIMwiAACWEAVBc5wJwDgDgCoAAAAC5yC5zkCkCIFxAAAAGEEAGECAGCECA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgnIMwiAACWEAVBc5wJwDgDgCoAAAAC5yC5zkCkCIFxAAAAGEEAGECAGCECA`；[runs/return-to-source-20261010/audit-buttons-4.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-buttons-4.json)。
  <details><summary>参考 42 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgnIMwiAACWEAVBc5wJwDgDgCoAAAAC5yC5zkCkCIFxAAAAGEEAGECAGCECA&replay=EELd8pIv5XKdACDHXryYIA)；操作码 `EELd8pIv5XKdACDHXryYIA`；路线来源：runs/return-to-source-20261010/audit-buttons-4.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/audit-buttons-5**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgnIMwiAACQAAVBc5wJwDgDgCoAAAAC5yC5zkCkCIFxAAAAGEEAGECAGCECA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgnIMwiAACQAAVBc5wJwDgDgCoAAAAC5yC5zkCkCIFxAAAAGEEAGECAGCECA`；[runs/return-to-source-20261010/audit-buttons-5.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-buttons-5.json)。
  <details><summary>参考 42 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgnIMwiAACQAAVBc5wJwDgDgCoAAAAC5yC5zkCkCIFxAAAAGEEAGECAGCECA&replay=EM-ghqMv5XKdACDHXryYIA)；操作码 `EM-ghqMv5XKdACDHXryYIA`；路线来源：runs/return-to-source-20261010/audit-buttons-5.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/audit-h-1-2-0**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqCc4E4BwBwBUAAAABc5Bc5yBSBEC4gAAACCADCBADBCBA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqCc4E4BwBwBUAAAABc5Bc5yBSBEC4gAAACCADCBADBCBA`；[runs/return-to-source-20261010/audit-h-1-2-0.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-h-1-2-0.json)。
  <details><summary>参考 33 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqCc4E4BwBwBUAAAABc5Bc5yBSBEC4gAAACCADCBADBCBA&replay=GJpjcoYv5XKdAC3MiYA)；操作码 `GJpjcoYv5XKdAC3MiYA`；路线来源：runs/return-to-source-20261010/audit-h-1-2-0.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/audit-h-1-2-1**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqCucCcA4A4AqAAAAAucguc5ApAiBcQAAABBABhAgBghAg)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqCucCcA4A4AqAAAAAucguc5ApAiBcQAAABBABhAgBghAg`；[runs/return-to-source-20261010/audit-h-1-2-1.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-h-1-2-1.json)。
  <details><summary>参考 9 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqCucCcA4A4AqAAAAAucguc5ApAiBcQAAABBABhAgBghAg&replay=GKNgrlVcoIA)；操作码 `GKNgrlVcoIA`；路线来源：runs/return-to-source-20261010/audit-h-1-2-1.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/audit-h-1-4-0**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgABwBUAAAABc5Bc5yBSBEC4gAAADCCACBADBCBA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgABwBUAAAABc5Bc5yBSBEC4gAAADCCACBADBCBA`；[runs/return-to-source-20261010/audit-h-1-4-0.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-h-1-4-0.json)。
  <details><summary>参考 43 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgABwBUAAAABc5Bc5yBSBEC4gAAADCCACBADBCBA&replay=CKmpcnI-VynT6_CCDMTImA)；操作码 `CKmpcnI-VynT6_CCDMTImA`；路线来源：runs/return-to-source-20261010/audit-h-1-4-0.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/audit-h-1-4-1**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgEA4AqAAAAAucguc5ApAiBcQAAABhBABAgBghAg)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgEA4AqAAAAAucguc5ApAiBcQAAABhBABAgBghAg`；[runs/return-to-source-20261010/audit-h-1-4-1.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-h-1-4-1.json)。
  尚无完整可验证的通关路线。
- **runs/return-to-source-20261010/audit-h-1-5-0**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAABUAAAABc5Bc5yBSBEC4gAAADCCADBADBCBA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAABUAAAABc5Bc5yBSBEC4gAAADCCADBADBCBA`；[runs/return-to-source-20261010/audit-h-1-5-0.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-h-1-5-0.json)。
  <details><summary>参考 55 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAABUAAAABc5Bc5yBSBEC4gAAADCCADBADBCBA&replay=CBzK8e0v5XKdACDHUIxZnTAiGA)；操作码 `CBzK8e0v5XKdACDHUIxZnTAiGA`；路线来源：runs/return-to-source-20261010/audit-h-1-5-0.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/audit-h-1-5-1**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAEAqAAAAAucguc5ApAiBcQAAABhBABggBghAg)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAEAqAAAAAucguc5ApAiBcQAAABhBABggBghAg`；[runs/return-to-source-20261010/audit-h-1-5-1.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-h-1-5-1.json)。
  尚无完整可验证的通关路线。
- **runs/return-to-source-20261010/audit-h-2-2-0**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC44E4BwBwBUAAAABc5Bc5yBSBEC4gAAADCADCBADBCBA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC44E4BwBwBUAAAABc5Bc5yBSBEC4gAAADCADCBADBCBA`；[runs/return-to-source-20261010/audit-h-2-2-0.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-h-2-2-0.json)。
  <details><summary>参考 23 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC44E4BwBwBUAAAABc5Bc5yBSBEC4gAAADCADCBADBCBA&replay=CPjGd5Mv5XAMi2g)；操作码 `CPjGd5Mv5XAMi2g`；路线来源：runs/return-to-source-20261010/audit-h-2-2-0.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/audit-h-2-2-1**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5cCcA4A4AqAAAAAucguc5ApAiBcQAAABhABhAgBghAg)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5cCcA4A4AqAAAAAucguc5ApAiBcQAAABhABhAgBghAg`；[runs/return-to-source-20261010/audit-h-2-2-1.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-h-2-2-1.json)。
  <details><summary>参考 39 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5cCcA4A4AqAAAAAucguc5ApAiBcQAAABhABhAgBghAg&replay=CP_asH8v5XKdAyIMxMiY)；操作码 `CP_asH8v5XKdAyIMxMiY`；路线来源：runs/return-to-source-20261010/audit-h-2-2-1.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/audit-h-2-3-0**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgQBwBwBUAAAABc5Bc5yBSBEC4gAAADCCDCBADBCBA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgQBwBwBUAAAABc5Bc5yBSBEC4gAAADCCDCBADBCBA`；[runs/return-to-source-20261010/audit-h-2-3-0.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-h-2-3-0.json)。
  <details><summary>参考 41 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgQBwBwBUAAAABc5Bc5yBSBEC4gAAADCCDCBADBCBA&replay=GDRmOgnNsp0-vwggzEyJgA)；操作码 `GDRmOgnNsp0-vwggzEyJgA`；路线来源：runs/return-to-source-20261010/audit-h-2-3-0.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/audit-h-2-3-1**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgSA4A4AqAAAAAucguc5ApAiBcQAAABhBBhAgBghAg)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgSA4A4AqAAAAAucguc5ApAiBcQAAABhBBhAgBghAg`；[runs/return-to-source-20261010/audit-h-2-3-1.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-h-2-3-1.json)。
  尚无完整可验证的通关路线。
- **runs/return-to-source-20261010/audit-h-3-2-0**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5wE4BwBwBUAAAABc5Bc5yBSBEC4gAAADCADCBADBCBA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5wE4BwBwBUAAAABc5Bc5yBSBEC4gAAADCADCBADBCBA`；[runs/return-to-source-20261010/audit-h-3-2-0.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-h-3-2-0.json)。
  <details><summary>参考 42 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5wE4BwBwBUAAAABc5Bc5yBSBEC4gAAADCADCBADBCBA&replay=EA6Qblgv5XKdACDPWbyYIA)；操作码 `EA6Qblgv5XKdACDPWbyYIA`；路线来源：runs/return-to-source-20261010/audit-h-3-2-0.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/audit-h-3-2-1**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5yCcA4A4AqAAAAAucguc5ApAiBcQAAABhABhAgBghAg)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5yCcA4A4AqAAAAAucguc5ApAiBcQAAABhABhAgBghAg`；[runs/return-to-source-20261010/audit-h-3-2-1.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-h-3-2-1.json)。
  <details><summary>参考 42 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5yCcA4A4AqAAAAAucguc5ApAiBcQAAABhABhAgBghAg&replay=EH8nFgIv5XKdACDHXryYIA)；操作码 `EH8nFgIv5XKdACDHXryYIA`；路线来源：runs/return-to-source-20261010/audit-h-3-2-1.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/audit-initialGhosts-0**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gCoLyDMIgAAkALCAKguc4E4BwBwBUAAAABc5Bc5yBSBEC4gAAADCCADCBADBCBA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gCoLyDMIgAAkALCAKguc4E4BwBwBUAAAABc5Bc5yBSBEC4gAAADCCADCBADBCBA`；[runs/return-to-source-20261010/audit-initialGhosts-0.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-initialGhosts-0.json)。
  <details><summary>参考 9 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gCoLyDMIgAAkALCAKguc4E4BwBwBUAAAABc5Bc5yBSBEC4gAAADCCADCBADBCBA&replay=GI4WB6dcoIA)；操作码 `GI4WB6dcoIA`；路线来源：runs/return-to-source-20261010/audit-initialGhosts-0.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/audit-initialGhosts-1**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gAILyDMIgAAkALCAKguc4E4BwBwBUAAAABc5Bc5yBSBEC4gAAADCCADCBADBCBA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gAILyDMIgAAkALCAKguc4E4BwBwBUAAAABc5Bc5yBSBEC4gAAADCCADCBADBCBA`；[runs/return-to-source-20261010/audit-initialGhosts-1.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-initialGhosts-1.json)。
  <details><summary>参考 25 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gAILyDMIgAAkALCAKguc4E4BwBwBUAAAABc5Bc5yBSBEC4gAAADCCADCBADBCBA&replay=GD9ykZQvwiDMTImA)；操作码 `GD9ykZQvwiDMTImA`；路线来源：runs/return-to-source-20261010/audit-initialGhosts-1.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/audit-v-1-2-0**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkE5yBSBEC4gAAADCCADCBABCBA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkE5yBSBEC4gAAADCCADCBABCBA`；[runs/return-to-source-20261010/audit-v-1-2-0.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-v-1-2-0.json)。
  <details><summary>参考 14 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkE5yBSBEC4gAAADCCADCBABCBA&replay=EMxwNWc-VwKg)；操作码 `EMxwNWc-VwKg`；路线来源：runs/return-to-source-20261010/audit-v-1-2-0.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/audit-v-1-2-1**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFc5ApAiBcQAAABhBABhAgAhAg)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFc5ApAiBcQAAABhBABhAgAhAg`；[runs/return-to-source-20261010/audit-v-1-2-1.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-v-1-2-1.json)。
  尚无完整可验证的通关路线。
- **runs/return-to-source-20261010/audit-v-2-1-0**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAE5Bc5yBSBEC4gAAADCCADCADBCBA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAE5Bc5yBSBEC4gAAADCCADCADBCBA`；[runs/return-to-source-20261010/audit-v-2-1-0.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-v-2-1-0.json)。
  <details><summary>参考 29 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAE5Bc5yBSBEC4gAAADCCADCADBCBA&replay=GBwmz-k-VynQMFeggA)；操作码 `GBwmz-k-VynQMFeggA`；路线来源：runs/return-to-source-20261010/audit-v-2-1-0.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/audit-v-2-1-1**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFcguc5ApAiBcQAAABhBABhABghAg)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFcguc5ApAiBcQAAABhBABhABghAg`；[runs/return-to-source-20261010/audit-v-2-1-1.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-v-2-1-1.json)。
  尚无完整可验证的通关路线。
- **runs/return-to-source-20261010/audit-v-2-2-0**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFxyBSBEC4gAAADCCADCBADCBA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFxyBSBEC4gAAADCCADCBADCBA`；[runs/return-to-source-20261010/audit-v-2-2-0.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-v-2-2-0.json)。
  <details><summary>参考 35 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFxyBSBEC4gAAADCCADCBADCBA&replay=CNyEmrcv5XKdACDNIhg)；操作码 `CNyEmrcv5XKdACDNIhg`；路线来源：runs/return-to-source-20261010/audit-v-2-2-0.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/audit-v-2-2-1**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFy5ApAiBcQAAABhBABhAgBhAg)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFy5ApAiBcQAAABhBABhAgBhAg`；[runs/return-to-source-20261010/audit-v-2-2-1.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-v-2-2-1.json)。
  <details><summary>参考 41 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFy5ApAiBcQAAABhBABhAgBhAg&replay=GNdKwW4v5XKdACDdes2ggA)；操作码 `GNdKwW4v5XKdACDdes2ggA`；路线来源：runs/return-to-source-20261010/audit-v-2-2-1.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/audit-v-2-5-0**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFznIFIEQIgAAADCCADCBADBCA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFznIFIEQIgAAADCCADCBADBCA`；[runs/return-to-source-20261010/audit-v-2-5-0.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-v-2-5-0.json)。
  尚无完整可验证的通关路线。
- **runs/return-to-source-20261010/audit-v-2-5-1**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFznIFIEQKQAAABhBABhAgBghA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFznIFIEQKQAAABhBABhAgBghA`；[runs/return-to-source-20261010/audit-v-2-5-1.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-v-2-5-1.json)。
  尚无完整可验证的通关路线。
- **runs/return-to-source-20261010/audit-v-3-1-0**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFxBc5yBSBEC4gAAADCCADCBDBCBA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFxBc5yBSBEC4gAAADCCADCBDBCBA`；[runs/return-to-source-20261010/audit-v-3-1-0.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-v-3-1-0.json)。
  <details><summary>参考 33 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFxBc5yBSBEC4gAAADCCADCBDBCBA&replay=GDtnLhov5XKdACD06YA)；操作码 `GDtnLhov5XKdACD06YA`；路线来源：runs/return-to-source-20261010/audit-v-3-1-0.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/audit-v-3-1-1**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFyguc5ApAiBcQAAABhBABhAhghAg)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFyguc5ApAiBcQAAABhBABhAhghAg`；[runs/return-to-source-20261010/audit-v-3-1-1.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-v-3-1-1.json)。
  <details><summary>参考 42 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFyguc5ApAiBcQAAABhBABhAhghAg&replay=EK1CwDEv5XKdACDHXryYIA)；操作码 `EK1CwDEv5XKdACDHXryYIA`；路线来源：runs/return-to-source-20261010/audit-v-3-1-1.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/audit-v-3-2-0**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFziBSBEC4gAAADCCADCBADBBA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFziBSBEC4gAAADCCADCBADBBA`；[runs/return-to-source-20261010/audit-v-3-2-0.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-v-3-2-0.json)。
  <details><summary>参考 37 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFziBSBEC4gAAADCCADCBADBBA&replay=GFp0m-Ev5XKdACDMTImA)；操作码 `GFp0m-Ev5XKdACDMTImA`；路线来源：runs/return-to-source-20261010/audit-v-3-2-0.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/audit-v-3-2-1**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFzlApAiBcQAAABhBABhAgBggg)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFzlApAiBcQAAABhBABhAgBggg`；[runs/return-to-source-20261010/audit-v-3-2-1.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/audit-v-3-2-1.json)。
  <details><summary>参考 42 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFzlApAiBcQAAABhBABhAgBggg&replay=EPzm59cv5XKdACDF3ryYIA)；操作码 `EPzm59cv5XKdACDF3ryYIA`；路线来源：runs/return-to-source-20261010/audit-v-3-2-1.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/candidate**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFznIFIEQLiAAAAMIIAMIEAMEIE)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFznIFIEQLiAAAAMIIAMIEAMEIE`；[runs/return-to-source-20261010/candidate.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/candidate.json)、[runs/return-to-source-20261010/restricted-lower_at_A_seal.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/restricted-lower_at_A_seal.json)、[runs/return-to-source-20261010/restricted-lower_seal_then_upper_returns.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/restricted-lower_seal_then_upper_returns.json)、[runs/return-to-source-20261010/restricted-upper_final_right_seal.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/restricted-upper_final_right_seal.json)、[runs/return-to-source-20261010/restricted-upper_leaves_goal_entry.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/restricted-upper_leaves_goal_entry.json)、[runs/return-to-source-20261010/restricted-upper_returns_to_goal_entry.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/restricted-upper_returns_to_goal_entry.json)、[runs/return-to-source-20261010/restricted-upper_temporary_before_B.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/restricted-upper_temporary_before_B.json)。
  <details><summary>参考 37 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFznIFIEQLiAAAAMIIAMIEAMEIE&replay=GLvx0bsv5XKdACDMTImA)；操作码 `GLvx0bsv5XKdACDMTImA`；路线来源：runs/return-to-source-20261010/candidate.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/four-stations-2411**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguc4FzgHAHAFQAAAAFzkFznIFIEQLiAAAAMMAEAMIEAMIIEA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgfIMwiAACAKguc4FzgHAHAFQAAAAFzkFznIFIEQLiAAAAMMAEAMIEAMIIEA`；[runs/return-to-source-20261010/four-stations-2411.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/four-stations-2411.json)。
  <details><summary>参考 37 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguc4FzgHAHAFQAAAAFzkFznIFIEQLiAAAAMMAEAMIEAMIIEA&replay=GAppn6Yv5XKdAyIM0iGA)；操作码 `GAppn6Yv5XKdAyIM0iGA`；路线来源：runs/return-to-source-20261010/four-stations-2411.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/four-stations-3233**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKgucBc4BwBwBUAAAABc5Bc5yBSBEC4gAAADBBADCBADCABA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgfIMwiAACAKgucBc4BwBwBUAAAABc5Bc5yBSBEC4gAAADBBADCBADCABA`；[runs/return-to-source-20261010/four-stations-3233.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/four-stations-3233.json)。
  <details><summary>参考 37 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKgucBc4BwBwBUAAAABc5Bc5yBSBEC4gAAADBBADCBADCABA&replay=GGfyRf4v5XKdAyIM0iGA)；操作码 `GGfyRf4v5XKdAyIM0iGA`；路线来源：runs/return-to-source-20261010/four-stations-3233.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/four-stations-4828**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguc4FzgHAHAFQAAAAFzkFziBSBEC4gAAADACBADCBCDCBA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgfIMwiAACAKguc4FzgHAHAFQAAAAFzkFziBSBEC4gAAADACBADCBCDCBA`；[runs/return-to-source-20261010/four-stations-4828.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/four-stations-4828.json)。
  <details><summary>参考 37 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguc4FzgHAHAFQAAAAFzkFziBSBEC4gAAADACBADCBCDCBA&replay=GOZkH9Iv5XKdACDNYCGA)；操作码 `GOZkH9Iv5XKdACDNYCGA`；路线来源：runs/return-to-source-20261010/four-stations-4828.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/four-stations-5116**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguc4FzgHAHAFQAAAAFzkFznIFIEQLiAAAAMEIEAMIEAMIIEA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgfIMwiAACAKguc4FzgHAHAFQAAAAFzkFznIFIEQLiAAAAMEIEAMIEAMIIEA`；[runs/return-to-source-20261010/four-stations-5116.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/four-stations-5116.json)。
  <details><summary>参考 37 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguc4FzgHAHAFQAAAAFzkFznIFIEQLiAAAAMEIEAMIEAMIIEA&replay=GELKt28v5XKdAyIM0iGA)；操作码 `GELKt28v5XKdAyIM0iGA`；路线来源：runs/return-to-source-20261010/four-stations-5116.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/four-stations-6122**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKgucBc4BwBwBUAAAABc5Bc4gUgRAuIAAAAwAQAwgQgwgQ)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgfIMwiAACAKgucBc4BwBwBUAAAABc5Bc4gUgRAuIAAAAwAQAwgQgwgQ`；[runs/return-to-source-20261010/four-stations-6122.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/four-stations-6122.json)。
  <details><summary>参考 37 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKgucBc4BwBwBUAAAABc5Bc4gUgRAuIAAAAwAQAwgQgwgQ&replay=GAaMdIIv5XKdACDNYCGA)；操作码 `GAaMdIIv5XKdACDNYCGA`；路线来源：runs/return-to-source-20261010/four-stations-6122.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/four-stations-6560**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKgucBc4BwBwBUAAAABc5Bc5yBSBEC4gAAADABADCBADCCBA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgfIMwiAACAKgucBc4BwBwBUAAAABc5Bc5yBSBEC4gAAADABADCBADCCBA`；[runs/return-to-source-20261010/four-stations-6560.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/four-stations-6560.json)。
  <details><summary>参考 35 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKgucBc4BwBwBUAAAABc5Bc5yBSBEC4gAAADABADCBADCCBA&replay=CK-aMFAv5XKdACDNIhg)；操作码 `CK-aMFAv5XKdACDNIhg`；路线来源：runs/return-to-source-20261010/four-stations-6560.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/four-stations-6906**：[试玩](https://ghostmaze.novic.cc/?map=AWM4wPDwwYMHDxgY7RqaFtQ0G3QwMDGs0CsQt2BnKGB1YGBgiHkibtHoIcj0iIGBwaARggA)；未作玩家质量验收。 地图码 `AWM4wPDwwYMHDxgY7RqaFtQ0G3QwMDGs0CsQt2BnKGB1YGBgiHkibtHoIcj0iIGBwaARggA`；[runs/return-to-source-20261010/four-stations-6906.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/four-stations-6906.json)。
  <details><summary>参考 35 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AWM4wPDwwYMHDxgY7RqaFtQ0G3QwMDGs0CsQt2BnKGB1YGBgiHkibtHoIcj0iIGBwaARggA&replay=CICJz8gv5XKdACDNIhg)；操作码 `CICJz8gv5XKdACDNIhg`；路线来源：runs/return-to-source-20261010/four-stations-6906.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/manual-four-stations**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguc4FzgHAHAFQAAAAFzkFznIFIEQLiAAAAMIIEAMIAEMEIEA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgfIMwiAACAKguc4FzgHAHAFQAAAAFzkFznIFIEQLiAAAAMIIEAMIAEMEIEA`；[runs/return-to-source-20261010/manual-four-stations.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/manual-four-stations.json)。
  <details><summary>参考 20 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguc4FzgHAHAFQAAAAFzkFznIFIEQLiAAAAMIIEAMIAEMEIEA&replay=AF3S-yEv5XAIhg)；操作码 `AF3S-yEv5XAIhg`；路线来源：runs/return-to-source-20261010/manual-four-stations.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/minimized**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5cC4A4A5AVAAAAAXOQXOcgUgRAuIAAAAwgQwgQAwQgQ)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5cC4A4A5AVAAAAAXOQXOcgUgRAuIAAAAwgQwgQAwQgQ`；[runs/return-to-source-20261010/minimized.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/minimized.json)。
  <details><summary>参考 45 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5cC4A4A5AVAAAAAXOQXOcgUgRAuIAAAAwgQwgQAwQgQ&replay=GAtzBkXOncAFevwCIMxMiYA)；操作码 `GAtzBkXOncAFevwCIMxMiYA`；路线来源：runs/return-to-source-20261010/minimized.json.evaluation.baseline.solution.actions。

  </details>
- **runs/return-to-source-20261010/repair-12**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgXOAcAcAVAAAAAXOQXOcgUgRAuIAAAAwggQAQgQAwQgQA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgXOAcAcAVAAAAAXOQXOcgUgRAuIAAAAwggQAQgQAwQgQA`；[runs/return-to-source-20261010/repair-12.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/repair-12.json)。
  <details><summary>参考 49 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgXOAcAcAVAAAAAXOQXOcgUgRAuIAAAAwggQAQgQAwQgQA&replay=GHXHifg-VynQDFevwiDMTImA)；操作码 `GHXHifg-VynQDFevwiDMTImA`；路线来源：runs/return-to-source-20261010/repair-12.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/repair-13**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5cC5wDgDgCoAAAAC5yC5zkCkCIFxAAAAGECACECAGCECA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5cC5wDgDgCoAAAAC5yC5zkCkCIFxAAAAGECACECAGCECA`；[runs/return-to-source-20261010/repair-13.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/repair-13.json)。
  <details><summary>参考 51 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5cC5wDgDgCoAAAAC5yC5zkCkCIFxAAAAGECACECAGCECA&replay=CLFeah8-VynQMFevwCIMxMiY)；操作码 `CLFeah8-VynQMFevwCIMxMiY`；路线来源：runs/return-to-source-20261010/repair-13.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/repair-28**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgXOAAHAFQAAAAFzkFznIFIEQLiAAAAMIIEAIEAMEIE)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgXOAAHAFQAAAAFzkFznIFIEQLiAAAAMIIEAIEAMEIE`；[runs/return-to-source-20261010/repair-28.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/repair-28.json)。
  <details><summary>参考 49 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgXOAAHAFQAAAAFzkFznIFIEQLiAAAAMIIEAIEAMEIE&replay=GEs19OY-VynQDFevwiDMTImA)；操作码 `GEs19OY-VynQDFevwiDMTImA`；路线来源：runs/return-to-source-20261010/repair-28.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/repair-29**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5cC5wAA4AqAAAAAucguc5ApAiBcQAAABhAgBAgBghAg)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5cC5wAA4AqAAAAAucguc5ApAiBcQAAABhAgBAgBghAg`；[runs/return-to-source-20261010/repair-29.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/repair-29.json)。
  <details><summary>参考 51 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5cC5wAA4AqAAAAAucguc5ApAiBcQAAABhAgBAgBghAg&replay=CCRxGVA-VynQMFevwCIMxMiY)；操作码 `CCRxGVA-VynQMFevwCIMxMiY`；路线来源：runs/return-to-source-20261010/repair-29.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/repair-4**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgXOAcAcAVAAAAAXOQXOcgUgRAuIAAAAwggQAwgQAwQgQA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgXOAcAcAVAAAAAXOQXOcgUgRAuIAAAAwggQAwgQAwQgQA`；[runs/return-to-source-20261010/repair-4.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/repair-4.json)。
  <details><summary>参考 37 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgXOAcAcAVAAAAAXOQXOcgUgRAuIAAAAwggQAwgQAwQgQA&replay=GOJYmNEv5XKdACDMTImA)；操作码 `GOJYmNEv5XKdACDMTImA`；路线来源：runs/return-to-source-20261010/repair-4.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/repair-5**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5cC5wDgDgCoAAAAC5yC5zkCkCIFxAAAAGECAGECAGCECA)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5cC5wDgDgCoAAAAC5yC5zkCkCIFxAAAAGECAGECAGCECA`；[runs/return-to-source-20261010/repair-5.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/repair-5.json)。
  <details><summary>参考 39 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5cC5wDgDgCoAAAAC5yC5zkCkCIFxAAAAGECAGECAGCECA&replay=CEURTgwv5XKdAyIMxMiY)；操作码 `CEURTgwv5XKdAyIMxMiY`；路线来源：runs/return-to-source-20261010/repair-5.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/repair-8**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFznIFIEQLiAAAAMIIAEIEAMEIE)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFznIFIEQLiAAAAMIIAEIEAMEIE`；[runs/return-to-source-20261010/repair-8.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/repair-8.json)。
  <details><summary>参考 49 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5zgTgHAHAFQAAAAFzkFznIFIEQLiAAAAMIIAEIEAMEIE&replay=GFeiU9Y-VynQDFevwiDMTImA)；操作码 `GFeiU9Y-VynQDFevwiDMTImA`；路线来源：runs/return-to-source-20261010/repair-8.json.result.solution.actions。

  </details>
- **runs/return-to-source-20261010/repair-9**：[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5cCcA4A4AqAAAAAucguc5ApAiBcQAAABhAAhAgBghAg)；未作玩家质量验收。 地图码 `AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5cCcA4A4AqAAAAAucguc5ApAiBcQAAABhAAhAgBghAg`；[runs/return-to-source-20261010/repair-9.json.map](../../ghost-maze-ai/runs/return-to-source-20261010/repair-9.json)。
  <details><summary>参考 51 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgvIMwiAACQAsIAqC5cCcA4A4AqAAAAAucguc5ApAiBcQAAABhAAhAgBghAg&replay=CPwMsuQ-VynQMFevwCIMxMiY)；操作码 `CPwMsuQ-VynQMFevwCIMxMiY`；路线来源：runs/return-to-source-20261010/repair-9.json.result.solution.actions。

  </details>
- **runs/shared-holding-20261010b/candidate-160279**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEMgJogOYMQgCqCcAAHOAqAAAAAAXOIEoFIE5AAAAABhgBAAg)；未作玩家质量验收。 地图码 `AADAAPBwcHAAAAEMgJogOYMQgCqCcAAHOAqAAAAAAXOIEoFIE5AAAAABhgBAAg`；[runs/shared-holding-20261010b/candidate-160279.json.map](../../ghost-maze-ai/runs/shared-holding-20261010b/candidate-160279.json)。
  <details><summary>参考 28 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEMgJogOYMQgCqCcAAHOAqAAAAAAXOIEoFIE5AAAAABhgBAAg&replay=AFIhZByOfAtXa_Aq)；操作码 `AFIhZByOfAtXa_Aq`；路线来源：runs/shared-holding-20261010b/candidate-160279.json.result.solution.actions。

  </details>
- **runs/shared-holding-20261010b/candidate-165641**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEMgKGgOYMQgCqCcAAHOAqAAAAAAXOIEoFIE5AAAAABhgBAAg)；未作玩家质量验收。 地图码 `AADAAPBwcHAAAAEMgKGgOYMQgCqCcAAHOAqAAAAAAXOIEoFIE5AAAAABhgBAAg`；[runs/shared-holding-20261010b/candidate-165641.json.map](../../ghost-maze-ai/runs/shared-holding-20261010b/candidate-165641.json)。
  <details><summary>参考 28 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEMgKGgOYMQgCqCcAAHOAqAAAAAAXOIEoFIE5AAAAABhgBAAg&replay=AD40IQ-OfAtXa_Aq)；操作码 `AD40IQ-OfAtXa_Aq`；路线来源：runs/shared-holding-20261010b/candidate-165641.json.result.solution.actions。

  </details>
- **runs/shared-holding-20261010b/candidate-5662**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEMgNIgOYMQgCqCcAAHOAqAAAAAAXOIEoFIE5AAAAABgABAAg)；未作玩家质量验收。 地图码 `AADAAPBwcHAAAAEMgNIgOYMQgCqCcAAHOAqAAAAAAXOIEoFIE5AAAAABgABAAg`；[runs/shared-holding-20261010b/candidate-5662.json.map](../../ghost-maze-ai/runs/shared-holding-20261010b/candidate-5662.json)。
  <details><summary>参考 24 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPBwcHAAAAEMgNIgOYMQgCqCcAAHOAqAAAAAAXOIEoFIE5AAAAABgABAAg&replay=AMphuFP8C1dr8Co)；操作码 `AMphuFP8C1dr8Co`；路线来源：runs/shared-holding-20261010b/candidate-5662.json.result.solution.actions。

  </details>
- **runs/split-relay-20261009/exit-f/candidate-110**：[试玩](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAtggFVCuXAucAASBVAAAABc5xBVyCqguEEIAAABggBABAhgg)；未作玩家质量验收。 地图码 `AADAAfDw8PDwAAEEoCEyBSQCAtggFVCuXAucAASBVAAAABc5xBVyCqguEEIAAABggBABAhgg`；[runs/split-relay-20261009/exit-f/candidate-110.json.map](../../ghost-maze-ai/runs/split-relay-20261009/exit-f/candidate-110.json)。
  <details><summary>参考 32 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAtggFVCuXAucAASBVAAAABc5xBVyCqguEEIAAABggBABAhgg&replay=AMMJJxwr8BWq18aACg)；操作码 `AMMJJxwr8BWq18aACg`；路线来源：runs/split-relay-20261009/exit-f/candidate-110.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/exit-f/candidate-20**：[试玩](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAtggFVCuXAuIOEBAqgAAAAuc4gqQXCC4QQgAAAGCAAAECGGA)；未作玩家质量验收。 地图码 `AADAAfDw8PDwAAEEoCEyBSQCAtggFVCuXAuIOEBAqgAAAAuc4gqQXCC4QQgAAAGCAAAECGGA`；[runs/split-relay-20261009/exit-f/candidate-20.json.map](../../ghost-maze-ai/runs/split-relay-20261009/exit-f/candidate-20.json)。
  <details><summary>参考 36 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAtggFVCuXAuIOEBAqgAAAAuc4gqQXCC4QQgAAAGCAAAECGGA&replay=APXxtnopwzGZYtfGgAo)；操作码 `APXxtnopwzGZYtfGgAo`；路线来源：runs/split-relay-20261009/exit-f/candidate-20.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/exit-f/candidate-37**：[试玩](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCApggFVCuXAuQC4EAqgAAAAuc4gqQQgnEE4gAAAGCAGAECGCA)；未作玩家质量验收。 地图码 `AADAAfDw8PDwAAEEoCEyBSQCApggFVCuXAuQC4EAqgAAAAuc4gqQQgnEE4gAAAGCAGAECGCA`；[runs/split-relay-20261009/exit-f/candidate-37.json.map](../../ghost-maze-ai/runs/split-relay-20261009/exit-f/candidate-37.json)。
  <details><summary>参考 34 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCApggFVCuXAuQC4EAqgAAAAuc4gqQQgnEE4gAAAGCAGAECGCA&replay=EFFaqIQK_BaVfJkKwKA)；操作码 `EFFaqIQK_BaVfJkKwKA`；路线来源：runs/split-relay-20261009/exit-f/candidate-37.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/exit-f/candidate-58**：[试玩](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAwwgFVCuXAc4AAgFUAAAAFznEFSCEFwguEAAAAwQAwAgQQw)；未作玩家质量验收。 地图码 `AADAAfDw8PDwAAEEoCEyBSQCAwwgFVCuXAc4AAgFUAAAAFznEFSCEFwguEAAAAwQAwAgQQw`；[runs/split-relay-20261009/exit-f/candidate-58.json.map](../../ghost-maze-ai/runs/split-relay-20261009/exit-f/candidate-58.json)。
  <details><summary>参考 26 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAwwgFVCuXAc4AAgFUAAAAFznEFSCEFwguEAAAAwQAwAgQQw&replay=EHyFKRE_AV6XwoCg)；操作码 `EHyFKRE_AV6XwoCg`；路线来源：runs/split-relay-20261009/exit-f/candidate-58.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/exit-f/candidate-6**：[试玩](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCApggFVCuXAuQIAOBVAAAABc5xBVQSQQgucQAAADBACACBBCA)；未作玩家质量验收。 地图码 `AADAAfDw8PDwAAEEoCEyBSQCApggFVCuXAuQIAOBVAAAABc5xBVQSQQgucQAAADBACACBBCA`；[runs/split-relay-20261009/exit-f/candidate-6.json.map](../../ghost-maze-ai/runs/split-relay-20261009/exit-f/candidate-6.json)。
  <details><summary>参考 36 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCApggFVCuXAuQIAOBVAAAABc5xBVQSQQgucQAAADBACACBBCA&replay=ALGvu7EK3MFaVynQrAo)；操作码 `ALGvu7EK3MFaVynQrAo`；路线来源：runs/split-relay-20261009/exit-f/candidate-6.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/exit-f/candidate-67**：[试玩](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAtggFVCuXAcAABBVAAAABc5xBVyC5IJILhAAAAMEAAIEIME)；未作玩家质量验收。 地图码 `AADAAfDw8PDwAAEEoCEyBSQCAtggFVCuXAcAABBVAAAABc5xBVyC5IJILhAAAAMEAAIEIME`；[runs/split-relay-20261009/exit-f/candidate-67.json.map](../../ghost-maze-ai/runs/split-relay-20261009/exit-f/candidate-67.json)。
  <details><summary>参考 40 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAtggFVCuXAcAABBVAAAABc5xBVyC5IJILhAAAAMEAAIEIME&replay=AAULcBIrcDFZitWDZ0AK)；操作码 `AAULcBIrcDFZitWDZ0AK`；路线来源：runs/split-relay-20261009/exit-f/candidate-67.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/exit-f/candidate-94**：[试玩](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAwwgFVCuXAuAFwACqAAAAC5ziCrkFOQQgogAAAGCAEAECGCA)；未作玩家质量验收。 地图码 `AADAAfDw8PDwAAEEoCEyBSQCAwwgFVCuXAuAFwACqAAAAC5ziCrkFOQQgogAAAGCAEAECGCA`；[runs/split-relay-20261009/exit-f/candidate-94.json.map](../../ghost-maze-ai/runs/split-relay-20261009/exit-f/candidate-94.json)。
  <details><summary>参考 28 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAwwgFVCuXAuAFwACqAAAAC5ziCrkFOQQgogAAAGCAEAECGCA&replay=ABN9LTE_AV6XxiAK)；操作码 `ABN9LTE_AV6XxiAK`；路线来源：runs/split-relay-20261009/exit-f/candidate-94.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/exit-read/candidate-0**：[试玩](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXA5wAAEFUAAAAFznEFSC5IJUFwgAAAGCGACECAGA)；未作玩家质量验收。 地图码 `AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXA5wAAEFUAAAAFznEFSC5IJUFwgAAAGCGACECAGA`；[runs/split-relay-20261009/exit-read/candidate-0.json.map](../../ghost-maze-ai/runs/split-relay-20261009/exit-read/candidate-0.json)。
  <details><summary>参考 19 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXA5wAAEFUAAAAFznEFSC5IJUFwgAAAGCGACECAGA&replay=CH6nJgrAyNYyqA)；操作码 `CH6nJgrAyNYyqA`；路线来源：runs/split-relay-20261009/exit-read/candidate-0.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/exit-read/candidate-10**：[试玩](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXAc5wJyCAVQAAAAXOcQVIKIKUEIAAABggAhBghAg)；未作玩家质量验收。 地图码 `AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXAc5wJyCAVQAAAAXOcQVIKIKUEIAAABggAhBghAg`；[runs/split-relay-20261009/exit-read/candidate-10.json.map](../../ghost-maze-ai/runs/split-relay-20261009/exit-read/candidate-10.json)。
  <details><summary>参考 19 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXAc5wJyCAVQAAAAXOcQVIKIKUEIAAABggAhBghAg&replay=CGshQgIMyNYyqA)；操作码 `CGshQgIMyNYyqA`；路线来源：runs/split-relay-20261009/exit-read/candidate-10.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/exit-read/candidate-15**：[试玩](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXA5wAgECqAAAAC5ziCpBc4ghBSgAAAGCCACECGEA)；未作玩家质量验收。 地图码 `AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXA5wAgECqAAAAC5ziCpBc4ghBSgAAAGCCACECGEA`；[runs/split-relay-20261009/exit-read/candidate-15.json.map](../../ghost-maze-ai/runs/split-relay-20261009/exit-read/candidate-15.json)。
  <details><summary>参考 19 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXA5wAgECqAAAAC5ziCpBc4ghBSgAAAGCCACECGEA&replay=CNBrc8w8CNYyqA)；操作码 `CNBrc8w8CNYyqA`；路线来源：runs/split-relay-20261009/exit-read/candidate-15.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/exit-read/candidate-18**：[试玩](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXA5wAgcIKoAAAALnOIKkFEE5QVIAAABghgBghAgg)；未作玩家质量验收。 地图码 `AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXA5wAgcIKoAAAALnOIKkFEE5QVIAAABghgBghAgg`；[runs/split-relay-20261009/exit-read/candidate-18.json.map](../../ghost-maze-ai/runs/split-relay-20261009/exit-read/candidate-18.json)。
  <details><summary>参考 19 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXA5wAgcIKoAAAALnOIKkFEE5QVIAAABghgBghAgg&replay=CONowsoMyNYyqA)；操作码 `CONowsoMyNYyqA`；路线来源：runs/split-relay-20261009/exit-read/candidate-18.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/exit-read/candidate-2**：[试玩](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXAcAlAc4FUAAAAFznEFSCcQRQSQAAADBADDBCBBA)；未作玩家质量验收。 地图码 `AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXAcAlAc4FUAAAAFznEFSCcQRQSQAAADBADDBCBBA`；[runs/split-relay-20261009/exit-read/candidate-2.json.map](../../ghost-maze-ai/runs/split-relay-20261009/exit-read/candidate-2.json)。
  <details><summary>参考 19 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXAcAlAc4FUAAAAFznEFSCcQRQSQAAADBADDBCBBA&replay=CN-m80UMyNYyqA)；操作码 `CN-m80UMyNYyqA`；路线来源：runs/split-relay-20261009/exit-read/candidate-2.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/exit-read/candidate-22**：[试玩](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXAuAHIJQVQAAAAXOcQVIKcgnEFEAAAAwQAgQgQwQ)；未作玩家质量验收。 地图码 `AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXAuAHIJQVQAAAAXOcQVIKcgnEFEAAAAwQAgQgQwQ`；[runs/split-relay-20261009/exit-read/candidate-22.json.map](../../ghost-maze-ai/runs/split-relay-20261009/exit-read/candidate-22.json)。
  <details><summary>参考 23 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXAuAHIJQVQAAAAXOcQVIKcgnEFEAAAAwQAgQgQwQ&replay=COfbhxoMyNljMqg)；操作码 `COfbhxoMyNljMqg`；路线来源：runs/split-relay-20261009/exit-read/candidate-22.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/exit-read/candidate-6**：[试玩](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXAcAIHFBVAAAABc5xBUgignOQRQAAADBAABCBDCA)；未作玩家质量验收。 地图码 `AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXAcAIHFBVAAAABc5xBUgignOQRQAAADBAABCBDCA`；[runs/split-relay-20261009/exit-read/candidate-6.json.map](../../ghost-maze-ai/runs/split-relay-20261009/exit-read/candidate-6.json)。
  <details><summary>参考 25 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXAcAIHFBVAAAABc5xBUgignOQRQAAADBAABCBDCA&replay=GAcx3ZsMyNmY8yqA)；操作码 `GAcx3ZsMyNmY8yqA`；路线来源：runs/split-relay-20261009/exit-read/candidate-6.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/exit-read/candidate-9**：[试玩](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXAccDhAAVQAAAAXOcQVUFEEILkgAAAGCACGCECGA)；未作玩家质量验收。 地图码 `AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXAccDhAAVQAAAAXOcQVUFEEILkgAAAGCACGCECGA`；[runs/split-relay-20261009/exit-read/candidate-9.json.map](../../ghost-maze-ai/runs/split-relay-20261009/exit-read/candidate-9.json)。
  <details><summary>参考 23 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAfDw8PDwAAEEoCEyBSQCAjAgFVCuXAccDhAAVQAAAAXOcQVUFEEILkgAAAGCACGCECGA&replay=CDprHgUPCNZjwqg)；操作码 `CDprHgUPCNZjwqg`；路线来源：runs/split-relay-20261009/exit-read/candidate-9.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/guided-a/candidate-140**：[试玩](https://ghostmaze.novic.cc/?map=AADAAMDw8PDwAAED4CMKBPQBAuggCgLlBcgHIOAKoAAAAFyAqQS5BcUEUAAAAwAQggwQ)；未作玩家质量验收。 地图码 `AADAAMDw8PDwAAED4CMKBPQBAuggCgLlBcgHIOAKoAAAAFyAqQS5BcUEUAAAAwAQggwQ`；[runs/split-relay-20261009/guided-a/candidate-140.json.map](../../ghost-maze-ai/runs/split-relay-20261009/guided-a/candidate-140.json)。
  <details><summary>参考 23 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAMDw8PDwAAED4CMKBPQBAuggCgLlBcgHIOAKoAAAAFyAqQS5BcUEUAAAAwAQggwQ&replay=CLlHxMStcptNgAg)；操作码 `CLlHxMStcptNgAg`；路线来源：runs/split-relay-20261009/guided-a/candidate-140.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/guided-a/candidate-165**：[试玩](https://ghostmaze.novic.cc/?map=AADAAMDw8PDwAAED4CMKBPQBAuggCgLlA5AAACqAAAABcgKqCOQXOUE4gAAAGAEGCECA)；未作玩家质量验收。 地图码 `AADAAMDw8PDwAAED4CMKBPQBAuggCgLlA5AAACqAAAABcgKqCOQXOUE4gAAAGAEGCECA`；[runs/split-relay-20261009/guided-a/candidate-165.json.map](../../ghost-maze-ai/runs/split-relay-20261009/guided-a/candidate-165.json)。
  <details><summary>参考 25 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAMDw8PDwAAED4CMKBPQBAuggCgLlA5AAACqAAAABcgKqCOQXOUE4gAAAGAEGCECA&replay=GCt4SrOtY9msYMCA)；操作码 `GCt4SrOtY9msYMCA`；路线来源：runs/split-relay-20261009/guided-a/candidate-165.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/guided-a/candidate-170**：[试玩](https://ghostmaze.novic.cc/?map=AADAAMDw8PDwAAED4CMKBPQBApwgCgLlA4BEAgqgAAAAXICpBOILnEFwgAAAGAEGCGCA)；未作玩家质量验收。 地图码 `AADAAMDw8PDwAAED4CMKBPQBApwgCgLlA4BEAgqgAAAAXICpBOILnEFwgAAAGAEGCGCA`；[runs/split-relay-20261009/guided-a/candidate-170.json.map](../../ghost-maze-ai/runs/split-relay-20261009/guided-a/candidate-170.json)。
  <details><summary>参考 41 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAMDw8PDwAAED4CMKBPQBApwgCgLlA4BEAgqgAAAAXICpBOILnEFwgAAAGAEGCGCA&replay=GA44GJkP5ZcDZYncPrYAgA)；操作码 `GA44GJkP5ZcDZYncPrYAgA`；路线来源：runs/split-relay-20261009/guided-a/candidate-170.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/guided-a/candidate-174**：[试玩](https://ghostmaze.novic.cc/?map=AADAAMDw8PDwAAED4CMKBPQBAoQgCgLlA5A4gHAVQAAAALkBVQRyC4QRQAAADACACCBA)；未作玩家质量验收。 地图码 `AADAAMDw8PDwAAED4CMKBPQBAoQgCgLlA5A4gHAVQAAAALkBVQRyC4QRQAAADACACCBA`；[runs/split-relay-20261009/guided-a/candidate-174.json.map](../../ghost-maze-ai/runs/split-relay-20261009/guided-a/candidate-174.json)。
  <details><summary>参考 31 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAMDw8PDwAAED4CMKBPQBAoQgCgLlA5A4gHAVQAAAALkBVQRyC4QRQAAADACACCBA&replay=CC3msIQNlWPyZU2ACA)；操作码 `CC3msIQNlWPyZU2ACA`；路线来源：runs/split-relay-20261009/guided-a/candidate-174.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/guided-a/candidate-200**：[试玩](https://ghostmaze.novic.cc/?map=AADAAMDw8PDwAAED4CMKBPQBAxwgCgLlA44AAQKoAAAAFyAqoIQXFBccgAAAGAGECCEA)；未作玩家质量验收。 地图码 `AADAAMDw8PDwAAED4CMKBPQBAxwgCgLlA44AAQKoAAAAFyAqoIQXFBccgAAAGAGECCEA`；[runs/split-relay-20261009/guided-a/candidate-200.json.map](../../ghost-maze-ai/runs/split-relay-20261009/guided-a/candidate-200.json)。
  <details><summary>参考 35 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAMDw8PDwAAED4CMKBPQBAxwgCgLlA44AAQKoAAAAFyAqoIQXFBccgAAAGAGECCEA&replay=CNfPqJIPXpYNnfwrYAg)；操作码 `CNfPqJIPXpYNnfwrYAg`；路线来源：runs/split-relay-20261009/guided-a/candidate-200.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/guided-a/candidate-25**：[试玩](https://ghostmaze.novic.cc/?map=AADAAMDw8PDwAAED4CMKBPQBAxwgCgLlA4BEA4FUAAAAC5AVcgpQXHIJIAAABgBBAAhA)；未作玩家质量验收。 地图码 `AADAAMDw8PDwAAED4CMKBPQBAxwgCgLlA4BEA4FUAAAAC5AVcgpQXHIJIAAABgBBAAhA`；[runs/split-relay-20261009/guided-a/candidate-25.json.map](../../ghost-maze-ai/runs/split-relay-20261009/guided-a/candidate-25.json)。
  <details><summary>参考 31 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAMDw8PDwAAED4CMKBPQBAxwgCgLlA4BEA4FUAAAAC5AVcgpQXHIJIAAABgBBAAhA&replay=CH36RvA3ylY_eJTICA)；操作码 `CH36RvA3ylY_eJTICA`；路线来源：runs/split-relay-20261009/guided-a/candidate-25.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/guided-a/candidate-280**：[试玩](https://ghostmaze.novic.cc/?map=AADAAMDw8PDwAAED4CMKBPQBAnggCgLlBc4CQACqAAAABcgKqClBc4guEAAAAwAggQwQ)；未作玩家质量验收。 地图码 `AADAAMDw8PDwAAED4CMKBPQBAnggCgLlBc4CQACqAAAABcgKqClBc4guEAAAAwAggQwQ`；[runs/split-relay-20261009/guided-a/candidate-280.json.map](../../ghost-maze-ai/runs/split-relay-20261009/guided-a/candidate-280.json)。
  <details><summary>参考 21 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAMDw8PDwAAED4CMKBPQBAnggCgLlBc4CQACqAAAABcgKqClBc4guEAAAAwAggQwQ&replay=GCo3Lrtcp3xiAIA)；操作码 `GCo3Lrtcp3xiAIA`；路线来源：runs/split-relay-20261009/guided-a/candidate-280.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/guided-a/candidate-300**：[试玩](https://ghostmaze.novic.cc/?map=AADAAMDw8PDwAAED4CMKBPQBAuQgCgLlA4AAHAVQAAAALkBVQTlBcILhAAAAMAMIIEE)；未作玩家质量验收。 地图码 `AADAAMDw8PDwAAED4CMKBPQBAuQgCgLlA4AAHAVQAAAALkBVQTlBcILhAAAAMAMIIEE`；[runs/split-relay-20261009/guided-a/candidate-300.json.map](../../ghost-maze-ai/runs/split-relay-20261009/guided-a/candidate-300.json)。
  <details><summary>参考 21 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAMDw8PDwAAED4CMKBPQBAuQgCgLlA4AAHAVQAAAALkBVQTlBcILhAAAAMAMIIEE&replay=GPYy3R1cp3xiAIA)；操作码 `GPYy3R1cp3xiAIA`；路线来源：runs/split-relay-20261009/guided-a/candidate-300.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/guided-a/candidate-316**：[试玩](https://ghostmaze.novic.cc/?map=AADAAMDw8PDwAAED4CMKBPQBApQgCgLlA4BEHHAVQAAAALkBUgkguSC4QAAADACDCBBA)；未作玩家质量验收。 地图码 `AADAAMDw8PDwAAED4CMKBPQBApQgCgLlA4BEHHAVQAAAALkBUgkguSC4QAAADACDCBBA`；[runs/split-relay-20261009/guided-a/candidate-316.json.map](../../ghost-maze-ai/runs/split-relay-20261009/guided-a/candidate-316.json)。
  <details><summary>参考 57 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAMDw8PDwAAED4CMKBPQBApQgCgLlA4BEHHAVQAAAALkBUgkguSC4QAAADACDCBBA&replay=GJN0zWjDZ2l8g2donfI2WHNoAIA)；操作码 `GJN0zWjDZ2l8g2donfI2WHNoAIA`；路线来源：runs/split-relay-20261009/guided-a/candidate-316.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/guided-a/candidate-87**：[试玩](https://ghostmaze.novic.cc/?map=AADAAMDw8PDwAAED4CMKBPQBAtggCgLlBcgAByCqAAAABcgKqC4QXFBckAAAAwAgggQQ)；未作玩家质量验收。 地图码 `AADAAMDw8PDwAAED4CMKBPQBAtggCgLlBcgAByCqAAAABcgKqC4QXFBckAAAAwAgggQQ`；[runs/split-relay-20261009/guided-a/candidate-87.json.map](../../ghost-maze-ai/runs/split-relay-20261009/guided-a/candidate-87.json)。
  <details><summary>参考 39 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAMDw8PDwAAED4CMKBPQBAtggCgLlBcgAByCqAAAABcgKqC4QXFBckAAAAwAgggQQ&replay=CHBJ1m8PYpVg2dD2K2AI)；操作码 `CHBJ1m8PYpVg2dD2K2AI`；路线来源：runs/split-relay-20261009/guided-a/candidate-87.json.solution.solution.actions。

  </details>
- **runs/split-relay-20261009/guided-a/gadget**：[试玩](https://ghostmaze.novic.cc/?map=AADAAMDw8PDwAAED4CMKAvQBAgCgLlA4AAAFUAAAAC5AVIIQXCCEAAAAwAgQ)；未作玩家质量验收。 地图码 `AADAAMDw8PDwAAED4CMKAvQBAgCgLlA4AAAFUAAAAC5AVIIQXCCEAAAAwAgQ`；[runs/split-relay-20261009/guided-a/gadget.json.map](../../ghost-maze-ai/runs/split-relay-20261009/guided-a/gadget.json)。
  尚无完整可验证的通关路线。
- **runs/temporary-goal-room-20261010/baseline**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPDQ8PDgAAEkICAqBwQBAuwhwACqDiBzkAcDhBUAAAABckFyoKcghBcQAAABggBBAghAgA)；未作玩家质量验收。 地图码 `AADAAPDQ8PDgAAEkICAqBwQBAuwhwACqDiBzkAcDhBUAAAABckFyoKcghBcQAAABggBBAghAgA`；[runs/temporary-goal-room-20261010/baseline.json.map](../../ghost-maze-ai/runs/temporary-goal-room-20261010/baseline.json)、[runs/temporary-goal-room-20261010/source.json.map](../../ghost-maze-ai/runs/temporary-goal-room-20261010/source.json)。
  <details><summary>参考 9 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPDQ8PDgAAEkICAqBwQBAuwhwACqDiBzkAcDhBUAAAABckFyoKcghBcQAAABggBBAghAgA&replay=GPUE1bU_qAA)；操作码 `GPUE1bU_qAA`；路线来源：runs/temporary-goal-room-20261010/baseline.json.result.solution.actions。

  </details>
- **runs/temporary-goal-room-20261010c/candidate-1155**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPHQ8PDgAAEkYCAyCRQBAvwhwQggCqFxBc5A4cAQVAAAAAXJCcqCucghBcQAAABggBhAgghAAA)；未作玩家质量验收。 地图码 `AADAAPHQ8PDgAAEkYCAyCRQBAvwhwQggCqFxBc5A4cAQVAAAAAXJCcqCucghBcQAAABggBhAgghAAA`；[runs/temporary-goal-room-20261010c/candidate-1155.json.map](../../ghost-maze-ai/runs/temporary-goal-room-20261010c/candidate-1155.json)。
  <details><summary>参考 29 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPHQ8PDgAAEkYCAyCRQBAvwhwQggCqFxBc5A4cAQVAAAAAXJCcqCucghBcQAAABggBhAgghAAA&replay=GMBGC7smNXDelAO2gA)；操作码 `GMBGC7smNXDelAO2gA`；路线来源：runs/temporary-goal-room-20261010c/candidate-1155.json.result.solution.actions。

  </details>
- **runs/temporary-goal-room-20261010c/candidate-1159**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPHQ8PDgAAEkYCAyCRQBAvwhwQggCqFxBc5A4cAQVAAAAAXJCcqCucghBcQAAABggBhAgghBAA)；未作玩家质量验收。 地图码 `AADAAPHQ8PDgAAEkYCAyCRQBAvwhwQggCqFxBc5A4cAQVAAAAAXJCcqCucghBcQAAABggBhAgghBAA`；[runs/temporary-goal-room-20261010c/candidate-1159.json.map](../../ghost-maze-ai/runs/temporary-goal-room-20261010c/candidate-1159.json)。
  <details><summary>参考 27 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPHQ8PDgAAEkYCAyCRQBAvwhwQggCqFxBc5A4cAQVAAAAAXJCcqCucghBcQAAABggBhAgghBAA&replay=CNldOvom1w3pQDto)；操作码 `CNldOvom1w3pQDto`；路线来源：runs/temporary-goal-room-20261010c/candidate-1159.json.result.solution.actions。

  </details>
- **runs/temporary-goal-room-20261010c/candidate-1165**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPHQ8PDgAAEkYCAyCRQBAvwhwQggCqFxBc5A4cDhBUAAAABckJyoK5yCEFxAAAAGCAGECCCCEAA)；未作玩家质量验收。 地图码 `AADAAPHQ8PDgAAEkYCAyCRQBAvwhwQggCqFxBc5A4cDhBUAAAABckJyoK5yCEFxAAAAGCAGECCCCEAA`；[runs/temporary-goal-room-20261010c/candidate-1165.json.map](../../ghost-maze-ai/runs/temporary-goal-room-20261010c/candidate-1165.json)。
  <details><summary>参考 29 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPHQ8PDgAAEkYCAyCRQBAvwhwQggCqFxBc5A4cDhBUAAAABckJyoK5yCEFxAAAAGCAGECCCCEAA&replay=GPNlTHEmNXDelAO2gA)；操作码 `GPNlTHEmNXDelAO2gA`；路线来源：runs/temporary-goal-room-20261010c/candidate-1165.json.result.solution.actions。

  </details>
- **runs/temporary-goal-room-20261010c/candidate-905**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPHQ8PDgAAEkYCAyCRQBAvwhwQggCqFxBc5A4cAQVAAAAAXJCcqCnIIQXEAAAAYIAYQIIQA)；未作玩家质量验收。 地图码 `AADAAPHQ8PDgAAEkYCAyCRQBAvwhwQggCqFxBc5A4cAQVAAAAAXJCcqCnIIQXEAAAAYIAYQIIQA`；[runs/temporary-goal-room-20261010c/candidate-905.json.map](../../ghost-maze-ai/runs/temporary-goal-room-20261010c/candidate-905.json)。
  <details><summary>参考 29 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPHQ8PDgAAEkYCAyCRQBAvwhwQggCqFxBc5A4cAQVAAAAAXJCcqCnIIQXEAAAAYIAYQIIQA&replay=GB_mdK4mNXDelAO2gA)；操作码 `GB_mdK4mNXDelAO2gA`；路线来源：runs/temporary-goal-room-20261010c/candidate-905.json.result.solution.actions。

  </details>
- **runs/temporary-goal-room-20261010c/candidate-909**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPHQ8PDgAAEkYCAyCRQBAvwhwQggCqFxBc5A4cAQVAAAAAXJCcqCnIIQXEAAAAYIAYQIIQQ)；未作玩家质量验收。 地图码 `AADAAPHQ8PDgAAEkYCAyCRQBAvwhwQggCqFxBc5A4cAQVAAAAAXJCcqCnIIQXEAAAAYIAYQIIQQ`；[runs/temporary-goal-room-20261010c/candidate-909.json.map](../../ghost-maze-ai/runs/temporary-goal-room-20261010c/candidate-909.json)。
  <details><summary>参考 27 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPHQ8PDgAAEkYCAyCRQBAvwhwQggCqFxBc5A4cAQVAAAAAXJCcqCnIIQXEAAAAYIAYQIIQQ&replay=CBiLsLcm1w3pQDto)；操作码 `CBiLsLcm1w3pQDto`；路线来源：runs/temporary-goal-room-20261010c/candidate-909.json.result.solution.actions。

  </details>
- **runs/temporary-goal-room-20261010c/candidate-915**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPHQ8PDgAAEkYCAyCRQBAvwhwQggCqFxBc5A4cDhBUAAAABckJyoKcghBcQAAABggBhAgghAAA)；未作玩家质量验收。 地图码 `AADAAPHQ8PDgAAEkYCAyCRQBAvwhwQggCqFxBc5A4cDhBUAAAABckJyoKcghBcQAAABggBhAgghAAA`；[runs/temporary-goal-room-20261010c/candidate-915.json.map](../../ghost-maze-ai/runs/temporary-goal-room-20261010c/candidate-915.json)。
  <details><summary>参考 29 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPHQ8PDgAAEkYCAyCRQBAvwhwQggCqFxBc5A4cDhBUAAAABckJyoKcghBcQAAABggBhAgghAAA&replay=GLInU20mNXDelAO2gA)；操作码 `GLInU20mNXDelAO2gA`；路线来源：runs/temporary-goal-room-20261010c/candidate-915.json.result.solution.actions。

  </details>
- **runs/temporary-goal-room-20261010c/candidate-919**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPHQ8PDgAAEkYCAyCRQBAvwhwQggCqFxBc5A4cDhBUAAAABckJyoKcghBcQAAABggBhAgghBAA)；未作玩家质量验收。 地图码 `AADAAPHQ8PDgAAEkYCAyCRQBAvwhwQggCqFxBc5A4cDhBUAAAABckJyoKcghBcQAAABggBhAgghBAA`；[runs/temporary-goal-room-20261010c/candidate-919.json.map](../../ghost-maze-ai/runs/temporary-goal-room-20261010c/candidate-919.json)。
  <details><summary>参考 27 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPHQ8PDgAAEkYCAyCRQBAvwhwQggCqFxBc5A4cDhBUAAAABckJyoKcghBcQAAABggBhAgghBAA&replay=CKs8Yiwm1w3pQDto)；操作码 `CKs8Yiwm1w3pQDto`；路线来源：runs/temporary-goal-room-20261010c/candidate-919.json.result.solution.actions。

  </details>
- **runs/temporary-goal-room-20261010c/candidate-942**：[试玩](https://ghostmaze.novic.cc/?map=AADAAPHQ8PDgAAEkYCAyBxQBAvwhwACqFxBc5A4cDhBUAAAABckJyoKcghBcQAAABggBhBAghAg)；未作玩家质量验收。 地图码 `AADAAPHQ8PDgAAEkYCAyBxQBAvwhwACqFxBc5A4cDhBUAAAABckJyoKcghBcQAAABggBhBAghAg`；[runs/temporary-goal-room-20261010c/candidate-942.json.map](../../ghost-maze-ai/runs/temporary-goal-room-20261010c/candidate-942.json)。
  <details><summary>参考 29 步（答案）</summary>

  [同页回放](https://ghostmaze.novic.cc/?map=AADAAPHQ8PDgAAEkYCAyBxQBAvwhwACqFxBc5A4cDhBUAAAABckJyoKcghBcQAAABggBhBAghAg&replay=GC2Po7Mv-lcp0AO2gA)；操作码 `GC2Po7Mv-lcp0AO2gA`；路线来源：runs/temporary-goal-room-20261010c/candidate-942.json.result.solution.actions。

  </details>

</details>

## 汇总范围与后续更新

作品目录 `examples/`、已保存候选 `runs/` 和既有 `data/maps/`、`data/generated/` 均已扫描。大型日志中的批量编辑留在原实验档案，未复制为作品；略过的大型文件共 7 份，清单保存在验收记录。未解析的浏览器输出不会冒充地图。

在 AI 仓执行 `npm run catalog -- 本体首页地址` 可重新汇总，重新校验地图、新码往返及已有通关路线；默认使用正式站。工具只读取原始资料，另写此目录及 `runs/map-catalog/verification.json`。

以后每次交付地图，以及收到新的评价或改评，都更新本文件：保留地图与动作证书、试玩与折叠参考回放、简短评述及日期和依据。尚未评价、尚无解法、撤回和数据冲突须明确标注；改评保留此前记录，点评不自动继承到亲缘改图。原始反馈和录制继续独立保存，不用目录摘要替代原件。
