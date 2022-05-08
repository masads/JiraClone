const conn = require("../config/db.js");
const nodemailer = require('nodemailer');
const check_project_code=async (code)=>{
    let [results] = await conn.execute("SELECT project_code FROM projects WHERE project_code = ?", [
        code,
      ]);
      console.log(results.length<=0 )
    return results.length<=0 
}

const check_project_name=async (name)=>{
    let [results] = await conn.execute("SELECT project_name FROM projects WHERE project_name = ?", [
        name,
      ]);
    return results.length<=0 
}

const userJoin=async (code,userid)=>{
    let [results] = await conn.execute("SELECT * FROM projects_users WHERE project_code = ? and user_id=?", [
        code,userid,
      ]);
      console.log(results.length<=0)
    return results.length<=0
}

const check_project_code_and_isAdmin=async (code,id)=>{

    let [results] = await conn.execute("SELECT project_code FROM projects_users WHERE project_code = ? and user_id=? and role='admin' ", [
        code,
        id
      ]);
    return results.length>0 
}
const check_user_in_project=async(code,id)=>{
    let [results] = await conn.execute("SELECT project_code FROM projects_users WHERE project_code = ? and user_id=? ", [
        code,
        id
      ]);
    return results.length>0 
}

const isUserExisit=async(email)=>{
    let [results] = await conn.execute("SELECT user_id FROM users WHERE email = ?", [
        email
      ]);
    return results.length>0 
}
const isUserMember=async(id,code,status)=>{
    let [results] = await conn.execute("SELECT project_code FROM projects_users WHERE project_code = ? and user_id=? and role=?", [
        code,id,status
      ]);
    return results.length>0 
}
const createProject = async (req, res, next) => {
    
    const data=req.body;
    try{
        let IsProjectCode=await check_project_code(data.project_code)
        let IsProjectName=await check_project_name(data.project_name)
        console.log(IsProjectCode,IsProjectName)
        if(IsProjectName && IsProjectCode)
        {
            const [result1] = await conn.execute(
                "INSERT INTO projects( project_code,project_name) VALUES(?,?)",
                [
                    data.project_code,
                    data.project_name 
                ]
              );
            const [result2] = await conn.execute(
            "INSERT INTO projects_users( project_code,user_id,role) VALUES(?,?,?)",
            [
                data.project_code,
                data.user_id,
                "admin"
            ]
            );
            if(result1.affectedRows>0 && result2.affectedRows>0)
            {
                res.status(200).json({ message: "Project Created" ,status:true});
            }else
            {
                throw("Error found in project creation")
            }
        }else
        {
            let message='';
            if(!IsProjectName)
            {
                message="name"
            }else if(!IsProjectCode)
            {
                message="code"
            }
            
            throw(`Error found in Project ${message}`)
        }
    }catch(err)
    {
        res.status(404).json({ message: err ,status:false});
    }
};

const userJoinProject=async(req,res,next)=>{
    const data=req.body;
        
    try{
        if(await userJoin(data.project_code,data.user_id) && !(await check_project_code(data.project_code)))
        {
            const [result] = await conn.execute(
            "INSERT INTO projects_users( project_code,user_id,role) VALUES(?,?,?)",
            [
                data.project_code,
                data.user_id,
                "member"
            ]
            );
            if(result.affectedRows>0)
            {
                res.status(200).json({ message: "User Joined" ,status:true});
            }else
            {
                throw("Error found in user joining")
            }
        }else
        {
            throw("Wrong Project Code or Already Joined")
        }
    }catch(err)
    {
        res.status(404).json({ message: err ,status:false});
    }
}

