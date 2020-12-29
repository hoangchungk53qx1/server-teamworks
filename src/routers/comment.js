const express = require('express');
const router = express.Router();

const commentRouter = require('../app/controllers/CommentController');
const { validate } = require('../app/validate/UserValidate');

router.get('/query', commentRouter.query);
router.post('/add', commentRouter.create);
router.post('/delete', commentRouter.delete);
router.post('/update', commentRouter.update);
router.get('/', commentRouter.queryAll);

module.exports = router;
