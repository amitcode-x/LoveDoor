import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext"; 
import { FiHeart } from "react-icons/fi";

// ⭐ Rating component — backend se aaya rating dikhाएगा
function Rating({ value }) {
  const num = Number(value || 0);

  if (!num) {
    return (
      <div className="text-[11px] text-gray-400">
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

// Universal URL fixer
const getImage = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `http://127.0.0.1:8000${url}`;
};

function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);

  // ⭐ Calculate Discount
  const discount =
    product.discount_price > 0
      ? Math.round(
          ((product.price - product.discount_price) / product.price) * 100
        )
      : 0;

  const discountColor = discount >= 50 ? "bg-green-500" : "bg-red-500";

  return (
    <div className="relative min-w-[180px] max-w-[200px] bg-white shadow-sm border rounded-lg p-3">

      {/* ⭐ NEW Badge */}
      {product.show_new_badge && (
        <span
          className="absolute top-2 left-2 bg-blue-600 text-white 
          text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm z-20"
        >
          NEW
        </span>
      )}

      {/* ⭐ Discount Badge */}
      {discount > 0 && (
        <span
          className={`absolute ${product.show_new_badge ? "top-8" : "top-2"} 
            left-2 ${discountColor} text-white text-[10px] font-semibold 
            px-2 py-0.5 rounded-full shadow-sm z-20`}
        >
          {discount}% OFF
        </span>
      )}

      {/* ❤️ Wishlist Button */}
      <button
        onClick={() => toggleWishlist(product)}
        className={`absolute top-2 right-2 p-1 rounded-full border shadow-sm 
          ${
            inWishlist ? "bg-red-500 text-white" : "bg-white text-gray-700"
          } z-20`}
      >
        <FiHeart className="w-4 h-4" />
      </button>

      <Link to={`/product/${product.slug}`}>
        <img
          src={getImage(product.thumbnail)}
          alt={product.name}
          className="w-full h-32 object-cover rounded-md"
        />

        <h3 className="mt-2 text-sm font-semibold line-clamp-2">
          {product.name}
        </h3>
      </Link>

      {/* ⭐ Price */}
      <p className="text-base font-bold mt-1">₹{product.effective_price}</p>

      {/* ⭐ Rating */}
      <Rating value={product.average_rating} />
    </div>
  );
}

export default function PopularProducts({ products }) {
  return (
    <section className="w-full  px-4.5 pb-6">
      <div  className="max-w-8xl bg-gradient-to-r from-red-100/90 via-red-100/60 to-pink-100/60  rounded-2xl   mx-auto px-4 md:px-6 py-10">

        {/* Header + View All */}
        <div className="flex justify-between items-center mb-4 w-full">
          <h2 className="text-2xl font-bold">Popular Products</h2>

          <Link
            to="/all-products"
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            View All →
          </Link>
        </div>

        {/* ⭐ Scrollbar hidden but scroll enabled */}
        <div className="flex gap-4 overflow-x-auto pb-2 scroll-smooth no-scrollbar">
          {products.length > 0 ? (
            products.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p className="text-gray-500">No popular products available.</p>
          )}
        </div>

      </div>
    </section>
  );
}
