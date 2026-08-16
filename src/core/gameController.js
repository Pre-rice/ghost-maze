import { MapDefinition } from './mapDefinition.js';
import { GameLogic } from './gameLogic.js';
import { DataSerializer } from './dataSerializer.js';

/**
 * GameController - 游戏控制器（纯逻辑，零 DOM）
 *
 * 负责游戏局的全部数据流：开局 / 动作推进（含历史）/ 复活 / 存档回溯 /
 * 胜负数据 / 分享码装配与解析。UI 副作用（渲染、浮窗、toast、URL）一律经
 * 注入回调 ui 留在宿主（main.js / GhostMazeGame），本类可在 Node 中独立测试。
 *
 * 回调约定：
 *   onSync()            数据已推进，宿主需同步视图（渲染 + 状态栏）
 *   onWin(stats)        通关（stats = {text} 战绩文案）
 *   onDeath(stats)      死亡（stats = {overlay: 'death'|'game-over', message}）
 *   onHistoryChange()   历史/存档按钮状态变化
 *
 * 注：渲染/输入一律经 viewSlice 只读投影（computeGameView）读权威源，
 *     本类不再持有 hWalls/ghosts 等视图数据镜像（Phase 4 已删）。
 */
export class GameController {
    constructor(ui = {}) {
        this.ui = ui;
        this.gameMode = 'exploration';
        this.initialHealth = 5;
        this.initialStamina = 100;
        this.mapData = null;
        this.mapDefinition = null;
        this.currentGameState = null;
        this.history = [];
        this.checkpoints = [];
        this.currentStep = -1;
        this.editorMode = 'regular';
        // 视图状态（非镜像）：当前渲染/交互的图层；processAction/undo/rewind 会重置为玩家所在层
        this.viewLayer = 0;
    }

    /**
     * 开局（对应原 startGame 的纯数据部分）
     * @param {object} mapData - 地图数据（canonical 结构）
     */
    startGame(mapData) {
        this.mapData = JSON.parse(JSON.stringify(mapData));
        this.mapDefinition = new MapDefinition({
            ...mapData,
            gameMode: this.gameMode,
            initialHealth: this.initialHealth,
            initialStamina: this.initialStamina
        });
        this.currentGameState = GameLogic.createInitialState(this.mapDefinition);
        this.history = [this.currentGameState];
        this.checkpoints = [];
        this.currentStep = 0;
        this.editorMode = mapData.editorMode || 'regular';
        // 视图层初始为玩家所在层（出生点统一由 mapDef.playerStart 推导）
        this.viewLayer = this.currentGameState.player.layer;
        this.ui.onSync?.();
    }

    /**
     * 执行一个动作（移动/按按钮/用楼梯/复活）。
     * @returns {object|null} 推进后的状态；动作无变化时返回 null
     */
    processAction(action) {
        if (!this.currentGameState || !this.mapDefinition) return null;
        const prevState = this.currentGameState;
        const nextState = GameLogic.calculateNextState(prevState, action, this.mapDefinition);
        if (nextState === prevState) return null;
        // 回溯后走新分支：裁剪未来历史与无效存档点
        if (this.currentStep < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentStep + 1);
            this.checkpoints = this.checkpoints.filter(cp => cp <= this.currentStep);
        }
        this.history.push(nextState);
        this.currentStep++;
        this.currentGameState = nextState;
        this.viewLayer = nextState.player.layer;
        this.ui.onSync?.();
        if (nextState.isWon) {
            this.ui.onWin?.(this._winStats());
        } else if (nextState.isDead) {
            this.ui.onDeath?.(this._deathStats(nextState.deathReason));
        }
        return nextState;
    }

    movePlayer(dx, dy) { this.processAction({ type: 'MOVE', payload: { dx, dy } }); }
    useStair() { this.processAction({ type: 'USE_STAIR' }); }
    pressButton(letter) { this.processAction({ type: 'PRESS_BUTTON', payload: { letter } }); }

    /** 复活（死亡循环）；宿主负责恢复 PLAYING 态与动画循环 */
    revive() {
        this.processAction({ type: 'REVIVE' });
    }

    /** 撤销一步。isRevivalPoint 不可跨过。 */
    undo() {
        if (this.currentStep <= 0) return { ok: false };
        if (this.history[this.currentStep] && this.history[this.currentStep].isRevivalPoint && this.currentStep > 0) {
            return { ok: false, error: '无法撤回到复活点之前' };
        }
        this.currentStep--;
        this.currentGameState = this.history[this.currentStep];
        this.viewLayer = this.currentGameState.player.layer;
        this.ui.onSync?.();
        this.ui.onHistoryChange?.();
        return { ok: true };
    }

    /** 在当前步创建存档点（比最近存档点至少前进 1 步） */
    save() {
        const lastCheckpoint = this.checkpoints.length > 0 ? this.checkpoints[this.checkpoints.length - 1] : -1;
        if (this.currentStep <= lastCheckpoint) return { ok: false, error: '请先移动后再存档' };
        this.checkpoints.push(this.currentStep);
        this.ui.onHistoryChange?.();
        return { ok: true, step: this.currentStep };
    }

    /** 回溯到最近的更早存档点 */
    rewind() {
        const availableCheckpoints = this.checkpoints.filter(cp => cp < this.currentStep);
        if (availableCheckpoints.length === 0) return { ok: false, error: '没有更早的存档点可供回溯' };
        const targetStep = Math.max(...availableCheckpoints);
        this.currentStep = targetStep;
        this.currentGameState = this.history[this.currentStep];
        this.viewLayer = this.currentGameState.player.layer;
        this.ui.onSync?.();
        this.ui.onHistoryChange?.();
        return { ok: true, step: targetStep };
    }

    /** 游戏态分享码装配（对应原 generateShareCode 游戏分支） */
    buildShareSourceData() {
        if (!this.mapData) return null;
        return {
            ...this.mapData,
            gameMode: this.gameMode,
            initialHealth: this.initialHealth,
            initialStamina: this.initialStamina
        };
    }

    /** 解析分享码（v2）。成功返回 {success:true, mapData, gameMode, initialHealth, initialStamina} */
    loadFromShareCode(code) {
        const result = DataSerializer.loadFromShareCode(code);
        if (result.success) return result;
        return { success: false, error: result.error };
    }

    /** 应用分享码参数并开局（对应原 _applyLoadedData 游戏分支） */
    applyLoadedMap(mapData, gameMode, health, stamina, setMode) {
        this.initialHealth = health;
        this.initialStamina = stamina;
        setMode(gameMode);
        this.startGame(mapData);
    }

    // ---------- 胜负数据（对应原 handleWin/handlePlayerDeath 的文本部分） ----------

    _winStats() {
        const p = this.currentGameState.player;
        if (this.gameMode === 'exploration') {
            return { text: `你以 ${p.hp} 点剩余生命和 ${p.steps} 步的成绩通关！` };
        }
        return { text: `你以 ${this.currentGameState.loopCount} 次循环和 ${p.stamina} 点剩余体力的成绩通关！` };
    }

    _deathStats(reason = 'ghost') {
        const p = this.currentGameState.player;
        if (this.gameMode === 'exploration') {
            if (p.hp > 0) {
                return { overlay: 'death', message: `你死了 (剩余血量 ${p.hp})` };
            }
            return { overlay: 'game-over', message: '' };
        }
        return { overlay: 'death', message: reason === 'stamina_depleted' ? '体力耗尽，你死了' : '你死了' };
    }
}
