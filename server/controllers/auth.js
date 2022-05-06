const conn = require("../config/db.js");
const bcrypt = require("bcrypt");
const signup = async (req, res, next) => {
    // let data=req.body;
    // let hashedPassword = await bcrypt.hash(data.password, 12);
    // const [iresult] = await conn.execute(
    // "INSERT INTO users(full_name, email, password,cnic,dob,profile_pic_id,status) VALUES(?,?,?,?,?,?,?)",
    // [
    //     `${data.fname} ${data.lname}`,
    //     data.email,
    //     hashedPassword,
    //     data.CNIC,
    //     data.birdthDate,
    //     null,
    //     'active'
    // ]
    // );
    res.status(200).json({ message: "register" });
};
const login = async (req, res, next) => {
    const data=req.body;
    res.status(200).json({ message: "register" });
};

module.exports = { signup,login };