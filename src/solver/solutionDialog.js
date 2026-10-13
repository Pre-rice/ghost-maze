import { mapURL } from '../shareLinks.js';

const CACHE_KEY = 'ghostmaze-optimal-solutions';
export class SolutionDialog {
    constructor({ onReplay, onOpen = () => {}, onClose = () => {} }) {
        this.onReplay = onReplay; this.onOpen = onOpen; this.onClose = onClose;
        this.element = document.createElement('dialog');
        this.element.id = 'solver-dialog'; this.element.className = 'solver-dialog';
        this.element.setAttribute('aria-labelledby', 'solver-title');
        this.element.innerHTML = '<h2 id="solver-title">最优解</h2><p class="solver-scope">从地图初态出发，无伤、无复活。</p><p id="solver-status" role="status" aria-live="polite"></p><div id="solver-routes" class="solver-routes"></div><div class="solver-buttons"><button id="solver-more-btn" class="secondary" hidden>继续显示</button><button id="solver-continue-btn" hidden>继续求解</button><button id="solver-close-btn" class="secondary">关闭</button></div>';
        document.body.append(this.element);
        this.status = this.element.querySelector('#solver-status');
        this.list = this.element.querySelector('#solver-routes');
        this.more = this.element.querySelector('#solver-more-btn');
        this.continueButton = this.element.querySelector('#solver-continue-btn');
        this.element.querySelector('#solver-close-btn').onclick = () => this.element.close();
        this.element.addEventListener('close', () => {
            if (this.busy) { this.worker?.terminate(); this.worker = null; this.busy = false;
                this.status.textContent = '求解已取消'; this.continueButton.hidden = false; }
            this.onClose();
        });
        this.more.onclick = () => {
            this.more.disabled = true;
            if (!this.worker) this.startWorker(this.codes.length);
            else this.worker.postMessage({ type: 'more' });
        };
        this.continueButton.onclick = () => {
            this.continueButton.hidden = true; this.busy = true; this.status.textContent = '正在求解…';
            if (!this.worker) this.startWorker(); else this.worker.postMessage({ type: 'continue' });
        };
    }
    get open() { return this.element.open; }
    reset(mapCode) {
        if (this.mapCode === mapCode) return;
        this.worker?.terminate(); this.worker = null; this.busy = false;
        if (this.open) this.element.close();
        this.mapCode = mapCode; this.mapData = null; this.codes = []; this.steps = null; this.count = null;
        this.complete = false; this.list.replaceChildren();
        this.more.hidden = this.continueButton.hidden = true;
    }
    show(mapData, mapCode) {
        this.reset(mapCode); this.mapData = mapData;
        if (!this.open) this.element.showModal(); this.onOpen();
        if (this.steps !== null || this.busy || this.worker) return;
        this.status.textContent = '正在求解…'; this.startWorker();
    }
    startWorker(skip = this.codes.length) {
        try {
            this.worker?.terminate(); this.busy = true; this.continueButton.hidden = true;
            const worker = new Worker(new URL('./solverWorker.js', import.meta.url), { type: 'module' });
            this.worker = worker;
            worker.onmessage = ({ data }) => { if (this.worker === worker) this.receive(data); };
            worker.onerror = () => { if (this.worker === worker) this.receive({ type: 'error', message: '求解加载失败，请重试。' }); };
            worker.postMessage({ type: 'start', mapData: this.mapData, skip });
        } catch (error) { this.receive({ type: 'error', message: error.message }); }
    }
    receive(data) {
        if (data.type === 'solved') {
            this.busy = false; this.steps = data.steps; this.count = data.count;
            this.status.textContent = `最优解 ${this.steps} 步，共 ${this.count} 条`;
            this.continueButton.hidden = true;
        } else if (data.type === 'routes') {
            for (const code of data.codes) {
                this.codes.push(code);
                const link = document.createElement('a');
                link.href = mapURL(this.mapCode, { replay: code });
                link.textContent = '查看解法 ' + this.codes.length;
                link.onclick = event => {
                    event.preventDefault(); this.persist(); this.element.close();
                    this.onReplay({ code, mapCode: this.mapCode, href: link.href });
                };
                this.list.append(link);
            }
            this.complete = data.complete || BigInt(this.codes.length) === BigInt(this.count);
            this.more.hidden = this.complete; this.more.disabled = false;
            this.more.textContent = `继续显示（已列 ${this.codes.length} 条）`;
            if (this.complete) { this.worker?.terminate(); this.worker = null; }
            this.persist();
        } else {
            this.busy = false; this.more.hidden = true;
            if (data.type === 'unknown') {
                this.status.textContent = '尚未完成最优解证明，可继续求解。'; this.continueButton.hidden = false;
            } else {
                this.worker?.terminate(); this.worker = null;
                this.status.textContent = data.type === 'unsat' ? '此地图没有无伤、无复活的通关解。' : data.message;
                this.continueButton.hidden = data.type === 'unsat';
            }
        }
    }
    persist() {
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ mapCode: this.mapCode, steps: this.steps,
            count: this.count, codes: this.codes, complete: this.complete })); } catch { /* 存储关闭时仍可重新求解。 */ }
    }
    restore(mapData, mapCode) {
        this.reset(mapCode); this.mapData = mapData;
        try {
            const saved = JSON.parse(sessionStorage.getItem(CACHE_KEY));
            if (saved?.mapCode !== mapCode || !Number.isSafeInteger(saved.steps) || saved.steps < 0 ||
                !/^[0-9]+$/.test(saved.count) || !Array.isArray(saved.codes) ||
                !saved.codes.every(code => typeof code === 'string' && /^[A-Za-z0-9_-]+$/.test(code))) return;
            this.receive({ type: 'solved', steps: saved.steps, count: saved.count });
            this.receive({ type: 'routes', codes: saved.codes, complete: saved.complete });
        } catch { /* 返回后没有有效缓存就从初态重新求解。 */ }
    }
}
