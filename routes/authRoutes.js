const express = require("express");
const router = express.Router();

const { register, login, logout } = require("../controllers/authController");
const {
  registrationValidator,
  loginValidator,
} = require("../validators/authValidators");
const { isLoggedOut, isLoggedIn } = require("../middlewares/authMiddleware");
const { runValidation } = require("../validators");
const { sendSuccessResponse } = require("../helpers/response");

// register user
router.post(
  "/register",
  isLoggedOut,
  registrationValidator,
  runValidation,
  register
);

// login user
router.post("/login", isLoggedOut, loginValidator, runValidation, login);

// logout user
router.post("/logout", isLoggedIn, logout);

// check auth state
router.get("/check", isLoggedIn, (req, res) => {
  sendSuccessResponse(res, req.user, "You are logged in!", 200);
});

module.exports = router;
