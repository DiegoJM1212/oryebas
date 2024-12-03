const express = require('express');
const router = express.Router();
const citasApiController = require('../controladores/citasApiController');

// Ruta para agendar cita (POST)
router.post('/', citasApiController.agendarCita); // Asumiendo que el método POST debería estar en '/api/citas'

module.exports = router;
