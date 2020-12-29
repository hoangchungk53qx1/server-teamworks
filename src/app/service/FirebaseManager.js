var events = require('events');

var firebase = require('firebase/app');
_ = require('firebase/storage')
// const fs = require('fs');
global.XMLHttpRequest = require("xhr2");


// SET MULTER STORAGE
// var storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })
// var upload = multer({ storage: storage })

// SET FIREBASE STORAGE
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
// Points to the root reference
var storageRef = firebase.storage().ref();

class FirebaseManager {

  async deleteImage(path) {
    var deleteTask = storageRef.child(path)

    return await deleteTask.delete()
      .then(() => {
        return true
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async uploadImage(oldPath, path, data, metaData) {
    var uploadTask = storageRef.child(path).put(data, metaData);

    console.log(`oldPath = ${oldPath}`)

    if (oldPath != null) {
      var deleteTask = storageRef.child(oldPath)

      deleteTask.delete()
        .then(() => {
          console.log(`delete ok`)
        })
        .catch((err) => {
          console.log(`error delete ${err.message}`)
        })
    }

    var resolves;
    var rejects;

    const promise = new Promise((resolve, reject) => {
      resolves = resolve;
      rejects = reject;
    });

    promise.on = uploadTask.on
    promise.emit = uploadTask.emit

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          rejects(new Error(`error storage/unauthorized`))

        case 'storage/canceled':
          // User canceled the upload  
          rejects(new Error(`error storage/canceled`))
        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          rejects(new Error(`error age/unknown`))
      }
    }, () => {
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        // console.log('File available at', downloadURL);
        // console.log(`check ${typeof downloadURL}`);

        resolves(downloadURL)

        // return downloadURL
      });
    })

    return promise
  }
}

module.exports = new FirebaseManager;
