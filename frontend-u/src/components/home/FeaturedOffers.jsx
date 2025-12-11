import { Link } from "react-router-dom";

export default function FeaturedOffers({ offers }) {
  if (!offers || offers.length === 0) return null;

  return (
    <section className="w-full">

      {/* ⭐ SAME CATEGORY-STYLE GRADIENT WRAPPER */}
      <div className="relative rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 shadow-2xl 
      border border-white/30 overflow-hidden bg-white/30 backdrop-blur-xl">

        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br 
          from-white/60 via-pink-100/60 to-orange-100/60 
          rounded-xl md:rounded-2xl -z-10"></div>

        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br 
          from-pink-300/60 to-orange-300/70 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr 
          from-red-300/70 to-yellow-300/70 rounded-full blur-3xl -z-10"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-3 relative z-10">
          <h2 className="text-base sm:text-lg md:text-xl font-bold 
          bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Featured Offers
          </h2>

          <Link
            to="/all-products?show=offers"
            className="text-xs sm:text-sm font-semibold text-red-500 hover:text-red-600 
            transition-colors flex items-center gap-1"
          >
            See All
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* ⭐ Horizontal Scroll */}
        <div
          className="flex gap-3 sm:gap-4 overflow-x-auto py-3 scroll-smooth relative z-10"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>

          {offers.map((offer) => (
            <div
              key={offer.id}
              className="
                group flex-shrink-0 
                w-[48%] sm:w-[48%] 
                md:w-[24%] lg:w-[24%] xl:w-[24%]
              "
            >
              {/* ⭐ BIGGER IMAGE + 3D TILT */}
              <div className="relative w-[170px] h-[170px] sm:w-[190px] sm:h-[190px] mx-auto
                transition-transform duration-500 
                group-hover:[transform:perspective(600px)_rotateX(4deg)_rotateY(4deg)]">

                <div className="
                  relative w-full h-full rounded-full overflow-hidden 
                  bg-white/60 backdrop-blur-md shadow-xl border-4 border-white/40 
                  transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">

                  {/* IMAGE */}
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-110 
                    transition-transform duration-700"
                  />

                  {/* No Red color overlay */}
                  <div className="absolute inset-0 bg-transparent"></div>

                  {/* Shine */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                    transition-opacity duration-500 bg-gradient-to-tr 
                    from-transparent via-white/30 to-transparent"></div>
                </div>

                {/* Bottom Glow */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-5 
                bg-red-500/0 group-hover:bg-red-500/20 blur-2xl 
                rounded-full transition-all duration-500"></div>
              </div>

              {/* ⭐ TEXT SECTION (same, no card) */}
              <div className="mt-3 flex flex-col items-center">

                <h3 className="
                  text-gray-800 font-bold text-xs sm:text-sm leading-tight 
                  text-center line-clamp-2 mb-1
                  group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-pink-500 
                  group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300
                ">
                  {offer.title}
                </h3>

                <p className="text-gray-600 text-[9px] sm:text-[10px] text-center line-clamp-2 mb-2">
                  {offer.text}
                </p>

                <Link
                  to={offer.button_link}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white 
                  px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold 
                  shadow-lg hover:shadow-xl hover:scale-105 
                  transition-all duration-300 hover:from-red-600 hover:to-pink-600"
                >
                  {offer.button_text}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-1 text-[10px] text-gray-400">
          ← Scroll →
        </div>
      </div>
    </section>
  );
}
