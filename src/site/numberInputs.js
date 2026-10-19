/**
 * 数字输入框的滚轮增减：去掉原生上下箭头后，滚轮向上增、向下减，
 * 结果夹在 min／max 之间，并补发 input 与 change，让原有监听照常生效。
 * 只作用于 input[type=number]；按钮、数字门、字母门旁的元件输入框是 text，不受影响。
 * @param {EventTarget} root - 监听范围，默认 document
 */
export function enableWheelNumbers(root = document) {
    root.addEventListener('wheel', event => {
        const input = event.target?.closest?.('input[type="number"]');
        if (!input || input.disabled || input.readOnly || !event.deltaY) return;
        event.preventDefault();
        const step = Number(input.step) || 1;
        const min = input.min === '' ? -Infinity : Number(input.min);
        const max = input.max === '' ? Infinity : Number(input.max);
        const current = Number(input.value);
        const base = Number.isFinite(current) ? current : (Number.isFinite(min) ? min : 0);
        const next = Math.min(max, Math.max(min, base + (event.deltaY < 0 ? step : -step)));
        if (next === current) return;
        input.value = String(next);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }, { passive: false });
}
