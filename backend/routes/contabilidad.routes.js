const express = require('express');
const router = express.Router();
const contabilidadService = require('../services/contabilidad.service');

// GET /api/contabilidad/movimientos para registro general
router.get('/movimientos', (req, res) => {
  contabilidadService.obtenerMovimientos((error, movimientos) => {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al consultar movimientos' });
    }
    res.json(movimientos);
  });
});

// GET /api/contabilidad/resumen para ingresos, egresos y balance
router.get('/resumen', (req, res) => {
  contabilidadService.obtenerResumen((error, resumen) => {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al consultar el resumen' });
    }
    res.json(resumen);
  });
});

module.exports = router;