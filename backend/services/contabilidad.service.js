const db = require('../config/db');

//consulta base que unifica los movimientos de las tres tablas
//se define una sola vez y se reutiliza en las tres consultas, para no repetir el UNION en cada una
const SQL_MOVIMIENTOS = `
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
    'Egreso',
    'Compra',
    CONCAT('C-', c.id),
    c.total
  FROM compras c

  UNION ALL

  SELECT
    p.fecha,
    'Egreso',
    'Pago',
    e.nombre,
    p.monto
  FROM pagos p
  LEFT JOIN empleados e ON p.empleado_id = e.id
`;

//registro general filtrado por rango de fechas
function obtenerMovimientos(desde, hasta, callback) {
  const sql = `
    SELECT * FROM (${SQL_MOVIMIENTOS}) AS movimientos
    WHERE fecha BETWEEN ? AND ?
    ORDER BY fecha DESC
  `;
  db.query(sql, [desde, hasta], (error, resultados) => {
    if (error) { callback(error, null); return; }
    callback(null, resultados);
  });
}

//totales del periodo. COALESCE devuelve cero cuando no hay registros
function obtenerResumen(desde, hasta, callback) {
  const sql = `
    SELECT
      COALESCE(SUM(CASE WHEN tipo = 'Ingreso' THEN monto ELSE 0 END), 0) AS ingresos,
      COALESCE(SUM(CASE WHEN tipo = 'Egreso' THEN monto ELSE 0 END), 0) AS egresos
    FROM (${SQL_MOVIMIENTOS}) AS movimientos
    WHERE fecha BETWEEN ? AND ?
  `;
  db.query(sql, [desde, hasta], (error, resultados) => {
    if (error) { callback(error, null); return; }

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

//ingresos y egresos agrupados por día
//solo aparecen los días que tuvieron movimientos
function obtenerGrafica(desde, hasta, callback) {
  const sql = `
    SELECT
      fecha,
      COALESCE(SUM(CASE WHEN tipo = 'Ingreso' THEN monto ELSE 0 END), 0) AS ingresos,
      COALESCE(SUM(CASE WHEN tipo = 'Egreso' THEN monto ELSE 0 END), 0) AS egresos
    FROM (${SQL_MOVIMIENTOS}) AS movimientos
    WHERE fecha BETWEEN ? AND ?
    GROUP BY fecha
    ORDER BY fecha
  `;
  db.query(sql, [desde, hasta], (error, resultados) => {
    if (error) { callback(error, null); return; }
    callback(null, resultados);
  });
}

module.exports = { obtenerMovimientos, obtenerResumen, obtenerGrafica };