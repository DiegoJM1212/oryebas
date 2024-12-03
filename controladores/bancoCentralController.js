// controllers/bancoCentralController.js

const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const API5_URL = process.env.API5_URL;
// Variables de la API del Banco Central
const BCCR_ENDPOINT = 'https://gee.bccr.fi.cr/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx';
const EMAIL = 'diego.jimenez.monge@hotmail.com';
const TOKEN = 'OO41MNEIMI';

// Función para obtener el tipo de cambio
async function getExchangeRate(req, res) {
    const xmlData = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> 
        <soap:Body>
            <ObtenerIndicadoresEconomicosXML xmlns="http://ws.sdde.bccr.fi.cr">
                <Indicador>317</Indicador>
                <FechaInicio>13/11/2024</FechaInicio>
                <FechaFinal>13/11/2024</FechaFinal>
                <Nombre>Mi Nombre</Nombre>
                <SubNiveles>N</SubNiveles>
                <CorreoElectronico>${EMAIL}</CorreoElectronico>
                <Token>${TOKEN}</Token>
            </ObtenerIndicadoresEconomicosXML>
        </soap:Body>
    </soap:Envelope>`;

    try {
        const response = await axios.post(BCCR_ENDPOINT, xmlData, {
            headers: {
                'Content-Type': 'text/xml',
                'SOAPAction': 'http://ws.sdde.bccr.fi.cr/ObtenerIndicadoresEconomicosXML'
            }
        });

        // Parsear la respuesta XML
        const parser = new XMLParser();
        const jsonResponse = parser.parse(response.data);

        const body = jsonResponse['soap:Envelope']?.['soap:Body'];
        
        if (body?.['soap:Fault']) {
            const faultString = body['soap:Fault']['faultstring'];
            console.error('Error en la solicitud SOAP:', faultString);
            return res.status(500).json({ error: 'Error en la solicitud SOAP' });
        }

        // Obtener el tipo de cambio de la respuesta
        const resultado = body?.['ObtenerIndicadoresEconomicosXMLResponse']?.['ObtenerIndicadoresEconomicosXMLResult'];
        
        if (resultado) {
            return res.json({ tipoDeCambio: resultado });
        } else {
            console.error('No se encontró el resultado esperado en la respuesta.');
            return res.status(404).json({ error: 'No se encontró el tipo de cambio' });
        }
    } catch (error) {
        console.error('Error al obtener el tipo de cambio:', error.message || error);
        return res.status(500).json({ error: 'Error al obtener el tipo de cambio' });
    }
}

module.exports = { getExchangeRate };
