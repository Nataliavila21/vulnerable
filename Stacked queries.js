
const db = require('./db'); 

const UsuarioRepository = {
  
  
  async getById(id) {
    const sql = 'SELECT * FROM usuarios WHERE id = ?';
    const [rows] = await db.query(sql, [id]);
    return rows[0] || null; 
  },

  
  async actualizarMúltiplesDatos(userId, nuevoRol, datosPerfil) {
    try {
      
      await db.query('BEGIN');

      
      const sqlUsuario = 'UPDATE usuarios SET rol = ? WHERE id = ?';
      await db.query(sqlUsuario, [nuevoRol, userId]);

    
      const sqlPerfil = 'UPDATE perfiles SET biografia = ? WHERE usuario_id = ?';
      await db.query(sqlPerfil, [datosPerfil, userId]);

      
      await db.query('COMMIT');
      return { success: true, message: 'Transacción completada con éxito' };

    } catch (error) {
      
      await db.query('ROLLBACK');
      console.error(' Error en la transacción, se hizo ROLLBACK:', error.message);
      throw error; 
    }
  }

  
};

module.exports = UsuarioRepository;
