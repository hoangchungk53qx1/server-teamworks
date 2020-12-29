const express = require('express');
const router = express.Router();

const userRouter = require('../app/controllers/UserController');
const { validate } = require('../app/validate/UserValidate');

router.use('/query', userRouter.query);
router.use('/create', validate.validateRegisterUser(), userRouter.create);
router.use('/login', validate.validateLogin(), userRouter.login);
router.use('/update', validate.validateUpdate(), userRouter.update);


// router.use('/update', validate.validateUpdate(), userRouter.update);

// router.get('/query', userRouter.query);
// router.post('/create', validate.validateRegisterUser(), userRouter.create);

module.exports = router;
