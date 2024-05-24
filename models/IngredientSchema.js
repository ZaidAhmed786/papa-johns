const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
  type: {
    type: String,
    enum: ["Base", "Cheese", "Meat", "Veggie"],
    required: [true, "Ingredient type is required"],
  },
  price: {
    type: Number,
    required: [true, "Ingredient price is required"],
    min: [0, "Price must be a positive number"],
  },
  value: {
    type: String, // e.g., "Thick Crust", "Mozzarella", "Pepperoni", "Bell Peppers"
    required: [true, "Ingredient value is required"],
    trim: true,
  },
});

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;
