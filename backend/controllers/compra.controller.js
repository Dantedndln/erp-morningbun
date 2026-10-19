const compraService = require('../services/compra.service');

function obtenerCompras(req, res) {
  compraService.obtenerCompras((error, compras) => {
    if (error) {
      console.error('Error al consultar compras:', error);
      return res.status(500).json({ mensaje: 'Error al consultar compras' });
    }
    res.json(compras);
  });
}

module.exports = { obtenerCompras };