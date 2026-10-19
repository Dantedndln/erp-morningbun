const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedor.controller');
const { verificarSesion, verificarRol } = require('../middlewares/auth.middleware');

// Todo el módulo de proveedores es exclusivo del administrador
router.get('/', verificarSesion, verificarRol('administrador'), proveedorController.obtenerProveedores);
router.post('/', verificarSesion, verificarRol('administrador'), proveedorController.crearProveedor);
router.put('/:id', verificarSesion, verificarRol('administrador'), proveedorController.modificarProveedor);
router.patch('/:id/baja', verificarSesion, verificarRol('administrador'), proveedorController.darDeBajaProveedor);

module.exports = router;