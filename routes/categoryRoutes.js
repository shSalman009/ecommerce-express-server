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
const {
  parser,
  imageUpload,
  imageUpdate,
} = require("../middlewares/imageUpload");
const parseJsonData = require("../middlewares/parseJson");

const router = express.Router();

// create a category
router.post(
  "/",
  isLoggedIn,
  isAdmin,
  parser.single("image"),
  parseJsonData,
  imageUpload.single,
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
  parser.single("image"),
  parseJsonData,
  imageUpdate.single,
  categoryValidator,
  runValidation,
  updateCategory
);

// delete a category
router.delete("/:slug", isLoggedIn, isAdmin, deleteCategory);

module.exports = router;
