const { validationResult } = require("express-validator");
const { sendErrorResponse } = require("../helpers/response");

const runValidation = function (req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
  } else {
    const errorMsg = errors.errors[0].msg;
    sendErrorResponse(res, errorMsg, 400);
  }
};

module.exports = {
  runValidation,
};
