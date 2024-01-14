const { sendSuccessResponse } = require("../helpers/response");
const Category = require("../models/category");
const slugify = require("slugify");
const createError = require("http-errors");

// create a category
const createCategory = async (req, res, next) => {
  const { name, image } = req.body;

  try {
    const category = await Category.create({
      name: name,
      slug: slugify(name),
      image,
    });
    sendSuccessResponse(res, category, "Category created successfully!", 201);
  } catch (error) {
    next(error);
  }
};

// get all categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});

    if (!categories) {
      throw createError(404, "No categories found");
    }

    sendSuccessResponse(
      res,
      categories,
      "Categories retrieved successfully!",
      200
    );
  } catch (error) {
    next(error);
  }
};

// get a single category by slug
const getCategory = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const category = await Category.findOne({ slug: slug });

    if (!category) {
      throw createError(404, "Category not found");
    }

    sendSuccessResponse(res, category, "Category retrieved successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// update a category
const updateCategory = async (req, res, next) => {
  const { slug } = req.params;
  const { name, image } = req.body;

  try {
    const updatedCategory = await Category.findOneAndUpdate(
      { slug: slug },
      { name: name, slug: slugify(name), image: image },
      { new: true }
    );

    if (!updatedCategory) {
      throw createError(404, "Category not found to update");
    }

    sendSuccessResponse(
      res,
      updatedCategory,
      "Category updated successfully!",
      200
    );
  } catch (error) {
    next(error);
  }
};

// delete a category
const deleteCategory = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const deletedCategory = await Category.findOneAndDelete({ slug: slug });

    if (!deletedCategory) {
      throw createError(404, "Category not found to delete");
    }

    sendSuccessResponse(res, null, "Category deleted successfully!", 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
