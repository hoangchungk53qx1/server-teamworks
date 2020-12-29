const taskModel = require('../models/Task');
const subtaskModel = require('../models/Subtask');

const commentService = require('./CommentService')
const subtaskService = require('./SubtaskService')
const historyService = require('./HistoryService')
const stageService = require('./StageService')
const attachmentService = require('./AttachmentService')
class TaskService {

  // constructor() {}

  async queryAll() {
    return await taskModel.find({})
      .exec()
      .then((tasks) => {
        if (tasks == null) {
          throw new Error(`query error`)
        }

        return tasks
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async query(id) {
    return await taskModel.findById(id)
      .exec()
      .then((task) => {
        if (task == null) {
          throw new Error(`query erorr`)
        }

        return task
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async create(name, idStage) {

    let task = new taskModel();
    task.name = name;
    task.idStage = idStage;

    return await task
      .save()
      .then((task) => {
        if (task == null) {
          throw new Error(`create task error`);
        }

        return task;
      })
      .catch((err) => {
        console.log(`create task error 1 ${err.message}`);
        throw new Error(err.message);
      });
  }

  async addSubtask(id, subTask, idUser) {

    return await taskModel.findById(id)
      .exec()
      .then(async (task) => {
        if (task == null) {
          throw new Error(`invalid task`)
        }

        try {
          task.subtasks.push(subTask)

          let result = await task.save()

          await historyService.taskAddSubtask(result._id, idUser, subTask.name)
          await stageService.updateTaskInStage(task.idStage, result)

          return result
        } catch (err) {
          throw new Error(err.message)
        }
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async addUser(id, userWillAdded, idUserAction) {
    return await taskModel.findById(id)
      .exec()
      .then(async (task) => {
        if (task == null) {
          throw new Error(`invalid task`)
        }

        try {
          task.users.push(userWillAdded)
          let result = await task.save()

          await historyService.taskAddMember(result._id, idUserAction, userWillAdded._id)
          await stageService.updateTaskInStage(result.idStage, result)

          return result
        } catch (err) {
          throw new Error(err.message);
        }

      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async addComment(id, comment, idUser) {

    return await taskModel.findById(id)
      .exec()
      .then(async (task) => {
        if (task == null) {
          throw new Error(`invalid task`)
        }

        try {
          task.comments.push(comment);

          let result = await task.save()

          await historyService.taskAddComment(task._id, idUser, comment.content)
          await stageService.updateTaskInStage(result.idStage, result)

          return result
        } catch (err) {
          throw new Error(err.message)
        }
      })
      .catch((err) => {
        throw new Error(err.message);
      })
  }

  async addHistory(id, history) {

    return await taskModel.findById(id)
      .exec()
      .then(async (task) => {
        if (task == null) {
          throw new Error(`invalid task`)
        }

        try {
          task.histories.push(history);

          let result = await task.save()
          await stageService.updateTaskInStage(result.idStage, result)
          return result
        } catch (err) {
          throw new Error(err.message)
        }

      })
      .catch((err) => {
        throw new Error(err.message)
      })

  }

  async addAttachment(id, attachment, idUser) {

    return await taskModel.findById(id)
      .exec()
      .then(async (task) => {
        if (task == null) {
          throw new Error(`invalid task`)
        }

        try {
          task.attachments.push(attachment);

          let result = await task.save()

          await historyService.taskAddAttachment(result._id, idUser)
          await stageService.updateTaskInStage(result.idStage, result)
          return result
        } catch (err) {

          throw new Error(err.message)
        }

      })
      .catch((err) => {

        throw new Error(err.message)
      })
  }

  async deleteSubtask(id, idSubtask, idUser) {

    return await taskModel.findById(id)
      .exec()
      .then(async (task) => {
        if (task == null) {
          throw new Error(`invalid task`)
        }

        let subtask = task.subtasks.find(subtask => subtask._id.equals(idSubtask))

        try {
          task.subtasks.removeWithId(idSubtask)
          let result = await task.save()

          await historyService.taskDeleteSubtask(result._id, idUser, subtask.name)
          await subtaskModel.findByIdAndDelete(idSubtask)
          await stageService.updateTaskInStage(result.idStage, result)


          return result
        } catch (err) {
          throw new Error(err.message)
        }
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async deleteUser(id, idUser, idUserAction) {

    return await taskModel.findById(id)
      .exec()
      .then(async (task) => {
        if (task == null) {
          throw new Error(`invalid task`)
        }
        try {
          task.users.removeWithId(idUser);
          let result = await task.save()

          await historyService.taskDeleteMember(result._id, idUserAction, idUser)
          await stageService.updateTaskInStage(result.idStage, result)

          return result
        } catch (err) {
          throw new Error(err.message)
        }

      })
      .catch((err) => {
        throw new Error(err)
      })
  }

  async deleteComment(id, idComment, idUserAction) {

    return await taskModel.findById(id)
      .exec()
      .then(async (task) => {
        if (task == null) {
          throw new Error(`invalid task`)
        }

        return await commentService.delete(idComment)
          .then(async (comment) => {
            if (comment == null) {
              throw new Error(`invalid comment`)
            }

            try {
              task.comments.removeWithId(idComment);
              let result = await task.save()

              await historyService.taskDeleteComment(id, idUserAction)
              await stageService.updateTaskInStage(result.idStage, result)

              return result
            } catch (err) {
              throw new Error(err.message)
            }
          })

      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async deleteAttachment(id, idAttachment, idUserAction) {
    return await taskModel.findById(id)
      .exec()
      .then(async (task) => {
        if (task == null) {
          throw new Error(`invalid task`)
        }

        return await attachmentService.delete(idAttachment)
          .then(async (attachment) => {
            if (attachment == null) {
              throw new Error(`invalid attachment`)
            }

            try {
              task.attachments.removeWithId(idAttachment);
              let result = await task.save()

              await historyService.deleteAttachment(id, idAttachment, idUserAction)
              await stageService.updateTaskInStage(result.idStage, result)

              return result
            } catch (err) {
              throw new Error(err.message)
            }
          })

      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async deleteHistory(id, idHistory) {

    return await taskModel.findById(id)
      .exec()
      .then(async (task) => {
        if (task == null) {
          throw new Error(`invalid task`)
        }

        return await historyService.delete(idHistory)
          .then(async (history) => {
            if (history == null) {
              throw new Error(`invalid history`)
            }

            try {
              task.histories.removeWithId(idAttachment);
              let result = await task.save()
              await stageService.updateTaskInStage(result.idStage, result)

              return result
            } catch (err) {
              throw new Error(err.message)
            }
          })

      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async deleteTask(id) {
    return await taskModel.findByIdAndDelete(id)
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

        await stageService.updateTaskInStage(task.idStage, task)

        return task

      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async renameSubtask(idTask, idSubtask, newName) {
    return await taskModel.findById(idTask)
      .exec()
      .then(async (task) => {
        if (task == null) {
          throw new Error(`invalid task`)
        }

        let subtasks = task.subtasks.filter(subtask => subtask._id == idSubtask)

        if (subtasks && subtasks.length > 0) {
          let subtask = subtasks[0]

          try {
            subtask.name = newName
            task.subtasks.replaceItemWithValue(subtask)

            let result = await task.save()

            await subtaskModel.findByIdAndUpdate(subtask._id, { name: newName, isCompleted: subtask.isCompleted, updateAt: Date.now().valueOf() }, { new: true })
            await stageService.updateTaskInStage(result.idStage, result)
            return result
          } catch (err) {
            throw new Error(err.message)
          }
        }

        throw new Error(`invalid subtask`)
      }).catch((err) => {
        throw new Error(err.message)
      })
  }

  async updateSubtaskInTask(idTask, subtask) {
    return await taskModel.findById(idTask)
      .exec()
      .then(async (task) => {
        if (task == null) {
          throw new Error(`invalid task`)
        }

        try {
          task.subtasks.replaceItemWithValue(subtask)

          await stageService.updateTaskInStage(result.idStage, result)

          let result = await task.save()
          return result
        } catch (err) {
          throw new Error(err.message)
        }

      }).catch((err) => {
        throw new Error(err.message)
      })
  }

  async changeDeadline(idTask, newDeadline, idUserAction) {
    return await taskModel.findByIdAndUpdate(idTask, {deadline: newDeadline}, {new: true})
    .exec()
    .then(async (taskUpdated) => {
      if (taskUpdated == null) {
        throw new Error(`invalid task`)
      }

      await historyService.taskUpdateDeadline(idTask, idUserAction)
      return taskUpdated
    })
    .catch((err) => {
      throw new Error(err.message)
    })
  }

  /*
1. id task
2. id của thằng cần update
3. trường cần update

  */

  async update(
    id, name, label, description, deadline,
    isCompleted, idStage,
    idAttachment, typeAttachment, valueAttachment,
    idSubtask, nameSubtask, isSubtaskCompleted,
    idComment, contentComment,
    updateAt = Date.now().valueOf()
  ) {

    return await taskModel.findById(id)
      .exec()
      .then((task) => {
        if (task == null) {
          throw new Error(`invalid task`)
        }

        return task
      })
      // action update data
      .then(async (taskFound) => {
        if (name != null) {
          taskFound.name = name
        }
        if (label != null) {
          taskFound.label = label
        }
        if (description != null) {
          taskFound.description = description
        }
        if (deadline != null) {
          taskFound.deadline = deadline
        }
        if (isCompleted != nul) {
          taskFound.isCompleted = isCompleted
        }
        if (idStage != null) {
          taskFound.idStage = idStage
        }

        if (idComment != null) {

          await commentService.update(idComment, contentComment)
            .then((comment) => {
              if (comment != null) {
                taskFound.users.replaceItemWithValue(user)
              }
            })
        }
        if (idSubtask != null) {

          await subtaskService.update(idSubtask, nameSubtask, isSubtaskCompleted)
            .then((subtask) => {
              if (subtask != null) {
                taskFound.subtasks.replaceItemWithValue(subtask)
              }
            })

        }
        if (idAttachment != null) {

          await attachmentService.update(idAttachment, typeAttachment, valueAttachment)
            .then((attachment) => {
              if (attachment != null) {
                taskFound.attachments.replaceItemWithValue(attachment)
              }
            })
        }

        taskFound.updateAt = updateAt

        return await taskModel.findByIdAndUpdate(id, taskFound)
          .exec()
          .then(async (taskUpdated) => {
            return await stageService.updateTaskInStage(taskUpdated.idStage, taskUpdated)
              .then(() => taskUpdated)
          })
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }
}

module.exports = new TaskService;