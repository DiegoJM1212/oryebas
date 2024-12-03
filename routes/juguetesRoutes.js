const express = require('express');
const { obtenerJuguetes, procesarPagoYGuardarJuguete } = require('../controladores/jugueteController'); // Asegúrate de que la ruta sea correcta

const router = express.Router();

// Ruta para obtener todos los juguetes
router.get('/', obtenerJuguetes);


module.exports = router;
