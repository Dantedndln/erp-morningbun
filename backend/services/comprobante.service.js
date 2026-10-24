// Genera el comprobante de venta en formato XML.
// no se utiliza ninguna biblioteca porque el documento se construye como texto cuidando que esté bien formado 
// y codificado en UTF-8

// Escapa los caracteres que tienen significado especial dentro de un XML, para que un nombre con "&" o comillas 
// no rompa el documento
function escapar(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generarComprobante(venta) {
  const conceptos = venta.detalles
    .map(detalle => `
    <Concepto
      descripcion="${escapar(detalle.nombreProducto)}"
      cantidad="${detalle.cantidad}"
      valorUnitario="${detalle.precioUnitario}"
      importe="${detalle.subtotal}" />`)
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<Comprobante
  folio="V-${venta.id}"
  fecha="${venta.fecha}"
  moneda="MXN"
  total="${venta.total}">

  <Emisor
    nombre="Cafeteria MorningBun"
    domicilio="Avenida Colomos 2500, Providencia, Guadalajara, Jalisco" />

  <Receptor
    nombre="${escapar(venta.clienteNombre)}"
    correo="${escapar(venta.correoCliente || '')}" />

  <Conceptos>${conceptos}
  </Conceptos>

</Comprobante>`;
}

module.exports = { generarComprobante };