const removeMemberFromProject = async (req, res, next) => {
    
    const data=req.body;
    console.log(data)
    try{
        let isAdmin=await check_project_code_and_isAdmin(data.project_code,data.admin_id)
        let isUserExisit=await check_user_in_project(data.project_code,data.user_id)
        if(isAdmin && isUserExisit)
        {
            const [result]=await conn.execute("DELETE FROM projects_users WHERE user_id=? and project_code=?",
            [data.user_id,data.project_code])
            if(result.affectedRows>0)
            {
                res.status(200).json({ message: "User remove from project" ,status:true});
            }else
            {
                throw("Error in removing user from project")
            }
        }else
        {
            throw("User not in project")
        }
    }catch(err)
    {
        res.status(404).json({ message: err ,status:false});
    }
};
const getProjects=async(req,res,next)=>{
    const data=req.query
    try
    {
        let [result]=await conn.execute("SELECT P.* from projects_users PU JOIN projects P on P.project_code=PU.project_code  where PU.user_id=?",
        [data.userid])
        if(result.length>0)
        {
            res.status(200).json({ message: result ,status:true});
        }else
        {
            throw("Error in getting projects")
        }
    }catch(err)
    {
        res.status(404).json({ message: err ,status:false});
    }
}
const getProjectReport=async(req,res,next)=>{
    const data=req.query
    try
    {
        let [result]=await conn.execute("SELECT P.* from projects_users PU JOIN projects P on P.project_code=PU.project_code  where PU.user_id=?",
        [data.admin_id])
        if(result.length>0)
        {
            for(let i=0;i<result.length;i++)
            {
                console.log(result[i])
                let [tasks]=await conn.execute("SELECT * from tasks where project_code=?",
                [result[i].project_code])
                result[i]["taskgenerated"]=tasks.length
                for(let j=0;j<tasks.length;j++)
                {
                    let [time]=await conn.execute("SELECT TIMEDIFF(end_time,start_time) as 'time' FROM tasklog WHERE task_id=? and status='inProgress'",
                    [tasks[j].task_id])
                    let totalTime=0
                    time.forEach((Element)=>{
                        totalTime=totalTime+Element.time
                    })
                    tasks[j]["time"]=totalTime
                }
                result[i]["tasks"]=[tasks]
            }

            res.status(200).json({ message: result ,status:true});
        }else
        {
            throw("Error in getting projects report")
        }
    }catch(err)
    {
        res.status(404).json({ message: err ,status:false});
    }
}
const addMember=async(req,res,next)=>{
    const data=req.body
    try{
        if(await check_project_code_and_isAdmin(data.project_code,data.admin_id) && await isUserExisit(data.user_email))
        {
            const sendEmailToUser=async(email)=>{
                return new Promise((resolve,reject)=>{

                    let transporter =  nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                        user: 'asadsummair2019@gmail.com',
                        pass: 'wvumyonghqkzixrt'
                        }
                    });
                    
                    let mailOptions = {
                        from: 'asadsummair2019@gmail.com',
                        to: email,
                        subject: 'devday22web Project Code',
                        html: `<h1>Welcome</h1><p>Your Project Code is ${data.project_code}</p>`
                    }
                    
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log("error is "+error);
                           resolve(false); // or use rejcet(false) but then you will have to handle errors
                        } 
                       else {
                           console.log('Email sent: ' + info.response);
                           resolve(true);
                        }
                    });
                });
            }
            if(await sendEmailToUser(data.user_email)){
            res.status(200).json({ message: "mail sended" ,status:true});
            }else
            {
                throw("Error in email")
            }
        }else
        {
            throw("Error in adding member")
        }
    }catch(err)
    {
        res.status(404).json({ message: err ,status:false});
    }
}

const changeRole=async(req,res,next)=>{
    const data=req.body
    try{
        if(await check_project_code_and_isAdmin(data.project_code,data.admin_id) && isUserMember(data.user_id,data.project_code,data.status))
        {
            const [result] = await conn.execute(
                "UPDATE projects_users SET role=? where user_id=? and project_code=? and role=?",
                [
                    data.newStatus,
                    data.user_id,
                    data.project_code,
                    data.status
                ]
                );
                if( result.affectedRows>0 )
                {
                    res.status(200).json({ message: "Role Updated" ,status:true});
                }else
                {
                    throw("Error found in Role updation")
                }
        }else
        {
            throw("Error in adding member")
        }
    }catch(err)
    {
        res.status(404).json({ message: err ,status:false});
    }
}
const getMember=async(req,res,next)=>{
    const data=req.query
    try
    {
        let [result]=await conn.execute("SELECT U.* FROM projects_users PU join users U on PU.user_id=U.user_id where PU.project_code='REN' ",
        [data.code])
        if(result.length>0)
        {   
            res.status(200).json({ message: result ,status:true});
        }else
        {
            throw("Error in getting tasks")
        }
    }catch(err)
    {
        res.status(404).json({ message: err ,status:false});
    }
}
module.exports = { createProject,userJoinProject,removeMemberFromProject,getProjects,addMember,getProjectReport,changeRole,getMember };