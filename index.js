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
var ques = [];

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
    console.log("rejected");
    io.to(data.socketid).emit("rejected", data.message);
  });

  socket.on("accepted", async (data) => {
    console.log("Call to ja rhi hai dekh");
    if (data.subtopic == "Random") {
      Questions.countDocuments({ topic: data.topic }).exec((err, cnt) => {
        [1, 2, 3, 4, 5, 6].forEach(async function get() {
          const num = Math.floor(Math.random() * cnt) + 1;
          const questions = await Questions.find({
            topic: data.topic,
          })
            .skip(num)
            .limit(1)
            .exec(async (err, cb) => {
              if (err) {
                console.log(err);
              }
              if (ques.length == 5) {
                await io
                  .to(data.socketid)
                  .to(data.mysocketid)
                  .emit("accepted", ques);
                ques = [];
              } else {
                let temp = cb[0];
                ques.push(temp);
              }
            });
        });
      });
    } else {
      Questions.countDocuments({
        topic: data.topic,
        subtopic: data.subtopic,
      }).exec((err, cnt) => {
        [1, 2, 3, 4, 5, 6].forEach(async function get() {
          const num = Math.floor(Math.random() * cnt) + 1;
          const questions = await Questions.find({
            topic: data.topic,
            subtopic: data.subtopic,
          })
            .skip(num)
            .limit(1)
            .exec(async (err, cb) => {
              if (err) {
                console.log(err);
              }
              if (ques.length == 5) {
                await io
                  .to(data.socketid)
                  .to(data.mysocketid)
                  .emit("accepted", ques);
                ques = [];
              } else {
                let temp = cb[0];
                ques.push(temp);
              }
            });
        });
      });
    }
  });

  socket.on("sendmyscore", async (data) => {
    io.to(data.socketid).emit("sendmyscore", data.score);
    console.log("sent score to" + data.socketid + "  " + data.score);
  });

  socket.on("winner", async (data) => {
    console.log("winner");
    const user = await User.findOne({ email: data });
    let x = user.coins + bid;
    let y = user.streak + 1;
    const user1 = await User.findOneAndUpdate(
      { email: data },
      { coins: x, streak: y }
    );
  });

  socket.on("notwinner", async (data) => {
    console.log("not-winner");
    const user = await User.findOne({ email: data });
    let x = user.coins - bid;
    const user1 = await User.findOneAndUpdate(
      { email: data },
      { coins: x, streak: 0 }
    );
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
