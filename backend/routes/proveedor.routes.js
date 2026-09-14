const express = require('express');
const router = express.Router();
const proveedorService = require('../services/proveedor.service');
// GET /api/proveedores para listado de proveedores
router.get('/', (req, res) => {
  proveedorService.obtenerProveedores((error, proveedores) => {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al consultar proveedores' });
    }
    res.json(proveedores);
  });
});

module.exports = router;