const { check } = require("express-validator");

const categoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required!")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be between 3 to 20 characters!"),
  check("image")
    .notEmpty()
    .withMessage("Image is required!")
    .isURL()
    .withMessage("Image must be a valid URL!"),
];

module.exports = {
  categoryValidator,
};
