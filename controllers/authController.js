// external imports
const bcrypt = require("bcrypt");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");

// internal imports
const User = require("../models/user");
const { sendSuccessResponse } = require("../helpers/response");

// register new user
const register = async (req, res, next) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin,
    });

    delete user._doc.password;

    sendSuccessResponse(res, user, "User created successfully!", 201);
  } catch (error) {
    next(error);
  }
};

// login user
const login = async (req, res, next) => {
  const { email, password } = req.body;

  // check if user exists
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, "User not found!");
    }

    // check if password is correct
    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      throw createError(400, "Invalid credentials!");
    }

    delete user._doc.password;

    // create token
    const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // set cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      sameSite: "none",
      secure: true,
    });
    sendSuccessResponse(res, user, "User logged in successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// logout user
const logout = async (req, res, next) => {
  try {
    res.cookie("accessToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      sameSite: "none",
      secure: true,
    });

    sendSuccessResponse(res, null, "User logged out successfully!", 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
};
