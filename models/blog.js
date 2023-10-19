const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
    },

    description: {
      type: String,
      required: true,
      minlength: 10,
    },

    image: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

const virtualId = blogSchema.virtual("id");
virtualId.get(function () {
  return this._id;
});

blogSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
