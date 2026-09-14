const express = require('express');
const router = express.Router();
const compraService = require('../services/compra.service');
// GET /api/compras para listado de compras
router.get('/', (req, res) => {
  compraService.obtenerCompras((error, compras) => {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al consultar compras' });
    }
    res.json(compras);
  });
});

module.exports = router;