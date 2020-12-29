const userModel = require('../models/User');

class AuthenService {

  //GET
  async loginWithUsername(usrname, password) {
    return await userModel.findOne({ username: usrname, password: password })
      .exec()
      .then(async (user) => {
        if (user == null) {
          throw new Error(`wrong username or password`)
        }

        try {
          user.status = true
          let result = await user.save()

          return result
        } catch (err) {
          throw new Error(err.message)
        }

      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  //GET
  async loginWithMail(mail, password) {

    return await userModel.findOne({ mail: mail, password: password })
      .exec()
      .then(async (user) => {
        if (user == null) {
          throw new Error(`wrong mail or password`)
        }

        try {
          user.status = true
          let result = await user.save()

          return result
        } catch (err) {
          throw new Error(err.message)
        }

      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async logoutWithId(idUser) {

    return await userModel.findByIdAndUpdate(idUser, {status: false}, {new: true})
      .exec()
      .then((user) => {
        if (user == null) {
          throw new Error(`wrong mail or password`)
        }

        return user
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }



}

module.exports = new AuthenService;
