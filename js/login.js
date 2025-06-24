(() => {
	document.addEventListener('DOMContentLoaded', () => {
		const form = document.getElementById('login-form');
		const dimmer = document.getElementById('modal-dimmer');
		const button = form.querySelector('#login-btn');

		const enableSubmit = () => {
			button.disabled = false;
			button.classList.remove('form-button-disabled');
		};

		const disableFields = () => {
			form.querySelectorAll('.form-field-input').forEach(field => {
				field.disabled = true;
				field.classList.add('form-field-input-disabled');
				field.addEventListener('transitionend', () => field.remove());
			});
		};

		const toHomeButton = () => {
			form.querySelector('.form-title').remove();
			enableSubmit();
			button.innerText = 'Go Home';
			button.addEventListener('click', e => {
				e.preventDefault();
				window.location.href = '/';
			});
		};

		const removeCaptcha = success => {
			const container = form.querySelector('#form-captcha');
			if (!container) return;
			if (success) {
				container.addEventListener('transitionend', () => {
					turnstile.remove(window.cID);
					enableSubmit();
				}, { once: true });
				setTimeout(() => {
					container.style.opacity = 0;
					container.style.height = "0px";
				}, 850);
			} else {
				container.remove();
				disableFields();
				toHomeButton();
				form.querySelector(".form-content").style.marginTop = "1.5rem";
			}
		};

		window.removeCaptcha = removeCaptcha;

		window.captchaCB = () => {
			window.cID = turnstile.render('#form-captcha', {
				sitekey: '0x4AAAAAABiCMJew4cKbRN0v',
				theme: 'dark',
				size: 'flexible',
				callback: token => { removeCaptcha(true); window.captchaToken = token; },
				'feedback-enabled': false,
				'error-callback': () => {
					removeCaptcha(false)
				}
			});
		};

		const onSubmit = async e => {
			e.preventDefault();
			if (!window.captchaToken) return;
			form.querySelectorAll('.form-field-input').forEach(f => f.classList.add('form-field-input-paused'));
			button.disabled = true;
			button.classList.add('form-button-disabled');
			const spinner = form.querySelector('.loader-spinner');
			if (spinner) {
				spinner.classList.replace('loader-hidden', 'loader-visible');
				button.querySelector('.login-btn-text').remove();
			}
			const body = {
				username: form.querySelector('#username').value.trim(),
				password: form.querySelector('#password').value,
				'cf-turnstile-response': window.captchaToken
			};
			try {
				const r = await fetch('/api/login/', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				});
				const out = await r.json();
				if (out.success) {
					window.location.href = 'https://mit.ong';
				} else {
					removeCaptcha(false);
				}
			} catch {
				removeCaptcha(false);
			}
		};

		setTimeout(() => {
			dimmer.classList.replace('modal-dimmer-hidden', 'modal-dimmer-visible');
			form.classList.replace('form-hidden', 'form-visible');
		}, 10);
		form.querySelector('form').addEventListener('submit', onSubmit);
	});
})();
