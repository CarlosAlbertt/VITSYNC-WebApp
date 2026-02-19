# VitSync WebApp

Frontend de la plataforma **VitSync** — aplicación web para la gestión de la relación paciente-médico.

Construido con **Vue 3** + **Vite** + **Tailwind CSS**.

## 🚀 Guía Rápida para Desarrolladores (Setup Inicial)

Si acabas de clonar el repositorio o has hecho `git pull` y te da error, sigue estos pasos:

### 1. Backend (VITSYNC-API)
Necesitas crear tu configuración local (ya que los secretos no se suben a git).
1. Copia el archivo de ejemplo:
   ```bash
   cp src/main/resources/application-dev.properties.example src/main/resources/application-dev.properties
   ```
2. (Opcional) Edita `application-dev.properties` si necesitas cambiar la BD o credenciales.
3. Ejecuta la app con el perfil `dev`:
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
   ```

### 2. Frontend (VITSYNC-WebApp)
Lo mismo para las variables de entorno del front.
1. Copia el archivo de ejemplo:
   ```bash
   cp .env.development.example .env.development
   ```
2. Instala y corre:
   ```bash
   npm install
   npm run dev
   ```

---

## 🛠 Configuración del Proyectorno

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
