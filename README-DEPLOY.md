# Patitas Felices — Guía de despliegue en Railway

## ¿Qué necesitas?
- Cuenta gratuita en https://railway.app (puedes entrar con GitHub)
- Node.js instalado localmente para probar antes de subir
- Git instalado

---

## PASO 1 — Prueba local primero

```bash
# 1. Copia el archivo de variables
cp .env.example .env

# 2. Edita .env con tus datos de MySQL local
#    Si no tienes MySQL local, salta directo al Paso 2

# 3. Crea la base de datos
mysql -u root -p < schema.sql

# 4. Instala dependencias
npm install

# 5. Arranca el servidor
npm run dev
# → API corriendo en http://localhost:3000
```

---

## PASO 2 — Subir a Railway (hosting gratuito)

### 2a. Crear proyecto en Railway
1. Ve a https://railway.app y crea una cuenta
2. Click en **"New Project"**
3. Elige **"Deploy from GitHub repo"** (conecta tu cuenta de GitHub)
   - O elige **"Empty project"** si prefieres subir manualmente

### 2b. Agregar base de datos MySQL
1. Dentro de tu proyecto en Railway, click en **"+ Add Service"**
2. Busca **"MySQL"** y agrégalo
3. Railway crea la base de datos automáticamente
4. Click en el servicio MySQL → pestaña **"Variables"**
5. Copia estos valores (los necesitarás pronto):
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`

### 2c. Ejecutar el schema SQL
1. En el servicio MySQL de Railway, ve a la pestaña **"Query"**
2. Pega el contenido completo de `schema.sql` y ejecútalo
3. Verifica que las tablas se crearon correctamente

### 2d. Subir el backend
**Opción A — Con GitHub (recomendado):**
```bash
git init
git add .
git commit -m "Patitas Felices API v2"
git remote add origin https://github.com/TU_USUARIO/patitas-backend.git
git push -u origin main
```
Luego en Railway → Deploy from GitHub → selecciona el repo.

**Opción B — Con Railway CLI:**
```bash
npm install -g @railway/cli
railway login
railway up
```

### 2e. Configurar variables de entorno en Railway
En tu servicio Node.js → pestaña **"Variables"**, agrega:

| Variable     | Valor                          |
|-------------|--------------------------------|
| DB_HOST     | (valor de MYSQL_HOST)          |
| DB_PORT     | (valor de MYSQL_PORT)          |
| DB_USER     | (valor de MYSQL_USER)          |
| DB_PASSWORD | (valor de MYSQL_PASSWORD)      |
| DB_NAME     | (valor de MYSQL_DATABASE)      |
| PORT        | 3000                           |
| JWT_SECRET  | (cadena aleatoria larga)       |
| CORS_ORIGIN | *                              |

### 2f. Obtener la URL pública
1. En tu servicio Node.js → pestaña **"Settings"**
2. Sección **"Networking"** → click en **"Generate Domain"**
3. Railway te da una URL tipo: `https://patitas-xxxxx.up.railway.app`

---

## PASO 3 — Conectar el HTML a tu API

Abre `patitas-felices.html` y busca esta línea al inicio del script:

```javascript
let API = localStorage.getItem('pf_api_url') || 'http://localhost:3000';
```

**Opción A — Cambiarla directamente:**
```javascript
let API = localStorage.getItem('pf_api_url') || 'https://TU-URL.up.railway.app';
```

**Opción B — Desde el panel de admin (sin tocar código):**
1. Entra como trabajador (EMP-001 / admin123)
2. Ve a Admin → Configuración
3. En "URL del servidor" escribe tu URL de Railway
4. Click "Guardar URL" — se guarda en el navegador automáticamente

---

## Credenciales de prueba

| Tipo       | ID/Correo          | Contraseña    |
|-----------|-------------------|---------------|
| Trabajador | EMP-001           | admin123      |
| Trabajador | EMP-002           | patitas2025   |
| Adoptante  | (regístrate tú)   | (la que elijas) |

---

## Rutas de la API

| Método | Ruta                        | Descripción                    |
|--------|-----------------------------|--------------------------------|
| GET    | /                           | Health check                   |
| GET    | /stats                      | Estadísticas del dashboard     |
| GET    | /animales                   | Listar animales (filtros: especie, estado) |
| GET    | /animales/:id               | Un animal                      |
| POST   | /animales                   | Registrar animal               |
| PUT    | /animales/:id               | Editar animal                  |
| DELETE | /animales/:id               | Eliminar animal                |
| POST   | /adoptantes/registro        | Crear cuenta adoptante         |
| POST   | /adoptantes/login           | Login adoptante                |
| GET    | /adoptantes                 | Listar adoptantes (admin)      |
| POST   | /trabajadores/login         | Login trabajador               |
| GET    | /trabajadores               | Listar trabajadores            |
| GET    | /solicitudes                | Listar solicitudes             |
| POST   | /solicitudes                | Nueva solicitud de adopción    |
| PUT    | /solicitudes/:id            | Aprobar/rechazar solicitud     |
| GET    | /historial                  | Historial médico completo      |
| GET    | /historial/:animal_id       | Historial de un animal         |
| POST   | /historial                  | Nuevo registro médico          |

---

## Estructura de archivos

```
patitas-backend/
├── server.js          ← API principal (todas las rutas)
├── db.js              ← Conexión MySQL con pool
├── schema.sql         ← Crea tablas + datos iniciales
├── package.json
├── .env.example       ← Copia como .env para desarrollo local
├── .gitignore
└── README-DEPLOY.md   ← Esta guía
```
