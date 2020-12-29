const User = require('../models/User');
const Sync = require('sync');
const { validationResult } = require('express-validator');

class UserController {
  //GET
  query(req, res) {
    User.find({}, (err, users) => {
      if (!err) {
        res.json(users);
      } else {
        res
          .status(400)
          .json({
            message: "query error"
          });
      }
    });
  }

  //POST
  create(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    var respone = {
      username: req.query.username,
      password: req.query.password,
      mail: req.query.mail,
      status: false,
      city: req.query.city,
      numberphone: req.query.numberphone
    };

    var username = req.query.username.toString();
    var password = req.query.password.toString();
    var mail = req.query.mail.toString();

    var user = new User(req.query);

    console.log("res.body = " + req.body)
    console.log("res progress = " + respone);
    console.log("first_name = " + respone.first_name);

    User.findOne({ username: username }, (err, usr) => {
      if (err || usr == null) {
        user.save(function (err) {
          if (err) {
            res
              .status(400)
              .json({
                message: "error"
              });
            return;
          }
          res.end(`ADD ${username} SUCCCESS!`);
        });
      } else {
        res
          .status(400)
          .json({
            message: "Account already exists"
          });
      }
    })
  }

  //GET
  login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    var respone = {
      username: req.query.username,
      password: req.query.password,
    };

    User.findOne({ username: respone.username, password: respone.password }, (err, users) => {
      if (!err && users != null) {
        res.json(users);
      } else {
        res
          .status(400)
          .json({
            message: "invalid account"
          });
      }
    });
  }

  async update(req, res) {
    const errors = validationResult(req);

    // check url
    for (var param in req.query) {
      if (!(param == "user" || param == "password" | param == "mail" ||
        param == "status" || param == "city" || param == "numberphone")) {
        res
          .status(400)
          .json({
            message: "wrong url"
          });
        return
      }
      console.log(param);
    }

    // check param in url
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    var respone = {
      user: req.query.user,
      password: req.query.password,
      mail: req.query.mail,
      status: req.query.status,
      city: req.query.city,
      numberphone: req.query.numberphone
    };

    // check user exists
    if (respone.user != null) {
      await User.findOne({ username: respone.user }, async (err, user) => {
        if (err || user == null) {
          res
            .status(400)
            .json({
              message: "invalid account"
            });
        } else {
          //action update data
          let username = respone.user
          let password = respone.password
          let mail = respone.mail
          let status = respone.status
          let city = respone.city
          let numberphone = respone.numberphone

          if (password != null) {
            user.password = password;
          }
          if (mail != null) {
            user.mail = mail;
          }
          if (status != null) {
            user.status = status;
          } else {
            user.status = false;
          }
          if (city != null) {
            user.city = city;
          }
          if (numberphone != null) {
            user.numberphone = numberphone;
          }

          var successReturn;

          /* check query exists property */
          await User.findOneAndUpdate({ username: username }, user, { new: true }, (err, user) => {
            console.log(">>> password")
            if (!err) {
              successReturn = user;
              // Object.assign(successReturn, user);
            }
          })

          await User.findOneAndUpdate({ username: username }, user, { new: true }, (err, user) => {
            console.log(">>> mail")
            if (!err) {
              successReturn = user;
            }
          })

          await User.findOneAndUpdate({ username: username }, user, { new: true }, (err, user) => {
            console.log(">>> status")
            if (!err) {
              successReturn = user;
              // res.json(user);
            }
          })

          await User.findOneAndUpdate({ username: username }, user, { new: true }, (err, user) => {
            console.log(">>> city")
            if (!err) {
              successReturn = user;
              // res.json(user);
            }
          })

          await User.findOneAndUpdate({ username: username }, user, { new: true }, (err, user) => {
            console.log(">>> numberphone")
            if (!err) {
              successReturn = user;
              // res.json(user);
            }
          })
        }

        if (successReturn != {}) {
          console.log("add successfully!!!")
          console.log(successReturn)
          res
            .status(200)
            .json(successReturn);
        }
      });

    } else {
      res
        .status(400)
        .json({
          message: "wrong url"
        });
    }
  }

  validateParam(param) {
    return (
      param == "user" || param == "password" | param == "mail" ||
      param == "status" || param == "city" || param == "numberphone"
    )
  }
}
module.exports = new UserController;