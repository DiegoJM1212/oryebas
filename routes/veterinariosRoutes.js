// routes/veterinariosRoutes.js
const express = require('express');
const router = express.Router();
const veterinariosController = require('../controladores/veterinariosController');

// Definir las rutas
router.get('/', veterinariosController.obtenerTodosVeterinarios);
router.get('/:id', veterinariosController.obtenerVeterinarioPorId);
router.post('/', veterinariosController.agregarVeterinario);
router.put('/:id', veterinariosController.actualizarVeterinario);
router.delete('/:id', veterinariosController.eliminarVeterinario);

module.exports = router;
