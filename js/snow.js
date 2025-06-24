(function () {
	const config = {
		density: 100, // flake #
		minOpacity: 0.1,
		maxOpacity: 0.5
	};

	function randomRange(min, max) {
		return Math.random() * (max - min) + min;
	}

	function spawnSnow(count, minOp, maxOp) {
		const container = document.getElementById("snow-container");
		container.innerHTML = "";

		for (let i = 0; i < count; i++) {
			const flake = document.createElement("div");
			flake.className = "snow";

			const startX = randomRange(0, 100).toFixed(2) + "vw";
			const drift = randomRange(-10, 10).toFixed(2) + "vw";
			const endX = `calc(${startX} + ${drift})`;
			const scale = randomRange(0.1, 1).toFixed(3);
			const opacity = randomRange(minOp, maxOp).toFixed(3);
			const duration = randomRange(10, 30).toFixed(2) + "s";
			const delay =
				(-Math.random() * parseFloat(duration)).toFixed(2) + "s";

			flake.style.setProperty("--x-start", startX);
			flake.style.setProperty("--x-end", endX);
			flake.style.setProperty("--scale", scale);
			flake.style.setProperty("--opacity", opacity);
			flake.style.setProperty("--duration", duration);
			flake.style.setProperty("--delay", delay);

			container.appendChild(flake);
		}
	}

	window.addEventListener("load", () =>
		spawnSnow(config.density, config.minOpacity, config.maxOpacity)
	);

	// allow runtime adjustments
	window.spawnSnow = spawnSnow;
})();
