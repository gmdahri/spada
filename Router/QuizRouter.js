
const express = require("express");
const router = express.Router();
const quizController = require("../Controller/QuizController");

router.post("/", quizController.createQuiz);

router.get("/", quizController.getAllQuizzes);

router.get("/:id", quizController.getQuizById);

router.put("/:id", quizController.updateQuiz);

router.delete("/:id", quizController.deleteQuiz);
router.post("/createAQuizByUser/:userId", quizController.createAQuizByUser);


module.exports = router;
