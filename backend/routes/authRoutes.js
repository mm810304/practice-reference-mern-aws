const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

const { 
  userRegistrationValidation, 
  userLoginValidation, 
  forgotPasswordValidator, 
  resetPasswordValidator 
} = require('../validators/authValidator');

const { runValidation } = require('../validators/validator');


router.post('/register', userRegistrationValidation, runValidation, authController.register);

router.post('/register/activate', authController.activateRegistration);

router.post('/login', userLoginValidation, runValidation, authController.login);

router.put('/forgot-password', forgotPasswordValidator, runValidation, authController.forgotPassword);
router.put('/reset-password', resetPasswordValidator, runValidation, authController.resetPassword);

module.exports = router;