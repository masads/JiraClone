const express = require("express");
const { json, urlencoded } = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const router = require("./routes/routes.js");
const { uploadFile } = require("./config/s3");
const port = 1234;

//middleware
app.use(cors()); //making cross-domain requests possible
app.use(json()); // tells the system that you want json to be used.
app.use(urlencoded({ extended: true })); //allow us to attach parameters to a url like(?) etc
app.use(morgan("dev"));
app.use(router);
app.use("/images", express.static("images"));

// app.listen(port, "192.168.0.105", () => {
//   console.log(`App listening at http://192.168.1.6:${port}`);
// });
app.listen(port, () => {
  console.log(`App listening at http:/localhost:${port}`);
});
