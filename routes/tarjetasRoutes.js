const express = require('express');
const router = express.Router();
const tarjetasController = require('../controladores/tarjetasController');

// Ruta para obtener el saldo de una tarjeta
router.get('/tarjeta/:numeroTarjeta', tarjetasController.obtenerSaldo);

// Ruta para realizar un pago con la tarjeta
router.post('/pago', tarjetasController.realizarPago);

module.exports = router;
