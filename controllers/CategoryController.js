const Category = require("../models/CategorySchema");

module.exports = {
  /*** Create Category ***/
  addCategory: async (req, res) => {
    try {
      const { title } = req.body;

      // Create a new category
      const newCategory = new Category({ title });
      const category = await newCategory.save();
      res.status(200).json({ status: "success", data: category });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Read All Categories ***/
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();
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
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ status: "fail", message: "Category not found" });
      }
      res.status(200).json({ status: "success", data: category });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err.message });
    }
  },

  /*** Update Category ***/
  updateCategory: async (req, res) => {
    try {
      const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!category) {
        return res.status(404).json({ status: "fail", message: "Category not found" });
      }

      res.status(200).json({ status: "success", data: category });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Delete Category ***/
  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);

      if (!category) {
        return res.status(404).json({ status: "fail", message: "Category not found" });
      }

      res.status(204).json({ status: "success", data: null });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err.message });
    }
  },
};
