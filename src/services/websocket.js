/**
 * Servicio de WebSocket para el chat en tiempo real.
 *
 * Usa STOMP sobre SockJS para comunicación bidireccional con el backend.
 * La URL del servidor se lee de las variables de entorno (VITE_API_URL)
 * para evitar URLs hardcodeadas que apunten al entorno incorrecto.
 *
 * Flujo:
 * 1. connectWebSocket() → Establece conexión con el servidor
 * 2. Al conectar → Se suscribe a /user/queue/messages (buzón personal)
 * 3. Al recibir mensaje → Lo parsea y lo guarda en el store de chat
 * 4. disconnectWebSocket() → Cierra la conexión limpiamente
 */

// Cliente STOMP: Es el protocolo que organiza los mensajes (como HTTP pero para chat)
import { Client } from '@stomp/stompjs';
// SockJS: es un respaldo por si el navegador no soporta WebSockets puros
import SockJS from 'sockjs-client';
// Importamos el store (memoria) para guardar los mensajes que lleguen
import { addMessage } from '../store/chat';

/**
 * Construye la URL del WebSocket dinámicamente.
 * Usa VITE_API_URL de las variables de entorno para apuntar al servidor correcto
 * según el entorno (local, testing, producción).
 *
 * @returns {string} URL completa del endpoint WebSocket (ej: "http://localhost:8080/ws")
 */
const getSocketUrl = () => {
    // Leer la URL base de la API desde las variables de entorno
    const apiUrl = import.meta.env.VITE_API_URL;

    if (apiUrl) {
        // Usar la URL configurada en el entorno (funciona para local, testing y producción)
        return `${apiUrl}/ws`;
    }

    // Fallback: detectar por hostname si no hay variable de entorno
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8080/ws';
    }

    // Último recurso: producción
    return 'https://vitsync-api.onrender.com/ws';
};

const SOCKET_URL = getSocketUrl();

// Variable para guardar la conexión activa.
let client = null;

/**
 * Establece la conexión WebSocket con el servidor.
 * Si ya hay una conexión activa, no crea una nueva (evita duplicados).
 * Incluye reconexión automática cada 5 segundos si se pierde la conexión.
 */
export const connectWebSocket = () => {
    // Si ya estamos conectados, no hacemos nada para evitar duplicados
    if (client && client.active) return;

    // CONFIGURACIÓN DEL CLIENTE
    client = new Client({
        // Fábrica: Indica qué tecnología usar (SockJS sobre la URL definida)
        webSocketFactory: () => new SockJS(SOCKET_URL),
        // RECONEXIÓN: Si se cae internet, intenta volver en 5 segundos
        reconnectDelay: 5000,

        // EVENTO 1: ÉXITO AL CONECTAR
        onConnect: () => {
            console.log('[WebSocket] Conectado al chat en:', SOCKET_URL);

            // SUSCRIPCIÓN (OÍDO)
            // Nos "suscribimos" a nuestro buzón personal.
            // Cuando Spring envíe algo al usuario, se ejecutará este código.
            client.subscribe('/user/queue/messages', (message) => {
                // message.body es un texto JSON, hay que convertirlo a objeto JS
                const parsedContent = JSON.parse(message.body);
                console.log('[WebSocket] Nuevo mensaje:', parsedContent);

                // Guardamos el mensaje en nuestra "caja" (store) para verlo en pantalla
                addMessage(parsedContent);
            });
        },

        // EVENTO 2: ERROR
        onStompError: (frame) => {
            console.error('[WebSocket] Error STOMP:', frame.headers['message']);
        },

        // EVENTO 3: DESCONEXIÓN
        onDisconnect: () => {
            console.log('[WebSocket] Desconectado del chat');
        }
    });

    // ACTIVAR LA CONEXIÓN
    client.activate();
};

/**
 * Cierra la conexión WebSocket de forma limpia.
 * Debe llamarse al hacer logout o al desmontar componentes que usen el chat.
 */
export const disconnectWebSocket = () => {
    if (client && client.active) {
        client.deactivate();
        console.log('[WebSocket] Conexión cerrada manualmente');
    }
};