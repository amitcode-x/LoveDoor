import { Link } from "react-router-dom";

export default function SecondaryHero({ data }) {
  if (!data) return null;

  return (
    <section className="w-full px-4.5 pb-6">
      <div className="relative max-w-8xl h-70 bg-gray-900 rounded-2xl mx-auto px-4 md:px-6 py-10 flex flex-col md:flex-row items-center gap-6 overflow-hidden">

        {/* ⭐ BACKGROUND IMAGE (priority-based final_image) */}
        {data.final_image && (
          <img
            src={data.final_image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
        )}

        {/* ⭐ Overlay (dark layer for readability) */}
        <div className="absolute inset-0 "></div>

        {/* ⭐ CONTENT */}
        <div className="relative z-10 flex-1">
          <h2 className="text-3xl font-bold text-white">{data.title}</h2>
          <p className="text-gray-200 mt-2">{data.description}</p>
        </div>

        <div className="relative z-10">
          <Link
            to={data.button_link}
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold"
          >
            {data.button_text}
          </Link>
        </div>

      </div>
    </section>
  );
}
