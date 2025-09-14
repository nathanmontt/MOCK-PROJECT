'use strict'

document.addEventListener('DOMContentLoaded', () => {
    const navTotalOptions = document.querySelector('.nav-total-options');
    const btnToggle = document.querySelector('.open-close-menu');
    if (!navTotalOptions) return;

    const BREAKPOINT = 767;

    function syncNavByWidth() {
        if (window.innerWidth >= BREAKPOINT) {
            navTotalOptions.classList.remove('hidden');
        } else {
            navTotalOptions.classList.add('hidden');
        }
    }

    if (btnToggle) {
        btnToggle.addEventListener('click', () => {
            navTotalOptions.classList.toggle('hidden');
        });
    }

    const menuLinks = navTotalOptions.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < BREAKPOINT) {
                navTotalOptions.classList.add('hidden');
            }
        });
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(syncNavByWidth, 120);
    });

    syncNavByWidth();
});