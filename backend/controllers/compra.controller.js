const compraService = require('../services/compra.service');
const productoService = require('../services/producto.service');

function obtenerCompras(req, res) {
  compraService.obtenerCompras((error, compras) => {
    if (error) {
      console.error('Error al consultar compras:', error);
      return res.status(500).json({ mensaje: 'Error al consultar compras' });
    }
    res.json(compras);
  });
}

function obtenerDetalle(req, res) {
  compraService.obtenerDetalle(req.params.id, (error, compra) => {
    if (error) {
      console.error('Error al consultar el detalle:', error);
      return res.status(500).json({ mensaje: 'Error al consultar el detalle' });
    }
    if (!compra) {
      return res.status(404).json({ mensaje: 'Compra no encontrada' });
    }
    res.json(compra);
  });
}

// POST /api/compras
async function registrarCompra(req, res) {
  try {
    const { proveedorId, fecha, renglones } = req.body;
    if (!proveedorId) {
      return res.status(400).json({ mensaje: 'Debes seleccionar un proveedor' });
    }
    if (!fecha) {
      return res.status(400).json({ mensaje: 'La fecha es obligatoria' });
    }
    if (!Array.isArray(renglones) || renglones.length === 0) {
      return res.status(400).json({ mensaje: 'La compra no tiene productos' });
    }

    //los nombres de los productos se consultan en la base de datos, no se toman los que envía el cliente
    const ids = renglones.map(r => r.productoId);
    const productos = await productoService.obtenerPorIds(ids);
    let total = 0;
    const detalles = [];

    for (const renglon of renglones) {
      const producto = productos.find(p => p.id === renglon.productoId);

      if (!producto) {
        return res.status(400).json({ mensaje: 'Producto no disponible' });
      }
      if (!Number.isInteger(renglon.cantidad) || renglon.cantidad < 1) {
        return res.status(400).json({ mensaje: 'Cantidad inválida' });
      }
      if (Number(renglon.costoUnitario) <= 0) {
        return res.status(400).json({ mensaje: 'El costo debe ser mayor que cero' });
      }

      const subtotal = Number(renglon.costoUnitario) * renglon.cantidad;
      total += subtotal;
      detalles.push({
        productoId: producto.id,
        nombreProducto: producto.nombre,
        cantidad: renglon.cantidad,
        costoUnitario: Number(renglon.costoUnitario).toFixed(2),
        subtotal: subtotal.toFixed(2)
      });
    }

    const compra = await compraService.registrarCompra({
      proveedorId,
      usuarioId: req.usuario.id,
      fecha,
      total: total.toFixed(2),
      detalles
    });

    res.status(201).json({ mensaje: 'Compra registrada', id: compra.id });

  } catch (error) {
    console.error('Error al registrar la compra:', error);
    res.status(500).json({ mensaje: 'No se pudo registrar la compra' });
  }
}

module.exports = { obtenerCompras, obtenerDetalle, registrarCompra };