const { check } = require('express-validator');

module.exports = {
  parseTitle: check('title')
    .trim()
    .isLength({ min: 1, max: 250 })
    .withMessage('Title must be between 1 and 250 characters'),
  parseYear: check('year')
    .trim()
    .toFloat()
    .isFloat({ min: 1878 })
    .withMessage('Year must be a 4-digit number'),
  parseRuntime: check('runTime')
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage('Run time must be in minutes'),
};
