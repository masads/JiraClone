const conn = require("../config/db.js");
const bcrypt = require("bcrypt");
const signup = async (req, res, next) => {

    res.status(200).json({ message: "register" });
};
const login = async (req, res, next) => {
    
    const data=req.body;
    res.status(200).json({ message: "register" });
};

module.exports = { signup,login };