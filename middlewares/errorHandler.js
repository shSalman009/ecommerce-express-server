const createError = require("http-errors");
const { sendErrorResponse } = require("../helpers/response");
const { imageRemove } = require("./imageUpload");

// 404 error handler
const notFoundHandler = (req, res, next) => {
  next(createError(404, "Your requested content was not found!"));
};

// default error handler
const errorHandler = async (err, req, res, next) => {
  try {
    const statusCode = err.status || 500;
    // remove files from cloudinary
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      if (req.file) {
        await imageRemove(req.file.path);
      }
      if (req.files && req.files.length > 0) {
        await Promise.all(req.files.map((file) => imageRemove(file.path)));
      }
    }

    if (err.code === 11000) {
      // Duplicate key error (e.g., unique constraint violation)
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      sendErrorResponse(res, message, statusCode);
    } else {
      // Handle other errors
      sendErrorResponse(res, err.message, statusCode);
    }
  } catch (error) {
    sendErrorResponse(res, error?.message, 500);
  }
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
