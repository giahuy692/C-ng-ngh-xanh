const path = require('path');
const express = require('express');
const multer  = require('multer');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../ProjectNJS/src/public/uploads')
    },
    filename: function (req, file, cb) {
      var ext = path.extname(file.originalname)
      cb(null, Date.now() + ext);
    }
  })
  
  const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, callback) {
      if(
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" 
      ){
        callback(null, true)
      } else{
        console.log('Only jpg & png, jpeg file supported!')
        callback(null, false)
      }
    },
    limits: {
      fileSize: 1024 * 1024 * 2
    }
  })

module.exports = upload;