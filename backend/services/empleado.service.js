// Aquí van las consultas SQL relacionadas con recursos humanos
const db = require('../config/db');

// Trae todos los empleados registrados
function obtenerEmpleados(callback) {
  const sql = 'SELECT * FROM empleados';
  db.query(sql, (error, resultados) => {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, resultados);
  });
}

// Trae el historial de pagos, también con el nombre y puesto del empleado
function obtenerPagos(callback) {
  const sql = `
    SELECT
      p.id,
      e.nombre,
      e.puesto,
      p.fecha,
      p.dias_laborados,
      p.monto
    FROM pagos p
    LEFT JOIN empleados e ON p.empleado_id = e.id
    ORDER BY p.fecha DESC
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
  obtenerEmpleados,
  obtenerPagos
};