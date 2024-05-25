const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
  address: {
    type: Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product ID is required"],
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

const CartItem = mongoose.model("CartItem", CartItemSchema);

module.exports = CartItem;
