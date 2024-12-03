const { poolPromise } = require('../data/db'); // Conexión a la base de datos
const pagoConTarjeta = require('../controladores/tarjetasController'); // Controlador de pagos con tarjeta
const pagoConPayPal = require('../controladores/paypal'); // Controlador de pagos con PayPal

// Obtener todos los productos
const getProducts = async (req, res) => {
    try {
        const pool = await poolPromise; // Espera la promesa de la conexión a la base de datos
        const result = await pool.request()
            .query('SELECT id, categoria, nombre, precio, descripcion FROM productos'); // Consulta de productos

        // Renderiza la vista, pasando los productos
        res.render('tienda', { productos: result.recordset });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener productos');
    }
};

// Procesar la compra de productos
const comprarProductos = async (req, res) => {
    const { productos, metodo_pago, total, usuario_id } = req.body; // Datos enviados desde el cliente

    try {
        // Validar los productos seleccionados y el método de pago
        if (!productos || !productos.length || !metodo_pago) {
            return res.status(400).send('Datos incompletos para procesar la compra');
        }

        // Procesar el pago
        let pagoExitoso = false;
        if (metodo_pago === 'tarjeta') {
            pagoExitoso = await pagoConTarjeta.procesarPago(req.body);
        } else if (metodo_pago === 'paypal') {
            pagoExitoso = await pagoConPayPal.procesarPago(req.body);
        }

        if (!pagoExitoso) {
            return res.status(400).send('Error al procesar el pago.');
        }

        // Registrar la compra en la base de datos
        const pool = await poolPromise;
        const request = pool.request();
        for (const producto of productos) {
            await request
                .input('producto_id', sql.Int, producto.id)
                .input('usuario_id', sql.Int, usuario_id)
                .input('cantidad', sql.Int, producto.cantidad)
                .input('precio', sql.Decimal(10, 2), producto.precio)
                .query(`
                    INSERT INTO compras (producto_id, usuario_id, cantidad, precio) 
                    VALUES (@producto_id, @usuario_id, @cantidad, @precio)
                `);
        }

        // Responder con éxito
        res.status(201).send('Compra procesada con éxito');
    } catch (error) {
        console.error('Error al procesar la compra:', error);
        res.status(500).send('Error al procesar la compra');
    }
};

module.exports = {
    getProducts,
    comprarProductos,
};
