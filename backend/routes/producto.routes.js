const express = require('express');
const router = express.Router();
const productoService = require('../services/producto.service');
// GET /api/productos para listado de productos
router.get('/', (req, res) => {
  productoService.obtenerProductos((error, productos) => {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al obtener productos' });
    }
    res.json(productos);
  });
});

module.exports = router;