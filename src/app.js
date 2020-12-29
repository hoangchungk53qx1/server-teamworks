const { json } = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const config = require('./config');
const db = require('./app/config/db/index');
//TODO: router
const router = require('./routers/index')

var app = express();

// conncet to DB
db.connect();
 
app.use(morgan('combined'))
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json()) 

// action routers
router(app);

app.listen(config.port, () => {
  console.log(`server listening at http://localhost:${config.port}`)
})