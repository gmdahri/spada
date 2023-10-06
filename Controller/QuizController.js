
const Quiz = require("../Models/Quiz");
const User = require("../Models/Auth");
const Question = require("../Models/Question");

const createQuiz = async (req, res, next) => {
  try {
    const { questionIds } = req.body;

    const quiz = await Quiz.create({ questionIds });

    res.status(201).json({ success: true, data: quiz });
  } catch (err) {
    next(err);
  }
};

const getAllQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find().populate("questionIds");
    res.status(200).json({ success: true, data: quizzes });
  } catch (err) {
    next(err);
  }
};

const getQuizById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const quiz = await Quiz.findById(id).populate("questionIds");
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    res.status(200).json({ success: true, data: quiz });
  } catch (err) {
    next(err);
  }
};

const updateQuiz = async (req, res, next) => {
  const { id } = req.params;
  try {
    const quiz = await Quiz.findByIdAndUpdate(id, req.body, { new: true });
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    res.status(200).json({ success: true, data: quiz });
  } catch (err) {
    next(err);
  }
};

const deleteQuiz = async (req, res, next) => {
  const { id } = req.params;
  try {
    const quiz = await Quiz.findByIdAndRemove(id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    res.status(200).json({ success: true, data: quiz });
  } catch (err) {
    next(err);
  }
};

const createAQuizByUser = async (req, res, next) => {
    const {  userId } = req.params;
    const { subCategoryId, mainCategoryId } = req.body;
    try {
      const questions = await Question.find({
        subCategoryId,
         mainCategoryId,
      }).select("_id");
  
      const questionIds = questions.map((question) => question._id);
  
      const quiz = await Quiz.create({ questionIds });
  
      const user = await User.findByIdAndUpdate(
        userId,
        { $push: { quizzes: quiz._id } },
        { new: true }
      );
  
      res.status(201).json({ success: true, data: { quiz, user } });
    } catch (err) {
      next(err);
    }
  };

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  createAQuizByUser
};
