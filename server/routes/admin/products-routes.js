const express = require("express");
const multer = require('multer');
const cloudinary = require("cloudinary").v2;

const {
  handleImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} = require("../../controllers/admin/products-controller");

const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post("/upload-image", authMiddleware, upload.single('my_file'), handleImageUpload);
router.post("/add", authMiddleware, addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);

// Add this route to test Cloudinary configuration
router.get('/test-cloudinary', async (req, res) => {
  try {
    // Test the configuration
    const testResult = await cloudinary.api.ping();
    
    res.json({
      success: true,
      message: "Cloudinary configuration is valid",
      config: {
        cloud_name: cloudinary.config().cloud_name,
        api_key: cloudinary.config().api_key ? "Present" : "Missing",
        api_secret: cloudinary.config().api_secret ? "Present" : "Missing"
      },
      testResult
    });
  } catch (error) {
    console.error("Cloudinary test error:", error);
    res.status(500).json({
      success: false,
      message: "Cloudinary configuration test failed",
      error: error.message
    });
  }
});

// Add this before your other routes
router.get('/env-test', (req, res) => {
  try {
    res.json({
      success: true,
      environment: process.env.NODE_ENV,
      cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "Present" : "Missing",
        api_key: process.env.CLOUDINARY_API_KEY ? "Present" : "Missing",
        api_secret: process.env.CLOUDINARY_API_SECRET ? "Present" : "Missing"
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
