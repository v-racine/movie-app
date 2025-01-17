const { check } = require('express-validator');

module.exports = {
  parseTitle: check('title')
    .trim()
    .isLength({ min: 1, max: 250 })
    .withMessage('Movie title must be between 1 and 250 characters'),
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
  parseReviewer: check('reviewer')
    .trim()
    .isLength({ min: 1, max: 250 })
    .withMessage("Reviewer's name must be between 1 and 250 characters"),
  parseGrade: check('grade').trim().isLength({ min: 1, max: 2 }).withMessage('Invalid grade'),
  parseComments: check('comments').trim(),
  parseUsername: check('username')
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage('Movie title must be between 1 and 250 characters'),
  parseEmail: check('email').trim().normalizeEmail().isEmail().withMessage('Must be a valid email'),
  parsePassword: check('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
  parsePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
};
