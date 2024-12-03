const axios = require('axios');

// URL de la API externa de tarjetas
const AP4_URL = process.env.API4_URL;// URL de la API de pagos con tarjeta

// Obtener el saldo de una tarjeta
const obtenerSaldo = async (req, res) => {
  const { numeroTarjeta } = req.params;

  try {
    const response = await axios.get(`${apiUrl}/tarjeta/${numeroTarjeta}`);
    res.json(response.data);  // Devuelve el saldo de la tarjeta
  } catch (error) {
    console.error('Error al obtener el saldo:', error);
    res.status(500).json({ message: 'Error al obtener el saldo' });
  }
};

// Realizar un pago con la tarjeta
const realizarPago = async (req, res) => {
  const { numeroTarjeta, monto } = req.body;

  // Verificar si los datos necesarios están presentes
  if (!numeroTarjeta || !monto) {
    return res.status(400).json({ message: 'Faltan datos necesarios (numeroTarjeta, monto)' });
  }

  try {
    // Realizamos la llamada a la API de pago
    const response = await axios.post(`${apiUrl}/pago`, {
      numeroTarjeta,
      monto
    });

    // Aquí ya estamos manejando la respuesta de la API correctamente
    // Ya no verificamos `status`, sino directamente el mensaje de la respuesta
    if (response.data.message === 'Pago procesado correctamente') {
      // Responder con éxito
      res.json({ message: 'Pago realizado correctamente', status: 'success' });
    } else {
      // Si no fue exitoso, devolver un error
      res.status(400).json({ message: 'Error al procesar el pago', status: 'failure' });
    }
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    res.status(500).json({ message: 'Error al procesar el pago' });
  }
};

module.exports = { obtenerSaldo, realizarPago };
