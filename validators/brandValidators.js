const { check } = require("express-validator");

const createBrandValidator = [
  check("name")
    .exists()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
];

const updateBrandValidator = [
  check("name")
    .exists()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
];

module.exports = {
  createBrandValidator,
  updateBrandValidator,
};
