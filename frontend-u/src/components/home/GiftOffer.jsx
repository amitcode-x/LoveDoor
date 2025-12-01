import { Link } from "react-router-dom";

export default function GiftOffer({ data }) {
  if (!data) return null;

  return (
    <section className="w-full px-4.5 pb-6 ">
      <div
        className="w-full h-[260px] md:h-[340px] flex items-center justify-center text-center relative overflow-hidden rounded-xl"
      >

        {/* BACKGROUND IMAGE */}
        {data.final_image && (
          <img
            src={data.final_image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* COLOR GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/60 via-red-100/60 to-yellow-100/60"></div>

        {/* MAIN CONTENT */}
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-red-600">
            {data.title}
          </h2>

          <p className="text-red-500 mt-3 mb-6">
            {data.description}
          </p>

          <Link
            to={data.button_link}
            className=" border-2 text-red-800 px-8 py-3  rounded-2xl font-semibold"
          >
            {data.button_text}
          </Link>
        </div>

      </div>
    </section>
  );
}
