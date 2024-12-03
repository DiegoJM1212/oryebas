const { poolPromise } = require('../data/db');
const pagoConTarjeta = require('../controladores/tarjetasController');
const pagoConPayPal = require('../controladores/paypal');

// Controlador para obtener los medicamentos desde la base de datos
const obtenerMedicamentos = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query("SELECT id, nombre, precio, descripcion FROM articulos WHERE categoria = 'medicamentos'");

        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener los medicamentos:', error);
        res.status(500).send('Error al obtener los medicamentos');
    }
};

// Procesar el pago antes de guardar la compra de medicamento
const procesarPagoYGuardarMedicamento = async (req, res) => {
    const { medicamentoId, metodo_pago } = req.body;  // Asegurarse que el campo es 'medicamentoId'

    console.log('Datos del pago:', req.body);  // Para depuración

    let pagoExitoso = false;
    try {
        // Verificar el método de pago y procesarlo
        if (metodo_pago === 'tarjeta') {
            pagoExitoso = await pagoConTarjeta.procesarPago(req.body);
        } else if (metodo_pago === 'paypal') {
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
        const query = 'INSERT INTO compras (medicamento_id, metodo_pago) VALUES (@medicamentoId, @metodoPago)';
        await pool.request()
            .input('medicamentoId', medicamentoId)
            .input('metodoPago', metodo_pago)
            .query(query);

        res.status(200).json({ message: 'Pago procesado con éxito y compra registrada' });
    } catch (error) {
        console.error('Error al procesar el pago o guardar la compra:', error);
        res.status(500).send('Error al procesar el pago o guardar la compra.');
    }
};

module.exports = {
    obtenerMedicamentos,
    procesarPagoYGuardarMedicamento
};
