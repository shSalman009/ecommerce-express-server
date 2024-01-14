const { validationResult } = require("express-validator");
const { sendErrorResponse } = require("../helpers/response");
const cloudinary = require("cloudinary").v2;

const runValidation = function (req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
  } else {
    // remove files from cloudinary
    if (req.files) {
      req.files.forEach((file) => {
        cloudinary.api.delete_resources(
          file.filename,
          function (error, result) {
            console.log(result, error);
          }
        );
      });
    }

    const errorMsg = errors.errors[0].msg;
    sendErrorResponse(res, errorMsg, 400);
  }
};

module.exports = {
  runValidation,
};
