const express = require('express');
const router = express.Router();
const userController = require('../controladores/userController');

// Verificar que el controlador se cargó correctamente  
if (!userController) {
    console.error("El controlador de usuario no se ha cargado correctamente.");
}

// Redirigir a la página de inicio de sesión por defecto
router.get('/', (req, res) => {
    res.redirect('/login'); // Redirige a la pantalla de inicio de sesión
});

// Ruta para registrar usuarios
router.post('/registro', (req, res) => {
    if (typeof userController.registrarUsuario === 'function') {
        userController.registrarUsuario(req, res);
    } else {
        console.error("Función registrarUsuario no está definida en el controlador.");
        res.status(500).send("Error en el controlador: función registrarUsuario no definida.");
    }
});

// Ruta para iniciar sesión (login)
router.post('/login', (req, res) => {
    if (typeof userController.iniciarSesion === 'function') {
        userController.iniciarSesion(req, res);
    } else {
        console.error("Función iniciarSesion no está definida en el controlador.");
        res.status(500).send("Error en el controlador: función iniciarSesion no definida.");
    }
});

// Ruta para verificar el código de verificación 2FA
router.post('/verificar', (req, res) => { // Cambiar 'verify-2fa' a 'verificar'
    if (typeof userController.verificarCodigo === 'function') {
        userController.verificarCodigo(req, res);
    } else {
        console.error("Función verificarCodigo no está definida en el controlador.");
        res.status(500).send("Error en el controlador: función verificarCodigo no definida.");
    }
});

// Exportar el router
module.exports = router;
