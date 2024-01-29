// imports
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { extractPublicId } = require("cloudinary-build-url");
// config
const IMAGE_FORMAT = "png";

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
    format: async (req, file) => IMAGE_FORMAT,
    public_id: (req, file) => {
      // Replace spaces with underscores in the filename
      const fileNameWithoutSpaces = file.originalname.replace(/\s/g, "_");

      // remove the last extension (.png, .jpg, .jpeg, etc)
      const lastDotPngIndex = fileNameWithoutSpaces.lastIndexOf(".");
      const fileNameWithoutLastExtension = fileNameWithoutSpaces.substring(
        0,
        lastDotPngIndex
      );

      return fileNameWithoutLastExtension;
    },
  },
});

const parser = multer({ storage: storage });

const imageUpload = {};

imageUpload.multiple = async (req, res, next) => {
  try {
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map((file) => file.path);
    }
    next();
  } catch (error) {
    next(error);
  }
};

imageUpload.single = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = req.file.path;
    }
    next();
  } catch (error) {
    next(error);
  }
};

// update product images
const imageUpdate = {};

imageUpdate.multiple = async (req, res, next) => {
  try {
    let currentImages = req.body.images;
    let newImages = [];

    if (req.files && req.files.length > 0) {
      newImages = req.files.map((file) => file.path);
    }

    req.body.images = [...currentImages, ...newImages];
    next();
  } catch (error) {
    next(error);
  }
};

imageUpdate.single = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = req.file.path;
    }
    next();
  } catch (error) {
    next(error);
  }
};

// remove image from cloudinary
const imageRemove = async (image) => {
  const publicId = extractPublicId(image);
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log("Removed image : ", image);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  parser,
  imageUpdate,
  imageUpload,
  imageRemove,
};
