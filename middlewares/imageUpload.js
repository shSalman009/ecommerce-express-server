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
  const imagesToRemove = req.body.imagesToRemove;
  let currentImages = req.body.images;
  let newImages = [];

  for (const image of imagesToRemove) {
    const publicId = extractPublicId(image);
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  if (req.files && req.files.length > 0) {
    newImages = req.files.map((file) => file.path);
  }

  req.body.images = [...currentImages, ...newImages];
  next();
};

imageUpdate.single = async (req, res, next) => {
  const imageToRemove = req.body.imageToRemove;
  let currentImage = req.body.image;
  let newImage = "";

  if (imageToRemove) {
    const publicId = extractPublicId(imageToRemove);
    try {
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result === "ok") {
        currentImage = "";
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  if (req.file) {
    newImage = req.file.path;
  }

  req.body.image = newImage || currentImage;
  next();
};

module.exports = {
  parser,
  imageUpdate,
  imageUpload,
};
