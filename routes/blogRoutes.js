const express = require("express");
const {
  createBlogValidator,
  updateBlogValidator,
} = require("../validators/blogValidators");
const { runValidation } = require("../validators");
const {
  createBlog,
  updateBlog,
  getAllBlogs,
  deleteBlog,
  getBlog,
} = require("../controllers/blogController");
const { isLoggedIn, isAdmin } = require("../middlewares/authMiddleware");
const {
  parser,
  imageUpload,
  imageUpdate,
} = require("../middlewares/imageUpload");
const parseJsonData = require("../middlewares/parseJson");

const router = express.Router();

// create blog
router.post(
  "/",
  isLoggedIn,
  isAdmin,
  parser.single("image"),
  parseJsonData,
  imageUpload.single,
  createBlogValidator,
  runValidation,
  createBlog
);

// update blog
router.patch(
  "/:id",
  isLoggedIn,
  isAdmin,
  parser.single("image"),
  parseJsonData,
  imageUpdate.single,
  updateBlogValidator,
  runValidation,
  updateBlog
);

// delete blog
router.delete("/:id", isLoggedIn, isAdmin, deleteBlog);

// get all blogs
router.get("/", getAllBlogs);

// get blog by id
router.get("/:id", getBlog);

module.exports = router;
