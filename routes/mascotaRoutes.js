const express = require('express');
const router = express.Router();
const mascotaController = require('../controladores/mascotaController');

// Ruta para obtener los detalles de la mascota
router.get('/mascota/:id', mascotaController.obtenerDetallesMascota);

module.exports = router;
