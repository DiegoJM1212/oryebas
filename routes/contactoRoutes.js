// routes/contactoRoutes.js
const express = require('express');
const router = express.Router();
const contactoController = require('../controladores/contactoController');

// Ruta para enviar el formulario de contacto
router.post('/', contactoController.enviarContacto);

module.exports = router;
