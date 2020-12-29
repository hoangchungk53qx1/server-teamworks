const userInRoomModel = require("../../app/models/UserInRoom");
class UserInRoomService {
  async queryAllUser(idRoom) {
    return await userInRoomModel.find({ idRoom: idRoom })
      .exec()
      .then((users) => {
        return users;
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  async queryTotalUser(idRoom) {
    return await userInRoomModel.find({ idRoom: idRoom })
      .exec()
      .then((users) => {
        if (users == null) {
          return 0
        }
        return users.length;
      })
      .catch((err) => {
        throw new Error(err.message);
      })
  }

  async findUserInRoom(id) {
    return await userInRoomModel.findById(id)
      .exec()
      .then((userInRoom) => {
        if (userInRoom == null) {
          throw new Error("query error");
        }
        return userInRoom;
      })
      .catch((err) => {
        throw new Error(err.message);
      })
  }

  async delete(id) {
    return await userInRoomModel.findByIdAndDelete(id)
      .exec()
      .then((userInRoom) => {
        if (userInRoom == null) {
          throw new Error("query error");
        }
        return userInRoom;
      })
      .catch((err) => {
        throw new Error(err.message);
      })
  }

  async deleteAllInRoom(idRoom) {
    return await userInRoomModel.find({ idRoom: idRoom })
      .exec()
      .then(async (userInRooms) => {

        await Promise.all(
          userInRooms
            .map(it => it._id)
            .map(this.delete)
        )

        return "OK"

      })
      .catch((err) => {
        throw new Error(err.message);
      })
  }
}
module.exports = new UserInRoomService;
