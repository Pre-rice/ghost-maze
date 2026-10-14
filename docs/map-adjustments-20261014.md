# 地图调整：本轮处理与反思

2026-10-14。地图集仍为十三张，名称和首次交付顺序保持。按你的决定，《回位》《同行》保留原版；《归途》《后路》《暂驻》《再借》采用获准改稿。

| 地图 | 当前调整 | 格数 / 最优步数 | 试玩 |
| --- | --- | --- | --- |
| 归途 | 钥匙与鬼的初始位置分开，动作不变 | 18 / 39 | [试玩](https://ghostmaze.novic.cc/?map=AADAwEDg4ODg4AED4CFcARAhwEwS4FAQC5AcgOAacAAVAAJAKAtZgXEC5yBECIAACAGBQCEGGA) |
| 后路 | 整理轮廓，清除遗留边界门 | 24 / 59 | [试玩](https://ghostmaze.novic.cc/?map=AADA8PDw8DAwMDELIDB8CcecBZAfhSgXAQBcgpwAAAOZAoLNiBzHIBAjMBICxAVASAQAYYABhhAI) |
| 暂驻 | 采用轮廓版，减少首尾赶路 | 26 / 37 | [试玩](https://ghostmaze.novic.cc/?map=AADAEPj4-Pj4AAEC4C3KASgBBVyAAQFwAZFVAAABAghKoIoVEIIAAAABAA) |
| 再借 | 缩窄左环、删除外围准备，保留重新招回鬼的核心 | 19 / 27 | [试玩](https://ghostmaze.novic.cc/?map=AADAAHhobHh4AAFR4DAyACAABVAQCQJAAqgAAAAQglQMVyFOQBAAAAAI) |

《后路》原调整稿搬了终点，却漏掉原门；旧门落在外边界，绘制又没有显示数字，因此像空标签门。现已改成实墙，并修正本体：门和玻璃只能在两个活动格之间；非法导入和导出会拒绝，编辑器无法把边界设成这些元件，删格不留下门，游戏与编辑显示都以墙画边界。合法0数字门与边界按钮仍可使用。

本体修正不改变原上架十三图的全部最优动作、可达局面与参考回放；旧十五图规划事实亦通过同样物理对照。四份维护图全部最优安全、无鬼重合、指定实际入场与码往返通过。《再借》禁止真实重新招回并阻挡另一鬼后，两版均穷尽无解，核心保留；这不等于完整旧流程或难度不变。

两仓统一验收通过；31项网页专项覆盖边界编辑、非法载入、四图求解／逐步回放、十三旧图回放与手机地图集。未访问正式站或检查部署。

## 反思

此前认为控制集中会改善《回位》，忽略B在2×3区域中央的匀称；现在保留原构图，短距离本来就无需压缩。此前把《同行》普通转角叫成凹口，填了没有实际改善的格；现在先判断轮廓是否有明确问题，不能机械套用填空。

《暂驻》得到的审美肯定支持针对实际缺口整理；《再借》则支持保留关键发现后大胆重排，删去不服务核心的准备。以后分别检查推理、执行和构图：更短不自动更好，增加死路也不自动更美。边界合法性必须先于求解，不能把通关证书当成设计和本体没有问题的证据。

原图、七份评审时原件、当时证据与真实评述保留，见[候选档案](https://github.com/Pre-rice/ghost-maze-ai/blob/main/examples/map-adjustment-candidates-20261014/README.md)和[本轮反馈](https://github.com/Pre-rice/ghost-maze-ai/blob/main/docs/archive/reviews/map-maintenance-review-20261014.md)；当前地图设计思想见[设计小册](map-design-guide.md)。完成验收、推送后停下，没有继续新图设计或训练。
