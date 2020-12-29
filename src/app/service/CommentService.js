const commentModel = require('../models/Comment');
const userModel = require('../models/User');

class CommentService {

  async queryAll() {
    return await commentModel.find({})
      .exec()
      .then((comments) => {
        return comments
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async query(id, category = "") {
    switch (category) {
      case "user":
        return await commentModel.find({ idUser: id })
          .exec()
          .then((comments) => {
            return comments
          })
          .catch((err) => {
            throw new Error(err.message)
          })

      default:
        return await commentModel.findById(id)
          .exec()
          .then((comment) => {
            if (comment == null) {
              throw new Error(`invalid comment`)
            }

            return comment
          })
          .catch((err) => {
            throw new Error(err.message)
          })
    }
  }

  async create(idUser, content) {

    return await userModel.findById(idUser)
      .exec()
      .then(async (user) => {
        if (user == null) {
          throw new Error("invalid user")
        }

        var comment = new commentModel();
        comment.idUser = idUser
        comment.content = content

        try {
          let result = await comment.save()
          return result
        } catch {
          throw new Error("create comment error")
        }

      })
      .catch((err) => {
        throw new Error(err.message)
      })

  }

  async update(id, content, updateAt = Date.now().valueOf()) {
    return await commentModel.findByIdAndUpdate(id, { content: content, updateAt: updateAt }, { new: true })
      .exec()
      .then((comment) => {
        if (comment == null) {
          throw new Error("invalid comment")
        }

        return comment
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async delete(id) {

    return await commentModel.findByIdAndDelete(id)
      .exec()
      .then((comment) => {
        if (comment == null) {
          throw new Error("invalid comment")
        }

        return comment
      })
      .catch((err) => {
        throw new Error(err.message)
      })

  }
}

module.exports = new CommentService;
