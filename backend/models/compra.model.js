//define la estructura de una compra tal como existe en la tabla "compras", como hace mucho lo hacia en Java, pero ahora en JavaScript. Extraño usar NetBeans :,c, aunque igual nada que ver java y javascript qpd
class Compra {
  constructor(id, proveedorId, fecha, total) {
    this.id = id;
    this.proveedorId = proveedorId;
    this.fecha = fecha;
    this.total = total;
  }
}

module.exports = Compra;