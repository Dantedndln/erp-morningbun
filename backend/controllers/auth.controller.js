const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const usuarioService = require('../services/usuario.service');

// POST /api/auth/login
function login(req, res) {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).json({ mensaje: 'Usuario y contraseña son obligatorios' });
  }

  usuarioService.buscarPorUsuario(usuario, async (error, cuenta) => {
    if (error) {
      console.error('Error en login:', error);
      return res.status(500).json({ mensaje: 'Error del servidor' });
    }

    // No se especifica si falló el usuario o la contraseña, para no dar pistas ;>
    if (!cuenta) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    // bcrypt.compare cifra la contraseña recibida y la compara con el hash guardado
    const passwordValido = await bcrypt.compare(contrasena, cuenta.contrasena);

    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    // El token lleva solo lo indispensable: id y rol. Nunca la contraseña
    const token = jwt.sign(
      { id: cuenta.id, rol: cuenta.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token: token,
      nombre: cuenta.nombre,
      correo: cuenta.correo,
      rol: cuenta.rol
    });
  });
}

// POST /api/auth/registro
async function registro(req, res) {
  const { nombre, usuario, correo, contrasena, confirmar, aceptoTerminos } = req.body;

  // Campos obligatorios
  if (!nombre || !usuario || !correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  // La contraseña y su confirmación deben coincidir
  if (contrasena !== confirmar) {
    return res.status(400).json({ mensaje: 'Las contraseñas no coinciden' });
  }

  // Mínimo 8 caracteres y al menos una mayúscula
  if (contrasena.length < 8 || !/[A-Z]/.test(contrasena)) {
    return res.status(400).json({
      mensaje: 'La contraseña debe tener al menos 8 caracteres y una mayúscula'
    });
  }

  // Formato nombre@dominio.extensión
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return res.status(400).json({ mensaje: 'El correo no tiene un formato válido' });
  }

  // Consentimiento explícito de términos y aviso de privacidad
  if (!aceptoTerminos) {
    return res.status(400).json({
      mensaje: 'Debe aceptar los términos y condiciones y el aviso de privacidad'
    });
  }

  usuarioService.existeUsuarioOCorreo(usuario, correo, async (error, existe) => {
    if (error) {
      console.error('Error en registro:', error);
      return res.status(500).json({ mensaje: 'Error del servidor' });
    }

    if (existe) {
      return res.status(409).json({ mensaje: 'El usuario o el correo ya están registrados' });
    }

    try {
      // El 10 son las iteraciones de sal: a mayor número, mayor aleatoriedad
      const passwordHash = await bcrypt.hash(contrasena, 10);

      usuarioService.crearUsuario(
        { nombre, usuario, correo, contrasena: passwordHash },
        (error) => {
          if (error) {
            console.error('Error al crear usuario:', error);
            return res.status(500).json({ mensaje: 'Error al registrar el usuario' });
          }
          res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
        }
      );
    } catch (error) {
      console.error('Error al cifrar la contraseña:', error);
      res.status(500).json({ mensaje: 'Error al registrar el usuario' });
    }
  });
}

module.exports = { login, registro };