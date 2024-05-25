const CartItem = require("../models/CartItemSchema");
const mongoose = require("mongoose");
const Address = require("../models/AddressSchema");
const Product = require("../models/ProductSchema");

// Get all cart items
exports.getCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.find()
      .populate("address")
      .populate("productId");
    res.status(200).json({
      status: "success",
      results: cartItems.length,
      data: cartItems,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// Get a single cart item by ID
exports.getCartItemById = async (req, res) => {
  try {
    const cartItem = await CartItem.findById(req.params.id)
      .populate("address")
      .populate("productId");
    if (!cartItem) {
      return res
        .status(404)
        .json({ status: "fail", message: "Cart item not found" });
    }
    res.status(200).json({ status: "success", data: cartItem });
  } catch (error) {
    res.status(404).json({ status: "fail", message: error.message });
  }
};

// Create a new cart item
exports.createCartItem = async (req, res) => {
  try {
    const { productId, address } = req.body;

    // Validate productId is a valid ObjectId and exists in the Product collection
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid productId" });
    }
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res
        .status(400)
        .json({ status: "fail", message: "Product does not exist" });
    }

    // Validate address is a valid ObjectId and exists in the Address collection
    if (!mongoose.Types.ObjectId.isValid(address)) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid address ID" });
    }
    const addressExists = await Address.findById(address);
    if (!addressExists) {
      return res
        .status(400)
        .json({ status: "fail", message: "Address does not exist" });
    }

    const newCartItem = new CartItem(req.body);
    const savedCartItem = await newCartItem.save();
    res.status(201).json({ status: "success", data: savedCartItem });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Update an existing cart item by ID
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, address } = req.body;

    // Validate productId if being updated
    if (productId) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res
          .status(400)
          .json({ status: "fail", message: "Invalid productId" });
      }
      const productExists = await Product.findById(productId);
      if (!productExists) {
        return res
          .status(400)
          .json({ status: "fail", message: "Product does not exist" });
      }
    }

    // Validate address if being updated
    if (address) {
      if (!mongoose.Types.ObjectId.isValid(address)) {
        return res
          .status(400)
          .json({ status: "fail", message: "Invalid address ID" });
      }
      const addressExists = await Address.findById(address);
      if (!addressExists) {
        return res
          .status(400)
          .json({ status: "fail", message: "Address does not exist" });
      }
    }

    const updatedCartItem = await CartItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("address")
      .populate("productId");

    if (!updatedCartItem) {
      return res
        .status(404)
        .json({ status: "fail", message: "Cart item not found" });
    }
    res.status(200).json({ status: "success", data: updatedCartItem });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Delete a cart item by ID
exports.deleteCartItem = async (req, res) => {
  try {
    const deletedCartItem = await CartItem.findByIdAndDelete(req.params.id);
    if (!deletedCartItem) {
      return res
        .status(404)
        .json({ status: "fail", message: "Cart item not found" });
    }
    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
