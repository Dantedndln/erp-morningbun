// Define la estructura de un proveedor tal como existe en la tabla "proveedores"
class Proveedor {
  constructor(id, nombre, telefono, correo) {
    this.id = id;
    this.nombre = nombre;
    this.telefono = telefono;
    this.correo = correo;
  }
}

module.exports = Proveedor;