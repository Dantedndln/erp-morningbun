const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/venta.controller');
const { verificarSesion, verificarRol } = require('../middlewares/auth.middleware');

router.get('/', verificarSesion, verificarRol('administrador'), ventaController.obtenerVentas);
router.get('/:id', verificarSesion, verificarRol('administrador'), ventaController.obtenerDetalle);
router.post('/', verificarSesion, verificarRol('administrador'), ventaController.registrarVentaMostrador);

module.exports = router;