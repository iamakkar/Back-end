const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const Questions = mongoose.model("Questions");

var ques = [];
var count = 0;

router.post("/getquestions", (req, res) => {
  var { topic, subtopic } = req.body;
  if (subtopic == "Random") {
    Questions.countDocuments({ topic: topic }).exec((err, cnt) => {
      [1, 2, 3, 4, 5, 6].forEach(async function get() {
        const num = Math.floor(Math.random() * cnt) + 1;
        const questions = await Questions.find({
          topic: topic,
        })
          .skip(num)
          .limit(1)
          .exec(async (err, cb) => {
            if (err) {
              console.log(err);
            }
            if (ques.length == 5) {
              await res.status(200).send(ques);
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

//exporting the router
module.exports = router;
