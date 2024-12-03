// controllers/contactoController.js
const db = require('../data/db'); // Asegúrate de que la conexión a la base de datos esté configurada

exports.enviarContacto = (req, res) => {
    const { nombre, telefono, comentario } = req.body;

    // Aquí se puede agregar la lógica para insertar el contacto en la base de datos
    const query = `INSERT INTO contactos (nombre, telefono, comentario) VALUES (@nombre, @telefono, @comentario)`;

    db.request()
        .input('nombre', db.NVarChar, nombre)
        .input('telefono', db.NVarChar, telefono)
        .input('comentario', db.NVarChar, comentario)
        .query(query)
        .then(result => {
            res.status(200).json({ message: 'Contacto enviado exitosamente.' });
        })
        .catch(error => {
            console.error('Error al enviar el contacto:', error);
            res.status(500).json({ message: 'Error al enviar el contacto.' });
        });
};
