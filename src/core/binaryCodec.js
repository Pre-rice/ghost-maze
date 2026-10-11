/** 两类分享码共用的位流、整数、校验与压缩工具。 */
export class BitWriter {
    bytes = []; value = 0; used = 0; length = 0;
    write(value, bits) {
        if (!Number.isInteger(value) || value < 0 || value >= 2 ** bits) {
            if (!(bits === 0 && value === 0)) throw new RangeError('数值超出位宽');
        }
        for (let bit = bits - 1; bit >= 0; bit--) {
            this.value = this.value * 2 + (Math.floor(value / 2 ** bit) % 2);
            this.used++; this.length++;
            if (this.used === 8) { this.bytes.push(this.value); this.value = 0; this.used = 0; }
        }
    }
    uint(value) {
        if (!Number.isInteger(value) || value < 0 || value > 0xffffffff) throw new RangeError('整数超出范围');
        do {
            const part = value % 128; value = Math.floor(value / 128);
            this.write(part + (value ? 128 : 0), 8);
        } while (value);
    }
    finish() { return Uint8Array.from(this.used ? [...this.bytes, this.value * 2 ** (8 - this.used)] : this.bytes); }
}

export class BitReader {
    position = 0;
    constructor(bytes) { this.bytes = bytes; }
    get remaining() { return this.bytes.length * 8 - this.position; }
    read(bits) {
        if (bits < 0 || this.remaining < bits) throw new RangeError('分享码已截断');
        let value = 0;
        for (let bit = 0; bit < bits; bit++, this.position++) {
            value = value * 2 + ((this.bytes[this.position >> 3] >> (7 - (this.position % 8))) & 1);
        }
        return value;
    }
    uint() {
        let value = 0;
        for (let i = 0; i < 5; i++) {
            const part = this.read(8);
            if (i === 4 && part > 15) throw new RangeError('整数超出范围');
            value += (part & 127) * 2 ** (i * 7);
            if (part < 128) {
                if (i && part === 0) throw new RangeError('整数表示有多余字节');
                return value;
            }
        }
        throw new RangeError('整数已截断');
    }
    end(padding = this.remaining) {
        if (this.remaining !== padding || padding > 7 || this.read(padding) !== 0) throw new RangeError('分享码尾部有多余数据');
    }
}

export const bitWidth = count => count <= 1 ? 0 : Math.ceil(Math.log2(count));
export function toBase64(bytes) {
    let text = '';
    for (let offset = 0; offset < bytes.length; offset += 8192) text += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
    return btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function fromBase64(text, maxBytes = 1048576) {
    if (typeof text !== 'string' || !/^[A-Za-z0-9_-]+$/.test(text) || text.length % 4 === 1 || text.length > maxBytes * 4 / 3 + 4) throw new RangeError('分享码字符或长度无效');
    const bytes = Uint8Array.from(atob(text.replace(/-/g, '+').replace(/_/g, '/')), ch => ch.charCodeAt(0));
    if (toBase64(bytes) !== text) throw new RangeError('分享码尾部无效');
    return bytes;
}
export function unpack(bytes, compressed, limit) {
    if (!compressed) {
        if (bytes.length > limit) throw new RangeError('分享码内容过长');
        return bytes;
    }
    const pako = globalThis.window?.pako;
    if (!pako) throw new Error('压缩组件未加载');
    if (!pako.Inflate) {
        const output = pako.inflateRaw(bytes, { maxOutputLength: limit });
        if (output.length > limit) throw new RangeError('分享码内容过长');
        return output;
    }
    const inflater = new pako.Inflate({ raw: true });
    const parts = []; let length = 0;
    inflater.onData = part => {
        length += part.length;
        if (length > limit) throw new RangeError('分享码内容过长');
        parts.push(part);
    };
    inflater.push(bytes, true);
    if (inflater.err || !inflater.ended || inflater.strm.total_in !== bytes.length) throw new RangeError('压缩内容无效或有多余数据');
    const output = new Uint8Array(length); let offset = 0;
    for (const part of parts) { output.set(part, offset); offset += part.length; }
    return output;
}
/** 同长度时保留最先给出的候选：原文、墙表示优先级均由调用顺序确定。 */
export function shortestCode(candidates, prefix) {
    const pako = globalThis.window?.pako;
    if (!pako) throw new Error('压缩组件未加载');
    let best = null;
    // 所有原文先比较，保证同长时优先原文。
    for (const compressed of [false, true]) for (const candidate of candidates) {
        const options = compressed ? [{ level: 9 }, { level: 9, strategy: 3 }] : [null];
        for (const option of options) {
            const body = option ? pako.deflateRaw(candidate.bytes, option) : candidate.bytes;
            const head = prefix(candidate.control | Number(compressed));
            const joined = new Uint8Array(head.length + body.length);
            joined.set(head); joined.set(body, head.length);
            const code = toBase64(joined);
            if (!best || code.length < best.length) best = code;
        }
    }
    return best;
}
const crcTable = Uint32Array.from({ length: 256 }, (_, n) => {
    for (let i = 0; i < 8; i++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
    return n >>> 0;
});
export function crc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
}

