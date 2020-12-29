const mongosee = require("mongoose");
const Schema = mongosee.Schema;

const UserInRoom = new Schema(
  {
    idUser: { type: String },
    idRoom: { type: String },

    /** 
     * level user in room:
     * 0: created
     * 1: manager
     * 2: member
    */
    level: { type: Number, default: 2 },

    createAt: { type: Number, default: Date.now().valueOf() },
    updateAt: { type: Number, default: Date.now().valueOf() }

  }
);

module.exports = mongosee.model("UserInRoom", UserInRoom);
