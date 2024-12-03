const { poolPromise } = require('../data/db'); // Asegúrate de que esto apunte a tu archivo de configuración de la base de datos.
const pagoConTarjeta = require('../controladores/tarjetasController');  // Controlador de pago con tarjeta
const pagoConPayPal = require('../controladores/paypal');    // Controlador de pago con PayPal

// Obtener todos los productos
const getProducts = async (req, res) => {
    try {
        const pool = await poolPromise; // Espera la promesa de la conexión a la base de datos
        const result = await pool.request()
            .query('SELECT id, nombre, precio, descripcion, imagen FROM productos'); // Asegúrate de que esta consulta sea correcta

        // Devuelve los productos en formato JSON
        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        
        // Responde con un estado 500 en caso de error
        res.status(500).send('Error al obtener productos');
    }
};

// Procesar el pago antes de guardar la cita o producto
const procesarPagoYGuardar = async (req, res) => {
    const { productoId, metodo_pago } = req.body; // Se asume que el método de pago viene en el cuerpo de la solicitud

    // Verificar el método de pago y procesarlo antes de guardar la cita
    let pagoExitoso = false;
    try {
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

        res.status(200).json({ message: 'Pago procesado con éxito' });
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        res.status(500).send('Error al procesar el pago.');
    }
};

module.exports = {
    getProducts,
    procesarPagoYGuardar // Asegúrate de que esta línea esté presente para exportar la nueva función
};
