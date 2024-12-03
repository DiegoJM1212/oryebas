// routes/storeRoutes.js
const express = require('express');
const router = express.Router();
const storeController = require('../controladores/storeController');

// Ruta para obtener productos
router.get('/tienda', storeController.getProducts);

module.exports = router;
