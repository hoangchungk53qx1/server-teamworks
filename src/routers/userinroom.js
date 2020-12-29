const express = require('express');
const router = express.Router();
const userRouter = require('../app/controllers/UserInRoomController');
router.get('/query/:idRoom', userRouter.getFullUserInRoom);
// router.post('/:idRoom/search/:username',userRouter.findByName)

// router.get("/query/:idRoom", async (req, res) => {
//   const users = UserInRoom.find({ idRoom: req.params.idRoom })
//     .populate("rooms")
//     .exec((err, users) => {
//       if (err) return;
//       console.log(users);
//     });
// });
module.exports = router;