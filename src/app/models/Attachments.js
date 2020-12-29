const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Attachments = new Schema({
  /** 
   * type of  attachment
   * 0: image
   * 1: file
   * 2: link
   */
  type: { type: String },
  data: {
    name: { type: String },
    url: { type: String }
  },
  idTask: { type: String },

  createAt: { type: Number, default: Date.now().valueOf() },
  updateAt: { type: Number, default: Date.now().valueOf() }
});

module.exports = mongoose.model('Attachments', Attachments);
