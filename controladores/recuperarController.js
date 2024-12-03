const bcrypt = require('bcrypt');
const { poolPromise, sql } = require('../data/db'); // Asegúrate de que esta ruta sea correcta
const { sendPasswordChangeNotification } = require('../servicios/emailService'); // Función de notificación de cambio de contraseña
const crypto = require('crypto');

// Función para verificar las respuestas de seguridad
const verifySecurityAnswers = (user, answers) => {
    const decryptedAnswers = [
        decryptAnswer(user.security_answer_1),
        decryptAnswer(user.security_answer_2),
        decryptAnswer(user.security_answer_3)
    ];

    return decryptedAnswers.every((decryptedAnswer, index) => {
        return decryptedAnswer === answers[index];
    });
};

// Función para descifrar una respuesta
const decryptAnswer = (encryptedAnswer) => {
    const key = crypto.createSecretKey(Buffer.from('primerintento', 'utf-8')); // Cambia según tu clave
    const iv = Buffer.from('intentoprimero', 'utf-8'); // Cambia según tu IV

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    let decrypted = decipher.update(encryptedAnswer, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
};

// Controlador de recuperación de contraseña
const recoveryController = async (req, res) => {
    const { userEmail, securityAnswers, newPassword } = req.body;

    let connection;
    try {
        // Conectar a la base de datos
        connection = await poolPromise;

        // Buscar usuario solo por nombre de usuario
        const result = await connection.request()
            .input('username', sql.VarChar, userEmail) // Se busca solo por nombre de usuario
            .query('SELECT * FROM usuarios WHERE username = @username');

        if (result.recordset.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        const user = result.recordset[0];

        // Verificar respuestas de seguridad
        if (!securityAnswers || securityAnswers.length !== 3) {
            return res.status(400).send('Por favor, proporciona todas las respuestas de seguridad.');
        }

        if (!verifySecurityAnswers(user, securityAnswers)) {
            return res.status(403).send('Respuestas de seguridad incorrectas');
        }

        // Actualizar la contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10); // Hashear la nueva contraseña
        await connection.request()
            .input('password', sql.VarChar, hashedPassword) // Usar la nueva contraseña hasheada
            .input('username', sql.VarChar, user.username) // Usar el nombre de usuario para actualizar
            .query('UPDATE usuarios SET password = @password WHERE username = @username');

        // Enviar notificación de cambio de contraseña
        await sendPasswordChangeNotification(user.username); // O envía la notificación al correo si así lo prefieres

        // Redirigir a la página de inicio de sesión después de cambiar la contraseña
        return res.redirect('/'); // Redirige a la raíz, donde está login.html
    } catch (error) {
        console.error('Error en la recuperación de contraseña:', error);
        return res.status(500).send('Error en el servidor');
    } finally {
        if (connection) {
            connection.close(); // Asegúrate de cerrar la conexión
        }
    }
};

module.exports = { recuperarContrasena: recoveryController };
