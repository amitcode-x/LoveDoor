import { Link } from "react-router-dom";

export default function SecondaryHero({ data }) {
  if (!data) return null;

  return (
    <section className="w-full px-3 sm:px-4 md:px-6 py-4 md:py-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Container with Glassmorphism */}
        <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-white/30 min-h-[200px] sm:min-h-[250px] md:min-h-[300px]">

          {/* ⭐ BACKGROUND IMAGE with Light Overlay */}
          {data.final_image && (
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={data.final_image}
                alt={data.title || "Banner"}
                className="w-full h-full object-cover scale-100 hover:scale-105 transition-transform duration-700"
              />
              {/* Light Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/50 to-white/30"></div>
            </div>
          )}

          {/* ⭐ Content Container */}
          <div className="relative z-10 h-full px-4 sm:px-6 md:px-10 lg:px-12 py-6 sm:py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left">
              {/* Title with Glass Effect */}
              <div className="inline-block  rounded-xl px-4 sm:px-6 py-2 sm:py-3 mb-3 border border-white/50 shadow-lg">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  {data.title}
                </h2>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-gray-700 font-medium leading-relaxed max-w-xl mx-auto md:mx-0 drop-shadow-sm">
                {data.description}
              </p>
            </div>

            {/* Right Button with 3D Effect */}
            <div className="flex-shrink-0">
              <Link
                to={data.button_link}
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-pink-600 overflow-hidden"
              >
                {/* Shine Effect on Button */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                
                <span className="relative z-10">{data.button_text}</span>
                
                {/* Arrow Icon */}
                <svg className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Decorative Light Blurs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-pink-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  );
}