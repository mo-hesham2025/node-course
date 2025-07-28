// Import Multer for handling file uploads
const multer = require('multer');

// Import path module to work with file paths and extensions
const path = require('path');

// Configure Multer storage to save files on disk
const storage = multer.diskStorage({
  // Set the destination folder where files will be stored
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Store files in the 'uploads' folder
  },
  
  // Set the filename for uploaded files
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Extract file extension
    const fileName = `${Date.now()}-${file.fieldname}${ext}`; // Create unique filename
    cb(null, fileName); // Pass the generated filename to the callback
  }
});

// Create a Multer instance using the configured disk storage
const upload = multer({ storage: storage });

// Export the upload instance for use in routes or middleware
module.exports = {
  upload
};
