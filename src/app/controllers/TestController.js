// const jsonInstance = require('../utils/JsonUtils');
// const responeInstance = require('../utils/ResponeUtils');
// const admin = require('firebase-admin')
// const testModel = require('../models/Test')

// var firebase = require('firebase/app');
// _ = require('firebase/storage')
// const fs = require('fs');
// global.XMLHttpRequest = require("xhr2");


// class TestController {

//     async filea(req, res) {
//         console.log(req.body)
//         // console.log(req.body.image)
//     }

//     async connect(req, res) {
//         console.log(req.body)
//         console.log(req.body.image)

//         if (req.body.image == undefined) {
//             console.log(`type = ${req.files[0]}`)    
//         }
//         console.log(`type = ${req.file.mimetype}`)
//         var img = fs.readFileSync(req.file.path);
//         var encode_image = img.toString('base64');
//         // Define a JSONobject for the image attributes for saving to database

//         var finalImg = {
//             contentType: req.file.mimetype,
//             image: new Buffer(encode_image, 'base64')
//         };

//         var metadata = {
//             contentType: finalImg.contentType
//         };

//         const firebaseConfig = {
//             apiKey: "AIzaSyA86VqzMtZ1szOW-D9yTg-kHKpkW_gSINE",
//             authDomain: "teamwork-7bfc3.firebaseapp.com",
//             databaseURL: "https://teamwork-7bfc3-default-rtdb.firebaseio.com",
//             projectId: "teamwork-7bfc3",
//             storageBucket: "teamwork-7bfc3.appspot.com",
//             messagingSenderId: "736416770755",
//             appId: "1:736416770755:web:be3e8677332b673b551076",
//             measurementId: "G-QEQC4LH8X1"
//         };

//         // var defaultProject;

//         if (!firebase.apps.length) {
//             // defaultProject = firebase.initializeApp(firebaseConfig);
//             firebase.initializeApp(firebaseConfig)
//         }
//         // else {
//         //     defaultProject = firebase.app() // if already initialized, use that one
//         // }

//         console.log(`name Project = ${firebase.app().name}`)
//         // Points to the root reference
//         var storageRef = firebase.storage().ref();

//         // Points to 'images'
//         var imagesRef = storageRef.child('images');

//         // Points to 'images/space.jpg'
//         // Note that you can use variables to create child values
//         var fileName = 'space.jpg';
//         var spaceRef = imagesRef.child(fileName);

//         // File path is 'images/space.jpg'
//         var path = spaceRef.fullPath

//         // File name is 'space.jpg'
//         var name = spaceRef.name

//         // Points to 'images'
//         var _imagesRef = spaceRef.parent;

//         var bucket = spaceRef.bucket;

//         console.log(`path = ${path} - name = ${name} - imageRef = ${_imagesRef} - bucket = ${bucket}`)

        
//         console.log(`name image = ${req.file.filename}`)
//         console.log(`name image1 = ${req.file.fieldname}`)
//         // Upload file and metadata to the object
//         var uploadTask = storageRef.child("images/" + req.file.filename).put(finalImg.image, metadata);

//         // Listen for state changes, errors, and completion of the upload.
//         uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
//             // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//             var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             console.log('Upload is ' + progress + '% done');
//             switch (snapshot.state) {
//                 case firebase.storage.TaskState.PAUSED: // or 'paused'
//                     console.log('Upload is paused');
//                     break;
//                 case firebase.storage.TaskState.RUNNING: // or 'running'
//                     console.log('Upload is running');
//                     break;
//             }
//         }, (error) => {
//             // A full list of error codes is available at
//             // https://firebase.google.com/docs/storage/web/handle-errors
//             switch (error.code) {
//                 case 'storage/unauthorized':
//                     // User doesn't have permission to access the object
//                     console.log(`error storage/unauthorized`)
//                     break;

//                 case 'storage/canceled':
//                     // User canceled the upload
//                     console.log(`error v`)
//                     break;
//                 case 'storage/unknown':
//                     console.log(`error storage/unknown`)
//                     // Unknown error occurred, inspect error.serverResponse
//                     break;
//             }
//         }, () => {
//             // Upload completed successfully, now we can get the download URL
//             uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
//                 console.log('File available at', downloadURL);

//                 res.json({ 
//                     message: "SUCCESS",
//                     link: downloadURL
//                 })
//             });
//         }
//         )

//     }

//     async queryAll(req, res) {
//         await testModel.find({})
//             .exec()
//             .then((tests) => {
//                 responeInstance
//                     .success200(res, jsonInstance.toJsonWithData(`LOGIN SUCCCESS!`, tests));
//             })
//             .catch((err) => {
//                 responeInstance
//                     .error400(res, jsonInstance.jsonNoData(err.message));
//             })
//     }

// }
// module.exports = new TestController;