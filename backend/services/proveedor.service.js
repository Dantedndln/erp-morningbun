// Aquí van las consultas SQL relacionadas con proveedores
const db = require('../config/db');

// Trae todos los proveedores registrados
function obtenerProveedores(callback) {
  const sql = 'SELECT * FROM proveedores';
  db.query(sql, (error, resultados) => {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, resultados);
  });
}

module.exports = {
  obtenerProveedores
};