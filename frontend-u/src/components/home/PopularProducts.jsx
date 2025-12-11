import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { FiHeart } from "react-icons/fi";

// ⭐ Rating Component
function Rating({ value }) {
  const num = Number(value || 0);

  if (!num) {
    return <div className="text-[10px] text-gray-400">No rating yet</div>;
  }

  return (
    <div className="flex items-center gap-1 text-yellow-500 text-xs">
      ★ {num.toFixed(1)}
    </div>
  );
}

// ⭐ Fix image URL
const getImage = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `http://127.0.0.1:8000${url}`;
};

// ⭐ Product Card UI
function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const discount =
    product.discount_price > 0
      ? Math.round(((product.price - product.discount_price) / product.price) * 100)
      : 0;

  const discountColor = discount >= 50 ? "bg-green-500" : "bg-red-500";

  return (
    <div className="group relative flex-shrink-0 min-w-[160px] sm:min-w-[180px] max-w-[180px] sm:max-w-[200px]">

      {/* 3D Glass Card */}
      <div className="relative bg-white/60 backdrop-blur-md rounded-xl sm:rounded-2xl 
      p-3 sm:p-4 shadow-lg border border-white/30 transition-all duration-500 
      hover:bg-white/80 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl">

        {/* Shine Effect */}
        <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 
        group-hover:opacity-100 transition-opacity duration-500 
        bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none"></div>

        {/* NEW Badge */}
        {product.show_new_badge && (
          <span className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-blue-600 
          text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full 
          shadow-lg z-20 animate-pulse">
            NEW
          </span>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <span
            className={`absolute ${product.show_new_badge ? "top-9" : "top-2"} 
            left-2 ${discountColor} text-white text-[9px] sm:text-[10px] font-bold 
            px-2 py-1 rounded-full shadow-lg z-20`}
          >
            {discount}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-full backdrop-blur-md 
          border shadow-lg transition-all duration-300 z-20
            ${inWishlist
              ? "bg-red-500 text-white border-red-400 scale-110"
              : "bg-white/70 text-gray-700 border-white/50 hover:bg-red-50 hover:border-red-300"
            }`}
        >
          <FiHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <Link to={`/product/${product.slug}`}>
          {/* Image */}
          <div className="relative rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 mb-3">
            <img
              src={getImage(product.thumbnail)}
              alt={product.name}
              className="w-full h-32 sm:h-36 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent 
            opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Name */}
          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 
          group-hover:text-red-500 transition-colors duration-300 min-h-[32px]">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <p className="text-base sm:text-lg font-bold bg-gradient-to-r from-red-500 to-pink-500 
        bg-clip-text text-transparent mt-2">
          ₹{product.effective_price}
        </p>

        {discount > 0 && (
          <p className="text-xs text-gray-500 line-through">₹{product.price}</p>
        )}

        {/* Rating */}
        <div className="mt-1">
          <Rating value={product.average_rating} />
        </div>

        {/* Bottom Glow */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 
        bg-red-500/0 group-hover:bg-red-500/20 blur-xl rounded-full transition-all duration-500"></div>
      </div>
    </div>
  );
}

// ⭐ MAIN COMPONENT
export default function PopularProducts({ products }) {
  return (
    <section className="w-full">

      {/* ⭐ SAME CATEGORY-SECTION BACKGROUND */}
      <div className="relative rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl 
      border border-white/30 overflow-hidden bg-white/30 backdrop-blur-xl">

        {/* SAME Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br 
        from-white/60 via-pink-100/60 to-orange-100/60 rounded-2xl -z-10"></div>

        {/* SAME Glow Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br 
        from-pink-300/60 to-orange-300/70 rounded-full blur-3xl -z-10"></div>

        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr 
        from-red-300/70 to-yellow-300/70 rounded-full blur-3xl -z-10"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-4 relative z-10">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold 
          bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Popular Products
          </h2>

          <Link
            to="/all-products"
            className="text-xs sm:text-sm font-semibold text-red-500 hover:text-red-600 
            transition-colors flex items-center gap-1"
          >
            View All
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Product Scroll */}
        <div
          className="flex gap-3 sm:gap-4 overflow-x-auto py-4 scroll-smooth relative z-10"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>

          {products.length > 0 ? (
            products.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p className="text-gray-500 text-sm">No popular products available.</p>
          )}
        </div>

        {/* Scroll Hint */}
        <div className="text-center mt-2 text-xs text-gray-400 relative z-10">
          ← Scroll for more →
        </div>
      </div>
    </section>
  );
}
