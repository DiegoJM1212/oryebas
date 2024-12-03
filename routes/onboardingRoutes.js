const express = require('express');
const router = express.Router();
const { checkOnboarding, showOnboarding, finishOnboarding } = require('../controladores/onboardingController');

// Ruta raíz: Comprueba si el usuario ha visto el onboarding
router.get('/', checkOnboarding, (req, res) => {
  res.render('login');  // Asegúrate de que 'login' sea la vista correcta
});

// Ruta para la página de onboarding
router.get('/onboarding', showOnboarding);

// Ruta para finalizar el onboarding
router.get('/finish-onboarding', finishOnboarding);

module.exports = router;
