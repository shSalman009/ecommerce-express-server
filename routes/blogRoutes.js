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

const router = express.Router();

// create blog
router.post(
  "/",
  isLoggedIn,
  isAdmin,
  createBlogValidator,
  runValidation,
  createBlog
);

// update blog
router.patch(
  "/:id",
  isLoggedIn,
  isAdmin,
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
