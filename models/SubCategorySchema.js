const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subCategorySchema = new Schema({
  title: {
    type: String,
    required: [true, "Category title is required"],
    trim: true,
    unique: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category ID is required"],
  }
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
