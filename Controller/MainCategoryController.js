// controllers/mainCategoryController.js

const MainCategory = require("../Models/MainCategory");

const createMainCategory = async (req, res, next) => {
  try {
    const { language, categoryName } = req.body;
    const mainCategory = await MainCategory.create({ language, categoryName });
    res.status(201).json({ success: true, data: mainCategory });
  } catch (err) {
    next(err);
  }
};

const getAllMainCategories = async (req, res, next) => {
  try {
    const mainCategories = await MainCategory.find();
    res.status(200).json({ success: true, data: mainCategories });
  } catch (err) {
    next(err);
  }
};

const getMainCategoryById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const mainCategory = await MainCategory.findById(id);
    if (!mainCategory) {
      return res.status(404).json({ success: false, message: "MainCategory not found" });
    }
    res.status(200).json({ success: true, data: mainCategory });
  } catch (err) {
    next(err);
  }
};

const updateMainCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const mainCategory = await MainCategory.findByIdAndUpdate(id, req.body, { new: true });
    if (!mainCategory) {
      return res.status(404).json({ success: false, message: "MainCategory not found" });
    }
    res.status(200).json({ success: true, data: mainCategory });
  } catch (err) {
    next(err);
  }
};

const deleteMainCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const mainCategory = await MainCategory.findByIdAndRemove(id);
    if (!mainCategory) {
      return res.status(404).json({ success: false, message: "MainCategory not found" });
    }
    res.status(200).json({ success: true, data: mainCategory });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createMainCategory,
  getAllMainCategories,
  getMainCategoryById,
  updateMainCategory,
  deleteMainCategory,
};
