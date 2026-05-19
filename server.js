/ server.js — API REST completa para Patitas Felices
require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const db       = require('./db');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares ───────────────────────────────────────────

app.use(express.json());

// Log simple de peticiones
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// ─── Helper respuestas ────────────────────────────────────
const ok  = (res, data, status = 200) => res.status(status).json({ ok: true,  data });
const err = (res, msg,  status = 400) => res.status(status).json({ ok: false, error: msg });

// ═══════════════════════════════════════════════════════════
//  HEALTH CHECK
// ═══════════════════════════════════════════════════════════
app.get('/', (_req, res) => {
  res.json({ status: 'Patitas Felices API corriendo 🐾', version: '2.0' });
});

// ═══════════════════════════════════════════════════════════
//  ANIMALES
// ═══════════════════════════════════════════════════════════

// GET /animales — todos los animales (con filtros opcionales)
app.get('/animales', async (req, res) => {
  try {
    const { especie, estado } = req.query;
    let sql    = 'SELECT * FROM animales WHERE 1=1';
    const vals = [];

    if (especie) { sql += ' AND especie = ?';  vals.push(especie); }
    if (estado)  { sql += ' AND estado = ?';   vals.push(estado);  }

    sql += ' ORDER BY creado_en DESC';

    const [rows] = await db.query(sql, vals);
    ok(res, rows);
  } catch (e) {
    err(res, e.message, 500);
  }
});

// GET /animales/:id
app.get('/animales/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM animales WHERE id = ?', [req.params.id]);
    if (!rows.length) return err(res, 'Animal no encontrado', 404);
    ok(res, rows[0]);
  } catch (e) {
    err(res, e.message, 500);
  }
});

