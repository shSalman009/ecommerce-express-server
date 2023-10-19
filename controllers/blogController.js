const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../helpers/response");
const Blog = require("../models/blog");
const createError = require("http-errors");

// create blog
const createBlog = async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body);

    if (!blog) {
      throw createError(500, "Error in creating blog");
    }

    sendSuccessResponse(res, blog, "Blog created successfully!", 201);
  } catch (err) {
    next(err);
  }
};

// update blog
const updateBlog = async (req, res, next) => {
  const blogId = req.params.id;

  const updates = Object.keys(req.body);

  try {
    if (!updates.length) {
      throw createError(400, "No data provided to update blog");
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, req.body, {
      new: true,
    });

    if (!updatedBlog) {
      throw createError(500, "Error in updating blog");
    }

    sendSuccessResponse(res, updatedBlog, "Blog updated successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// delete blog
const deleteBlog = async (req, res, next) => {
  const blogId = req.params.id;

  try {
    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      throw createError(500, "Error in deleting blog");
    }
    sendSuccessResponse(res, null, "Blog deleted successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// get all blogs
const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find();

    if (!blogs) {
      throw createError(404, "No blogs found!");
    }

    sendSuccessResponse(res, blogs, "Blogs fetched successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// get single blog
const getBlog = async (req, res, next) => {
  const blogId = req.params.id;

  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      throw createError(404, "Blog not found!");
    }

    sendSuccessResponse(res, blog, "Blog fetched successfully!", 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlog,
};
