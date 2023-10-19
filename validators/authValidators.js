const { check } = require("express-validator");
const createError = require("http-errors");

const User = require("../models/user");

const registrationValidator = [
  check("name")
    .custom(async (value) => {
      if (!value) throw createError("Name is required!");

      if (value.length < 3 || value.length > 20) {
        throw createError("Name must be between 3 to 20 characters long!");
      }
    })
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw createError(409, "Email already in use!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
    ),
  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw createError("Password does not match!");
    }
    return true;
  }),
];

const loginValidator = [
  check("email").isEmail().withMessage("Invalid email address").trim(),
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
    ),
];

const updatePasswordValidator = [
  check("currentPassword")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
    ),
  check("newPassword")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
    ),
  check("confirmNewPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw createError("Password does not match!");
    }
    return true;
  }),
];

const resetPasswordValidator = [
  check("token").isJWT().withMessage("Invalid token"),
  check("newPassword")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
    ),
  check("confirmNewPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw createError("Password does not match!");
    }
    return true;
  }),
];

module.exports = {
  registrationValidator,
  loginValidator,
  updatePasswordValidator,
  resetPasswordValidator,
};
