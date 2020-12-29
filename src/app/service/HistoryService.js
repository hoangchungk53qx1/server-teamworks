
const shortid = require('shortid');

// firebase
const firebase = require("firebase/app")
require('firebase/auth');
require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyA86VqzMtZ1szOW-D9yTg-kHKpkW_gSINE",
  authDomain: "teamwork-7bfc3.firebaseapp.com",
  databaseURL: "https://teamwork-7bfc3-default-rtdb.firebaseio.com",
  projectId: "teamwork-7bfc3",
  storageBucket: "teamwork-7bfc3.appspot.com",
  messagingSenderId: "736416770755",
  appId: "1:736416770755:web:be3e8677332b673b551076",
  measurementId: "G-QEQC4LH8X1"
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}
var realtimeDatabase = firebase.database()

class HistoryService {

  async userUpdate(idUser, content) {
    let shortId = shortid.generate()

    realtimeDatabase.ref('/users').child(shortId).set({
      "idUserPerformer": idUser.toString(),
      "category": "profile",
      "content": content,
      "timestamp": Date.now().valueOf()
    })
  }
  
  async roomCreated(idRoom, idUserAction) {
    realtimeDatabase.ref('/rooms/').child(shortid.generate()).set({
      "idCategory": idRoom.toString(),
      "idUserAction": idUserAction.toString(),
      "idUserAaffected": null,
      "content": "đã tạo",
      "category": "room",
      "timestamp": Date.now().valueOf()
    })
  }

  async roomAddMember(idRoom, idUserAction, idUserAdded) {
    realtimeDatabase.ref('/rooms/').child(shortid.generate()).set({
      "idCategory": idRoom.toString(),
      "idUserAction": idUserAction.toString(),
      "idUserAaffected": idUserAdded.toString(),
      "content": "đã thêm",
      "category": "room",
      "timestamp": Date.now().valueOf()
    })
  }

  async roomDeleteMember(idRoom, idUserAction, idUserDidDelete) {
    realtimeDatabase.ref('/rooms/').child(shortid.generate()).set({
      "idCategory": idRoom.toString(),
      "idUserAction": idUserAction.toString(),
      "idUserAaffected": idUserDidDelete.toString(),
      "content": "đã xoá",
      "category": "room",
      "timestamp": Date.now().valueOf()
    })
  }

  async roomAddTask(idRoom, idUserAction, nameTask) {
    realtimeDatabase.ref('/rooms/').child(shortid.generate()).set({
      "idCategory": idRoom.toString(),
      "idUserAction": idUserAction.toString(),
      "idUserAaffected": null,
      "content": `đã thêm công việc ${nameTask}`,
      "category": "room",
      "timestamp": Date.now().valueOf()
    })
  }

  async roomDeleteTask(idRoom, idUserAction, nameTask) {
    realtimeDatabase.ref('/rooms/').child(shortid.generate()).set({
      "idCategory": idRoom.toString(),
      "idUserAction": idUserAction.toString(),
      "idUserAaffected": null,
      "content": `đã xoá công việc ${nameTask}`,
      "category": "room",
      "timestamp": Date.now().valueOf()
    })
  }

  async roomAddStage(idRoom, idUserAction, nameStage) {
    realtimeDatabase.ref('/rooms/').child(shortid.generate()).set({
      "idCategory": idRoom.toString(),
      "idUserAction": idUserAction.toString(),
      "idUserAaffected": null,
      "content": `đã thêm giai đoạn ${nameStage}`,
      "category": "room",
      "timestamp": Date.now().valueOf()
    })
  }

  async roomDeleteStage(idRoom, idUserAction, nameStage) {
    realtimeDatabase.ref('/rooms/').child(shortid.generate()).set({
      "idCategory": idRoom.toString(),
      "idUserAction": idUserAction.toString(),
      "idUserAaffected": null,
      "content": `đã xoá giai đoạn ${nameStage}`,
      "category": "room",
      "timestamp": Date.now().valueOf()
    })
  }

  async roomMoveTask(idRoom, idUserAction, nameStageFrom, nameStageTo) {
    realtimeDatabase.ref('/rooms/').child(shortid.generate()).set({
      "idCategory": idRoom.toString(),
      "idUserAction": idUserAction.toString(),
      "idUserAaffected": null,
      "content": `đã chuyển nhiệm vụ ${nameStage} từ ${nameStageFrom} đến ${nameStageTo}`,
      "category": "room",
      "timestamp": Date.now().valueOf()
    })
  }

