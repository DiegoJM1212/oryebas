const express = require('express');
const router = express.Router();
const medicamentoController = require('../controladores/medicamentoController'); // Asegúrate de que la ruta del controlador sea correcta.

// Ruta para obtener los medicamentos
router.get('/', medicamentoController.obtenerMedicamentos);

// Ruta para procesar el pago y guardar la compra
router.post('/pago', medicamentoController.procesarPagoYGuardarMedicamento); // Esta es la ruta que se encarga de procesar el pago.

module.exports = router;
