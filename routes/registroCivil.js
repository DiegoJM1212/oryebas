const express = require('express');
const router = express.Router();
const registroCivilController = require('../controladores/registroCivilController');

// Ruta para obtener datos del registro civil
router.get('/registro-civil/:cedula', registroCivilController.obtenerDatosRegistroCivil);

module.exports = router;
