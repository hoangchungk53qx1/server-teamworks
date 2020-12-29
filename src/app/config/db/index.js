const mongoose = require('mongoose');

async function connect() {

  try {
    await mongoose.connect('mongodb://localhost:27017/teamwork_dev', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });

    console.log('connect succesfully!!!');
  } catch (error) {
    console.log(`fail = ${error}`);
  }
}

module.exports = { connect };