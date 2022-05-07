const express = require("express");
const multer = require("multer");
// const { uploadFile } = require("../config/s3.js");
const { signup, login} = require("../controllers/auth.js");
// const { saveImage} = require("../controllers/images.js");
const { createProject,userJoinProject,removeMemberFromProject,getProjects,addMember,getProjectReport,changeRole } = require("../controllers/project.js")
const { createTask,updateTask,updateStatus,getTasks } = require("../controllers/task.js")
// const upload = multer({dest:'images/'});
const router = express.Router();

router.post("/login", login);
router.post("/signup" , signup);
router.get("/getprojects",getProjects)
router.get("/getprojectreport",getProjectReport)
router.post("/changerole",changeRole)
router.post("/addmember",addMember)
router.delete("/removemember",removeMemberFromProject)
router.post("/createproject",createProject)
router.post("/joinproject",userJoinProject)
router.post("/createtask",createTask)
router.post("/updatetask",updateTask)
router.post("/updatestatus",updateStatus)
router.get("/gettasks",getTasks)
// router.post("/images", upload.single('Images'), saveImage);

module.exports = router;