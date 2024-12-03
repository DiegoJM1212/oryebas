const express = require('express');
const router = express.Router();
const mascotasController = require('../controladores/mascotasapiController'); // Ajusta la ruta si es necesario

// Obtener todas las mascotas
router.get('/', async (req, res, next) => { 
    try {
        const mascotas = await mascotasController.obtenerMascotas(); // Llama al controlador para obtener las mascotas
        res.json(mascotas);
    } catch (error) {
        next(error); // Pasa el error al middleware
    }
});

// Obtener una mascota por ID
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const mascota = await mascotasController.obtenerMascotaPorId(id); // Llama al controlador para obtener la mascota por ID
        if (!mascota) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
        }
        res.json(mascota);
    } catch (error) {
        next(error); // Pasa el error al middleware
    }
});

// Agregar una nueva mascota
router.post('/', async (req, res, next) => {
    try {
        const { nombre, tipo, disponibilidad = 1, foto = null } = req.body;
        if (!nombre || !tipo) {
            return res.status(400).json({ message: 'El nombre y el tipo son requeridos' });
        }
        await mascotasController.agregarMascota(nombre, tipo, disponibilidad, foto); // Llama al controlador para agregar una mascota
        res.status(201).json({ message: 'Mascota agregada con éxito' });
    } catch (error) {
        next(error); // Si hay un error, lo pasa al middleware de errores
    }
});

// Actualizar una mascota
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre, tipo, disponibilidad, foto } = req.body;
        if (!nombre || !tipo) {
            return res.status(400).json({ message: 'El nombre y el tipo son requeridos' });
        }
        await mascotasController.actualizarMascota(id, nombre, tipo, disponibilidad, foto); // Llama al controlador para actualizar una mascota
        res.json({ message: 'Mascota actualizada con éxito' });
    } catch (error) {
        next(error); // Si hay un error, lo pasa al middleware de errores
    }
});

// Eliminar una mascota
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await mascotasController.eliminarMascota(id); // Llama al controlador para eliminar una mascota
        res.json({ message: 'Mascota eliminada con éxito' });
    } catch (error) {
        next(error); // Si hay un error, lo pasa al middleware de errores
    }
});

module.exports = router;
