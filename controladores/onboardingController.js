const COOKIE_OPTIONS = {
  maxAge: 365 * 24 * 60 * 60 * 1000, // 1 año
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
  sameSite: 'strict'
};

// Middleware para verificar si el usuario ha completado el onboarding
const checkOnboarding = (req, res, next) => {
  try {
    if (req.cookies.onboardingSeen) {
      // Si ya ha visto el onboarding, redirige al login
      return res.redirect('/login');  // Aquí redirige a la ruta de login
    } else {
      // Si no ha visto el onboarding, redirige al onboarding
      return res.redirect('/onboarding');  // Aquí redirige a la ruta de onboarding
    }
  } catch (error) {
    console.error('Error en checkOnboarding:', error);
    res.status(500).send('Error interno del servidor');
  }
};

// Renderiza la página de onboarding
const showOnboarding = (req, res) => {
  res.render('onboarding');  // Aquí se muestra la vista de onboarding
};

// Marca el onboarding como completado y redirige al login
const finishOnboarding = (req, res) => {
  try {
    // Marca el onboarding como completado guardando una cookie
    res.cookie('onboardingSeen', 'true', COOKIE_OPTIONS);
    // Redirige a la ruta donde está el login
    res.redirect('/');  // Redirige a la ruta raíz que es donde se sirve 'login.html'
  } catch (error) {
    console.error('Error al finalizar el onboarding:', error);
    res.status(500).send('Error al finalizar el onboarding');
  }
};

module.exports = { checkOnboarding, showOnboarding, finishOnboarding };


