const jsonInstance = require('../utils/JsonUtils');
const responeInstance = require('../utils/ResponeUtils');
const stageService = require('../service/StageService');
const taskService = require('../service/TaskService');

class StageController {
  async queryAll(_, res) {
    await stageService.queryAll()
      .then((stages) => {
        responeInstance.success200(res, jsonInstance.toJsonWithData(`SUCCESS`, stages))
      })
      .catch((err) => {
        responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
      })
  }

  async query(req, res) {
    let id = req.query.id

    if (id != null) {

      await stageService.query(id)
        .then((stage) => {
          responeInstance.success200(res, jsonInstance.toJsonWithData(`SUCCESS`, stage))
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        })

    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async create(req, res) {
    let name = req.body.name
    let idRoom = req.body.idRoom

    if (name != null && idRoom != null) {
      console.log(`>>> create stage ${name} - ${idRoom}`)
      await stageService.create(name, idRoom)
        .then((stage) => {
          responeInstance.success200(res, jsonInstance.toJsonWithData(`SUCCESS`, stage))
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        })

    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }

  }

  async moveTaskToStage(req, res) {
    let idStageFrom = req.body.idStageFrom
    let idStageTo = req.body.idStageTo
    let idTask = req.body.idTask

    if (idStageFrom && idStageTo && idTask) {

      await stageService.moveTaskToStage(idStageFrom, idStageTo, idTask)
        .then(() => {
          res.status(200)
            .json({
              message: "move successfully",
            })
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        })

    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }

  }

  async addTaskInStage(req, res) {
    let respone = {
      id: req.body.idStage,
      nameTask: req.body.name
    }

    if (respone.id != null && respone.nameTask != null) {

      await taskService.create(respone.nameTask, respone.id)
        .then(async (task) => {

          await stageService.addTaskInStage(respone.id, task)
            .then(async (stage) => {
              // await roomService.updateStageInRoom(stage.idRoom, stage)

              responeInstance.success200(res, jsonInstance.toJsonWithData(`add success`, stage))
              return stage
            })
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        })

    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }

  }

  async deleteTaskInStage(req, res) {
    let respone = {
      id: req.body.id,
      idTask: req.body.idTask
    }

    if (respone.id != null && respone.idTask != null) {

      await stageService.deleteTaskInStage(respone.id, respone.idTask)
        .then((stage) => {
          responeInstance.success200(res, jsonInstance.toJsonWithData(`delete success`, stage))
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        })

    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async deleteTask(req, res) {
    let id = req.body.id

    if (id != null) {

      await stageService.delete(id)
        .then((stage) => {
          responeInstance.success200(res, jsonInstance.toJsonWithData(`DELETE SUCCESS`, stage))
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        })

    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  delete = (req, res) => {
    let category = req.params.category

    if (category == null) {
      category = ""
    }

    switch (category.toString().toLowerCase()) {
      case "task":
        this.deleteTaskInStage(req, res)
        break;
      default:
        this.deleteTask(req, res)
        break;
    }
  }

  add = (req, res) => {
    let category = req.params.category

    if (category == null) {
      category = ""
    }

    console.log(`>>> stage category = ${category}`)

    switch (category.toString().toLowerCase()) {
      case "task":
        this.addTaskInStage(req, res)
        break;
      default:
        this.create(req, res)
        break;
    }

  }

}

module.exports = new StageController;
