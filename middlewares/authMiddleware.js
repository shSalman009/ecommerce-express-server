const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// is logged in check
const isLoggedIn = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    throw createError(401, "You are not logged in!");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      throw createError(401, "Token is invalid or has expired!");
    } else {
      req.user = user;
      next();
    }
  });
};

// is logged out check
const isLoggedOut = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (token) {
    throw createError(401, "You are already logged in!");
  } else {
    next();
  }
};

// authorization checks
const isAuthorized = (req, res, next) => {
  const providedUserId = req.params.id || req.params.userId;

  if (req.user.id === providedUserId || req.user.isAdmin) {
    next();
  } else {
    throw createError(403, "You are not authorized to perform this action!");
  }
};

// is admin check
const isAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    throw createError(403, "You are not authorized to perform this action!");
  }
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
  isAuthorized,
  isAdmin,
};
