const mongoose = require("mongoose");

const SubCategorySchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
  },
  subcategoryName: {
    type: String,
    required: true,
  },
});

const SubCategory = mongoose.model("SubCategory", SubCategorySchema);

module.exports = SubCategory;
