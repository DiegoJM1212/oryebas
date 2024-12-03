const express = require('express');
const router = express.Router();
const { agendarCitaEstetica, comprobarDisponibilidad } = require('../controladores/citaesteticcontroller'); // Importar las funciones del controlador

// Ruta para agendar una cita estética
router.post('/agendar', agendarCitaEstetica);

// Ruta para comprobar la disponibilidad
router.post('/comprobar-disponibilidad', comprobarDisponibilidad);

module.exports = router;
