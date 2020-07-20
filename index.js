const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const { mongoURL } = require("./keys");

//importing models
require("./Models/Users");

//Using Body-parser
app.use(bodyParser.json());

//importing jwt token
const requireToken = require("./middleware/requireToken");

//importing Routes
const AuthRoutes = require("./Routers/AuthRoutes");

//Using Routes
app.use(AuthRoutes);

mongoose.connect(mongoURL, {
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

app.listen(port, () => {
  console.log("server running on port " + port);
});
