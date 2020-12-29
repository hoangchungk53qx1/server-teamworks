const jsonInstance = require('../utils/JsonUtils');
const responeInstance = require('../utils/ResponeUtils');

const commentService = require('../service/CommentService');

class CommentController {
  async queryAll(_, res) {

    await commentService.queryAll()
      .then((comments) => {
        responeInstance.success200(res, jsonInstance.toJsonWithData(`SUCCESS`, comments))
      })
      .catch((err) => {
        responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
      })
  }

  async query(req, res) {
    let id = req.query.id;
    let category = req.query.category

    if (id != null) {

      await commentService.query(id, category)
        .then((comments) => {
          responeInstance.success200(res, jsonInstance.toJsonWithData(`SUCCESS`, comments))
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        })

    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }

  }

  async create(req, res) {
    var data = {
      idUser: req.query.idUser,
      content: req.query.content
    };

    if (data.idUser != null && data.content != null) {

      await commentService.create(data.idUser, data.content)
        .then((comment) => {
          responeInstance.success200(res, jsonInstance.toJsonWithData(`create successfully`, comment));
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        })

    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }

  }

  async update(req, res) {
    var data = {
      id: req.query.id,
      content: req.query.content
    };

    if (data.id != null && data.content != null) {

      await commentService.update(data.id, data.username, data.content)
        .then((comment) => {
          responeInstance.success200(res, jsonInstance.toJsonWithData(`update successfully`, comment));
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        })

    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }

  }

  async delete(req, res) {
    let id = req.query.id

    if (id != null) {

      await commentService.delete( id)
      .then((comment) => {
        responeInstance.success200(res, jsonInstance.toJsonWithData(`delete successfully`, comment));
      })
      .catch((err) => {
        responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
      })

    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }
}

module.exports = new CommentController;
