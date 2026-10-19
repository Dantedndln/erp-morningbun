// Aquí van las consultas SQL relacionadas con productos
const conexion = require('../config/db');
// Trae todos los productos registrados
function obtenerProductos(callback) {
  const sql = 'SELECT * FROM productos WHERE vigente = 1';
  conexion.query(sql, (error, resultados) => {
    if (error) { callback(error, null); return; }
    callback(null, resultados);
  });
}

module.exports = { obtenerProductos };