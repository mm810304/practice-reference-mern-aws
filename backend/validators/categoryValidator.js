const { check } = require('express-validator');

const createCategoryValidator = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Name is required.'),
  check('image')
    .not()
    .isEmpty()
    .withMessage('Image is required.'),
  check('content')
    .isLength({ min: 20 })
    .withMessage('Content must be at least 20 characters.'),
];

const updateCategoryValidator = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Name is required.'),
  check('content')
    .isLength({ min: 20 })
    .withMessage('Content must be at least 20 characters.'),
];

exports.createCategoryValidator = createCategoryValidator;
exports.updateCategoryValidator = updateCategoryValidator;