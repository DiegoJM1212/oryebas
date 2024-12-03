const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { poolPromise, sql } = require('../data/db');
const emailService = require('../servicios/emailService');

// Función para cifrar texto (sin cambios)
function encryptText(text) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted,
        key: key.toString('hex')
    };
}

// Función para registrar un usuario (modificada)
async function registrarUsuario(req, res) {
    let connection;
    try {
        const { nombre, username, email, birthday, password, answer1, answer2, answer3 } = req.body;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,14}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: 'La contraseña debe contener mayúsculas, minúsculas, caracteres especiales y números.' });
        }

        connection = await poolPromise;

        // Verificar si el username ya existe
        const usernameCheck = await connection.request()
            .input('username', sql.VarChar, username)
            .query('SELECT COUNT(*) as count FROM usuarios WHERE username = @username');
        
        if (usernameCheck.recordset[0].count > 0) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
        }

        // Verificar si el email ya existe
        const emailCheck = await connection.request()
            .input('email', sql.VarChar, email)
            .query('SELECT COUNT(*) as count FROM usuarios WHERE email = @email');
        
        if (emailCheck.recordset[0].count > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const encryptedAnswer1 = encryptText(answer1);
        const encryptedAnswer2 = encryptText(answer2);
        const encryptedAnswer3 = encryptText(answer3);

        const result = await connection.request()
            .input('nombre', sql.VarChar, nombre)
            .input('username', sql.VarChar, username)
            .input('email', sql.VarChar, email)
            .input('birthday', sql.Date, birthday)
            .input('password', sql.VarChar, hashedPassword)
            .input('security_answer_1', sql.VarChar, encryptedAnswer1.encryptedData)
            .input('security_answer_2', sql.VarChar, encryptedAnswer2.encryptedData)
            .input('security_answer_3', sql.VarChar, encryptedAnswer3.encryptedData)
            .query(`INSERT INTO usuarios 
                    (nombre, username, email, fecha_nacimiento, password, security_answer_1, security_answer_2, security_answer_3, verificado) 
                    VALUES (@nombre, @username, @email, @birthday, @password, @security_answer_1, @security_answer_2, @security_answer_3, 0);
                    SELECT SCOPE_IDENTITY() AS id`);

        const userId = result.recordset[0].id;
        const verificationCode = crypto.randomInt(100000, 999999).toString();
        await emailService.sendVerificationCode(email, `¡Bienvenido a KawaiPet! Tu código de verificación es: ${verificationCode}`);
        req.session.verificationCode = verificationCode;

        await connection.request()
            .input('usuario_id', sql.Int, userId)
            .input('accion', sql.VarChar, 'Registro')
            .input('descripcion', sql.Text, 'Usuario registrado correctamente')
            .input('resultado', sql.VarChar, 'Éxito')
            .query(`INSERT INTO auditoria (usuario_id, accion, descripcion, resultado) 
                    VALUES (@usuario_id, @accion, @descripcion, @resultado)`);

        return res.status(200).json({ message: 'Usuario registrado correctamente. Verifique su correo.' });
    } catch (error) {
        console.error('Error al registrar usuario:', error.message);
        return res.status(500).json({ message: 'Error al registrar el usuario. Por favor, intente nuevamente.' });
    } 
}

// Función para iniciar sesión con soporte AJAX (modificada)
async function iniciarSesion(req, res) {
    let connection;
    try {
        const { username, password } = req.body;

        connection = await poolPromise;
        const result = await connection.request()
            .input('username', sql.VarChar, username)
            .query('SELECT * FROM usuarios WHERE username = @username OR email = @username');

        if (result.recordset.length > 0) {
            const user = result.recordset[0];

            if (user.estado === 'bloqueado') {
                const tiempoBloqueo = new Date(user.tiempo_bloqueo);
                const tiempoActual = new Date();
                if (tiempoActual < tiempoBloqueo) {
                    return res.status(403).json({ message: `Usuario bloqueado. Intenta de nuevo en ${Math.ceil((tiempoBloqueo - tiempoActual) / (1000 * 60))} minutos.` });
                } else {
                    await connection.request()
                        .input('username', sql.VarChar, username)
                        .query(`UPDATE usuarios SET estado = 'habilitado', intentos_fallidos = 0, tiempo_bloqueo = NULL WHERE username = @username`);
                }
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (isPasswordMatch) {
                if (!user.verificado) {
                    return res.status(403).json({ message: 'Debes verificar tu correo antes de iniciar sesión.' });
                }

                await connection.request()
                    .input('username', sql.VarChar, username)
                    .query(`UPDATE usuarios SET intentos_fallidos = 0, estado = 'habilitado', tiempo_bloqueo = NULL WHERE username = @username`);

                const verificationCode = crypto.randomInt(100000, 999999).toString();
                await emailService.sendVerificationCode(user.email, `Tu código de verificación para iniciar sesión es: ${verificationCode}`);

                req.session.verificationCode = verificationCode;
                req.session.username = username;

                await connection.request()
                    .input('usuario_id', sql.Int, user.id)
                    .input('accion', sql.VarChar, 'Inicio de sesión')
                    .input('descripcion', sql.Text, 'Inicio de sesión exitoso')
                    .input('resultado', sql.VarChar, 'Éxito')
                    .query(`INSERT INTO auditoria (usuario_id, accion, descripcion, resultado) 
                            VALUES (@usuario_id, @accion, @descripcion, @resultado)`);

                return res.status(200).json({ twoFactorRequired: true, message: 'Código de verificación enviado a tu correo' });
            } else {
                const intentosFallidos = user.intentos_fallidos + 1;
                let tiempoBloqueo = null;
                let nuevoEstado = 'habilitado';

                if (intentosFallidos >= 3) {
                    tiempoBloqueo = new Date(Date.now() + 5 * 60 * 1000);
                    nuevoEstado = 'bloqueado';
                }

                await connection.request()
                    .input('username', sql.VarChar, username)
                    .input('intentos_fallidos', sql.Int, intentosFallidos)
                    .input('estado', sql.VarChar, nuevoEstado)
                    .input('tiempo_bloqueo', sql.DateTime, tiempoBloqueo)
                    .query(`UPDATE usuarios SET intentos_fallidos = @intentos_fallidos, estado = @estado, tiempo_bloqueo = @tiempo_bloqueo WHERE username = @username`);

                await connection.request()
                    .input('usuario_id', sql.Int, user.id)
                    .input('accion', sql.VarChar, 'Inicio de sesión')
                    .input('descripcion', sql.Text, 'Intento de inicio de sesión fallido')
                    .input('resultado', sql.VarChar, 'Fallo')
                    .query(`INSERT INTO auditoria (usuario_id, accion, descripcion, resultado) 
                            VALUES (@usuario_id, @accion, @descripcion, @resultado)`);

                return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
            }
        } else {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        return res.status(500).json({ message: 'Error al iniciar sesión. Por favor, intente nuevamente.' });
    } 
}

// Función para verificar el código de verificación (sin cambios)
async function verificarCodigo(req, res) {
    try {
        const { verificationCode } = req.body;

        if (req.session.verificationCode && req.session.verificationCode === verificationCode) {
            req.session.isAuthenticated = true;
            req.session.verificationCode = null;

            return res.status(200).json({ message: 'Verificación exitosa' });
        } else {
            return res.status(401).json({ message: 'Código de verificación incorrecto' });
        }
    } catch (error) {
        console.error('Error al verificar el código:', error.message);
        return res.status(500).json({ message: 'Error al verificar el código' });
    }
}

module.exports = {
    registrarUsuario,
    iniciarSesion,
    verificarCodigo
};

