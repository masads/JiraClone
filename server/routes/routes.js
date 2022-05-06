const express = require("express");
const multer = require("multer");
const { uploadFile } = require("../config/s3.js");
const { signup, login} = require("../controllers/auth.js");
const { saveImage} = require("../controllers/images.js");
const upload = multer({dest:'images/'});
const router = express.Router();

uploadFile("")
router.post("/login", login);
router.post("/signup" , signup);
router.post("/images", upload.array('Images',3), saveImage);

module.exports = router;