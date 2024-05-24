const Cart = require("../models/CartSchema");
const Address = require("../models/AddressSchema");
const Product = require("../models/ProductSchema");
const mongoose = require("mongoose");

module.exports = {
  /*** Create Cart ***/
  addCart: async (req, res) => {
    try {
      const { addressId, items, totalAmount, deliveryFee, tax, status } = req.body;

      // Validate addressId is a valid ObjectId and exists in the Address collection
      if (!mongoose.Types.ObjectId.isValid(addressId)) {
        return res.status(400).json({ status: "fail", message: "Invalid addressId" });
      }
      const addressExists = await Address.findById(addressId);
      if (!addressExists) {
        return res.status(400).json({ status: "fail", message: "Address does not exist" });
      }

      // Validate items contain valid productId references and exist in the Product collection
      for (const item of items) {
        if (!mongoose.Types.ObjectId.isValid(item.productId)) {
          return res.status(400).json({ status: "fail", message: "Invalid productId in items" });
        }
        const productExists = await Product.findById(item.productId);
        if (!productExists) {
          return res.status(400).json({ status: "fail", message: "Product in items does not exist" });
        }
      }

      const newCart = new Cart({
        address: mongoose.Types.ObjectId(addressId),
        items,
        totalAmount,
        deliveryFee,
        tax,
        status,
      });
      const cart = await newCart.save();
      res.status(200).json({ status: "success", data: cart });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Read All Carts ***/
  getCarts: async (req, res) => {
    try {
      const carts = await Cart.find().populate("address items.productId");
      res.status(200).json({ status: "success", data: carts });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Read Single Cart ***/
  getSingleCart: async (req, res) => {
    try {
      const cart = await Cart.findById(req.params.id).populate("address items.productId");
      if (!cart) {
        return res.status(404).json({ status: "fail", message: "Cart not found" });
      }
      res.status(200).json({ status: "success", data: cart });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err.message });
    }
  },

  /*** Update Cart ***/
  updateCart: async (req, res) => {
    try {
      const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate(
        "address items.productId"
      );
      if (!cart) {
        return res.status(404).json({ status: "fail", message: "Cart not found" });
      }
      res.status(200).json({ status: "success", data: cart });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Delete Cart ***/
  deleteCart: async (req, res) => {
    try {
      const cart = await Cart.findByIdAndDelete(req.params.id);
      if (!cart) {
        return res.status(404).json({ status: "fail", message: "Cart not found" });
      }
      res.status(204).json({ status: "success", data: null });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },
};
