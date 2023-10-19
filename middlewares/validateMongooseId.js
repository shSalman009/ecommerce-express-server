const mongoose = require("mongoose");
const createError = require("http-errors");

const validateMongooseId = (paramName, idName) => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, `Invalid ${idName || "mongoose"} ID`));
    }

    next();
  };
};

module.exports = validateMongooseId;
