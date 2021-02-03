const { body } = require('express-validator');

const verifyBodyLogin = [
  body('email').isEmail().withMessage('e-mail is wrong'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('must be at least 8 char long'),
];

module.exports = verifyBodyLogin;
