import { Link } from "react-router-dom";

function Rating({ value }) {
  const num = Number(value || 0);

  if (!num) {
    return (
      <div className="flex items-center gap-1 text-gray-400 text-xs">
        ★ No rating
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-yellow-500 text-xs font-semibold">
      ★ {num.toFixed(1)}
    </div>
  );
}

function VerticalCard({ product }) {
  return (
    <div className="group flex gap-3 border-b border-white/30 pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0 hover:bg-white/20 rounded-lg p-2 transition-all duration-300">
      <Link to={`/product/${product.slug}`} className="flex-shrink-0">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300">
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-xs sm:text-sm text-gray-800 line-clamp-2 group-hover:text-red-500 transition-colors duration-300">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm sm:text-base font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mt-1">
          ₹{product.effective_price}
        </p>

        {/* ⭐ Backend Rating */}
        <Rating value={product.average_rating} />
      </div>
    </div>
  );
}

export default function RecentAndTopProducts({ recent, top }) {
  return (
    <section className="w-full">
      {/* Main Glassmorphism Container */}
      <div className="relative bg-white/40 backdrop-blur-xl rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl border border-white/20">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-red-100/20 to-pink-100/30 rounded-2xl -z-10"></div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

          {/* Recent Products Card */}
          <div className="relative bg-white/50 backdrop-blur-md rounded-xl shadow-lg border border-white/40 p-4 sm:p-5 transition-all duration-500 hover:bg-white/60 hover:shadow-xl">
            
            {/* Shine Effect */}
            <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"></div>

            {/* Header */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Recent Products
              </h3>
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            {/* Products List */}
            <div className="relative z-10">
              {recent.length > 0 ? (
                recent.map((p) => <VerticalCard key={p.id} product={p} />)
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No recent products.</p>
              )}
            </div>

            {/* Bottom Glow */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 bg-red-500/0 hover:bg-red-500/20 blur-xl rounded-full transition-all duration-500"></div>
          </div>

          {/* Top Products Card */}
          <div className="relative bg-white/50 backdrop-blur-md rounded-xl shadow-lg border border-white/40 p-4 sm:p-5 transition-all duration-500 hover:bg-white/60 hover:shadow-xl">
            
            {/* Shine Effect */}
            <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"></div>

            {/* Header */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                Top Products
              </h3>
              <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>

            {/* Products List */}
            <div className="relative z-10">
              {top.length > 0 ? (
                top.map((p) => <VerticalCard key={p.id} product={p} />)
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No top products.</p>
              )}
            </div>

            {/* Bottom Glow */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 bg-pink-500/0 hover:bg-pink-500/20 blur-xl rounded-full transition-all duration-500"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
