// Define la estructura de un producto tal como existe en la tabla "productos"
class Producto {
  constructor(id, nombre, categoria, descripcion, precio, stock, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.descripcion = descripcion;
    this.precio = precio;
    this.stock = stock;
    this.imagen = imagen;
  }
}

module.exports = Producto;