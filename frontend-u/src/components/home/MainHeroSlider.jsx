import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MainHeroSlider({ slides }) {
  // Always define hooks at top
  const [index, setIndex] = useState(0);

  // Auto slide interval
  useEffect(() => {
    if (!slides || slides.length === 0) return;

    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  return (
    <section className="w-full px-4.5 pb-3 text-gray-800">
      <div className="max-w-8xl rounded-2xl bg-gradient-to-r from-red-100/90 via-red-100/60 to-pink-100/60   mx-auto px-4 md:px-10 py-14 flex flex-col md:flex-row items-center gap-12">
        {/* LEFT TEXT */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-5xl text-red-400 font-bold mb-4">
            {slides[index]?.title}
          </h1>

          <p className="text-red-400 mb-6">{slides[index]?.text}</p>

          <Link
            to={slides[index]?.cta_link}
            className="bg-white text-red-500 px-8 py-3 rounded-xl border-2 border-red-400 font-semibold"
          >
            {slides[index]?.cta_text}
          </Link>
        </div>

        {/* RIGHT SLIDER */}
        <div className="flex-1 relative rounded-2xl overflow-hidden h-64 md:h-80 shadow-lg">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: index === i ? 1 : 0 }}
            >
              {/* Image */}
              <img
                src={slide.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
