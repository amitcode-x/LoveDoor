import { Link } from "react-router-dom";

export default function GiftOffer({ data }) {
  if (!data) return null;

  return (
    <section className="w-full px-3 sm:px-4 md:px-6 py-4 md:py-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Container with Glassmorphism */}
        <div className="relative w-full h-[220px] sm:h-[260px] md:h-[300px] lg:h-[340px] flex items-center justify-center text-center overflow-hidden rounded-xl md:rounded-2xl shadow-2xl border border-white/30">

          {/* BACKGROUND IMAGE (🔥 OPTIMIZED, UI SAME) */}
          {data.final_image && (
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={data.final_image}
                alt={data.title || "Gift Offer"}
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                sizes="(max-width: 640px) 100vw, 1200px"
                className="w-full h-full object-cover scale-100 hover:scale-105 transition-transform duration-700"
              />
            </div>
          )}

          {/* LIGHT GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-pink-100/50 to-orange-100/50"></div>

          {/* MAIN CONTENT */}
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center gap-3 sm:gap-4">
            
            {/* TITLE */}
            <div className="bg-white/50 backdrop-blur-lg rounded-2xl px-6 sm:px-8 md:px-10 py-3 sm:py-4 border border-white/40 shadow-xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                {data.title}
              </h2>
            </div>

            {/* DESCRIPTION */}
            <p className="text-xs sm:text-sm md:text-base text-gray-700 font-medium max-w-xl px-4">
              {data.description}
            </p>

            {/* BUTTON */}
            <Link
              to={data.button_link}
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white border-2 border-red-400 px-6 sm:px-8 md:px-10 py-2 sm:py-2.5 md:py-3 rounded-xl font-semibold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-pink-600 overflow-hidden"
            >
              {/* Shine */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              
              <span className="relative z-10">{data.button_text}</span>
              
              {/* Gift Icon */}
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            </Link>

            {/* Decorative Sparkles */}
            <div className="absolute top-4 right-4 sm:top-8 sm:right-8 text-2xl sm:text-3xl animate-pulse">
              ✨
            </div>
            <div
              className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 text-2xl sm:text-3xl animate-pulse"
              style={{ animationDelay: "0.5s" }}
            >
              🎁
            </div>
          </div>

          {/* Corner Glows */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-300/40 to-orange-300/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-300/40 to-yellow-300/40 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  );
}
