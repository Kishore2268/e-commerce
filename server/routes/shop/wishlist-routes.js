const express = require("express");

const {
  addToWishlist,
  fetchWishlistItems,
  removeFromWishlist,
} = require("../../controllers/shop/wishlist-controller");

const router = express.Router();

router.post("/add", addToWishlist);
router.get("/get/:userId", fetchWishlistItems);
router.delete("/remove/:userId/:productId", removeFromWishlist);

module.exports = router; 