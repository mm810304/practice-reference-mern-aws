const { check } = require('express-validator');

const userRegistrationValidation = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Name is required.'),
  check('email')
    .isEmail()
    .withMessage('Must be a valid email address'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  check('categories')
    .isLength({ min: 1 })
    .withMessage('Please pick at least one category.'),
];

const userLoginValidation = [
  check('email')
    .isEmail()
    .withMessage('Must be a valid email address'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
];

const forgotPasswordValidator = [
  check('email')
    .isEmail()
    .withMessage('Must be a valid email address'),
];

const resetPasswordValidator = [
  check('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  check('resetPasswordLink')
    .not()
    .isEmpty()
    .withMessage('Token is required.')
];

const userUpdateValidator = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Name is required.'),
];



exports.userRegistrationValidation = userRegistrationValidation;
exports.userLoginValidation = userLoginValidation;
exports.forgotPasswordValidator = forgotPasswordValidator;
exports.resetPasswordValidator = resetPasswordValidator
exports.userUpdateValidator = userUpdateValidator;