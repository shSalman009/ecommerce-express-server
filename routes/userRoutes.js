const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  updatePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const {
  isLoggedIn,
  isAdmin,
  isAuthorized,
} = require("../middlewares/authMiddleware");
const {
  updatePasswordValidator,
  resetPasswordValidator,
} = require("../validators/authValidators");
const { runValidation } = require("../validators");

// get all users
router.get("/", isLoggedIn, isAdmin, getUsers);

// get single user
router.get("/:id", isLoggedIn, isAuthorized, getUser);

// delete user
router.delete("/:id", isLoggedIn, isAuthorized, deleteUser);

// update password
router.patch(
  "/update-password/:id",
  isLoggedIn,
  isAuthorized,
  updatePasswordValidator,
  runValidation,
  updatePassword
);

// forgot password
router.post("/forgot-password", forgotPassword);

// reset password
router.patch(
  "/reset-password",
  resetPasswordValidator,
  runValidation,
  resetPassword
);

// update user
router.patch("/:id", isLoggedIn, isAuthorized, updateUser);

module.exports = router;
