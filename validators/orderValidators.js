const { check } = require("express-validator");

const isPlainObject = (val) =>
  !!val && typeof val === "object" && val.constructor === Object;

const createOrderValidator = [
  check("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("shippingCost")
    .exists()
    .withMessage("Shipping cost is required")
    .isNumeric({ min: 1 })
    .withMessage("Shipping cost must be a number"),

  check("total")
    .exists()
    .withMessage("Total is required")
    .isNumeric({ min: 1 })
    .withMessage("Total must be a number"),

  check("paymentDetails")
    .exists()
    .withMessage("Payment details is required")
    .isObject()
    .withMessage("Payment details must be an object"),

  check("paymentDetails.cardHolder")
    .exists()
    .withMessage("Card holder is required")
    .isString()
    .withMessage("Card holder must be a string"),

  check("paymentDetails.cardNumber")
    .exists()
    .withMessage("Card number is required")
    .isString()
    .withMessage("Card number must be a string"),

  check("paymentDetails.cardExpiration")
    .exists()
    .withMessage("Card expiration is required")
    .isString()
    .withMessage("Card expiration must be a string"),

  check("paymentDetails.cardCVC")
    .exists()
    .withMessage("Card CVC is required")
    .isString()
    .withMessage("Card CVC must be a string"),

  check("billingAddress")
    .exists()
    .withMessage("Billing address is required")
    .isObject()
    .withMessage("Billing address must be an object"),

  check("billingAddress.street")
    .exists()
    .withMessage("Street is required")
    .isString()
    .withMessage("Street must be a string"),

  check("billingAddress.city")
    .exists()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string"),

  check("billingAddress.state")
    .exists()
    .withMessage("State is required")
    .isString()
    .withMessage("State must be a string"),

  check("billingAddress.zip")
    .exists()
    .withMessage("Zip is required")
    .isString()
    .withMessage("Zip must be a string"),

  check("shippingAddress")
    .exists()
    .withMessage("Shipping address is required")
    .isObject()
    .withMessage("Shipping address must be an object"),

  check("shippingAddress.street")
    .exists()
    .withMessage("Street is required")
    .isString()
    .withMessage("Street must be a string"),

  check("shippingAddress.city")
    .exists()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string"),

  check("shippingAddress.state")
    .exists()
    .withMessage("State is required")
    .isString()
    .withMessage("State must be a string"),

  check("shippingAddress.zip")
    .exists()
    .withMessage("Zip is required")
    .isString()
    .withMessage("Zip must be a string"),

  check("products")
    .isArray({ min: 1 })
    .withMessage("Order must have at least one product")
    .custom((value) => {
      value.forEach((item) => {
        if (!isPlainObject(item)) {
          throw new Error("Products must be an array of objects");
        }
      });
      return true;
    }),

  check("products.*.product")
    .exists()
    .withMessage("Product id is required")
    .isMongoId()
    .withMessage("Product id must be a valid mongodb id"),

  check("products.*.quantity")
    .exists()
    .withMessage("Product quantity is required")
    .isNumeric({ min: 1 })
    .withMessage("Product quantity must be a number"),
];

const updateOrderValidator = [
  check("billingAddress")
    .optional()
    .isObject()
    .withMessage("Billing address must be an object"),

  check("billingAddress.street")
    .optional()
    .isString()
    .withMessage("Street must be a string"),

  check("billingAddress.city")
    .optional()
    .isString()
    .withMessage("City must be a string"),

  check("billingAddress.state")
    .optional()
    .isString()
    .withMessage("State must be a string"),

  check("billingAddress.zip")
    .optional()
    .isString()
    .withMessage("Zip must be a string"),

  check("shippingAddress")
    .optional()
    .isObject()
    .withMessage("Shipping address must be an object"),

  check("shippingAddress.street")
    .optional()
    .isString()
    .withMessage("Street must be a string"),

  check("shippingAddress.city")
    .optional()
    .isString()
    .withMessage("City must be a string"),

  check("shippingAddress.state")
    .optional()
    .isString()
    .withMessage("State must be a string"),

  check("shippingAddress.zip")
    .optional()
    .isString()
    .withMessage("Zip must be a string"),

  check("products")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Order must have at least one product")
    .custom((value) => {
      value.forEach((item) => {
        if (!isPlainObject(item)) {
          throw new Error("Products must be an array of objects");
        }
      });
      return true;
    }),

  check("products.*.product")
    .optional()
    .isMongoId()
    .withMessage("Product id must be a valid mongodb id"),

  check("products.*.quantity")
    .optional()
    .isNumeric({ min: 1 })
    .withMessage("Product quantity must be a number"),
];

module.exports = {
  createOrderValidator,
  updateOrderValidator,
};
