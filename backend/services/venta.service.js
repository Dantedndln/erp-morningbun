// Consultas SQL del módulo de ventas
const db = require('../config/db');

// Trae el historial de ventas
// Se listan las columnas una por una en lugar de usar SELECT *
// para renombrar registrado_por y que llegue al front sin guion bajo
function obtenerVentas(callback) {
  const sql = `
    SELECT
      id,
      cliente,
      registrado_por AS registradoPor,
      fecha,
      total
    FROM ventas
    ORDER BY fecha DESC
  `;
  db.query(sql, (error, resultados) => {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, resultados);
  });
}

module.exports = {
  obtenerVentas
};