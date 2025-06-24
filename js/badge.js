document.addEventListener("DOMContentLoaded", function () {
	let pollInterval;
	function startPolls() {
		pollStatus();
		pollInterval = setInterval(pollStatus, 1000);
	}
	function pollStatus() {
		fetch("./api/status")
			.then((response) => response.json())
			.then((data) => {
				if (data
					.status === "online") {
					document
						.getElementById("badge-waiting")
						.classList.add("badge-hidden");
					document
						.getElementById("badge-online")
						.classList.remove("badge-hidden");
					const badgeText = document.getElementById("badge-text");
					badgeText.textContent =
						"Connected. Clients online: " + data.users;
				} else {
					throw new Error("Systems are offline");
				}
			})
			.catch((error) => {
				document
					.getElementById("badge-waiting")
					.classList.add("badge-hidden");
				document
					.getElementById("badge-offline")
					.classList.remove("badge-hidden");
				const badgeText = document.getElementById("badge-text");
				badgeText.textContent = "Systems are offline";
				clearInterval(pollInterval);
			});
	}
	setTimeout(startPolls, 1500);
});
