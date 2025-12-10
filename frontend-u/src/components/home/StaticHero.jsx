export default function StaticHero({ data }) {
  if (!data) return null;

  return (
    <section className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-xl md:rounded-2xl 
        h-40 sm:h-40 md:h-50 lg:h-60 
        shadow-xl hover:shadow-2xl transition-shadow duration-300">

          {/* BACKGROUND IMAGE with Gradient Overlay */}
          <img
            src={data.image}
            alt={data.title || "Hero Banner"}
            className="w-full h-full object-cover scale-100 hover:scale-105 transition-transform duration-700"
          />

          {/* GRADIENT OVERLAY for Better Text Visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>

          {/* CONTENT OVERLAY */}
          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-10 lg:px-12">
            
            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-white font-medium mb-1 md:mb-2 tracking-wide animate-fade-in">
              {data.subtitle}
            </p>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 leading-tight drop-shadow-lg">
              {data.title}
            </h3>

            {/* CTA Button */}
            <a
              href={data.button_link}
              className="inline-flex items-center justify-center gap-2 bg-white text-red-500 text-sm sm:text-base md:text-lg font-semibold px-6 sm:px-8 md:px-10 py-2.5 md:py-3 rounded-lg md:rounded-xl hover:bg-red-500 hover:text-white transform hover:scale-105 transition-all duration-300 w-max shadow-lg hover:shadow-xl"
            >
              {data.button_text}
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

          </div>
        </div>
      </div>
    </section>
  );
}
