const { poolPromise, sql } = require('../data/db');
const pagoConTarjeta = require('../controladores/tarjetasController');
const pagoConPayPal = require('../controladores/paypal');

exports.crearReserva = async (req, res) => {
    const { mascota_id, fecha_entrada, fecha_salida, comentarios, preferencia_alojamiento, metodo_pago, id_usuario } = req.body;

    let pagoExitoso = false;
    let connection;

    try {
        // Verificar el método de pago y procesarlo antes de guardar la reserva
        if (metodo_pago === 'tarjeta') {
            pagoExitoso = await pagoConTarjeta.procesarPago(req.body);
        } else if (metodo_pago === 'paypal') {
            pagoExitoso = await pagoConPayPal.procesarPago(req.body);
        }

        if (!pagoExitoso) {
            return res.status(400).send('Error al procesar el pago.');
        }

        // Si el pago fue exitoso, continuar con la creación de la reserva
        connection = await poolPromise;

        await connection.request()
            .input('mascota_id', sql.Int, mascota_id)
            .input('fecha_entrada', sql.Date, fecha_entrada)
            .input('fecha_salida', sql.Date, fecha_salida)
            .input('comentarios', sql.Text, comentarios)
            .input('preferencia_alojamiento', sql.VarChar(100), preferencia_alojamiento)
            .input('metodo_pago', sql.VarChar(50), metodo_pago)
            .query('INSERT INTO reservas_hotel (mascota_id, fecha_entrada, fecha_salida, comentarios, preferencia_alojamiento, metodo_pago) VALUES (@mascota_id, @fecha_entrada, @fecha_salida, @comentarios, @preferencia_alojamiento, @metodo_pago)');

        // Registrar en la auditoría
        await connection.request()
            .input('usuario_id', sql.Int, id_usuario)
            .input('accion', sql.VarChar, 'Crear Reserva')
            .input('descripcion', sql.Text, 'Reserva creada correctamente')
            .input('resultado', sql.VarChar, 'Éxito')
            .query(`INSERT INTO auditoria (usuario_id, accion, descripcion, resultado) VALUES (@usuario_id, @accion, @descripcion, @resultado)`);

        res.status(201).send('Reserva creada con éxito');
    } catch (err) {
        console.error(err);

        // Registrar error en la auditoría
        if (connection) {
            await connection.request()
                .input('usuario_id', sql.Int, id_usuario)
                .input('accion', sql.VarChar, 'Crear Reserva')
                .input('descripcion', sql.Text, `Error al crear la reserva: ${err.message}`)
                .input('resultado', sql.VarChar, 'Error')
                .query(`INSERT INTO auditoria (usuario_id, accion, descripcion, resultado) VALUES (@usuario_id, @accion, @descripcion, @resultado)`);
        }

        res.status(500).send('Error al crear la reserva');
    } finally {
        if (connection) {
            connection.close();
        }
    }
};
