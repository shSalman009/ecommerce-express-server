const { sendSuccessResponse } = require("../helpers/response");
const Brand = require("../models/brand");
const createError = require("http-errors");

// get all brands
const getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({});

    if (!brands) {
      throw createError(404, "No brands found");
    }

    sendSuccessResponse(res, brands, "Brands retrieved successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// create brand
const createBrand = async (req, res, next) => {
  try {
    const brand = await Brand.create({
      name: req.body.name,
    });

    if (!brand) {
      throw createError(500, "Brand not created");
    }

    sendSuccessResponse(res, brand, "Brand created successfully!", 201);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// update brand
const updateBrand = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const brand = await Brand.findByIdAndUpdate(
      id,
      {
        name: name,
      },
      { new: true }
    );

    if (!brand) {
      throw createError(404, "Brand not found");
    }

    sendSuccessResponse(res, brand, "Brand updated successfully!", 200);
  } catch (error) {
    next(error);
  }
};

// delete brand
const deleteBrand = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedBrand = await Brand.findByIdAndDelete(id);

    if (!deletedBrand) {
      throw createError(404, "Brand not found to delete");
    }

    sendSuccessResponse(res, null, "Brand deleted successfully!", 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
};
