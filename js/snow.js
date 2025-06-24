(() => {
    const cfg = { density: 100, minOpacity: 0.1, maxOpacity: 0.5 };

    const rand = (min, max) => Math.random() * (max - min) + min;

    const spawnSnow = (count, minOp, maxOp) => {
        const container = document.getElementById('snow-container');
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const flake = document.createElement('div');
            flake.className = 'snow';
            const startX = rand(0, 100).toFixed(2) + 'vw';
            const drift = rand(-10, 10).toFixed(2) + 'vw';
            flake.style.setProperty('--x-start', startX);
            flake.style.setProperty('--x-end', `calc(${startX} + ${drift})`);
            flake.style.setProperty('--scale', rand(0.1, 1).toFixed(3));
            flake.style.setProperty('--opacity', rand(minOp, maxOp).toFixed(3));
            const duration = rand(10, 30).toFixed(2) + 's';
            flake.style.setProperty('--duration', duration);
            flake.style.setProperty('--delay', (-Math.random() * parseFloat(duration)).toFixed(2) + 's');
            container.appendChild(flake);
        }
    };

    window.addEventListener('load', () => spawnSnow(cfg.density, cfg.minOpacity, cfg.maxOpacity));
    window.spawnSnow = spawnSnow;
})();
