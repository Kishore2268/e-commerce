const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Log environment variables (be careful not to expose secrets in production)
console.log("Cloudinary Environment Variables Check:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "Present" : "Missing",
  api_key: process.env.CLOUDINARY_API_KEY ? "Present" : "Missing",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "Present" : "Missing"
});

// Configure cloudinary
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
};

console.log("Configuring Cloudinary with:", {
  cloud_name: cloudinaryConfig.cloud_name,
  api_key: cloudinaryConfig.api_key ? "Present" : "Missing",
  api_secret: cloudinaryConfig.api_secret ? "Present" : "Missing"
});

cloudinary.config(cloudinaryConfig);

// Verify configuration
console.log("Cloudinary Configuration Status:", cloudinary.config().cloud_name ? "Configured" : "Not Configured");

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
  try {
    if (!file || !file.buffer) {
      throw new Error("Invalid file object received");
    }

    console.log("Processing file:", {
      mimetype: file.mimetype,
      size: file.size,
      originalname: file.originalname
    });

    // Convert buffer to base64
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = "data:" + file.mimetype + ";base64," + b64;
    
    // Verify Cloudinary config before upload
    const config = cloudinary.config();
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      throw new Error("Cloudinary configuration is incomplete");
    }

    console.log("Attempting Cloudinary upload...");
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
      folder: "clothing-store"
    });

    console.log("Upload successful:", {
      public_id: result.public_id,
      url: result.secure_url
    });

    return result;
  } catch (error) {
    console.error("Cloudinary upload error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    throw error;
  }
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };
