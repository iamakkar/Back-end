const mongoose = require("mongoose");

const bugReport = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
});

const questionReport = new mongoose.Schema({
  topic: {
    type: String,
  },
  subtopic: {
    type: String,
  },
  question: {
    type: String,
  },
  description: {
    type: String,
  },
});

mongoose.model("BugReports", bugReport);
mongoose.model("QuestionReports", questionReport);
