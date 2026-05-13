-- =====================================================
-- PATITAS FELICES — Esquema de base de datos MySQL
-- Ejecuta este archivo UNA SOLA VEZ para crear las tablas
-- =====================================================

CREATE DATABASE IF NOT EXISTS patitas_felices
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE patitas_felices;

-- ─── ADOPTANTES ───────────────────────────────────
CREATE TABLE IF NOT EXISTS adoptantes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100)        NOT NULL,
  correo      VARCHAR(150)        NOT NULL UNIQUE,
  telefono    VARCHAR(20)         NOT NULL,
  contrasena  VARCHAR(255)        NOT NULL,   -- bcrypt hash
  activo      TINYINT(1)          DEFAULT 1,
  creado_en   DATETIME            DEFAULT CURRENT_TIMESTAMP
);

-- ─── TRABAJADORES ─────────────────────────────────
CREATE TABLE IF NOT EXISTS trabajadores (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  num_emp     VARCHAR(20)         NOT NULL UNIQUE,  -- EMP-001
  nombre      VARCHAR(100)        NOT NULL,
  rol         ENUM('admin','veterinario','voluntario') DEFAULT 'voluntario',
  contrasena  VARCHAR(255)        NOT NULL,
  activo      TINYINT(1)          DEFAULT 1,
  creado_en   DATETIME            DEFAULT CURRENT_TIMESTAMP
);

-- ─── ANIMALES ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS animales (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(80)         NOT NULL,
  especie     ENUM('perro','gato','ave','otro') DEFAULT 'otro',
  raza        VARCHAR(80),
  edad        VARCHAR(30),
  sexo        ENUM('macho','hembra','desconocido') DEFAULT 'desconocido',
  estado      ENUM('disponible','tratamiento','adoptado') DEFAULT 'disponible',
  descripcion TEXT,
  emoji       VARCHAR(10)         DEFAULT '🐾',
  ingreso_en  DATE                DEFAULT (CURRENT_DATE),
  creado_en   DATETIME            DEFAULT CURRENT_TIMESTAMP
);

-- ─── SOLICITUDES DE ADOPCIÓN ──────────────────────
CREATE TABLE IF NOT EXISTS solicitudes (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  adoptante_id  INT                 NOT NULL,
  animal_id     INT                 NOT NULL,
  motivo        TEXT,
  estado        ENUM('pendiente','aprobada','rechazada') DEFAULT 'pendiente',
  creado_en     DATETIME            DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (adoptante_id) REFERENCES adoptantes(id),
  FOREIGN KEY (animal_id)    REFERENCES animales(id)
);

-- ─── HISTORIAL MÉDICO ─────────────────────────────
CREATE TABLE IF NOT EXISTS historial_medico (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  animal_id     INT                 NOT NULL,
  tipo          ENUM('vacuna','desparasitacion','cirugia','revision','tratamiento') DEFAULT 'revision',
  descripcion   TEXT,
  veterinario   VARCHAR(100),
  fecha         DATE                DEFAULT (CURRENT_DATE),
  creado_en     DATETIME            DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (animal_id) REFERENCES animales(id)
);

-- ─── DATOS INICIALES ──────────────────────────────

-- Trabajadores de prueba (contraseñas hasheadas con bcrypt, costo 10)
-- EMP-001 → admin123      EMP-002 → patitas2025
INSERT IGNORE INTO trabajadores (num_emp, nombre, rol, contrasena) VALUES
  ('EMP-001', 'Admin Principal',   'admin',       '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVNKpFZkRK'),
  ('EMP-002', 'Dr. Vega Veterinario', 'veterinario', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWFpioK');

-- Animales iniciales
INSERT IGNORE INTO animales (nombre, especie, raza, edad, sexo, estado, emoji) VALUES
  ('Bruno',  'perro', 'Labrador',       '2 años', 'macho',  'disponible',  '🐶'),
  ('Luna',   'gato',  'Doméstico',      '1 año',  'hembra', 'disponible',  '🐱'),
  ('Max',    'perro', 'Pastor Alemán',  '4 años', 'macho',  'tratamiento', '🐕'),
  ('Pico',   'ave',   'Periquito',      '3 años', 'macho',  'disponible',  '🦜'),
  ('Mochi',  'gato',  'Siamés',         '2 años', 'hembra', 'adoptado',    '🐈'),
  ('Canela', 'perro', 'Mestizo',        '3 años', 'hembra', 'disponible',  '🐾');
