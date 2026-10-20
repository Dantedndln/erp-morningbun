require('dotenv').config();

const BASE_URL = process.env.PAYPAL_BASE_URL;

// Obtiene un token de acceso de PayPal
// las credenciales se envían codificadas en base64 conforme al esquema Basic
async function obtenerToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  const credenciales = Buffer.from(`${clientId}:${secret}`).toString('base64');

  const respuesta = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credenciales}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    console.error('Error de autenticación con PayPal:', datos);
    throw new Error('Error de autenticación con PayPal');
  }

  return datos.access_token;
}

// Envía una petición a la API de PayPal con el token ya incluido
// el token es temporal, por eso se solicita en cada operación
async function paypalRequest(ruta, metodo, body) {
  const token = await obtenerToken();

  const respuesta = await fetch(`${BASE_URL}${ruta}`, {
    method: metodo,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    // si no hay cuerpo que enviar, no se agrega la propiedad
    ...(body !== undefined ? { body: JSON.stringify(body) } : {})
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    console.error('Error de PayPal:', datos);
    throw new Error('Operación de PayPal rechazada');
  }

  return datos;
}

module.exports = { paypalRequest };