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

// Registra la venta completa: la cabecera, sus renglones y el descuento de existencias
// se ejecuta únicamente después de confirmar el pago
function registrarVenta(venta) {
  return new Promise((resolve, reject) => {
    const sqlVenta = `
      INSERT INTO ventas
        (usuario_id, cliente_nombre, correo_cliente, fecha, total,
         estado_pago, paypal_order_id, paypal_capture_id)
      VALUES (?, ?, ?, CURDATE(), ?, 'PAGADA', ?, ?)
    `;
    const valoresVenta = [
      venta.usuarioId,
      venta.clienteNombre,
      venta.correoCliente,
      venta.total,
      venta.ordenId,
      venta.capturaId
    ];

    db.query(sqlVenta, valoresVenta, (error, resultado) => {
      if (error) { reject(error); return; }

      const ventaId = resultado.insertId;

      // Los renglones conservan el nombre y el precio vigentes al momento
      // de la venta, para que el comprobante no cambie después
      const sqlDetalle = `
        INSERT INTO venta_detalle
          (venta_id, producto_id, nombre_producto, cantidad, precio_unitario, subtotal)
        VALUES ?
      `;
      const filas = venta.detalles.map(d => [
        ventaId, d.productoId, d.nombreProducto, d.cantidad, d.precioUnitario, d.subtotal
      ]);

      db.query(sqlDetalle, [filas], (error) => {
        if (error) { reject(error); return; }

        // Disminuye la existencia de cada producto vendido
        let pendientes = venta.detalles.length;
        let hubeError = false;

        venta.detalles.forEach(d => {
          const sqlStock = 'UPDATE productos SET stock = stock - ? WHERE id = ?';
          db.query(sqlStock, [d.cantidad, d.productoId], (error) => {
            if (error && !hubeError) {
              hubeError = true;
              reject(error);
              return;
            }
            pendientes--;
            if (pendientes === 0 && !hubeError) {
              resolve({ id: ventaId, ...venta });
            }
          });
        });
      });
    });
  });
}

module.exports = {
  obtenerVentas,
  registrarVenta
};