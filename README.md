# VitSync WebApp

Frontend de la plataforma **VitSync** — aplicación web para la gestión de la relación paciente-médico.

Construido con **Vue 3** + **Vite** + **Tailwind CSS**.

## Configuración del entorno

### Requisitos
- Node.js ^20.19.0 o >=22.12.0

### Instalación
```sh
npm install
```

### Desarrollo local
1. Copia `.env.development.example` a `.env.development`
2. Rellena las variables con tus credenciales de desarrollo
3. Ejecuta:
```sh
npm run dev
```

### Build de producción
```sh
npm run build
```

## Estructura de configuración

| Archivo | Entorno | Commiteado |
|---|---|---|
| `.env` | Base (vacío) | ✅ Sí |
| `.env.development` | Desarrollo local | ❌ No (gitignored) |
| `.env.development.example` | Plantilla para devs | ✅ Sí |
| `.env.production` | Producción (Vercel) | ✅ Sí |
