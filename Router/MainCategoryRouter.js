

const express = require("express");
const router = express.Router();
const mainCategoryController = require("../Controller/MainCategoryController");

router.post("/", mainCategoryController.createMainCategory);

router.get("/", mainCategoryController.getAllMainCategories);

router.get("/:id", mainCategoryController.getMainCategoryById);

router.put("/:id", mainCategoryController.updateMainCategory);

router.delete("/:id", mainCategoryController.deleteMainCategory);

module.exports = router;
