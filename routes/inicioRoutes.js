// routes/inicioRoutes.js
const express = require('express');
const router = express.Router();
const inicioController = require('../controladores/inicioController');

// Ruta para acceder a la página de inicio
router.get('/', inicioController.showInicio); // Cambiar a esta ruta para usar el controlador

module.exports = router;
