
const shortid = require('shortid');

// firebase
const firebase = require("firebase/app")
require('firebase/auth');
require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyBn34l1ATJpRuPLcP8T77r80ss-6gn2GI8",
  authDomain: "teamworks-91376.firebaseapp.com",
  databaseURL: "https://teamworks-91376-default-rtdb.firebaseio.com",
  projectId: "teamworks-91376",
  storageBucket: "teamworks-91376.appspot.com",
  messagingSenderId: "629043600230",
  appId: "1:629043600230:web:a0f98f11c01e80bd0446a7",
  measurementId: "G-1ZFYV1Z7KB"
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
