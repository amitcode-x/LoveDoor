import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { FiHeart } from "react-icons/fi";

// ⭐ Rating Component
function Rating({ value }) {
  if (!value || value === 0) {
    return <p className="text-gray-400 text-xs">No rating</p>;
  }

  return (
    <div className="flex items-center gap-1 text-yellow-500 text-xs font-semibold">
      ★ <span>{value.toFixed(1)}</span>
    </div>
  );
}

// ⭐ Fix image URL
const getImage = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `http://127.0.0.1:8000${url}`;
};

// ⭐ CARD UI
function Card({ product }) {
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

  const avgRating = product.average_rating || product.initial_rating || 0;

  return (
    <div className="min-w-[180px] max-w-[200px] bg-white border rounded-lg p-3 shadow-sm relative
      hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

      {/* ❤️ Wishlist */}
      <button
        onClick={() => toggleWishlist(product)}
        className={`absolute top-3 right-3 p-1.5 rounded-full shadow-md border 
          ${inWishlist ? "bg-red-500 text-white" : "bg-white text-gray-600"} z-20`}
      >
        <FiHeart className="w-4 h-4" />
      </button>

      {/* 🔵 NEW Badge */}
      {product.show_new_badge && (
        <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] 
          font-bold px-2 py-1 rounded z-20">
          NEW
        </span>
      )}

      {/* 🔥 Discount Badge */}
      {discount > 0 && (
        <span
          className={`${badgeColor} text-white text-[10px] font-bold px-2 py-1 rounded 
            absolute ${product.show_new_badge ? "top-10" : "top-3"} left-3 z-20`}
        >
          {discount}% OFF
        </span>
      )}

      {/* Product Image */}
      <Link to={`/product/${product.slug}`}>
        <div className="overflow-hidden rounded-md">
          <img
            src={getImage(product.thumbnail)}
            alt={product.name}
            className="w-full h-32 object-cover rounded-md transform 
              transition-transform duration-500 hover:scale-110"
          />
        </div>

        {/* Title */}
        <h3 className="mt-2 text-sm font-bold line-clamp-2">
          {product.name}
        </h3>
      </Link>

      {/* Price */}
      <p className="font-bold mt-1 text-black text-sm">
        ₹{product.effective_price}
      </p>

      {/* Old price + Discount */}
      {discount > 0 && (
        <p className="text-xs text-gray-500 line-through">
          ₹{product.price}
        </p>
      )}

      {/* ⭐ Rating */}
      <Rating value={product.average_rating} />
    </div>
  );
}

export default function NewArrivals({ products }) {
  return (
    <section className="w-full px-4.5 pb-6">
      <div  className="max-w-8xl bg-gradient-to-r from-red-100/90 via-red-100/60 to-pink-100/60 rounded-2xl mx-auto px-4 md:px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">New Arrivals</h2>

          <Link
            to="/all-products?show=new"
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            View All →
          </Link>
        </div>

        {/* Horizontal Scroll */}
        <div className="flex gap-4 overflow-x-auto pb-2 scroll-smooth no-scrollbar">
          {products.length > 0 ? (
            products.map((p) => <Card key={p.id} product={p} />)
          ) : (
            <p className="text-gray-500">No new arrivals available.</p>
          )}
        </div>

      </div>
    </section>
  );
}
