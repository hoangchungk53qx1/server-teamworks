
const path = require('path');
const express = require("express");
const roomController = require("../app/controllers/RoomController");
const router = express.Router();

router.get("/:id", roomController.query);
// router.get("/noti/get", roomController.sendNotifi)
router.get("/query/:idUser", roomController.getAllRoomWithUser)
router.post("/create", roomController.createRoom);
router.post("/:idRoom/add-user", roomController.addUserInRoom);
router.post("/:idRoom/find-user", roomController.findUserInRoom);
router.post("/:idRoom/delete/:idUser", roomController.deleteUser);
router.post("/:idRoom/deleteRoom/", roomController.deleteRoom);
router.post("/:idRoom/set-level/:idUser", roomController.setLevelUser);
router.post("/:idRoom/stage/create", roomController.addStageInRoom);
router.post("/:idRoom/deleteStage/:idStage", roomController.deleteStageInRoom);
router.post("/:idRoom/find-username", roomController.findUserByName);
router.get("/:idRoom/stage", roomController.getStageInRoom);
router.get("/:idRoom/user", roomController.getUserInRoom)
// router.get("/search",roomController.searchRoom);
router.post("/:idRoom/stage/rename", roomController.renameStage)
router.get("/", roomController.queryAll);
module.exports = router;
