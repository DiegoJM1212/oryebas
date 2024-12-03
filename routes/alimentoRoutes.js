const express = require('express');
const { obtenerAlimentos } = require('../controladores/alimentoController'); // Verifica que el nombre y la ruta sean correctos

const router = express.Router();

// Ruta para obtener todos los alimentos
router.get('/', obtenerAlimentos); // Cambiado a '/' para evitar el prefijo duplicado

module.exports = router;
