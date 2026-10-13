# 地图集设计小册

更新：2026-10-13。这里按首次交付／发现记录的顺序，简要总结目前上架的十二张图。**正文包含解谜关键；准备首次试玩时请直接访问[无图地图集](https://ghostmaze.novic.cc/maps.html)。** 各图只列当前地图与参考，历史改图和完整反馈在[总目录](ai-map-catalog.md)。

“关键发现”分为你明确确认的尤里卡时刻、带提示／回放后的发现，以及设计者预期但尚未获确认的认识变化。《错位》《接力》《再借》的关键也依据你[本次明确总结](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/recruited-return-review-20261013.md#本次重整的设计方向)。

“不错”不等于已达到精妙目标。基本数量来自当前地图集；《借影》为获准维护版，不把维护当新作品。

| 顺序 | 地图 | 首次交付 | 格 / 鬼 / 钥匙 | 主要机制 |
| --- | --- | --- | --- | --- |
| 1 | [《错位》](#1-错位) | 2026-09-30 | 18 / 1 / 0 | A/B 字母门、普通门；玻璃仅供观察 |
| 2 | [《接力》](#2-接力) | 2026-10-09 | 14 / 2 / 0 | A/B 字母门，三个操作站位 |
| 3 | [《归途》](#3-归途) | 2026-10-09 | 18 / 2 / 1 | A/B 字母门、单向门、钥匙门 |
| 4 | [《借影》](#4-借影) | 2026-10-09 | 24 / 2 / 2 | A/B/C 字母门、钥匙门 |
| 5 | [《回环》](#5-回环) | 2026-10-10 | 23 / 3 / 2 | A/B/C 字母门、钥匙门 |
| 6 | [《回位》](#6-回位) | 2026-10-10 | 16 / 2 / 0 | A/B 字母门，四个操作站位 |
| 7 | [《换边》](#7-换边) | 2026-10-12 | 11 / 1 / 1 | A 字母门、普通门、钥匙门 |
| 8 | [《换岗》](#8-换岗) | 2026-10-12 | 21 / 2 / 2 | A/B 字母门、普通门、钥匙门 |
| 9 | [《后路》](#9-后路) | 2026-10-12 | 23 / 2 / 3 | A/B 字母门、普通门、钥匙门、0 门 |
| 10 | [《暂驻》](#10-暂驻) | 2026-10-13 | 26 / 2 / 0 | 一个 A 按钮、两扇反相 A 门、一扇 0 门 |
| 11 | [《再借》](#11-再借) | 2026-10-13 | 21 / 2 / 0 | 一个 A 按钮、两扇反相 A 门、一扇普通门 |
| 12 | [《楼间》](#12-楼间) | 2026-10-13 | 11 / 1 / 0 | 两层、两对楼梯、一个 A 按钮、两扇反相 A 门、一扇普通门 |

## 1. 错位

**设计思想：** 鬼挡住入口，直接靠近不能解决，开门也不等于清路。按钮操作也会推进鬼。借切门让鬼靠近到能够触发追逐的位置，再把它引离入口。

**关键发现：** 从‘门开了就能过’改为‘先借按门把鬼引活，再清空入口’。你已明确确认这个关键。

**你的简评：** ‘太妙了！好设计！’；同时指出左上 B 门无作用。保留好评，也保留冗余意见。 [评述依据](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/worklogs/status-before-reorganization-20261013.md)。

[试玩](https://ghostmaze.novic.cc/?map=AADAAPD4UNDwAAFBoAdAVgBgQBVBxchJCQFcCqAAAABCCY2gqglQTiAAAAYAQAA) · [参考解法](https://ghostmaze.novic.cc/?map=AADAAPD4UNDwAAFBoAdAVgBgQBVBxchJCQFcCqAAAABCCY2gqglQTiAAAAYAQAA&replay=GC3I0ymPKVh_qMDymP3A)

## 2. 接力

**设计思想：** 关门保护自己会同时堵住目标，重新开放又会解除保护。先引出另一只鬼并准备隔离，再借靠近门的按钮困鬼，让保护和通路分阶段交接。

**关键发现：** 开关不仅用于开路，站位与切门配合可以困鬼；而这个操作还需要先安排另一只鬼。你已明确确认。

**你的简评：** ‘妙！’‘想了好久才想出来’‘媲美第一张图’。有实际保留通关分支，不能据录制长度反推思考时间。 [评述依据](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/twin-handoff-review-20261009.md)。

[试玩](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAAC5xAqgTkCIEgAAAACCBCA) · [参考解法](https://ghostmaze.novic.cc/?map=AADAAPBQcHBgAAEMgIIgWIBA3hAFUEgOQBwBAoAAAAC5xAqgTkCIEgAAAACCBCA&replay=CMnCC_w_AWlXDelACA)

## 3. 归途

**设计思想：** 两只鬼的保护安排不能各自独立完成。先转移第一只鬼的困住位置，才能安排第二只鬼并恢复通路。

**关键发现：** 预期改变是‘前一只鬼的最终位置，要为后一只鬼准备条件’；你认可了关系，但指出可以线性推导，没有确认顿悟。

**你的简评：** ‘不错的图’，想出解法不难；单向门的用途过于明显。 [评述依据](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/permanent-return-review-20261009.md)。

[试玩](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcAXAhwEwS4FAQC5AcgOAacAAVAAJAKAtZgXEC5yBECIAACAGBQCEGGA) · [参考解法](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcAXAhwEwS4FAQC5AcgOAacAAVAAJAKAtZgXEC5yBECIAACAGBQCEGGA&replay=CHbIXDkIJ9WgsPqXoz4I)

## 4. 借影

**设计思想：** 开上方通路会撤销原来的安全安排，单靠临时困鬼不能完成往返。提前关闭未来停位上方的 A 门，再拉开身位、切换视线，把鬼引到门下；走位本身也是安置工具。

**关键发现：** 不用等鬼到位后再关门，可以先关门，再靠控距与引导把鬼送到其下方。你看参考回放后明确评价‘妙，好设计’。

**你的简评：** 正反馈来自看回放后的发现，不能记为无提示独立解出。当前是获准维护版：保留这个设计与原 59 步路线，阻止重合捷径。 [评述依据](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/borrowed-shelter-review-20261010.md)。

[试玩](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BeCBlANArwIhKAkFMgrgcuAccAAqgAEgFQTiC5xBOcghBCAAAQIIYAQYgQYY) · [参考解法](https://ghostmaze.novic.cc/?map=AADAwGHh4eHh4AEdYCF8BeCBlANArwIhKAkFMgrgcuAccAAqgAEgFQTiC5xBOcghBCAAAQIIYAQYgQYY&replay=CH7k9Zggj90mF8CqMlf2oMzILXA)

## 5. 回环

**设计思想：** 从开头一直带鬼追逐，会错过需要布置的停位。短暂暴露视线后撤开，控制鬼的停位，再从另一方向重新引动，接上机关保护。

**关键发现：** 引鬼不必等于持续追逐；分段引动可以布置位置。你看前五步提示后改变起手认识并通关。

**你的简评：** 比较困难、‘勉强可称精妙’，同时担忧复杂性堆砌。带提示通关的条件保留。 [评述依据](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/shelter-exchange-review-20261010.md)。

[试玩](https://ghostmaze.novic.cc/?map=AADBweHh4eDAwAE1YEKQICGUCQAgBXCqA4gTIKAkEQACgAEQJygnEFziCc5AkBIAABAgAxAgwA) · [参考解法](https://ghostmaze.novic.cc/?map=AADBweHh4eDAwAE1YEKQICGUCQAgBXCqA4gTIKAkEQACgAEQJygnEFziCc5AkBIAABAgAxAgwA&replay=EOhbsb4LzGYiMlwXjCpz6gXciDIHNcA)

## 6. 回位

**设计思想：** 早期困鬼能腾出操作条件，但重新开目标门会使这项保护失效。回到原先鬼占的操作位置，再把它从目标前格引走，换位置、换站位接管保护。

**关键发现：** 预期改变是‘临时安置并没有处理完这只鬼’；你已掌握这类套路，没有产生新的‘妙’感。

**你的简评：** ‘不错的谜题’，已通关；也明确指出近期《借位》《回位》平平、缺新意。 [评述依据](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/architecture-diagnosis-handoff-20261010.md)。

[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguAXOAcAcAVAAAAAXOQXOcgUgRAuIAAAAwQAwgQAwggQ) · [参考解法](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIMwiAACAKguAXOAcAcAVAAAAAXOQXOcgUgRAuIAAAAwQAwgQAwggQ&replay=CNEbJuMv5XKdACDNIhg)

## 7. 换边

**设计思想：** 能安全拿钥匙的停位，会妨碍最终到目标。先把鬼留在普通门一侧取钥匙，再利用同一钥匙房和门口把它转到另一侧。

**关键发现：** 预期改变是‘同一处保护，需要因目标不同而换边’；你认为容易想到，没有确认强顿悟。

**你的简评：** ‘不错’、更巧且简洁；适合甜点单元或早期简单关，仍不是主线的高挑战目标。 [评述依据](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/room-transfer-review-20261012.md)。

[试玩](https://ghostmaze.novic.cc/?map=AWM4wZDw4UECAwNjWIMLkwIvA8MCF-4vAqwMILCFs0T4C0sDiMnEAQA) · [参考解法](https://ghostmaze.novic.cc/?map=AWM4wZDw4UECAwNjWIMLkwIvA8MCF-4vAqwMILCFs0T4C0sDiMnEAQA&replay=AJOILtmM5m-reKM3)

## 8. 换岗

**设计思想：** 两只鬼争用中部安全停位，当前保护和之后取物、撤离的条件相互冲突。先把第一只鬼转到上方，再把第二只鬼接入腾出的中部位置；已消失的钥匙门不能继续保护，需要 A 门接手。

**关键发现：** 预期改变是‘保护位置可以交接，消失的门需要另找保护’；你指出每一步都很快想到，没有顿悟感。

**你的简评：** ‘不错的谜题’，有一定复杂性且简洁；提出后续单元应尽量中性开局，并检查实际进入当步。 [评述依据](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/shelter-role-exchange-review-20261012.md)。

[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQCBGYCoCQEgAAAwIMIBA) · [参考解法](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMAEC4C10BaeArgOw0oSAiBcgpwAAAKABZrEDmOQCBGYCoCQEgAAAwIMIBA&replay=AK03CdqPJm9djDqvo8yVV4AJm_6jIg)

## 9. 后路

**设计思想：** 眼前钥匙可以安全拿，却可能破坏以后撤离和重新开门的条件。暂留下方钥匙，先消费 0 门并安排鬼的位置，把后路准备好再取物。

**关键发现：** 预期改变是‘现在能拿不代表现在该拿’；你认可取物顺序和规划，但认为推理仍偏线性。

**你的简评：** ‘不错，比上一张有进步’，不久就想到；仍期待新意与再次眼前一亮。 [评述依据](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/deferred-key-cold-entry-review-20261012.md)。

[试玩](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECMwEgLEBUBIBABhgAGGEAgA) · [参考解法](https://ghostmaze.novic.cc/?map=AADBsPDg8DAwMDEC4C90CaeUBXAdhpQlwEQLkFOAAABzIFCzWIHMcgECMwEgLEBUBIBABhgAGGEAgA&replay=CCe-0I-PJm9VxgD6r6PMlfnYAog)

## 10. 暂驻

**设计思想：** 暂时帮玩家到达按钮的鬼，随后又挡住打开的出口。借另一只鬼的追击阻挡安排停位；按 A 保护身后、打开出口后，还要再次引走暂驻鬼清路。

**关键发现：** 预期改变是‘有用的停车点，之后会变成障碍’。你肯定简洁与挑战性，尚未明确确认顿悟体验。

**你的简评：** ‘是好图’，设计很简洁，也有一定挑战性；明确要求加入地图集。 [评述依据](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/temporary-stay-review-20261013.md)。

[试玩](https://ghostmaze.novic.cc/?map=AADAGPjZ-Lj4AAEK4C7KASgBQq5AgiCXAIyKqAAACQghKokUKiEEAAAAAgA) · [参考解法](https://ghostmaze.novic.cc/?map=AADAGPjZ-Lj4AAEK4C7KASgBQq5AgiCXAIyKqAAACQghKokUKiEEAAAAAgA&replay=CL4EDXnUQDZX_AKl28CM)

## 11. 再借

**设计思想：** 先把一只鬼安置好后，另一只鬼仍堵着目标；直接引它再退走会继续被追。重新引出先前安置的鬼，让它跟在身后；转向时借它优先追击并占位，挡住另一只鬼，再重新安排当前追鬼。

**关键发现：** ‘重新引动先前安置的鬼，让它帮助阻挡另一只鬼。’威胁成为工具，已解决的安排需要重新启用。你亲自指出并明确肯定。

**你的简评：** ‘妙！’‘这图非常棒，很有新意’，明确要求上架。没有实际操作录制，提示或参考使用情况未报告。 [评述依据](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/recruited-return-review-20261013.md)。

[试玩](https://ghostmaze.novic.cc/?map=AADAAHho7Lj4AAFZ4DIyACAABVAQRISQgKqAAAABCCVCYrkVOQggAAAAEA) · [参考解法](https://ghostmaze.novic.cc/?map=AADAAHho7Lj4AAFZ4DIyACAABVAQRISQgKqAAAABCCVCYrkVOQggAAAAEA&replay=APJU70bDyl3eIDK1Wg8M1w)

## 12. 楼间

**当前状态：** 楼梯机制修正后，原参考第3步死亡，原图无伤无复活无解。原图、上架决定和真实简评保留；下列设计思想为生成时依据，不能作为当前有效入门题。等待修补处理，见[规则影响](archive/inspections/stair-adjacency-20261013.md)。

**设计思想：** 先借楼梯把鬼移离上层，原开关的楼梯另一端却留下危险；换另一处楼梯重新带它上来，再改变下层停位，让原开关恢复安全。用少量元件介绍玩家与鬼的跨层关系。

**关键发现：** 设计者预期是“清空一层之后，还要安排楼梯另一端”；你将它定位为基础多层入门关，没有明确确认强顿悟或高挑战。至少三次搬运的机械必要性不等于精妙。

**你的简评：** “基础的多层谜题”，适合作为简单起始作品，让玩家了解楼梯基本机制；明确要求上架。后续希望最精妙的部分依赖楼梯实现。 [评述依据](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/stair-relocation-review-20261013.md)。

[试玩](https://ghostmaze.novic.cc/?map=AWN4wMDAwOR8gIGBiYGBgcWxi6WBAQy0FrRAGI0gFSwOUgwODAwc3FOEoPIBgifAtAMTCwA) · [参考解法](https://ghostmaze.novic.cc/?map=AWN4wMDAwOR8gIGBiYGBgcWxi6WBAQy0FrRAGI0gFSwOUgwODAwc3FOEoPIBgifAtAMTCwA&replay=OmPml1EpstcImB8UeA)

## 怎样继续使用这份小册

上架或收到改评时更新对应条目，保留真实体验条件；不把预想突破写成玩家实际顿悟。每次提出新题，先与这些关键发现比较，避免只换外形重复已经掌握的套路。具体设计卡、反例和反馈循环见[持续设计方法](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/methodology.md)。
