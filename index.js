const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");

require("dotenv").config();

//importing models
require("./Server/Models/Users");

//Using Body-parser
app.use(bodyParser.json());

//importing jwt token
const requireToken = require("./Server/middleware/requireToken");

//importing Routes
const AuthRoutes = require("./Server/Routers/AuthRoutes");
const ImageRoutes = require("./Server/Routers/imageUploadRoutes");

//Using Routes
app.use(AuthRoutes);
app.use(ImageRoutes);

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("connected to mongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

app.get("/", requireToken, (req, res) => {
  res.send("Your email is" + req.user.email);
});

app.listen(process.env.PORT, () => {
  console.log("server running on port " + process.env.PORT);
});
