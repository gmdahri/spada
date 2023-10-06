
const { default: mongoose } = require("mongoose");
const SubCategory = require("../Models/SubCategory");

const createSubCategory = async (req, res, next) => {
  try {
    const { language, subcategoryName, mainCategoryId } = req.body;
    const subCategory = await SubCategory.create({
      language,
      subcategoryName,
      mainCategoryId,
    });
    res.status(201).json({ success: true, data: subCategory });
  } catch (err) {
    next(err);
  }
};

const getAllSubCategories = async (req, res, next) => {
  try {
    const subCategories = await SubCategory.find();
    res.status(200).json({ success: true, data: subCategories });
  } catch (err) {
    next(err);
  }
};

const getSubCategoryById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res.status(404).json({ success: false, message: "SubCategory not found" });
    }
    res.status(200).json({ success: true, data: subCategory });
  } catch (err) {
    next(err);
  }
};

const updateSubCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const subCategory = await SubCategory.findByIdAndUpdate(id, req.body, { new: true });
    if (!subCategory) {
      return res.status(404).json({ success: false, message: "SubCategory not found" });
    }
    res.status(200).json({ success: true, data: subCategory });
  } catch (err) {
    next(err);
  }
};

const deleteSubCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ data: {}, success: false, message: "Invalid Role ID" });
    }
    const subCategory = await SubCategory.findByIdAndRemove(id);
    if (!subCategory) {
      return res.status(404).json({ success: false, message: "SubCategory not found" });
    }
    res.status(200).json({ success: true, data: {}, message:"Deleted." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
};
