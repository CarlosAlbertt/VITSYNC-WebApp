// tailwind.config.js
export default {
    darkMode: 'class',

    content: ["./index.html", "./src/**/*.{vue,js,ts,tsx,jsx}"],

    theme: {
        extend: {
            colors: {
                // Tokens semánticos (conectados a CSS variables)
                base: 'var(--bg-base)',
                surface: 'var(--bg-surface)',
                elevated: 'var(--bg-elevated)',
                accent: 'var(--accent)',
                // Texto semántico
                'text-primary': 'var(--text-primary)',
                'text-secondary': 'var(--text-secondary)',
                'text-muted': 'var(--text-muted)',
                danger: '#F43F5E',
                warning: '#F59E08',
                info: '#0EA5E9',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
