
const taskService = require('../service/TaskService');
const commentService = require('../service/CommentService');
const userService = require('../service/UserService');
const subtaskService = require('../service/SubtaskService');
const historyService = require('../service/HistoryService');
const attachmentService = require("../service/AttachmentService");
const jsonInstance = require('../utils/JsonUtils');
const responeInstance = require('../utils/ResponeUtils');
const dbUtils = require('../utils/DatabaseUtils');
const fs = require('fs')


class TaskController {
  async queryAll(_, res) {
    await taskService
      .queryAll()
      .then((tasks) => {
        responeInstance.success200(
          res,
          jsonInstance.toJsonWithData(`SUCCESS`, tasks)
        );
      })
      .catch((err) => {
        responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
      });
  }

  async query(req, res) {
    let id = req.params.id;

    if (id != null) {
      await taskService.query(id)
        .then((task) => {
          responeInstance.success200(
            res,
            jsonInstance.toJsonWithData(`SUCCESS`, task)
          );
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        })
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async renameSubtask(req, res) {
    let id = req.params.id
    let idSubtask = req.params.idSubtask
    let newName = req.body.name

    await taskService
      .renameSubtask(id, idSubtask, newName)
      .then(async (task) => {

        responeInstance.success200(
          res,
          jsonInstance.toJsonWithData(`SUCCESS`, task)
        )

      })
      .catch((err) => {
        responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
      });
  }

  async create(req, res) {
    // let name = req.query.name;
    // let idStage = req.query.idStage;

    const { name, idStage } = req.body;

    if (name != null && idStage != null) {

      await taskService
        .create(name, idStage)
        .then(async (task) => {

          responeInstance.success200(
            res,
            jsonInstance.toJsonWithData(`SUCCESS`, task)
          )

        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        });
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async addSubtask(req, res) {
    var respone = {
      id: req.body.id,
      name: req.body.name,
      isCompleted: req.body.completed != null ? req.body.completed : false,
      idUser: req.body.idUser
    };

    if (respone.id != null && respone.name != null) {
      let idTask = respone.id;
      await subtaskService
        .create(idTask, respone.name, respone.isCompleted)
        .then(async (subtask) => {
          await taskService.addSubtask(idTask, subtask, respone.idUser)
            .then((result) => {

              dbUtils.saveData(res, null, result, `add`);
            });
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        });
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async addUser(req, res) {
    var respone = {
      id: req.body.id,
      idUserWillAdded: req.body.idUserWillAdded,
      idUserAction: req.body.idUser
    };

    if (respone.id != null && respone.idUserWillAdded != null && respone.idUserAction) {
      await userService
        .queryWithId(respone.idUserWillAdded)
        .then(async (user) => {
          await taskService.addUser(respone.id, user, respone.idUserAction)
            .then((result) => {
              dbUtils.saveData(res, null, result, `add`);
            });
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        });
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async addComment(req, res) {
    var respone = {
      id: req.body.id,
      content: req.body.content,
      idUser: req.body.idUser,
    };

    if (
      respone.idUser != null &&
      respone.id != null &&
      respone.content != null
    ) {
      await commentService
        .create(respone.idUser, respone.content)
        .then(async (comment) => {
          await taskService.addComment(respone.id, comment).then((result) => {
            dbUtils.saveData(res, null, result, `add`);
          });
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        });
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async addHistory(req, res) {
    var respone = {
      id: req.body.id,
      idUser: req.body.idUser,
      content: req.body.content,
      idHistoryCategory: req.body.idHistoryCategory,
      categoryHistoryName: req.body.categoryHistoryName,
    };

    if (
      respone.idUser != null &&
      respone.id != null &&
      respone.content != null &&
      respone.idHistoryCategory != null &&
      respone.categoryHistoryName != null
    ) {
      // make history from data input
      await historyService
        .create(
          respone.idUser,
          respone.content,
          respone.idHistoryCategory,
          respone.categoryHistoryName
        )
        .then(async (history) => {
          await taskService.addHistory(respone.id, history).then((result) => {
            dbUtils.saveData(res, null, result, `add`);
          });
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        });
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async addAttachmentLink(req, res) {
    var id = req.params.id
    var link = req.body.link
    var idUser = req.body.idUser

    if (id && link) {
      // make history from data input
      await attachmentService
        .createLink(
          id,
          link
        )
        .then(async (attachment) => {
          await taskService.addAttachment(id, attachment, idUser)
            .then((result) => {
              dbUtils.saveData(res, null, result, `add`);
            });
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        });
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async addAttachment(req, res) {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database

    var image = new Buffer(encode_image, 'base64')

    var metadata = {
      contentType: req.file.mimetype
    };
    var filename = req.file.filename
    if (!filename) {
      filename = Data.now().valueOf().toString()
    }
    var id = req.params.id
    var idUser = req.body.idUser
    if (id && filename && image && metadata) {
      // make history from data input
      await attachmentService
        .create(
          id,
          filename,
          image,
          metadata
        )
        .then(async (attachment) => {
          await taskService.addAttachment(id, attachment, idUser)
            .then((result) => {
              dbUtils.saveData(res, null, result, `add`);
            });
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        });
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async deleteSubtask(req, res) {
    var respone = {
      id: req.body.id,
      idSubtask: req.body.idCategory,
      idUserAction : req.body.idUserAction
    };

    if (respone.id != null && respone.idSubtask != null && idUserAction) {
      await taskService
        .deleteSubtask(respone.id, respone.idSubtask, idUserAction)
        .then(async (task) => {
          dbUtils.saveData(res, null, task, `delete`);
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        });
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async deleteUser(req, res) {
    var respone = {
      id: req.body.id,
      idUser: req.body.idCategory,
      idUserAction: req.body.idUserAction
    };

    if (respone.id != null && respone.idUser != null && idUserAction) {
      await taskService
        .deleteUser(respone.id, respone.idUser, idUserAction)
        .then((result) => {
          dbUtils.saveData(res, null, result, `delete`);
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        });
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async deleteComment(req, res) {
    var respone = {
      id: req.body.id,
      idComment: req.body.idCategory,
      idUserAction: req.body.idUserAction
    };

    if (respone.id != null && respone.idComment != null) {
      await taskService
        .deleteComment(respone.id, respone.idComment, idUserAction)
        .then((task) => {
          responeInstance.success200(
            res,
            jsonInstance.toJsonWithData(`delete success`, task)
          );
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        });
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async changeDeadline(req, res) {
    var idTask = req.params.id
    var deadline = req.body.deadline
    let idUserAction = req.body.idUserAction

    if (idTask && deadline) {
      await taskService
        .changeDeadline(idTask, deadline, idUserAction)
        .then((taskUpdated) => {
          responeInstance.success200(
            res,
            jsonInstance.toJsonWithData(`change deadline success`, taskUpdated)
          );
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        })
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`))
    }

  }

  async deleteAttachment(req, res) {
    var respone = {
      id: req.params.id,
      idAttachment: req.params.idAttachment,
      idUserAction: req.body.idUserAction
    };

    if (respone.id != null && respone.idAttachment != null) {
      await taskService
        .deleteAttachment(respone.id, respone.idAttachment, idUserAction)
        .then((task) => {
          responeInstance.success200(
            res,
            jsonInstance.toJsonWithData(`delete success`, task)
          );
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        })
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async deleteHistory(req, res) {
    var respone = {
      id: req.query.id,
      idHistory: req.query.idCategory,
    };

    if (respone.id != null && respone.idHistory != null) {
      await taskService
        .deleteHistory(respone.id, respone.idHistory)
        .then((task) => {
          responeInstance.success200(
            res,
            jsonInstance.toJsonWithData(`delete success`, task)
          );
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        });
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async deleteTask(req, res) {
    let id = req.body.id;

    if (id != null) {
      await taskService
        .deleteTask(id)
        .then((task) => {
          responeInstance.success200(
            res,
            jsonInstance.toJsonWithData(`delete success`, task)
          );
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        });
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  delete = (req, res) => {
    let category = req.params.category;
    if (category == null) {
      category = "";
    }
    console.log(`category = ${category}`)

    switch (category.toString().toLowerCase()) {
      case "user":
        this.deleteUser(req, res);
        break;
      case "comment":
        this.deleteComment(req, res);
        break;
      case "subtask":
        this.deleteSubtask(req, res);
        break;
      default:
        this.deleteTask(req, res);
        break;
    }
  }

  add = (req, res) => {
    let category = req.params.category;
    if (category == null) {
      category = "";
    }

    switch (category.toString().toLowerCase()) {
      case "user":
        this.addUser(req, res);
        break;
      case "comment":
        this.addComment(req, res);
        break;
      case "subtask":
        this.addSubtask(req, res);
        break;
      default:
        this.create(req, res);
        break;
    }
  };

  async update(req, res) {
    var respone = {
      id: req.params.id,
      name: req.query.name,
      label: req.query.label,
      description: req.query.description,
      deadline: req.query.deadline,
      isCompleted: req.query.isCompleted,
      idStage: req.query.idStage,
      idComment: req.query.idComment,
      idSubtask: req.query.idSubtask,
      idAttachment: req.query.idAttachment,
      typeAttachment: req.query.typeAttachment,
      valueAttachment: req.query.valueAttachment,
      nameSubtask: req.query.nameSubtask,
      isSubtaskCompleted: req.query.isSubtaskCompleted,
      contentComment: req.query.contentComment,
    };

    if (respone.id != null) {

      await taskService.update(
        respone.id,
        respone.name, respone.label,
        respone.description, respone.deadline,
        respone.isCompleted, respone.idStage,
        respone.idAttachment, respone.typeAttachment,
        respone.valueAttachment, respone.idSubtask,
        respone.nameSubtask, respone.isSubtaskCompleted,
        respone.idComment, respone.contentComment
      )
        .then((task) => {
          responeInstance.success200(
            res,
            jsonInstance.toJsonWithData(`update success`, task)
          );
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        })

    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }

  }
}

module.exports = new TaskController;
