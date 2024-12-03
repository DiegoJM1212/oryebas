require('dotenv').config();  // Carga las variables de entorno desde el archivo .env

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

// Reemplaza la clave API y el dominio con las variables de entorno
const mg = mailgun.client({ 
    username: 'api', 
    key: process.env.MAILGUN_API_KEY 
});
const domain = process.env.MAILGUN_DOMAIN; // Obtiene el dominio desde las variables de entorno

// Función para enviar notificación de cambio de contraseña
const sendPasswordChangeNotification = (recipientEmail) => {
    return mg.messages.create(domain, {
        from: `Soporte <mailgun@${domain}>`,
        to: [recipientEmail],
        subject: "Notificación de Cambio de Contraseña",
        text: "Su contraseña ha sido cambiada exitosamente.",
        html: "<h1>Su contraseña ha sido cambiada exitosamente.</h1>"
    })
    .then(msg => console.log("Notificación de cambio de contraseña enviada:", msg))
    .catch(err => console.log("Error al enviar notificación de cambio de contraseña:", err));
};

// Función para enviar código de verificación
const sendVerificationCode = (recipientEmail, verificationCode) => {
    return mg.messages.create(domain, {
        from: `Verificación <mailgun@${domain}>`,
        to: [recipientEmail],
        subject: "Código de Verificación",
        text: `Su código de verificación es: ${verificationCode}`,
        html: `<h1>Su código de verificación es: <strong>${verificationCode}</strong></h1>`
    })
    .then(msg => console.log("Código de verificación enviado:", msg))
    .catch(err => console.log("Error al enviar código de verificación:", err));
};

// Exporta las funciones para poder usarlas en otros archivos
module.exports = {
    sendPasswordChangeNotification,
    sendVerificationCode
};