// POST /animales — registrar animal
app.post('/animales', async (req, res) => {
  try {
    const { nombre, especie, raza, edad, sexo, estado, descripcion, emoji } = req.body;
    if (!nombre) return err(res, 'El nombre es obligatorio');

    const [result] = await db.query(
      `INSERT INTO animales (nombre, especie, raza, edad, sexo, estado, descripcion, emoji)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, especie||'otro', raza||null, edad||null, sexo||'desconocido',
       estado||'disponible', descripcion||null, emoji||'🐾']
    );
    const [rows] = await db.query('SELECT * FROM animales WHERE id = ?', [result.insertId]);
    ok(res, rows[0], 201);
  } catch (e) {
    err(res, e.message, 500);
  }
});

// PUT /animales/:id — editar animal
app.put('/animales/:id', async (req, res) => {
  try {
    const { nombre, especie, raza, edad, sexo, estado, descripcion, emoji } = req.body;
    await db.query(
      `UPDATE animales SET nombre=?, especie=?, raza=?, edad=?, sexo=?,
       estado=?, descripcion=?, emoji=? WHERE id=?`,
      [nombre, especie, raza, edad, sexo, estado, descripcion, emoji, req.params.id]
    );
    const [rows] = await db.query('SELECT * FROM animales WHERE id = ?', [req.params.id]);
    ok(res, rows[0]);
  } catch (e) {
    err(res, e.message, 500);
  }
});

// DELETE /animales/:id
app.delete('/animales/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM animales WHERE id = ?', [req.params.id]);
    ok(res, { mensaje: 'Animal eliminado' });
  } catch (e) {
    err(res, e.message, 500);
  }
});

// ═══════════════════════════════════════════════════════════
//  ADOPTANTES — Registro y Login
// ═══════════════════════════════════════════════════════════

// POST /adoptantes/registro
app.post('/adoptantes/registro', async (req, res) => {
  try {
    const { nombre, correo, telefono, contrasena } = req.body;
    if (!nombre || !correo || !telefono || !contrasena)
      return err(res, 'Todos los campos son obligatorios');
    if (contrasena.length < 6)
      return err(res, 'La contraseña debe tener al menos 6 caracteres');

    // Verificar correo único
    const [dup] = await db.query('SELECT id FROM adoptantes WHERE correo = ?', [correo]);
    if (dup.length) return err(res, 'Ya existe una cuenta con ese correo', 409);

    const hash = await bcrypt.hash(contrasena, 10);
    const [result] = await db.query(
      'INSERT INTO adoptantes (nombre, correo, telefono, contrasena) VALUES (?, ?, ?, ?)',
      [nombre, correo, telefono, hash]
    );
    ok(res, {
      id: result.insertId,
      nombre,
      correo,
      telefono,
      mensaje: '¡Cuenta creada correctamente!'
    }, 201);
  } catch (e) {
    err(res, e.message, 500);
  }
});

// POST /adoptantes/login
app.post('/adoptantes/login', async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) return err(res, 'Correo y contraseña requeridos');

    const [rows] = await db.query(
      'SELECT * FROM adoptantes WHERE correo = ? AND activo = 1', [correo]
    );
    if (!rows.length) return err(res, 'Credenciales incorrectas', 401);

    const coincide = await bcrypt.compare(contrasena, rows[0].contrasena);
    if (!coincide) return err(res, 'Credenciales incorrectas', 401);

    const { contrasena: _, ...usuario } = rows[0]; // quitar hash de la respuesta
    ok(res, { ...usuario, mensaje: '¡Bienvenido!' });
  } catch (e) {
    err(res, e.message, 500);
  }
});

// GET /adoptantes — listar todos (solo para trabajadores)
app.get('/adoptantes', async (_req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nombre, correo, telefono, activo, creado_en FROM adoptantes ORDER BY creado_en DESC'
    );
    ok(res, rows);
  } catch (e) {
    err(res, e.message, 500);
  }
});

// ═══════════════════════════════════════════════════════════
//  TRABAJADORES — Login
// ═══════════════════════════════════════════════════════════

// POST /trabajadores/login
app.post('/trabajadores/login', async (req, res) => {
  try {
    const { num_emp, contrasena } = req.body;
    if (!num_emp || !contrasena) return err(res, 'ID y contraseña requeridos');

    const [rows] = await db.query(
      'SELECT * FROM trabajadores WHERE num_emp = ? AND activo = 1', [num_emp]
    );
    if (!rows.length) return err(res, 'Credenciales incorrectas', 401);

    const coincide = await bcrypt.compare(contrasena, rows[0].contrasena);
    if (!coincide) return err(res, 'Credenciales incorrectas', 401);

    const { contrasena: _, ...trabajador } = rows[0];
    ok(res, { ...trabajador, mensaje: '¡Bienvenido al sistema!' });
  } catch (e) {
    err(res, e.message, 500);
  }
});

// GET /trabajadores — listar trabajadores
app.get('/trabajadores', async (_req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, num_emp, nombre, rol, activo, creado_en FROM trabajadores ORDER BY id'
    );
    ok(res, rows);
  } catch (e) {
    err(res, e.message, 500);
  }
});

// ═══════════════════════════════════════════════════════════
//  SOLICITUDES DE ADOPCIÓN
// ═══════════════════════════════════════════════════════════

// GET /solicitudes — todas las solicitudes con datos de adoptante y animal
app.get('/solicitudes', async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.id, s.estado, s.motivo, s.creado_en,
             a.id AS adoptante_id, a.nombre AS adoptante_nombre,
             a.correo AS adoptante_correo, a.telefono AS adoptante_telefono,
             an.id AS animal_id, an.nombre AS animal_nombre,
             an.especie, an.emoji
      FROM solicitudes s
      JOIN adoptantes a  ON s.adoptante_id = a.id
      JOIN animales   an ON s.animal_id    = an.id
      ORDER BY s.creado_en DESC
    `);
    ok(res, rows);
  } catch (e) {
    err(res, e.message, 500);
  }
});

// POST /solicitudes — crear solicitud
app.post('/solicitudes', async (req, res) => {
  try {
    const { adoptante_id, animal_id, motivo } = req.body;
    if (!adoptante_id || !animal_id) return err(res, 'adoptante_id y animal_id son obligatorios');

    // Verificar que el animal esté disponible
    const [animal] = await db.query('SELECT estado FROM animales WHERE id = ?', [animal_id]);
    if (!animal.length) return err(res, 'Animal no encontrado', 404);
    if (animal[0].estado !== 'disponible') return err(res, 'El animal no está disponible', 409);

    const [result] = await db.query(
      'INSERT INTO solicitudes (adoptante_id, animal_id, motivo) VALUES (?, ?, ?)',
      [adoptante_id, animal_id, motivo || null]
    );
    ok(res, { id: result.insertId, mensaje: '¡Solicitud enviada correctamente!' }, 201);
  } catch (e) {
    err(res, e.message, 500);
  }
});

