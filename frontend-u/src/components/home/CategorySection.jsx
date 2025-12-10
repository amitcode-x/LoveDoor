import { Link } from "react-router-dom";
import {
  Laptop,
  Shirt,
  Home,
  Sparkles,
  Gift,
  BookOpen,
  Coffee,
  ShoppingBag,
  Watch,
  HeartHandshake,
} from "lucide-react";

// ⭐ Backend se agar relative URL aaye to full URL banao
const fixURL = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `http://127.0.0.1:8000${url}`;
};

// ⭐ Auto Icon logic
const getAutoIcon = (cat) => {
  const key = (cat.slug || cat.name || "").toLowerCase();
  if (key.includes("electronic") || key.includes("mobile") || key.includes("laptop")) return Laptop;
  if (key.includes("fashion") || key.includes("cloth") || key.includes("shirt")) return Shirt;
  if (key.includes("beauty") || key.includes("makeup") || key.includes("skin")) return Sparkles;
  if (key.includes("home") || key.includes("decor") || key.includes("kitchen")) return Home;
  if (key.includes("gift") || key.includes("valentine")) return Gift;
  if (key.includes("book")) return BookOpen;
  if (key.includes("coffee") || key.includes("mug") || key.includes("tea")) return Coffee;
  if (key.includes("watch") || key.includes("accessories")) return Watch;
  if (key.includes("love")) return HeartHandshake;
  return ShoppingBag;
};

// ⭐ MAIN PRIORITY FUNCTION
const getCategoryDisplay = (cat) => {
  if (cat.category_image) return { type: "image", value: fixURL(cat.category_image) };
  if (cat.category_image_url) return { type: "image", value: cat.category_image_url };
  if (cat.category_icon) return { type: "image", value: fixURL(cat.category_icon) };
  const AutoIcon = getAutoIcon(cat);
  if (AutoIcon) return { type: "icon", value: AutoIcon };
  return { type: "letter", value: (cat.name || "?")[0] };
};

export default function CategorySection({ categories }) {
  return (
    <section className="w-full">
      {/* Glassmorphism Container with Extra Padding for Hover */}
      <div className="relative bg-white/40 backdrop-blur-xl rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl border border-white/20">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-100/30 via-pink-100/20 to-orange-100/30 rounded-2xl -z-10"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Shop by Category
          </h2>
          <Link
            to="/all-products"
            className="text-xs sm:text-sm font-semibold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
          >
            See All
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Horizontal Scroll Container - NO SCROLLBAR with Extra Padding */}
        <div 
          className="flex gap-3 sm:gap-4 overflow-x-auto py-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <style>{`
            .category-scroll::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {categories.map((cat) => {
            const display = getCategoryDisplay(cat);

            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="group flex-shrink-0 relative"
              >
                {/* 3D Card with Glassmorphism */}
                <div className="relative bg-white/60 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 min-w-[100px] sm:min-w-[120px] flex flex-col items-center transition-all duration-500 hover:bg-gradient-to-br hover:from-red-500 hover:to-pink-500 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl border border-white/30 hover:border-white/50">
                  
                  {/* Shine Effect on Hover */}
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"></div>

                  {/* Icon Container - SMALLER SIZE */}
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm flex items-center justify-center overflow-hidden mb-2 group-hover:bg-white transition-all duration-500 shadow-lg group-hover:shadow-xl">
                    
                    {/* Inner Glow */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-200/0 to-green-200/0 group-hover:from-green-200/40 group-hover:to-green-200/40 transition-all duration-500"></div>
                    
                    {display.type === "image" ? (
                      <img
                        src={display.value}
                        alt={cat.name}
                        className="w-full h-full object-cover relative z-10 group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : display.type === "icon" ? (
                      <display.value className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800 group-hover:text-green-500 transition-colors duration-500 relative z-10" />
                    ) : (
                      <span className="text-sm sm:text-base font-bold text-gray-800 group-hover:text-green-500 transition-colors duration-500 relative z-10">
                        {display.value}
                      </span>
                    )}
                  </div>

                  {/* Category Name */}
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-white text-center transition-colors duration-500 line-clamp-2 relative z-10">
                    {cat.name}
                  </p>

                  {/* Bottom Glow Effect */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-green-500/0 group-hover:bg-green-500/30 blur-xl rounded-full transition-all duration-500"></div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Scroll Hint */}
        <div className="text-center mt-2 text-xs text-gray-400">
          ← Scroll for more →
        </div>
      </div>
    </section>
  );
}