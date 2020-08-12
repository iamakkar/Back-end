const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: false,
  },
  dob: {
    type: String,
    required: false,
  },
  mobNumber: {
    type: String,
    required: false,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  coins: {
    type: Number,
    default: 100,
  },
  streak: {
    type: Number,
    default: 0,
  },
  socketid: {
    type: String,
    required: false,
    default: "",
  },
});

//Hashing password
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

//comparing passwords method
userSchema.methods.comparePassword = function (enteredPassword) {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(enteredPassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      if (!isMatch) {
        return reject(err);
      }
      resolve(true);
    });
  });
};

mongoose.model("User", userSchema);
