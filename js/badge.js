(() => {
	document.addEventListener('DOMContentLoaded', () => {
		const waiting = document.getElementById('badge-waiting');
		const online = document.getElementById('badge-online');
		const offline = document.getElementById('badge-offline');
		const text = document.getElementById('badge-text');
		let pollInterval;

		const setState = state => {
			waiting.classList.add('badge-hidden');
			online.classList.add('badge-hidden');
			offline.classList.add('badge-hidden');
			state.classList.remove('badge-hidden');
		};

		const pollStatus = () => {
			fetch('./api/status')
				.then(r => r.json())
				.then(data => {
					if (data.status === 'online') {
						setState(online);
						text.textContent = `Connected. Clients online: ${data.users}`;
					} else {
						throw new Error('Systems are offline');
					}
				})
				.catch(() => {
					setState(offline);
					text.textContent = 'Systems are offline';
					clearInterval(pollInterval);
				});
		};

		const startPolls = () => {
			pollStatus();
			pollInterval = setInterval(pollStatus, 1000);
		};

		setTimeout(startPolls, 1500);
	});
})();
