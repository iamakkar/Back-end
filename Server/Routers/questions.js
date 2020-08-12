const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const Questions = mongoose.model("Questions");

router.post("/getquestions", async (req, res) => {
  const num = Math.floor(Math.random() * 5) + 1;
  console.log(num);
  const { topic, subtopic } = req.body;
  const mat = await Questions.find({ topic: topic, subtopic: subtopic })
    //.skip(num)
    .limit(5)
    .exec((err, cb) => {
      if (err) {
        console.log(err);
      }
      console.log(cb);
      res.status(200).send(cb);
    });
});

//exporting the router
module.exports = router;
