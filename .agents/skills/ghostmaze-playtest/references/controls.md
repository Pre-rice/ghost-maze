# 操作与文字棋盘

本文件只说明如何表达位置和发送输入。discover模式也可读取；不解释元件行为。

横坐标x从左到右，纵坐标y从上到下，均从1开始；楼层从低到高编号，1为底层。grid.rows每行用空格分隔：`·`已显示地板，`?`未探索格，`×`虚空；P玩家、G鬼、K钥匙、E终点、S楼梯、B按钮、O出生点。同格只画一个主标记，完整内容看entities。画布外为地图外部。格子轮廓与网页一致，不能因未探索便把整个轮廓隐藏。

entities逐项列元件位置：player玩家、spawn出生点、exit终点、ghost鬼（count表示同格数量）、key钥匙、button按钮、stair楼梯。同格可列多个元件。按钮facing为其附着方向；楼梯direction为图形朝向。所有坐标均用`[x,y]`。

edges列出可见的内部非空墙段：between的两格相邻；kind为wall墙、door普通门、number-door数字门、one-way-door单向门、glass玻璃、letter-door字母门。字母门另列letter和state；数字门列number；单向门列direction。这里的名称是图例，不表示可通过或不能通过。

相邻活动格间，至少一格已显示且没有edges记录时，该边为空通道；两格均未知且未列边时，该边未知。地板与虚空／地图外的边界均为实墙。不能仅凭格子相邻就忽略edges。

board只返回当前查看层。player.layer是真实玩家层，board.layer是查看层。当前层地形、元件和墙门均按网页可见条件过滤，未探索内容不会列出。stats为网页状态信息，status为playing／won／stopped。

可发送：U上、D下、L左、R右、STAIR使用楼梯。物件所需的朝向输入也用四方向发送。每次只发送一个，是否生效观察返回的change.effective。不要自行增加等待、远程按钮等输入。

view切换查看楼层，observe重新观察，不产生游戏动作。undo撤销、redo重做、reset回地图初态、restart回本次起点（存档试玩时回原存档），checkpoint建立点，load载入点，deleteCheckpoint删除点。load重建所含路线和撤销序列，不保留加载前的可撤销分支；完整审计记录仍保留。

通过history回看自己已经发生的可见观察。它不提供未来、潜在走法或解题提示。探索全图只在用户明确允许且开局设置中记录时开放，不能为方便自行开启。
