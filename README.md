# 🐾 Patitas Felices


Un centro de adopción de animales necesita llevar un control organizado de:

•	Los animales que tiene disponibles.

•	Las personas interesadas en adoptar.

•	Las adopciones realizadas.

•	El personal o voluntarios que atienden el centro.



Actualmente, la información se maneja en hojas de papel y archivos sueltos, lo que provoca:

•	Pérdida de información.

•	Dificultad para saber qué animales están disponibles.

•	Falta de historial de adopciones.



Por ello, se requiere un sistema de base de datos que centralice y organice toda la información.


<img width="1363" height="906" alt="Screenshot_2026-06-03-17-11-30-72_c0d35d5c8ea536686f7fb1c9f2f8f274" src="https://github.com/user-attachments/assets/498c0983-88c6-465b-9dc0-8ccbf62b7cec" />
Requerimientos del Sistema

•	El sistema debe guardar el nombre, especie, raza, edad, sexo y estado de cada animal.

•	El sistema debe registrar si un animal está disponible, en tratamiento o ya fue adoptado.
•	El sistema debe almacenar los datos de los adoptantes: nombre, teléfono, correo y dirección.

•	El sistema debe registrar cada adopción indicando qué animal fue adoptado, por quién y en qué fecha.

•	El sistema debe permitir al personal gestionar y consultar las adopciones.

•	El sistema debe registrar la información del personal y voluntarios del centro (nombre, cargo, teléfono).

<img width="979" height="511" alt="Screenshot_2026-06-03-17-11-21-94_40deb401b9ffe8e1df2f1cc5ba480b12" src="https://github.com/user-attachments/assets/ae0dd55d-7cf8-4f57-8a6b-0217524fd41d" />
Entidades y sus atributos:
•	ANIMAL: Representa a cada animal registrado en el centro. Sus atributos son: id_animal (clave primaria), nombre, especie, raza, edad, sexo y estado (disponible, en tratamiento o adoptado).

•	ADOPTANTE: Representa a las personas interesadas en adoptar. Sus atributos son: id_adoptante (clave primaria), nombre, teléfono, correo y dirección.

•	ADOPCIÓN: Entidad que registra el evento de adopción. Su atributo es: fecha_adopcion. Actúa como entidad intermediaria entre ANIMAL y ADOPTANTE. 

•	PERSONAL: Representa al personal y voluntarios del centro. Sus atributos son: id_personal (clave primaria), nombre, cargo y teléfono.

Relaciones y cardinalidad:

•	registra animal (ANIMAL – ADOPCIÓN): Cardinalidad 1:1 (con participación (1,1) en ANIMAL y (0,1) en ADOPCIÓN). Un animal solo puede estar vinculado a una única adopción, y cada adopción corresponde exactamente a un animal. La participación (0,1) en ADOPCIÓN indica que no todos los animales han sido adoptados aún.

•	realiza adopción (ADOPTANTE – ADOPCIÓN): Cardinalidad 1:N (con participación (0,N) en ADOPTANTE y (1,1) en ADOPCIÓN). Un adoptante puede realizar múltiples adopciones a lo largo del tiempo, pero cada registro de adopción pertenece a exactamente un adoptante.

•	gestiona adopción (PERSONAL – ADOPCIÓN): Cardinalidad 1:N (con participación (0,N) en PERSONAL y (1,1) en ADOPCIÓN). Un miembro del personal puede gestionar varias adopciones, pero cada adopción es gestionada por exactamente un responsable.



<img width="1483" height="917" alt="Screenshot_2026-06-03-17-24-22-45_c0d35d5c8ea536686f7fb1c9f2f8f274" src="https://github.com/user-attachments/assets/f35ded3b-9036-4182-bcf7-a17f78f91422" />
Restricciones de cardinalidad:

•	Un animal debe tener registrado exactamente 1 estado de salud en todo momento, pero puede tener entre 0 y N registros en su historial médico.
•	Un adoptante puede realizar entre 0 y 3 adopciones como máximo (política del centro para garantizar bienestar animal).

•	Cada adopción debe ser gestionada por exactamente 1 miembro del personal, y un miembro del personal puede gestionar entre 0 y N adopciones.

Entidades débiles identificadas:

•	HISTORIAL_MEDICO: Cada registro del historial médico de un animal depende completamente de la existencia del animal. Si el animal es eliminado del sistema, su historial deja de tener sentido. Además, el historial se identifica mediante el id_animal más un número de registro secuencial.

•	CONTACTO_EMERGENCIA: Cada adoptante puede registrar contactos de emergencia, pero estos no tienen existencia propia sin el adoptante al que pertenecen.

Jerarquía de herencia — PERSONAL:

