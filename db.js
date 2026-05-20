// db.js — Pool de conexiones PostgreSQL (Supabase)
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Súper importante para conectarse a Supabase de forma segura
  }
});

// Adaptador para que funcione igual que mysql2 en tu server.js
const query = async (text, params) => {
  // pg usa $1, $2 en lugar de ? para los parámetros, así que los reemplazamos al vuelo
  let pgText = text;
  if (params && params.length > 0) {
    let i = 1;
    pgText = text.replace(/\?/g, () => `$${i++}`);
  }
  
  const res = await pool.query(pgText, params);
  return [res.rows, res.fields]; // Devolvemos el mismo formato que esperaba mysql2
};

pool.connect()
  .then(client => {
    console.log('✅ PostgreSQL (Supabase) conectado correctamente');
    client.release();
  })
  .catch(err => {
    console.error('❌ Error conectando a Supabase:', err.message);
  });

module.exports = { query };
