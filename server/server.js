const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

// Import the wishlist routes
const shopWishlistRouter = require("./routes/shop/wishlist-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

mongoose
  .connect("mongodb+srv://kishore:KishSabi%402268@anivarti.cp7lj.mongodb.net/clothing-store")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const path = require("path");

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["https://clothing-ecommerc-store.onrender.com", "http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

// Add the wishlist routes
app.use("/api/shop/wishlist", shopWishlistRouter);

app.use("/api/common/feature", commonFeatureRouter);

// Serve static files from Vite build
app.use(express.static(path.join(__dirname, "dist")));

// Handle client-side routing properly
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
