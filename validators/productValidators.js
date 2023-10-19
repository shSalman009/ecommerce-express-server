const { check } = require("express-validator");

const createProductValidator = [
  check("name")
    .notEmpty()
    .withMessage("Product name is required")
    .isString()
    .withMessage("Product name must be a string")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product name must be between 3 and 100 characters")
    .matches(/^[a-zA-Z0-9 ]*$/)
    .withMessage("Product name must contain only alphanumeric characters"),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isString()
    .withMessage("Product description must be a string")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Product description must be between 10 and 1000 characters"),

  check("images")
    .isArray({ min: 1 })
    .withMessage("At least one image is required")
    .custom((images) => {
      if (!images.every((image) => typeof image === "string")) {
        throw new Error("Product images must be an array of strings");
      }
      return true;
    }),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Product price must be a positive number"),

  check("discount")
    .notEmpty()
    .withMessage("Product discount is required")
    .isNumeric()
    .withMessage("Product discount must be a number")
    .isFloat({ min: 0 })
    .withMessage("Product discount must be a positive number"),

  check("stock")
    .notEmpty()
    .withMessage("Product stock is required")
    .isNumeric()
    .withMessage("Product stock must be a number")
    .isInt({ min: 0 })
    .withMessage("Product stock must be a positive integer"),

  check("brand")
    .notEmpty()
    .withMessage("Product brand is required")
    .isString()
    .withMessage("Product brand must be a string")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product brand must be between 3 and 100 characters"),

  check("category")
    .notEmpty()
    .withMessage("Product category is required")
    .isMongoId()
    .withMessage("Product category must be a valid MongoDB ID"),

  check("features")
    .optional()
    .isArray()
    .withMessage("Product features must be an array")
    .custom((features) => {
      if (!features.every((feature) => typeof feature === "string")) {
        throw new Error("Product features must be an array of strings");
      }
      return true;
    }),

  check("specifications")
    .optional()
    .isObject()
    .withMessage("Product specifications must be an object")
    .custom((specifications) => {
      const keys = Object.keys(specifications);
      if (keys.length === 0) {
        throw new Error("Product specifications must not be empty");
      }
      if (
        !keys.every(
          (key) =>
            typeof key === "string" && typeof specifications[key] === "string"
        )
      ) {
        throw new Error("Product specifications must be a valid object");
      }
      return true;
    }),
];

const updateProductValidator = [
  check("name")
    .optional()
    .isString()
    .withMessage("Product name must be a string")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product name must be between 3 and 100 characters")
    .matches(/^[a-zA-Z0-9 ]*$/)
    .withMessage("Product name must contain only alphanumeric characters"),
  check("description")
    .optional()
    .isString()
    .withMessage("Product description must be a string")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Product description must be between 10 and 1000 characters"),

  check("images")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one image is required")
    .custom((images) => {
      if (!images.every((image) => typeof image === "string")) {
        throw new Error("Product images must be an array of strings");
      }
      return true;
    }),

  check("price")
    .optional()
    .isNumeric()
    .withMessage("Product price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Product price must be a positive number"),

  check("discount")
    .optional()
    .isNumeric()
    .withMessage("Product discount must be a number")
    .isFloat({ min: 0 })
    .withMessage("Product discount must be a positive number"),

  check("stock")
    .optional()
    .isNumeric()
    .withMessage("Product stock must be a number")
    .isInt({ min: 0 })
    .withMessage("Product stock must be a positive integer"),

  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number")
    .isInt({ min: 0 })
    .withMessage("Product sold must be a positive integer"),

  check("brand")
    .optional()
    .isString()
    .withMessage("Product brand must be a string")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product brand must be between 3 and 100 characters"),

  check("category")
    .optional()
    .isMongoId()
    .withMessage("Product category must be a valid MongoDB ID"),

  check("features")
    .optional()
    .isArray()
    .withMessage("Product features must be an array")
    .custom((features) => {
      if (!features.every((feature) => typeof feature === "string")) {
        throw new Error("Product features must be an array of strings");
      }
      return true;
    }),
  check("specifications")
    .optional()
    .isObject()
    .withMessage("Product specifications must be an object")
    .custom((specifications) => {
      const keys = Object.keys(specifications);
      if (keys.length === 0) {
        throw new Error("Product specifications must not be empty");
      }
      if (
        !keys.every(
          (key) =>
            typeof key === "string" && typeof specifications[key] === "string"
        )
      ) {
        throw new Error("Product specifications must be a valid object");
      }
      return true;
    }),
];

const addReviewValidator = [
  check("rating")
    .notEmpty()
    .withMessage("Product rating is required")
    .isNumeric()
    .withMessage("Product rating must be a number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Product rating must be a number between 1 and 5"),
  check("comment")
    .notEmpty()
    .withMessage("Product review comment is required")
    .isString()
    .withMessage("Product review comment must be a string")
    .isLength({ min: 3, max: 1000 })
    .withMessage(
      "Product review comment must be between 3 and 1000 characters"
    ),
];

const updateReviewValidator = [
  check("rating")
    .optional()
    .isNumeric()
    .withMessage("Product rating must be a number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Product rating must be a number between 1 and 5"),
  check("comment")
    .optional()
    .isString()
    .withMessage("Product review comment must be a string")
    .isLength({ min: 3, max: 1000 })
    .withMessage(
      "Product review comment must be between 3 and 1000 characters"
    ),
];

module.exports = {
  createProductValidator,
  updateProductValidator,
  addReviewValidator,
  updateReviewValidator,
};
