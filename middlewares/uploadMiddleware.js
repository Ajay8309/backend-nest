// middlewares/uploadMiddleware.js
const multer = require('multer');

// use memory storage and upload to cloudinary in controller/service
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
