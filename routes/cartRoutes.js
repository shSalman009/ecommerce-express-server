const express = require("express");
const {
  getCarts,
  createCart,
  updateCart,
  getUserCarts,
  removeCart,
  clearUserCarts,
} = require("../controllers/cartController");
const {
  createCartValidator,
  updateCartValidator,
} = require("../validators/cartValidators");
const { isLoggedIn, isAuthorized } = require("../middlewares/authMiddleware");
const { runValidation } = require("../validators");
const validateMongooseId = require("../middlewares/validateMongooseId");

const router = express.Router();

// get carts
router.get("/", isLoggedIn, getCarts);

// get all carts of a user
router.get("/:userId", isLoggedIn, isAuthorized, getUserCarts);

// create a new cart
router.post("/", isLoggedIn, createCartValidator, runValidation, createCart);

// update a cart
router.patch(
  "/:id",
  isLoggedIn,
  validateMongooseId("id", "cart"),
  updateCartValidator,
  runValidation,
  updateCart
);

// remove a cart
router.delete("/:id", isLoggedIn, validateMongooseId("id", "cart"), removeCart);

// clear all carts of a user
router.delete("/clear/:userId", isLoggedIn, isAuthorized, clearUserCarts);

module.exports = router;
