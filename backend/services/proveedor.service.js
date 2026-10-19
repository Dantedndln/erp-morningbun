// Aquí van las consultas SQL relacionadas con proveedores
const db = require('../config/db');

// Trae todos los proveedores registrados solo si están vigentes
function obtenerProveedores(callback) {
  const sql = 'SELECT * FROM proveedores WHERE vigente = 1';
  db.query(sql, (error, resultados) => {
    if (error) { callback(error, null); return; }
    callback(null, resultados);
  });
}

module.exports = {
  obtenerProveedores
};
