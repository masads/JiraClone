const express = require("express");
const multer = require("multer");
const { signup, login} = require("../controllers/auth.js");
const { saveImage,getImage } = require("../controllers/images.js");
const { createProject,userJoinProject,removeMemberFromProject,getProjects,addMember,getProjectReport,changeRole,getMember } = require("../controllers/project.js")
const { createTask,updateTask,updateStatus,getTasks } = require("../controllers/task.js")

const storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, "./images");
    },
    filename(req, file, callback) {
      const name=file.originalname=Date.now()+file.originalname
      callback(null, name);
    },
  });
  const upload = multer({ storage:storage })
const router = express.Router();

router.post("/login", login);
router.post("/signup" , signup);
router.get("/getprojects",getProjects)
router.get("/getprojectreport",getProjectReport)
router.post("/changerole",changeRole)
router.post("/addmember",addMember)
router.post("/removemember",removeMemberFromProject)
router.post("/createproject",createProject)
router.post("/joinproject",userJoinProject)
router.post("/createtask",createTask)
router.post("/updatetask",updateTask)
router.post("/updatestatus",updateStatus)
router.get("/gettasks",getTasks)
router.post("/images", upload.single('image'), saveImage);
router.get("/images",getImage)
router.get("/getmembers",getMember)

module.exports = router;