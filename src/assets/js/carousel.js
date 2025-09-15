function preloadImages(list) {
    return Promise.all(list.map(src => new Promise(res => {
        const i = new Image();
        i.onload = () => res(src);
        i.onerror = () => res(src);
        i.src = src;
    })));
}

export function initCarousel({
    containerSelector = '.container-hero-section',
    desktopImages = [],
    mobileImages = [],
    breakpoint = 767,
    changeInterval = 4000,
    fadeMs = 800
} = {}) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    let imagesSet = [];
    let index = 0;
    let timer = null;
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`);

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

    function start() {
        stop();
        if (!imagesSet || imagesSet.length === 0) return;
        index = index % imagesSet.length;
        createBgLayer(imagesSet[index]);
        timer = setInterval(() => {
            index = (index + 1) % imagesSet.length;
            createBgLayer(imagesSet[index]);
        }, changeInterval);
    }

    function stop() {
        if (timer) { clearInterval(timer); timer = null; }
    }

    function applySet() {
        const useDesktop = mq.matches;
        const newSet = useDesktop ? desktopImages : mobileImages;
        // comparar arrays por referência ou comprimento para decidir reiniciar
        if (imagesSet !== newSet) {
            imagesSet = newSet;
            index = 0;
            container.querySelectorAll('.bg-layer').forEach(el => el.remove());
            start();
        }
    }

    // observar mudanças de breakpoint
    if (mq.addEventListener) mq.addEventListener('change', applySet);
    else if (mq.addListener) mq.addListener(applySet);

    // preload e start (pré-carrega ambos para evitar flicker)
    Promise.all([preloadImages(desktopImages), preloadImages(mobileImages)])
        .then(() => applySet())
        .catch(() => applySet());

    // retorno para controle externo
    return { start, stop, applySet };
}