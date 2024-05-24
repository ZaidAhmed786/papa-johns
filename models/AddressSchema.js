const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  country: {
    type: String,
    enum: ["USA", "CANADA"], // Assuming only USA is allowed for now
    required: [true, "Country is Required!"],
  },
  addressType: {
    type: String,
    enum: ["Residence", "Business", "University", "Military"], // Assuming these are the only two types
    required: [true, "Address Type is required!"],
  },
  streetAddress: {
    type: String,
    required: [true, "Street address is required"],
    validate: {
      validator: function (v) {
        // Simple regex for a valid street address (example format)
        return /^\d+\s[A-z]+\s[A-z]+/.test(v);
      },
      message: (props) => `${props.value} is not a valid street address!`,
    },
  },
  aptSteFloor: {
    type: String,
    enum: ["Apt", "Ste", "Floor"],
    required: [true, "Please add a valid type"],
  },
  aptSteFloorNumber: {
    type: String,
    required: [true, "Apt/Ste/Floor number is required"],
    validate: {
      validator: function (v) {
        // Simple regex for a valid floor number (can be expanded as needed)
        return /^[A-Za-z0-9]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid floor number!`,
    },
  },
  zipCode: {
    type: String,
    required: [true, "Zip code is required"],
    validate: {
      validator: function (v) {
        // Regex for valid US zip code
        return /^\d{5}(-\d{4})?$/.test(v);
      },
      message: (props) => `${props.value} is not a valid zip code!`,
    },
  }
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
