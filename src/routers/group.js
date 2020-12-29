const express = require("express");

const router = express.Router();
const Group = require('../app/models/Group');
const Room = require("../app/models/Room");
const groupRouter = require('../app/controllers/GroupController');

router.post('/create/:idUser',groupRouter.createGroup);
router.post("/add-room/:idGroup",groupRouter.addRoom);
// router.post("/delete/:idGroup/room", groupRouter.deleteRoomInGroup)
router.get("/query/user/:idUser",groupRouter.queryGroupByUser);
router.get("/query/:idGroup",groupRouter.queryRoomInGroup);
router.get("/:id",groupRouter.queryGroup);
router.get("/",groupRouter.queryAll);

module.exports = router;
