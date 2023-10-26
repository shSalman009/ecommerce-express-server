// external imports
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// internal imports
const User = require("../models/user");
const { sendSuccessResponse } = require("../helpers/response");
const sendEmail = require("../helpers/email");

// get all users
const getUsers = async (req, res, next) => {
  const search = req.query.search || "";
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  const filter = {
    isAdmin: false,
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ],
  };

  const options = {
    password: 0,
  };

  try {
    const users = await User.find(filter, options)
      .limit(limit)
      .skip(limit * page - limit);

    sendSuccessResponse(res, users, "All users retrieved successfully!", 200);
  } catch (error) {
    next(error);
  }
};
// get single user
const getUser = async (req, res, next) => {
  const id = req.params.id;
  const options = {
    password: 0,
  };

  try {
    const user = await User.findById(id, options);

    if (!user) {
      throw createError(404, "User not found");
    }

    sendSuccessResponse(res, user, "User retrieved successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// update user
const updateUser = async (req, res, next) => {
  const { name, email, isAdmin } = req.body;
  const userId = req.params.id;

  try {
    // user have to provide at least one field to update
    if (!name && !email && !isAdmin) {
      throw createError(400, "Please provide at least one field to update");
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        isAdmin,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "User not found");
    }

    sendSuccessResponse(res, updatedUser, "User updated successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// delete user
const deleteUser = async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw createError(404, "User not found");
    }

    sendSuccessResponse(res, null, "User deleted successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// update password
const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw createError(404, "User not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      throw createError(400, "Current password is wrong");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
      },
      { new: true }
    ).select("-password");

    sendSuccessResponse(
      res,
      updatedUser,
      "User password updated successfully!",
      200
    );
  } catch (error) {
    next(error);
  }
};

// forgot password
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw createError(404, "User not found with this email address");
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    // send email
    const emailData = {
      name: user.name,
      email: user.email,
      link: resetPasswordLink,
    };
    await sendEmail(emailData);

    sendSuccessResponse(
      res,
      token,
      "Reset password link has been sent to your email",
      200
    );
  } catch (error) {
    next(error);
  }
};

// reset password
const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    // validate token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw createError(400, "Invalid token");
    }

    // update password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await User.findOneAndUpdate(
      { email: decoded.email },
      {
        password: hashedPassword,
      },
      { new: true }
    ).select("-password");

    sendSuccessResponse(res, updatedUser, "Password reset successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// export all controllers
module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updatePassword,
  forgotPassword,
  resetPassword,
};
