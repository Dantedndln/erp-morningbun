const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypal.controller');
const { verificarSesion } = require('../middlewares/auth.middleware');

// Ambas operaciones requieren sesión: el cliente compra a nombre propio
// y el administrador registra ventas de mostrador
router.post('/orden', verificarSesion, paypalController.crearOrden);
router.post('/capturar/:orderId', verificarSesion, paypalController.capturarOrden);

module.exports = router;