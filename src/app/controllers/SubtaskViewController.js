const jsonInstance = require('../utils/JsonUtils');
const responeInstance = require('../utils/ResponeUtils');

const subtaskService = require('../service/SubtaskService');

class SubtaskViewController {

  async create(req, res) {
    var respone = {
      idTask: req.query.idTask,
      name: req.query.name,
      isCompleted: req.query.completed != null ? req.query.completed : false
    }

    if (respone.idTask != null && respone.name != null) {
      await subtaskService.create(respone.idTask, respone.name, respone.isCompleted)
        .then((subtask) => {
          responeInstance
            .success200(res, jsonInstance.toJsonWithData(`SUCCESS`, subtask));
        })
        .catch((err) => {
          responeInstance
            .error400(res, jsonInstance.jsonNoData(err.message));
        })
    } else {
      responeInstance
        .error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async update(req, res) {
    var respone = {
      id: req.params.id,
      name: req.body.name,
      isCompleted: req.body.completed != null ? req.body.completed : false
    }

    if (respone.id != null && respone.name != null) {

      await subtaskService.update(respone.id, respone.name, respone.isCompleted)
        .then((subtask) => {
          responeInstance
            .success200(res, jsonInstance.toJsonWithData(`SUCCESS`, subtask));
        })
        .catch((err) => {
          responeInstance
            .error400(res, jsonInstance.jsonNoData(err.message));
        })
    } else {
      responeInstance
        .error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async delete(req, res) {
    let id = req.query.id;

    if (id != null) {

      await subtaskService.delete(id)
        .then((subtask) => {
          responeInstance
            .success200(res, jsonInstance.toJsonWithData(`SUCCESS`, subtask));
        })
        .catch((err) => {
          responeInstance
            .error400(res, jsonInstance.jsonNoData(err.message));
        })

    } else {
      responeInstance
        .error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }
}

module.exports = new SubtaskViewController;