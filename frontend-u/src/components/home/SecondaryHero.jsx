import { Link } from "react-router-dom";

export default function SecondaryHero({ data }) {
  if (!data) return null;

  return (
    <section className="w-full px-3 sm:px-4 md:px-6 py-4 md:py-6">
      <div className="max-w-7xl mx-auto">

        {/* ⭐ MAIN GRADIENT CARD (GiftOffer Style) */}
        <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl 
        border border-white/30 min-h-[220px] sm:min-h-[260px] md:min-h-[300px] 
        bg-white/40 backdrop-blur-xl">

          {/* ⭐ PASTEL BACKGROUND GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-br 
          from-white/60 via-pink-100/50 to-orange-100/50 -z-20"></div>

          {/* ⭐ BACKGROUND IMAGE */}
          {data.final_image && (
            <div className="absolute inset-0 overflow-hidden -z-10">
              <img
                src={data.final_image}
                alt={data.title || "Banner"}
                className="w-full h-full object-cover scale-100 hover:scale-105 transition-transform duration-700"
              />
            </div>
          )}

          {/* ⭐ TOP BEAUTY OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-br 
            from-white/40 via-white/20 to-transparent 
            pointer-events-none z-0"></div>

          {/* ⭐ CONTENT CENTERED */}
          <div className="relative z-20 h-full w-full flex flex-col items-center justify-center 
            text-center px-4 sm:px-6 py-8">

            {/* TITLE */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold 
              bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 bg-clip-text 
              text-transparent drop-shadow-xl mb-3 sm:mb-4">
              {data.title}
            </h2>

            {/* DESCRIPTION */}
            <p className="max-w-2xl text-sm sm:text-base md:text-lg font-medium 
              text-gray-700 leading-relaxed drop-shadow-md mb-4 sm:mb-6">
              {data.description}
            </p>

            {/* BUTTON */}
            <Link
              to={data.button_link}
              className="group relative inline-flex items-center gap-2 
              bg-gradient-to-r from-red-500 to-pink-500 text-white 
              px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 rounded-full font-semibold 
              text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all duration-300 
              hover:scale-105 hover:from-red-600 hover:to-pink-600 overflow-hidden"
            >
              {/* Shine */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                transition-opacity duration-500 bg-gradient-to-r 
                from-transparent via-white/30 to-transparent"></div>

              <span className="relative z-10">{data.button_text}</span>

              <svg className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 
                group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

          </div>

          {/* ⭐ CORNER GLOW EFFECTS */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br 
          from-pink-300/40 to-orange-300/40 rounded-full blur-3xl"></div>

          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr 
          from-red-300/40 to-yellow-300/40 rounded-full blur-3xl"></div>

        </div>

      </div>
    </section>
  );
}
