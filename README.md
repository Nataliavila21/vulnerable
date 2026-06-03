# 🐾 Patitas Felices
<img width="1363" height="906" alt="Screenshot_2026-06-03-17-11-30-72_c0d35d5c8ea536686f7fb1c9f2f8f274" src="https://github.com/user-attachments/assets/498c0983-88c6-465b-9dc0-8ccbf62b7cec" />
<img width="979" height="511" alt="Screenshot_2026-06-03-17-11-21-94_40deb401b9ffe8e1df2f1cc5ba480b12" src="https://github.com/user-attachments/assets/ae0dd55d-7cf8-4f57-8a6b-0217524fd41d" />
<img width="1483" height="917" alt="Screenshot_2026-06-03-17-24-22-45_c0d35d5c8ea536686f7fb1c9f2f8f274" src="https://github.com/user-attachments/assets/f35ded3b-9036-4182-bcf7-a17f78f91422" />
<img width="987" height="1199" alt="Screenshot_2026-06-03-17-11-51-21_40deb401b9ffe8e1df2f1cc5ba480b12" src="https://github.com/user-attachments/assets/78c79f36-71af-42db-a716-e3db6dc85e68" />

Plataforma web para la gestión integral de un refugio de animales, donde los adoptantes pueden explorar mascotas disponibles y enviar solicitudes de adopción, mientras el personal administra animales, historial médico y solicitudes desde un panel dedicado.

## 🛠️ Tecnologías

- **Backend:** Node.js + Express.js
- **Base de Datos:** PostgreSQL (Supabase)
- **Frontend:** HTML, CSS (Bootstrap 5) y JavaScript vanilla (Fetch API)
- **Autenticación:** bcryptjs para hash de contraseñas
- **Despliegue:** Railway (backend) y GitHub Pages (frontend)

## ✨ Funcionalidades

- Catálogo de animales con filtros por especie y estado
- Registro e inicio de sesión de adoptantes y trabajadores
- Roles de personal: admin, veterinario y voluntario
- Sistema de solicitudes de adopción (envío, aprobación y rechazo)
- Historial médico por animal
- Subida de fotos en Base64
- Panel de estadísticas en tiempo real
- Validaciones con expresiones regulares
- API REST completa con manejo de errores

## 🚀 Arranque local

Sigue estos pasos para correr el proyecto en tu máquina:

**1. Instala las dependencias:**
```bash
npm install
```

**2. Crea el archivo de variables de entorno:**

Crea un archivo llamado `.env` en la raíz del proyecto con el siguiente contenido:

```
DATABASE_URL=tu_cadena_de_conexion_de_supabase
PORT=3000
```

> Puedes obtener tu `DATABASE_URL` desde el panel de Supabase en **Project Settings → Database → Connection string → URI**.

**3. Inicia el servidor:**
```bash
node server.js
```

**4. Verifica que funciona:**

Abre tu navegador en `http://localhost:3000` y deberías ver:

```json
{ "status": "Patitas Felices API corriendo 🐾", "version": "2.0" }
```

## 🔗 Rutas principales

### Animales
- `GET /animales` — lista todos los animales (filtros: especie, estado)
- `GET /animales/:id` — detalle de un animal
- `POST /animales` — registrar animal (con foto)
- `PUT /animales/:id` — editar animal
- `PATCH /animales/:id/estado` — cambiar estado rápidamente
- `DELETE /animales/:id` — eliminar animal

### Adoptantes
- `POST /adoptantes/registro` — registrar adoptante
- `POST /adoptantes/login` — iniciar sesión
- `GET /adoptantes` — listar adoptantes

### Trabajadores
- `POST /trabajadores` — registrar personal
- `POST /trabajadores/login` — iniciar sesión
- `GET /trabajadores` — listar personal

### Solicitudes
- `GET /solicitudes` — listar todas las solicitudes
- `POST /solicitudes` — enviar solicitud de adopción
- `PUT /solicitudes/:id` — aprobar o rechazar solicitud

### Historial Médico
- `GET /historial` — todos los registros médicos
- `GET /historial/:animal_id` — historial de un animal
- `POST /historial` — nuevo registro médico

### Estadísticas
- `GET /stats` — dashboard con conteos generales

## 🌐 Demo

- **API en vivo (Railway):** [https://patitas-backend-production.up.railway.app/](https://patitas-backend-production.up.railway.app/)
- **Frontend (GitHub Pages):** [https://jokerkorio.github.io/patitas-api/#](https://jokerkorio.github.io/patitas-api/#)
Este proyecto forma parte de un repositorio general de proyectos escolares, para visualizarlo visita el siguiente link: 
https://github.com/gabrielhuav/DB-Coursework-2026-2
