import { Link } from "react-router-dom";
import { useState } from "react";

function Rating({ value }) {
  const num = Number(value || 0);

  if (!num) {
    return <div className="flex items-center gap-1 text-gray-400 text-xs">★ No rating</div>;
  }

  return (
    <div className="flex items-center gap-1 text-yellow-500 text-xs font-semibold">
      ★ {num.toFixed(1)}
    </div>
  );
}

function VerticalCard({ product }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex gap-3 border-b border-white/30 pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0 hover:bg-gradient-to-r hover:from-red-50/50 hover:to-pink-50/50 rounded-lg p-2 transition-all duration-300 cursor-pointer"
    >
      <div className="flex-shrink-0">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300">
          <img
            src={product.thumbnail}
            alt={product.name}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            sizes="(max-width: 640px) 80px, 120px"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-xs sm:text-sm text-gray-800 line-clamp-2 group-hover:text-red-500 transition-colors duration-300">
          {product.name}
        </h3>

        <p className="text-sm sm:text-base font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mt-1">
          ₹{product.effective_price}
        </p>

        <Rating value={product.average_rating} />
      </div>
    </Link>
  );
}

export default function RecentAndTopProducts({ recent, top }) {
  const [activeTab, setActiveTab] = useState("recent");

  return (
    <section className="w-full">
      <div className="relative bg-white/40 backdrop-blur-xl rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-red-100/20 to-pink-100/30 rounded-2xl -z-10"></div>

        {/* Mobile Tabs */}
        <div className="md:hidden mb-4 flex gap-2">
          <button
            onClick={() => setActiveTab("recent")}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              activeTab === "recent"
                ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg"
                : "bg-white/50 text-gray-600 hover:bg-white/70"
            }`}
          >
            Recent Products
          </button>
          <button
            onClick={() => setActiveTab("top")}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              activeTab === "top"
                ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg"
                : "bg-white/50 text-gray-600 hover:bg-white/70"
            }`}
          >
            Top Products
          </button>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white/50 backdrop-blur-md rounded-xl shadow-lg border border-white/40 p-4 sm:p-5">
            <h3 className="text-lg font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4">
              Recent Products
            </h3>
            {recent.length > 0
              ? recent.map((p) => <VerticalCard key={p.id} product={p} />)
              : <p className="text-gray-500 text-sm text-center py-4">No recent products.</p>}
          </div>

          <div className="bg-white/50 backdrop-blur-md rounded-xl shadow-lg border border-white/40 p-4 sm:p-5">
            <h3 className="text-lg font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent mb-4">
              Top Products
            </h3>
            {top.length > 0
              ? top.map((p) => <VerticalCard key={p.id} product={p} />)
              : <p className="text-gray-500 text-sm text-center py-4">No top products.</p>}
          </div>
        </div>

        {/* Mobile Content */}
        <div className="md:hidden">
          {(activeTab === "recent" ? recent : top).map((p) => (
            <VerticalCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
