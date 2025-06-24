/* loader.js - simple static routing */
(() => {
    const slug = location.pathname.replace(/^\/|\/$/g, '') || 'home';
    fetch(`/pages/${slug}.html`)
        .then(r => (r.ok ? r.text() : Promise.reject(r.status)))
        .then(html => {
            document.open();
            document.write(html);
            document.close();
        })
        .catch(err => {
            console.error('Page load failed', err);
            document.body.innerHTML = '<h1>404 — page not found</h1>';
        });
})();
