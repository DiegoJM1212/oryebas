const sql = require('mssql');

// Configuración de la base de datos (con Azure SQL)
const config = {
    user: 'diego', // Usuario de SQL en Azure
    password: 'Paramore.1997', // Asegúrate de poner la contraseña correcta
    server: 'diegojm.database.windows.net', // Nombre del servidor de Azure SQL
    database: 'kawaipet', // Nombre de la base de datos en Azure
    options: {
        encrypt: true, // Habilita la encriptación para la conexión segura
        trustServerCertificate: false, // No confiar en certificados no firmados
        connectionTimeout: 30000, // 30 segundos para la conexión
        requestTimeout: 30000 // 30 segundos para las consultas
    }
};

// Conectar a la base de datos
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conexión a la base de datos de Azure establecida');
        return pool;
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err.message);
    });

// Probar la conexión con una consulta simple
poolPromise.then(pool => {
    return pool.request().query('SELECT 1 AS Test') // Consulta de prueba
}).then(result => {
    console.log('Consulta exitosa:', result.recordset);
}).catch(err => {
    console.error('Error en la consulta:', err.message);
});

// Función para cerrar la conexión cuando ya no se necesita
const closeConnection = async () => {
    const pool = await poolPromise;
    await pool.close();
    console.log('Conexión cerrada');
};

// Exportar la conexión para usarla en otras partes del código
module.exports = {
    poolPromise,
    sql,
    closeConnection
};
