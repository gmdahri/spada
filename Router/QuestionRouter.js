
const express = require("express");
const router = express.Router();
const questionController = require("../Controller/QuestionController");

router.post("/", questionController.createQuestion);

router.get("/", questionController.getAllQuestions);

router.get("/:id", questionController.getQuestionById);

router.put("/:id", questionController.updateQuestion);

router.delete("/:id", questionController.deleteQuestion);
router.get("/findBySubCategory/:subCategoryId", questionController.findBySubCategory);

router.get("/findByMainCategory/:mainCategoryId", questionController.findByMainCategory);

module.exports = router;
