const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');
const { verificarSesion, verificarRol } = require('../middlewares/auth.middleware');

// Cadena de responsabilidad: cada petición pasa primero por la verificación de sesión, después por la de rol, y solo entonces
// llega al controlador

// El catálogo lo consultan tanto el cliente como el administrador
router.get('/', verificarSesion, productoController.obtenerProductos);

// la gestión del inventario corresponde únicamente al administrador
router.post('/', verificarSesion, verificarRol('administrador'), productoController.crearProducto);
router.put('/:id', verificarSesion, verificarRol('administrador'), productoController.modificarProducto);
router.patch('/:id/baja', verificarSesion, verificarRol('administrador'), productoController.darDeBajaProducto);

module.exports = router;