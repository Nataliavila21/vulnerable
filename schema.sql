-- =====================================================
-- PATITAS FELICES — Esquema de base de datos PostgreSQL (Supabase)
-- Ejecuta este archivo UNA SOLA VEZ en el SQL Editor de Supabase
-- =====================================================

-- ─── ADOPTANTES ───────────────────────────────────
CREATE TABLE IF NOT EXISTS adoptantes (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100)        NOT NULL,
  correo      VARCHAR(150)        NOT NULL UNIQUE,
  telefono    VARCHAR(20)         NOT NULL,
  contrasena  VARCHAR(255)        NOT NULL,   -- bcrypt hash
  activo      BOOLEAN             DEFAULT TRUE,
  creado_en   TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

-- ─── TRABAJADORES ─────────────────────────────────
CREATE TABLE IF NOT EXISTS trabajadores (
  id          SERIAL PRIMARY KEY,
  num_emp     VARCHAR(20)         NOT NULL UNIQUE,  -- EMP-001
  nombre      VARCHAR(100)        NOT NULL,
  rol         VARCHAR(20)         CHECK (rol IN ('admin','veterinario','voluntario')) DEFAULT 'voluntario',
  contrasena  VARCHAR(255)        NOT NULL,
  activo      BOOLEAN             DEFAULT TRUE,
  creado_en   TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

-- ─── ANIMALES ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS animales (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(80)         NOT NULL,
  especie     VARCHAR(20)         CHECK (especie IN ('perro','gato','ave','otro')) DEFAULT 'otro',
  raza        VARCHAR(80),
  edad        VARCHAR(30),
  sexo        VARCHAR(20)         CHECK (sexo IN ('macho','hembra','desconocido')) DEFAULT 'desconocido',
  estado      VARCHAR(20)         CHECK (estado IN ('disponible','tratamiento','adoptado')) DEFAULT 'disponible',
  descripcion TEXT,
  emoji       VARCHAR(10)         DEFAULT '🐾',
  ingreso_en  DATE                DEFAULT CURRENT_DATE,
  creado_en   TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

-- ─── SOLICITUDES DE ADOPCIÓN ──────────────────────
CREATE TABLE IF NOT EXISTS solicitudes (
  id            SERIAL PRIMARY KEY,
  adoptante_id  INT                 NOT NULL,
  animal_id     INT                 NOT NULL,
  motivo        TEXT,
  estado        VARCHAR(20)         CHECK (estado IN ('pendiente','aprobada','rechazada')) DEFAULT 'pendiente',
  creado_en     TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (adoptante_id) REFERENCES adoptantes(id),
  FOREIGN KEY (animal_id)    REFERENCES animales(id)
);

-- ─── HISTORIAL MÉDICO ─────────────────────────────
CREATE TABLE IF NOT EXISTS historial_medico (
  id            SERIAL PRIMARY KEY,
  animal_id     INT                 NOT NULL,
  tipo          VARCHAR(50)         CHECK (tipo IN ('vacuna','desparasitacion','cirugia','revision','tratamiento')) DEFAULT 'revision',
  descripcion   TEXT,
  veterinario   VARCHAR(100),
  fecha         DATE                DEFAULT CURRENT_DATE,
  creado_en     TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (animal_id) REFERENCES animales(id)
);

-- ─── DATOS INICIALES ──────────────────────────────

-- Trabajadores de prueba (contraseñas hasheadas con bcrypt, costo 10)
-- EMP-001 → admin123      EMP-002 → patitas2025
-- Usamos ON CONFLICT DO NOTHING para simular el INSERT IGNORE de MySQL
INSERT INTO trabajadores (num_emp, nombre, rol, contrasena) VALUES
  ('EMP-001', 'Admin Principal',   'admin',       '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVNKpFZkRK'),
  ('EMP-002', 'Dr. Vega Veterinario', 'veterinario', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWFpioK')
ON CONFLICT (num_emp) DO NOTHING;

-- Animales iniciales
INSERT INTO animales (nombre, especie, raza, edad, sexo, estado, emoji) VALUES
  ('Bruno',  'perro', 'Labrador',       '2 años', 'macho',  'disponible',  '🐶'),
  ('Luna',   'gato',  'Doméstico',      '1 año',  'hembra', 'disponible',  '🐱'),
  ('Max',    'perro', 'Pastor Alemán',  '4 años', 'macho',  'tratamiento', '🐕'),
  ('Pico',   'ave',   'Periquito',      '3 años', 'macho',  'disponible',  '🦜'),
  ('Mochi',  'gato',  'Siamés',         '2 años', 'hembra', 'adoptado',    '🐈'),
  ('Canela', 'perro', 'Mestizo',        '3 años', 'hembra', 'disponible',  '🐾');
