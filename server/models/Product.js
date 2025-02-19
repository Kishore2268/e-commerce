const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: {
      type: Number,
      validate: {
        validator: function(value) {
          // Ensure totalStock is greater than or equal to the sum of all sizes' stock
          const totalSizeStock = this.sizes.reduce((sum, sizeObj) => sum + sizeObj.stock, 0);
          return value >= totalSizeStock;
        },
        message: "Total stock must be greater than or equal to the sum of all sizes' stock."
      }
    },
    averageReview: Number,
    colors: [String],
    sizes: [{ size: String, stock: Number }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
