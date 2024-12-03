const express = require('express');
const router = express.Router();
const { registrarAuditoria } = require('../controladores/auditoriaController');

// Ruta para registrar auditoría
router.post('/registrar-auditoria', async (req, res) => {
    await registrarAuditoria(req, res);  // Llamamos a la función de auditoría
});

module.exports = router;
