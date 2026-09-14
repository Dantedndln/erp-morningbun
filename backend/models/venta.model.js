// Estructura de una venta tal como existe en la tabla "ventas"
class Venta {
  constructor(id, cliente, registradoPor, fecha, total) {
    this.id = id;
    this.cliente = cliente;
    this.registradoPor = registradoPor;
    this.fecha = fecha;
    this.total = total;
  }
}

module.exports = Venta;