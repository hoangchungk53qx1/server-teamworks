const mongosee = require('mongoose');
const Schema = mongosee.Schema;

// embedded models
const User = require('./User')
const History = require('./History');
const Stage = require('./Stage');

const Room = new Schema({
  name: { type: String },
  image: { type: String },
  isHighlight: { type: Boolean, default: false },

  deadline: { type: Number, default: Date.now().valueOf() },
  description: { type: String },
  // member can change info of room?
  modify: { type: Number, default: 1 },
  isEnableComment: { type: Boolean, default: true },
  // member can add other members?
  isEnableAdded: { type: Boolean, default: false },
  label: { type: Number,default: 0 },
  isFollowing: { type: Boolean, default: false },

  history: { type: [History.schema], default: [] },
  stages: { type: [Stage.schema], default: [] },
  users: [
    {
      user: {type: User.schema},
      level: {
        type: Number,
        default: 2,
      },
    },
  ],

  idGroup: { type: String, default: null},

  createAt: { type: Number, default: Date.now().valueOf() },
  updateAt: { type: Number, default: Date.now().valueOf() },
});

module.exports = mongosee.model('Room', Room);
