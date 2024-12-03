const db = require('../data/db'); // Asegúrate de tener la conexión a la base de datos aquí

// Controlador para obtener los detalles de la mascota
exports.obtenerDetallesMascota = async (req, res) => {
    const mascotaId = req.params.id;
    const usuarioId = req.session.userId; // Suponiendo que el ID del usuario está guardado en la sesión

    try {
        // Obtener detalles de la mascota
        const detallesMascota = await db.query('SELECT * FROM mascotas WHERE id = ? AND usuario_id = ?', [mascotaId, usuarioId]);

        // Si no se encuentra la mascota o no pertenece al usuario, enviar un error
        if (detallesMascota.length === 0) {
            return res.status(404).send('Mascota no encontrada o no pertenece a este usuario');
        }

        // Obtener seguimiento veterinario de la mascota
        const seguimiento = await db.query('SELECT * FROM seguimiento_veterinario WHERE mascota_id = ?', [mascotaId]);

        // Renderizar la vista con los detalles de la mascota y el seguimiento
        res.render('detalles_mascota', {
            detalles: {
                ...detallesMascota[0],
                seguimiento: seguimiento
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

