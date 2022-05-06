const mysql = require("mysql2");

const conn = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "devday",
});

module.exports = conn.promise();