// routes/bancoCentralRoutes.js

const express = require('express');
const router = express.Router();
const bancoCentralController = require('../controladores/bancoCentralController');

// Ruta para obtener el tipo de cambio
router.get('/tipo-cambio', bancoCentralController.getExchangeRate);

module.exports = router;
