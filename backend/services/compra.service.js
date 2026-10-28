const db = require('../config/db');

// Historial de compras con el nombre del proveedor resuelto
function obtenerCompras(callback) {
  const sql = `
    SELECT c.id, p.nombre AS proveedor, c.fecha, c.total
    FROM compras c
    LEFT JOIN proveedores p ON c.proveedor_id = p.id
    ORDER BY c.fecha DESC, c.id DESC
  `;
  db.query(sql, (error, resultados) => {
    if (error) { callback(error, null); return; }
    callback(null, resultados);
  });
}

// Detalle de una compra: su cabecera y sus renglones
// Se consultan por separado para no anidar entidades innecesariamente
function obtenerDetalle(id, callback) {
  const sqlCabecera = `
    SELECT c.id, p.nombre AS proveedor, c.fecha, c.total
    FROM compras c
    LEFT JOIN proveedores p ON c.proveedor_id = p.id
    WHERE c.id = ?
  `;

  db.query(sqlCabecera, [id], (error, resultados) => {
    if (error) { callback(error, null); return; }

    if (resultados.length === 0) {
      callback(null, null);
      return;
    }

    const compra = resultados[0];

    // Los renglones se leen del detalle, no de la tabla de productos, porque conservan el nombre y el costo del momento de la 
    // compra
    const sqlDetalle = `
      SELECT nombre_producto, cantidad, costo_unitario, subtotal
      FROM compra_detalle
      WHERE compra_id = ?
    `;

    db.query(sqlDetalle, [id], (error, renglones) => {
      if (error) { callback(error, null); return; }
      callback(null, { ...compra, detalles: renglones });
    });
  });
}

// Registra la compra completa: cabecera, renglones e incremento de existencias
// Devuelve una promesa porque son varias operaciones encadenadas
function registrarCompra(compra) {
  return new Promise((resolve, reject) => {
    const sqlCompra = `
      INSERT INTO compras (proveedor_id, usuario_id, fecha, total)
      VALUES (?, ?, ?, ?)
    `;
    const valores = [compra.proveedorId, compra.usuarioId, compra.fecha, compra.total];

    db.query(sqlCompra, valores, (error, resultado) => {
      if (error) { reject(error); return; }

      const compraId = resultado.insertId;

      const sqlDetalle = `
        INSERT INTO compra_detalle
          (compra_id, producto_id, nombre_producto, cantidad, costo_unitario, subtotal)
        VALUES ?
      `;
      const filas = compra.detalles.map(d => [
        compraId, d.productoId, d.nombreProducto, d.cantidad, d.costoUnitario, d.subtotal
      ]);

      db.query(sqlDetalle, [filas], (error) => {
        if (error) { reject(error); return; }

        // Se incrementa la existencia de cada producto comprado
        let pendientes = compra.detalles.length;
        let hubeError = false;

        compra.detalles.forEach(d => {
          const sqlStock = 'UPDATE productos SET stock = stock + ? WHERE id = ?';
          db.query(sqlStock, [d.cantidad, d.productoId], (error) => {
            if (error && !hubeError) {
              hubeError = true;
              reject(error);
              return;
            }
            pendientes--;
            if (pendientes === 0 && !hubeError) {
              resolve({ id: compraId, ...compra });
            }
          });
        });
      });
    });
  });
}

module.exports = { obtenerCompras, obtenerDetalle, registrarCompra };