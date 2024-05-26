const Address = require("../models/AddressSchema"); // Import the Address model
const Product = require("../models/ProductSchema"); // Import the Product model
const ApiFeatures = require("../utils/ApiFeatures");  
const mongoose = require("mongoose");

module.exports = {
  /*** Create Address ***/
  addAddress: async (req, res) => {
    try {
      const { country, addressType, streetAddress, aptSteFloor, aptSteFloorNumber, zipCode } = req.body;

      // Validate the productId is a valid ObjectId and exists in the Product collection
     

      const newAddress = new Address({
        country,
        addressType,
        streetAddress,
        aptSteFloor,
        aptSteFloorNumber,
        zipCode
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
        const features = new ApiFeatures(Address.find(), req.query)
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
      const address = await Address.findById(req.params.id)
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
     

      const address = await Address.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })

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
