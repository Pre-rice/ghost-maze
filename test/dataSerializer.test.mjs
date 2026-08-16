/**
 * DataSerializer v3 协议锁测试
 *  1. G1 golden：解码深等 + 重编码确定性 + 码长上限（v3 ≤ v1，防协议膨胀）
 *  2. 墙类型全覆盖图：参数队列（LOCKED/ONE_WAY/LETTER_DOOR）往返
 *  3. free 模式（customStartPos + activeCells 位图）往返
 *  4. 多层模式（楼梯 + 各层独立数据）往返
 *  5. 非法输入干净失败（空码/坏 base64/版本错/截断/参数队列篡改）
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { installBrowserEnv } from './helpers/browser-env.mjs';
installBrowserEnv();

import { test, suite, summary, assert, assertEq, assertDeepEq } from './_assert.mjs';
import { DataSerializer } from '../src/core/dataSerializer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const golden = JSON.parse(readFileSync(join(__dirname, 'golden/maps.json'), 'utf-8'));

suite('dataSerializer');

// ==================== G1 golden 锁定 ====================

test('G1: 解码与 golden canonical 深等', () => {
    const g = golden['G1-demo'];
    const r = DataSerializer.loadFromShareCode(g.code);
    assert(r.success, r.error);
    assertDeepEq(r.data.mapData, g.canonical, 'mapData 解码必须与 golden 一致');
    assertEq(r.data.gameMode, g.gameMode);
    assertEq(r.data.initialHealth, g.initialHealth);
    assertEq(r.data.initialStamina, g.initialStamina);
});

test('G1: 重编码闭环（码长与 golden 一致 = 确定性序列化）', () => {
    const g = golden['G1-demo'];
    const r = DataSerializer.loadFromShareCode(g.code);
    const re = DataSerializer.generateShareCode({
        ...r.data.mapData,
        gameMode: r.data.gameMode,
        initialHealth: r.data.initialHealth,
        initialStamina: r.data.initialStamina
    });
    assert(re.success, re.error);
    assertEq(re.code, g.code, '解码→编码必须逐字节还原（同一压缩实现下）');
});

test('码长上限：v2 ≤ v1（防协议膨胀回归）', () => {
    const g = golden['G1-demo'];
    assert(g.code.length <= g.v1CodeLength,
        `v3 码长 ${g.code.length} 应 ≤ v1 的 ${g.v1CodeLength}`);
});

test('G1: 解码产物无 v1 残留字段（mapStartPos/playerStartLayer）', () => {
    const g = golden['G1-demo'];
    const r = DataSerializer.loadFromShareCode(g.code);
    assert(r.data.mapData.mapStartPos === undefined, '不应有 mapStartPos');
    assert(r.data.mapData.playerStartLayer === undefined, '不应有 playerStartLayer');
});

// ==================== 墙类型全覆盖（参数队列往返） ====================

// 3×3 图：覆盖 EMPTY/SOLID/DOOR/LOCKED/ONE_WAY/GLASS/LETTER_DOOR 全部 7 种墙
const FULL_TYPES = {
    width: 3, height: 3,
    hWalls: [
        [{ type: 1 }, { type: 2 }, { type: 3, keys: 5 }],
        [{ type: 0 }, { type: 0 }, { type: 0 }],
        [{ type: 0 }, { type: 0 }, { type: 0 }],
        [{ type: 4, direction: { dx: 0, dy: -1 } }, { type: 5 }, { type: 6, letter: 'A', initialState: 'open' }],
    ],
    vWalls: [
        [{ type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }],
        [{ type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }],
        [{ type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }],
    ],
    endPos: { x: 2, y: 2 },
    initialGhosts: [{ x: 0, y: 0 }],
    items: [{ x: 1, y: 1 }],
    buttons: [{ x: 2, y: 0, direction: { dx: 1, dy: 0 }, letter: 'B' }],
    editorMode: 'regular',
};

test('全墙类型: 解码关键参数正确（参数队列顺序 = 扫描顺序）', () => {
    const enc = DataSerializer.generateShareCode({ ...FULL_TYPES, gameMode: 'death-loop', initialHealth: 5, initialStamina: 100 });
    assert(enc.success, enc.error);
    const dec = DataSerializer.loadFromShareCode(enc.code);
    assert(dec.success, dec.error);

    const md = dec.data.mapData;
    assertEq(md.hWalls[0][2].type, 3);
    assertEq(md.hWalls[0][2].keys, 5, 'LOCKED keys');
    assertDeepEq(md.hWalls[3][0].direction, { dx: 0, dy: -1 }, 'ONE_WAY 方向');
    assertEq(md.hWalls[3][2].letter, 'A', 'LETTER_DOOR letter');
    assertEq(md.hWalls[3][2].initialState, 'open', 'LETTER_DOOR initialState');
    assertEq(md.hWalls[3][2].currentState, 'open', 'LETTER_DOOR currentState');
    assertEq(md.hWalls[0][1].type, 2, 'DOOR');
    assertEq(md.hWalls[3][1].type, 5, 'GLASS');
    assertDeepEq(md.buttons[0].direction, { dx: 1, dy: 0 }, '按钮方向');
    assertEq(md.buttons[0].letter, 'B', '按钮 letter');
    assertEq(md.items[0].type, 'key', '钥匙类型');
});

test('全墙类型: 解码→再编码→再解码 深等（协议内自洽）', () => {
    const enc1 = DataSerializer.generateShareCode({ ...FULL_TYPES, gameMode: 'death-loop', initialHealth: 5, initialStamina: 100 });
    const dec1 = DataSerializer.loadFromShareCode(enc1.code);
    assert(dec1.success, dec1.error);
    const enc2 = DataSerializer.generateShareCode({
        ...dec1.data.mapData,
        gameMode: dec1.data.gameMode,
        initialHealth: dec1.data.initialHealth,
        initialStamina: dec1.data.initialStamina
    });
    assert(enc2.success, enc2.error);
    const dec2 = DataSerializer.loadFromShareCode(enc2.code);
    assert(dec2.success, dec2.error);
    assertDeepEq(dec2.data.mapData, dec1.data.mapData, '两次解码必须一致');
});

// ==================== free 模式（customStartPos + activeCells） ====================

test('free 模式: customStartPos 与 activeCells 位图往返', () => {
    const freeData = {
        ...FULL_TYPES,
        editorMode: 'free',
        customStartPos: { x: 1, y: 1 },
        activeCells: [[true, true, true], [true, false, true], [true, true, true]],
    };
    const enc = DataSerializer.generateShareCode({ ...freeData, gameMode: 'death-loop', initialHealth: 5, initialStamina: 100 });
    assert(enc.success, enc.error);
    const dec = DataSerializer.loadFromShareCode(enc.code);
    assert(dec.success, dec.error);
    assertEq(dec.data.mapData.editorMode, 'free');
    assertDeepEq(dec.data.mapData.customStartPos, { x: 1, y: 1 });
    assertEq(dec.data.mapData.activeCells[1][1], false, '中心格子禁用');
    assertEq(dec.data.mapData.activeCells[0][0], true, '其余格子启用');
});

test('free 模式: 无 customStartPos（0xFF 哨兵）', () => {
    const freeData = { ...FULL_TYPES, editorMode: 'free', activeCells: undefined };
    const enc = DataSerializer.generateShareCode({ ...freeData, gameMode: 'death-loop', initialHealth: 5, initialStamina: 100 });
    assert(enc.success, enc.error);
    const dec = DataSerializer.loadFromShareCode(enc.code);
    assert(dec.success, dec.error);
    assertEq(dec.data.mapData.customStartPos, null, '无起点 = null');
    assertEq(dec.data.mapData.activeCells[0][0], true, '位图缺省 = 全启用');
});

// ==================== 多层模式（楼梯 + 各层独立数据） ====================

const MULTI_LAYER = {
    width: 3, height: 3,
    hWalls: [
        [{ type: 1 }, { type: 0 }, { type: 0 }],
        [{ type: 0 }, { type: 0 }, { type: 0 }],
        [{ type: 0 }, { type: 0 }, { type: 0 }],
        [{ type: 0 }, { type: 0 }, { type: 0 }],
    ],
    vWalls: [
        [{ type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }],
        [{ type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }],
        [{ type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }],
    ],
    endPos: { x: 0, y: 2 },
    initialGhosts: [{ x: 1, y: 0 }],
    items: [],
    editorMode: 'regular',
    multiLayerMode: true,
    layerCount: 2,
    stairs: [
        { x: 1, y: 1, layer: 0, direction: 'up' },
        { x: 2, y: 1, layer: 1, direction: 'down' },
    ],
    layers: [
        // layers[0] 与顶层同引用（编辑器装配约定），序列化时只写第 1..N-1 层
        { hWalls: [], vWalls: [], activeCells: null, customStartPos: null, endPos: null, ghosts: [], items: [], buttons: [] },
        {
            hWalls: [
                [{ type: 6, letter: 'C', initialState: 'closed' }, { type: 0 }, { type: 0 }],
                [{ type: 0 }, { type: 0 }, { type: 0 }],
                [{ type: 0 }, { type: 0 }, { type: 0 }],
                [{ type: 0 }, { type: 0 }, { type: 0 }],
            ],
            vWalls: [
                [{ type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }],
                [{ type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }],
                [{ type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }],
            ],
            activeCells: [[true, true, true], [true, true, true], [true, true, false]],
            customStartPos: { x: 2, y: 0 },
            endPos: { x: 2, y: 2 },
            ghosts: [{ x: 0, y: 2 }],
            items: [{ x: 1, y: 2 }],
            buttons: [{ x: 0, y: 0, direction: { dx: 0, dy: 1 }, letter: 'D' }],
        },
    ],
};

test('多层: 层数/楼梯/各层独立数据往返', () => {
    const enc = DataSerializer.generateShareCode({ ...MULTI_LAYER, gameMode: 'exploration', initialHealth: 5, initialStamina: 100 });
    assert(enc.success, enc.error);
    const dec = DataSerializer.loadFromShareCode(enc.code);
    assert(dec.success, dec.error);

    const md = dec.data.mapData;
    assertEq(md.multiLayerMode, true);
    assertEq(md.layerCount, 2);
    assertEq(md.layers.length, 2, '解码 layers 长度');
    assertEq(md.stairs.length, 2, '楼梯数量');
    assertDeepEq(md.stairs[0], { x: 1, y: 1, layer: 0, direction: 'up' });
    assertDeepEq(md.stairs[1], { x: 2, y: 1, layer: 1, direction: 'down' });

    // 第 1 层独立数据
    const l1 = md.layers[1];
    assertEq(l1.hWalls[0][0].type, 6, '第 1 层 LETTER_DOOR');
    assertEq(l1.hWalls[0][0].letter, 'C');
    assertEq(l1.hWalls[0][0].initialState, 'closed');
    assertEq(l1.activeCells[2][2], false, '第 1 层 activeCells');
    assertDeepEq(l1.customStartPos, { x: 2, y: 0 }, '第 1 层起点');
    assertDeepEq(l1.endPos, { x: 2, y: 2 }, '第 1 层终点');
    assertDeepEq(l1.ghosts, [{ x: 0, y: 2 }], '第 1 层鬼');
    assertDeepEq(l1.items, [{ x: 1, y: 2, type: 'key' }], '第 1 层钥匙');
    assertEq(l1.buttons[0].letter, 'D', '第 1 层按钮');
});

test('多层: 第 0 层楼梯归属正确（stairs 按层过滤）', () => {
    const enc = DataSerializer.generateShareCode({ ...MULTI_LAYER, gameMode: 'exploration', initialHealth: 5, initialStamina: 100 });
    const dec = DataSerializer.loadFromShareCode(enc.code);
    const md = dec.data.mapData;
    assertDeepEq(md.layers[0].stairs, [{ x: 1, y: 1, layer: 0, direction: 'up' }], '第 0 层只含本层楼梯');
    assertDeepEq(md.layers[1].stairs, [{ x: 2, y: 1, layer: 1, direction: 'down' }], '第 1 层只含本层楼梯');
});

// ==================== 非法输入干净失败 ====================

test('非法输入: 空码', () => {
    const r = DataSerializer.loadFromShareCode('');
    assert(!r.success);
    assertEq(r.error, '请输入分享码。');
});

test('非法输入: 非 base64url 字符', () => {
    const r = DataSerializer.loadFromShareCode('!!!not-base64!!!');
    assert(!r.success, '应干净失败');
    assertEq(r.error, '分享码无效或已损坏。');
});

test('非法输入: 版本号不符（v1 式无版本头）', () => {
    const bad = window.pako.deflateRaw(new Uint8Array([0x01]));
    let s = ''; for (let i = 0; i < bad.length; i++) s += String.fromCharCode(bad[i]);
    const code = btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const r = DataSerializer.loadFromShareCode(code);
    assert(!r.success);
    assertEq(r.error, '分享码版本不支持。');
});

test('非法输入: 截断码', () => {
    const g = golden['G1-demo'];
    const truncated = g.code.slice(0, Math.floor(g.code.length / 2));
    const r = DataSerializer.loadFromShareCode(truncated);
    assert(!r.success, '截断必须失败');
});

test('非法输入: 参数队列多余字节（确定性边界：必须恰好耗尽）', () => {
    // 篡改字节流：在参数队列末尾追加 1 字节 → deflate 重新打包 → 解码必须报错
    const g = golden['G1-demo'];
    const base64 = g.code.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    const bin = atob(padded);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const inflated = window.pako.inflateRaw(bytes);
    const tampered = new Uint8Array(inflated.length + 1);
    tampered.set(inflated);
    tampered[inflated.length] = 0x00; // 参数队列多 1 字节
    const recomp = window.pako.deflateRaw(tampered);
    let s = ''; for (let i = 0; i < recomp.length; i++) s += String.fromCharCode(recomp[i]);
    const code = btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const r = DataSerializer.loadFromShareCode(code);
    assert(!r.success, '参数队列多余必须报「分享码无效」');
});

test('非法输入: 参数队列缺失字节（墙类型需要参数但队列耗尽）', () => {
    const g = golden['G1-demo'];
    const base64 = g.code.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    const bin = atob(padded);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const inflated = window.pako.inflateRaw(bytes);
    // 删掉最后 1 字节（G1 参数队列 = LOCKED keys 恰好 1 字节）→ 队列不足
    const tampered = inflated.subarray(0, inflated.length - 1);
    const recomp = window.pako.deflateRaw(tampered);
    let s = ''; for (let i = 0; i < recomp.length; i++) s += String.fromCharCode(recomp[i]);
    const code = btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const r = DataSerializer.loadFromShareCode(code);
    assert(!r.success, '参数队列不足必须报「分享码无效」');
});

test('非法输入: 尺寸超界（width > 64）生成拒绝', () => {
    const bad = { ...FULL_TYPES, width: 65 };
    const r = DataSerializer.generateShareCode({ ...bad, gameMode: 'death-loop', initialHealth: 5, initialStamina: 100 });
    assert(!r.success);
    assertEq(r.error, '地图尺寸无效。');
});

// ==================== URL 往返（v3 字符集必须 URL 安全） ====================

test('v3 码字符集 URL 安全（仅 [A-Za-z0-9_-]）：URL query 往返无损，URL 加载与粘贴等价', () => {
    const g = golden['G1-demo'];
    // 1. 字符集：无标准 base64 的 +/=，URL 编码往返零丢失
    assert(/^[A-Za-z0-9_-]+$/.test(g.code), `码含非 URL 安全字符: ${g.code}`);
    // 2. 模拟 updateURLWithShareCode（searchParams.set 自动编码）→ 刷新读取（get 自动解码）
    const url = new URL('https://ghostmaze.novic.cc/');
    url.searchParams.set('map', g.code);
    url.hash = '';
    const fromURL = new URLSearchParams(new URL(url.toString()).search).get('map');
    assertEq(fromURL, g.code, 'URL query 往返必须逐字符还原');
    // 3. URL 取回的码与 golden 解码结果深等（URL 加载 = 粘贴加载）
    const r = DataSerializer.loadFromShareCode(fromURL);
    assert(r.success, r.error);
    assertDeepEq(r.data.mapData, g.canonical, 'URL 取回的码解码必须与 golden 一致');
});

summary('dataSerializer');
