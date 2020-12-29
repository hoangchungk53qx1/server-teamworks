const { check, validationResult, oneOf } = require('express-validator');

let validateRegisterUser = () => {
  return [
    check('username')
      .trim()
      .isLength({ min: 6 })
      .withMessage('username more than 6 degits')
      .not()
      .isEmpty()
      .withMessage('username does not Empty'),

    check('password')
      .isLength({ min: 6 })
      .withMessage('password more than 6 degits')
      .isAlphanumeric()
      .withMessage('password must be Alphanumeric')
      .not()
      .isEmpty()
      .withMessage('password does not Empty'),

    check('mail')
      .not()
      .isEmpty()
      .withMessage('email does not Empty')
      .isEmail()
      .withMessage('Invalid email')
  ];
}

let validateLogin = () => {
  return oneOf[
    check('mail')
      .not()
      .isEmpty()
      .withMessage('email does not Empty')
      .isEmail()
      .withMessage('Invalid email'),

    check('password')
      .not()
      .equals('admin')
      .isLength({ min: 6 })
      .withMessage('password more than 6 degits')

  ], [
      check('username')
        .trim()
        .isLength({ min: 6 })
        .withMessage('username more than 6 degits')
        .not()
        .isEmpty()
        .withMessage('username does not Empty'),

      check('password')
        .isLength({ min: 6 })
        .withMessage('password more than 6 degits')
    ];
}
let validateUpdateUser = () => {
  return [
    // username
    check('username')
      .trim()
      .isLength({ min: 6 })
      .withMessage('username more than 6 degits')
      .not()
      .isEmpty()
      .withMessage('username does not Empty'),

    // password
    check('password')
      .isLength({ min: 6 })
      .withMessage('password more than 6 degits')
      .isAlphanumeric()
      .withMessage('password must be Alphanumeric')
      .not()
      .isEmpty()
      .withMessage('password does not Empty'),

    // mail
    check('mail')
      .not()
      .isEmpty()
      .withMessage('email does not Empty')
      .isEmail()
      .withMessage('Invalid email'),

    // status 
    check('status')
      .not()
      .isBoolean()
      .withMessage('wrong value'),

    // numberphone
    check('numberphone')
      .not()
      .isEmpty()
      .withMessage('numberphone does no Empty')
      .isMobilePhone()
      .withMessage('wrong numberphone')
  ]
}

let validate = {
  validateRegisterUser: validateRegisterUser,
  validateLogin: validateLogin,
  validateUpdate: validateUpdateUser
};

module.exports = { validate };