const ventaService = require('../services/venta.service');
const productoService = require('../services/producto.service');
const comprobanteService = require('../services/comprobante.service');
const correoService = require('../services/correo.service');

function obtenerVentas(req, res) {
  ventaService.obtenerVentas((error, ventas) => {
    if (error) {
      console.error('Error al consultar ventas:', error);
      return res.status(500).json({ mensaje: 'Error al consultar ventas' });
    }
    res.json(ventas);
  });
}

function obtenerDetalle(req, res) {
  ventaService.obtenerDetalle(req.params.id, (error, venta) => {
    if (error) {
      console.error('Error al consultar el detalle:', error);
      return res.status(500).json({ mensaje: 'Error al consultar el detalle' });
    }
    if (!venta) {
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    }
    res.json(venta);
  });
}

// POST /api/ventas
//registra una venta de mostrador, cobrada en efectivo por el administrador
//a diferencia de la compra en línea, no pasa por la pasarela de pago porque se hace en mostrador y solo se acepta efectivo ahí
async function registrarVentaMostrador(req, res) {
  try {
    const { clienteNombre, correoCliente, productos } = req.body;

    if (!clienteNombre) {
      return res.status(400).json({ mensaje: 'Captura el nombre del cliente' });
    }
    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ mensaje: 'La venta no tiene productos' });
    }

    //los precios se consultan en la base de datos, no se toman
    //los importes que envía el cliente
    const ids = productos.map(p => p.id);
    const catalogo = await productoService.obtenerPorIds(ids);

    let total = 0;
    const detalles = [];

    for (const item of productos) {
      const producto = catalogo.find(p => p.id === item.id);

      if (!producto) {
        return res.status(400).json({ mensaje: 'Producto no disponible' });
      }
      if (!Number.isInteger(item.cantidad) || item.cantidad < 1) {
        return res.status(400).json({ mensaje: 'Cantidad inválida' });
      }
      if (item.cantidad > producto.stock) {
        return res.status(400).json({
          mensaje: `Existencia insuficiente de ${producto.nombre}`
        });
      }

      const precio = Number(producto.precio);
      const subtotal = precio * item.cantidad;
      total += subtotal;

      detalles.push({
        productoId: producto.id,
        nombreProducto: producto.nombre,
        cantidad: item.cantidad,
        precioUnitario: precio.toFixed(2),
        subtotal: subtotal.toFixed(2)
      });
    }

    const venta = await ventaService.registrarVenta({
      usuarioId: req.usuario.id,
      clienteNombre,
      correoCliente: correoCliente || null,
      total: total.toFixed(2),
      ordenId: null,          // sin orden de PayPal: venta en efectivo
      capturaId: null,
      detalles
    });

    venta.fecha = new Date().toISOString().split('T')[0];

    //el comprobante se envía solo si se capturó un correo
    //si el envío falla, la venta ya quedó registrada
    try {
      if (correoCliente) {
        const xml = comprobanteService.generarComprobante(venta);
        await correoService.enviarComprobante(correoCliente, venta, xml);
        console.log(`Comprobante V-${venta.id} enviado a ${correoCliente}`);
      }
    } catch (error) {
      console.error('No se pudo enviar el comprobante:', error?.response?.body || error);
    }

    res.status(201).json({
      mensaje: 'Venta registrada',
      ventaId: venta.id,
      total: venta.total
    });

  } catch (error) {
    console.error('Error al registrar la venta:', error);
    res.status(500).json({ mensaje: 'No se pudo registrar la venta' });
  }
}

module.exports = { obtenerVentas, obtenerDetalle, registrarVentaMostrador };