const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// La llave del servicio se lee de una variable de entorno, nunca se escribe en el código
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Envía el comprobante de venta al correo del cliente, adjuntando el archivo XML generado
async function enviarComprobante(correoDestino, venta, xml) {
  const mensaje = {
    to: correoDestino,
    from: process.env.CORREO_REMITENTE,
    subject: `Comprobante de tu compra en MorningBun — Folio V-${venta.id}`,

    text:
      `Gracias por tu compra en MorningBun.\n\n` +
      `Folio: V-${venta.id}\n` +
      `Fecha: ${venta.fecha}\n` +
      `Total: $${venta.total} MXN\n\n` +
      `Adjuntamos el comprobante de tu compra en formato XML.\n\n` +
      `Cafeteria MorningBun`,

    html: `
      <div style="font-family: Arial, sans-serif; color: #3B2A1F;">
        <h2 style="color: #4A3427;">Gracias por tu compra</h2>
        <p>Tu pedido fue procesado correctamente.</p>
        <table style="border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 4px 12px 4px 0;"><strong>Folio:</strong></td>
              <td>V-${venta.id}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0;"><strong>Fecha:</strong></td>
              <td>${venta.fecha}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0;"><strong>Total:</strong></td>
              <td>$${venta.total} MXN</td></tr>
        </table>
        <p>Adjuntamos el comprobante de tu compra en formato XML.</p>
        <p style="color: #8A7462; font-size: 13px;">Cafeteria MorningBun</p>
      </div>`,

    // el archivo se adjunta codificado en base64, como lo requiere la API
    attachments: [
      {
        content: Buffer.from(xml, 'utf-8').toString('base64'),
        filename: `comprobante-V-${venta.id}.xml`,
        type: 'application/xml',
        disposition: 'attachment'
      }
    ]
  };

  await sgMail.send(mensaje);
}

module.exports = { enviarComprobante };