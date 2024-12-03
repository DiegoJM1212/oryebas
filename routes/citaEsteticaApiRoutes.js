const express = require('express');
const router = express.Router();

// Asegúrate de que la ruta al controlador sea correcta
const { agendarCitaEstetica, comprobarDisponibilidad } = require('../controladores/esteticaApiController');

// Ruta para agendar una cita estética
router.post('/agendar', agendarCitaEstetica);

// Ruta para comprobar la disponibilidad de citas estéticas
router.post('/disponibilidad', comprobarDisponibilidad);

module.exports = router;
