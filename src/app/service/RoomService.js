const Room = require("../models/Room");
const User = require("../models/User");
const Stage = require("../models/Stage");
const groupService = require('./GroupService')
const historyService = require("./HistoryService");

require('../utils/ArrayUtils')

class RoomService {
  async queryAll() {
    return await Room.find({})
      .exec()
      .then((rooms) => {
        return rooms;
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }

  async query(id) {
    return await Room.findById(id).populate({
      path: "stages",
      populate: {
        path: "tasks",
      },
    });
  }

  async createStageInRoom(roomId, stage, idUser) {
    return await Room.findById(roomId)
      .exec()
      .then(async (room) => {
        if (room == null) {
          throw new Error(`invalid room`);
        }

        let user = await room.users.filter(user => user.user != null && user.user._id == idUser);
        if (user && user.length > 0 && user[0].level <= 1) {
          try {
            room.stages.push(stage);
            let result = await room.save();

            await historyService.roomAddStage(roomId, idUser, stage.name)
            await groupService.updateRoomInGroup(result.idGroup, result)
            return result;
          } catch (err) {
            throw new Error(err.message);
          }
        } else {
          throw new Error(`authorization request`);
        }

      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  async getAllRoomWithUser(idUser) {
    return await Room.find({})
      .exec()
      .then(async (rooms) => {

        if (!rooms) {
          throw new Error(`invalid room`);
        }

        // query get all rooms contain idUser
        return rooms.filter(item => {
          return item.users != null && item.users
            .filter(user => user.user != null && user.user._id == idUser)
            .length > 0
        })

      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  async createRoom(name, idUser, idGroup) {
    try {
      const user = await User.findById(idUser);

      let room = await new Room({
        name: name,
        // image: image,
        users: {
          user: user,
          level: 0,
        },
        idGroup: idGroup
      }).save();

      await historyService.roomCreated(room._id, idUser)
      return room;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findUser(idRoom, idUser) {
    try {
      const room = await Room.findById(idRoom);
      const userInRoom = room.users.filter((user) => user.user._id == idUser);

      if (userInRoom && userInRoom.length > 0) {
        return userInRoom[0].user
      }
      return null;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async addUser(idRoom, idUserAction, userAdded) {
    try {
      const room = await Room.findById(idRoom);
      const userInRoom = room.users.filter(user => user.user._id == idUserAction);
      if (userInRoom.length > 0 && userInRoom[0].level <= 1) {
        // kiem tra user co trong room khong?

        if (
          room.users.filter(item => item.user._id.equals(userAdded._id)).length == 0
        ) {
          room.users.push({
            user: userAdded,
            level: 2,
          });

          await room.save();

          await historyService.roomAddMember(idRoom, idUserAction, userAdded._id)

          await groupService.updateRoomInGroup(room.idGroup, room)

          return room;
        } else {
          throw new Error(`user exitst`)
        }
      } else {
        throw new Error(`authen define`)
      }

    } catch (error) {
      throw new Error(error.message);
    }
  }

  async renameStageInRoom(nameNew, idStage, idUser, roomId) {
    const room = await Room.findById(roomId);
    const userInRoom = room.users.filter(user => user.user._id == idUser);

    if (userInRoom && userInRoom.length >= 1 && userInRoom[0].level < 2) {
      return await Stage.findByIdAndUpdate(idStage, { name: nameNew }, { new: true })
        .then(async (stage) => {
          room.stages.replaceItemWithValue(stage)

          await room.save()

          await groupService.updateRoomInGroup(room.idGroup, room)

          return room
        })
        .catch((err) => {
          throw new Error(err.message)
        })
    }
  }


  async deleteUser(idRoom, idUser, idUserDelete) {
    return await Room.findById(idRoom)
      .exec()
      .then(async (room) => {
        if (room == null) {
          throw new Error(`invalid room`)
        }

        const userInRoom = room.users.filter((user) => user.user != null && user.user._id == idUser);
        const userDelete = room.users.filter(
          (user) => user.user != null && user.user._id == idUserDelete
        );
        if (userInRoom.length >= 1 && userDelete.length >= 1) {
          // kiem tra user co trong room khong?
          if (
            userInRoom[0].level <= userDelete[0].level &&
            userInRoom[0].level < 2
          ) {
            room.users.removeWithId(userDelete[0]._id)
            await room.save();

            await historyService.roomDeleteMember(idRoom, idUser, idUserDelete)
            await groupService.updateRoomInGroup(room.idGroup, room)

            return room;
          } else {
            console.log(`r = ${userInRoom} - ${userDelete}`)
          }
        } else {
          throw new Error(`invalid user`);
        }
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async deleteRoom(idRoom, idUser) {
    return await Room.findById(idRoom)
      .exec()
      .then(async (room) => {
        if (!room) {
          throw new Error(`invalid room`)
        }

        if (room.users != null && room.users.filter(user => user.user != null).length > 0) {
          const userInRoom = room.users.filter(user => user.user._id == idUser);
          if (userInRoom.length > 0 && userInRoom[0].level <= 1) {
            await Room.findByIdAndDelete(idRoom)
            await groupService.updateRoomInGroup(room.idGroup, room)

            return room
          }
        } else {
          await Room.findByIdAndDelete(idRoom)
          await groupService.updateRoomInGroup(room.idGroup, room)

          return room
        }

      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async findUserByName(idRoom, name) {
    try {
      const userAll = await User.find({
        username: { $regex: ".*" + name + ".*" },
      });
      const room = await Room.findById(idRoom);
      var arrUser = [];
      userAll.forEach((id) => {
        var userInRoom = room.users.filter(
          (user) => user.user != null && user.user._id == id._id.toString()
        );
        console.log(userInRoom);
        if (userInRoom.length > 0) {
          arrUser.push(id);
        }
      });
      if (arrUser.length > 0) {
        return arrUser;
      }

      return null;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteStageInRoom(idRoom, idStage, idUser) {
    return await Room.findById(idRoom)
      .exec()
      .then(async (room) => {
        if (room == null) {
          throw new Error(`invalid room`)
        }

        try {
          const stages = room.stages.filter((stage) => stage._id == idStage)
          const users = room.users.filter(user => user.user._id == idUser)

          if (users.length == 0 || stages.length == 0 || users[0].level > 1) {
            throw new Error(`error`)
          }

          room.stages.removeWithId(idStage)
          let result = await room.save()

          await historyService.roomDeleteStage(idRoom, idUser, stages[0].name)
          await groupService.updateRoomInGroup(result.idGroup, result)

          return result
        } catch (err) {
          throw new Error(err.message);
        }
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }
  async setLevelUser(idRoom, idUserAction, idUserWillSet, level) {
    try {
      const room = await Room.findById(idRoom);
      if (room == null) {
        throw new Error(`invalid room`);
      }
      const userAction = room.users.filter(user => user.user._id == idUserAction)

      var userWillSet = room.users.filter(user => user.user._id == idUserWillSet)
      // check user found
      // check user action set level, level user set >= level has been set
      // level 0 or 1 can set
      // can't set level = 0
      if (userWillSet.length == 0 || userAction.length == 0 ||
        userAction[0].level > 1 || userAction[0].level >= level ||
        level == 0) {
        return false
      }

      userWillSet[0].level = level
      room.users.replaceItemWithValue(userWillSet)
      await room.save()

      let nameLevel = "Thành viên"
      if (level == 1) {
        nameLevel = "Quản lý"
      }
      await historyService.roomSetLevel(idRoom, idUserAction, idUserWillSet, nameLevel)
      await groupService.updateRoomInGroup(room.idGroup, room)

      return room
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getStageInRoom(idRoom) {
    return await Room.findById(idRoom)
      .exec()
      .then((room) => {
        if (room == null) {
          throw new Error(`invalid room`);
        }
        return room.stages;
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }
  async getUserInRoom(idRoom) {
    return await Room.findById(idRoom)
      .exec()
      .then((room) => {
        if (room == null) {
          throw new Error(`invalid room`);
        }
        return room.users;
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  async updateUserInRoom(user) {
    await Room.find({})
      .exec()
      .then(async (rooms) => {

        rooms.forEach(room => {
          room.users.forEach(usr => {
            if (usr.user._id.equals(user._id)) {
              usr.user = user
            }
          })
        })

        try {

          // await Promise.all(
            rooms.forEach(async (room) => {
              let result = await room.save()

              await groupService.updateRoomInGroup(result.idGroup, result)
            })
          // )
          // let result = await rooms.save()          

        } catch (err) {
          throw new Error(err.message)
        }
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async updateStageInRoom(idRoom, stageUpdated) {
    return await Room.findById(idRoom)
      .exec()
      .then(async (room) => {
        if (room == null) {
          throw new Error(`invalid room`);
        }

        try {
          room.stages.replaceItemWithValue(stageUpdated);

          let result = await room.save();

          await groupService.updateRoomInGroup(room.idGroup, room)

          return result;
        } catch (err) {
          throw new Error(err.message);
        }
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  async searchRoomName(search) {
    const rooms = await Room.find({ name: new RegExp(search) });
    return rooms;
  }
}


module.exports = new RoomService;
