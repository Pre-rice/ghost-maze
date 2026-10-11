import { WALL_TYPES as W } from './constants.js';
import { validateMapData, DIRECTIONS, directionIndex } from './mapDataUtils.js';
import { BitWriter, BitReader, bitWidth, fromBase64, shortestCode, unpack, crc32 } from './binaryCodec.js';

function checked(source) {
    const result = validateMapData(source);
    if (!result.valid) throw new RangeError(result.error);
    return result.mapData;
}
function positions(layer) {
    const cells = [];
    layer.activeCells.forEach((row, y) => row.forEach((active, x) => { if (active) cells.push({ x, y }); }));
    return cells;
}

/** 唯一地图内容布局；CRC 固定使用未压缩的 00 墙表示。 */
export function encodeMapContent(data, scheme = 0) {
    const writer = new BitWriter();
    const startLayer = data.layers.findIndex(layer => layer.customStartPos);
    writer.write(data.width - 8, 4); writer.write(data.height - 8, 4);
    writer.write(Number(data.editorMode === 'free'), 1);
    writer.write(Number(data.gameMode === 'death-loop'), 1);
    writer.write(Number(data.layerCount > 1), 1);
    const customHealth = data.gameMode === 'exploration' && data.initialHealth !== 5;
    writer.write(Number(customHealth), 1); writer.write(scheme, 2);
    if (data.layerCount > 1) writer.write(data.layerCount - 2, 4);
    if (customHealth) writer.uint(data.initialHealth - 1);
    if (data.layerCount > 1) writer.write(startLayer, bitWidth(data.layerCount));
    for (let li = 0; li < data.layerCount; li++) {
        const layer = data.layers[li], cells = positions(layer), bits = bitWidth(cells.length);
        const indices = new Map(cells.map((p, index) => [p.y * data.width + p.x, index]));
        const writePoint = p => writer.write(indices.get(p.y * data.width + p.x), bits);
        const all = cells.length === data.width * data.height;
        writer.write(Number(all), 1);
        if (!all) for (const row of layer.activeCells) for (const active of row) writer.write(Number(active), 1);
        writer.write(Number(!!layer.endPos), 1);
        if (layer.endPos) writePoint(layer.endPos);
        if (li === startLayer) writePoint(layer.customStartPos);
        for (const name of ['ghosts', 'items', 'buttons']) {
            const entries = layer[name];
            writer.write(Number(entries.length > 0), 1);
            if (entries.length) writer.uint(entries.length - 1);
            for (const entry of entries) {
                writePoint(entry);
                if (name === 'buttons') {
                    writer.write(directionIndex(entry.direction), 2);
                    writer.write(entry.letter.charCodeAt(0) - 65, 5);
                }
            }
        }
        const walls = [...layer.hWalls.flat(), ...layer.vWalls.flat()];
        for (const wall of walls) {
            const type = wall.type;
            if (scheme === 0) {
                if (type === W.EMPTY) writer.write(0, 1);
                else if (type === W.SOLID) writer.write(2, 2);
                else { writer.write(3, 2); writer.write(type - 2, 3); }
            } else if (scheme === 1) writer.write(type, 3);
            else {
                for (let i = 0; i < type; i++) writer.write(1, 1);
                writer.write(0, 1);
            }
        }
        for (const wall of walls) {
            if (wall.type === W.LOCKED) writer.uint(wall.keys);
            else if (wall.type === W.ONE_WAY) writer.write(directionIndex(wall.direction), 2);
            else if (wall.type === W.LETTER_DOOR) {
                writer.write(wall.letter.charCodeAt(0) - 65, 5);
                writer.write(Number(wall.initialState === 'open'), 1);
            }
        }
    }
    if (data.layerCount > 1) {
        const pairs = data.stairs.filter(s => s.direction === 'up');
        writer.uint(pairs.length);
        for (const stair of pairs) {
            writer.write(stair.layer, bitWidth(data.layerCount - 1));
            const cells = positions(data.layers[stair.layer]);
            writer.write(cells.findIndex(p => p.x === stair.x && p.y === stair.y), bitWidth(cells.length));
        }
    }
    return writer.finish();
}

