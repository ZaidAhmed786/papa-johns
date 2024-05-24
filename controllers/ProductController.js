const Product = require("../models/ProductSchema"); // Import the Product model
const Category = require("../models/CategorySchema"); // Import the Category model (assuming it exists)
const mongoose = require("mongoose");
const cloudinary = require('../utils/cloudinary')
module.exports = {
  /*** Create Product ***/
  addProduct: async (req, res) => {
    try {
      const { title, description, price, status, categoryId } =
        req.body;

        if (!req.file) {
          res.status(404).json({ message: "Product Image is Required!!" });
          return true;
        }
        let image_upload = await cloudinary.uploader.upload(req.file.path);
        console.log(image_upload);

      // Validate the categoryId is a valid ObjectId and exists in the Category collection
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res
          .status(400)
          .json({ status: "fail", message: "Invalid categoryId" });
      }
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) {
        return res
          .status(400)
          .json({ status: "fail", message: "Category does not exist" });
      }

      const newProduct = new Product({
        title,
        description,
        price,
        img: image_upload && image_upload.secure_url,
        imgId: image_upload && image_upload.public_id,
        status,
        categoryId: mongoose.Types.ObjectId(categoryId),
      });
      const product = await newProduct.save();
      res.status(200).json({ status: "success", data: product });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Read All Products ***/
  getProducts: async (req, res) => {
    try {
      const products = await Product.find().populate("categoryId");
      res.status(200).json({
        status: "success",
        results: products.length,
        data: products,
      });
    } catch (err) {
      res.status(401).json({ status: "fail", message: err.message });
    }
  },

  /*** Read Single Product ***/
  getSingleProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate(
        "categoryId"
      );
      if (!product) {
        return res
          .status(404)
          .json({ status: "fail", message: "Product not found" });
      }
      res.status(200).json({ status: "success", data: product });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err.message });
    }
  },

  /*** Get Products by Category ***/
  getProductsByCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;

      if (!categoryId) {
        return res
          .status(400)
          .json({ status: "fail", message: "Category ID is required" });
      }

      const products = await Product.find({ categoryId }).populate(
        "categoryId"
      );

      res.status(200).json({
        status: "success",
        results: products.length,
        data: products,
      });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },
  
  /*** Update Product ***/
  updateProduct: async (req, res) => {
    try {
      const { title, description, price, status, categoryId } = req.body;

      // If categoryId is being updated, validate it
      if (categoryId) {
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
          return res
            .status(400)
            .json({ status: "fail", message: "Invalid categoryId" });
        }
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
          return res
            .status(400)
            .json({ status: "fail", message: "Category does not exist" });
        }
      }
      const newProduct = {
        title: title && title,
        description: description && description,
        price:  price && price,
        img: image_upload && image_upload.secure_url,
        imgId: image_upload && image_upload.public_id,
        status: status && status,
        categoryId: categoryId && mongoose.Types.ObjectId(categoryId),
      }
      const product = await Product.findByIdAndUpdate(req.params.id, newProduct, {
        new: true, 
      }).populate("categoryId");

      if (!product) {
        return res
          .status(404)
          .json({ status: "fail", message: "Product not found" });
      }

      res.status(200).json({ status: "success", data: product });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Delete Product ***/
  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);

      if (!product) {
        return res
          .status(404)
          .json({ status: "fail", message: "Product not found" });
      }

      res.status(204).json({ status: "success", data: null });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err.message });
    }
  },
};