•	El supertipo PERSONAL se especializa en dos subtipos: VOLUNTARIO y EMPLEADO. Ambos comparten atributos comunes como id_personal, nombre, cargo y teléfono, pero cada uno tiene atributos propios que no aplican al otro.

•	Esta especialización es disjunta (un miembro del personal no puede ser simultáneamente voluntario y empleado) y total (todo registro en PERSONAL debe pertenecer a uno de los dos subtipos).

Atributos multivaluados y compuestos:

•	El atributo vacunas de ANIMAL es multivaluado, ya que un animal puede tener varias vacunas registradas.

•	El atributo direccion de ADOPTANTE es compuesto, formado por: calle, colonia, ciudad y código postal.


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

 
 
SQL INJECTION
 
Una SQL injection es un tipo de ataque de seguridad donde un atacante inserta código SQL malicioso en una consulta que una aplicación envía a su base de datos.

¿Qué puede hacer un atacante?

Saltarse autenticación 

Leer datos confidenciales (contraseñas, emails, tarjetas)
Modificar o eliaros en el servidor

1.  Boolean-Based (A ciegas por "Sí o No")
- El atacante envía un dato real combinado con una condición verdadera: Manda en el JSON un payload como "EMP-001' AND 1=1 --". La página le responde con un mensaje positivo: {"existe": true}.
- El atacante envía el mismo dato con una condición falsa: Manda en el JSON "EMP-001' AND 1=2 --". La página ahora le responde con un mensaje negativo: {"existe": false}. (Aquí el atacante confirma que la página reacciona a sus condiciones lógicas).
-El atacante empieza a adivinar la información carácter por carácter: Cambia la condición matemática por una función de texto para interrogar a la base de datos: "EMP-001' AND SUBSTRING(contrasena, 1, 1) = 'a' --".
-El atacante lee la respuesta de la pantalla: Si la página dice false, ya sabe que no empieza con 'a'. Si dice true, descubrió la primera letra.
- El atacante automatiza el proceso: Usa un script para repetir el paso 3 y 4 cambiando de letra y de posición (letra 2, letra 3, etc.) hasta reconstruir el dato completo.

2. Out-of-Band (El canal secreto por fuera)
+ El atacante enciende su propio servidor receptor: Configura una máquina en internet bajo su control para registrar cualquier intento de conexión externa.
+;El atacante envía un comando de red camuflado: En el JSON de Postman, en lugar de buscar un ID normal, manda un payload que cierra la consulta e invoca una función de red de PostgreSQL (como COPY FROM PROGRAM).
+El atacante inyecta el dato robado en la URL de destino: Dentro del mismo payload, hace que la base de datos meta el dato que quiere robar dentro del nombre de un dominio (ejemplo: [contraseña_robada].servidor-del-atacante.com).
La base de datos muerde el anzuelo y hace la petición: PostgreSQL procesa el comando e intenta conectar a internet para resolver ese dominio, enviando el dato sin querer.
+ El atacante recoge la información en su servidor: El atacante ignora por completo la respuesta de Postman (que probablemente dé un mensaje genérico o vacío) y simplemente lee los logs de su propia máquina en internet, donde quedó grabada la conexión con los datos robados


3. Stacked Queries (Consultas Apiladas)
- El atacante localiza el endpoint vulnerable: Abre Postman y selecciona la ruta que sabe que concatena texto en el backend.
- El atacante usa el punto y coma (;) para romper la consulta: En el campo del JSON, escribe un dato cualquiera, cierra la comilla e inserta un punto y coma para avisarle a la base de datos que ahí termina la primera instrucción.
-El atacante escribe una segunda orden destructiva o maliciosa: Inmediatamente después del punto y coma, escribe un comando SQL completo e independiente, como DROP TABLE trabajadores;.
-El atacante anula el resto del código original: Añade los guiones -- al final de su payload para que cualquier comilla o paréntesis que el desarrollador haya puesto en el código original se convierta en un simple comentario y no rompa la ejecución.
La base de datos ejecuta el "Dos por Uno": Al dar clic en Send en Postman, el motor SQL recibe la cadena, ejecuta la primera consulta (ej. buscar el historial) y acto seguido ejecuta la segunda consulta, borrando la tabla por completo.


## 🌐 Demo

- **API en vivo (Railway):** [https://patitas-backend-production.up.railway.app/](https://patitas-backend-production.up.railway.app/)
- **Frontend (GitHub Pages):** [https://jokerkorio.github.io/patitas-api/#](https://jokerkorio.github.io/patitas-api/#)

-Este proyecto forma parte de un repositorio general de proyectos escolares, para visualizarlo visita el siguiente link: 
https://github.com/gabrielhuav/DB-Coursework-2026-2
