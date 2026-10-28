const express = require('express');
const router = express.Router();
const contabilidadController = require('../controllers/contabilidad.controller');
const { verificarSesion, verificarRol } = require('../middlewares/auth.middleware');

router.get('/movimientos', verificarSesion, verificarRol('administrador'), contabilidadController.obtenerMovimientos);
router.get('/resumen', verificarSesion, verificarRol('administrador'), contabilidadController.obtenerResumen);
router.get('/grafica', verificarSesion, verificarRol('administrador'), contabilidadController.obtenerGrafica);

module.exports = router;