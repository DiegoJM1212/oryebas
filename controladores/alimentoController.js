const { poolPromise } = require('../data/db'); // Asegúrate de que esto apunte a tu archivo de configuración de la base de datos.

// Obtener todos los alimentos
const obtenerAlimentos = async (req, res) => {
    try {
        const pool = await poolPromise; // Espera la promesa de la conexión a la base de datos
        const result = await pool.request()
            .query('SELECT id, categoria, nombre, precio, descripcion FROM alimentos'); // Asegúrate de que la consulta sea para la tabla correcta (alimentos en lugar de productos)

        // Devuelve los resultados en formato JSON
        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener alimentos:', error); // Cambia el mensaje de error para que coincida con la función

        // Responde con un estado 500 en caso de error
        res.status(500).send('Error al obtener alimentos');
    }
};

module.exports = {
    obtenerAlimentos
};
