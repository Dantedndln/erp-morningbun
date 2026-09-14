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

// Trae la asistencia junto con el nombre y puesto del empleado.
// El JOIN sirve para no mostrar solo el empleado_id, que al usuario no le dice nada.
function obtenerAsistencia(callback) {
  const sql = `
    SELECT
      a.id,
      e.nombre,
      e.puesto,
      a.fecha,
      a.asistio
    FROM asistencia a
    LEFT JOIN empleados e ON a.empleado_id = e.id
    ORDER BY a.fecha DESC
  `;
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
      p.dias_asistidos,
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
  obtenerAsistencia,
  obtenerPagos
};