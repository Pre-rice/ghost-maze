/** 受限 JavaScript 环境的标准能力补充；不包含任何游戏规则。 */
export function installPortableGlobals(pako) {
    const root = globalThis;
    if (!root.structuredClone) root.structuredClone = function copy(value, seen = new Map()) {
        if (value === null || typeof value !== 'object') return value;
        if (seen.has(value)) return seen.get(value);
        if (value instanceof Date) return new Date(value.getTime());
        if (ArrayBuffer.isView(value)) return new value.constructor(value);
        const result = Array.isArray(value) ? [] : value instanceof Set ? new Set() : value instanceof Map ? new Map() : {};
        seen.set(value, result);
        if (value instanceof Set) for (const item of value) result.add(copy(item, seen));
        else if (value instanceof Map) for (const [key, item] of value) result.set(copy(key, seen), copy(item, seen));
        else for (const key of Object.keys(value)) result[key] = copy(value[key], seen);
        return result;
    };
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    if (!root.btoa) root.btoa = text => {
        let output = '';
        for (let i = 0; i < text.length; i += 3) {
            const a = text.charCodeAt(i), b = text.charCodeAt(i + 1), c = text.charCodeAt(i + 2);
            if (a > 255 || b > 255 || c > 255) throw new RangeError('Base64只接收字节');
            output += alphabet[a >> 2] + alphabet[(a & 3) << 4 | (Number.isNaN(b) ? 0 : b >> 4)] +
                (Number.isNaN(b) ? '=' : alphabet[(b & 15) << 2 | (Number.isNaN(c) ? 0 : c >> 6)]) +
                (Number.isNaN(c) ? '=' : alphabet[c & 63]);
        }
        return output;
    };
    if (!root.atob) root.atob = text => {
        if (typeof text !== 'string' || !/^[A-Za-z0-9+/]*={0,2}$/.test(text) || text.length % 4 === 1) throw new RangeError('Base64无效');
        let value = 0, bits = 0, output = '';
        for (const ch of text.replace(/=+$/, '')) {
            value = value * 64 + alphabet.indexOf(ch); bits += 6;
            if (bits >= 8) { bits -= 8; output += String.fromCharCode(value >> bits & 255); value &= (1 << bits) - 1; }
        }
        return output;
    };
    if (!root.performance) root.performance = { now: () => Date.now() };
    if (!root.window) root.window = {};
    if (pako) root.window.pako = pako;
}

export function plainCopy(value) { return JSON.parse(JSON.stringify(value)); }

export function textBytes(text) {
    const bytes = [];
    for (const ch of text) {
        const n = ch.codePointAt(0);
        if (n < 128) bytes.push(n);
        else if (n < 2048) bytes.push(192 | n >> 6, 128 | n & 63);
        else if (n < 65536) bytes.push(224 | n >> 12, 128 | n >> 6 & 63, 128 | n & 63);
        else bytes.push(240 | n >> 18, 128 | n >> 12 & 63, 128 | n >> 6 & 63, 128 | n & 63);
    }
    return Uint8Array.from(bytes);
}

export function bytesText(bytes) {
    let output = '';
    for (let i = 0; i < bytes.length;) {
        const a = bytes[i++]; let n;
        if (a < 128) n = a;
        else if (a < 224) n = (a & 31) << 6 | bytes[i++] & 63;
        else if (a < 240) n = (a & 15) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
        else n = (a & 7) << 18 | (bytes[i++] & 63) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
        output += String.fromCodePoint(n);
    }
    return output;
}
