/**
 * UI 模块 - 处理所有用户界面相关的功能
 * 包括: Toast通知、确认对话框、浮层管理、D-pad控制等
 */
import { safeGet, safeSet } from './storage.js';

/**
 * 显示一个短暂的顶部通知 (Toast)
 * @param {HTMLElement} toastElement - Toast DOM元素
 * @param {string} message - 通知消息
 * @param {number} duration - 显示时长(毫秒)
 * @param {string} type - 类型 ('info', 'success', 'error')
 * @param {object} state - 包含 toastTimeout 的状态对象
 */
export function showToast(toastElement, message, duration = 3000, type = 'info', state) {
    clearTimeout(state.toastTimeout);
    toastElement.classList.remove('show');

    setTimeout(() => {
        toastElement.textContent = message;
        toastElement.className = 'toast'; 
        if (type !== 'info') {
            toastElement.classList.add(type);
        }
        toastElement.classList.add('show');

        state.toastTimeout = setTimeout(() => {
            toastElement.classList.remove('show');
        }, duration);
    }, 100);
}

/**
 * 显示一个确认对话框
 * @param {HTMLElement} overlay - 确认对话框的overlay元素
 * @param {HTMLElement} messageEl - 显示消息的元素
 * @param {HTMLElement} yesBtn - 确认按钮
 * @param {HTMLElement} noBtn - 取消按钮
 * @param {string} message - 确认消息
 * @param {function} onConfirm - 确认回调函数
 */
export function showConfirm(overlay, messageEl, yesBtn, noBtn, message, onConfirm) {
    messageEl.textContent = message;
    overlay.style.display = 'flex';

    const hide = () => {
        overlay.style.display = 'none';
        yesBtn.onclick = null;
        noBtn.onclick = null;
    };

    yesBtn.onclick = () => {
        hide();
        onConfirm();
    };
    noBtn.onclick = hide;
}

/**
 * 隐藏所有游戏状态浮窗
 */
export function hideAllOverlays() {
    document.getElementById('death-overlay').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    document.getElementById('win-overlay').style.display = 'none';
}

/**
 * 初始化D-pad触摸控制
 * @param {object} dpad - D-pad状态对象
 */
export function initializeDpadTouchControls(dpad) {
    const savedLeft = safeGet('dpadLeft');
    const savedTop = safeGet('dpadTop');
    const savedScale = safeGet('dpadScale');
    
    if (savedScale) {
        dpad.currentScale = parseFloat(savedScale);
        dpad.element.style.transform = `scale(${dpad.currentScale})`;
    }
    if (savedLeft && savedTop) {
        dpad.element.style.left = savedLeft;
        dpad.element.style.top = savedTop;
        dpad.element.style.right = 'auto';
        dpad.element.style.bottom = 'auto';
    }

    const ensureJsPositioning = () => {
        if (dpad.element.style.left === '' || dpad.element.style.top === '') {
            const rect = dpad.element.getBoundingClientRect();
            dpad.element.style.left = `${rect.left}px`;
            dpad.element.style.top = `${rect.top}px`;
            dpad.element.style.right = 'auto';
            dpad.element.style.bottom = 'auto';
        }
    };

    dpad.grip.addEventListener('touchstart', (e) => {
        const touches = e.touches;
        if (touches.length === 1) {
            e.preventDefault();
            ensureJsPositioning();
            dpad.isDragging = true;
            dpad.startX = touches[0].clientX;
            dpad.startY = touches[0].clientY;
            dpad.initialLeft = parseFloat(dpad.element.style.left);
            dpad.initialTop = parseFloat(dpad.element.style.top);
        }
    }, { passive: false });

    dpad.element.addEventListener('touchstart', (e) => {
        const touches = e.touches;
        if (touches.length === 2) {
            e.preventDefault();
            ensureJsPositioning();
            dpad.isResizing = true;
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            dpad.initialDist = Math.sqrt(dx * dx + dy * dy);
        }
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (!dpad.isDragging && !dpad.isResizing) return;
        e.preventDefault();
        const touches = e.touches;

        if (dpad.isDragging && touches.length === 1) {
            const dx = touches[0].clientX - dpad.startX;
            const dy = touches[0].clientY - dpad.startY;
            dpad.element.style.left = `${dpad.initialLeft + dx}px`;
            dpad.element.style.top = `${dpad.initialTop + dy}px`;
        } else if (dpad.isResizing && touches.length === 2) {
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            const currentDist = Math.sqrt(dx * dx + dy * dy);
            const scaleChange = currentDist / dpad.initialDist;
            let newScale = dpad.currentScale * scaleChange;
            newScale = Math.max(0.5, Math.min(2.5, newScale));
            dpad.element.style.transform = `scale(${newScale})`;
        }
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
        if (dpad.isResizing) {
            const transformStyle = dpad.element.style.transform;
            const scaleMatch = transformStyle.match(/scale\((.+)\)/);
            if (scaleMatch) {
                dpad.currentScale = parseFloat(scaleMatch[1]);
            }
            safeSet('dpadScale', dpad.currentScale);
        }
        if (dpad.isDragging) {
            safeSet('dpadLeft', dpad.element.style.left);
            safeSet('dpadTop', dpad.element.style.top);
        }
        dpad.isDragging = false;
        dpad.isResizing = false;
    });
}

/**
 * 更新D-pad可见性
 * @param {boolean} inactive - 当前是否不能操作游戏
 */
export function updateDpadVisibility(inactive) {
    const dpadToggle = document.getElementById('dpad-toggle');
    const dpadControls = document.getElementById('dpad-controls');
    const shouldShow = window.matchMedia('(max-width: 768px)').matches && dpadToggle.checked && !inactive;
    dpadControls.classList.toggle('hidden', !shouldShow);
}

/**
 * 更新游戏状态UI显示
 * @param {object} config - 配置对象
 */
export function updateUIDisplays({ gameMode, player, loopCount, healthDisplay, keysDisplay, stepsDisplay }) {
    healthDisplay.textContent = gameMode === 'exploration' ? '生命: ' + player.hp : '循环: ' + loopCount;
    stepsDisplay.textContent = '步数: ' + player.steps;
    keysDisplay.textContent = '钥匙: ' + player.keys;
}

/** 两模式都按玩家所在层的真实鬼位计数，含斜邻。 */
export function updateProximityWarning({ ghosts, player, ghostProximityDisplay }) {
    ghostProximityDisplay.textContent = '周围鬼数: ' + ghosts.filter(g => Math.abs(g.x - player.x) <= 1 && Math.abs(g.y - player.y) <= 1).length;
}
