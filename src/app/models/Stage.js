const mongosee = require("mongoose");
const Schema = mongosee.Schema;

// embedded models
const Task = require("./Task");

const Stage = new Schema({
  name: { type: String },
  idRoom: { type: String },
  tasks: { type: [Task.schema], default: [] },

  createAt: { type: Number, default: Date.now().valueOf() },
  updateAt: { type: Number, default: Date.now().valueOf() },
});

module.exports = mongosee.model("Stage", Stage);
