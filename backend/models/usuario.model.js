// Estructura de un usuario tal como existe en la tabla "usuarios"
class Usuario {
  constructor(id, nombre, usuario, correo, contrasena, rol) {
    this.id = id;
    this.nombre = nombre;
    this.usuario = usuario;
    this.correo = correo;
    this.contrasena = contrasena;
    this.rol = rol;
  }
}

module.exports = Usuario;