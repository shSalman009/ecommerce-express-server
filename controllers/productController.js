const { sendSuccessResponse } = require("../helpers/response");
const { imageRemove } = require("../middlewares/imageUpload");
const Product = require("../models/product");
const createError = require("http-errors");
const slugify = require("slugify");

// create product
const createProduct = async (req, res, next) => {
  // exclude sold and reviews from req.body
  const { sold, reviews, ...productData } = req.body;

  try {
    const product = await Product.create({
      ...productData,
      slug: slugify(productData.name),
    });

    sendSuccessResponse(res, product, "Product created successfully!", 201);
  } catch (error) {
    next(error);
  }
};

// get all products
const getProducts = async (req, res, next) => {
  const { name, discount } = req.query;

  const query = {};

  if (name) {
    query.name = { $regex: name, $options: "i" };
  }

  if (discount) {
    query.discount = { $gt: 0 };
  }

  try {
    const products = await Product.find(query).populate("category");

    if (!products || products.length === 0) {
      throw createError(404, "No products found");
    }

    sendSuccessResponse(res, products, "Products retrieved successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// get products by category
const getCategoryProducts = async (req, res, next) => {
  const { slug: categorySlug } = req.params;

  try {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $match: {
          "category.slug": categorySlug,
        },
      },
    ]);

    // transform _id to id
    products.forEach((product) => {
      product.id = product._id;
      delete product._id;
    });

    sendSuccessResponse(res, products, "Products retrieved successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// get a single product
const getProduct = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const product = await Product.findOne({ slug });

    if (!product) {
      throw createError(404, "Product not found");
    }

    sendSuccessResponse(res, product, "Product retrieved successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// update product
const updateProduct = async (req, res, next) => {
  const { slug } = req.params;
  const { newImages, imagesToRemove, ...productData } = req.body;

  try {
    const updates = Object.keys(productData);

    if (updates.length === 0) {
      throw createError(400, "No data provided for update");
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { slug },

      productData,

      {
        new: true,
      }
    );

    if (!updatedProduct) {
      throw createError(404, "Product not found");
    }

    if (imagesToRemove) {
      await Promise.all(imagesToRemove.map((image) => imageRemove(image)));
    }

    sendSuccessResponse(
      res,
      updatedProduct,
      "Product updated successfully!",
      200
    );
  } catch (error) {
    next(error);
  }
};

// delete product
const deleteProduct = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const deletedProduct = await Product.findOneAndDelete({ slug });

    if (!deletedProduct) {
      throw createError(404, "Product not found");
    }

    if (deletedProduct.images) {
      await Promise.all(
        deletedProduct.images.map((image) => imageRemove(image))
      );
    }

    sendSuccessResponse(res, null, "Product deleted successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// add review
const addReview = async (req, res, next) => {
  const { slug } = req.params;
  const { rating, comment } = req.body;

  const newReview = {
    user: req.user.id,
    rating: rating,
    comment: comment,
  };

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { slug },
      { $push: { reviews: newReview } },
      { new: true }
    );

    if (!updatedProduct) {
      throw createError(404, "Product not found");
    }

    sendSuccessResponse(res, updatedProduct, "Review added successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// get reviews
const getReviews = async (req, res, next) => {};

// get review
const getReview = async (req, res, next) => {};

// update review
const updateReview = async (req, res, next) => {
  const { slug, id: reviewId } = req.params;
  const { rating, comment } = req.body;
  try {
    if (!rating && !comment) {
      throw createError(400, "No data provided for update");
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { slug, reviews: { $elemMatch: { _id: reviewId, user: req.user.id } } },
      {
        $set: {
          "reviews.$.rating": rating,
          "reviews.$.comment": comment,
        },
      },
      { new: true }
    );

    if (!updatedProduct) {
      throw createError(404, "Product or review not found");
    }

    sendSuccessResponse(
      res,
      updatedProduct,
      "Review updated successfully!",
      200
    );
  } catch (error) {
    next(error);
  }
};

// delete review
const deleteReview = async (req, res, next) => {
  const { slug, id: reviewId } = req.params;

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { slug, reviews: { $elemMatch: { _id: reviewId, user: req.user.id } } },
      { $pull: { reviews: { _id: reviewId } } },
      { new: true }
    );

    if (!updatedProduct) {
      throw createError(404, "Product or review not found");
    }

    sendSuccessResponse(res, null, "Review deleted successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// export
module.exports = {
  createProduct,
  getProducts,
  getCategoryProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
};
