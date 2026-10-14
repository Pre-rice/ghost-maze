# 地图集设计小册

更新：2026-10-14。这里按首次交付／发现记录的顺序，简要总结目前上架的十三张图。**正文包含解谜关键；准备首次试玩时请直接访问[无图地图集](https://ghostmaze.novic.cc/maps.html)。** 各图只列当前地图与参考，历史改图和完整反馈在[总目录](ai-map-catalog.md)。

“关键发现”分为你明确确认的尤里卡时刻、带提示／回放后的发现，以及设计者预期但尚未获确认的认识变化。《周转》《同行》的新评述及五图优化见[本轮记录](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/map-adjustments-20261014.md)。

本轮四份获准维护、《回位》《同行》取消稿与边界修正见[反馈及反思](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/map-maintenance-review-20261014.md)。

《错位》《接力》《再借》的关键也依据你[本次明确总结](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/recruited-return-review-20261013.md#本次重整的设计方向)。

“不错”不等于已达到精妙目标。基本数量来自当前地图集；《借影》为获准维护版，不把维护当新作品。

| 顺序 | 地图 | 首次交付 | 格 / 鬼 / 钥匙 | 主要机制 |
| --- | --- | --- | --- | --- |
| 1 | [《错位》](#1-错位) | 2026-09-30 | 11 / 1 / 0 | A/B 字母门、普通门；玻璃仅供观察 |
| 2 | [《接力》](#2-接力) | 2026-10-09 | 15 / 2 / 0 | A/B 字母门，三个操作站位 |
| 3 | [《归途》](#3-归途) | 2026-10-09 | 18 / 2 / 1 | A/B 字母门、单向门、钥匙门 |
| 4 | [《借影》](#4-借影) | 2026-10-09 | 24 / 2 / 1 | A/B/C 字母门、钥匙门 |
| 5 | [《回环》](#5-回环) | 2026-10-10 | 23 / 3 / 2 | A/B/C 字母门、钥匙门 |
| 6 | [《回位》](#6-回位) | 2026-10-10 | 16 / 2 / 0 | A/B 字母门，四个操作站位 |
| 7 | [《换边》](#7-换边) | 2026-10-12 | 11 / 1 / 1 | A 字母门、普通门、钥匙门 |
| 8 | [《换岗》](#8-换岗) | 2026-10-12 | 22 / 2 / 2 | A/B 字母门、普通门、钥匙门 |
| 9 | [《后路》](#9-后路) | 2026-10-12 | 24 / 2 / 3 | A/B 字母门、普通门、钥匙门、0 门 |
| 10 | [《暂驻》](#10-暂驻) | 2026-10-13 | 26 / 2 / 0 | 一个 A 按钮、两扇反相 A 门、一扇 0 门 |
| 11 | [《再借》](#11-再借) | 2026-10-13 | 19 / 2 / 0 | 一个 A 按钮、两扇反相 A 门、一扇普通门 |
| 12 | [《周转》](#12-周转) | 2026-10-14 | 15 / 2 / 0 | A/B字母门、普通门；用户优化版 |
| 13 | [《同行》](#13-同行) | 2026-10-14 | 19 / 3 / 0 | A/B字母门、普通门、单向门；追者互相占位 |

## 1. 错位

**设计思想：** 鬼挡住入口，直接靠近不能解决，开门也不等于清路。按钮操作也会推进鬼。借切门让鬼靠近到能够触发追逐的位置，再把它引离入口。

**关键发现：** 从‘门开了就能过’改为‘先借按门把鬼引活，再清空入口’。你已明确确认这个关键。

**你的简评：** ‘太妙了！好设计！’；同时指出左上 B 门无作用。保留好评，也保留冗余意见。 [评述依据](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/worklogs/status-before-reorganization-20261013.md)。

**本轮调整：** 缩至11格，A/B相邻，去掉左上掉头空间。最后借B引近鬼之前必须准备B关闭，按A保护操作，再按B开放绕行；压缩赶路同时增加门态准备的推理要求。

[试玩](https://ghostmaze.novic.cc/?map=AWM4wGBgYWBgwMDo1CDFpODAwLBApsGBoYCLAQgcVFhBXBCLAQA) · [参考解法](https://ghostmaze.novic.cc/?map=AWM4wGBgYWBgwMDo1CDFpODAwLBApsGBoYCLAQgcVFhBXBCLAQA&replay=AAJ-1OUyFXgAyMlXAw)

## 2. 接力

**设计思想：** 关门保护自己会同时堵住目标，重新开放又会解除保护。先引出另一只鬼并准备隔离，再借靠近门的按钮困鬼，让保护和通路分阶段交接。

**关键发现：** 开关不仅用于开路，站位与切门配合可以困鬼；而这个操作还需要先安排另一只鬼。你已明确确认。

**你的简评：** ‘妙！’‘想了好久才想出来’‘媲美第一张图’。有实际保留通关分支，不能据录制长度反推思考时间。 [评述依据](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/twin-handoff-review-20261009.md)。

**本轮调整：** 填去中央虚空，15格。新增单入口死路融入外形，不增加任务或新的最优关键；不能因为不在解法上就自动删掉。

[试玩](https://ghostmaze.novic.cc/?map=AADAAPBwcHBgAAENgIIgWoBA5hAFUEgOADgCBQAAAAFziBVAnIEQJAAAAAEECEA) · [参考解法](https://ghostmaze.novic.cc/?map=AADAAPBwcHBgAAENgIIgWoBA5hAFUEgOADgCBQAAAAFziBVAnIEQJAAAAAEECEA&replay=CN5HYT8_AVmXDeZACA)

## 3. 归途

**设计思想：** 两只鬼的保护安排不能各自独立完成。先转移第一只鬼的困住位置，才能安排第二只鬼并恢复通路。

**关键发现：** 预期改变是‘前一只鬼的最终位置，要为后一只鬼准备条件’；你认可了关系，但指出可以线性推导，没有确认顿悟。

**你的简评：** ‘不错的图’，想出解法不难；单向门的用途过于明显。 [评述依据](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/permanent-return-review-20261009.md)。

**本轮维护：** 钥匙移到相邻必经格，清除与鬼的初始叠放，全部三条最优动作保持；按本轮“其余改稿”授权采用，没有单独新增质量评价。

[试玩](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcARAhwEwS4FAQC5AcgOAacAAVAAJAKAtZgXEC5yBECIAACAGBQCEGGA) · [参考解法](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcARAhwEwS4FAQC5AcgOAacAAVAAJAKAtZgXEC5yBECIAACAGBQCEGGA&replay=CN9_vk0IJ9WgM-pboz4I)

## 4. 借影

**设计思想：** 开上方通路会撤销原来的安全安排，单靠临时困鬼不能完成往返。提前关闭未来停位上方的 A 门，再拉开身位、切换视线，把鬼引到门下；走位本身也是安置工具。

**关键发现：** 不用等鬼到位后再关门，可以先关门，再靠控距与引导把鬼送到其下方。你看参考回放后明确评价‘妙，好设计’。

**你的简评：** 正反馈来自看回放后的发现，不能记为无提示独立解出。当前为用户2026-10-14优化版：保留控距安置，轮廓更匀称、删两B门，只留一钥匙；全部最优无重合。原59步维护版留档。 [评述依据](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/borrowed-shelter-review-20261010.md)。

**本轮调整：** 用户把外形修得更匀称，A/C靠近，删去两个无必要B门，只留一把任务钥匙。第二钥匙可作为引导兴趣点，是否保留由难度与审美决定；钥匙避免与鬼初始位重合。

[试玩](https://ghostmaze.novic.cc/?map=AADAwMHh4eHh4AEFICF8AHA2gV4EQiQCAAWQFcDkA44ABVAAEAQE4gucQTiCEEIAAAgggBBiBBg) · [参考解法](https://ghostmaze.novic.cc/?map=AADAwMHh4eHh4AEFICF8AHA2gV4EQiQCAAWQFcDkA44ABVAAEAQE4gucQTiCEEIAAAgggBBiBBg&replay=GOgozp8CP3SYXwKolf2oMzIYAA)

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

**本轮调整：** 左上扭曲与右侧凹口整理，钥匙移开鬼位；A门封右下掉头位，要求在合适门态到左上掉头。新版初态能被鬼看见，指定外部进入当步会改变鬼位，暂只声明独立试玩可用。

[试玩](https://ghostmaze.novic.cc/?map=AADA8PDw8DAwMAELIC90BHOAsgPwpQZgOEC5kKcAAOAKAALEDmOQACMwFQEgJAAAQYACGAGEAg) · [参考解法](https://ghostmaze.novic.cc/?map=AADA8PDw8DAwMAELIC90BHOAsgPwpQZgOEC5kKcAAOAKAALEDmOQACMwFQEgJAAAQYACGAGEAg&replay=AIsip9aPJm9eCg2fXDqvyMlVeACZv-oD)

## 9. 后路

**设计思想：** 眼前钥匙可以安全拿，却可能破坏以后撤离和重新开门的条件。暂留下方钥匙，先消费 0 门并安排鬼的位置，把后路准备好再取物。

**关键发现：** 预期改变是‘现在能拿不代表现在该拿’；你认可取物顺序和规划，但认为推理仍偏线性。

**你的简评：** ‘不错，比上一张有进步’，不久就想到；仍期待新意与再次眼前一亮。 [评述依据](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/deferred-key-cold-entry-review-20261012.md)。

**本轮维护：** 终点及3钥匙门搬入左上，右侧轮廓补齐；用户评价“改得不错”。原稿遗留边界门已改为墙，四条最优仍59步，钥匙次序与0门关系保留。

[试玩](https://ghostmaze.novic.cc/?map=AADA8PDw8DAwMDELIDB8CcecBZAfhSgXAQBcgpwAAAOZAoLNiBzHIBAjMBICxAVASAQAYYABhhAI) · [参考解法](https://ghostmaze.novic.cc/?map=AADA8PDw8DAwMDELIDB8CcecBZAfhSgXAQBcgpwAAAOZAoLNiBzHIBAjMBICxAVASAQAYYABhhAI&replay=CM7ofIaPJm9VxgD6r6PMlfnYAow)

## 10. 暂驻

**设计思想：** 暂时帮玩家到达按钮的鬼，随后又挡住打开的出口。借另一只鬼的追击阻挡安排停位；按 A 保护身后、打开出口后，还要再次引走暂驻鬼清路。

**关键发现：** 预期改变是‘有用的停车点，之后会变成障碍’。你肯定简洁与挑战性，尚未明确确认顿悟体验。

**你的简评：** ‘是好图’，设计很简洁，也有一定挑战性；明确要求加入地图集。 [评述依据](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/temporary-stay-review-20261013.md)。

**本轮维护：** 采用轮廓版，用户评价“不错，美观了很多”；出生与终点内移，中央两处虚空融入外形。全部最优省去首尾两步，核心安置关系保持。

[试玩](https://ghostmaze.novic.cc/?map=AADAEPj4-Pj4AAEC4C3KASgBBVyAAQFwAZFVAAABAghKoIoVEIIAAAABAA) · [参考解法](https://ghostmaze.novic.cc/?map=AADAEPj4-Pj4AAEC4C3KASgBBVyAAQFwAZFVAAABAghKoIoVEIIAAAABAA&replay=GNgj2INRANlf8AqXbwIA)

## 11. 再借

**设计思想：** 先把一只鬼安置好后，另一只鬼仍堵着目标；直接引它再退走会继续被追。重新引出先前安置的鬼，让它跟在身后；转向时借它优先追击并占位，挡住另一只鬼，再重新安排当前追鬼。

**关键发现：** ‘重新引动先前安置的鬼，让它帮助阻挡另一只鬼。’威胁成为工具，已解决的安排需要重新启用。你亲自指出并明确肯定。

**你的简评：** ‘妙！’‘这图非常棒，很有新意’，明确要求上架。没有实际操作录制，提示或参考使用情况未报告。 [评述依据](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/recruited-return-review-20261013.md)。

**本轮维护：** 左环缩窄为两列，21→19格、44→27步，删去外围门态准备，仍必须招回先前安置鬼阻挡守卫。用户评价“改得很好”，认可保留核心的大胆简化。原图好评与本轮改稿肯定分开记录。

[试玩](https://ghostmaze.novic.cc/?map=AADAAHhobHh4AAFR4DAyACAABVAQCQJAAqgAAAAQglQMVyFOQBAAAAAI) · [参考解法](https://ghostmaze.novic.cc/?map=AADAAHhobHh4AAFR4DAyACAABVAQCQJAAqgAAAAQglQMVyFOQBAAAAAI&replay=CIxe4NrJ3erAnDNc)

## 12. 周转

**设计思想：** 两处停位与开门顺序相互制约。先把第一鬼暂留左门外，再迁入右房，为操作A留下保护；目标鬼最后安排到左房。

**关键发现：** 找好顺序，三次调动第一只鬼，为最后通路创造条件。你已明确总结此关键。

**你的简评：** “难度一般，但设计还不错”，明确加入地图集。当前为你的15格优化版，A移近后省去无意义赶路；原17格版保留。

[试玩](https://ghostmaze.novic.cc/?map=AADAAABgfHh4AAFngIqgJQQgAAAADlQ4UBwKoAAAAAAkBHOQhBYYgAAAIEMAMA) · [参考解法](https://ghostmaze.novic.cc/?map=AADAAABgfHh4AAFngIqgJQQgAAAADlQ4UBwKoAAAAAAkBHOQhBYYgAAAIEMAMA&replay=AF4gB2knYL3YKi1nCv8)

## 13. 同行

**设计思想：** 先安排右侧停车与A旁回路。最后按A前重新引上暂留下面的鬼，再带着它与目标鬼先后互相占位阻挡，从下方回路脱身。

**关键发现：** 为最优解提前引出已安置鬼，主动准备后续冲突，而非等打开目标后再逐步处理。你已明确总结。

**你的简评：** 双鬼移动冲突机制“利用得淋漓尽致”，明确加入地图集。所有最优都无对称重合；不把这段评述解释为取消规则中的对称重合。

[试玩](https://ghostmaze.novic.cc/?map=AADAAODgfHh4AAFS4EVIEBCANBACgIA5UBQ0cCqAAAAAQBARxCEFhiAAAAgMAA) · [参考解法](https://ghostmaze.novic.cc/?map=AADAAODgfHh4AAFS4EVIEBCANBACgIA5UBQ0cCqAAAAAQBARxCEFhiAAAAgMAA&replay=COK8iZEnYL3YKjFWAyJPWdw8)

《楼间》已按用户2026-10-14决定撤出：每步几乎只有一种选择，没有思考难度。原入门定位、地图与修补历史留在[总目录](ai-map-catalog.md)及[反馈复盘](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/multilayer-rejection-20261014.md)，不改写此前评价。

## 怎样继续使用这份小册

上架或收到改评时更新对应条目，保留真实体验条件；不把预想突破写成玩家实际顿悟。每次提出新题，先与这些关键发现比较，避免只换外形重复已经掌握的套路。具体设计卡、反例和反馈循环见[持续设计方法](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/methodology.md)。
