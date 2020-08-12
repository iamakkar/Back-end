const express = require("express");
const mongoose = require("mongoose");
const app = express();
const server = require("http").createServer(app);
const bodyParser = require("body-parser");

//init socket
const io = require("socket.io").listen(server);

require("dotenv").config();

//importing models
require("./Server/Models/Users");
require("./Server/Models/Questions");
require("./Server/Models/Reports");
const User = mongoose.model("User");
const Questions = mongoose.model("Questions");

//Using Body-parser
app.use(bodyParser.json());

//importing jwt token
const requireToken = require("./Server/middleware/requireToken");

//importing Routes
const AuthRoutes = require("./Server/Routers/AuthRoutes");
const ImageRoutes = require("./Server/Routers/imageUploadRoutes");
const QuestionRoutes = require("./Server/Routers/questions");
const Report = require("./Server/Routers/Report");

//Using Routes
app.use(AuthRoutes);
app.use(ImageRoutes);
app.use(QuestionRoutes);
app.use(Report);

//using socket
var bid = 0;
var score1 = 0;
var score2 = 0;

io.on("connection", (socket) => {
  console.log("socket's on maan");

  socket.on("connected", async (data) => {
    try {
      var user = await User.findOneAndUpdate(
        {
          email: data,
        },
        {
          socketid: socket.id,
        }
      );
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("setBid", (amount) => {
    bid = amount;
    //console.log(bid);
  });

  socket.on("invite", (data) => {
    //console.log(data);
    io.to(data.socketid).emit("invite", data);
  });

  socket.on("rejected", (data) => {
    //console.log(data);
    io.to(data.socketid).emit("rejected", data.message);
  });

  socket.on("accepted", async (data) => {
    const num = Math.floor(Math.random() * 5) + 1;
    const questions = await Questions.find({
      topic: data.topic,
      subtopic: data.subtopic,
    })
      .limit(5)
      .skip(num)
      .exec((err, cb) => {
        if (err) {
          console.log(err);
        }
        console.log(cb);
        //io.to(data.socketid).to(data.mysocketid).emit("accepted", cb);
      });
  });

  socket.on("disconnect", async (data) => {
    try {
      var user = await User.findOneAndUpdate(
        {
          email: data,
        },
        {
          socketid: "",
        }
      );
    } catch (e) {
      console.log(e);
    }
  });
});

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

server.listen(process.env.PORT, () => {
  console.log("server running on port " + process.env.PORT);
});
