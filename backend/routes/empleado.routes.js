const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleado.controller');
const { verificarSesion, verificarRol } = require('../middlewares/auth.middleware');

// Las rutas específicas van antes que cualquier ruta con parámetro :p
router.get('/pagos', verificarSesion, verificarRol('administrador'), empleadoController.obtenerPagos);
router.get('/', verificarSesion, verificarRol('administrador'), empleadoController.obtenerEmpleados);

module.exports = router;