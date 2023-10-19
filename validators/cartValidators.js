const { check } = require("express-validator");

const createCartValidator = [
  check("product")
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Product must be a valid mongodb id"),
  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number"),
];

const updateCartValidator = [
  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number"),
];

module.exports = {
  createCartValidator,
  updateCartValidator,
};
