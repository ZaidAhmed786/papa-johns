const Order = require("../models/orderSchema");
const Cart = require("../models/CartSchema"); // Adjust the path as necessary
const ApiFeatures = require("../utils/ApiFeatures");
const mongoose = require("mongoose");

module.exports = {
  /*** Create Order ***/
  addOrder: async (req, res) => {
    try {
      const {
        user,
        card,
        cartItems,
        totalAmount,
        deliveryFee,
        tax,
        tipPercentage,
        status,
      } = req.body;

      // Validate cartItems is a valid ObjectId and exists in the Cart collection
      if (!mongoose.Types.ObjectId.isValid(cartItems)) {
        return res
          .status(400)
          .json({ status: "fail", message: "Invalid cartItems ID" });
      }
      const cartExists = await Cart.findById(cartItems);
      if (!cartExists) {
        return res
          .status(400)
          .json({ status: "fail", message: "Cart does not exist" });
      }

      const newOrder = new Order({
        user,
        card,
        cartItems: mongoose.Types.ObjectId(cartItems),
        totalAmount,
        deliveryFee,
        tax,
        tipPercentage,
        status,
      });
      const order = await newOrder.save();
      res.status(200).json({ status: "success", data: order });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Read All Orders ***/
  getOrders: async (req, res) => {
    try {
      const features = new ApiFeatures(
        Order.find().populate("cartItems"),
        req.query
      )
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const orders = await features.query;
      res.status(200).json({
        status: "success",
        results: orders.length,
        data: orders,
      });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Read Single Order ***/
  getSingleOrder: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate("cartItems");
      if (!order) {
        return res
          .status(404)
          .json({ status: "fail", message: "Order not found" });
      }
      res.status(200).json({ status: "success", data: order });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err.message });
    }
  },

  /*** Update Order ***/
  updateOrder: async (req, res) => {
    try {
      const { cartItems } = req.body;

      // If cartItems is being updated, validate it
      if (cartItems) {
        if (!mongoose.Types.ObjectId.isValid(cartItems)) {
          return res
            .status(400)
            .json({ status: "fail", message: "Invalid cartItems ID" });
        }
        const cartExists = await Cart.findById(cartItems);
        if (!cartExists) {
          return res
            .status(400)
            .json({ status: "fail", message: "Cart does not exist" });
        }
      }

      const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).populate("cartItems");

      if (!order) {
        return res
          .status(404)
          .json({ status: "fail", message: "Order not found" });
      }

      res.status(200).json({ status: "success", data: order });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Delete Order ***/
  deleteOrder: async (req, res) => {
    try {
      const order = await Order.findByIdAndDelete(req.params.id);

      if (!order) {
        return res
          .status(404)
          .json({ status: "fail", message: "Order not found" });
      }

      res.status(204).json({ status: "success", data: null });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },
};
