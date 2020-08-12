const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { jwtkey } = require("../../keys");

const router = express.Router();
const User = mongoose.model("User");

//signup route
router.post("/signup", async (req, res) => {
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
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      dob,
      username,
      mobNumber,
    });
    await user.save();
    const token = jwt.sign({ userId: user._id }, jwtkey);
    res.send({ token });
  } catch (err) {
    console.error(err);
    return res.status(422).send(err.message);
  }
});

//update profile route
router.post("/enterUserDetails", async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    username,
    dob,
    mobNumber,
    profilePicture,
  } = req.body;

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
        profilePicture,
      }
    );
    if (!user) {
      res.status(404).send("User not found");
      console.log("User Not Found");
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

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(422)
      .send({ error: "You must provide your email or password!" });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, jwtkey);
    res.send({ token });
  } catch (err) {
    return res
      .status(422)
      .send({ error: "You must provide your email or password!" });
  }
});

//display route
router.post("/display", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });

    res.status(200).send({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      coins: user.coins,
      streak: user.streak,
      dob: user.dob,
      mobNumber: user.mobNumber,
      profilePicture: user.profilePicture,
      socketid: user.socketid,
    });
  } catch (err) {
    return res.status(404).send(err);
  }
});

//invite oponent route
router.post("/finduser", async (req, res) => {
  const { firstName } = req.body;

  try {
    const users = await User.find({ firstName: firstName });
    if (!users) {
      res.status(404).send("User Doesn't Exist!");
    }
    res.status(200).send(users);
    console.log(users);
  } catch (err) {
    console.log(err);
  }
});

//exporting the router
module.exports = router;
