const express = require('express');
const router = express.Router();
const segurosController = require('../controladores/segurosController');

// Update the route to match what your frontend is expecting
router.get('/seguros', segurosController.obtenerSeguros);

// ... other routes

module.exports = router;    