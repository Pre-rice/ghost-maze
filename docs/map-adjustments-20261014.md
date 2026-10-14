# 地图调整：本轮成果与保留项

2026-10-14。你的五份优化地图已按原码更新，《周转》《同行》已加入；[地图集](https://ghostmaze.novic.cc/maps.html)现十三张，顺序仍按首次发现。旧图、旧参考、证据与评述保留。下面七份是我自行尝试的候选，**未替换地图集**。

我此前的精简审查偏重“删掉是否还能解”，没有充分检查搬移元件和重写布局；这只能发现局部必要，不能证明当前表达已经紧凑。本轮把调整分成三个方面：

- **精简：** 保留玩家需要发现和安排的关系，减少只用于到达已知操作位的赶路；同时检查移动按钮、出生与目标。涉及控距、视线或未来条件的路段不能直接删。
- **优美：** 观察轮廓、虚空和标签拥挤。环形留空可以保留；融入形状而不增加任务的死路也可以增加。钥匙等兴趣点尽量与鬼分开，是否保留为引导要单独考虑。
- **增强：** 可选。由收尾需要倒推新的准备条件，而不是添加重复操作。多按几次按钮可以来自更深的条件，也可能只是繁杂；少按同样不自动意味着削弱。

进一步的判断是把“关键发现仍存在”和“完整流程不变”分开验收：前者可支持较大重排，但必须注明删去了哪些条件；后者才适合称为保持解谜过程的精简。新格、换位置、移钥匙都可能改变鬼的时序与普通解法，不能套模板批量处理。已写入[持续设计方法](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/methodology.md#调整已有地图精简优美增强)，以后新图和旧图都执行。

| 候选 | 格数变化 | 最优步数变化 | 试玩 |
| --- | --- | --- | --- |
| 归途·钥匙移位 | 18→18 | 39→39 | [试玩](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcARAhwEwS4FAQC5AcgOAacAAVAAJAKAtZgXEC5yBECIAACAGBQCEGGA) |
| 回位·控制并置 | 16→16 | 35→35 | [试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIPwiAACAKguAXOAcAcAVAAAAAXOQXOcgUgRAuIAAAAwQAwgQAwggQ) |
| 后路·轮廓整理 | 23→24 | 59→59 | [试玩](https://ghostmaze.novic.cc/?map=AADA8PDw8DAwMDELIDB8CcecBZAfhSgXAQBcgpwAAAOZAoM5sQOY5AIEZgJAWICoCQCADDAAMDDCAQ) |
| 暂驻·紧凑版 | 26→24 | 39→37 | [试玩](https://ghostmaze.novic.cc/?map=AADAEPjY-Lj4AAECoCy6AQgBBVyBAIC4BGRVQAAAQIISqCKFRCCAAAAAQAA) |
| 暂驻·轮廓版 | 26→26 | 39→37 | [试玩](https://ghostmaze.novic.cc/?map=AADAEPj4-Pj4AAEC4C3KASgBBVyAAQFwAZFVAAABAghKoIoVEIIAAAABAA) |
| 同行·轮廓整理 | 19→20 | 51→51 | [试玩](https://ghostmaze.novic.cc/?map=AADAAODg_Hh4AAFbIEVQEBCAPBACgIA5UBQ0cCqAAAAAQBARxCEFhiAAAAgMAA) |
| 再借·窄环版 | 21→19 | 44→27 | [试玩](https://ghostmaze.novic.cc/?map=AADAAHhobHh4AAFR4DAyACAABVAQCQJAAqgAAAAQglQMVyFOQBAAAAAI) |

## 各项调整

### 1. 归途·钥匙移位

钥匙从鬼出生格移到相邻必经格，避免初始叠放。全部三条最优动作完全不变；不增加任务与赶路。

[试玩](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcARAhwEwS4FAQC5AcgOAacAAVAAJAKAtZgXEC5yBECIAACAGBQCEGGA) · [参考回放（含解法）](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcARAhwEwS4FAQC5AcgOAacAAVAAJAKAtZgXEC5yBECIAACAGBQCEGGA&replay=CN9_vk0IJ9WgM-pboz4I)

### 2. 回位·控制并置

下方B移到右下角，与A的操作位置相邻。前段动作重排，总步数不变；全部最优的按钮顺序与按下时鬼的安置状态保持。主要改善控制集中程度，未声称增强。

[试玩](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIPwiAACAKguAXOAcAcAVAAAAAXOQXOcgUgRAuIAAAAwQAwgQAwggQ) · [参考回放（含解法）](https://ghostmaze.novic.cc/?map=AADAAOHg4ODgAAE-gIKgfIPwiAACAKguAXOAcAcAVAAAAAXOQXOcgUgRAuIAAAAwQAwgQAwggQ&replay=CMeDaTsveXKdACDNIhg)

### 3. 后路·轮廓整理

将终点与3钥匙门搬进左上缺口，仍只允许从原左房进入；右侧凹口填为单入口死路。左上不再扭曲突出，右侧边界更齐；最优路线只把最后向左改为向右，钥匙次序与0门关系保持。

[试玩](https://ghostmaze.novic.cc/?map=AADA8PDw8DAwMDELIDB8CcecBZAfhSgXAQBcgpwAAAOZAoM5sQOY5AIEZgJAWICoCQCADDAAMDDCAQ) · [参考回放（含解法）](https://ghostmaze.novic.cc/?map=AADA8PDw8DAwMDELIDB8CcecBZAfhSgXAQBcgpwAAAOZAoM5sQOY5AIEZgJAWICoCQCADDAAMDDCAQ&replay=CADZ4h2PJm9VxgD6r6PMlfnYAow)

### 4. 暂驻·紧凑版

出生、终点各内移一格，去掉两个纯赶路格。全部最优路线删去首尾各一步，鬼安置与按A前后关系保持。保留中间两处环形留空。

[试玩](https://ghostmaze.novic.cc/?map=AADAEPjY-Lj4AAECoCy6AQgBBVyBAIC4BGRVQAAAQIISqCKFRCCAAAAAQAA) · [参考回放（含解法）](https://ghostmaze.novic.cc/?map=AADAEPjY-Lj4AAECoCy6AQgBBVyBAIC4BGRVQAAAQIISqCKFRCCAAAAAQAA&replay=GMAAJJtRANlf8AqXbwIA)

### 5. 暂驻·轮廓版

同样移动出生与终点，再把中央两处虚空补为单入口死路，保留A的墙面。与紧凑版的全部最优路线相同；轮廓更完整，但多了两处死路边界，是否更美观由你判断。两版是同一图的互斥备选。

[试玩](https://ghostmaze.novic.cc/?map=AADAEPj4-Pj4AAEC4C3KASgBBVyAAQFwAZFVAAABAghKoIoVEIIAAAABAA) · [参考回放（含解法）](https://ghostmaze.novic.cc/?map=AADAEPj4-Pj4AAEC4C3KASgBBVyAAQFwAZFVAAABAghKoIoVEIIAAAABAA&replay=GNgj2INRANlf8AqXbwIA)

### 6. 同行·轮廓整理

A旁左下凹口补成只向上连接的单入口死路，B的墙面保持。全部十二条最优动作完全不变，包括最后按A前主动引出第三鬼；主要整理左侧轮廓。

[试玩](https://ghostmaze.novic.cc/?map=AADAAODg_Hh4AAFbIEVQEBCAPBACgIA5UBQ0cCqAAAAAQBARxCEFhiAAAAgMAA) · [参考回放（含解法）](https://ghostmaze.novic.cc/?map=AADAAODg_Hh4AAFbIEVQEBCAPBACgIA5UBQ0cCqAAAAAQBARxCEFhiAAAAgMAA&replay=CL5gJignYL3YKjFWAyJPWdw8)

### 7. 再借·窄环版

左环由三列收成两列，出生内移，保留中部一段分隔墙，防止新增横向近路绕过重引。最优44→27，仍必须让真正停过的鬼再次移动，在转角阻挡目标鬼；这是全部无伤通关必要。A由三次减到一次，外围门态准备减少，因此不是完整流程等价的精简，请重点判断这项取舍。

[试玩](https://ghostmaze.novic.cc/?map=AADAAHhobHh4AAFR4DAyACAABVAQCQJAAqgAAAAQglQMVyFOQBAAAAAI) · [参考回放（含解法）](https://ghostmaze.novic.cc/?map=AADAAHhobHh4AAFR4DAyACAABVAQCQJAAqgAAAAQglQMVyFOQBAAAAAI&replay=CIxe4NrJ3erAnDNc)

## 未采用的改法

审查覆盖你没有改动的八张图；没有合适版本的保留原图，没有为了凑候选追加机关。

| 原图 | 尝试与不采用原因 |
| --- | --- |
| 归途 | 去掉最下方一行、把出生上移会无解；该处承担引鬼与脱身，本轮只挪钥匙。 |
| 回环 | 下方压一行会无解；把鬼位钥匙移到邻格会出现27步、不按任何按钮的解，跳过原控制核心。暂未找到保核心的调整。 |
| 回位 | 终点内移出现13步捷径，绕过后半题；将下方B上移反而多赶路。仅保留控制并置版。 |
| 换边 | 钥匙下移虽避免叠放，但最优28→22、A四次→两次，跳过原门态环节；压缩上方控制房无解。原图暂保留，初始钥匙与鬼重合尚未找到合适调整。 |
| 后路 | 让搬后的终点从正下方进入，会绕过原上层B准备，不能称为同过程精简。当前轮廓版保留原左房入口。 |
| 再借 | 只缩窄左环时，27步最优仍重引，但另有31步普通解绕过此关键；补回一段实墙后该捷径被排除。改为普通门则出现最优重合，拒绝。当前候选仍减少外围门态准备，单独注明。 |
| 同行 | A移近后可48步通关，但最后按A时第三鬼仍在下方，按A前提前引出的关键失去必要；保留A，只填轮廓。 |

## 验收与实际限制

七份候选均可独立试玩；全部并列最优无鬼重合，地图与操作码往返、去掉终点后的安全、鬼编号和排列无关通过。中性开局与指定实际入场均核对；回位从外部先到右下角，再到出生点，两步过程中鬼不动。整图复用仍要按实际入口、外部鬼与资源重验。

其中五份候选的全部最优动作与原图可一一对应；回位验证了全部最优的控制与鬼安置阶段；再借验证了核心关系仍为全部无伤通关必要，明确不声称全部流程或难度不变。美观由实际效果与用户判断决定，机械验收不代替审美或趣味。

你提供的《换岗》新版初态能被鬼看见，外部进入当步也会改变鬼位；已按原码发布，独立试玩通过，但没有把它记为中性入场单元。这是本轮唯一已确认上架版本的入场差异。

本轮没有启动训练，也没有把这些亲缘调整增加为独立好评样本。当前地图集保持已获授权的十三图；自行候选只有你认可后才更新。
