const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importa tu módulo de conexión existente

// Obtener todas las mascotas
router.get('/mascotas', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM mascotas_adopcion');
        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener las mascotas:', error);
        res.status(500).json({ message: 'Error al obtener mascotas' });
    }
});

// Obtener una mascota por ID
router.get('/mascotas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query`SELECT * FROM mascotas_adopcion WHERE id = ${id}`;
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
        }
        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error al obtener mascota:', error);
        res.status(500).json({ message: 'Error al obtener mascota' });
    }
});

// Agregar una nueva mascota
router.post('/mascotas', async (req, res) => {
    try {
        const { nombre, tipo, disponibilidad = 1, foto = null } = req.body;
        if (!nombre || !tipo) {
            return res.status(400).json({ message: 'El nombre y el tipo son requeridos' });
        }
        await db.query`INSERT INTO mascotas_adopcion (nombre, tipo, disponibilidad, foto) VALUES (${nombre}, ${tipo}, ${disponibilidad}, ${foto})`;
        res.status(201).json({ message: 'Mascota agregada con éxito' });
    } catch (error) {
        console.error('Error al agregar mascota:', error);
        res.status(500).json({ message: 'Error al agregar mascota' });
    }
});

// Actualizar una mascota
router.put('/mascotas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, tipo, disponibilidad, foto } = req.body;
        if (!nombre || !tipo) {
            return res.status(400).json({ message: 'El nombre y el tipo son requeridos' });
        }
        const result = await db.query`UPDATE mascotas_adopcion SET nombre = ${nombre}, tipo = ${tipo}, disponibilidad = ${disponibilidad}, foto = ${foto} WHERE id = ${id}`;
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
        }
        res.json({ message: 'Mascota actualizada con éxito' });
    } catch (error) {
        console.error('Error al actualizar mascota:', error);
        res.status(500).json({ message: 'Error al actualizar mascota' });
    }
});

// Eliminar una mascota
router.delete('/mascotas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query`DELETE FROM mascotas_adopcion WHERE id = ${id}`;
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
        }
        res.json({ message: 'Mascota eliminada con éxito' });
    } catch (error) {
        console.error('Error al eliminar mascota:', error);
        res.status(500).json({ message: 'Error al eliminar mascota' });
    }
});

module.exports = router;
