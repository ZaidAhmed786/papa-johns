const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: [true, "Product title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Product base price is required"],
    min: [0, "Price must be a positive number"],
  },
  img: {
    type: String,
    required: [true, "Product image URL is required"],
  },
  imgId: {
    type: String,
    required: [true, "Image ID is required"],
  },
  status: {
    type: String,
    enum: ["Available", "Out of Stock", "Discontinued"],
    default: "Available",
    required: [true, "Product status is required"],
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category ID is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Product quantity is required"],
    min: [0, "Quantity must be a positive number"],
    default: 0,
  },
  ingredients: [
    {
      size: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      crust: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      crustFlavor: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      sauce: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      type: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      bake: {
        type: String,
        required: false,
        trim: true,
        default: null,
      },
      drinkSize: {
        type: Number,
        required: false,
        trim: true,
        default: null,
      },
      pieces: {
        type: Number,
        required: false,
        min: [0, "Pieces must be in positive numbers"],
        default: 0,
      },
    },
  ],
  extraIngredients: [
    {
      type: Object,
      default: {},
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
