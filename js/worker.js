/* worker.js - auto-polling devtools checker */
(() => {
    const POLL_INTERVAL = 50; // ms
    const LOG_THRESHOLD = POLL_INTERVAL * 1.0014159265358979;
    let lastStatus = null;

    const detectByLogTime = () => {
        const t0 = performance.now();
        console.log('%c', 'color:transparent');
        return performance.now() - t0 > LOG_THRESHOLD;
    };

    const detectByDimensions = () => (
        window.outerWidth - window.innerWidth > 160 ||
        window.outerHeight - window.innerHeight > 160
    );

    const detectByGetter = () => {
        let opened = false;
        const obj = {};
        Object.defineProperty(obj, 'avella', {
            get() {
                opened = true;
                return '';
            }
        });
        console.log(obj); // triggered when devtools open
        return opened;
    };

    const detectByRAF = cb => {
        const start = performance.now();
        requestAnimationFrame(() => {
            const delta = performance.now() - start;
            cb(delta > 200);
        });
    };

    const pollSync = () => detectByLogTime() || detectByDimensions() || detectByGetter();

    const clientExit = () => {
        Array.from(document.children).forEach(c => c.remove());
        window.location.replace('about:blank');
    };

    setInterval(() => {
        const syncOpen = pollSync();
        detectByRAF(asyncOpen => {
            const isOpen = syncOpen || asyncOpen;
            if (isOpen !== lastStatus) {
                if (isOpen) clientExit();
                lastStatus = isOpen;
            }
        });
    }, POLL_INTERVAL);
})();
