import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

function StarRatingComponent({ rating, handleRatingChange }) {
  return [1, 2, 3, 4, 5].map((star) => (
    <Button
      key={star} // ✅ Added key prop
      className={`p-2 rounded-full transition-colors ${
        star <= rating
          ? "text-yellow-500 hover:bg-black"
          : "text-black hover:bg-primary hover:text-primary-foreground"
      }`}
      variant="outline"
      size="icon"
      onClick={() => handleRatingChange?.(star)} // ✅ Prevents null function issue
    >
      <StarIcon
        className="w-6 h-6"
        fill="currentColor" // ✅ Ensures proper color filling
      />
    </Button>
  ));
}

export default StarRatingComponent;

