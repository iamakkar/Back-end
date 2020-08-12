const mongoose = require("mongoose");
const random = require("mongoose-simple-random");

const questionSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  subtopic: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  option1: {
    type: String,
    required: true,
  },
  option2: {
    type: String,
    required: true,
  },
  option3: {
    type: String,
    required: true,
  },
  option4: {
    type: String,
    required: true,
  },
  correctOption: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
    required: false,
  },
});

const Test = mongoose.model("Questions", questionSchema);

module.exports = Test;
