const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { AwakeHeroku } = require('awake-heroku');
const multer = require('multer')


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
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());


app.use(express.static('public'));

AwakeHeroku.add({

  url: "https://server-teamworks.herokuapp.com/task/"

})

// action routers
router(app);

let port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`server listening at http://localhost:${config.port}`)
})
