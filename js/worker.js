/* worker.js - auto-polling devtools checker */
(() => {
	const POLL_INTERVAL = 50; // ms
	const LOG_THRESHOLD = POLL_INTERVAL * 1.00141592653589793238462643382;
	let lastStatus = null;

	// render timing check
	function detectByLogTime() {
		const t0 = performance.now();
		console.log("%c", "color:transparent");
		return performance.now() - t0 > LOG_THRESHOLD;
	}

	// vp docked-DevTools size delta check
	function detectByDimensions() {
		return (
			window.outerWidth - window.innerWidth > 160 ||
			window.outerHeight - window.innerHeight > 160
		);
	}

	// getter side-effect check
	function detectByGetter() {
		let opened = false;
		const obj = {};
		Object.defineProperty(obj, "avella", {
			get() {
				opened = true;
				return "";
			},
		});
		// only invoked when console is open and tries to inspect obj
		console.log(obj);
		return opened;
	}

	// raf slowdown check
	function detectByRAF(cb) {
		const start = performance.now();
		requestAnimationFrame(() => {
			const delta = performance.now() - start;
			// if dt throttles/frame-pauses this gets delayted
			cb(delta > 200);
		});
	}

	function pollSync() {
		return detectByLogTime() || detectByDimensions() || detectByGetter();
	}

	function client_exit() {
		for (child of document.children) {
			child.remove();
		}
		window.location.replace("about:blank");
	}

	setInterval(() => {
		const syncOpen = pollSync();
		detectByRAF((asyncOpen) => {
			const isOpen = syncOpen || asyncOpen;
			if (isOpen !== lastStatus) {
				if (isOpen) {
					client_exit();
				}
				lastStatus = isOpen;
			}
		});
	}, POLL_INTERVAL);
})();
