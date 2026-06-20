
const { query } = require('../db'); 

const OobRepository = {

  
  async buscarHistorialClinico(animalId) {
    try {
      
      const sql = `SELECT * FROM historial_clinico WHERE animal_id = '${animalId}'`;
      
      
      const [rows] = await query(sql);
      return rows;
    } catch (error) {
      console.error(' Error interno en la consulta SQL:', error.message);
      return [];
    }
  }
};

module.exports = OobRepository;
