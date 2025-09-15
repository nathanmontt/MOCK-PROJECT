import { initNav } from './nav.js';
import { initCarousel } from './carousel.js';

document.addEventListener('DOMContentLoaded', () => {
    initNav({
        navSelector: '.nav-total-options',
        btnSelector: '.open-close-menu',
        breakpoint: 767
    });

    initCarousel({
        containerSelector: '.container-hero-section',
        desktopImages: [
            'assets/images/pics/desktop/d-img-1.jpg',
            'assets/images/pics/desktop/d-img-2.jpg',
            'assets/images/pics/desktop/d-img-3.jpg',
            'assets/images/pics/desktop/d-img-4.jpg',
            'assets/images/pics/desktop/d-img-5.jpg'
        ],
        mobileImages: [
            'assets/images/pics/mobile/m-img-1.jpg',
            'assets/images/pics/mobile/m-img-2.jpg',
            'assets/images/pics/mobile/m-img-3.jpg',
            'assets/images/pics/mobile/m-img-4.jpg',
            'assets/images/pics/mobile/m-img-5.jpg'
        ],
        breakpoint: 767,
        changeInterval: 4000,
        fadeMs: 800,
        lazy: true,                 // lazy por padrão
        progressivePreloadDelay: 600
    });
});