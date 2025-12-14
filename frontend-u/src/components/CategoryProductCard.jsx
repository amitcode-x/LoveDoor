import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Rating({ value }) {
  const num = Number(value || 0);

  if (!num) {
    return (
      <div className="text-[10px] text-gray-400">
        No rating yet
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-yellow-500 text-xs">
      ★ {num.toFixed(1)}
    </div>
  );
}

const getImage = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `http://127.0.0.1:8000${url}`;
};

export default function CategoryProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);

  const discount =
    product.discount_price && product.price
      ? Math.round(((product.price - product.effective_price) / product.price) * 100)
      : 0;

  const discountColor = discount >= 50 ? "bg-green-500" : "bg-red-500";

  return (
    <div className="group relative">
      <div className="relative bg-white/60 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-white/30 transition-all duration-500 hover:bg-white/80 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl">

        {/* Shine Effect */}
        <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none"></div>

        {/* NEW Badge */}
        {product.show_new_badge && (
          <span className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full shadow-lg z-20 animate-pulse">
            NEW
          </span>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <span className={`absolute ${product.show_new_badge ? "top-9" : "top-2"} 
            left-2 ${discountColor} text-white text-[9px] sm:text-[10px] font-bold 
            px-2 py-1 rounded-full shadow-lg z-20`}>
            {discount}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 z-20
            ${inWishlist 
              ? "bg-red-500 text-white border-red-400 scale-110" 
              : "bg-white/70 text-gray-700 border-white/50 hover:bg-red-50 hover:border-red-300"
            }`}
        >
          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill={inWishlist ? "currentColor" : "none"} />
        </button>

        {/* Product Image */}
        <Link to={`/product/${product.slug}`}>
          <div className="relative rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 mb-3">
            <img
              src={getImage(product.thumbnail)}
              alt={product.name}
              className="w-full h-32 sm:h-36 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Product Name */}
          <h3 className="text-xs sm:text-sm text-gray-800 line-clamp-2 group-hover:text-red-500 transition-colors duration-300 min-h-[32px]">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <p className="text-base sm:text-lg font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mt-2">
          ₹{product.effective_price}
        </p>

        {discount > 0 && (
          <p className="text-xs text-gray-500 line-through">
            ₹{product.price}
          </p>
        )}

        {/* Rating & Add to Cart Row */}
        <div className="mt-2 flex items-center justify-between gap-2">
          {/* Rating - Left Side */}
          <div className="flex-shrink-0">
            <Rating value={product.average_rating} />
          </div>

          {/* Add to Cart Button - Right Side (Compact on Mobile) */}
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="flex-shrink-0 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg sm:rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:from-pink-600 hover:to-red-600 active:scale-95
              /* Mobile: Icon only with small padding */
              p-1.5 sm:px-3 sm:py-2
              /* Desktop: Show full text */
              flex items-center justify-center gap-1.5"
            title="Add to Cart"
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline text-xs">Add</span>
          </button>
        </div>

        {/* Bottom Glow */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 bg-red-500/0 group-hover:bg-red-500/20 blur-xl rounded-full transition-all duration-500"></div>
      </div>
    </div>
  );
}