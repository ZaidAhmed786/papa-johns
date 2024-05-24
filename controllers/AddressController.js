const Address = require("../models/CartSchema"); // Import the Address model
const Product = require("../models/ProductSchema"); // Import the Product model
const ApiFeatures = require("../utils/ApiFeatures");  
const mongoose = require("mongoose");

module.exports = {
  /*** Create Address ***/
  addAddress: async (req, res) => {
    try {
      const { country, addressType, streetAddress, aptSteFloor, aptSteFloorNumber, zipCode, productId } = req.body;

      // Validate the productId is a valid ObjectId and exists in the Product collection
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ status: "fail", message: "Invalid productId" });
      }
      const productExists = await Product.findById(productId);
      if (!productExists) {
        return res.status(400).json({ status: "fail", message: "Product does not exist" });
      }

      const newAddress = new Address({
        country,
        addressType,
        streetAddress,
        aptSteFloor,
        aptSteFloorNumber,
        zipCode,
        productId: mongoose.Types.ObjectId(productId),
      });
      const address = await newAddress.save();
      res.status(200).json({ status: "success", data: address });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Read All Addresses ***/
   getAddresses: async (req, res) => {
    try {
        const features = new ApiFeatures(Address.find().populate("productId"), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const addressData = await features.query;
        res.status(200).json({
            status: "success",
            results: addressData.length,
            data: addressData,
        });
    } catch (err) {
        res.status(401).json({ status: "fail", message: err.message });
    }
},

  /*** Read Single Address ***/
  getSingleAddress: async (req, res) => {
    try {
      const address = await Address.findById(req.params.id).populate("productId");
      if (!address) {
        return res.status(404).json({ status: "fail", message: "Address not found" });
      }
      res.status(200).json({ status: "success", data: address });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err.message });
    }
  },

  /*** Update Address ***/
  updateAddress: async (req, res) => {
    try {
      const { productId } = req.body;

      // If productId is being updated, validate it
      if (productId) {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
          return res.status(400).json({ status: "fail", message: "Invalid productId" });
        }
        const productExists = await Product.findById(productId);
        if (!productExists) {
          return res.status(400).json({ status: "fail", message: "Product does not exist" });
        }
      }

      const address = await Address.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).populate("productId");

      if (!address) {
        return res.status(404).json({ status: "fail", message: "Address not found" });
      }

      res.status(200).json({ status: "success", data: address });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Delete Address ***/
  deleteAddress: async (req, res) => {
    try {
      const address = await Address.findByIdAndDelete(req.params.id);

      if (!address) {
        return res.status(404).json({ status: "fail", message: "Address not found" });
      }

      res.status(204).json({ status: "success", data: null });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err.message });
    }
  },
};
