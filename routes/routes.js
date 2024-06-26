const express = require("express");
const router = express.Router();
const upload = require("../middleware/MulterMiddleware");
const CategoryController = require("../controllers/CategoryController");
const SubCategoryController = require("../controllers/SubCategoryController");
const ProductController = require("../controllers/ProductController");
const AddressController = require("../controllers/AddressController");
const CartController = require("../controllers/CartController"); // Import CartController
const cartItemController = require("../controllers/CartItemController"); // Adjust the path as necessary
const OrderController = require("../controllers/OrderController");

// *********** Import Controller Functions *********** //
//!! ********************* Routes ********************* --//
require("dotenv").config();

router.get("/", (req, res) => {
  res.render("../public/index.html");
});

//! *** Category Routes *** !//
router
  .route("/api/categories")
  .get(CategoryController.getCategories) /*** Get all Categories ***/
  .post(CategoryController.addCategory); /*** Add New Category ***/
router
  .route("/api/categories/:id")
  .get(CategoryController.getSingleCategory) /*** Get a Single Category ***/
  .patch(CategoryController.updateCategory) /*** Update Category ***/
  .delete(CategoryController.deleteCategory); /*** Remove Category ***/

//! *** Cart Item Routes *** !//
router
  .route("/api/cart-items")
  .get(cartItemController.getCartItems) /*** Get all Cart Items ***/
  .post(cartItemController.createCartItem); /*** Add New Cart Item ***/

router
  .route("/api/cart-items/:id")
  .get(cartItemController.getCartItemById) /*** Get a Single Cart Item ***/
  .patch(cartItemController.updateCartItem) /*** Update Cart Item ***/
  .delete(cartItemController.deleteCartItem); /*** Remove Cart Item ***/
//! ***Sub Category Routes *** !//
router
  .route("/api/sub-categories")
  .get(SubCategoryController.getCategories) /*** Get all Categories ***/
  .post(SubCategoryController.addCategory); /*** Add New Category ***/
router
  .route("/api/sub-categories/:id")
  .get(SubCategoryController.getSingleCategory) /*** Get a Single Category ***/
  .patch(SubCategoryController.updateCategory) /*** Update Category ***/
  .delete(SubCategoryController.deleteCategory); /*** Remove Category ***/

//! *** Product Routes *** !//
router
  .route("/api/products")
  .get(ProductController.getProducts) /*** Get all Products ***/
  .post(
    upload.single("image"),
    ProductController.addProduct
  ); /*** Add New Product ***/
router
  .route("/api/products/:id")
  .get(ProductController.getSingleProduct) /*** Get a Single Product ***/
  .patch(ProductController.updateProduct) /*** Update Product ***/
  .delete(ProductController.deleteProduct); /*** Remove Product ***/
router
  .route("/api/products/category/:categoryId")
  .get(
    ProductController.getProductsByCategory
  ); /*** Get Products by Category ***/

//! *** Address Routes *** !//
router
  .route("/api/address")
  .get(AddressController.getAddresses) /*** Get all Addresses ***/
  .post(AddressController.addAddress); /*** Add New Address ***/
router
  .route("/api/address/:id")
  .get(AddressController.getSingleAddress) /*** Get a Single Address ***/
  .patch(AddressController.updateAddress) /*** Update Address ***/
  .delete(AddressController.deleteAddress); /*** Remove Address ***/

//! *** Cart Routes *** !//
router
  .route("/api/cart")
  .get(CartController.getCarts) /*** Get all Carts ***/
  .post(CartController.addCart); /*** Add New Cart ***/
router
  .route("/api/cart/:id")
  .get(CartController.getSingleCart) /*** Get a Single Cart ***/
  .patch(CartController.updateCart) /*** Update Cart ***/
  .delete(CartController.deleteCart); /*** Remove Cart ***/

//! *** Order Routes *** !//
router
  .route("/api/orders")
  .get(OrderController.getOrders) /*** Get all Orders ***/
  .post(OrderController.addOrder); /*** Add New Order ***/

router
  .route("/api/orders/:id")
  .get(OrderController.getSingleOrder) /*** Get a Single Order ***/
  .patch(OrderController.updateOrder) /*** Update Order ***/
  .delete(OrderController.deleteOrder); /*** Remove Order ***/
router.all("*", (req, res) => {
  res.send("Route not found");
});

module.exports = router;
