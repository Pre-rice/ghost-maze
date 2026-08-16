# 分享码协议 v2（PROTOCOL_VERSION = 0x02）

> 分享码 = `base64url( deflateRaw( 位打包字节流 ) )`。协议版本号烧在**未压缩字节流首字节**。
> 设计目标：**秒解读**（纯线性位流、零启发式）+ **码尽可能短**。
> v1 旧码不兼容（无版本号、靠剩余字节启发式解码），已随 v2 上线全部失效——用户已把关接受。

## 一、字节流布局（压缩前的字节序列）

| 偏移 | 内容 | 说明 |
|---|---|---|
| 0 | 版本号 | 固定 `0x02`，其他值 = 无效码 |
| 1 | width | 1 字节（0 < w ≤ 64） |
| 2 | height | 1 字节（0 < h ≤ 64） |
| 3 | modeByte | bit0: gameMode（0=exploration, 1=death-loop）<br>bit1: editorMode（0=regular, 1=free）<br>bit2: multiLayerMode<br>bit3-7: 保留（恒 0） |
| 4 | initialHealth | 1 字节 |
| 5-6 | initialStamina | 2 字节大端 |
| 7-8 | endPos | `x,y`；`0xFF,0xFF` = 无 |
| 9-10 | **[仅 free]** customStartPos | `x,y`；`0xFF,0xFF` = 无 |
| 之后 | **[仅 free]** activeCells 位图 | row-major 连续位，`ceil(w*h/8)` 字节，末字节补 0 |
| 之后 | 鬼列表 | count 1 字节 + 每项 `x,y` 2 字节 |
| 之后 | 钥匙列表 | count 1 字节 + 每项 `x,y` 2 字节 |
| 之后 | 按钮列表 | count 1 字节 + 每项 `x,y,方向码,letter` 4 字节（方向码：上=0/下=1/左=2/右=3；letter 为 ASCII 码） |
| 之后 | **墙体位流**（见下） | hWalls 先行（y=0..h, x=0..w-1）再 vWalls（y=0..h-1, x=0..w），**每行结束对齐到字节边界**（行内打包，见第二节） |
| 之后 | **墙体参数队列** | **1 字节长度前缀** + 与墙体扫描同顺序的字节队列（LOCKED keys / ONE_WAY 方向码 / LETTER_DOOR letter+state）。解码端按行宽公式跳过墙体位流后读长度前缀精确取本层参数；多层时长度前缀让每层参数精确定界（参数之后是后续层数据） |
| 之后 | **[仅多层]** layerCount | 1 字节 |
| 之后 | **[仅多层]** 楼梯列表 | count 1 字节 + 每项 `x,y,layer,方向` 4 字节（方向：0=up, 1=down） |
| 之后 | **[仅多层]** 每层（layerIdx = 1..layerCount-1） | 见下 |

## 二、墙体位流与参数队列（唯一使用位打包的区域）

**行内打包 + 行间对齐**：墙体类型按「每行 3 bit/墙」连续写入位流，**每行结束 flush 对齐到字节边界**（当前字节剩余低位补 0），下一行从新字节开始。hWalls 共 h+1 行、每行 w 面墙；vWalls 共 h 行、每行 w+1 面墙。

| 墙类型 | 类型位（3 bit） | 参数队列追加（字节） |
|---|---|---|
| EMPTY(0) / SOLID(1) / DOOR(2) / GLASS(5) | 无 | — |
| LOCKED(3) | — | keys 1 字节 |
| ONE_WAY(4) | — | 方向码 1 字节（上=0/下=1/左=2/右=3） |
| LETTER_DOOR(6) | — | letter 1 字节（ASCII）+ initialState 1 字节（1=open, 0=closed） |

位序：MSB-first（每个数值先写最高位）。**墙体参数不写入位流**——按墙体扫描顺序收集为独立字节队列，紧随墙体位流之后（见第一节布局表）。

**为什么这么设计**（压缩效率实验结论，10×10 demo 实测码长）：参数若交错写进位流会打碎连续 EMPTY 形成的 0x00 字节游程，deflate 压缩率骤降（交错参数连续位流实测 92 字符）；行内 3bit + 行间对齐让 EMPTY 行成为整行 0x00 游程，参数独立队列保持墙体位流纯净（实测 60 字符，v1 nibble 为 66 字符）。

解码端墙体位流长度可按尺寸公式预计算（`Σ ceil(w×3/8)` + `Σ ceil((w+1)×3/8)`），跳过位流后读 1 字节长度前缀即可精确取得本层参数——**线性解码、零启发式**。参数队列读取完毕后必须恰好耗尽（与长度前缀不符即无效码）；全部字段读完时流也必须恰好耗尽（多余字节 = 无效码）。

第 0 层墙体来自顶层字段（`hWalls`/`vWalls`）；多层时第 0 层即 `layers[0]` 的数据（编辑器装配时顶层字段与 layers[0] 同引用）。每层（含第 0 层）的墙体位流 + 参数队列各自独立（层间无共享）。

## 三、多层每层布局（layerIdx = 1..layerCount-1）

| 内容 | 说明 |
|---|---|
| activeCells 位图 | row-major 连续位，`ceil(w*h/8)` 字节（层数据缺失时全 true） |
| customStartPos | `x,y`；`0xFF,0xFF` = 无 |
| endPos | `x,y`；`0xFF,0xFF` = 无 |
| 按钮列表 | count + 每项 4 字节（格式同顶层） |
| 鬼列表 | count + 每项 2 字节 |
| 钥匙列表 | count + 每项 2 字节 |
| 墙体位流 + 参数队列 | 同第 0 层（每层独立） |

> 第 0 层**不重复编码**：其数据即顶层字段（hWalls/vWalls/endPos/activeCells/customStartPos/鬼/钥匙/按钮）。解码产物 `layers[0]` 直接引用顶层数据（与 v1 行为一致）。

## 四、解码产物形状

```js
{ success: true, data: {
  gameMode: 'exploration' | 'death-loop',
  initialHealth, initialStamina,
  mapData: {
    width, height,
    hWalls, vWalls,            // 墙对象 {type, keys:0, [direction], [letter], [initialState], [currentState]}
    endPos, initialGhosts: [{x,y}], items: [{x,y,type:'key'}], buttons: [{x,y,direction,letter}],
    editorMode, customStartPos, activeCells,
    multiLayerMode, layerCount, layers, stairs: [{x,y,layer,direction}]
  }
}}
```

**无 v1 的 mapStartPos / playerStartLayer 残留字段**：出生点统一由 MapDefinition 正式路径推导（regular = 顶层固定 {1,height-2}；free = 各层 customStartPos；起点层 = 带 customStartPos 的层）。

## 五、失败路径

解码时任何读越界（位流/字节流）或版本号不匹配 → 捕获后返回 `{ success:false, error:'分享码无效或已损坏。' }`，**绝不抛裸异常、绝不静默产出 NaN**。入口校验：width/height 必须为 1-64 的整数。

## 六、压缩与编码

`deflateRaw`（RFC 1951，pako / node:zlib 互操作）→ base64url（`+`→`-`，`/`→`_`，去 `=`）。URL 参数 `?map=` 直接承载同一字符串。
