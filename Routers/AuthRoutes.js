const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { jwtkey } = require("../keys");

const router = express.Router();
const User = mongoose.model("User");

//signup route
router.post("/signup", async (req, res) => {
  console.log("hi ther!");
  const {
    email,
    password,
    firstName,
    lastName,
    uesrname,
    dob,
    mobNumber,
  } = req.body;
  console.log(req.body);
  try {
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      dob,
      uesrname,
      mobNumber,
    });
    await user.save();
    const token = jwt.sign({ userId: user._id }, jwtkey);
    console.log(token);
    res.send({ token });
  } catch (err) {
    console.error(err);
    return res.status(422).send(err.message);
  }
});

//signup route
router.post("/enterUserDetails", async (req, res) => {
  console.log("hi ther!");
  const {
    email,
    password,
    firstName,
    lastName,
    username,
    dob,
    mobNumber,
  } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOneAndUpdate(
      {
        email: email,
      },
      {
        firstName,
        lastName,
        username,
        dob,
        mobNumber,
      }
    );
    if (!user) {
      console.log("FAIL HO GHAYA YAAR!");
    }
    res.send(200);
  } catch (err) {
    console.error(err);
    return res.status(422).send(err.message);
  }
});

//signin route
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "You must provide your email or password!" });
  }
  //console.log("part1done");
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(422)
      .send({ error: "You must provide your email or password!" });
  }
  // console.log("part2done");
  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, jwtkey);
    res.send({ token });
    //console.log("tokensent");
  } catch (err) {
    return res
      .status(422)
      .send({ error: "You must provide your email or password!" });
  }
  //console.log("part4done");
});

//exporting the router
module.exports = router;
