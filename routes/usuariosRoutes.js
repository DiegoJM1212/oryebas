const express = require('express');
const router = express.Router();
const recuperarController = require('../controladores/recuperarController');

// Verificar que el controlador se cargó correctamente  
if (!recuperarController) {
    console.error("El controlador de recuperación no se ha cargado correctamente.");
}

// Ruta para recuperar contraseña
router.post('/', (req, res) => { // Mantén la ruta como '/'
    if (typeof recuperarController.recuperarContrasena === 'function') {
        recuperarController.recuperarContrasena(req, res); // Llama a la función correspondiente en el controlador de recuperación
    } else {
        console.error("Función recuperarContrasena no está definida en el controlador.");
        res.status(500).send("Error en el controlador: función recuperarContrasena no definida.");
    }
});

module.exports = router;
