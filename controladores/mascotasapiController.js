const db = require('../data/db'); // Asegúrate de que la ruta sea correcta

// Obtener todas las mascotas
const obtenerMascotas = async () => {
    try {
        const result = await db.query('SELECT * FROM mascotas_adopcion'); // Ajusta según tu base de datos
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
const agregarMascota = async (nombre, tipo, disponibilidad, foto) => {
    try {
        const query = `INSERT INTO mascotas_adopcion (nombre, tipo, disponibilidad, foto) 
                       VALUES (${nombre}, ${tipo}, ${disponibilidad}, ${foto || null})`;
        await db.query(query); // Ejecuta la consulta para agregar la mascota
    } catch (error) {
        console.error('Error al agregar la mascota:', error);
        throw new Error('Error al agregar la mascota a la base de datos');
    }
};

// Actualizar una mascota
const actualizarMascota = async (id, nombre, tipo, disponibilidad, foto) => {
    try {
        const query = `UPDATE mascotas_adopcion SET nombre = ${nombre}, tipo = ${tipo}, 
                       disponibilidad = ${disponibilidad}, foto = ${foto || null} 
                       WHERE id = ${id}`;
        await db.query(query); // Ejecuta la consulta para actualizar la mascota
    } catch (error) {
        console.error('Error al actualizar la mascota:', error);
        throw new Error('Error al actualizar la mascota en la base de datos');
    }
};

// Eliminar una mascota
const eliminarMascota = async (id) => {
    try {
        const query = `DELETE FROM mascotas_adopcion WHERE id = ${id}`;
        await db.query(query); // Ejecuta la consulta para eliminar la mascota
    } catch (error) {
        console.error('Error al eliminar la mascota:', error);
        throw new Error('Error al eliminar la mascota desde la base de datos');
    }
};

module.exports = {
    obtenerMascotas,
    obtenerMascotaPorId,
    agregarMascota,
    actualizarMascota,
    eliminarMascota,
};
