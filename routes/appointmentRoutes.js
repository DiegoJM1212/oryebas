const express = require('express');
const router = express.Router();

// Asegúrate de que la ruta al controlador sea correcta
const appointmentController = require('../controladores/appointmentController');

// Ruta para agendar cita veterinaria
router.post('/agendar', (req, res) => {
  if (typeof appointmentController.agendarCita === 'function') {
    appointmentController.agendarCita(req, res);
  } else {
    res.status(500).send('Error: Función agendarCita no definida.');
  }
});

// Nueva ruta para comprobar disponibilidad
router.post('/comprobar-disponibilidad', (req, res) => {
  if (typeof appointmentController.comprobarDisponibilidad === 'function') {
    appointmentController.comprobarDisponibilidad(req, res);
  } else {
    res.status(500).send('Error: Función comprobarDisponibilidad no definida.');
  }
});

module.exports = router;
