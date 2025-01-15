const { query } = require('express-validator');

module.exports = {
  parseTitleQuery: query('title')
    .optional()
    .trim()
    .isLength({ max: 250 })
    .withMessage('Movie title must be between 1 and 250 characters'),
  parseYearQuery: query('year')
    .optional()
    .trim()
    .toFloat()
    .isFloat({ min: 1878 })
    .withMessage('Year must be a 4-digit number'),
  parseRuntimeQuery: query('runTime')
    .optional()
    .trim()
    .toFloat()
    .isFloat({ max: 9999 })
    .withMessage('Run time must be in minutes'),
};
