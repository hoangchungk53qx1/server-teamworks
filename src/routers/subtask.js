const express = require('express');
const router = express.Router();

const subtaskRouter = require('../app/controllers/SubtaskViewController');
const { validate } = require('../app/validate/UserValidate');

router.post('/add', subtaskRouter.create);
router.post('/update/:id', subtaskRouter.update)

module.exports = router;
