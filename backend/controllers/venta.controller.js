const ventaService = require('../services/venta.service');

function obtenerVentas(req, res) {
  ventaService.obtenerVentas((error, ventas) => {
    if (error) {
      console.error('Error al consultar ventas:', error);
      return res.status(500).json({ mensaje: 'Error al consultar ventas' });
    }
    res.json(ventas);
  });
}

module.exports = { obtenerVentas };