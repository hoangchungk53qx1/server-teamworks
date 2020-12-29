const express = require('express');
const router = express.Router();

const authenRouter = require('../app/controllers/AuthenController');
const { validate } = require('../app/validate/UserValidate');

router.post('/login', authenRouter.login);
router.post('/logout/:id', authenRouter.logout);

module.exports = router;
