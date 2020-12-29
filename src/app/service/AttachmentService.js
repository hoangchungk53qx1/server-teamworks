
const taskModel = require("../models/Task");
const attachmentModel = require("../models/Attachments");

const firebaseManager = require('./FirebaseManager');
class AttachmentService {

  async create(idTask, fileName, data, metaData) {
    return await taskModel.findById(idTask)
      .exec()
      .then(async (task) => {
        if (task == null) {
          throw new Error("invalid task")
        }

        return await firebaseManager.uploadImage(null, `attachments/${fileName}`, data, metaData)
          .then(async (url) => {
            var attachment = new attachmentModel()
            attachment.type = "image"
            attachment.data = {
              name: fileName,
              url: url
            }

            attachment.idTask = idTask

            try {

              let result = await attachment.save()

              return result
            } catch (err) {
              throw new Error(err.message)
            }
          })
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async createLink(idTask, link) {
    return await taskModel.findById(idTask)
      .exec()
      .then(async (task) => {
        if (task == null) {
          throw new Error("invalid task")
        }

        var attachment = new attachmentModel()
        attachment.type = "link"
        attachment.data = {
          name: link,
          url: link
        }

        attachment.idTask = idTask

        try {

          let result = await attachment.save()

          return result
        } catch (err) {
          throw new Error(err.message)
        }
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async delete(id) {

    return await attachmentModel.findByIdAndDelete(id)
      .exec()
      .then(async (attachment) => {
        if (attachment == null) {
          throw new Error("invalid attachment")
        }

        if (attachment.type != "link"){
          _ = await firebaseManager.deleteImage(`attachments/${attachment.data.name}`)  
        }

        return attachment
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async update(id, idTask, data) {
    return await attachmentModel.findByIdAndUpdate(id, { idTask: idTask, data: data }, { new: true })
      .exec()
      .then((attachment) => {
        if (attachment == null) {
          throw new Error("invalid attachment")
        }

        return attachment
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }
}

module.exports = new AttachmentService();
