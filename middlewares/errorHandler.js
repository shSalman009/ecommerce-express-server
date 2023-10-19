const createError = require("http-errors");
const { sendErrorResponse } = require("../helpers/response");

// 404 error handler
const notFoundHandler = (req, res, next) => {
  next(createError(404, "Your requested content was not found!"));
};

// default error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;

  if (err.code === 11000) {
    // Duplicate key error (e.g., unique constraint violation)
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    sendErrorResponse(res, message, statusCode);
  } else {
    // Handle other errors
    sendErrorResponse(res, err.message, statusCode);
  }
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
