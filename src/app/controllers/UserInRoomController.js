const jsonUtils = require("../utils/JsonUtils");
const responeInstance = require("../utils/ResponeUtils");
const UserInRoomService = require("../service/UserInRoomService");
class UserInRoomController {
  //GET
  async getFullUserInRoom(req, res) {
    let idRoom = req.params.idRoom;
    await UserInRoomService.queryAllUser(idRoom)
      .then((users) => {
        responeInstance.success200(
          res,
          jsonInstance.toJsonWithData(`SUCCESS`, users)
        );
      })
      .catch((err) => {
        responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
      });
  }

  async queryAllMembers(req, res, next) {
    let id = req.query.idRoom;
    await UserInRoomService.queryTotalUser(id)
      .then((users) => {
        responeInstance.success200(
          res,
          jsonInstance.toJsonWithData(`SUCCESS`, users)
        );
      })
      .catch((err) => {
        responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
      });
  }
  findByName(req, res, next) {
    let username = req.params.username;
    let idRoom = req.params.idRoom;
    UserInRoomService.findUserInRoom(username, idRoom)
      .then((users) => {
        responeInstance.success200(
          res,
          jsonInstance.toJsonWithData(`SUCCESS`, users)
        );
      })
      .catch((err) => {
        responeInstance.error400(res, jsonInstance.jsonNoData(err.message));
      });
  }
}
module.exports = new UserInRoomController();
