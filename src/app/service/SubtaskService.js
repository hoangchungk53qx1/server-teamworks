const subtaskModel = require('../models/Subtask');
const taskModel = require('../models/Task');

const taskService = require('../service/TaskService')
class SubtaskSerice {

  async create(idTask, name, isCompleted) {

    let subtask = new subtaskModel()
    subtask.idTask = idTask
    subtask.name = name
    subtask.isCompleted = isCompleted

    return await taskModel.findById(idTask)
      .exec()
      .then(async (task) => {
        if (task == null) {
          throw new Error(`invalid task`)
        }

        try {
          let result = await subtask.save()

          return result
        } catch {
          throw new Error(`add subtask error`)
        }

      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async update(id, name, isCompleted, updateAt = Date.now().valueOf()) {
    return await subtaskModel.findByIdAndUpdate(id, { name: name, isCompleted: isCompleted, updateAt: updateAt }, { new: true })
      .exec()
      .then(async (subtask) => {
        if (subtask == null) {
          throw new Error(`invalid subtask`)
        }

        await taskService.updateSubtaskInTask(id, subtask)

        return subtask
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async delete(id) {
    return await subtaskModel.findByIdAndDelete(id)
      .exec()
      .then(async (subtask) => {
        if (subtask == null) {
          throw new Error(`invalid subtask`)
        }

        console.log(`subtask = ${subtask}`)

        return subtask
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

}

module.exports = new SubtaskSerice;
