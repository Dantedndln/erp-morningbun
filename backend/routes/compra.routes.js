const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compra.controller');
const { verificarSesion, verificarRol } = require('../middlewares/auth.middleware');
//exclusivo para el administrador 
router.get('/', verificarSesion, verificarRol('administrador'), compraController.obtenerCompras); //¿a un cliente qué le importa ver cuanto gasto en compras? :>
router.get('/:id', verificarSesion, verificarRol('administrador'), compraController.obtenerDetalle);
router.post('/', verificarSesion, verificarRol('administrador'), compraController.registrarCompra);

module.exports = router;