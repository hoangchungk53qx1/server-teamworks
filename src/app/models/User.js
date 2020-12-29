const mongosee = require('mongoose');
const Schema = mongosee.Schema;

const User = new Schema({
  fullname: { type: String, maxLength: 100 },
  password: { type: String, minLength: 6, maxLength: 30 },
  mail: { type: String },
  status: { type: Boolean, default: false },
  city: { type: String },
  numberphone: { type: String },
  image: {
    name: { type: String },
    url: { type: String }
  },

  createAt: { type: Number, default: Date.now().valueOf() },
  updateAt: { type: Number, default: Date.now().valueOf() }

});

module.exports = mongosee.model('User', User);