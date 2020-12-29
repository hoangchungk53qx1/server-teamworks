const mongosee = require('mongoose');
const Schema = mongosee.Schema;

const HistoryType = require('./HistoryType');

const History = new Schema({

  // user performer change history
  idUserPerformer: {type: String},
  
  /**
   * category of history:
   * 0: history of room
   * 1: history of task
   * 3: history of subtask
   * 4: history of comment
   * 5: history of stage
   * 6: history of user
   * 
   */
  idCategory: {type: String},
  category: {type: String},
  timestamp: { type: Number, default: Date.now().timestamp },
  content: { type: String },

  createAt: { type: Number, default: Date.now().valueOf() },
  updateAt: { type: Number, default: Date.now().valueOf() }

});

module.exports = mongosee.model('History', History);