const express = require('express');
const router = express.Router();
const paypalController = require('../controladores/paypal');

// Ruta para crear un pago con PayPal
router.post('/crear-pago-paypal', paypalController.crearPagoPaypal);

// Ruta para ejecutar el pago de PayPal después de la aprobación
router.post('/ejecutar-pago-paypal', paypalController.ejecutarPagoPaypal);

module.exports = router;
