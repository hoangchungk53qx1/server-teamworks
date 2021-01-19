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
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
