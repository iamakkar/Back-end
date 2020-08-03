const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const multers3 = require("multer-s3");
const AWS = require("aws-sdk");
const User = mongoose.model("User");

//const User = mongoose.model("User");

//new s3
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

//storage definiton
const storage = multers3({
  s3: s3,
  bucket: "quizearn-profilepictures",
  acl: "public-read",
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    cb(null, Date.now().toString());
  },
});

const upload = multer({ storage }).single("data");

///upload route
router.post("/uploadimage", upload, (req, res) => {
  try {
    res.status(200);
    res.send({ location: req.file.location });

    console.log(req.file.location);
  } catch (err) {
    res.status(404).send(err);
    console.log(err);
  }
});

module.exports = router;
