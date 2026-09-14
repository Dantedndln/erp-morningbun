const db = require('../config/db');
// Une ventas, compras y pagos en un solo listado de movimientos
// UNION ALL apila los resultados de las tres consultas, siempre que
// cada una devuelva el mismo número de columnas con los mismos nombres
function obtenerMovimientos(callback) {
  const sql = `
    SELECT
      v.fecha,
      'Ingreso' AS tipo,
      'Venta' AS origen,
      CONCAT('V-', v.id) AS referencia,
      v.total AS monto
    FROM ventas v

    UNION ALL

    SELECT
      c.fecha,
      'Egreso' AS tipo,
      'Compra' AS origen,
      CONCAT('C-', c.id) AS referencia,
      c.total AS monto
    FROM compras c

    UNION ALL

    SELECT
      p.fecha,
      'Egreso' AS tipo,
      'Pago' AS origen,
      e.nombre AS referencia,
      p.monto AS monto
    FROM pagos p
    LEFT JOIN empleados e ON p.empleado_id = e.id

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

// Calcula el total de ingresos y el de egresos, y de ahí el balance
// COALESCE devuelve 0 en lugar de NULL cuando una tabla está vacía
function obtenerResumen(callback) {
  const sql = `
    SELECT
      (SELECT COALESCE(SUM(total), 0) FROM ventas) AS ingresos,
      (SELECT COALESCE(SUM(total), 0) FROM compras)
        + (SELECT COALESCE(SUM(monto), 0) FROM pagos) AS egresos
  `;
  db.query(sql, (error, resultados) => {
    if (error) {
      callback(error, null);
      return;
    }

    // La consulta devuelve un arreglo con una sola fila
    const fila = resultados[0];
    const ingresos = Number(fila.ingresos);
    const egresos = Number(fila.egresos);

    callback(null, {
      ingresos,
      egresos,
      balance: ingresos - egresos
    });
  });
}

module.exports = {
  obtenerMovimientos,
  obtenerResumen
};