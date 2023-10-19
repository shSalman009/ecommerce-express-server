const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});

const virtualId = brandSchema.virtual("id");
virtualId.get(function () {
  return this._id;
});

brandSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
