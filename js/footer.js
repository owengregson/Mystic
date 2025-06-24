(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const fc = document.getElementById('footer-copyright');
        fc.innerText = fc.innerText.replace('{YEAR}', new Date().getFullYear());
    });
})();
