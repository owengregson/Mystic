document.addEventListener("DOMContentLoaded", function () {
	const fc = document.getElementById("footer-copyright");
	let it = fc.innerText;
	fc.innerText = it.replace(
		"{YEAR}",
		new Date().getFullYear()
	);
});