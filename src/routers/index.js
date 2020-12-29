const userRouter = require('./user');
const commentRouter = require('./comment');
const subtaskRouter = require('./subtask');
const userRoomRouter = require('./userinroom');
const taskRouter = require('./task');
const stageRouter = require('./stage');
const roomRouter = require('./room');
const testRouter = require('./test');
const groupRouter = require('./group');

const authenRouter = require('./authen');

function route(app) {
  app.use('/user', userRouter);
  app.use('/room', roomRouter);
  app.use('/comment', commentRouter);
  app.use('/subtask', subtaskRouter);
  app.use('/userinroom', userRoomRouter);
  app.use('/task', taskRouter);
  app.use('/stage', stageRouter);
  app.use('/group', groupRouter);
  app.use('/authen', authenRouter);
  app.use('/test', testRouter);
}

module.exports = route;
