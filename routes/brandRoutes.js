const express = require("express");

const router = express.Router();

const {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");
const { isLoggedIn, isAdmin } = require("../middlewares/authMiddleware");
const {
  createBrandValidator,
  updateBrandValidator,
} = require("../validators/brandValidators");
const { runValidation } = require("../validators");

// get all brands
router.get("/", getBrands);

// create brand
router.post(
  "/",
  isLoggedIn,
  isAdmin,
  createBrandValidator,
  runValidation,
  createBrand
);

// update brand
router.patch(
  "/:id",
  isLoggedIn,
  isAdmin,
  updateBrandValidator,
  runValidation,
  updateBrand
);

// delete brand
router.delete("/:id", isLoggedIn, isAdmin, deleteBrand);

module.exports = router;
