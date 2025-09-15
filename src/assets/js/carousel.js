/**
 * initCarousel - carrossel de background responsivo com lazy-loading
 * Opções: containerSelector, desktopImages, mobileImages, breakpoint, changeInterval, fadeMs, lazy, progressivePreloadDelay
 */
function preloadImage(src) {
    return new Promise(res => {
        const img = new Image();
        img.onload = () => res(src);
        img.onerror = () => res(src);
        img.src = src;
    });
}

export function initCarousel({
    containerSelector = '.container-hero-section',
    desktopImages = [],
    mobileImages = [],
    breakpoint = 767,
    changeInterval = 4000,
    fadeMs = 800,
    lazy = true,
    progressivePreloadDelay = 600
} = {}) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`);
    let imagesSet = [];
    let index = 0;
    let timer = null;
    let started = false;
    let preloadQueue = [];
    let preloadTimer = null;
    let isContainerVisible = false;

    function createBgLayer(src) {
        const layer = document.createElement('div');
        layer.className = 'bg-layer';
        layer.style.backgroundImage = `url("${src}")`;
        layer.style.opacity = '0';
        layer.style.pointerEvents = 'none';
        layer.style.transition = `opacity ${fadeMs}ms ease`;
        container.appendChild(layer);

        const existing = Array.from(container.querySelectorAll('.bg-layer')).filter(l => l !== layer);
        existing.forEach(l => { l.offsetHeight; l.style.opacity = '0'; });

        requestAnimationFrame(() => { layer.style.opacity = '1'; });

        setTimeout(() => { existing.forEach(l => l.remove()); }, fadeMs + 50);
    }

    function startProgressivePreload() {
        if (!preloadTimer && preloadQueue.length > 0) runProgressivePreload();
    }
    function enqueueProgressivePreload(list) {
        preloadQueue = preloadQueue.concat(list.filter(Boolean));
        if (!preloadTimer) runProgressivePreload();
    }
    function runProgressivePreload() {
        if (preloadQueue.length === 0) { preloadTimer = null; return; }
        const src = preloadQueue.shift();
        preloadImage(src).finally(() => {
            preloadTimer = setTimeout(runProgressivePreload, progressivePreloadDelay);
        });
    }

    function start() {
        if (started) return;
        started = true;
        stop();
        if (!imagesSet || imagesSet.length === 0) return;
        index = index % imagesSet.length;
        createBgLayer(imagesSet[index]);
        timer = setInterval(() => {
            index = (index + 1) % imagesSet.length;
            createBgLayer(imagesSet[index]);
        }, changeInterval);
        startProgressivePreload();
    }

    function stop() {
        if (timer) { clearInterval(timer); timer = null; }
        started = false;
    }

    function applySet() {
        const useDesktop = mq.matches;
        const newSet = useDesktop ? desktopImages : mobileImages;
        if (imagesSet !== newSet) {
            imagesSet = newSet;
            index = 0;
            container.querySelectorAll('.bg-layer').forEach(el => el.remove());
            if (lazy) {
                const first = imagesSet[0];
                if (first) {
                    // tentativa de ajudar LCP
                    try {
                        const link = document.createElement('link');
                        link.rel = 'preload';
                        link.as = 'image';
                        link.href = first;
                        document.head.appendChild(link);
                        setTimeout(() => document.head.removeChild(link), 5000);
                    } catch (e) { /* ignore */ }
                    preloadImage(first).then(() => {
                        createBgLayer(first);
                        enqueueProgressivePreload(imagesSet.slice(1));
                        if (isContainerVisible) start();
                    });
                }
            } else {
                Promise.all(imagesSet.map(preloadImage)).then(() => start());
            }
        }
    }

    // IntersectionObserver para iniciar quando o hero aparecer
    if (lazy && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.target === container) {
                    if (entry.isIntersecting) {
                        isContainerVisible = true;
                        if (!started && imagesSet && imagesSet.length) start();
                    } else {
                        isContainerVisible = false;
                        // opcional: pausar quando não visível
                        // stop();
                    }
                }
            });
        }, { threshold: 0.15 });
        io.observe(container);
    } else {
        // sem IO, iniciar imediatamente
        isContainerVisible = true;
    }

    if (mq.addEventListener) mq.addEventListener('change', applySet);
    else if (mq.addListener) mq.addListener(applySet);

    // inicial
    applySet();

    return {
        start: () => { applySet(); start(); },
        stop: () => stop()
    };
}