const jwt = require('jsonwebtoken');
require('dotenv').config();

//middleware de autenticación
//lee el token del encabezado Authorization, lo verifica con la clave secreta y deja los datos del usuario en req.usuario 
//para el siguiente eslabón
function verificarSesion(req, res, next) {
  const encabezado = req.headers['authorization'];

  if (!encabezado) {
    return res.status(401).json({ mensaje: 'No autenticado' });
  }

  //el encabezado llega con el formato "Bearer <token>"
  const token = encabezado.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'No autenticado' });
  }

  try {
    //jwt.verify comprueba la firma del token y devuelve su contenido
    const datos = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = datos;
    next();//el next continúa el flujo hacia el siguiente middleware
  } catch (error) {
    return res.status(401).json({ mensaje: 'Sesión inválida o expirada' });
  }
}

//middleware de autorización
//devuelve un middleware configurado con los roles que autoriza la ruta
function verificarRol(...rolesPermitidos) {
  return function (req, res, next) {
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'Acceso denegado' });
    }
    next();
  };
}

module.exports = { verificarSesion, verificarRol };