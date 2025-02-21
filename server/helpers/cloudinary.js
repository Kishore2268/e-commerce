const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new multer.memoryStorage();

const imageUploadUtil = async (file) => {
  try {
    console.log("Received file in imageUploadUtil:", file); // Debug log

    if (!file || !file.buffer) {
      throw new Error("Invalid file data received");
    }

    // Convert buffer to base64
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = "data:" + file.mimetype + ";base64," + b64;
    
    console.log("Attempting Cloudinary upload..."); // Debug log

    const uploadOptions = {
      resource_type: "auto",
      folder: "clothing-store",
    };

    const result = await cloudinary.uploader.upload(dataURI, uploadOptions);
    console.log("Cloudinary upload result:", result); // Debug log

    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };
