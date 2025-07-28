// Import Multer for handling file uploads
const multer = require("multer");

// Import the configured ImageKit instance
const { imagekit } = require("../utils/image-kit");

// Import the custom error class
const AppError = require("../utils/app-error");

// Use memory storage so files are stored in RAM instead of disk
const storage = multer.memoryStorage();

// Create a multer instance using memory storage
const upload = multer({ storage: storage });

// Middleware to handle file uploads and upload them to ImageKit
const uploadFiles = (isMultiple) => {
  // Return an Express middleware
  return async (req, res, next) => {
    // Check if no file is uploaded (either single or multiple)
    if (!req.file || (req.files && req.files.length === 0)) {
      console.log("hear");
      next(); // Continue to next middleware if no files
      return;
    }

    // Normalize files to always be an array
    const files = isMultiple ? req.files : [req.file];

    try {
      // Upload all files to ImageKit in parallel
      const results = await Promise.all(
        files.map(async (file) => {
          return await imagekit.upload({
            file: file.buffer, // File content in memory
            fileName: `${Date.now()}-${file.fieldname}`, // Unique file name
            folder: "users" // Target folder in ImageKit
          });
        })
      );

      // Store the uploaded file URLs in the request object for use later
      req.imageUrls = results.map((res) => res.url);

      // Continue to the next middleware or route handler
      next();
    } catch (error) {
      // If any error occurs during upload, throw an internal server error
      throw new AppError(error.message, 500);
    }
  };
};

// Export both the multer upload instance and the custom uploadFiles middleware
module.exports = {
  upload,
  uploadFiles
};
