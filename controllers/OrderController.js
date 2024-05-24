const Order = require("../models/orderSchema");
const Address = require("../models/AddressSchema");
const Product = require("../models/ProductSchema");
const mongoose = require("mongoose");
const ApiFeatures = require("../utils/ApiFeatures");

module.exports = {
  /*** Create Order ***/
  addOrder: async (req, res) => {
    try {
      const {
        user,
        card,
        addressId,
        items,
        totalAmount,
        deliveryFee,
        tax,
        tipPercentage,
        status,
      } = req.body;

      // Validate addressId is a valid ObjectId and exists in the Address collection
      if (!mongoose.Types.ObjectId.isValid(addressId)) {
        return res
          .status(400)
          .json({ status: "fail", message: "Invalid addressId" });
      }
      const addressExists = await Address.findById(addressId);
      if (!addressExists) {
        return res
          .status(400)
          .json({ status: "fail", message: "Address does not exist" });
      }

      // Validate items contain valid productId references and exist in the Product collection
      for (const item of items) {
        if (!mongoose.Types.ObjectId.isValid(item.productId)) {
          return res
            .status(400)
            .json({ status: "fail", message: "Invalid productId in items" });
        }
        const productExists = await Product.findById(item.productId);
        if (!productExists) {
          return res
            .status(400)
            .json({
              status: "fail",
              message: "Product in items does not exist",
            });
        }
      }

      const newOrder = new Order({
        user,
        card,
        address: mongoose.Types.ObjectId(addressId),
        items,
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
        Order.find().populate("address items.productId"),
        req.query
      )
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const orders = await features.query;
      res.status(200).json({ status: "success", data: orders });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Read Single Order ***/
  getSingleOrder: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
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
      const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
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
