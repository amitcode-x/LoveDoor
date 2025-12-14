import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";

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

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);

  // Discount %
  const discount =
    product.discount_price > 0
      ? Math.round(
          ((product.price - product.discount_price) / product.price) * 100
        )
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
              className="w-full h-32 sm:h-40 md:h-44 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Product Name */}
          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-red-500 transition-colors duration-300 min-h-[32px]">
            {product.name}
          </h3>
        </Link>

        {/* Short Description (Hidden on mobile, visible on larger screens) */}
        {product.short_description && (
          <p className="hidden sm:block text-xs text-gray-500 line-clamp-2 mt-1 min-h-[32px]">
            {product.short_description}
          </p>
        )}

        {/* Price */}
        <div className="mt-2">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-base sm:text-lg font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              ₹{product.effective_price}
            </p>

            {discount > 0 && (
              <p className="text-xs text-gray-500 line-through">
                ₹{product.price}
              </p>
            )}
          </div>

          {/* You Save (Only on larger screens) */}
          {discount > 0 && (
            <p className="hidden sm:block text-xs text-green-600 font-semibold mt-0.5">
              You save ₹{product.price - product.discount_price}
            </p>
          )}
        </div>

        {/* Rating */}
        <div className="mt-2">
          <Rating value={product.average_rating} />
        </div>

        {/* Action Buttons */}
        <div className="mt-3 flex gap-2">
          {/* View Button */}
          <Link
            to={`/product/${product.slug}`}
            className="flex-1 bg-white/70 backdrop-blur-sm border border-white/50 text-gray-800 rounded-lg sm:rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:bg-white active:scale-95
              px-2 sm:px-3 py-1.5 sm:py-2
              flex items-center justify-center gap-1.5 text-xs sm:text-sm"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">View</span>
          </Link>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg sm:rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:from-pink-600 hover:to-red-600 active:scale-95
              px-2 sm:px-3 py-1.5 sm:py-2
              flex items-center justify-center gap-1.5 text-xs sm:text-sm"
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {/* Bottom Glow */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 bg-red-500/0 group-hover:bg-red-500/20 blur-xl rounded-full transition-all duration-500"></div>
      </div>
    </div>
  );
}