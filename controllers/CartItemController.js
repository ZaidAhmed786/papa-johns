const CartItem = require('../models/CartItemSchema'); // Adjust the path as necessary

// Get all cart items
exports.getCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.find().populate('address').populate('productId');
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single cart item by ID
exports.getCartItemById = async (req, res) => {
  try {
    const cartItem = await CartItem.findById(req.params.id).populate('address').populate('productId');
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new cart item
exports.createCartItem = async (req, res) => {
  try {
    const newCartItem = new CartItem(req.body);
    const savedCartItem = await newCartItem.save();
    res.status(201).json(savedCartItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an existing cart item by ID
exports.updateCartItem = async (req, res) => {
  try {
    const updatedCartItem = await CartItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('address').populate('productId');
    if (!updatedCartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.status(200).json(updatedCartItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a cart item by ID
exports.deleteCartItem = async (req, res) => {
  try {
    const deletedCartItem = await CartItem.findByIdAndDelete(req.params.id);
    if (!deletedCartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.status(200).json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
