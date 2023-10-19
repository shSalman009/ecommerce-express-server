const express = require("express");
const {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrders,
  getOrder,
  getOrdersByUserId,
  getUserOrders,
} = require("../controllers/orderController");
const {
  createOrderValidator,
  updateOrderValidator,
} = require("../validators/orderValidators");
const { runValidation } = require("../validators");
const {
  isLoggedIn,
  isAdmin,
  isAuthorized,
} = require("../middlewares/authMiddleware");
const validateMongooseId = require("../middlewares/validateMongooseId");

const router = express.Router();

// create order
router.post("/", isLoggedIn, createOrderValidator, runValidation, createOrder);

// update order
router.patch(
  "/:id",
  isLoggedIn,
  isAdmin,
  validateMongooseId("id", "order"),
  updateOrderValidator,
  runValidation,
  updateOrder
);

// delete order
router.delete(
  "/:id",
  isLoggedIn,
  validateMongooseId("id", "order"),
  deleteOrder
);

// get all orders
router.get("/", isLoggedIn, isAdmin, getOrders);

// get order by id
router.get("/:id", isLoggedIn, validateMongooseId("id", "order"), getOrder);

// get orders by user id
router.get("/user/:id", isLoggedIn, isAuthorized, getUserOrders);

module.exports = router;
