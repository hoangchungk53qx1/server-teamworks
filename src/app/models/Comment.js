const mongosee = require('mongoose');
const Schema = mongosee.Schema;

const Comment = new Schema({
  username: { type: String},
  content: {type: String, maxlength: 600},

  createAt: { type: Number, default: Date.now().valueOf() },
  updateAt: { type: Number, default: Date.now().valueOf() }
});

module.exports = mongosee.model('Comment', Comment);