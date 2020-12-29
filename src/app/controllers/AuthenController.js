const jsonInstance = require('../utils/JsonUtils');
const responeInstance = require('../utils/ResponeUtils');
const { validationResult } = require('express-validator');

const authenService = require('../service/AuthenService');

class AuthenController {
  //GET
  async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      responeInstance
        .error422(res, jsonInstance.jsonNoData({ errors: errors.array() }));
      return;
    }

    var respone = {
      password: req.body.password,
      mail: req.body.mail
    };

    if (respone.password && respone.mail) {

      await authenService.loginWithMail(respone.mail, respone.password)
        .then((user) => {
          responeInstance
            .success200(res, jsonInstance.toJsonWithData(`LOGIN SUCCCESS!`, user));
        })
        .catch((err) => {
          responeInstance
            .error400(res, jsonInstance.jsonNoData(err.message));
        })

    } else {
      responeInstance
        .error400(res, jsonInstance.jsonNoData("error query"));
    }
  }

  async logout(req, res) {
    let id = req.params.id

    await authenService.logoutWithId(id)
      .then((user) => {
        responeInstance
          .success200(res, jsonInstance.toJsonWithData(`LOGOUT SUCCCESS!`, user));
      })
      .catch((err) => {
        responeInstance
          .error400(res, jsonInstance.jsonNoData(err.message));
      })
  }

}
module.exports = new AuthenController;