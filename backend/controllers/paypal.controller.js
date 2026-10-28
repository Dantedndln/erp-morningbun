const { paypalRequest } = require('../services/paypal.service');
const productoService = require('../services/producto.service');
const ventaService = require('../services/venta.service');
const comprobanteService = require('../services/comprobante.service');
const correoService = require('../services/correo.service');

//almacenamiento temporal de las órdenes creadas y aún no capturadas no se guardan en la base de datos porque la venta se 
// registra únicamente cuando el pago ha sido confirmado
const ordenes = new Map();

// POST /api/paypal/orden
async function crearOrden(req, res) {
  try {
    const { productos: carrito, clienteNombre, correoCliente } = req.body;

    if (!Array.isArray(carrito) || carrito.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }
    //los precios se consultan en la base de datos, nunca se toman los importes que envía el cliente
    const ids = carrito.map(item => item.id);
    const productos = await productoService.obtenerPorIds(ids);
    let totalCentavos = 0;
    const detalles = [];

    for (const item of carrito) {
      const producto = productos.find(p => p.id === item.id);

      if (!producto) {
        return res.status(400).json({ error: 'Producto no disponible' });
      }
      if (!Number.isSafeInteger(item.cantidad) || item.cantidad < 1) {
        return res.status(400).json({ error: 'Cantidad inválida' });
      }
      if (item.cantidad > producto.stock) {
        return res.status(400).json({
          error: `Existencia insuficiente de ${producto.nombre}`
        });
      }

      //se trabaja en centavos para evitar errores de redondeo
      const precioCentavos = Math.round(Number(producto.precio) * 100);
      const subtotalCentavos = precioCentavos * item.cantidad;
      totalCentavos += subtotalCentavos;
      detalles.push({
        productoId: producto.id,
        nombreProducto: producto.nombre,
        cantidad: item.cantidad,
        precioUnitario: (precioCentavos / 100).toFixed(2),
        subtotal: (subtotalCentavos / 100).toFixed(2)
      });
    }

    if (!Number.isSafeInteger(totalCentavos) || totalCentavos <= 0) {
      return res.status(400).json({ error: 'Total inválido' });
    }

    const total = (totalCentavos / 100).toFixed(2);
    //se solicita a PayPal la creación de la orden
    const orden = await paypalRequest('/v2/checkout/orders', 'POST', {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'MXN',
          value: total
        }
      }]
    });

    //se guarda la orden junto con el detalle calculado en el servidor
    ordenes.set(orden.id, {
      total,
      moneda: 'MXN',
      estado: 'CREADA',
      detalles,
      usuarioId: req.usuario.id,
      clienteNombre: clienteNombre || 'Público general',
      correoCliente: correoCliente || null
    });

    res.json({ id: orden.id, total });

  } catch (error) {
    console.error(error);
    res.status(502).json({ error: 'No se pudo crear la orden' });
  }
}

// POST /api/paypal/capturar/:orderId
async function capturarOrden(req, res) {
  const { orderId } = req.params;

  try {
    const ordenLocal = ordenes.get(orderId);

    if (!ordenLocal) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    if (ordenLocal.estado !== 'CREADA') {
      return res.status(409).json({ error: 'La orden ya fue procesada' });
    }

    ordenLocal.estado = 'PROCESANDO';

    const resultado = await paypalRequest(
      `/v2/checkout/orders/${orderId}/capture`,
      'POST'
    );

    //se busca la captura completada dentro de la respuesta
    const captura = resultado.purchase_units
      ?.flatMap(u => u.payments?.captures || [])
      .find(c => c.status === 'COMPLETED');
    //se verifica que el importe y la moneda capturados coincidan con los de la orden generada
    const valido =
      resultado.id === orderId &&
      resultado.status === 'COMPLETED' &&
      captura?.amount?.currency_code === ordenLocal.moneda &&
      captura?.amount?.value === ordenLocal.total;
    if (!valido) {
      ordenLocal.estado = 'REVISION';
      return res.status(409).json({ error: 'Pago pendiente de verificación' });
    }

    //ahora sí, y solo aquí, se registra la venta y se descuenta la existencia
    const venta = await ventaService.registrarVenta({
      usuarioId: ordenLocal.usuarioId,
      clienteNombre: ordenLocal.clienteNombre,
      correoCliente: ordenLocal.correoCliente,
      total: ordenLocal.total,
      ordenId: orderId,
      capturaId: captura.id,
      detalles: ordenLocal.detalles
    });

    //fecha del comprobante en formato aaaa-mm-dd
    venta.fecha = new Date().toISOString().split('T')[0];

    //se genera el comprobante y se envía por correo
    //si el envío falla, la venta ya quedó registrada y el pago cobrado, por lo que el error se registra pero no 
    // interrumpe la operación
    try {
      const xml = comprobanteService.generarComprobante(venta);
      if (ordenLocal.correoCliente) {
        await correoService.enviarComprobante(ordenLocal.correoCliente, venta, xml);
        console.log(`Comprobante V-${venta.id} enviado a ${ordenLocal.correoCliente}`);
      } else {
        console.log(`Venta V-${venta.id} sin correo registrado, no se envió comprobante`);
      }
    } catch (error) {
      console.error('No se pudo enviar el comprobante:', error?.response?.body || error);
    }

    ordenLocal.estado = 'PAGADA';
    ordenes.delete(orderId);

    res.json({
      mensaje: 'Pago completado',
      ventaId: venta.id,
      orderId: orderId,
      capturaId: captura.id,
      total: ordenLocal.total
    });

  } catch (error) {
    console.error(error);

    //no se asume que el pago falló porque puede haberse cobrado
    const orden = ordenes.get(orderId);
    if (orden && orden.estado === 'PROCESANDO') {
      orden.estado = 'REVISION';
    }

    res.status(502).json({ error: 'Verificar estado del pago' });
  }
}

module.exports = { crearOrden, capturarOrden };