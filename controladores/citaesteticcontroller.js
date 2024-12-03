const { poolPromise, sql } = require('../data/db'); // Conexión a la base de datos
const pagoConTarjeta = require('../controladores/tarjetasController');  // Controlador de pago con tarjeta
const pagoConPayPal = require('../controladores/paypal');    // Controlador de pago con PayPal

// Agendar una cita estética
async function agendarCitaEstetica(req, res) {
    try {
        const { nombre_propietario, telefono, nombre_mascota, servicios, fecha, hora, comentarios, metodo_pago } = req.body;

        // Verificar el método de pago y procesarlo antes de guardar la cita
        let pagoExitoso = false;
        if (metodo_pago === 'tarjeta') {
            // Llamar al controlador de pago con tarjeta
            pagoExitoso = await pagoConTarjeta.procesarPago(req.body);
        } else if (metodo_pago === 'paypal') {
            // Llamar al controlador de pago con PayPal
            pagoExitoso = await pagoConPayPal.procesarPago(req.body);
        }

        if (!pagoExitoso) {
            return res.status(400).send('Error al procesar el pago.');
        }

        // Si el pago fue exitoso, procedemos a agendar la cita
        const pool = await poolPromise;
        await pool.request()
            .input('nombre_propietario', sql.VarChar, nombre_propietario)
            .input('telefono', sql.VarChar, telefono)
            .input('nombre_mascota', sql.VarChar, nombre_mascota)
            .input('servicios', sql.VarChar, servicios)
            .input('fecha', sql.Date, fecha)
            .input('hora', sql.VarChar, hora) // Almacenar como VARCHAR(5)
            .input('comentarios', sql.Text, comentarios || null) // Permitir comentarios opcionales
            .query(`INSERT INTO citas_esteticas (nombre_propietario, telefono, nombre_mascota, servicios, fecha, hora, comentarios) 
                    VALUES (@nombre_propietario, @telefono, @nombre_mascota, @servicios, @fecha, @hora, @comentarios)`);

        res.status(200).send('Cita estética agendada correctamente');
    } catch (error) {
        console.error('Error al agendar la cita estética:', error);
        res.status(500).send('Error al agendar la cita estética');
    }
}

// Comprobar disponibilidad de citas estéticas
async function comprobarDisponibilidad(req, res) {
    try {
        const { fecha, hora } = req.body;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('fecha', sql.Date, fecha)
            .input('hora', sql.VarChar, hora) // Almacenar como VARCHAR(5)
            .query(`SELECT COUNT(*) AS count FROM citas_esteticas WHERE fecha = @fecha AND hora = @hora`);

        const isAvailable = result.recordset[0].count === 0; // Si el conteo es 0, la cita está disponible

        res.status(200).json({ available: isAvailable });
    } catch (error) {
        console.error('Error al comprobar disponibilidad:', error);
        res.status(500).send('Error al comprobar disponibilidad');
    }
}

module.exports = {
    agendarCitaEstetica,
    comprobarDisponibilidad
};
