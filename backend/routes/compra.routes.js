const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compra.controller');
const { verificarSesion, verificarRol } = require('../middlewares/auth.middleware');
// Exclusivo para el administrador, ¿a un cliente qué le importa ver cuanto gasto en compras? :>
router.get('/', verificarSesion, verificarRol('administrador'), compraController.obtenerCompras);

module.exports = router;