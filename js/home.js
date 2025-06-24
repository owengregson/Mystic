(() => {
    const randInt = (min, max) => {
        const lo = Math.ceil(min);
        const hi = Math.floor(max);
        return Math.floor(Math.random() * (hi - lo + 1)) + lo;
    };

    const dimmer = document.getElementById('modal-dimmer');

    const showModal = id => {
        const modal = document.getElementById(`${id}-modal`);
        if (!modal) return;
        dimmer.classList.replace('modal-dimmer-hidden', 'modal-dimmer-visible');
        modal.classList.replace('modal-hidden', 'modal-visible');
    };

    const hideModal = () => {
        const modal = document.querySelector('.modal-overlay.modal-visible');
        if (!modal) return;
        dimmer.classList.replace('modal-dimmer-visible', 'modal-dimmer-hidden');
        modal.classList.replace('modal-visible', 'modal-hidden');
    };

    const bindModalActions = () => {
        document.querySelectorAll('.modal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.action === 'modal-close') hideModal();
            });
        });
    };

    const bindCardActions = () => {
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', () => {
                const action = card.dataset.action || '';
                if (action === 'chat') {
                    showModal('chat-maintenance');
                } else {
                    window.location.href = `/login?r=${action}`;
                }
            });
        });
        document.querySelectorAll('.modal-link').forEach(link => {
            link.addEventListener('click', () => {
                window.location.href = `/login?r=${link.dataset.action}`;
            });
        });
    };

    const fetchIp = () => {
        fetch('https://api.ipify.org?format=json')
            .then(res => (res.ok ? res.json() : null))
            .then(data => {
                const ip = data ? data[Object.keys(data)[0]] : 'UNKNOWN';
                window.client_fwd = ip;
                setTimeout(() => {
                    const el = document.getElementById('client-connection');
                    if (el) el.innerText = `WELCOME BACK, ${ip}.`;
                }, randInt(366, 872));
            })
            .catch(() => {});
    };

    document.addEventListener('DOMContentLoaded', () => {
        fetchIp();
        setTimeout(() => {
            dimmer.classList.replace('modal-dimmer-visible', 'modal-dimmer-hidden');
        }, 50);
        bindModalActions();
        bindCardActions();
        window.showModal = showModal;
        window.hideModal = hideModal;
    });
})();
