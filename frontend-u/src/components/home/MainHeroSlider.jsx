import { useEffect, useState } from "react";

export default function MainHeroSlider({ slides }) {
  const [index, setIndex] = useState(0);

  // Auto slide interval
  useEffect(() => {
    if (!slides || slides.length === 0) return;

    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  return (
    <section className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-xl md:rounded-2xl bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 overflow-hidden shadow-xl">
          <div className="px-4 sm:px-6 md:px-10 lg:px-12 py-8 sm:py-10 md:py-14 lg:py-16 flex flex-col md:flex-row items-center gap-6 md:gap-8 lg:gap-12">
            
            {/* LEFT TEXT CONTENT */}
            <div className="flex-1 text-center md:text-left z-10">
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-red-500 mb-3 md:mb-4 leading-tight animate-fade-in">
                {slides[index]?.title}
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-red-400 mb-4 md:mb-6 leading-relaxed max-w-xl mx-auto md:mx-0">
                {slides[index]?.text}
              </p>

              {/* CTA Button */}
              <a
                href={slides[index]?.cta_link}
                className="inline-flex items-center justify-center gap-2 bg-white text-red-500 px-6 sm:px-8 md:px-10 py-2.5 md:py-3 rounded-lg md:rounded-xl border-2 border-red-400 font-semibold text-sm sm:text-base hover:bg-red-500 hover:text-white hover:border-red-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {slides[index]?.cta_text}
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>

            {/* RIGHT IMAGE SLIDER */}
            <div className="flex-1 w-full md:w-auto">
              <div className="relative rounded-xl md:rounded-2xl overflow-hidden h-48 sm:h-56 md:h-72 lg:h-80 shadow-2xl">
                {/* Slider Images */}
                {slides.map((slide, i) => (
                  <div
                    key={slide.id}
                    className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                    style={{ opacity: index === i ? 1 : 0 }}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title || `Slide ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}

                {/* Navigation Dots */}
                <div className="absolute bottom-3 md:bottom-4 left-0 right-0 flex justify-center gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
                        index === i 
                          ? 'bg-white w-6 md:w-8' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Manual Navigation Arrows */}
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
                  className="bg-white text-red-500 p-2 md:p-2.5 rounded-lg shadow-md hover:shadow-lg hover:bg-red-500 hover:text-white transform hover:scale-110 transition-all duration-300"
                  aria-label="Previous slide"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setIndex((i) => (i + 1) % slides.length)}
                  className="bg-white text-red-500 p-2 md:p-2.5 rounded-lg shadow-md hover:shadow-lg hover:bg-red-500 hover:text-white transform hover:scale-110 transition-all duration-300"
                  aria-label="Next slide"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}