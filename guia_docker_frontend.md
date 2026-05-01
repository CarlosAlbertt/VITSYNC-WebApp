# Guía de Uso: Docker en Frontend (VITSYNC WebApp)

Esta guía contiene los pasos directos para levantar la aplicación utilizando Docker, tanto en tu entorno local como en el servidor de producción.

## 1. Entorno de Desarrollo (Local)

El entorno local utiliza `docker-compose.yml` y levanta el servidor de desarrollo de Vite (Hot-Reloading).

### Pasos:

1. **Configurar el entorno**: Asegúrate de tener tu archivo `.env` configurado. Por defecto, puedes apuntar al backend local:
   ```env
   VITE_API_URL=http://localhost:8080
   ```

2. **Levantar la aplicación**:
   ```bash
   docker compose up -d --build
   ```
   *La web estará disponible en [http://localhost:5173](http://localhost:5173).*

3. **Ver logs (Opcional)**:
   ```bash
   docker compose logs -f
   ```

4. **Entrar al contenedor (Opcional)**:
   Si necesitas instalar nuevas dependencias (`npm install`) o ejecutar scripts manualmente:
   ```bash
   docker exec -it vitsync-webapp-dev sh
   ```

5. **Detener el entorno**:
   ```bash
   docker compose down
   ```

---

## 2. Entorno de Producción (`master` / Servidor)

El entorno de producción utiliza `docker-compose.prod.yml`, compila el código optimizado y lo sirve con Nginx. No sincroniza archivos locales.

### Pasos:

1. **Exportar variables de entorno**:
   En el servidor, antes de levantar el contenedor, define las variables necesarias para que se inyecten durante la compilación:
   ```bash
   export VITE_API_URL=https://tu-api-produccion.com
   export VITE_TALKJS_APP_ID=tu_id
   export VITE_API_KEY=tu_api_key
   ```

2. **Levantar la aplicación**:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```
   *La web estará disponible en el puerto `80` (HTTP estándar).*

3. **Detener el entorno**:
   ```bash
   docker compose -f docker-compose.prod.yml down
   ```
