const { sendSuccessResponse } = require("../helpers/response");
const Cart = require("../models/cart");
const createError = require("http-errors");

// get carts
const getCarts = async (req, res, next) => {
  const filter = req.query;

  try {
    const carts = await Cart.find(filter).populate(
      "product",
      "-__v -createdAt -updatedAt -reviews"
    );

    if (!carts) {
      throw createError(404, "Carts not found");
    }

    sendSuccessResponse(res, carts, "Carts retrieved successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// get all carts of a user
const getUserCarts = async (req, res, next) => {
  try {
    const carts = await Cart.find({ user: req.params.userId }).populate(
      "product",
      "-__v -createdAt -updatedAt -reviews"
    );

    if (!carts) {
      throw createError(404, "Carts not found");
    }

    sendSuccessResponse(res, carts, "Carts retrieved successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// create a cart
const createCart = async (req, res, next) => {
  const { product, quantity } = req.body;

  try {
    const cart = new Cart({
      product,
      quantity,
      user: req.user.id,
    });

    const doc = await cart.save();

    await doc.populate("product", "-__v -createdAt -updatedAt -reviews");

    if (!doc) {
      throw createError(500, "Error in creating cart");
    }

    sendSuccessResponse(res, doc, "Cart created successfully!", 201);
  } catch (error) {
    next(error);
  }
};

// remove a cart
const removeCart = async (req, res, next) => {
  const { id: cartId } = req.params;

  try {
    const cart = await Cart.findByIdAndDelete(cartId);

    if (!cart) {
      throw createError(404, "Cart not found or already deleted");
    }

    sendSuccessResponse(res, null, "Cart deleted successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// update a cart
const updateCart = async (req, res, next) => {
  const { id: cartId } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      cartId,
      { quantity },
      {
        new: true,
      }
    ).populate("product", "-__v -createdAt -updatedAt -reviews");

    if (!updatedCart) {
      throw createError(404, "Cart not found to update");
    }

    sendSuccessResponse(res, updatedCart, "Cart updated successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// clear all carts of a user
const clearUserCarts = async (req, res, next) => {
  try {
    const carts = await Cart.deleteMany({ user: req.params.userId });

    if (!carts) {
      throw createError(404, "Carts not found to clear");
    }

    sendSuccessResponse(res, null, "Carts cleared successfully!", 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCarts,
  getUserCarts,
  createCart,
  removeCart,
  updateCart,
  clearUserCarts,
};
