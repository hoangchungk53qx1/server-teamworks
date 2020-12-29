const userModel = require('../models/User');
const roomService = require('./RoomService')
const firebaseManager = require('./FirebaseManager');
const historyService = require("./HistoryService")
class UserService {
  //GET
  async queryAll() {
    return await userModel.find({})
      .exec()
      .then((users) => {
        if (users == null) {
          throw new Error("query error");
        }
        return users
      })
      .catch((err) => {
        throw new Error(err.message);
      })
  }

  async queryWithId(id) {

    return await userModel.findById(id)
      .exec()
      .then((user) => {
        if (user == null) {
          throw new Error("invalid user");
        }
        return user
      })
      .catch((err) => {
        throw new Error(err.message);
      })
  }

  //POST
  async create(fullname, password, mail, status, city, numberphone, image) {
    var newUser = new userModel();
    newUser.fullname = fullname
    newUser.password = password
    newUser.mail = mail
    newUser.status = status
    newUser.city = city
    newUser.numberphone = numberphone

    newUser.image = image

    return await userModel.findOne({ mail: mail })
      .exec()
      .then(async (user) => {
        if (user != null) {
          throw new Error(`mail is exists`)
        }

        try {
          let result = await newUser.save()

          console.log(`create user =${result}`)

          return result
        } catch (err) {
          throw new Error(err.message)
        }

      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async getAvatar(idUser) {
    return await userModel.findById(idUser)
      .exec()
      .then(async (user) => {
        if (user == null) {
          throw new Error(`invalid user`)
        }

        return user.image.url
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async changeAvatar(idUser, fileName, data, metaData) {
    return await userModel.findById(idUser)
      .exec()
      .then(async (user) => {
        if (user == null) {
          throw new Error(`invalid user`)
        }

        let oldPath = `users/${user.image.name}`
        if (user.image.name == null) {
          oldPath = null
        }
        let newPath = `users/${fileName}`
        return await firebaseManager.uploadImage(oldPath, newPath, data, metaData)
        .then(async (url) => {

          user.image = {
            name: fileName,
            url: url
          }

          try {
            await historyService.userUpdate(user._id, " đã cập nhật ảnh đại diện")
            await roomService.updateUserInRoom(user)
            return await user.save()
          } catch (err) {
            throw new Error(err.message)
          }
        })
        
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async changePassword(idUser, oldPassword, newPassword) {
    return await userModel.findById(idUser)
      .exec()
      .then(async (user) => {
        if (user == null) {
          throw new Error(`invalid user`)
        }

        if (user.password != oldPassword) {
          throw new Error(`wrong old password`)
        }

        user.password = newPassword
        await historyService.userUpdate(user._id, " đã đổi mật khẩu")
        try {
          await roomService.updateUserInRoom(user)
          return await user.save()
        } catch (error) {
          throw new Error(error.message)
        }
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async update(id, fullname, password, mail, status, city, numberphone, image, updateAt = Date.now().valueOf()) {

    return await userModel.findById(id)
      .exec()
      .then((user) => {
        if (user == null) {
          throw new Error(`invalid account`)
        }

        if (fullname != null) {
          user.fullname = fullname
        }

        if (password != null) {
          user.password = password;
        }
        if (mail != null) {
          user.mail = mail;
        }
        if (status != null) {
          user.status = status;
        }
        if (city != null) {
          user.city = city;
        }
        if (numberphone != null) {
          user.numberphone = numberphone;
        }
        if (image != null) {
          user.image = image;
        }

        user.updateAt = updateAt

        return user
      })
      .then(async (newUser) => {
        return await userModel.findByIdAndUpdate(id, newUser, { new: true })
          .exec()
          .then(async (userUpdated) => {
            if (userUpdated == null) {
              throw new Error(`updated error`)
            }
            await historyService.userUpdate(userUpdated._id, " đã cập nhật thông tin")
            await roomService.updateUserInRoom(userUpdated)
            return userUpdated
          })
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  validateParam(param) {
    return (
      param == "user" || param == "password" | param == "mail" ||
      param == "status" || param == "city" || param == "numberphone"
    )
  }
}

module.exports = new UserService;