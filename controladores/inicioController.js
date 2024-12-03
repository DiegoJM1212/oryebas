const path = require('path');
const { poolPromise, sql } = require('../data/db');

exports.showInicio = async (req, res) => {
    let connection;
    try {
        // ID del usuario actual
        const usuarioId = req.session.userId; 

        // Verificar que el usuarioId no sea nulo o indefinido
        console.log('ID del usuario:', usuarioId);
        if (!usuarioId) {
            return res.status(400).send('Usuario no autenticado');
        }

        // Registrar en la auditoría la visita a la pantalla de inicio
        connection = await poolPromise;
        
        await connection.request()
            .input('usuario_id', sql.Int, usuarioId)
            .input('accion', sql.VarChar, 'Visita Inicio')
            .input('descripcion', sql.Text, 'Usuario visitó la página de inicio')
            .input('resultado', sql.VarChar, 'Éxito')
            .query(`INSERT INTO auditoria (usuario_id, accion, descripcion, resultado) 
                    VALUES (@usuario_id, @accion, @descripcion, @resultado)`);
        
        // Enviar el archivo HTML de la pantalla de inicio
        res.sendFile(path.join(__dirname, '..', 'html', 'inicio.html'));
    } catch (error) {
        console.error('Error al registrar visita en inicio:', error.message);
        res.status(500).send('Error al cargar la página de inicio');
    } finally {
        // Asegurarse de cerrar la conexión, si se ha abierto
        if (connection) {
            connection.close();
        }
    }
};
