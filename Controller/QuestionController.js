
const fs = require("fs");
const xlsx = require("xlsx");
const Question = require("../Models/Question");
const path = require("path");

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
const importQuizFromExcel = async (req, res) => {
  try {
    console.log("file", req.file, req.body)
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const uploadedFile = req.file;

    if (
      uploadedFile.mimetype !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      uploadedFile.mimetype !== "application/vnd.ms-excel"
    ) {
      return res.status(400).json({ success: false, message: "Invalid file format" });
    }

    const fileName = `temp_${uploadedFile.originalname}`;
    const tempDir = path.join(__dirname, "../assets");
    const filePath = path.join(tempDir, fileName);

    
    // uploadedFile.mv(filePath);
    // Read the Excel file using xlsx
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    
    // const { title, description } = data[0];
    const questions = [];
    for (let i = 0; i < data.length; i++) {
      const { title, description, questionType, optionA, optionB, optionC, optionD, correctAnswer } = data[i];
      const newQuestion = await Question.create({
        title, description, questionType, optionA, optionB, optionC, optionD, correctAnswer
      });
      questions.push(newQuestion);
    }


    // fs.unlinkSync(filePath);

    res.status(201).json({ success: true, data: questions });
  } catch (err) {
    console.error("Error importing questions from Excel:", err);
    res.status(500).json({ success: false, message: "Failed to import questions from Excel" });
  }
};
const downloadSampleData = (req, res) => {
  try {
    const fileName = 'sample-data.xlsx';
    const filePath = path.join(__dirname, '../assets', fileName);

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.sendFile(filePath);
  } catch (err) {
    console.error('Error downloading the sample file:', err);
    res.status(500).json({ success: false, message: 'Failed to download the sample file' });
  }
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  findByMainCategory,
  findBySubCategory,
  importQuizFromExcel,
  downloadSampleData
};
