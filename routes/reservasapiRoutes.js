const express = require('express');
const { reservarHotel } = require('../controladores/reservasapiController');  // Asegúrate de que el controlador esté correctamente importado

const router = express.Router();

// Definir la ruta para reservar hotel (NO agregues '/reservarHotel' aquí)
router.post('/', reservarHotel);  // Solo la ruta raíz del enrutador

module.exports = router;  // Exportar el enrutador para usarlo en `server.js`
