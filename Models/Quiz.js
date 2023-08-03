const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  questionIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  }],
});

const Quiz = mongoose.model("Quiz", QuizSchema);

module.exports = Quiz;
