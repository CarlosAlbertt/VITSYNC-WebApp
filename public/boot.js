// Script de arranque pre-Vue. Vive en archivo externo (no inline) para que
// la CSP `script-src 'self'` lo permita sin necesitar nonces ni hashes.

// 1. Tema oscuro antes del primer paint (evita el flash claro→oscuro)
(function () {
    const saved = localStorage.getItem('vueuse-color-scheme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }
})();

// 2. Shim para sockjs-client, que espera el `global` de Node
window.global = window;
