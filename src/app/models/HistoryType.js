const mongosee = require('mongoose');
const Schema = mongosee.Schema;

// type bao gồm room, task, user
const HistoryType = new Schema({
  /**
   * type of history:
   * 0: history of room
   * 1: history of task
   * 3: history of subtask
   * 4: history of comment
   * 5: history of stage
   * 
   */
  category: { type: String },
  idCategory: { type: String },

}, {
  _id: false
})

module.exports = mongosee.model('HistoryType', HistoryType);
