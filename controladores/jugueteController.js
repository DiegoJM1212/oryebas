const { poolPromise } = require('../data/db'); // Asegúrate de que esto apunte a tu archivo de configuración de la base de datos.
const pagoConTarjeta = require('../controladores/tarjetasController');  // Controlador de pago con tarjeta
const pagoConPayPal = require('../controladores/paypal');    // Controlador de pago con PayPal

// Función para obtener juguetes
const obtenerJuguetes = async (req, res) => {
    try {
        const pool = await poolPromise; // Espera la promesa de la conexión a la base de datos
        const result = await pool.request()
            .query('SELECT id, nombre, precio, descripcion, imagen FROM juguetes'); // Asegúrate de que esta consulta sea correcta

        // Devuelve los juguetes en formato JSON
        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener juguetes:', error);
        
        // Responde con un estado 500 en caso de error
        res.status(500).send('Error al obtener juguetes');
    }
};

// Función para procesar el pago y guardar la compra de un juguete
const procesarPagoYGuardarJuguete = async (req, res) => {
    const { jugueteId, metodo_pago } = req.body; // Asumimos que el método de pago viene en el cuerpo de la solicitud

    console.log('Datos del pago:', req.body);  // Imprime los datos para depuración

    let pagoExitoso = false;
    try {
        // Verificar el método de pago y procesarlo
        if (metodo_pago === 'tarjeta') {
            // Llamar al controlador de pago con tarjeta
            pagoExitoso = await pagoConTarjeta.procesarPago(req.body);
        } else if (metodo_pago === 'paypal') {
            // Llamar al controlador de pago con PayPal
            pagoExitoso = await pagoConPayPal.procesarPago(req.body);
        } else {
            return res.status(400).send('Método de pago no válido.');
        }

        if (!pagoExitoso) {
            console.log('Pago fallido con el método:', metodo_pago);
            return res.status(400).send('Error al procesar el pago.');
        }

        // Si el pago es exitoso, guardamos la compra en la base de datos
        const pool = await poolPromise;
        await pool.request()
            .input('jugueteId', jugueteId)
            .input('metodoPago', metodo_pago)
            .query('INSERT INTO compras (juguete_id, metodo_pago) VALUES (@jugueteId, @metodoPago)');

        // Responde indicando que el pago fue procesado y la compra registrada
        res.status(200).json({ message: 'Pago procesado con éxito y compra registrada' });
    } catch (error) {
        console.error('Error al procesar el pago o guardar la compra:', error);
        res.status(500).send('Error al procesar el pago o guardar la compra.');
    }
};

module.exports = {
    obtenerJuguetes,
    procesarPagoYGuardarJuguete
};