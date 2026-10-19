// Define la estructura de un producto tal como existe en la tabla "productos"
class Producto {
  constructor(id, nombre, categoria, descripcion, precio, stock, imagen, vigente, fecha_alta, fecha_baja) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.descripcion = descripcion;
    this.precio = precio;
    this.stock = stock;
    this.imagen = imagen;
    this.vigente = vigente;
    this.fecha_alta = fecha_alta;
    this.fecha_baja = fecha_baja;
  }
}

module.exports = Producto;