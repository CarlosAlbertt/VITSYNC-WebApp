// Cliente STOMP: Es el protocolo que organiza los mensajes (como HTTP pero para chat)
import { Client } from '@stomp/stompjs';
// SockJS: es un respaldo por si el navegador no soporta WebSockets puros
import SockJS from 'sockjs-client';
// Importamos el store (memoria) para guardar los mensajes que lleguen
import { addMessage } from '../store/chat';
// URL del servidor backend en Spring Boot;
const SOCKET_URL = 'http://localhost:8080/ws';
//Variable para guardar la conexióna activa.
let client = null;


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
            console.log('Conectado al chat');

            // SUSCRIPCIÓN (OÍDO)
            // Nos "suscribimos" a nuestro buzón personal.
            // Cuando Spring envíe algo al usuario, se ejecturá este código.
            client.subscribe('/user/queue/messages', (message) => {
                // message.body es un texto JSON, hay que convertirlo a objeto JS
                const parsedContent = JSON.parse(message.body);
                console.log('Nuevo mensaje: ', parsedContent);

                // Guardamos el mensaje en nuestra "caja" (store) para verlo en pantalla
                addMessage(parsedContent);

            });
        },

        // EVENTO 2: ERROR
        onStompError: (frame) => {
            console.error('Error en el chat: ', frame.headers['message']);
        }
    });

    // ACTIVAR LA CONEXIÓN
    client.activate();
};