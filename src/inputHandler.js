import { GAME_STATES } from './core/constants.js';

/**
 * InputHandler 模块 - 处理所有输入事件（键盘、鼠标、触摸）
 */

/**
 * 绑定D-pad控制器事件
 * @param {object} game - 游戏实例
 */
export function bindDpadControls(game) {
    let dpadInterval = null;

    const handleDpadPress = (dx, dy) => {
        if (game.state !== GAME_STATES.PLAYING) return;

        if (game.multiLayerMode && game.currentLayer !== game.playerLayer) {
            game.switchToLayer(game.playerLayer);
        }

        clearInterval(game.autoMoveInterval);
        clearInterval(dpadInterval);
        game.movePlayer(dx, dy);
        dpadInterval = setInterval(() => game.movePlayer(dx, dy), 200);
    };

    const handleCenterPress = () => {
        if (game.state !== GAME_STATES.PLAYING) return;

        if (game.multiLayerMode && game.currentLayer !== game.playerLayer) {
            game.switchToLayer(game.playerLayer);
        }

        game.useStair();
    };

    const handleDpadRelease = () => {
        clearInterval(dpadInterval);
    };

    const addListeners = (element, dx, dy) => {
        if (!element) return;
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleDpadPress(dx, dy);
        }, { passive: false });
        element.addEventListener('mousedown', () => handleDpadPress(dx, dy));
    };

    addListeners(document.getElementById('dpad-up'), 0, -1);
    addListeners(document.getElementById('dpad-down'), 0, 1);
    addListeners(document.getElementById('dpad-left'), -1, 0);
    addListeners(document.getElementById('dpad-right'), 1, 0);

    const centerBtn = document.getElementById('dpad-center');
    if (centerBtn) {
        centerBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleCenterPress();
        }, { passive: false });
        centerBtn.addEventListener('mousedown', handleCenterPress);
    }

    document.addEventListener('touchend', handleDpadRelease);
    document.addEventListener('mouseup', handleDpadRelease);

    // 返回清理函数
    return () => {
        clearInterval(dpadInterval);
    };
}
