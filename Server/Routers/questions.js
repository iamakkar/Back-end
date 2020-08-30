const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const Questions = mongoose.model("Questions");

var ques = [];
var count = 0;

router.post("/getquestions", (req, res) => {
  var { topic, subtopic } = req.body;
  Questions.countDocuments({ topic: topic, subtopic: subtopic }).exec(
    (err, cnt) => {
      console.log("THIs is Count: " + cnt);

      [1, 2, 3, 4, 5, 6].forEach(async function cb() {
        const num = Math.floor(Math.random() * cnt) + 1;
        console.log(num);

        const mat = await Questions.find({
          topic: topic,
          subtopic: subtopic,
        })
          .skip(num)
          .limit(1)
          .exec((err, cb) => {
            if (err) {
              console.log(err);
            }
            console.log(cb);
            console.log(ques);
            if (ques.length == 5) {
              res.status(200).send(ques);
            } else {
              let temp = cb[0];
              ques.push(temp);
            }
          });
      });
    }
  );
});

//exporting the router
module.exports = router;
