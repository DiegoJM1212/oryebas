// controllers/veterinariosController.js
const sql = require('mssql');

const AP6_URL = process.env.API6_URL;
// Configuración de la base de datos
const config = {
    user: 'diego',
    password: '147',
    server: 'localhost',
    database: 'servicios',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

const obtenerTodosVeterinarios = async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT * FROM veterinarios');
        return res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener veterinarios:', err);
        res.status(500).json({ message: 'Error al obtener veterinarios' });
    } finally {
        await sql.close();
    }
};

const obtenerVeterinarioPorId = async (req, res) => {
    const id = req.params.id;
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM veterinarios WHERE id = ${id}`;
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Veterinario no encontrado' });
        }
        return res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error al obtener veterinario:', err);
        res.status(500).json({ message: 'Error al obtener veterinario' });
    } finally {
        await sql.close();
    }
};

const agregarVeterinario = async (req, res) => {
    const { nombre } = req.body;
    try {
        if (!nombre) {
            return res.status(400).json({ message: 'El nombre del veterinario es requerido' });
        }
        await sql.connect(config);
        await sql.query`INSERT INTO veterinarios (nombre) VALUES (${nombre})`;
        return res.status(201).json({ message: 'Veterinario agregado con éxito' });
    } catch (err) {
        console.error('Error al agregar veterinario:', err);
        res.status(500).json({ message: 'Error al agregar veterinario' });
    } finally {
        await sql.close();
    }
};

const actualizarVeterinario = async (req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;
    try {
        if (!nombre) {
            return res.status(400).json({ message: 'El nombre del veterinario es requerido' });
        }
        await sql.connect(config);
        const result = await sql.query`UPDATE veterinarios SET nombre = ${nombre} WHERE id = ${id}`;
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Veterinario no encontrado' });
        }
        return res.json({ message: 'Veterinario actualizado con éxito' });
    } catch (err) {
        console.error('Error al actualizar veterinario:', err);
        res.status(500).json({ message: 'Error al actualizar veterinario' });
    } finally {
        await sql.close();
    }
};

const eliminarVeterinario = async (req, res) => {
    const id = req.params.id;
    try {
        await sql.connect(config);
        const result = await sql.query`DELETE FROM veterinarios WHERE id = ${id}`;
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Veterinario no encontrado' });
        }
        return res.json({ message: 'Veterinario eliminado con éxito' });
    } catch (err) {
        console.error('Error al eliminar veterinario:', err);
        res.status(500).json({ message: 'Error al eliminar veterinario' });
    } finally {
        await sql.close();
    }
};

module.exports = {
    obtenerTodosVeterinarios,
    obtenerVeterinarioPorId,
    agregarVeterinario,
    actualizarVeterinario,
    eliminarVeterinario,
};