  async roomUpdateInfo(idRoom, idUserAction) {
    realtimeDatabase.ref('/rooms/').child(shortid.generate()).set({
      "idCategory": idRoom.toString(),
      "idUserAction": idUserAction.toString(),
      "idUserAaffected": null,
      "content": `Cập nhật thông tin phòng`,
      "category": "room",
      "timestamp": Date.now().valueOf()
    })
  }

  async roomSetLevel(idRoom, idUserAction, idUserDidSet, nameLevelTo) {
    realtimeDatabase.ref('/rooms/').child(shortid.generate()).set({
      "idCategory": idRoom.toString(),
      "idUserAction": idUserAction.toString(),
      "idUserAaffected": idUserDidSet.toString(),
      "level": nameLevelTo,
      "content": `đã thiết lập`,
      "category": "room",
      "timestamp": Date.now().valueOf()
    })
  }

  async taskAddMember(idTask, idUserAction, idUserAdded) {
    realtimeDatabase.ref('/tasks/').child(shortid.generate()).set({
      "idCategory": idTask.toString(),
      "idUserAction": idUserAction.toString(),
      "idUserAaffected": idUserAdded.toString(),
      "content": "đã thêm",
      "category": "task",
      "timestamp": Date.now().valueOf()
    })
  }

  async taskDeleteMember(idTask, idUserAction, idUserAdded) {
    realtimeDatabase.ref('/tasks/').child(shortid.generate()).set({
      "idCategory": idTask.toString(),
      "idUserAction": idUserAction.toString(),
      "idUserAaffected": idUserAdded.toString(),
      "content": "đã loại trừ",
      "category": "task",
      "timestamp": Date.now().valueOf()
    })
  }

  async taskAddSubtask(idTask, idUserAction, nameSubtask) {
    realtimeDatabase.ref('/tasks/').child(shortid.generate()).set({
      "idCategory": idTask.toString(),
      "idUserAction": idUserAction.toString(),
      "idUserAaffected": null,
      "content": `đã thêm ${nameSubtask}`,
      "category": "task",
      "timestamp": Date.now().valueOf()
    })
  }

  async taskDeleteSubtask(idTask, idUserAction, nameSubtask) {
    realtimeDatabase.ref('/tasks/').child(shortid.generate()).set({
      "idCategory": idTask.toString(),
      "idUserAction": idUserAction.toString(),
      "idUserAaffected": null,
      "content": `đã xoá ${nameSubtask}`,
      "category": "task",
      "timestamp": Date.now().valueOf()
    })
  }

  async taskAddAttachment(idTask, idUserAction) {
    realtimeDatabase.ref('/tasks/').child(shortid.generate()).set({
      "idCategory": idTask.toString(),
      "idUserAction": idUserAction.toString(),
      "idUserAaffected": null,
      "content": `đã thêm tài liệu mới`,
      "category": "task",
      "timestamp": Date.now().valueOf()
    })
  }

  async taskDeleteAttachment(idTask, idUserAction) {
    realtimeDatabase.ref('/tasks/').child(shortid.generate()).set({
      "idCategory": idTask.toString(),
      "idUserAction": idUserAction.toString(),
      "idUserAaffected": null,
      "content": `đã xoá tài liệu`,
      "category": "task",
      "timestamp": Date.now().valueOf()
    })
  }

  async taskAddComment(idTask, idUserAction, content) {
    realtimeDatabase.ref('/tasks/').child(shortid.generate()).set({
      "idCategory": idTask.toString(),
      "idUserAction": idUserAction.toString(),
      "idUserAaffected": null,
      "content": `đã bình luận ${content}`,
      "category": "task",
      "timestamp": Date.now().valueOf()
    })
  }

  async taskDeleteComment(idTask, idUserAction) {
    realtimeDatabase.ref('/tasks/').child(shortid.generate()).set({
      "idCategory": idTask.toString(),
      "idUserAction": idUserAction.toString(),
      "idUserAaffected": null,
      "content": `đã xoá bình luận`,
      "category": "task",
      "timestamp": Date.now().valueOf()
    })
  }

  async taskUpdateDeadline(idTask, idUserAction) {
    realtimeDatabase.ref('/tasks/').child(shortid.generate()).set({
      "idCategory": idTask.toString(),
      "idUserAction": idUserAction.toString(),
      "idUserAaffected": null,
      "content": `đã cập nhật hạn làm việc`,
      "category": "task",
      "timestamp": Date.now().valueOf()
    })
  }
}

module.exports = new HistoryService;