// PUT /solicitudes/:id — cambiar estado (aprobar / rechazar)
app.put('/solicitudes/:id', async (req, res) => {
  try {
    const { estado } = req.body;
    if (!['pendiente','aprobada','rechazada'].includes(estado))
      return err(res, 'Estado inválido');

    await db.query('UPDATE solicitudes SET estado = ? WHERE id = ?', [estado, req.params.id]);

    // Si se aprueba, marcar animal como adoptado
    if (estado === 'aprobada') {
      const [sol] = await db.query('SELECT animal_id FROM solicitudes WHERE id = ?', [req.params.id]);
      if (sol.length) {
        await db.query("UPDATE animales SET estado = 'adoptado' WHERE id = ?", [sol[0].animal_id]);
      }
    }
    ok(res, { mensaje: `Solicitud ${estado}` });
  } catch (e) {
    err(res, e.message, 500);
  }
});

// ═══════════════════════════════════════════════════════════
//  HISTORIAL MÉDICO
// ═══════════════════════════════════════════════════════════

// GET /historial — todos los registros
app.get('/historial', async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT h.*, a.nombre AS animal_nombre, a.emoji
      FROM historial_medico h
      JOIN animales a ON h.animal_id = a.id
      ORDER BY h.fecha DESC
    `);
    ok(res, rows);
  } catch (e) {
    err(res, e.message, 500);
  }
});

// GET /historial/:animal_id — historial de un animal específico
app.get('/historial/:animal_id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM historial_medico WHERE animal_id = ? ORDER BY fecha DESC',
      [req.params.animal_id]
    );
    ok(res, rows);
  } catch (e) {
    err(res, e.message, 500);
  }
});

// POST /historial — nuevo registro médico
app.post('/historial', async (req, res) => {
  try {
    const { animal_id, tipo, descripcion, veterinario, fecha } = req.body;
    if (!animal_id) return err(res, 'animal_id es obligatorio');

    const [result] = await db.query(
      `INSERT INTO historial_medico (animal_id, tipo, descripcion, veterinario, fecha)
       VALUES (?, ?, ?, ?, ?)`,
      [animal_id, tipo||'revision', descripcion||null, veterinario||null, fecha||null]
    );
    ok(res, { id: result.insertId, mensaje: 'Registro médico guardado' }, 201);
  } catch (e) {
    err(res, e.message, 500);
  }
});

// ═══════════════════════════════════════════════════════════
//  ESTADÍSTICAS — dashboard
// ═══════════════════════════════════════════════════════════
app.get('/stats', async (_req, res) => {
  try {
    const [[{ total_animales }]]    = await db.query('SELECT COUNT(*) AS total_animales FROM animales');
    const [[{ disponibles }]]       = await db.query("SELECT COUNT(*) AS disponibles FROM animales WHERE estado='disponible'");
    const [[{ en_tratamiento }]]    = await db.query("SELECT COUNT(*) AS en_tratamiento FROM animales WHERE estado='tratamiento'");
    const [[{ adoptados }]]         = await db.query("SELECT COUNT(*) AS adoptados FROM animales WHERE estado='adoptado'");
    const [[{ total_adoptantes }]]  = await db.query('SELECT COUNT(*) AS total_adoptantes FROM adoptantes WHERE activo=1');
    const [[{ solicitudes_pend }]]  = await db.query("SELECT COUNT(*) AS solicitudes_pend FROM solicitudes WHERE estado='pendiente'");
    const [[{ solicitudes_total }]] = await db.query('SELECT COUNT(*) AS solicitudes_total FROM solicitudes');

    ok(res, {
      animales: { total: total_animales, disponibles, en_tratamiento, adoptados },
      adoptantes: total_adoptantes,
      solicitudes: { pendientes: solicitudes_pend, total: solicitudes_total }
    });
  } catch (e) {
    err(res, e.message, 500);
  }
});

// ─── 404 catch-all ────────────────────────────────────────
app.use((req, res) => {
  err(res, `Ruta ${req.method} ${req.path} no encontrada`, 404);
});

// ─── Arrancar servidor ────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🐾 Patitas Felices API corriendo en http://localhost:${PORT}`);
});
