import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import PropTypes from "prop-types";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  function handleRatingChange(newRating) {
    setRating(newRating);
  }

  // Helper function to get available sizes and their stock
  const getAvailableSizes = () => {
    if (!productDetails) return [];
    
    if (productDetails.category === "clothing") {
      return productDetails.sizes.clothing || [];
    } else if (productDetails.category === "footwear") {
      return productDetails.sizes.footwear || [];
    }
    return [];
  };

  // Get stock for selected size
  const getStockForSize = (size) => {
    const sizes = getAvailableSizes();
    const sizeInfo = sizes.find(s => s.size === size);
    return sizeInfo ? sizeInfo.stock : 0;
  };

  function handleAddToCart(getCurrentProductId) {
    if (!selectedSize && productDetails.category !== "accessories") {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }

    if (!selectedColor) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      });
      return;
    }

    const currentStock = productDetails.category === "accessories" 
      ? productDetails.stock 
      : getStockForSize(selectedSize);

    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId && 
                 item.size === selectedSize && 
                 item.color === selectedColor
      );
      
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > currentStock) {
          toast({
            title: `Only ${getQuantity} quantity available for this size and color`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product added to cart",
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview(e) {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please login to add a review",
        variant: "destructive",
      });
      return;
    }

    // Debug log to check user object
    console.log('Current user:', user);

    if (!rating) {
      toast({
        title: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    if (!reviewMsg.trim()) {
      toast({
        title: "Please write a review message",
        variant: "destructive",
      });
      return;
    }

    const reviewData = {
      productId: productDetails?._id,
      // Use the correct user ID field based on your auth state structure
      userId: user?.id || user?._id || user?.userId, // Try all possible ID fields
      rating: Number(rating),
      reviewMessage: reviewMsg.trim(),
      userName: user?.userName || user?.name,
    };

    // Ensure we have a valid userId
    if (!reviewData.userId) {
      toast({
        title: "Authentication error",
        description: "Please try logging in again",
        variant: "destructive",
      });
      return;
    }

    console.log('Submitting review:', reviewData);

    dispatch(addReview(reviewData))
      .unwrap()
      .then((response) => {
        console.log('Review response:', response);
        if (response.success) {
          toast({
            title: "Review added successfully",
          });
          setReviewMsg("");
          setRating(0);
          // Refresh reviews
          dispatch(getReviews(productDetails?._id));
        } else {
          throw new Error(response.message || 'Failed to add review');
        }
      })
      .catch((error) => {
        console.error('Review error:', error);
        
        // Check if it's an authentication error
        if (error.response?.status === 403) {
          toast({
            title: "Authentication error",
            description: "Please try logging in again",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Failed to add review",
          description: error.message || "Please try again later",
          variant: "destructive",
        });
      });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  console.log(reviews, "reviews");

  // Calculate average review
  const averageRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="flex flex-col min-h-screen overflow-y-scroll md:grid md:grid-cols-2 gap-8 sm:p-12 max-w-[90vw] lg:max-w-[70vw]">
        {/* Left Column - Image */}
        <div>
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* Right Column - Product Details */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">{productDetails?.title}</h2>
          <p className="text-muted-foreground mt-2">
            {productDetails?.description}
          </p>
          
          {/* Price and Rating Section */}
          <div className="mt-4">
            <div className="flex items-center gap-4">
              <p className="text-2xl font-bold">
                ${productDetails?.salePrice || productDetails?.price}
              </p>
              {productDetails?.salePrice ? (
                <p className="text-lg text-muted-foreground line-through">
                  ${productDetails?.price}
                </p>
              ) : null}
            </div>
            
            {/* Average Rating Display */}
            <div className="mt-2 flex items-center gap-2">
              <StarRatingComponent
                rating={Number(averageRating)}
                disabled={true}
              />
              <span className="text-sm text-muted-foreground">
                {averageRating > 0 
                  ? `${averageRating} out of 5 (${reviews.length} reviews)`
                  : 'No reviews yet'}
              </span>
            </div>
          </div>

          {/* Size Selection */}
          {productDetails?.category !== "accessories" && (
            <div className="mt-6">
              <Label className="text-base font-semibold">Select Size</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {getAvailableSizes().map((sizeInfo) => {
                  const isOutOfStock = sizeInfo.stock === 0;
                  const lowStock = sizeInfo.stock < 10;
                  
                  return (
                    <Button
                      key={sizeInfo.size}
                      variant={selectedSize === sizeInfo.size ? "default" : "outline"}
                      className="relative"
                      disabled={isOutOfStock}
                      onClick={() => setSelectedSize(sizeInfo.size)}
                    >
                      {sizeInfo.size.toUpperCase()}
                      {lowStock && !isOutOfStock && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                          {sizeInfo.stock}
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {productDetails?.colors && productDetails.colors.length > 0 && (
            <div className="mt-6">
              <Label className="text-base font-semibold">Select Color</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {productDetails.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={() => handleAddToCart(productDetails?._id)}
            className="w-full mt-6"
            disabled={
              (!selectedSize && productDetails?.category !== "accessories") ||
              !selectedColor
            }
          >
            Add to Cart
          </Button>

          {/* Reviews Section */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Reviews</h3>
            <div className="space-y-4">
              {reviews && reviews.length ? (
                reviews.map((review) => (
                  <div key={review._id} className="border-b pb-4">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback>
                          {review.userName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{review.userName}</p>
                        <StarRatingComponent
                          rating={review.rating}
                          disabled={true}
                        />
                      </div>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      {review.reviewMessage}
                    </p>
                  </div>
                ))
              ) : (
                <p>No reviews yet</p>
              )}
            </div>

            {user ? (
              <form onSubmit={handleAddReview} className="mt-6 flex-col flex gap-2">
                <Label>Write a review</Label>
                <div className="flex gap-1">
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                  />
                </div>
                <Input
                  name="reviewMsg"
                  value={reviewMsg}
                  onChange={(event) => setReviewMsg(event.target.value)}
                  placeholder="Write a review..."
                  required
                  minLength={3}
                />
                <Button
                  type="submit"
                  disabled={!rating || !reviewMsg.trim()}
                >
                  Submit Review
                </Button>
              </form>
            ) : (
              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  Please login to write a review
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

ProductDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  productDetails: PropTypes.shape({
    _id: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    salePrice: PropTypes.number,
    totalStock: PropTypes.number,
    category: PropTypes.string,
    sizes: PropTypes.shape({
      clothing: PropTypes.arrayOf(
        PropTypes.shape({
          size: PropTypes.string,
          stock: PropTypes.number,
        })
      ),
      footwear: PropTypes.arrayOf(
        PropTypes.shape({
          size: PropTypes.string,
          stock: PropTypes.number,
        })
      ),
    }),
    colors: PropTypes.arrayOf(PropTypes.string),
    stock: PropTypes.number,
  }),
};

export default ProductDetailsDialog;
