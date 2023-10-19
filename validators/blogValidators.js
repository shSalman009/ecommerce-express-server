const { check } = require("express-validator");

const createBlogValidator = [
  check("title")
    .notEmpty()
    .withMessage("Title is required!")
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters long!"),

  check("description")
    .notEmpty()
    .withMessage("Description is required!")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long!"),

  check("image")
    .notEmpty()
    .withMessage("Image is required!")
    .isURL()
    .withMessage("Image must be a valid URL!"),
];

const updateBlogValidator = [
  check("title")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters long!"),

  check("description")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long!"),

  check("image").optional().isURL().withMessage("Image must be a valid URL!"),
];

module.exports = {
  createBlogValidator,
  updateBlogValidator,
};
