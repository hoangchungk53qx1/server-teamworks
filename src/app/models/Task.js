const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// embedded models
const Subtask = require("./Subtask");
const User = require("./User");
const History = require("./History");
const Attachments = require("./Attachments");
const Comment = require("./Comment");

const Task = new Schema({
  name: { type: String },
  label: { type: Number, default: 0 }, // label color

  description: { type: String, default: "" },
  deadline: { type: Number, default: Date.now.valueOf()  }, // 3600*24*7: 7 days
  isCompleted: { type: Boolean, default: false },

  idStage: { type: String },

  subtasks: { type: [Subtask.schema], default: [] },
  histories: { type: [History.schema], default: [] },
  attachments: { type: [Attachments.schema], default: [] },
  comments: { type: [Comment.schema], default: [] },
  users: { type: [User.schema], default: [] },

  createAt: { type: Number, default: Date.now().valueOf() },
  updateAt: { type: Number, default: Date.now().valueOf() },
});

module.exports = mongoose.model("Task", Task);
