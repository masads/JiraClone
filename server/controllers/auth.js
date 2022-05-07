const conn = require("../config/db.js");
const bcrypt = require("bcrypt");

const check_email=async (email)=>{
    let [results] = await conn.execute("SELECT user_id FROM users WHERE email = ?", [
        email,
      ]);
    return results.length>0 
}

const signup = async (req, res, next) => {
    const data=req.body;
    console.log(data)
    try
    {
        if(!(await check_email(data.email)))
        {
            let hashedPassword = await bcrypt.hash(data.password, 12);
            const [result] = await conn.execute(
                "INSERT INTO users( firstname,lastname,email,password,profile_picture_url) VALUES(?,?,?,?,?)",
                [
                    data.firstname,
                    data.lastname,
                    data.email,
                    hashedPassword,
                    data.profile_picture_url    
                ]
              );
            if(result.affectedRows > 0)
            {
                res.status(200).json({ message: "done" ,status:true});
            } else
            {
                throw(result)
            }
        }else
        {
            throw("email already used")
        }
    }
    catch(err)
    {
        res.status(404).json({ message: err ,status:false});
    }
    
};
const login = async (req, res, next) => {
    
    const data=req.body;
    try{
        let [result]=await conn.execute("SELECT * from users where email = ?",[data.email])
        if(result.length>0)
        {
            let isCorrect = await bcrypt.compare(data.password, result[0].password);
            if(isCorrect)
            {
                res.status(200).json({ message: {
                    "userid":result[0].user_id,
                    "firstname":result[0].firstname,
                    "lastname":result[0].lastname,
                    "email":result[0].email,
                    "profile_picture_url":result[0].profile_picture_url,
                } ,status:true});
            }else
            {
                throw("Passowrd error")
            }
            
        }else
        {
            throw("email not found")
        }
    }catch(err)
    {
        res.status(404).json({ message: err ,status:false});
    }

};

module.exports = { signup,login };