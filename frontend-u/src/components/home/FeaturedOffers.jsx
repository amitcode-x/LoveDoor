import { Link } from "react-router-dom";

export default function FeaturedOffers({ offers }) {
  if (!offers || offers.length === 0) return null;

  return (
    <section className="w-full">
      {/* Glassmorphism Container - COMPACT */}
      <div className="relative bg-white/40 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 shadow-2xl border border-white/20">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-pink-100/20 to-red-100/30 rounded-xl md:rounded-2xl -z-10"></div>

        {/* Heading + See All - COMPACT */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Featured Offers
          </h2>

          <Link
            to="/all-products?show=offers"
            className="text-xs sm:text-sm font-semibold text-purple-500 hover:text-purple-600 transition-colors flex items-center gap-1"
          >
            See All
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* ⭐ Cards Scroll - SAME SIZE */}
        <div 
          className="flex gap-3 sm:gap-4 overflow-x-auto py-3 scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {offers.map((offer) => (
            <div
              key={offer.id}
              className="group flex-shrink-0 w-[130px] sm:w-[150px]"
            >
              {/* ⭐ CIRCLE IMAGE - FIXED SIZE */}
              <div className="relative w-[130px] h-[130px] sm:w-[150px] sm:h-[150px] mx-auto">
                
                {/* Circle Container with Glassmorphism */}
                <div className="relative w-full h-full rounded-full overflow-hidden bg-white/60 backdrop-blur-md shadow-xl border-4 border-white/40 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-purple-300/50">
                  
                  {/* Image */}
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-500"></div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/30 to-transparent"></div>
                </div>

                {/* Bottom Glow */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-purple-500/0 group-hover:bg-purple-500/30 blur-2xl rounded-full transition-all duration-500"></div>
              </div>

              {/* ⭐ TEXT SECTION - COMPACT with Glass Card */}
              <div className="mt-3 bg-white/50 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-lg border border-white/30 transition-all duration-500 group-hover:bg-white/70 group-hover:shadow-xl h-[110px] sm:h-[120px] flex flex-col">
                
                {/* Title - FIXED HEIGHT */}
                <h3 className="text-gray-800 font-bold text-xs sm:text-sm leading-tight break-words text-center group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2 mb-1">
                  {offer.title}
                </h3>

                {/* Description - FIXED HEIGHT */}
                <p className="text-gray-600 text-[9px] sm:text-[10px] text-center line-clamp-2 mb-2 flex-grow">
                  {offer.text}
                </p>

                {/* CTA Button - COMPACT */}
                <Link
                  to={offer.button_link}
                  className="block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold text-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 hover:from-purple-600 hover:to-pink-600"
                >
                  {offer.button_text}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Hint */}
        <div className="text-center mt-1 text-[10px] text-gray-400">
          ← Scroll →
        </div>
      </div>
    </section>
  );
}