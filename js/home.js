function gRII(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
document.addEventListener("DOMContentLoaded", function () {
	fetch("https://api.ipify.org?format=json")
		.then((res) => {
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			res.json().then((data) => {
				const client_fwd = data[Object.keys(data)[0]];
				window.client_fwd = client_fwd;
				setTimeout(() => {
					document.getElementById("client-connection").innerText =
						"WELCOME BACK, " + client_fwd + ".";
				}, gRII(366, 872));
			});
		})
		.catch((err) => {});

	const dimmer = document.getElementById("modal-dimmer");
	setTimeout(() => {
		dimmer.classList.replace("modal-dimmer-visible", "modal-dimmer-hidden");
	}, 50);
	window.showModal = (id) => {
		const modal = document.getElementById(id + "-modal");
		if (!modal) return;

		dimmer.classList.replace("modal-dimmer-hidden", "modal-dimmer-visible");
		modal.classList.replace("modal-hidden", "modal-visible");
	};

	window.hideModal = () => {
		const modal = document.querySelector(".modal-overlay.modal-visible");
		if (!modal) return;
		dimmer.classList.replace("modal-dimmer-visible", "modal-dimmer-hidden");
		modal.classList.replace("modal-visible", "modal-hidden");
	};

	let modalBtns = document.getElementsByClassName("modal-btn");
	for (let i = 0; i < modalBtns.length; i++) {
		modalBtns[i].addEventListener("click", function () {
			const action = this.getAttribute("data-action");
			switch (action) {
				case "modal-close":
					hideModal();
			}
		});
	}

	let cardBtns = document.querySelectorAll(".card");
	cardBtns.forEach((card) => {
		card.addEventListener("click", function () {
			const action = this.getAttribute("data-action");
			switch (action) {
				case "chat":
					showModal("chat-maintenance");
					break;
				default:
					window.location.href = "/login?r=" + action;
			}
		});
	});

	let modalLinks = document.querySelectorAll(".modal-link");
	modalLinks.forEach((link) => {
		link.addEventListener("click", function () {
			const action = this.getAttribute("data-action");
			window.location.href = "/login?r=" + action;
		});
	});
});
