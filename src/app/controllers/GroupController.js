const jsonInstance = require("../utils/JsonUtils");
const responeInstance = require("../utils/ResponeUtils");
const groupService = require("../service/GroupService");
const roomService = require("../service/RoomService");

class GroupController {
  async queryAll(_, res) {
    await groupService.queryAll()
      .then((groups) => {
        responeInstance.success200(
          res,
          jsonInstance.toJsonWithData(`query successfully`, groups)
        );
      })
      .catch((err) => {
        responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
      });
  }

  async queryGroup(req, res) {
    let id = req.params.id;

    await groupService.query(id)
      .then((group) => {
        responeInstance.success200(
          res,
          jsonInstance.toJsonWithData(`query successfully`, group)
        );
      })
      .catch((err) => {
        responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
      });
  }

  async createGroup(req, res) {
    const name = req.body.name;
    const idUser = req.params.idUser;
    if (name != null && idUser != null) {
      await groupService
        .createGroup(name, idUser)
        .then((group) => {
          responeInstance.success200(
            res,
            jsonInstance.toJsonWithData(`create successfully`, group)
          );
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        });
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }


  async deleteRoomInGroup(req, res) {
    const idGroup = req.params.idGroup
    const idRoom = req.body.idRoom
    const idUser = req.body.idUser

    if (idGroup && idRoom && idUser) {
      await groupService
        .deleteRoomInGroup(idGroup, idRoom, idUser)
        .then((group) => {
          responeInstance.success200(
            res,
            jsonInstance.toJsonWithData(`delete room successfully`, group)
          );
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        });
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }

  }

  async addRoom(req, res) {
    const { name, idUser } = req.body;
    // const room = req.body.room;
    const idGroup = req.params.idGroup;
    if (name && idUser && idGroup) {

      await roomService.createRoom(name, idUser, idGroup)
        .then(async (room) => {
          await groupService
            .addRoom(room, idGroup)
            .then((group) => {
              responeInstance.success200(
                res,
                jsonInstance.toJsonWithData(`create successfully`, group)
              );
            })

        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        })

    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async queryGroupByUser(req, res) {
    const userId = req.params.idUser;
    if (userId != null) {
      await groupService
        .queryGroupByUserId(userId)
        .then((query) => {
          responeInstance.success200(
            res,
            jsonInstance.toJsonWithData(`query successfully`, query)
          );
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        });
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }

  async queryRoomInGroup(req, res) {
    const idGroup = req.params.idGroup;
    if (idGroup != null) {
      await groupService
        .queryAllRoomInGroup(idGroup)
        .then((query) => {
          responeInstance.success200(
            res,
            jsonInstance.toJsonWithData(`query successfully`, query)
          );
        })
        .catch((err) => {
          responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
        });
    } else {
      responeInstance.error400(res, jsonInstance.jsonNoData(`url error`));
    }
  }
}

module.exports = new GroupController();
