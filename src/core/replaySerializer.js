import { ACTION_NAMES } from './actions.js';
import { BitWriter, BitReader, fromBase64, unpack, shortestCode } from './binaryCodec.js';
import { mapCRC32 } from './dataSerializer.js';

const MAX_ACTIONS = 1000000;
function sparse(actions) {
    const writer = new BitWriter(), stairs = [];
    actions.forEach((action, index) => { if (action === 'STAIR') stairs.push(index + 1); });
    if (stairs.length) {
        writer.uint(stairs.length);
        let previous = 0;
        for (const step of stairs) { writer.uint(step - previous - 1); previous = step; }
    }
    let directions = 0;
    for (const action of actions) if (action !== 'STAIR') { writer.write(ACTION_NAMES.indexOf(action), 2); directions++; }
    return { bytes: writer.finish(), control: Number(stairs.length > 0) * 4 + ((4 - directions % 4) % 4) * 8 };
}
function baseFive(actions) {
    const writer = new BitWriter(), remaining = actions.length % 3;
    for (let index = 0; index < actions.length; index += 3) {
        const group = actions.slice(index, index + 3);
        writer.write(group.reduce((value, action) => value * 5 + ACTION_NAMES.indexOf(action), 0), [0, 3, 5, 7][group.length]);
    }
    return { bytes: writer.finish(), control: 2 + remaining * 4 + ((8 - writer.length % 8) % 8) * 16 };
}
function decodeActions(control, bytes) {
    const reader = new BitReader(bytes), actions = [];
    if (control & 2) {
        if (control & 128) throw new RangeError('回放控制信息无效');
        const rest = (control >> 2) & 3, padding = (control >> 4) & 7;
        if (rest === 3) throw new RangeError('回放末组无效');
        const tailBits = [0, 3, 5][rest], bits = reader.remaining - padding - tailBits;
        if (bits < 0 || bits % 7 || bits / 7 * 3 + rest > MAX_ACTIONS) throw new RangeError('回放长度无效');
        const group = (length, countBits) => {
            let value = reader.read(countBits);
            if (value >= 5 ** length) throw new RangeError('回放操作无效');
            const entries = Array(length);
            for (let i = length - 1; i >= 0; i--) { entries[i] = ACTION_NAMES[value % 5]; value = Math.floor(value / 5); }
            actions.push(...entries);
        };
        for (let i = 0; i < bits / 7; i++) group(3, 7);
        if (rest) group(rest, tailBits);
        reader.end(padding);
    } else {
        if (control & 224) throw new RangeError('回放控制信息无效');
        const padding = ((control >> 3) & 3) * 2, stairs = [];
        if (control & 4) {
            const count = reader.uint();
            if (count === 0 || count > MAX_ACTIONS) throw new RangeError('楼梯操作数量无效');
            let previous = 0;
            for (let i = 0; i < count; i++) { previous += reader.uint() + 1; stairs.push(previous); }
        }
        const directions = (reader.remaining - padding) / 2, total = directions + stairs.length;
        if (directions < 0 || !Number.isInteger(directions) || total > MAX_ACTIONS || stairs.at(-1) > total) throw new RangeError('楼梯步号或回放长度无效');
        let stairIndex = 0;
        for (let step = 1; step <= total; step++) {
            if (step === stairs[stairIndex]) { actions.push('STAIR'); stairIndex++; }
            else actions.push(ACTION_NAMES[reader.read(2)]);
        }
        reader.end(padding);
    }
    return actions;
}
export const ReplaySerializer = {
    generateShareCode(mapData, actions) {
        try {
            if (!Array.isArray(actions) || actions.length > MAX_ACTIONS || actions.some(action => !ACTION_NAMES.includes(action))) throw new RangeError('回放操作无效');
            const crc = mapCRC32(mapData);
            const prefix = control => Uint8Array.of(control, crc >>> 24, (crc >>> 16) & 255, (crc >>> 8) & 255, crc & 255);
            const code = shortestCode([sparse(actions), baseFive(actions)], prefix);
            const result = this.loadFromShareCode(mapData, code);
            if (!result.success || result.actions.join(',') !== actions.join(',')) throw new RangeError('回放分享码往返核对失败');
            return { success: true, code };
        } catch (error) { return { success: false, error: error.message }; }
    },
    loadFromShareCode(mapData, code) {
        try {
            const bytes = fromBase64(code);
            if (bytes.length < 5) throw new RangeError('回放已截断');
            const crc = ((bytes[1] * 2 ** 24) + (bytes[2] << 16) + (bytes[3] << 8) + bytes[4]) >>> 0;
            if (crc !== mapCRC32(mapData)) throw new RangeError('回放与当前地图不匹配');
            const actions = decodeActions(bytes[0], unpack(bytes.subarray(5), bytes[0] & 1, 1048576));
            return { success: true, actions };
        } catch (error) { return { success: false, error: '回放码无效：' + error.message }; }
    }
};

