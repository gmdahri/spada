const mongoose = require("mongoose");

const MainCategorySchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
});

const MainCategory = mongoose.model("MainCategory", MainCategorySchema);

module.exports = MainCategory;
