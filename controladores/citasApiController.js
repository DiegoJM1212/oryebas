const { poolPromise, sql } = require('../data/db');

async function agendarCita(req, res) {
    let connection;
    try {
        // Obtener los datos de la cita desde el cuerpo de la solicitud
        const { mascota_id, nombre_mascota, nombre_propietario, telefono, consulta, fecha, hora } = req.body;

        // Validar el formato de la hora (HH:mm)
        const horaRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;

        // Verificar si la hora está en el formato correcto
        if (!horaRegex.test(hora)) {
            return res.status(400).json({ error: 'El formato de la hora es inválido. Debe ser HH:mm.' });
        }

        // Convertir la hora a un objeto Date para SQL Server
        const [hours, minutes] = hora.split(':');
        const horaDate = new Date(1970, 0, 1, hours, minutes);

        // Conectar a la base de datos
        connection = await poolPromise;

        // Inserción de la cita en la base de datos
        await connection.request()
            .input('mascota_id', sql.Int, mascota_id)
            .input('nombre_mascota', sql.NVarChar(100), nombre_mascota)
            .input('nombre_propietario', sql.NVarChar(100), nombre_propietario)
            .input('telefono', sql.VarChar(20), telefono)
            .input('consulta', sql.NVarChar(sql.MAX), consulta)
            .input('fecha', sql.Date, new Date(fecha))
            .input('hora', sql.Time, horaDate)
            .query(`
                INSERT INTO [dbo].[citas_veterinarias] 
                (mascota_id, fecha, hora, consulta, nombre_mascota, nombre_propietario, telefono) 
                VALUES
                (@mascota_id, @fecha, @hora, @consulta, @nombre_mascota, @nombre_propietario, @telefono)
            `);

        // Respuesta exitosa
        res.status(200).json({ message: 'Cita agendada correctamente' });
    } catch (error) {
        console.error('Error al agendar cita:', error);
        res.status(500).json({ error: 'Error al agendar la cita', details: error.message });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

module.exports = {
    agendarCita,
};