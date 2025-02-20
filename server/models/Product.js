const mongoose = require("mongoose");

const SizeSchema = new mongoose.Schema({
  size: { type: String, required: true }, // Define size as a string
  stock: { type: Number, default: 0 }, // Stock for each size
});

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    category: {
      type: String,
      enum: ["clothing", "footwear", "accessories"],
      required: true,
    },
    subCategory: {
      type: String,
      enum: [
        "men's clothing", "women's clothing", "kids' clothing",
        "men's footwear", "women's footwear", "kids' footwear",
        "men's accessories", "women's accessories", "kids' accessories"
      ],
      required: function() {
        return this.category !== "accessories"; // Only required if category is not accessories
      },
    },
    brand: String,
    price: Number,
    salePrice: Number,
    sizes: {
      clothing: [SizeSchema], // Use the SizeSchema for clothing sizes
      footwear: [SizeSchema], // Use the SizeSchema for footwear sizes
    },
    // Stock for accessories
    stock: {
      type: Number,
      default: 0, // Default stock for accessories
    },
    colors: [String],
    totalStock: {
      type: Number,
      default: function() {
        if (this.category === "clothing") {
          return this.sizes.clothing.reduce((sum, size) => sum + size.stock, 0);
        } else if (this.category === "footwear") {
          return this.sizes.footwear.reduce((sum, size) => sum + size.stock, 0);
        } else if (this.category === "accessories") {
          return this.stock; // Total stock for accessories
        }
        return 0; // For any other category
      },
    },
    averageReview: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
