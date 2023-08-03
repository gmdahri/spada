const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  optionA: {
    type: String,
  },
  optionB: {
    type: String,
  },
  optionC: {
    type: String,
  },
  optionD: {
    type: String,
  },
  questionType: {
    type: String,
    required: true,
  },
});

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;
