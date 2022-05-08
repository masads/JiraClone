const conn = require("../config/db.js");

const check_project_code_and_isAdmin=async (code,id)=>{

    let [results] = await conn.execute("SELECT project_code FROM projects_users WHERE project_code = ? and user_id=? and role='admin' ", [
        code,
        id
      ]);
    return results.length>0 
}

const check_task=async (name,code)=>{
    let [results] = await conn.execute("SELECT project_code FROM tasks WHERE project_code = ? and name=?", [
        code,
        name
      ]);
    return results.length<=0
}
const check_task_with_id=async (userid,id)=>{
    let [results] = await conn.execute("SELECT project_code FROM tasks WHERE task_id = ? and assigned_user_id=?", [
        id,
        userid
      ]);
      console.log(results)
    return results.length>0
}

const createTask = async (req, res, next) => {
    
    const data=req.body;
    try{
        
        if(await check_project_code_and_isAdmin(data.project_code,data.user_id) && await check_task(data.name,data.project_code))
        {
            const [result1] = await conn.execute(
            "INSERT INTO tasks(project_code,name,nature,description,start_date,end_date,assigned_user_id) VALUES(?,?,?,?,?,?,?)",
            [
                data.project_code,
                data.name,
                data.nature,
                data.description,
                data.start_date,    
                (data.end_date==null)?(null):(data.end_date),
                null
            ]
            );
            const [result2] = await conn.execute(
                "INSERT INTO tasklog(task_id,status) VALUES(?,?)",
                [
                    result1.insertId,
                    "Todo",
                ]
                );
            if( result1.affectedRows>0 && result2.affectedRows>0)
            {
                res.status(200).json({ message: "Task Created" ,status:true});
            }else
            {
                throw("Error found in project creation")
            }
        }else
        {
            throw("User cannot create tasks or code is wrong or task already created")
        }
    }catch(err)
    {
        res.status(404).json({ message: err ,status:false});
    }
};

const updateTask=async(req,res,next)=>{
    const data=req.body;
    try{
        console.log(data)
        let isName=true
        if(data.name!=data.newName)
        {
            isName=await check_task(data.newName,data.project_code)
        }
        if(await check_project_code_and_isAdmin(data.project_code,data.admin_id) && !(await check_task(data.name,data.project_code)) && isName)
        {
            const [result] = await conn.execute(
            "UPDATE tasks SET name=?,nature=?,description=?,end_date=?,assigned_user_id=? where name=? and project_code=?",
            [
                data.newName,
                data.nature,
                data.description,
                (data.end_date==null)?(null):(data.end_date),
                (data.user_id==null || data.user_id==0)?(null):(data.user_id),
                data.name,
                data.project_code,
            ]
            );
            if( result.affectedRows>0 )
            {
                res.status(200).json({ message: "Task Updated" ,status:true});
            }else
            {
                throw("Error found in project update")
            }
        }else
        {
            throw("User cannot update tasks or code is wrong or task already created")
        }
    }catch(err)
    {
        res.status(404).json({ message: err ,status:false});
    }
}

const updateStatus=async(req,res,next)=>{
    const data=req.body;
    let date_ob = new Date();
    let day = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    console.log("a")
    console.log(data)
    let dateTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    try
    {
        let isUser=await check_task_with_id(data.user_id,data.task_id)
        console.log(isUser)
        let isAdmin=await check_project_code_and_isAdmin(data.project_code,data.user_id)
        console.log(isAdmin,isUser)
        if(data.status=='Closed')
        {
            isUser=false
        }
        if(isUser || isAdmin)
        {   

            const [result1] = await conn.execute(
            "UPDATE tasklog SET end_time=? where task_id=? and status=?",
            [
                dateTime,
                data.task_id,
                data.status
            ]   
            );

            const [result2] = await conn.execute(
            "INSERT INTO tasklog(task_id,status,start_time) VALUES(?,?,?)",
            [
                data.task_id,
                data.newstatus,
                dateTime
            ]
            );
            if( result1.affectedRows>0 && result2.affectedRows>0)
            {
                res.status(200).json({ message: "Task Updated" ,status:true});
            }else
            {
                throw("Error found in project creation")
            }
        }else
        {
            throw("Error in Status updation")
        }
    }
    catch(err)
    {
        res.status(404).json({ message: err ,status:false});
    }
}
const getTasks=async(req,res,next)=>{
    const data=req.query
    try
    {
        let [result]=await conn.execute("SELECT * from tasks where project_code=?",
        [data.code])
        if(result.length>0)
        {   

            for(let i=0;i<result.length;i++)
            {
                let [status]=await conn.execute("SELECT status from tasklog where task_id=? and end_time is null",
                [result[i].task_id])
                result[i]["status"]=status[0]
                if(result[i].assigned_user_id!=null)
                {
                    let [user]=await conn.execute("SELECT * from users where user_id=?",
                    [result[i].assigned_user_id])
                    result[i].assigned_user_id=user[0]
                }
            }
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
module.exports = { createTask,updateTask,updateStatus,getTasks };