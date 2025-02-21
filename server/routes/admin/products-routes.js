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

// Add this before your other routes

module.exports = router;
