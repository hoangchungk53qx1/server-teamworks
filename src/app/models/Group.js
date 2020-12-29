const mongosee = require('mongoose');
const Schema = mongosee.Schema;

const Room = require('./Room');

const Group = new Schema({
  name: { type: String },
  idUser: { type: String },
  rooms: { type: [Room.schema], default: [] },

  createAt: { type: Number, default: Date.now().valueOf() },
  updateAt: { type: Number, default: Date.now().valueOf() }
});

module.exports = mongosee.model('Group', Group);
