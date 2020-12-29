const express = require('express');
const router = express.Router();

const userRouter = require('../app/controllers/UserController');
const { validate } = require('../app/validate/UserValidate');
const path = require('path');
const multer = require("multer");

var storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
var upload = multer({ storage: storage })

router.get('/query/:id', userRouter.query);
router.get('/query/avatar/:id', userRouter.getAvatar);
router.post('/add', userRouter.create);
router.post('/update/password/:id', userRouter.changePassword);
router.post('/update/avatar/:id', upload.single("image"), userRouter.changeAvatar);
router.post('/update/:id', upload.single("image"), userRouter.update);
router.get('/', userRouter.queryAll);

// router.use('/update', validate.validateUpdate(), userRouter.update);

// router.get('/query', userRouter.query);
// router.post('/create', validate.validateRegisterUser(), userRouter.create);

module.exports = router;
