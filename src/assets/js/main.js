'use strict'

const navTotalOptions = document.querySelector('.nav-total-options');
const btnToggle = document.querySelector('.open-close-menu');

btnToggle.addEventListener('click', function openCloseMenu() {
    if(navTotalOptions.classList.contains('hidden')) {
        navTotalOptions.classList.remove('hidden');
    } else {
        navTotalOptions.classList.add('hidden');
    }
    console.log('click');
});

// Alternativa, sem usar addEventListener:
// if (btnToggle && navTotalOptions) {
//     btnToggle.addEventListener('click', function () {
//         navTotalOptions.classList.toggle('hidden');
//     });
// }