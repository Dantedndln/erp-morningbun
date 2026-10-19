const db = require('../config/db');

// busca una cuenta por su nombre de usuario (para el login)
function buscarPorUsuario(usuario, callback) {
  const sql = 'SELECT * FROM usuarios WHERE usuario = ?';
  db.query(sql, [usuario], (error, resultados) => {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, resultados[0]); // undefined si no existe
  });
}

// Verifica que el usuario o el correo no estén registrados previamente
function existeUsuarioOCorreo(usuario, correo, callback) {
  const sql = 'SELECT id FROM usuarios WHERE usuario = ? OR correo = ?';
  db.query(sql, [usuario, correo], (error, resultados) => {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, resultados.length > 0);
  });
}

// Registra una cuenta nueva con la contraseña ya cifrada
function crearUsuario(datos, callback) {
  const sql = `
    INSERT INTO usuarios
      (nombre, usuario, correo, contrasena, rol, acepto_terminos, fecha_aceptacion)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;
  const valores = [
    datos.nombre,
    datos.usuario,
    datos.correo,
    datos.contrasena,
    'cliente', // el registro público solo crea cuentas de cliente
    1
  ];
  db.query(sql, valores, (error, resultado) => {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, { id: resultado.insertId });
  });
}

module.exports = { buscarPorUsuario, existeUsuarioOCorreo, crearUsuario };