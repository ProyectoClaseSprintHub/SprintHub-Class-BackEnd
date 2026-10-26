# SprintHub-Backend v2

API REST + WebSockets para la gestion colaborativa de proyectos: grupos, tableros, columnas y tarjetas.

Version derivada de [SprintHub-Backend](https://github.com/SprinHub-Team/SprintHub-Backend) con alcance reducido. Solo se conservan los features indicados y sus dependencias:

- Sin **Comments**: se eliminaron por completo el modelo, repositorio, servicio, socket, mapper y DTOs de comentarios.
- Sin **AddFile / RemoveFile en Cards**: se elimino el campo `files` del modelo Card, los metodos `addFile`/`removeFile` del repositorio y servicio, los eventos `card:fileAdd`/`card:fileRemove` y sus esquemas de entrada.
- Sin **Templates**: se elimino `utils/templates`, el endpoint `/api/templates`, la ruta `apply-template`, el metodo `applyTemplate` y el campo `templateId` en el DTO de creacion de tablero.
- Sin **Supabase**: se eliminaron la dependencia `@supabase/supabase-js`, `config/supabase.ts`, `supabaseStorageService`, el middleware `uploadToSupabase` y las variables de entorno asociadas. El almacenamiento es exclusivamente con **Cloudinary**.
- Sin Sprints, Reports, ProjectDocuments ni CardPB.

## Stack tecnologico

| Tecnologia | Uso |
|---|---|
| Node.js (>= 20) + TypeScript | Runtime y lenguaje |
| Express 5 | API REST |
| MongoDB + Mongoose | Persistencia (agregaciones para entidades completas) |
| Socket.io | Tiempo real (tableros, columnas y tarjetas) |
| Cloudinary | Almacenamiento de imagenes (usuarios y grupos) |
| JWT + bcrypt | Autenticacion y hash de contrasenas |
| Zod | Validacion de DTOs |
| Multer | Subida de archivos en memoria |

## Estructura del proyecto

```
src/
├── app.ts                      # Configuracion de Express (rutas, CORS, health check)
├── server.ts                   # Arranque: BD + HTTP + WebSockets
├── config/                     # env, database, cloudinary
├── dependencies/               # Inyeccion de dependencias (repositorios, servicios, controladores)
├── controllers/                # authController, boardController, groupController, userController
├── dtos/
│   ├── input/                  # Esquemas Zod de entrada (auth, board, card, column, group, user)
│   └── response/               # Tipos de respuesta (auth, board, card, column, group, user)
├── errors/                     # AppError, ValidationError, DatabaseError
├── mappers/                    # auth, board, card, column, group, user
├── middlewares/                # authMiddleware, errorMiddleware, uploadMiddleware (solo Cloudinary)
├── models/                     # Group, Board, Column, Card, User (Mongoose)
├── repository/                 group, board, column, card, user
├── routes/                     # auth, users, groups, boards
├── service/                    # authService, boardService, cardService, columnService, groupService, userService
│   └── storage/                # cloudinaryStorageService
├── sockets/                    # socket.ts, socketAuthMiddleware
│   └── handlers/               # boardSocket, columnSocket, cardSocket
└── utils/                      # EnvDto, express.d.ts, FileDto, idValidator, JwtPayload
```

## Funcionalidades

### Autenticacion (`/api/auth`)

| Metodo | Ruta | Descripcion |
|---|---|---|
| POST | `/api/auth/register` | Registro de usuario (foto de perfil opcional, subida a Cloudinary) |
| POST | `/api/auth/login` | Inicio de sesion, devuelve JWT |

### Usuarios (`/api/users`)

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/users/me` | Informacion del usuario autenticado |
| PUT | `/api/users/:id` | Actualizar perfil (nombre, email, documento, contrasena, foto) |
| DELETE | `/api/users/` | Eliminar cuenta |

### Grupos (`/api/groups`)

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/groups` | Grupos del usuario autenticado |
| GET | `/api/groups/:id` | Detalle de un grupo (miembros con populate) |
| POST | `/api/groups` | Crear grupo (imagen opcional) |
| PUT | `/api/groups/:id` | Actualizar grupo |
| DELETE | `/api/groups/:id` | Eliminar grupo (con borrado en cascada de tableros) |
| POST | `/api/groups/:groupId/members` | Agregar miembro (por email y rol) |
| PUT | `/api/groups/:id/members/:userId` | Cambiar rol de un miembro |
| DELETE | `/api/groups/:id/members/:userId` | Remover miembro |

### Tableros (`/api/boards`)

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/boards/group/:groupId` | Tableros de un grupo |
| POST | `/api/boards` | Crear tablero (genera columnas por defecto: Por hacer, En proceso, Hecho) |
| PUT | `/api/boards/:id` | Actualizar tablero |
| DELETE | `/api/boards/:id` | Eliminar tablero (con borrado en cascada de columnas y tarjetas) |

El detalle de un tablero (`BoardService.findBoardById`) se obtiene mediante agregaciones que traen columnas, tarjetas y usuarios asignados.

### WebSockets (Socket.io)

Autenticacion por token en `handshake.auth.token`. Sala por tablero: `board:<boardId>`.

| Evento | Direccion | Descripcion |
|---|---|---|
| `board:join` | cliente -> servidor | Unirse a la sala del tablero (devuelve el tablero completo) |
| `board:leave` | cliente -> servidor | Salir de la sala |
| `column:create` | cliente -> servidor | Crear columna (emite `column:created`) |
| `column:update` | cliente -> servidor | Actualizar columna (emite `column:updated`) |
| `column:delete` | cliente -> servidor | Eliminar columna (emite `column:deleted`) |
| `card:create` | cliente -> servidor | Crear tarjeta (emite `card:created`) |
| `card:update` | cliente -> servidor | Actualizar tarjeta (emite `card:updated`) |
| `card:delete` | cliente -> servidor | Eliminar tarjeta (emite `card:deleted`) |

## Variables de entorno

Copiar `.env.example` a `.env` y completar:

| Variable | Descripcion |
|---|---|
| `PORT` | Puerto del servidor (por defecto 3000) |
| `MONGODB_URI` | Cadena de conexion a MongoDB |
| `JWT_SECRET` | Secreto para firmar tokens JWT |
| `CORS_ORIGIN` | Origen permitido para CORS |
| `SERVER_URL` | URL publica del servidor (health check y self-ping) |
| `CLOUDINARY_CLOUD_NAME` | Nombre de cloud de Cloudinary |
| `CLOUDINARY_API_KEY` | API key de Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret de Cloudinary |

## Puesta en marcha

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Desarrollo (recarga automatica)
npm run dev

# Compilacion y produccion
npm run build
npm start

# Verificacion de tipos
npm run check
```
