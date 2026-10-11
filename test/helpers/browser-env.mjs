/**
 * Node 端浏览器环境兼容层（零依赖）：
 * - window.pako：用 node:zlib 的 deflateRawSync/inflateRawSync 模拟（RFC 1951 标准互操作）
 * - atob/btoa：Node >= 16 已有全局，缺失时兜底 polyfill
 * 注意：压缩字节不必与浏览器端逐字节相同，协议兼容只要求 inflate(deflate(data)) = data。
 * 调用时机：import 被测模块（dataSerializer 等）之前先 installBrowserEnv()。
 */
import { deflateRawSync, inflateRawSync } from 'node:zlib';

export function installBrowserEnv() {
    globalThis.window = globalThis.window || {};
    globalThis.window.pako = {
        deflateRaw: (data, options) => deflateRawSync(data, options),
        inflateRaw: (data, options = {}) => {
            const result = inflateRawSync(data, { ...options, info: true });
            if (result.engine.bytesWritten !== data.length) throw new RangeError('压缩内容有多余数据');
            return result.buffer;
        }
    };
    if (typeof globalThis.atob !== 'function') {
        globalThis.atob = (s) => Buffer.from(s, 'base64').toString('binary');
    }
    if (typeof globalThis.btoa !== 'function') {
        globalThis.btoa = (s) => Buffer.from(s, 'binary').toString('base64');
    }
}
