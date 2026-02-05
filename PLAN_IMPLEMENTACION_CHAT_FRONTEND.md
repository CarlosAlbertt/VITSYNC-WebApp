# Tutorial de Implementación: Frontend Chat (Paso a Paso)

Este documento está diseñado para que **aprendas** cómo funciona cada pieza mientras la construyes. Copia el código, pero lee los comentarios para entender el "por qué".

## Módulo 1: El Servicio de Comunicación (`websocket.js`)

**Objetivo**: Crear un "teléfono" que mantenga la línea abierta con el servidor.

Abre `src/services/websocket.js` y escribe este código.

### 1. Importaciones y Variables
Primero, traemos las herramientas necesarias.
```javascript
// Cliente STOMP: Es el protocolo que organiza los mensajes (como HTTP pero para chat)
import { Client } from '@stomp/stompjs';
// SockJS: Es un respaldo por si el navegador no soporta WebSockets puros
import SockJS from 'sockjs-client';

// Importamos el store (memoria) para guardar los mensajes que lleguen
import { addMessage } from '../store/chat';

// URL de tu servidor backend en Spring Boot
const SOCKET_URL = 'http://localhost:8080/ws';

// Variable para guardar la conexión activa
let client = null;
```

### 2. La Función de Conexión
Esta función la llamaremos cuando la app arranque.
```javascript
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
            console.log('✅ Conectado al Chat');

            // SUSCRIPCIÓN (OÍDO)
            // Nos "suscribimos" a nuestro buzón personal. 
            // Cuando Spring envíe algo a este usuario, se ejecutará este código.
            client.subscribe('/user/queue/messages', (message) => {
                // message.body es un Texto JSON, hay que convertirlo a Objeto JS
                const parsedContent = JSON.parse(message.body);
                console.log('📩 Nuevo mensaje:', parsedContent);
                
                // Guardamos el mensaje en nuestra "caja" (store) para verlo en pantalla
                addMessage(parsedContent);
            });
        },

        // EVENTO 2: ERROR
        onStompError: (frame) => {
            console.error('❌ Error en el chat:', frame.headers['message']);
        }
    });

    // ¡ACTIVAR LA CONEXIÓN! (Darle al botón de encendido)
    client.activate();
};
```

### 3. La Función de Enviar Mensaje
Esta función la usará el chat cuando presiones "Enter".
```javascript
export const sendMessage = (recipientId, content, myNif) => {
    // Verificación de seguridad básica
    if (!client || !client.active) {
        console.error('No hay conexión');
        return;
    }

    // Preparamos el paquete de datos (Payload) coincidiendo con tu clase ChatMessage.java
    const chatMessage = {
        senderId: myNif,      // Quién envía
        recipientId: recipientId, // Quién recibe
        content: content,     // El texto
        timestamp: new Date().toISOString() // La hora actual
    };

    // PUBLICAR (HABLAR)
    // Enviamos el paquete a la dirección que escucha el ChatController.java
    client.publish({
        destination: '/app/chat',
        body: JSON.stringify(chatMessage) // Convertir Objeto JS a Texto para viajar por la red
    });
};
```

---

## Módulo 2: El Cerebro / Memoria (`store/chat.js`)

**Objetivo**: Tener un lugar centralizado donde guardar los mensajes. Si cambias de pantalla, los mensajes siguen ahí.

Abre `src/store/chat.js`.

```javascript
import { ref } from 'vue';

// ESTADO (La Memoria)
// 'ref' hace que si esta variable cambia, la pantalla se actualice sola (Reactividad).
export const messages = ref([]); 

// MÉTODOS (Las Acciones)

// 1. Añadir mensaje: Lo usamos cuando llega uno nuevo o enviamos uno
export const addMessage = (msg) => {
    messages.value.push(msg); // .push mete un elemento al final del array
};

// 2. Cargar historial: Imítalo de tu servicio de API (opcional por ahora)
// export const setMessages = (history) => { messages.value = history; }
```

---

## Módulo 3: La Ventana Visual (`ChatWindow.vue`)

**Objetivo**: Mostrar lo que hay en memoria y permitir escribir.

Abre `src/components/chat/ChatWindow.vue`.

### Script (Lógica)
```javascript
<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
// Importamos nuestras funciones creadas antes
import { messages } from '../../store/chat';
import { sendMessage, connectWebSocket } from '../../services/websocket';

// Variables locales del componente
const newMessageText = ref(''); // Lo que escribes en el input
const messagesContainer = ref(null); // Referencia al <div> del chat para el scroll

// Al cargar el componente...
onMounted(() => {
    connectWebSocket(); // ¡Iniciar la conexión!
});

// Función para enviar
const handleSend = () => {
    if (newMessageText.value.trim() === '') return; // No enviar vacíos

    // LLAMAMOS AL SERVICIO (ID '1' y '2' son ejemplos, ajústalos a tu lógica real)
    sendMessage(2, newMessageText.value, 1); 
    
    newMessageText.value = ''; // Limpiar el input
};

// Auto-Scroll: Vigila ('watch') la lista de mensajes. 
// Si cambia, espera a que se pinte (nextTick) y baja el scroll al final.
watch(messages, async () => {
    await nextTick();
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
});
</script>
```

### Template (HTML Visual)
```html
<template>
  <div class="chat-card">
    <!-- Header -->
    <div class="chat-header">Chat Médico</div>

    <!-- Área de Mensajes (Loop) -->
    <div class="chat-body" ref="messagesContainer">
      <!-- v-for: Repite este div por cada mensaje en la lista -->
      <div 
        v-for="(msg, index) in messages" 
        :key="index"
        :class="['message-bubble', msg.senderId === 1 ? 'sent' : 'received']"
      >
        <!-- :class aplica clase 'sent' si soy yo, 'received' si es el otro -->
        {{ msg.content }}
      </div>
    </div>

    <!-- Footer (Input) -->
    <div class="chat-footer">
      <!-- v-model: Conecta lo que escribes con la variable newMessageText -->
      <!-- @keyup.enter: Ejecuta handleSend al pulsar Enter -->
      <input 
        v-model="newMessageText" 
        @keyup.enter="handleSend"
        placeholder="Escribe un mensaje..." 
      />
      <button @click="handleSend">Enviar</button>
    </div>
  </div>
</template>
```

### Style (CSS Básico)
Copia esto al final de tu archivo `.vue` para que no se vea feo.
```css
<style scoped>
.chat-card { width: 300px; height: 400px; border: 1px solid #ccc; display: flex; flex-direction: column; }
.chat-body { flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 8px; }
.message-bubble { padding: 8px 12px; border-radius: 15px; max-width: 80%; word-wrap: break-word; }
/* Mensajes Míos (Derecha, Azul) */
.sent { align-self: flex-end; background-color: #007bff; color: white; border-bottom-right-radius: 2px; }
/* Mensajes Recibidos (Izquierda, Gris) */
.received { align-self: flex-start; background-color: #f1f0f0; color: black; border-bottom-left-radius: 2px; }
.chat-footer { padding: 10px; display: flex; gap: 5px; border-top: 1px solid #eee; }
input { flex: 1; padding: 5px; }
</style>
```

---
**Instrucciones para ti:**
1.  Ve archivo por archivo.
2.  Lee qué hace cada bloque.
3.  Escríbelo o cópialo, intentando entender qué hace cada línea.
4.  Si algo falla, ¡pregúntame por esa línea específica!
