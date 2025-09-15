export function initNav({ navSelector = '.nav-total-options', btnSelector = '.open-close-menu', breakpoint = 767 } = {}) {
    const nav = document.querySelector(navSelector);
    const btn = document.querySelector(btnSelector);
    if (!nav) return;

    function syncNavByWidth() {
        if (window.innerWidth >= breakpoint) {
            nav.classList.remove('hidden');
        } else {
            nav.classList.add('hidden');
        }
    }

    if (btn) {
        btn.addEventListener('click', () => {
            nav.classList.toggle('hidden');
        });
    }

    const links = nav.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < breakpoint) nav.classList.add('hidden');
        });
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(syncNavByWidth, 120);
    });

    syncNavByWidth();

    return { sync: syncNavByWidth };
}