const express = require('express');
const router = express.Router();
const productosController = require('../controladores/productosController'); // Importa correctamente el controlador

// Ruta para obtener todos los productos
router.get('/', productosController.getProducts); // Esta ruta llama a getProducts

// Ruta para procesar el pago y guardar la cita
router.post('/procesar-pago', productosController.procesarPagoYGuardar); // Esta ruta maneja el pago

module.exports = router;
