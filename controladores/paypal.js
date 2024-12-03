const axios = require('axios');
require('dotenv').config(); // Carga las variables del archivo .env

// Credenciales de PayPal desde las variables de entorno
const clientId = process.env.PAYPAL_CLIENT_ID;
const secret = process.env.PAYPAL_SECRET;

// URL de la API1 desde la variable de entorno
const API1_URL = process.env.API1_URL; 

// Función para obtener el token de acceso de PayPal
const getAccessToken = async () => {
    const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
    try {
        const response = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', 'grant_type=client_credentials', {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error obteniendo el token de acceso:', error);
        throw error;
    }
};

// Función para crear un pago
const createPayment = async (totalAmount) => {
    try {
        const accessToken = await getAccessToken();

        const paymentData = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            transactions: [
                {
                    amount: {
                        total: totalAmount,
                        currency: 'USD',
                    },
                    description: 'Compra de prueba en PayPal',
                },
            ],
            redirect_urls: {
                return_url: 'http://localhost:3000/inicio', // URL de éxito
                cancel_url: 'http://localhost:3000/inicio', // URL de cancelación
            },
        };

        const response = await axios.post('https://api-m.sandbox.paypal.com/v1/payments/payment', paymentData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        // Encuentra la URL de aprobación y devuélvela
        const approvalUrl = response.data.links.find((link) => link.rel === 'approval_url').href;

        // Aquí puedes hacer una llamada adicional a API1 para registrar el pago si es necesario
        if (API1_URL) {
            try {
                await axios.post(`${API1_URL}/registro-pago`, {
                    paymentId: response.data.id,
                    amount: totalAmount,
                });
                console.log('Pago registrado correctamente en API1');
            } catch (error) {
                console.error('Error registrando el pago en API1:', error.message);
            }
        }

        return approvalUrl;
    } catch (error) {
        console.error('Error creando el pago:', error);
        throw error;
    }
};

// Función para ejecutar el pago después de la aprobación del cliente
const executePayment = async (paymentId, payerId) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios.post(`https://api-m.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`, {
            payer_id: payerId,
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Pago ejecutado exitosamente:', response.data);

        // Aquí puedes hacer una llamada a API1 para registrar la ejecución del pago si es necesario
        if (API1_URL) {
            try {
                await axios.post(`${API1_URL}/pago-ejecutado`, {
                    paymentId: response.data.id,
                    status: response.data.state,
                });
                console.log('Ejecución de pago registrada correctamente en API1');
            } catch (error) {
                console.error('Error registrando la ejecución del pago en API1:', error.message);
            }
        }

        return response.data;
    } catch (error) {
        console.error('Error ejecutando el pago:', error);
        throw error;
    }
};

// Controlador para la creación del pago (llama a createPayment)
const crearPagoPaypal = async (req, res) => {
    const { monto } = req.body;

    try {
        // Crear el pago en PayPal
        const url = await createPayment(monto); // Monto que el cliente debe pagar
        res.json({ redirectUrl: url }); // Enviar la URL de redirección a la vista para el cliente
    } catch (error) {
        console.error('Error al crear el pago en PayPal:', error);
        res.status(500).json({ message: 'Error al crear el pago' });
    }
};

// Controlador para ejecutar el pago después de la aprobación del cliente (llama a executePayment)
const ejecutarPagoPaypal = async (req, res) => {
    const { paymentId, payerId } = req.body;

    try {
        // Ejecutar el pago
        const result = await executePayment(paymentId, payerId);
        res.json(result); // Responder con el resultado del pago
    } catch (error) {
        console.error('Error al ejecutar el pago en PayPal:', error);
        res.status(500).json({ message: 'Error al ejecutar el pago' });
    }
};

module.exports = { crearPagoPaypal, ejecutarPagoPaypal };

