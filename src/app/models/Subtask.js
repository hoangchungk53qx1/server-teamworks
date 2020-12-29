const mongosee = require('mongoose');
const Schema = mongosee.Schema;

const Subtask = new Schema({
  name: { type: String },
  isCompleted: { type: Boolean, default: false },
  idTask: {type: String},

  createAt: { type: Number, default: Date.now().valueOf() },
  updateAt: { type: Number, default: Date.now().valueOf() }

});

module.exports = mongosee.model('Subtask', Subtask);