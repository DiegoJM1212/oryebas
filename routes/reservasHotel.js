const express = require('express');
const router = express.Router();

// Asegúrate de que la ruta al controlador sea correcta
const reservasController = require('../controladores/reservasController');

// Ruta para crear una nueva reserva
router.post('/reservas', (req, res) => {
  reservasController.crearReserva(req, res);
});

module.exports = router;
