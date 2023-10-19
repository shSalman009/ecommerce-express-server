const express = require("express");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { categoryValidator } = require("../validators/categoryValidators");
const { runValidation } = require("../validators");
const { isLoggedIn, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// create a category
router.post(
  "/",
  isLoggedIn,
  isAdmin,
  categoryValidator,
  runValidation,
  createCategory
);

// get all categories
router.get("/", getCategories);

// get a single category by slug
router.get("/:slug", getCategory);

// update a category
router.patch(
  "/:slug",
  isLoggedIn,
  isAdmin,
  categoryValidator,
  runValidation,
  updateCategory
);

// delete a category
router.delete("/:slug", isLoggedIn, isAdmin, deleteCategory);

module.exports = router;
