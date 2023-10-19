const { sendSuccessResponse } = require("../helpers/response");
const Order = require("../models/order");
const Product = require("../models/product");
const createError = require("http-errors");

// create order
const createOrder = async (req, res, next) => {
  const order = new Order({
    ...req.body,
    user: req.user.id,
  });

  try {
    for (let item of order.products) {
      // reduce stock of product
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      await product.save();
    }

    await order.save();
    await order.populate("products.product");

    sendSuccessResponse(res, order, "Order created successfully!", 201);
  } catch (err) {
    next(err);
  }
};

// update order
const updateOrder = async (req, res, next) => {
  const orderId = req.params.id;

  const allowedUpdates = [
    "products",
    "total",
    "status",
    "shippingAddress",
    "user",
  ];

  const updates = Object.keys(req.body);

  try {
    if (updates.length === 0) {
      throw createError(400, "No data provided to update");
    }

    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      throw createError(400, "Invalid data provided to update");
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedOrder) {
      throw createError(404, "Order not found");
    }

    sendSuccessResponse(res, updatedOrder, "Order updated successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// delete order
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      throw createError(404, "Order not found for deletion");
    }

    sendSuccessResponse(res, null, "Order deleted successfully!", 200);
  } catch (err) {
    next(err);
  }
};

// get all orders
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({});

    if (!orders) {
      throw createError(404, "No orders found");
    }

    sendSuccessResponse(res, orders, "Orders retrieved successfully!", 200);
  } catch (err) {
    next(err);
  }
};

// get order by id
const getOrder = async (req, res, next) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      throw createError(404, "Order not found");
    }

    sendSuccessResponse(res, order, "Order retrieved successfully!", 200);
  } catch (err) {
    next(err);
  }
};

// get orders by user id
const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "products.product"
    );

    if (!orders) {
      throw createError(404, "No orders found");
    }

    sendSuccessResponse(res, orders, "Orders retrieved successfully!", 200);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrders,
  getOrder,
  getUserOrders,
};
