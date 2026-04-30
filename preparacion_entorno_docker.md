# Guía de Preparación del Entorno Local para Docker

Dado que el proyecto ahora está dockerizado, necesitas tener Docker instalado en tu máquina local para poder levantar el entorno de desarrollo.

Esta guía asume que utilizas **Windows**, que es el sistema operativo actual de tu entorno.

---

## 1. Requisitos Previos (WSL 2)

Docker en Windows funciona mejor utilizando el subsistema de Linux (WSL 2). Normalmente, Windows 10/11 ya viene preparado, pero es recomendable asegurarse.

1. Abre tu terminal (PowerShell o CMD) como Administrador.
2. Ejecuta el siguiente comando para instalar WSL (si no lo tienes) o actualizarlo:
   ```bash
   wsl --install
   ```
3. Reinicia tu ordenador si el sistema te lo pide.

---

## 2. Instalación de Docker Desktop

Docker Desktop es la herramienta gráfica y el motor que gestionará tus contenedores.

1. Ve a la página oficial de descarga:
   [https://docs.docker.com/desktop/install/windows-install/](https://docs.docker.com/desktop/install/windows-install/)
2. Haz clic en el botón azul **"Docker Desktop for Windows"**.
3. **IMPORTANTE**: Ejecuta el instalador `.exe` haciendo clic derecho y seleccionando **"Ejecutar como administrador"**.
4. Durante la instalación, **asegúrate de dejar marcada la opción "Use WSL 2 instead of Hyper-V"**.
5. Finaliza la instalación (puede que necesites reiniciar el ordenador de nuevo).

---

## 3. Solución de Errores Comunes (Troubleshooting)

### Error: "For security reasons C:\ProgramData\DockerDesktop must be owned by an elevated account"
Si te aparece este error durante la instalación de Docker Desktop, se debe a que ya existe una carpeta residual de una instalación anterior con permisos corruptos o a que no ejecutaste el instalador como administrador.

**Cómo solucionarlo:**
1. Abre el Explorador de Archivos de Windows.
2. Ve a `C:\ProgramData\` (Es posible que tengas que activar la vista de elementos ocultos en la pestaña "Ver").
3. Localiza la carpeta `DockerDesktop` y **elimínala**. (Si te pide permisos de administrador, acéptalos).
4. Vuelve a ejecutar el instalador de Docker Desktop haciendo **clic derecho -> Ejecutar como administrador**.

---

## 4. Comprobación y Primer Uso

1. **Inicia Docker Desktop**: Búscalo en tu menú de inicio de Windows y ábrelo. Verás que en la barra de tareas (abajo a la derecha) aparece el icono de una ballena. Espera a que el icono se ponga verde (significa que el motor está corriendo).
2. Abre tu terminal de **PowerShell** o la terminal integrada de **VS Code**.
3. Verifica que la instalación ha sido un éxito escribiendo:
   ```bash
   docker --version
   ```
   *(Debería devolver algo como: `Docker version 24.0.5, build xxxxx`)*
4. Verifica que Docker Compose también está disponible:
   ```bash
   docker compose version
   ```

---

## 5. ¡Listo para Levantar VITSYNC!

Una vez tengas Docker corriendo y la terminal te reconozca los comandos, puedes ir a la carpeta de la WebApp y levantar el proyecto:

```bash
cd VITSYNC-WebApp
docker compose up -d --build
```

A partir de este momento, puedes seguir la `guia_docker_frontend.md` para el uso habitual del proyecto.
