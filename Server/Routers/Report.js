const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Report = mongoose.model("BugReports");
const QReport = mongoose.model("QuestionReports");

//save bug route
router.post("/reportbug", async (req, res) => {
  const { title, description } = req.body;
  try {
    const report = new Report({
      title: title,
      description: description,
    });
    await report.save();
    res.status(200);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/reportquestion", async (req, res) => {
  const { topic, subtopic, question, description } = req.body;
  try {
    const report = new QReport({
      topic: topic,
      subtopic: subtopic,
      question: question,
      description: description,
    });
    await report.save();
    res.status(200);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

module.exports = router;
