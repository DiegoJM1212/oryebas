const db = require('../data/db'); // Importa el módulo de conexión a la base de datos

// Obtener todas las mascotas
const obtenerMascotas = async () => {
    try {
        const result = await db.query('SELECT * FROM mascotas_adopcion');
        return result.recordset; // Retorna todas las mascotas
    } catch (error) {
        console.error('Error al obtener las mascotas:', error);
        throw new Error('Error al obtener las mascotas desde la base de datos');
    }
};

// Obtener una mascota por ID
const obtenerMascotaPorId = async (id) => {
    try {
        const result = await db.query`SELECT * FROM mascotas_adopcion WHERE id = ${id}`;
        if (result.recordset.length === 0) {
            return null; // Si no se encuentra la mascota, retornar null
        }
        return result.recordset[0]; // Retorna la mascota encontrada
    } catch (error) {
        console.error('Error al obtener la mascota:', error);
        throw new Error('Error al obtener la mascota desde la base de datos');
    }
};

// Agregar una nueva mascota
const agregarMascota = async (nombre, tipo, disponibilidad = 1, foto = null) => {
    try {
        await db.query`INSERT INTO mascotas_adopcion (nombre, tipo, disponibilidad, foto) VALUES (${nombre}, ${tipo}, ${disponibilidad}, ${foto})`;
    } catch (error) {
        console.error('Error al agregar la mascota:', error);
        throw new Error('Error al agregar la mascota a la base de datos');
    }
};

// Actualizar una mascota
const actualizarMascota = async (id, nombre, tipo, disponibilidad, foto) => {
    try {
        const result = await db.query`UPDATE mascotas_adopcion SET nombre = ${nombre}, tipo = ${tipo}, disponibilidad = ${disponibilidad}, foto = ${foto} WHERE id = ${id}`;
        if (result.rowsAffected[0] === 0) {
            throw new Error('Mascota no encontrada');
        }
    } catch (error) {
        console.error('Error al actualizar la mascota:', error);
        throw new Error('Error al actualizar la mascota en la base de datos');
    }
};

// Eliminar una mascota
const eliminarMascota = async (id) => {
    try {
        const result = await db.query`DELETE FROM mascotas_adopcion WHERE id = ${id}`;
        if (result.rowsAffected[0] === 0) {
            throw new Error('Mascota no encontrada');
        }
    } catch (error) {
        console.error('Error al eliminar la mascota:', error);
        throw new Error('Error al eliminar la mascota de la base de datos');
    }
};

module.exports = {
    obtenerMascotas,
    obtenerMascotaPorId,
    agregarMascota,
    actualizarMascota,
    eliminarMascota
};
