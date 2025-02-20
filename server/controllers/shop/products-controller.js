const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], brand = [], sortBy = "price-lowtohigh", sizes = [], colors = [], subCategory = [] } = req.query;

    let filters = {};

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    if (subCategory.length) {
      filters.subCategory = { $in: subCategory.split(",") };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    if (colors.length) {
      filters.colors = { $in: colors.split(",") };
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
        break;
    }

    const products = await Product.find(filters).sort(sort);

    const productsWithStock = products.map(product => {
      const stock = {};
      if (product.category === "clothing") {
        product.sizes.clothing.forEach(size => {
          stock[size.size] = size.stock;
        });
      } else if (product.category === "footwear") {
        stock.sizes = product.sizes.footwear; // Array of sizes from 1 to 14
      } else if (product.category === "accessories") {
        stock.total = product.stock; // Total stock for accessories
      }
      return {
        ...product.toObject(),
        stock,
      };
    });

    res.status(200).json({
      success: true,
      data: productsWithStock,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });

    const stock = {};
    if (product.category === "clothing") {
      product.sizes.clothing.forEach(size => {
        stock[size.size] = size.stock;
      });
    } else if (product.category === "footwear") {
      stock.sizes = product.sizes.footwear; // Array of sizes from 1 to 14
    } else if (product.category === "accessories") {
      stock.total = product.stock; // Total stock for accessories
    }

    const productWithStock = {
      ...product.toObject(),
      stock,
    };

    res.status(200).json({
      success: true,
      data: productWithStock,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
