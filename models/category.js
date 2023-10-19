const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
      trim: true,
      min: 3,
      max: 20,
    },
    slug: {
      type: String,
      required: [true, "Slug is required!"],
      lowercase: true,
      unique: [true, "Slug must be unique!"],
    },
    image: {
      type: String,
      required: [true, "Image is required!"],
      trim: true,
    },
  },
  { timestamps: true }
);

const virtualId = categorySchema.virtual("id");
virtualId.get(function () {
  return this._id;
});

categorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
