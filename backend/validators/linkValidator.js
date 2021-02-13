const { check } = require('express-validator');

const createLinkValidator = [
  check('title')
    .not()
    .isEmpty()
    .withMessage('Title is required.'),
  check('url')
    .not()
    .isEmpty()
    .withMessage('URL is required.'),
  check('categories')
    .not()
    .isEmpty()
    .withMessage('Pick a category.'),
  check('type')
    .not()
    .isEmpty()
    .withMessage('Pick a type - free or paid.'),
  check('medium')
    .not()
    .isEmpty()
    .withMessage('Pick a medium - video or book.'),
];

const updateLinkValidator = [
  check('title')
    .not()
    .isEmpty()
    .withMessage('Title is required.'),
  check('url')
    .not()
    .isEmpty()
    .withMessage('URL is required.'),
  check('categories')
    .not()
    .isEmpty()
    .withMessage('Pick a category.'),
  check('type')
    .not()
    .isEmpty()
    .withMessage('Pick a type - free or paid.'),
  check('medium')
    .not()
    .isEmpty()
    .withMessage('Pick a medium - video or book.'),
];


exports.createLinkValidator = createLinkValidator;
exports.updateLinkValidator = updateLinkValidator;