const express = require('express');
const router = express.Router();
const ventaService = require('../services/venta.service');

// GET /api/ventas para historial de ventas
router.get('/', (req, res) => {
  ventaService.obtenerVentas((error, ventas) => {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al consultar ventas' });
    }
    res.json(ventas);
  });
});

module.exports = router;