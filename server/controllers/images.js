const conn = require("../config/db.js");
var path = require("path");
const fs = require("fs");
const { uploadFile }= require("../config/s3")

const saveImage = async (req, res, next) => {

    const file = req.file;
    // console.log(file.filename)
    res.status(200).json({ message: "image recvied",filename:file.filename });
};

const getImage = (req, res, next) => {
    console.log(req.query.path)
    if (
      fs.existsSync(path.join(__dirname, "../") + "/images/" + req.query.path)
    ) {
      res.sendFile(path.join(__dirname, "../") + "/images/" + req.query.path);
    } else {
      res.sendFile(path.join(__dirname, "../") + "/images/notfound.png");
    }
};

module.exports = { saveImage,getImage };