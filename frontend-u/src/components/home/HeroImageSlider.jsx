import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MainHeroSlider() {
  const [heroIndex, setHeroIndex] = useState(0);

  // Images array
  const heroImages = [
    "https://images.pexels.com/photos/5632401/pexels-photo-5632401.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/5632388/pexels-photo-5632388.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/5632395/pexels-photo-5632395.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-xl  mx-auto px-4 md:px-10 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12">

        {/* LEFT TEXT CONTENT */}
        <div className="flex-1 text-center md:text-left px-2">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Discover Premium Products for Every Moment
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto md:mx-0 mb-6">
            Explore curated collections, exclusive offers, and handpicked favorites tailored just for you.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-white text-gray-900 px-8 py-3 rounded-full font-semibold shadow hover:bg-gray-100 transition"
          >
            Shop Now
          </Link>
        </div>

        {/* RIGHT SIDE IMAGE SLIDER */}
        <div className="flex-1 relative rounded-2xl overflow-hidden h-64 md:h-80 shadow-lg">

          {heroImages.map((img, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: heroIndex === index ? 1 : 0 }}
            >
              <img
                src={img}
                alt={`slide-${index}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
