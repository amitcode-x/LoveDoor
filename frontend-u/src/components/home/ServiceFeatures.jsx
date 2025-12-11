import {
  FiTruck,
  FiRefreshCcw,
  FiHeadphones,
  FiGift
} from "react-icons/fi";

export default function ServiceFeatures({ features }) {
  if (!features || features.length === 0) return null;

  const icons = {
    money_back: { 
      icon: <FiRefreshCcw size={28} />, 
      gradient: "from-green-500 to-emerald-500" 
    },
    shipping: { 
      icon: <FiTruck size={28} />, 
      gradient: "from-blue-500 to-cyan-500" 
    },
    support: { 
      icon: <FiHeadphones size={28} />, 
      gradient: "from-purple-500 to-pink-500" 
    },
    custom: { 
      icon: <FiGift size={28} />, 
      gradient: "from-red-500 to-orange-500" 
    },
  };

  return (
    <section className="w-full">

      {/* ⭐ Main Gradient Wrapper (GiftOffer style) */}
      <div className="relative rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl 
      border border-white/30 overflow-hidden bg-white/30 backdrop-blur-xl">

        {/* Pastel Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br 
        from-white/60 via-pink-100/50 to-orange-100/50 rounded-2xl -z-10"></div>

        {/* ⭐ Horizontal Scroll Instead of Grid */}
        <div
          className="flex gap-3 sm:gap-4 overflow-x-auto py-3 scroll-smooth relative z-10"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>

          {features.map((f) => {
            const iconData = icons[f.icon_key] || icons.custom;

            return (
              <div
                key={f.id}
                className="
                  group flex-shrink-0 
                  w-[48%] sm:w-[48%] 
                  md:w-[30%] lg:w-[30%] xl:w-[30%]
                  relative bg-white/60 backdrop-blur-md rounded-xl border border-white/40 
                  p-4 sm:p-5 text-center transition-all duration-500 
                  hover:bg-white/80 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl
                "
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
                transition-opacity duration-500 bg-gradient-to-tr 
                from-transparent via-white/30 to-transparent pointer-events-none"></div>

                {/* Icon */}
                <div className="relative z-10 mb-3">
                  {f.final_image ? (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br 
                    from-white/80 to-white/40 rounded-full flex items-center justify-center 
                    shadow-lg group-hover:shadow-xl transition-all duration-500">
                      <img
                        src={f.final_image}
                        alt={f.title}
                        className="w-9 h-9 sm:w-11 sm:h-11 object-contain group-hover:scale-110 
                        transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br ${iconData.gradient} 
                      rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl 
                      transition-all duration-500 text-white`}
                    >
                      <div className="group-hover:scale-110 transition-transform duration-500">
                        {iconData.icon}
                      </div>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="relative z-10 text-sm sm:text-base font-bold text-gray-800 mb-1 
                group-hover:text-red-500 transition-colors duration-300 break-words whitespace-normal">
                  {f.title}
                </h3>

                {/* Description */}
                <p className="relative z-10 text-gray-600 text-xs sm:text-sm mb-2 leading-relaxed 
                break-words whitespace-normal">
                  {f.description}
                </p>

                {/* Link */}
                {f.link_url && f.link_text && (
                  <a
                    href={f.link_url}
                    className="relative z-10 inline-flex items-center gap-1 
                    text-red-500 text-xs sm:text-sm font-semibold hover:text-red-600 
                    transition-colors group/link"
                  >
                    {f.link_text}
                    <svg
                      className="w-3 h-3 group-hover/link:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                )}

                {/* Bottom Glow */}
                <div
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 
                  bg-gradient-to-r ${iconData.gradient} opacity-0 group-hover:opacity-30 
                  blur-xl rounded-full transition-all duration-500`}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Scroll hint */}
        <div className="text-center mt-1 text-[10px] text-gray-400">← Scroll →</div>
      </div>
    </section>
  );
}
