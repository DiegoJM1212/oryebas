const { poolPromise, sql } = require('../data/db'); // Asegúrate de que tienes configurado el acceso a la base de datos.
const pagoConTarjeta = require('../controladores/tarjetasController');  // Aquí incluirías el archivo donde gestionas el pago con tarjeta (Stripe o el servicio que utilices)
const pagoConPayPal = require('../controladores/paypal');    // Lo mismo con el controlador de PayPal

async function agendarCita(req, res) {
    let connection;
    try {
        const { id_usuario, nombrePropietario, nombreMascota, consulta, fecha, hora, metodoPago } = req.body;

        // Verificar el método de pago y procesarlo antes de guardar la cita
        let pagoExitoso = false;
        if (metodoPago === 'tarjeta') {
            // Llamar al controlador de pago con tarjeta
            pagoExitoso = await pagoConTarjeta.procesarPago(req.body);
        } else if (metodoPago === 'paypal') {
            // Llamar al controlador de pago con PayPal
            pagoExitoso = await pagoConPayPal.procesarPago(req.body);
        }

        if (!pagoExitoso) {
            return res.status(400).send('Error al procesar el pago.');
        }

        // Si el pago fue exitoso, procedemos a agendar la cita
        connection = await poolPromise;

        // Inserta la cita en la base de datos
        await connection.request()
            .input('id_usuario', sql.Int, id_usuario)
            .input('nombre_propietario', sql.VarChar, nombrePropietario)
            .input('nombre_mascota', sql.VarChar, nombreMascota)
            .input('consulta', sql.Text, consulta)
            .input('fecha', sql.Date, fecha)
            .input('hora', sql.Time, hora)
            .query(`INSERT INTO citas_veterinarias (id_usuario, nombre_propietario, nombre_mascota, consulta, fecha, hora) 
                     VALUES (@id_usuario, @nombre_propietario, @nombre_mascota, @consulta, @fecha, @hora)`);

        // Registrar en la auditoría
        await connection.request()
            .input('usuario_id', sql.Int, id_usuario)
            .input('accion', sql.VarChar, 'Agendar Cita')
            .input('descripcion', sql.Text, 'Cita agendada correctamente')
            .input('resultado', sql.VarChar, 'Éxito')
            .query(`INSERT INTO auditoria (usuario_id, accion, descripcion, resultado) 
                    VALUES (@usuario_id, @accion, @descripcion, @resultado)`);

        res.status(200).send('Cita agendada correctamente');
    } catch (error) {
        console.error('Error al agendar cita:', error);

        // Registrar error en la auditoría
        if (connection) {
            await connection.request()
                .input('usuario_id', sql.Int, req.body.id_usuario)
                .input('accion', sql.VarChar, 'Agendar Cita')
                .input('descripcion', sql.Text, `Error al agendar cita: ${error.message}`)
                .input('resultado', sql.VarChar, 'Error')
                .query(`INSERT INTO auditoria (usuario_id, accion, descripcion, resultado) 
                        VALUES (@usuario_id, @accion, @descripcion, @resultado)`);
        }

        res.status(500).send('Error al agendar la cita');
    } finally {
        if (connection) {
            // Cerrar la conexión para evitar fugas de conexión
            connection.close();
        }
    }
}

module.exports = {
    agendarCita,
};
