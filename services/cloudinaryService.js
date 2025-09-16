// services/cloudinaryService.js
const cloudinary = require('../config/cloudinary');

/**
 * Upload buffer (multer memory) to Cloudinary
 * file: { buffer, originalname, mimetype }
 */
async function uploadBuffer(file, folder = 'jobnest') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(file.buffer);
  });
}

async function destroy(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (e) {
    console.error('Cloudinary destroy error', e);
  }
}

module.exports = { uploadBuffer, destroy };
