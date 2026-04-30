<template>
    <footer class="site-footer text-center py-8">
        <h3 class="footer-text">@VITSYNC 2026</h3>
    </footer>
</template>

<style scoped>
/* ─── Footer ─────────────────────────────────────── */
.site-footer {
    background-color: var(--accent);   /* teal en modo claro */
    transition: background-color 0.25s ease, border-color 0.25s ease, color 0.2s ease;
}

html.dark .site-footer {
    background-color: var(--bg-surface);  /* #141E2E */
    border-top: 1px solid var(--border);
}

.footer-text {
    color: #fff;
}

html.dark .footer-text {
    color: var(--text-secondary);
}
</style>
