# 🔗 Guía de Integración Full-Stack — VitSync

> Cómo se conectan el Frontend (Vue) y el Backend (Spring Boot). Documento esencial para entender cómo fluyen los datos de punta a punta.

---

## 📋 Índice

- [Visión General del Ecosistema](#-visión-general-del-ecosistema)
- [Flujo Completo: Login](#-flujo-completo-login)
- [Flujo Completo: Registro + Verificación](#-flujo-completo-registro--verificación)
- [Flujo Completo: CRUD Admin](#-flujo-completo-crud-admin)
- [Flujo Completo: Chat WebSocket](#-flujo-completo-chat-websocket)
- [Mapeo Frontend ↔ Backend](#-mapeo-frontend--backend)
- [Errores comunes de integración](#-errores-comunes-de-integración)

---

## 🌐 Visión General del Ecosistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                         VITSYNC ECOSYSTEM                           │
│                                                                     │
│   ┌─────────────────────┐        ┌──────────────────────┐          │
│   │  VITSYNC-WebApp     │  HTTP  │  VITSYNC-API         │          │
│   │  (Vue 3 + Vite)     │───────▶│  (Spring Boot 3)     │          │
│   │                     │◀───────│                      │          │
│   │  Puerto: 5173       │  JSON  │  Puerto: 8080        │          │
│   │                     │        │                      │          │
│   │  ┌──────────┐       │  WS    │  ┌──────────────┐   │          │
│   │  │ SockJS   │───────┼───────▶│  │ STOMP Server │   │          │
│   │  │ Client   │◀──────┼───────│  │ (WebSocket)  │   │          │
│   │  └──────────┘       │        │  └──────────────┘   │          │
│   └─────────────────────┘        └───────────┬──────────┘          │
│                                              │                     │
│                                              │ JDBC                │
│                                              ▼                     │
│                                   ┌────────────────────┐           │
│                                   │  PostgreSQL (Neon)  │           │
│                                   │  Base de datos      │           │
│                                   └────────────────────┘           │
│                                              │                     │
│                              ┌───────────────┼───────────────┐     │
│                              │               │               │     │
│                              ▼               ▼               ▼     │
│                         ┌────────┐     ┌────────┐     ┌────────┐  │
│                         │ Resend │     │  Neon  │     │ Render │  │
│                         │ (Email)│     │ (BD)   │     │(Deploy)│  │
│                         └────────┘     └────────┘     └────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Servicios externos

| Servicio | ¿Qué hace? | URL |
|---|---|---|
| **Neon** | BD PostgreSQL serverless (se apaga cuando no hay tráfico) | [console.neon.tech](https://console.neon.tech) |
| **Render** | Hosting del backend (Java) | [render.com](https://render.com) |
| **Vercel** | Hosting del frontend (Vue/Vite) | [vercel.com](https://vercel.com) |
| **Resend** | API de envío de emails transaccionales | [resend.com](https://resend.com) |
| **TalkJS** | Widget de chat embebido | [talkjs.com](https://talkjs.com) |

---

## 🔐 Flujo Completo: Login

### Paso a paso con código

```
┌──────────────────────────────────────────────────────────────────┐
│ FRONTEND                                                         │
├──────────────────────────────────────────────────────────────────┤

// 1. Login.vue — El usuario rellena el formulario y pulsa "Iniciar sesión"
<form @submit.prevent="handleLogin">
    <input v-model="nif" />
    <input v-model="password" type="password" />
    <button type="submit">Iniciar Sesión</button>
</form>

// 2. Login.vue — handleLogin() llama al store
import { login } from '../store/auth';
const handleLogin = async () => {
    await login(nif.value, password.value);
    router.push('/perfil');
};

// 3. store/auth.js — login() envía petición al backend
export const login = async (nif, password) => {
    const response = await api.post('/api/auth/login', { nif, password });
    localStorage.setItem('token', response.data.token);
    // ...
};

// 4. services/api.js — Axios envía POST con headers
POST http://localhost:8080/api/auth/login
Content-Type: application/json
Body: { "nif": "12345678A", "password": "Password123" }

├──────────────────────────────────────────────────────────────────┤
│ BACKEND                                                          │
├──────────────────────────────────────────────────────────────────┤

// 5. AuthController.java — Recibe la petición
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    AuthResponse response = authService.login(request);
    return ResponseEntity.ok(response);
}

// 6. AuthService.java — Lógica de negocio
public AuthResponse login(LoginRequest request) {
    User user = userRepository.findByNif(request.getNif())     // BD query
    passwordEncoder.matches(request.getPassword(), user.getPassword())  // BCrypt
    String token = jwtUtil.generateToken(user.getNif(), role)  // Genera JWT
    return AuthResponse.builder().token(token).build();
}

// 7. Respuesta HTTP
HTTP 200 OK
{
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUEFDSUVOVEUiLCJzdWIi...",
    "nif": "12345678A",
    "email": "usuario@vitsync.es",
    "role": "PACIENTE",
    "id": 42,
    "message": "Login exitoso"
}

├──────────────────────────────────────────────────────────────────┤
│ FRONTEND (vuelta)                                                │
├──────────────────────────────────────────────────────────────────┤

// 8. El token se guarda en localStorage y en el estado reactivo
// 9. Vue Router navega a /perfil
// 10. Todas las peticiones posteriores incluyen: Authorization: Bearer <token>
└──────────────────────────────────────────────────────────────────┘
```

---

## 📝 Flujo Completo: Registro + Verificación

```
PASO 1: REGISTRO
════════════════
Register.vue → store/auth.register(userData) → POST /api/auth/register
                                                        │
                                              AuthService.register():
                                              ├── Valida NIF/email únicos
                                              ├── Crea User (BCrypt password)
                                              ├── Genera código 6 dígitos
                                              ├── Guarda en BD
                                              └── EmailService.sendVerificationEmail()
                                                        │
                                              Resend API → Email al usuario
                                                        │
                                              Response: { token, message }
                                                        │
Register.vue ← router.push('/verify-account') ◄────────┘


PASO 2: VERIFICACIÓN
════════════════════
VerifyAccount.vue → POST /api/auth/verify { email, code: "123456" }
                                                        │
                                              AuthService.verifyAccount():
                                              ├── findByEmail() (1 query)
                                              ├── Compara código
                                              ├── user.setVerified(true)
                                              ├── Limpia código
                                              └── sendWelcomeEmail()
                                                        │
VerifyAccount.vue ← router.push('/login') ◄─────────────┘
```

---

## 🛠 Flujo Completo: CRUD Admin

### Ejemplo: Admin edita un usuario

```
AdminUsuarios.vue
    │
    │ Monta tabla con todos los usuarios
    │ onMounted() → fetchUsuarios() → GET /api/admin/users
    │                                       │
    │                           AdminUserController.getAll()
    │                           → AdminUserService.findAll()
    │                           → UserRepository.findAll()
    │                           → [User, User, User, ...]
    │                                       │
    │ ◄── response.data ────────────────────┘
    │
    │ Admin pulsa "Editar" en un usuario
    │ Abre modal con formulario
    │
    │ Admin cambia email y pulsa "Guardar"
    │ updateUsuario(id, data) → PUT /api/admin/users/42
    │                                       │
    │                           AdminUserController.update(42, request)
    │                           → AdminUserService.update():
    │                              ├── Busca usuario por ID
    │                              ├── Valida unicidad email/NIF
    │                              ├── Actualiza campos
    │                              ├── Hashea nueva contraseña (si se envió)
    │                              └── userRepository.save(user)
    │                                       │
    │ ◄── user actualizado ─────────────────┘
    │
    │ Actualiza la tabla local
```

---

## 💬 Flujo Completo: Chat WebSocket

```
1. CONEXIÓN
   Comunicacion.vue se monta → connectWebSocket()
   → SockJS abre conexión a ws://localhost:8080/ws
   → STOMP handshake → onConnect callback
   → client.subscribe('/user/queue/messages', handler)

2. ENVÍO DE MENSAJE
   Usuario escribe "Hola" y pulsa Enviar
   → client.publish({ destination: '/app/chat', body: JSON.stringify(msg) })
   → Spring recibe en @MessageMapping("/chat")
   → ChatController.processMessage()
   → ChatService.save(mensaje)  ← Persiste en BD
   → messagingTemplate.convertAndSendToUser(destinatario, '/queue/messages', msg)

3. RECEPCIÓN
   El destinatario está suscrito a /user/queue/messages
   → handler(message) se ejecuta automáticamente
   → JSON.parse(message.body)
   → addMessage(parsedContent) ← Actualiza store/chat.js
   → Vue re-renderiza el componente de chat

4. DESCONEXIÓN
   Usuario hace logout → disconnectWebSocket()
   → client.deactivate()
```

---

## 📊 Mapeo Frontend ↔ Backend

### Qué archivos se corresponden

| Frontend (WebApp) | Backend (API) | Función |
|---|---|---|
| `store/auth.js` | `AuthController.java` + `AuthService.java` | Login, registro, verificación |
| `store/profile.js` | `UserController.java` | Perfil de usuario |
| `store/medicos.js` | `MedicoController.java` + `MedicoService.java` | CRUD médicos |
| `store/especialidades.js` | `EspecialidadController.java` | CRUD especialidades |
| `store/enfermedades.js` | — (datos en frontend) | Enfermedades y tratamientos |
| `store/citas.js` | `CitaController.java` + `CitaService.java` | Citas médicas |
| `store/hospitales.js` | `HospitalController.java` | Centros médicos |
| `store/usuarios.js` | `AdminUserController.java` | Admin: gestión usuarios |
| `store/chat.js` | `ChatController.java` + `ChatService.java` | Mensajería |
| `services/api.js` | `SecurityConfig.java` + `JwtAuthFilter.java` | Auth + CORS |
| `services/websocket.js` | `WebSocketConfig.java` | Chat en tiempo real |

### Mapeo de DTOs

| Frontend envía | Backend recibe (DTO) | Backend responde (DTO) |
|---|---|---|
| `{ nif, password }` | `LoginRequest` | `AuthResponse` |
| `{ name, email, nif, ... }` | `RegisterRequest` | `AuthResponse` |
| `{ email, code }` | Parámetros directos | `void` (200 OK) |
| `{ name, firstName, ... }` | `UserUpdateRequest` | `UserResponse` |
| `{ doctor, date, time, ... }` | `CitaRequest` | `Cita` (entidad) |

---

## ⚠️ Errores Comunes de Integración

### 1. CORS — "Access-Control-Allow-Origin"

**Síntoma**: El navegador bloquea las peticiones al backend.

**Causa**: El backend no incluye tu origen en los CORS permitidos.

**Solución**: Añadir `http://localhost:5173` en `app.cors.allowed-origins` del `application-dev.properties`.

### 2. 401 Unauthorized en todas las peticiones

**Síntoma**: Login funciona pero el resto de peticiones devuelve 401.

**Causa**: El interceptor de Axios no está enviando el token.

**Verificar**:
1. `localStorage.getItem('token')` devuelve algo
2. La petición incluye header `Authorization: Bearer <token>`
3. El token no ha expirado (24h por defecto)

### 3. 404 en un endpoint que sí existe

**Síntoma**: El endpoint funciona en Postman pero no desde Vue.

**Causas comunes**:
- Falta `/api` en la ruta (el frontend ya tiene `baseURL` configurado)
- Olvidaste añadir la ruta en `SecurityConfig` como `.permitAll()`

### 4. Render tarda en responder (cold start)

**Síntoma**: La primera petición tarda ~30 segundos.

**Causa**: Render apaga los servicios gratuitos tras 15 min de inactividad.

**Solución**: Es normal en plan gratuito. La segunda petición es rápida.

### 5. "Cannot read properties of null" en el frontend

**Síntoma**: Error al acceder a datos del perfil.

**Causa**: El store no ha cargado los datos aún (la petición async no ha terminado).

**Solución**: Usar `v-if` para mostrar un loader mientras `loading.value` es true.
