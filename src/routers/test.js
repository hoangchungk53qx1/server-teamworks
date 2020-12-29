const express = require('express');
const router = express.Router();

const testRouter = require('../app/controllers/TestController');
const multer = require("multer");

// SET STORAGE
var storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
  
  var upload = multer({ storage: storage })

//   router.post('/connect1', multer().none(), testRouter.filea);
// router.post('/connect', upload.any(), testRouter.connect);
// router.get('/', testRouter.queryAll) 

module.exports = router;
