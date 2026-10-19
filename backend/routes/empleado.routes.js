const express = require('express');
const router = express.Router();
const empleadoService = require('../services/empleado.service');

// GET /api/empleados para listado de empleados
router.get('/', (req, res) => {
  empleadoService.obtenerEmpleados((error, empleados) => {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al consultar empleados' });
    }
    res.json(empleados);
  });
});

// GET /api/empleados/pagos para historial de pagos
router.get('/pagos', (req, res) => {
  empleadoService.obtenerPagos((error, pagos) => {
    if (error) {
      return res.status(500).json({ mensaje: 'Error al consultar pagos' });
    }
    res.json(pagos);
  });
});

module.exports = router;