const { poolPromise, sql } = require('../data/db');

// Función para registrar auditoría
async function registrarAuditoria(req, res) {
    const userId = req.session.userId;  // Asumimos que el ID del usuario está en la sesión
    const pagina = 'Artículos';  // Página estática, siempre será "Artículos"

    try {
        const connection = await poolPromise;
        await connection.request()
            .input('id_usuario', sql.Int, userId)
            .input('accion', sql.VarChar, 'Acceso a artículos')  // Acción registrada
            .input('pagina', sql.VarChar, pagina)  // Registramos que accedió a la página de Artículos
            .query('INSERT INTO Auditoria (id_usuario, accion, pagina) VALUES (@id_usuario, @accion, @pagina)');

        return res.status(200).json({ message: 'Auditoría registrada con éxito.' });
    } catch (error) {
        console.error('Error al registrar auditoría:', error.message);
        return res.status(500).json({ message: 'Error al registrar auditoría.' });
    }
}
