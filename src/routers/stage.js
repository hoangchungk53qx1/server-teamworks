const express = require('express');
const router = express.Router();

const stageRouter = require('../app/controllers/StageController');
// const { validate } = require('../app/validate/UserValidate');

router.get('/query', stageRouter.query);
router.post('/add/:category', stageRouter.add);
router.post('/update/movetask', stageRouter.moveTaskToStage);
router.post('/delete/:category', stageRouter.delete);
// router.use('/update', commentRouter.update);
router.get('/', stageRouter.queryAll);

module.exports = router;
