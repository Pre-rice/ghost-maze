// 地图集沿用已确认的独立页结构与样式，仅接入同页导航。
export const galleryMarkup = `<main id="maps-screen" hidden class="map-gallery">
    <header class="gallery-header">
        <div class="panel-header">
            <h1 class="panel-title">地图集</h1>
            <nav class="header-controls" aria-label="页面导航">
                <a href="./" class="home-btn" title="回到首页" aria-label="回到首页"><svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg></a>
                <a href="help.html" class="help-btn" title="查看帮助" aria-label="查看帮助"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 17h-2v-2h2zm2-7-1 1c-1 1-1 1-1 2h-2v-1c0-1 1-2 2-3l1-1a2 2 0 1 0-4-1H8a4 4 0 1 1 7 3z"/></svg></a>
                <div class="theme-toggle" id="gallery-theme-toggle"><button class="theme-toggle-btn" id="gallery-theme-toggle-btn" data-theme-action title="切换主题" aria-label="切换主题"><svg id="gallery-theme-icon" viewBox="0 0 24 24"></svg></button></div>
            </nav>
        </div>
        <p class="gallery-intro">选一张地图开始解谜。</p>
    </header>
    <section aria-labelledby="ai-map-heading">
        <div class="gallery-section-heading"><h2 id="ai-map-heading">AI 生成地图</h2><span id="gallery-count" class="gallery-count"></span></div>
        <div id="ai-map-grid" class="map-grid"></div>
        <noscript>请启用 JavaScript 查看地图并打开试玩。</noscript>
    </section>
</main>`;
