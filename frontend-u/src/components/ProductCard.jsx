import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { FiHeart } from "react-icons/fi";


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

  const badgeColor = discount >= 50 ? "bg-green-600" : "bg-red-500";

  return (
    <div className="border rounded-lg p-4 shadow-sm relative bg-white 
      hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">

      {/* ❤️ Wishlist */}
      <button
        onClick={() => toggleWishlist(product)}
        className={`absolute top-3 right-3 p-2 rounded-full shadow 
          ${
            inWishlist
              ? "bg-red-500 text-white"
              : "bg-white text-gray-700"
          } z-20`}
      >
        <FiHeart className="w-4 h-4" />
      </button>

      {/* ⭐ NEW Badge */}
      {product.show_new_badge && (
        <span
          className="absolute top-3 left-3 bg-blue-600 text-white 
          text-xs font-bold px-2 py-1 rounded z-20"
        >
          NEW
        </span>
      )}

      {/* ⭐ Discount Badge */}
      {discount > 0 && (
        <span
          className={`${badgeColor} text-white text-xs font-bold px-2 py-1 rounded 
          absolute top-10 left-3 z-20`}
        >
          {discount}% OFF
        </span>
      )}

      {/* Image */}
      <Link to={`/product/${product.slug}`}>
        <div className="overflow-hidden rounded-md relative">
          <img
            src={product.thumbnail}
            className="w-full h-44 object-cover rounded-md 
              transform transition-transform duration-500 hover:scale-110"
            alt={product.name}
          />
        </div>
      </Link>

      {/* Title */}
      <h2 className="font-semibold mt-3 line-clamp-1">{product.name}</h2>

      {/* Short description */}
      <p className="text-sm text-gray-500 line-clamp-2">
        {product.short_description}
      </p>

      {/* Price */}
      <div className="mt-3">
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-black">
            ₹{product.effective_price}
          </p>

          {discount > 0 && (
            <p className="text-sm text-gray-400 line-through">
              ₹{product.price}
            </p>
          )}
        </div>

        {discount > 0 && (
          <p className="text-xs text-green-600 font-semibold">
            You save ₹{product.price - product.discount_price}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-3">
        <Link
          to={`/product/${product.slug}`}
          className="text-sm px-4 py-1.5 rounded border border-gray-400 
          hover:bg-gray-200 transition font-medium"
        >
          View
        </Link>

        <button
          className="bg-black text-white px-4 py-1.5 rounded text-sm 
          hover:bg-gray-900 transition"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
