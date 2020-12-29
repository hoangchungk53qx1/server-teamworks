const mongosee = require('mongoose');
const Schema = mongosee.Schema;

const User = new Schema({
  username: { type: String, maxLength: 30 },
  password: { type: String, minLength: 6, maxLength: 30 },
  mail: { type: String },
  status: { type: Boolean, default: false },
  city: { type: String },
  numberphone: { type: String }
}, {
  timestamps: true
});

module.exports = mongosee.model('User', User);