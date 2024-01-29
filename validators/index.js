const { validationResult } = require("express-validator");
const createError = require("http-errors");

const runValidation = async function (req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
  } else {
    const errorMsg = errors.errors[0].msg;
    next(createError(400, errorMsg));
  }
};

module.exports = {
  runValidation,
};
