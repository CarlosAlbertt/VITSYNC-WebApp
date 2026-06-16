// Cliente STOMP: protocolo de mensajería sobre WebSocket (chat propio)
import { Client } from '@stomp/stompjs';
// SockJS: fallback si el navegador no soporta WebSockets puros
import SockJS from 'sockjs-client';
import { getAccessToken, refreshAccessToken } from './api';
import { logger } from '../utils/logger';

/**
 * Secure STOMP client for the backend chat (`/ws` + WebSocketAuthInterceptor).
 *
 * Security model (V-F12/V-F13 of the audit):
 * - The JWT travels in the STOMP CONNECT headers: the backend interceptor
 *   rejects anonymous connections.
 * - On auth errors the access token is silently refreshed and the client
 *   reconnects with the new one.
 * - Message PAYLOADS are never logged (clinical content) — only events.
 *
 * NOTA: el chat de producción usa TalkJS (ChatWindow.vue); este cliente
 * queda operativo para el chat STOMP propio del backend.
 */

// La URL del WS deriva de la de la API (V-F05: nada hardcodeado)
const WS_URL = `${import.meta.env.VITE_API_URL}/ws`;

let client = null;

/**
 * Opens (or reuses) the authenticated STOMP connection.
 *
 * @param {(message: object) => void} onMessage callback per incoming message
 * @returns {Client|null} the active client, or null without a session
 */
export const connectWebSocket = (onMessage) => {
    // Si ya estamos conectados, no duplicar conexión
    if (client && client.active) return client;

    const token = getAccessToken();
    if (!token) {
        logger.warn('WS: sin sesión activa, no se conecta');
        return null;
    }

    client = new Client({
        webSocketFactory: () => new SockJS(WS_URL),

        // Autenticación del handshake STOMP (el backend valida el Bearer)
        connectHeaders: { Authorization: `Bearer ${getAccessToken()}` },

        // Heartbeats: detectan conexiones zombi en ambos sentidos
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,

        // Reconexión automática; refresca el header por si el token rotó
        reconnectDelay: 5000,
        beforeConnect: () => {
            client.connectHeaders = { Authorization: `Bearer ${getAccessToken()}` };
        },

        onConnect: () => {
            logger.log('WS conectado');
            // Buzón personal: Spring enruta aquí los mensajes dirigidos al usuario
            client.subscribe('/user/queue/messages', (message) => {
                // Nunca loguear el contenido: es texto clínico
                logger.log('WS: mensaje recibido');
                try {
                    onMessage?.(JSON.parse(message.body));
                } catch {
                    logger.warn('WS: mensaje con cuerpo no-JSON descartado');
                }
            });
        },

        onStompError: async (frame) => {
            logger.warn('WS error STOMP:', frame.headers?.message);
            // Token caducado a mitad de sesión: refrescar y reconectar
            if (/unauthorized|expirado|inv[áa]lido/i.test(frame.headers?.message || '')) {
                try {
                    await refreshAccessToken();
                    // reconnectDelay reactivará con el header renovado (beforeConnect)
                } catch {
                    disconnectWebSocket();
                }
            }
        }
    });

    client.activate();
    return client;
};

/**
 * Sends a chat message through the authenticated connection.
 *
 * @param {string} destination STOMP destination (e.g. '/app/chat')
 * @param {object} payload message body
 */
export const sendMessage = (destination, payload) => {
    if (!client || !client.active) {
        logger.warn('WS: intento de envío sin conexión');
        return;
    }
    client.publish({ destination, body: JSON.stringify(payload) });
};

/** Closes the connection (logout / unmount). */
export const disconnectWebSocket = () => {
    if (client) {
        client.deactivate();
        client = null;
    }
};