export function decodeMapContent(bytes) {
    const reader = new BitReader(bytes);
    const width = reader.read(4) + 8, height = reader.read(4) + 8;
    if (width > 20 || height > 20) throw new RangeError('地图尺寸无效');
    const editorMode = reader.read(1) ? 'free' : 'regular';
    const gameMode = reader.read(1) ? 'death-loop' : 'exploration';
    const multi = reader.read(1), health = reader.read(1), scheme = reader.read(2);
    if (scheme === 3 || (health && gameMode === 'death-loop')) throw new RangeError('地图控制信息无效');
    const layerCount = multi ? reader.read(4) + 2 : 1;
    if (layerCount > 10) throw new RangeError('层数无效');
    const initialHealth = health ? reader.uint() + 1 : 5;
    if (initialHealth > 0xffffffff || (health && initialHealth === 5)) throw new RangeError('初始生命无效');
    const startLayer = multi ? reader.read(bitWidth(layerCount)) : 0;
    if (startLayer >= layerCount) throw new RangeError('出生层无效');
    const layers = [];
    for (let li = 0; li < layerCount; li++) {
        const all = reader.read(1);
        const activeCells = Array.from({ length: height }, () => Array.from({ length: width }, () => all ? true : !!reader.read(1)));
        const cells = positions({ activeCells }), bits = bitWidth(cells.length);
        if (!cells.length) throw new RangeError('地图层没有活动格');
        const readPoint = () => {
            const index = reader.read(bits);
            if (index >= cells.length) throw new RangeError('位置超出活动格范围');
            return { ...cells[index] };
        };
        const endPos = reader.read(1) ? readPoint() : null;
        const customStartPos = li === startLayer ? readPoint() : null;
        const layer = { activeCells, endPos, customStartPos };
        for (const name of ['ghosts', 'items', 'buttons']) {
            const count = reader.read(1) ? reader.uint() + 1 : 0;
            if (count > cells.length * (name === 'buttons' ? 4 : 1)) throw new RangeError('实体数量无效');
            layer[name] = Array.from({ length: count }, (_, id) => {
                const p = readPoint();
                if (name === 'ghosts') p.id = id;
                if (name === 'items') p.type = 'key';
                if (name === 'buttons') {
                    p.direction = { ...DIRECTIONS[reader.read(2)] };
                    const letter = reader.read(5);
                    if (letter >= 26) throw new RangeError('按钮字母无效');
                    p.letter = String.fromCharCode(65 + letter);
                }
                return p;
            });
        }
        const walls = Array.from({ length: (height + 1) * width + height * (width + 1) }, () => {
            let type;
            if (scheme === 0) type = !reader.read(1) ? W.EMPTY : (!reader.read(1) ? W.SOLID : reader.read(3) + 2);
            else if (scheme === 1) type = reader.read(3);
            else { type = 0; while (reader.read(1)) { if (++type > W.LETTER_DOOR) throw new RangeError('墙类型无效'); } }
            if (type > W.LETTER_DOOR) throw new RangeError('墙类型无效');
            return { type, keys: 0 };
        });
        for (const wall of walls) {
            if (wall.type === W.LOCKED) wall.keys = reader.uint();
            else if (wall.type === W.ONE_WAY) wall.direction = { ...DIRECTIONS[reader.read(2)] };
            else if (wall.type === W.LETTER_DOOR) {
                const letter = reader.read(5);
                if (letter >= 26) throw new RangeError('门字母无效');
                wall.letter = String.fromCharCode(65 + letter);
                wall.initialState = reader.read(1) ? 'open' : 'closed';
            }
        }
        layer.hWalls = Array.from({ length: height + 1 }, (_, y) => walls.slice(y * width, (y + 1) * width));
        const offset = (height + 1) * width;
        layer.vWalls = Array.from({ length: height }, (_, y) => walls.slice(offset + y * (width + 1), offset + (y + 1) * (width + 1)));
        layers.push(layer);
    }
    const stairs = [];
    if (multi) {
        const count = reader.uint();
        if (count > width * height * Math.floor(layerCount / 2)) throw new RangeError('楼梯数量无效');
        for (let i = 0; i < count; i++) {
            const li = reader.read(bitWidth(layerCount - 1));
            if (li >= layerCount - 1) throw new RangeError('楼梯层无效');
            const cells = positions(layers[li]), index = reader.read(bitWidth(cells.length));
            if (index >= cells.length) throw new RangeError('楼梯位置无效');
            stairs.push({ ...cells[index], layer: li, direction: 'up' }, { ...cells[index], layer: li + 1, direction: 'down' });
        }
    }
    reader.end();
    return checked({ width, height, editorMode, gameMode, layerCount, initialHealth, layers, stairs });
}

export function mapCRC32(source) { return crc32(encodeMapContent(checked(source), 0)); }

export const DataSerializer = {
    generateShareCode(source) {
        try {
            const data = checked(source);
            const code = shortestCode([0, 1, 2].map(scheme => ({ bytes: encodeMapContent(data, scheme), control: 0 })), control => Uint8Array.of(control));
            const result = this.loadFromShareCode(code);
            if (!result.success || JSON.stringify(result.data.mapData) !== JSON.stringify(data)) throw new RangeError('地图分享码往返核对失败');
            return { success: true, code };
        } catch (error) { return { success: false, error: error.message }; }
    },
    loadFromShareCode(code) {
        try {
            const bytes = fromBase64(code, 131072);
            if (bytes.length < 2 || (bytes[0] & 254)) throw new RangeError('地图分享码控制信息无效');
            const mapData = decodeMapContent(unpack(bytes.subarray(1), bytes[0] & 1, 131072));
            return { success: true, data: { mapData, gameMode: mapData.gameMode, initialHealth: mapData.initialHealth } };
        } catch (error) { return { success: false, error: '分享码无效：' + error.message }; }
    }
};
