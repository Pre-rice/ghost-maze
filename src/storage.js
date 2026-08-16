/**
 * storage.js - localStorage 安全访问（隐私模式 / 禁用存储时静默降级）
 *
 * 直接调 localStorage.getItem/setItem 在隐私模式或禁用 Cookie 时会抛
 * SecurityError 并中断 UI 交互；统一经 safeGet/safeSet 读写，异常静默降级
 * （读返回 fallback，写丢弃），不让存储问题影响游戏本身。
 */

/**
 * 安全读取 localStorage
 * @param {string} key - 键名
 * @param {*} fallback - 键不存在或读取失败时返回的默认值
 * @returns {*} 存储值（字符串）或 fallback
 */
export function safeGet(key, fallback = null) {
    try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : v;
    } catch {
        return fallback;
    }
}

/**
 * 安全写入 localStorage
 * @param {string} key - 键名
 * @param {string} value - 值
 */
export function safeSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch {
        // 静默降级：存储不可用时丢弃写入
    }
}
