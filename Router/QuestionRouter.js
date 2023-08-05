
const express = require("express");
const router = express.Router();
const questionController = require("../Controller/QuestionController");
const multer = require("multer");
const path = require('path')


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../assets"));
  },
  filename: (req, file, cb) => {
    // const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileName = `temp_${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });
router.get('/download-sample-data', questionController.downloadSampleData);

router.post("/", questionController.createQuestion);

router.get("/", questionController.getAllQuestions);

router.get("/:id", questionController.getQuestionById);

router.put("/:id", questionController.updateQuestion);

router.delete("/:id", questionController.deleteQuestion);
router.get("/findBySubCategory/:subCategoryId", questionController.findBySubCategory);

router.get("/findByMainCategory/:mainCategoryId", questionController.findByMainCategory);

router.post("/import-questions-from-excel",upload.single("file"),    questionController.importQuizFromExcel);



module.exports = router;
