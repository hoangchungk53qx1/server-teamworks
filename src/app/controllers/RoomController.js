const roomService = require("../service/RoomService");
const stageService = require("../service/StageService");
const responeInstance = require("../utils/ResponeUtils");
const jsonInstance = require("../utils/JsonUtils");
const UserService = require("../service/UserService");

class RoomController {

  async queryAll(_, res) {
    await roomService
      .queryAll()
      .then((rooms) => {
        responeInstance.success200(
          res,
          jsonInstance.toJsonWithData(`success`, rooms)
        );
      })
      .catch((err) => {
        responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
      });
  }

  async query(req, res) {
    let id = req.params.id;

    await roomService
      .query(id)
      .then((rooms) => {
        responeInstance.success200(
          res,
          jsonInstance.toJsonWithData(`success`, rooms)
        );
      })
      .catch((err) => {
        responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
      });
  }

  async queryUserInRoom(req, res) {
    let id = req.params.id;

    await roomService
      .queryUserInRoom(id)
      .then((users) => {
        responeInstance.success200(
          res,
          jsonInstance.toJsonWithData(`success`, users)
        );
      })
      .catch((err) => {
        responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
      });
  }

  async createRoom(req, res) {
    const { name, idUser } = req.body;
    // const image = req.file.filename;
    if (req.body != null) {
      const result = await roomService.createRoom(name, idUser);
      if (result != null) {

        responeInstance.success200(
          res,
          jsonInstance.toJsonWithData(`create successfully`, result)
        );
      } else {
        responeInstance.error400(res, jsonInstance.jsonNoData(`create error`));
      }
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`query error`));
    }
  }

  async addStageInRoom(req, res) {
    const name = req.body.name;
    const roomId = req.params.idRoom;
    const idUser = req.body.idUser;

    if (name != null && roomId != null) {
      await roomService.query(roomId)
        .then(async (roomFound) => {
          await stageService
            .create(name, roomId)
            .then(async (stage) => {
              await roomService.createStageInRoom(roomId, stage, idUser)
                .then(async (room) => {

                  responeInstance.success200(
                    res,
                    jsonInstance.toJsonWithData(`add success stage`, room)
                  );
                });
            })
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        });
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async updateStageInRoom(req, res) {
    const name = req.body.name;
    const roomId = req.params.idRoom;
    if (name != null && roomId != null) {
      await stageService
        .create(name, roomId)
        .then(async (stage) => {
          await roomService.createStageInRoom(roomId, stage).then((room) => {
            responeInstance.success200(
              res,
              jsonInstance.toJsonWithData(`add success stage`, room)
            );
          });
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        });
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async addUserInRoom(req, res) {

    let { idUserAction, idUserAdded } = req.body;
    let idRoom = req.params.idRoom;
    const user = await UserService.queryWithId(idUserAdded)

    if (idUserAction && idUserAdded && idRoom) {
      await roomService.addUser(idRoom, idUserAction, user)
      .then((result) => {
        responeInstance.success200(
          res,
          jsonInstance.toJsonWithData(`add user successfully`, result)
        )

      })
      .catch((err) => {
        responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
      })
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`query error`));
    }

    
  }

  async setLevelUser(req, res) {
    const idRoom = req.params.idRoom;
    const idUserAction = req.params.idUser;

    const idUserWillSet = req.body.idUserWillSet;
    const levelSet = req.body.level;


    const result = await roomService.setLevelUser(
      idRoom,
      idUserAction,
      idUserWillSet,
      levelSet
    );
    const user = await UserService.queryWithId(idUserWillSet)
    if (idRoom != null && idUserAction != null) {
      if (result == null || result == false) {
        responeInstance.error400(
          res,
          jsonInstance.jsonNoData(`setLevel error`)
        );
      } else {
        responeInstance.success200(
          res,
          jsonInstance.toJsonWithData(`setLevel successfully`, result)
        );
      }
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`query error`));
    }
  }
  async findUserByName(req, res) {
    const name = req.body.name;
    let idRoom = req.params.idRoom;
    const result = await roomService.findUserByName(idRoom, name);
    if (result != null) {
      responeInstance.success200(
        res,
        jsonInstance.toJsonWithData(`find user successfully`, result)
      );
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`find user error`));
    }
  }
  async findUserInRoom(req, res) {
    const idUser = req.body.idUser;
    let idRoom = req.params.idRoom;
    const result = await roomService.findUser(idRoom, idUser);
    if (result != null) {
      responeInstance.success200(
        res,
        jsonInstance.toJsonWithData(`find user successfully`, result)
      );
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`find user error`));
    }
  }

  async deleteStageInRoom(req, res) {
    let idRoom = req.params.idRoom;
    let idStage = req.params.idStage;
    let idUser = req.body.idUser;
    if (idRoom && idStage && idUser) {

      await roomService.deleteStageInRoom(idRoom, idStage, idUser)
        .then(async (room) => {
          await stageService.deleteStage(idStage)
            .then((result) => {

              responeInstance.success200(
                res,
                jsonInstance.toJsonWithData(`delete success`, result)
              )
            })
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        })
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async deleteUser(req, res) {
    var idUserDelete = req.body.idUserDelete
    var idRoom = req.params.idRoom;
    var idUser = req.params.idUser;

    const user = await UserService.queryWithId(idUserDelete)

    // const result = await roomService.deleteUser(idRoom, idUser, idUserDelete);

    if (idRoom != null && idUser != null) {
      await roomService.deleteUser(idRoom, idUser, idUserDelete)
        .then((result) => {
          responeInstance.success200(
            res,
            jsonInstance.toJsonWithData(`delete user successfully`, result)
          );
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        })
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`query error`));
    }
  }

  async deleteRoom(req, res) {
    let idRoom = req.params.idRoom;
    var idUser = req.body.idUser;
    // const result = 
    if (idRoom != null) {
      await roomService.deleteRoom(idRoom, idUser)
        .then((room) => {

          responeInstance.success200(
            res,
            jsonInstance.toJsonWithData(`delete successfully`, room)
          );
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        })
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`query error`));
    }
  }
  async getStageInRoom(req, res) {
    let idRoom = req.params.idRoom;
    const result = await roomService.getStageInRoom(idRoom);
    if (result == null) {
      responeInstance.error400(res, jsonInstance.jsonNoData(`get error`));
    } else {
      responeInstance.success200(
        res,
        jsonInstance.toJsonWithData(`get Stage successfully`, result)
      );
    }
  }

  async getAllRoomWithUser(req, res) {
    let idUser = req.params.idUser

    console.log(`idUser = ${idUser}`)
    
    await roomService.getAllRoomWithUser(idUser)
      .then((rooms) => {
        responeInstance.success200(
          res,
          jsonInstance.toJsonWithData(`get sucess`, rooms)
        );
      })
      .catch((err) => {
        responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
      })
  }

  async getUserInRoom(req, res) {
    let idRoom = req.params.idRoom;
    const result = await roomService.getUserInRoom(idRoom);
    if (result == null) {
      responeInstance.error400(res, jsonInstance.jsonNoData(`get error`));
    } else {
      responeInstance.success200(
        res,
        jsonInstance.toJsonWithData(`get Stage successfully`, result)
      );
    }
  }
  async renameStage(req, res) {
    const idRoom = req.params.idRoom;
    const idStage = req.body.idStage;
    const nameNew = req.body.newName;
    const idUser = req.body.idUser;

    if (idRoom != null || idUser != null || nameOld != null || nameNew != null) {
      const stageOld = await stageService.query(idStage)
      // const result = await roomService.renameStageInRoom(nameNew, idStage, idUser, idRoom)

      await roomService.renameStageInRoom(nameNew, idStage, idUser, idRoom)
      .then((result) => {

        responeInstance.success200(
          res,
          jsonInstance.toJsonWithData(`renameStageInRoom successfully`, result)
        )
      })
      .catch((err) => {
        responeInstance.error400(
          res,
          jsonInstance.jsonNoData(err.message)
        )
      })
    } else {
      responeInstance.error400(
        res,
        jsonInstance.jsonNoData(`query error`)
      );
    }
  }
}
module.exports = new RoomController();
