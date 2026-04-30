# ──────────────────────────────────────────────
# Stage 1 — Base & Dependencies
# ──────────────────────────────────────────────
FROM node:20-alpine AS base

WORKDIR /app

# Copiar ficheros de dependencias primero (caché de capas)
COPY package.json package-lock.json ./
RUN npm ci

# ──────────────────────────────────────────────
# Stage 2 — Development
# ──────────────────────────────────────────────
FROM base AS dev
# Copiar el resto del código fuente
COPY . .
# Exponer el puerto de Vite
EXPOSE 5173
# El comando por defecto para desarrollo (Vite requiere --host para exponerlo fuera del contenedor)
CMD ["npm", "run", "dev", "--", "--host"]

# ──────────────────────────────────────────────
# Stage 3 — Build (Producción)
# ──────────────────────────────────────────────
FROM base AS build
COPY . .

# Variables de entorno que Vite inyecta en tiempo de build.
ARG VITE_API_URL
ARG VITE_TALKJS_APP_ID
ARG VITE_API_KEY

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_TALKJS_APP_ID=${VITE_TALKJS_APP_ID}
ENV VITE_API_KEY=${VITE_API_KEY}

RUN npm run build

# ──────────────────────────────────────────────
# Stage 4 — Serve con Nginx (Producción)
# ──────────────────────────────────────────────
FROM nginx:stable-alpine AS production

# Configuración personalizada de Nginx (SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos generados por Vite
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
