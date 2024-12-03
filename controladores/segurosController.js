const axios = require('axios');

// Configura la URL base de la API externa
const AP3_URL = process.env.API3_URL;

// Controlador para obtener todos los seguros
exports.obtenerSeguros = async (req, res) => {
    try {
        const response = await axios.get(`${apiUrl}/seguros`);
        res.json(response.data);
    } catch (error) {
        console.error('Error al obtener seguros:', error);
        res.status(500).json({ message: 'Error al obtener seguros' });
    }
};

// Controlador para obtener un seguro por ID
exports.obtenerSeguroPorId = async (req, res) => {
    const id = req.params.id;
    try {
        const response = await axios.get(`${apiUrl}/seguro/${id}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error al obtener seguro:', error);
        res.status(500).json({ message: 'Error al obtener seguro' });
    }
};

// Controlador para agregar un seguro
exports.agregarSeguro = async (req, res) => {
    const { nombre, descripcion } = req.body;
    try {
        const response = await axios.post(`${apiUrl}/seguro`, { nombre, descripcion });
        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error al agregar seguro:', error);
        res.status(500).json({ message: 'Error al agregar seguro' });
    }
};

// Controlador para actualizar un seguro
exports.actualizarSeguro = async (req, res) => {
    const id = req.params.id;
    const { nombre, descripcion } = req.body;
    try {
        const response = await axios.put(`${apiUrl}/seguro/${id}`, { nombre, descripcion });
        res.json(response.data);
    } catch (error) {
        console.error('Error al actualizar seguro:', error);
        res.status(500).json({ message: 'Error al actualizar seguro' });
    }
};

// Controlador para eliminar un seguro
exports.eliminarSeguro = async (req, res) => {
    const id = req.params.id;
    try {
        const response = await axios.delete(`${apiUrl}/seguro/${id}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error al eliminar seguro:', error);
        res.status(500).json({ message: 'Error al eliminar seguro' });
    }
};
