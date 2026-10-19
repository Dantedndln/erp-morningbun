const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/venta.controller');
const { verificarSesion, verificarRol } = require('../middlewares/auth.middleware');

// El historial completo de ventas lo consulta solo el administrador
router.get('/', verificarSesion, verificarRol('administrador'), ventaController.obtenerVentas);

module.exports = router;