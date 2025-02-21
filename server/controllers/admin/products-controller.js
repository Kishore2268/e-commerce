const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");
const { authMiddleware } = require("../auth/auth-controller");

const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const result = await imageUploadUtil(req.file);

    res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
      message: "Image uploaded successfully"
    });
  } catch (error) {
    console.error("Error in handleImageUpload:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: error.message
    });
  }
};

//add a new product
const addProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    // Format the data
    const formattedProduct = {
      ...productData,
      // Convert price and salePrice to numbers
      price: Number(productData.price),
      salePrice: productData.salePrice ? Number(productData.salePrice) : undefined,
      // Ensure colors is an array
      colors: Array.isArray(productData.colors) ? productData.colors : [],
      sizes: {
        clothing: [],
        footwear: []
      }
    };

    // Handle sizes based on category
    if (productData.category === "clothing" && productData.sizes?.clothing) {
      formattedProduct.sizes.clothing = productData.sizes.clothing.map(item => ({
        size: item.size.toString().toLowerCase(),
        stock: Number(item.stock) || 0
      }));
    } else if (productData.category === "footwear" && productData.sizes?.footwear) {
      formattedProduct.sizes.footwear = productData.sizes.footwear.map(item => ({
        size: item.size.toString().toLowerCase(),
        stock: Number(item.stock) || 0
      }));
    }

    // Calculate total stock
    formattedProduct.totalStock = productData.category === "accessories" 
      ? Number(productData.stock) || 0
      : formattedProduct.sizes[productData.category].reduce((sum, item) => sum + (Number(item.stock) || 0), 0);

    // Validate required fields
    if (!formattedProduct.title || !formattedProduct.description || !formattedProduct.category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Create and save the product
    const newProduct = new Product(formattedProduct);
    const savedProduct = await newProduct.save();

    res.status(200).json({
      success: true,
      message: "Product added successfully",
      data: savedProduct
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      success: false,
      message: "Error adding product",
      error: error.message
    });
  }
};

//fetch all products

const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      subCategory,
      brand,
      price,
      salePrice,
      sizes,
      colors,
      averageReview,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.subCategory = subCategory || findProduct.subCategory;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.sizes = category === "footwear" ? { footwear: sizes } : { clothing: sizes };
    findProduct.colors = colors || findProduct.colors;
    findProduct.averageReview = averageReview || findProduct.averageReview;

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
