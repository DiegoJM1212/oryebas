const { poolPromise, sql } = require('../data/db');

async function agendarCitaEstetica(req, res) {
    let pool;
    try {
        const { mascota_id, servicios, fecha, hora, comentarios } = req.body;

        // Validar el formato de la hora (HH:mm)
        const horaRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
        if (!horaRegex.test(hora)) {
            return res.status(400).json({ error: 'El formato de la hora es inválido. Debe ser HH:mm.' });
        }

        pool = await poolPromise;
        await pool.request()
        .input('mascota_id', sql.Int, mascota_id)
        .input('servicios', sql.NVarChar(200), servicios)
        .input('fecha', sql.Date, new Date(fecha))
        .input('hora', sql.Time, new Date(`1970-01-01T${hora}:00`))
        .input('comentarios', sql.NVarChar(500), comentarios)
        .query(`
            INSERT INTO citas_esteticas 
            (mascota_id, servicios, fecha, hora, comentarios) 
            VALUES 
            (@mascota_id, @servicios, @fecha, @hora, @comentarios)
        `);
    
        res.status(200).json({ message: 'Cita estética agendada correctamente' });
    } catch (error) {
        console.error('Error al agendar la cita estética:', error);
        res.status(500).json({ error: 'Error al agendar la cita estética', details: error.message });
    }
}

async function comprobarDisponibilidad(req, res) {
    let pool;
    try {
        const { fecha, hora } = req.body;

        // Validar el formato de la hora (HH:mm)
        const horaRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
        if (!horaRegex.test(hora)) {
            return res.status(400).json({ error: 'El formato de la hora es inválido. Debe ser HH:mm.' });
        }

        pool = await poolPromise;
        const result = await pool.request()
            .input('fecha', sql.Date, new Date(fecha))
            .input('hora', sql.Time, new Date(`1970-01-01T${hora}:00`))
            .query(`
                SELECT COUNT(*) AS count 
                FROM citas_esteticas 
                WHERE fecha = @fecha AND hora = @hora
            `);

        const isAvailable = result.recordset[0].count === 0;

        res.status(200).json({ available: isAvailable });
    } catch (error) {
        console.error('Error al comprobar disponibilidad:', error);
        res.status(500).json({ error: 'Error al comprobar disponibilidad', details: error.message });
    }
}

module.exports = {
    agendarCitaEstetica,
    comprobarDisponibilidad
};
