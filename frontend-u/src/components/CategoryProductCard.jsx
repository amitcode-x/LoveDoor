import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function CategoryProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);

  // ⭐ Discount Percent
  const discount =
    product.discount_price && product.price
      ? Math.round(((product.price - product.effective_price) / product.price) * 100)
      : 0;

  const discountColor = discount >= 50 ? "bg-green-600" : "bg-red-500";

  return (
    <div className="border rounded-xl bg-white shadow-sm p-3 hover:shadow-md transition relative overflow-hidden">

      {/* ❤️ Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product);
        }}
        className={`absolute top-3 right-3 p-1 rounded-full shadow 
          ${inWishlist ? "bg-red-500 text-white" : "bg-white text-gray-700"} z-20`}
      >
        <FiHeart className="w-4 h-4" />
      </button>

      {/* ⭐ NEW Badge */}
      {product.show_new_badge && (
        <span
          className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded z-20"
        >
          NEW
        </span>
      )}

      {/* ⭐ Discount Badge */}
      {discount > 0 && (
        <span
          className={`${discountColor} absolute top-10 left-3 text-white 
          text-xs font-bold px-2 py-1 rounded z-20`}
        >
          {discount}% OFF
        </span>
      )}

      {/* Product Image */}
      <Link to={`/product/${product.slug}`}>
        <div className="overflow-hidden rounded-lg">
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-40 object-cover rounded-md transition-transform duration-500 hover:scale-105"
          />
        </div>
      </Link>

      {/* Product Name */}
      <Link to={`/product/${product.slug}`}>
        <h3 className="mt-2 text-sm font-semibold line-clamp-2">
          {product.name}
        </h3>
      </Link>

      {/* ⭐ Rating Display */}
      <div className="flex items-center gap-1 text-yellow-500 text-xs mt-1">
        <span>★</span>
        <span className="text-gray-800 font-medium">
          {(product.average_rating || 0).toFixed(1)}
        </span>
      </div>

      {/* Pricing */}
      <div className="mt-2">
        <p className="text-lg font-bold text-black">
          ₹{product.effective_price}
        </p>

        {discount > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="line-through text-gray-400">₹{product.price}</span>
            <span className="text-green-600 font-semibold">{discount}% OFF</span>
          </div>
        )}
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={() => addToCart(product)}
        className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
