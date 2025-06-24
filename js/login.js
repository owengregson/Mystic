document.addEventListener("DOMContentLoaded", function () {
	setTimeout(() => {
		document
			.getElementById("modal-dimmer")
			.classList.replace("modal-dimmer-hidden", "modal-dimmer-visible");
		document
			.getElementById("login-form")
			.classList.replace("form-hidden", "form-visible");
	}, 10);
	document
		.querySelector("#login-form form")
		.addEventListener("submit", async (e) => {
			await onSubmit(e);
		});
});

function enableLoginSubmit() {
	const loginForm = document.getElementById("login-form");
	const loginBtn = loginForm.querySelector("#login-btn");
	if (loginBtn) {
		loginBtn.disabled = false;
		loginBtn.classList.remove("form-button-disabled");
	}
}

function disableLoginSubmit() {
	const loginForm = document.getElementById("login-form");
	let formFields = loginForm.querySelectorAll(".form-field-input");
	for (let field of formFields) {
		field.disabled = true;
		field.classList.add("form-field-input-disabled");
		field.addEventListener("transitionend", function () {
			field.remove();
		});
	}
}

function hideCaptcha(success = false) {
	const loginForm = document.getElementById("login-form");
	const captchaContainer = loginForm.querySelector("#form-captcha");
	let delay;
	if (success) delay = 850;
	else delay = 0;
	setTimeout(() => {
		if (captchaContainer) {
			captchaContainer.style.opacity = 0;
			captchaContainer.style.height = "0px";
		}
	}, delay);
	if (!success) {
		loginForm.querySelector(".form-content").style.marginTop = "1.5rem";
		disableLoginSubmit();
	}
	if (captchaContainer.style.opacity === "0") {
		loginForm.querySelector("#form-captcha").remove();
		const loginBtn = loginForm.querySelector("#login-btn");
		loginForm.querySelector(".form-title").remove();
		if (loginBtn) {
			loginBtn.disabled = false;
			loginBtn.classList.remove("form-button-disabled");
			loginBtn.innerText = "Go Home";
			loginBtn.addEventListener("click", function (e) {
				e.preventDefault();
				window.location.href = "/";
			});
		}
	} else {
		captchaContainer.addEventListener("transitionend", function () {
			turnstile.remove(window.cID);
			if (success) {
				enableLoginSubmit();
			} else {
				loginForm.querySelector("#form-captcha").remove();
				const loginBtn = loginForm.querySelector("#login-btn");
				loginForm.querySelector(".form-title").remove();
				if (loginBtn) {
					loginBtn.disabled = false;
					loginBtn.classList.remove("form-button-disabled");
					loginBtn.innerText = "Go Home";
					loginBtn.addEventListener("click", function (e) {
						e.preventDefault();
						window.location.href = "/";
					});
				}
			}
		});
	}
}

window.captchaCB = function () {
	window.cID = turnstile.render("#form-captcha", {
		sitekey: "0x4AAAAAABiCMJew4cKbRN0v",
		theme: "dark",
		size: "flexible",
		callback: function (token) {
			hideCaptcha(true);
			window.captchaToken = token;
		},
		"feedback-enabled": false,
		"error-callback": function (e) {
			hideCaptcha(false);
		},
	});
};

async function onSubmit(e) {
	const loginForm = document.getElementById("login-form");
	e.preventDefault();
	if (!window.captchaToken) return; // shouldn’t happen
	loginForm.querySelectorAll(".form-field-input").forEach((field) => {
		field.classList.add("form-field-input-paused");
	});
	const loginBtn = loginForm.querySelector("#login-btn");
	loginBtn.disabled = true;
	loginBtn.classList.add("form-button-disabled");
	const loaderSpinner = loginForm.querySelector(".loader-spinner");
	if (loaderSpinner) {
		loaderSpinner.classList.replace("loader-hidden", "loader-visible");
		loginBtn.querySelector(".login-btn-text").remove();
	}
	const body = {
		username: loginForm.querySelector("#username").value.trim(),
		password: loginForm.querySelector("#password").value,
		"cf-turnstile-response": captchaToken,
	};

	try {
		const r = await fetch("/api/login/", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});
		const out = await r.json();
		if (out.success) {
			window.location.href = "https://mit.ong";
		} else {
			hideCaptcha(false);
		}
	} catch {}
}
