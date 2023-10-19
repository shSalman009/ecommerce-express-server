const express = require("express");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  getProductsByCategory,
  getCategoryProducts,
} = require("../controllers/productController");
const {
  createProductValidator,
  updateProductValidator,
  addReviewValidator,
  updateReviewValidator,
} = require("../validators/productValidators");
const { runValidation } = require("../validators");
const { isLoggedIn, isAdmin } = require("../middlewares/authMiddleware");
const validateMongooseId = require("../middlewares/validateMongooseId");

const router = express.Router();

// create a new product
router.post(
  "/",
  isLoggedIn,
  isAdmin,
  createProductValidator,
  runValidation,
  createProduct
);

// get all products
router.get("/", getProducts);

// get all products of a category
router.get("/category/:slug", getCategoryProducts);

// get a single product
router.get("/:slug", getProduct);

// update a product
router.patch(
  "/:slug",
  isLoggedIn,
  isAdmin,
  updateProductValidator,
  runValidation,
  updateProduct
);

// delete a product
router.delete("/:slug", isLoggedIn, isAdmin, deleteProduct);

// REVIEW ROUTES
// add a review to a product
router.post(
  "/:slug/reviews",
  isLoggedIn,
  addReviewValidator,
  runValidation,
  addReview
);

// get all reviews of a product
router.get("/:slug/reviews", getReviews);

// get a single review of a product
router.get("/:slug/reviews/:id", getReview);

// update a review of a product
router.patch(
  "/:slug/reviews/:id",
  isLoggedIn,
  validateMongooseId("id", "review"),
  updateReviewValidator,
  runValidation,
  updateReview
);

// delete a review of a product
router.delete(
  "/:slug/reviews/:id",
  isLoggedIn,
  validateMongooseId("id", "review"),
  deleteReview
);

module.exports = router;
