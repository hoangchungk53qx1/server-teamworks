const mongosee = require('mongoose');
const Schema = mongosee.Schema;

const Test = new Schema({
  
  value: {type: String},

  createAt: { type: Number, default: Date.now().valueOf() },
  updateAt: { type: Number, default: Date.now().valueOf() }

});

module.exports = mongosee.model('Test', Test);