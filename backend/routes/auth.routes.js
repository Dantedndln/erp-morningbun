const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Las rutas solo declaran el endpoint y delegan en el controlador :P
router.post('/login', authController.login);
router.post('/registro', authController.registro);

module.exports = router;