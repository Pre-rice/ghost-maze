# 执行引擎

资产`assets/playtest.js`是一个自包含的JavaScript表达式，执行后返回API；`assets/target.js`是独立的目标步数准备表达式。两者携带本体规则与本地压缩组件，无网络、Node、DOM、npm或外部包依赖。不要把资产当文档展开阅读。`assets/manifest.json`记录引擎版本、来源哈希和资产哈希。

## 普通聊天：直接JavaScript

使用宿主实际提供的资源读取和JavaScript执行能力。确认能加载完整资产，执行表达式，并在下一次执行中取回session。不能以“能预览代码”代替实际连续调用验证；不能编造读文件、持久存储或代码执行工具。

如果宿主提供`skills.read`和代码执行器的`store/load/text`，可在执行器内读取资源页，拼接后求值，只把返回的公开局面传给模型。以下tools方法名按宿主实际暴露的名称使用；package与main_resource取自已安装skill的元数据，不猜ID：

```js
// 只在执行器内部加载，读取结果不通过text输出。
const pieces = [];
let cursor;
do {
  const page = await tools.skills__read({
    package: SKILL_PACKAGE,
    resource: MAIN_RESOURCE.replace(/SKILL\.md$/, 'assets/playtest.js'),
    ...(cursor ? { cursor } : {})
  });
  pieces.push(page.contents);
  cursor = page.next_cursor;
} while (cursor);
const source = pieces.join('');
const gm = (0, eval)(source);
store('ghostmaze/source', source);
const result = gm.start({ source: MAP_URL, rules: 'known', challenge: 'normal',
  priorKnowledge: '结合实际对话填写', inheritedExperience: '' });
store('ghostmaze/session', result.session);
text({ board: result.board, info: result.info });
```

读取资源必须取得完整原文；页面未齐、返回截断或求值失败时先解决装载问题，不能删减规则重写。若宿主提供的是本地文件或执行脚本能力，直接装载相同资产，使用等价API；无需强行套用上面的工具名。

后续每次动作由模型先选择，然后执行：

```js
const gm = (0, eval)(load('ghostmaze/source'));
const result = gm.command(load('ghostmaze/session'), 'R'); // 此处只填已选择的一个动作
store('ghostmaze/session', result.session);
text({ board: result.board, info: result.info, change: result.lastEvent.change });
```

观察用`gm.observe(session)`，结果可直接输出（不含session）。控制操作示例：

```js
gm.command(session, { type: 'undo' });
gm.command(session, { type: 'redo' });
gm.command(session, { type: 'reset' });
gm.command(session, { type: 'restart' });
gm.command(session, { type: 'view', layer: 2 });
gm.command(session, { type: 'checkpoint', label: '自己命名的存档' });
gm.command(session, { type: 'load', id: 's3' });
gm.command(session, { type: 'deleteCheckpoint', id: 's3' });
gm.command(session, { type: 'note', kind: 'discovery', text: '当时实际发现的关系' });
```

每个command都要保存返回的session，不能只保存board。`info.checkpoints`返回实际ID，不自己猜。`gm.history(session,{from:1,limit:20})`只返回自己的已发生历史，limit最多100。

确认持久化：一次执行后保存session；下一次重新装载gm，用存储中的session调用observe，核对局面和事件数。用`gm.save(session)`取得恢复码；在另一次执行中用`gm.restore(token)`恢复。没有持久存储时，在每次操作后返回恢复码作为下一次调用输入，保持原样，不解码或改写。具备文件能力时同时保存session和导出记录，恢复码不必每步显示给人。

## 最短目标准备

仅shortest模式在行动前，以与playtest.js相同的方法在执行器内部加载target.js表达式，得到`targetAPI`。调用：

```js
const prepared = targetAPI.prepare(session, { budgetMs: 5000, nodeBudget: 100000, stateBudget: 100000 });
store('ghostmaze/session', prepared.session);
text(prepared.target); // 仅status与steps，绝不输出搜索数据或路线。
```

status为solved时steps才是已证明的N，零步也有效；unknown可在行动前增加预算重算（单次最多30秒、节点／状态各200万）。此时明确说明等待的是目标证明，不能假报N。proven_unsat表示该起点在无新增死亡复活口径下无解。无法确定目标时报告阻塞；普通试玩不加载target，也不能把它用于中间局面查询。

## Codex／有Node的脚本环境

用随包`scripts/play.mjs`适配器，每次从标准输入发送一份JSON；它装载相同资产并原子保存session，标准输出只含公开局面。Node只用于装载与文件保存，不是核心资产的前提。

示例（实际调用用结构化stdin或安全的单引号heredoc，不把用户文本拼成shell代码）：

```sh
node /实际skill路径/scripts/play.mjs --session work/ghostmaze-playtest/session.json <<'JSON'
{"op":"start","source":"用户提供的地图链接","rules":"known","challenge":"normal","priorKnowledge":"实际情况"}
JSON
```

后续标准输入请求：

```json
{"op":"command","command":"R"}
{"op":"command","command":{"type":"undo"}}
{"op":"observe"}
{"op":"target","budget":{"budgetMs":5000,"stateBudget":100000}}
{"op":"export","file":"work/ghostmaze-playtest/record.json"}
{"op":"restore","token":"原样恢复码"}
```

这些是分别发送的请求，不能合成动作序列或程序循环选路。脚本失败时先处理真实错误，不手改会话或用其他求解命令替代。Codex在仓库中可能已自动读到AGENTS或设计资料，必须记录先验信息，不能将开发上下文伪装成首次盲玩。

## 导出与返回给用户

`gm.export(session)`返回实际trace、笔记、统计、正式站回放和recovery。将完整对象保存为文件；给人只呈现报告所需的摘要与附件，不一次输出全部trace。记录是AI试玩，不是真人反馈。没有文件写入能力时，保存对象到可用持久存储并交付紧凑恢复码，明确文件未导出。

地图、回放链接只用`https://ghostmaze.novic.cc/`。不打开网页、不自动展示侧边页、不上传试玩记录到外部服务。
