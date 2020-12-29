const express = require("express");
const Group = require("../models/Group");
const RoomService = require("./RoomService");
class GroupService {
  async queryAll() {
    return Group.find({})
      .exec()
      .then((groups) => {
        return groups
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async query(idGroup) {
    return await Group.findById(idGroup)
      .exec()
      .then((group) => {
        if (group == null) {
          throw new Error(`invalid group`)
        }

        return group
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async createGroup(name, idUser) {
    const group = await new Group({
      idUser: idUser,
      name: name,
    }).save();

    // return res.json(group);
    return group;
  }
  //ADD ROOM TO
  async addRoom(room, idGroup) {
    return await Group.findById(idGroup)
      .exec()
      .then(async (group) => {
        if (group == null) {
          throw new Error(`invalid group`)
        }

        try {
          group.rooms.push(room);
          let result = await group.save();

          return result
        } catch (err) {
          throw new Error(err.message)
        }
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async deleteRoomInGroup(idGroup, idRoom, idUser) {
    return await Group.findById(idGroup)
      .exec()
      .then(async (group) => {
        if (group == null) {
          throw new Error(`invalid group`)
        }

        let room = group.rooms.filter(item => item._id == idRoom).first()

        try {
          group.rooms.removeWith(room)
          let result = await group.save()

          await RoomService.deleteRoom(room._id, idUser)

          return result
        } catch (err) {
          throw new Error(err.message)
        }
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  //QUERY ALL GROUP OF USER
  async queryGroupByUserId(userId) {
    const groups = await Group.find({ 'idUser': userId });
    // return res.json(groups);
    return groups;
  }
  // return all of room in gr
  async queryAllRoomInGroup(idGroup) {
    return await Group.findById(idGroup)
      .exec()
      .then((group) => {
        if (!group || !group.rooms) {
          throw new Error(`invalid group`)
        }

        return group.rooms
      })
      .catch((err) => {
        throw new Error(err.message)
      })

    // const rooms = await Group.findById(idGroup).populate('rooms').exec();
    // return res.json(rooms);
    // return rooms;
  }

  async updateRoomInGroup(idGroup, room) {
    return await Group.findById(idGroup)
      .exec()
      .then(async (group) => {
        if (!group || !group.rooms) {
          throw new Error(`invalid group`)
        }

        try {
          group.rooms.replaceItemWithValue(room)

          let result = await group.save()

          return result
        } catch (err) {
          throw new Error(err.message)
        }
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }
}

module.exports = new GroupService;
