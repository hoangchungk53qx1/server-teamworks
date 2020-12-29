const express = require("express");
const router = express.Router();
const path = require("path");

const taskRouter = require("../app/controllers/TaskController");
const { validate } = require("../app/validate/UserValidate");

const multer = require("multer");

// SET STORAGE
var storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

const uploads = multer({
  storage: storage,
});

router.get("/query/:id", taskRouter.query);
router.post("/add/:category", taskRouter.add);
router.post("/delete/:category", taskRouter.delete);
router.post("/update/:id", taskRouter.update);
router.get("/", taskRouter.queryAll);

router.post("/update/deadline/:id", taskRouter.changeDeadline);
router.post("/update/:id/rename/:idSubtask", taskRouter.renameSubtask);
router.post("/:id/add-attachment", uploads.single("attachment"), taskRouter.addAttachment);
router.post("/:id/add-attachment-link", uploads.single("attachment"), taskRouter.addAttachmentLink);
router.post("/:id/delete-attachment/:idAttachment", taskRouter.deleteAttachment);
module.exports = router;
