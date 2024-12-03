const express = require('express');
const path = require('path');
const session = require('express-session'); // Importa express-session
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/loginroutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const citaEsteticaRoutes = require('./routes/citaEsteticaRoutes');
const medicamentoRoutes = require('./routes/medicamentoRoute'); // Ruta de medicamentos
const accesorioRoutes = require('./routes/juguetesRoutes'); // Ruta de accesorios
const alimentoRoutes = require('./routes/alimentoRoutes'); // Ruta de alimentos
const contactoRoutes = require('./routes/contactoRoutes'); // Ruta de contacto
const seguimientoRoutes = require('./routes/mascotaRoutes'); // Ruta de seguimiento
// const veterinariaRoutes = require('./routes/mascotaRoutes'); // Ruta de veterinaria
const productosRoutes = require('./routes/productosRoutes'); // Ruta de productos
const reservasHotelRoutes = require('./routes/reservasHotel'); // Ruta de reservas de hotel
const storeRoutes = require('./routes/storeRoutes'); // Ruta de tienda
const usuariosRoutes = require('./routes/usuariosRoutes'); // Ruta de recuperación de contraseña
const auditoriaRoutes = require('./routes/auditoriaRoutes'); // Ruta de auditoría

const citasApiRoutes = require('./routes/citasApiRoutes'); // Ruta de la API de citas
const citaEsteticaApiRoutes = require('./routes/citaEsteticaApiRoutes'); // Ruta de la API de cita estética
const reservasRoutes = require('./routes/reservasapiRoutes');  // Asegúrate de la ruta correcta

const mascotasRoutes = require('./routes/mascotasapiRoutes'); // Ajusta la ruta de acuerdo con tu estructura de carpetas

// **Aquí agregamos las rutas para la API de PayPal** (nuevo código)
const paypalRoutes = require('./routes/paypalroute'); // Ruta de la API de PayPal

// **Aquí agregamos las rutas para la API de tarjetas** (nuevo código)
const tarjetasApiRoutes = require('./routes/tarjetasRoutes'); // Ruta de la API de tarjetas

const bancoCentralRoutes = require('./routes/bancoCentralRoutes');  // Importa las rutas del Banco Central

const veterinariosRoutes = require('./routes/veterinariosRoutes'); // Importa la ruta de veterinarios

const segurosRoutes = require('./routes/segurosRoutes');

const registroCivilRoutes = require('./routes/registroCivil');
const onboardingRoutes = require('./routes/onboardingRoutes');

const db = require('./data/db'); // Conexión a la base de datos

const app = express();
const PORT = process.env.PORT || 10000;

// ** Aquí agregamos CORS ** 
const cors = require('cors');  // Importa CORS
app.use(cors());  // Activa CORS para todas las rutas

app.use(cookieParser()); 


// Middleware para procesar JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones
app.use(session({
    secret: '2e9b4b7f9ea46bcce20219783919c25446f685762eeeb02f9c1107b7c249be7e', // Cambia esto por tu clave secreta
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambia a true si usas HTTPS
}));

// Servir archivos estáticos desde la carpeta 'html', 'css' y la raíz del proyecto
app.use('/css', express.static(path.join(__dirname, 'css'))); // Asegúrate de que esta línea sea correcta
app.use(express.static(path.join(__dirname, 'html'))); // Esta línea servirá archivos HTML
app.use(express.static(path.join(__dirname))); // Servir archivos estáticos desde la raíz del proyecto

// Usar las rutas de usuario y citas
app.use('/usuarios', userRoutes);
app.use('/citas', appointmentRoutes);
app.use('/cita-estetica', citaEsteticaRoutes);
app.use('/medicamentos', medicamentoRoutes); // Ruta de medicamentos
app.use('/accesorios', accesorioRoutes); // Ruta de accesorios
app.use('/alimentos', alimentoRoutes); // Ruta de alimentos
app.use('/contacto', contactoRoutes); // Ruta de contacto
app.use('/seguimiento', seguimientoRoutes); // Ruta de seguimiento
// app.use('/veterinaria', veterinariaRoutes); // Ruta de veterinaria
app.use('/productos', productosRoutes); // Ruta de productos
app.use('/reservas', reservasHotelRoutes); // Ruta de reservas de hotel
app.use('/tienda', storeRoutes); // Ruta de tienda
app.use('/recuperar', usuariosRoutes); // Ruta de recuperación de contraseña
app.use('/auditoria', auditoriaRoutes); // Ruta de auditoría

// Usar la ruta de la API de citas
app.use('/api/citas', citasApiRoutes); // Nueva ruta para la API de citas
app.use('/api/cita-estetica', citaEsteticaApiRoutes); // Ruta de la API de cita estética

// Usar la ruta de la API de reservas
app.use('/api/reservarHotel', reservasRoutes);  // Esta es la ruta correcta


// Usar la ruta de la API de mascotas
app.use('/mascotas', mascotasRoutes); // Esto mantiene el controlador 'mascotasRoutes' y redirige correctamente las rutas a las APIs externas si es necesario.


// **Agregar la ruta para la API de PayPal aquí**
app.use('/paypal', paypalRoutes); // Ruta de la API de PayPal

// **Agregar la ruta para la API de tarjetas aquí**
app.use('/tarjetas', tarjetasApiRoutes); // Ruta de la API de tarjetas

app.use('/veterinarios', veterinariosRoutes);   

// Usar la ruta de la API del Banco Central
app.use('/banco-central', bancoCentralRoutes);

// Usar las rutas del registro civil
app.use('/registrocivil', registroCivilRoutes);

app.use('/seguros', segurosRoutes);

app.use('/onboarding', onboardingRoutes);

// Rutas para servir las páginas HTML
app.get('/inicio', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'inicio.html'));
});

app.get('/seguimiento', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'seguimiento.html'));
});

app.get('/reservacionhotel', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'reservacionhotel.html'));
});

app.get('/esteticareservaciones', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'esteticareservaciones.html'));
});

app.get('/contacto', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'contacto.html'));
});

app.get('/articulos', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'articulos.html'));
});

app.get('/alimentos', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'alimentos.html'));
});

app.get('/paypal', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'pagopaypal.html'));
});

app.get('/banco', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'tarjetas.html'));
});

app.get('/mascotas', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'mascotasapi.html'));
});

// Ruta para 'recuperarpass.html'
app.get('/recuperar', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'recuperarpass.html'));
});

// Ruta para la raíz (/) redirige a 'login.html'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});

// Ruta para 'onboarding.html'
app.get('/onboarding', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'onboarding.html'));
});

// Ruta para el archivo de service worker (sw.js)
app.get('/service-worker.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'service-worker.js'));
});

app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
