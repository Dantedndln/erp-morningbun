// Consultas SQL del módulo de ventas
const db = require('../config/db');

// Trae el historial de ventas
// Se listan las columnas una por una en lugar de usar SELECT *
// para renombrar registrado_por y que llegue al front sin guion bajo
function obtenerVentas(callback) {
  const sql = `
    SELECT
      v.id,
      v.cliente_nombre AS cliente,
      u.rol AS registradoPor,
      v.fecha,
      v.total
    FROM ventas v
    LEFT JOIN usuarios u ON v.usuario_id = u.id
    ORDER BY v.fecha DESC
  `;
  db.query(sql, (error, resultados) => {
    if (error) { callback(error, null); return; }
    callback(null, resultados);
  });
}

module.exports = {
  obtenerVentas
};