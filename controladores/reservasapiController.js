const { poolPromise, sql } = require('../data/db');

async function reservarHotel(req, res) {
    let connection;
    try {
        // Obtener los datos de la reserva desde el cuerpo de la solicitud
        const { mascota_id, fecha_entrada, fecha_salida, comentarios, preferencia_alojamiento, metodo_pago } = req.body;

        // Validar el formato de las fechas (yyyy-MM-dd)
        const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

        // Verificar si las fechas están en el formato correcto
        if (!fechaRegex.test(fecha_entrada) || !fechaRegex.test(fecha_salida)) {
            return res.status(400).json({ error: 'El formato de las fechas es inválido. Debe ser yyyy-MM-dd.' });
        }

        // Convertir las fechas a objetos Date para SQL Server
        const fechaEntrada = new Date(fecha_entrada);
        const fechaSalida = new Date(fecha_salida);

        // Conectar a la base de datos
        connection = await poolPromise;

        // Inserción de las reservas en la base de datos
        await connection.request()
            .input('mascota_id', sql.Int, mascota_id)
            .input('fecha_entrada', sql.Date, fechaEntrada)
            .input('fecha_salida', sql.Date, fechaSalida)
            .input('comentarios', sql.NVarChar(sql.MAX), comentarios)
            .input('preferencia_alojamiento', sql.NVarChar(100), preferencia_alojamiento)
            .input('metodo_pago', sql.NVarChar(50), metodo_pago)
            .query(`
                INSERT INTO [dbo].[reservas_hotel] 
                (mascota_id, fecha_entrada, fecha_salida, comentarios, preferencia_alojamiento, metodo_pago) 
                VALUES
                (@mascota_id, @fecha_entrada, @fecha_salida, @comentarios, @preferencia_alojamiento, @metodo_pago)
            `);

        // Respuesta exitosa
        res.status(200).json({ message: 'Reserva de hotel realizada correctamente' });
    } catch (error) {
        console.error('Error al realizar la reserva:', error);
        res.status(500).json({ error: 'Error al realizar la reserva', details: error.message });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

module.exports = {
    reservarHotel,
};
