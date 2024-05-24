const { mongoose } = require("mongoose");
const SubCategory = require("../models/SubCategorySchema");

module.exports = {
  /*** Create Category ***/
  addCategory: async (req, res) => {
    try {
      const { title, categoryId } = req.body;
        
      // Create a new category
      const newCategory = new SubCategory({ title, categoryId:  mongoose.Types.ObjectId(categoryId),});
      const subCategory = await newCategory.save();
      res.status(200).json({ status: "success", data: subCategory });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Read All Categories ***/
  getCategories: async (req, res) => {
    try {
      const categories = await SubCategory.find().populate("categoryId");;
      res.status(200).json({
        status: "success",
        results: categories.length,
        data: categories,
      });
    } catch (err) {
      res.status(401).json({ status: "fail", message: err.message });
    }
  },

  /*** Read Single Category ***/
  getSingleCategory: async (req, res) => {
    try {
      const category = await SubCategory.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ status: "fail", message: "Sub Category not found" });
      }
      res.status(200).json({ status: "success", data: category });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err.message });
    }
  },

  /*** Update Category ***/
  updateCategory: async (req, res) => {
    try {
      const category = await SubCategory.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!category) {
        return res.status(404).json({ status: "fail", message: "Sub Category not found" });
      }

      res.status(200).json({ status: "success", data: category });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Delete Category ***/
  deleteCategory: async (req, res) => {
    try {
      const category = await SubCategory.findByIdAndDelete(req.params.id);

      if (!category) {
        return res.status(404).json({ status: "fail", message: "Sub Category not found" });
      }

      res.status(204).json({ status: "success", data: null });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err.message });
    }
  },
};
