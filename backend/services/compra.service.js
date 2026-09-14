// Aquí van las consultas SQL relacionadas con compras
const db = require('../config/db');
// Trae todas las compras registradas junto con el nombre del proveedor
function obtenerCompras(callback) {
  const sql = `
    SELECT c.id, p.nombre AS proveedor, c.fecha, c.total
    FROM compras c
    LEFT JOIN proveedores p ON c.proveedor_id = p.id
    ORDER BY c.fecha DESC
  `;
  db.query(sql, (error, resultados) => {
    if (error) { callback(error, null); return; }
    callback(null, resultados);
  });
}

module.exports = {
  obtenerCompras
};