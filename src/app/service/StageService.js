const Room = require('../models/Room');
const stageModel = require('../models/Stage');
const taskModel = require('../models/Task');

const taskService = require('./TaskService')
const roomService = require('./RoomService')
const _ = require('../utils/ArrayUtils')

const attachmentService = require('./AttachmentService')
const commentService = require('./CommentService')
const subtaskModel = require('../models/Subtask')
class StageService {
  async queryAll() {
    return await stageModel
      .find({})
      .exec()
      .then((stages) => {
        if (stages == null) {
          throw new Error(`query error`);
        }

        return stages;
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  async query(id) {
    return await stageModel
      .findById(id)
      .exec()
      .then((stage) => {
        if (stage == null) {
          throw new Error(`invalid stage`);
        }

        return stage;
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  async create(name, idRoom) {
    let stage = new stageModel();
    stage.name = name;
    stage.idRoom = idRoom;
    try {
      let result = await stage.save();

      return result;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async changeNameStage(idStage, newName) {
    return await stageModel.findByIdAndUpdate(idStage, { name: newName }, { new: true })
      .then(async (stage) => {
        if (stage == null) {
          throw new Error(`invalid stage`);
        }

        await roomService.updateStageInRoom(stage.idRoom, stage)

        return stage
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  async addTaskInStage(id, task) {
    return await stageModel
      .findById(id)
      .exec()
      .then(async (stage) => {
        if (stage == null) {
          throw new Error(`invalid stage`);
        }

        try {
          stage.tasks.push(task);

          let result = await stage.save();
          await roomService.updateStageInRoom(result.idRoom, result)

          return result;
        } catch (err) {
          throw new Error(err.message);
        }
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  async deleteTaskInStage(id, idTask) {
    return await stageModel
      .findById(id)
      .exec()
      .then(async (stage) => {
        if (stage == null) {
          throw new Error(`invalid stage`);
        }

        return await taskModel.findByIdAndDelete(idTask)
          .exec()
          .then(async (task) => {
            if (task == null) {
              throw new Error(`invalid task`)
            }

            // delete child data
            let subtasks = task.subtasks
            let comments = task.comments
            let attachments = task.attachments

            if (comments) {
              await Promise.all(
                comments
                  .map(it => it._id)
                  .map(commentService.delete)
              )
            }

            if (attachments) {
              await Promise.all(
                attachments
                  .map(it => it._id)
                  .map(attachmentService.delete)
              )
            }

            if (subtasks) {
              await subtaskModel.deleteMany({ idTask: task._id })
            }

            return task

          })

          // return await taskService.deleteTask(idTask)
          .then(async (task) => {
            if (task == null) {
              throw new Error(`invalid task`);
            }

            try {
              stage.tasks.removeWithId(idTask);

              let result = await stage.save();
              await roomService.updateStageInRoom(result.idRoom, result)

              return result;
            } catch (err) {
              throw new Error(err.message);
            }
          });
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  async moveTaskToStage(idStageFrom, idStageTo, idTask) {
    let ids = [idStageFrom, idStageTo]
    return await stageModel.find({ '_id': { $in: ids } })
      .exec()
      .then(async (stages) => {
        if (stages == null || stages.length <= 1) {
          throw new Error(`invalid stage`)
        }
        let stageFrom = stages[1]
        let stageTo = stages[0]

        console.log(`idTask = ${idTask}`)
        let tasks = stageFrom.tasks.filter(item => {
          console.log(`task = ${item._id}`)
          return item._id.equals(idTask) == true
        } )

        console.log(`idTask = ${tasks.length}`)

        if (tasks && tasks.length > 0) {
          let taskMove = tasks[0]

          try {

            stageFrom.tasks.removeWith(taskMove)
            stageTo.tasks.push(taskMove)

            await stageFrom.save()
            await stageTo.save()

            await roomService.updateStageInRoom(stageFrom.idRoom, stageFrom);
            await roomService.updateStageInRoom(stageTo.idRoom, stageTo);

            return true
          } catch (error) {
            throw new Error(error.message)
          }
        }

        throw new Error(`invalid task`);
      }).catch((err) => {
        throw new Error(err.message);
      })
  }


  async updateTaskInStage(id, taskUpdate) {
    return await stageModel
      .findById(id)
      .exec()
      .then(async (stage) => {
        if (stage == null) {
          throw new Error(`invalid stage`);
        }

        try {
          stage.tasks.replaceItemWithValue(taskUpdate);

          let result = await stage.save();

          await roomService.updateStageInRoom(result.idRoom, result);

          return result;
        } catch (err) {
          throw new Error(err.message);
        }
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }
  async deleteStage(idStage) {
    //  try {
    return await stageModel.findByIdAndDelete(idStage)
      .exec()
      .then(async (stage) => {
        if (stage == null) {
          throw new Error(`invalid stage`)
        }

        let tasks = stage.tasks

        if (tasks) {
          console.log(">>> TASK OK")
          await Promise.all(
            tasks
              .map(it => it._id)
              .map(id => taskService.deleteTask(id))
          )
        }
        await roomService.updateStageInRoom(stage.idRoom, stage)
        return stage
      })
      .catch((err) => {
        throw new Error(err.message)
      })

  }
}

module.exports = new StageService;
