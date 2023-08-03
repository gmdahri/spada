
const Question = require("../Models/Question");

const createQuestion = async (req, res, next) => {
  try {
    const {
      title,
      description,
      correctAnswer,
      optionA,
      optionB,
      optionC,
      optionD,
      questionType,
    } = req.body;

    const question = await Question.create({
      title,
      description,
      correctAnswer,
      optionA,
      optionB,
      optionC,
      optionD,
      questionType,
    });

    res.status(201).json({ success: true, data: question });
  } catch (err) {
    next(err);
  }
};

const getAllQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find();
    res.status(200).json({ success: true, data: questions });
  } catch (err) {
    next(err);
  }
};

const getQuestionById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }
    res.status(200).json({ success: true, data: question });
  } catch (err) {
    next(err);
  }
};

const updateQuestion = async (req, res, next) => {
  const { id } = req.params;
  try {
    const question = await Question.findByIdAndUpdate(id, req.body, { new: true });
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }
    res.status(200).json({ success: true, data: question });
  } catch (err) {
    next(err);
  }
};

const deleteQuestion = async (req, res, next) => {
  const { id } = req.params;
  try {
    const question = await Question.findByIdAndRemove(id);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }
    res.status(200).json({ success: true, data: question });
  } catch (err) {
    next(err);
  }
};

const findBySubCategory = async (req, res, next) => {
    const { subCategoryId } = req.params;
    try {
      const questions = await Question.find({ subCategory: subCategoryId });
      res.status(200).json({ success: true, data: questions });
    } catch (err) {
      next(err);
    }
  };
  
  const findByMainCategory = async (req, res, next) => {
    const { mainCategoryId } = req.params;
    try {
      const questions = await Question.find({ mainCategory: mainCategoryId });
      res.status(200).json({ success: true, data: questions });
    } catch (err) {
      next(err);
    }
  };

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  findByMainCategory,
  findBySubCategory
};
