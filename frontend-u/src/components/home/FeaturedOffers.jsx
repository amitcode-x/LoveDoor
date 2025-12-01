import { Link } from "react-router-dom";

export default function FeaturedOffers({ offers }) {
  if (!offers || offers.length === 0) return null;

  return (
    <section className="w-full px-4.5 pb-6">
      <div className="max-w-8xl rounded-2xl mx-auto px-4 md:px-6 py-12">

        {/* Heading + See All */}
        <div className="flex justify-between items-center ">
          <h2 className="text-2xl text-black font-bold">Our Featured Offers</h2>

          <Link
            to="/all-products?show=offers"
            className="text-blue-600 font-medium text-sm hover:underline"
          >
            See All Offers →
          </Link>
        </div>

        {/* ⭐ Circular Cards Scroll */}
        <div className="flex gap-6 overflow-x-auto no-scrollbar p-4 scroll-smooth">

          {offers.map((offer) => (
            <div
              key={offer.id}
              className="flex-shrink-0 w-44 md:w-64 cursor-pointer"
            >
              {/* ⭐ CIRCLE IMAGE */}
              <div
                className="w-44 h-44 md:w-64 md:h-64 rounded-full overflow-hidden 
                shadow-md relative hover:scale-105 hover:shadow-lg transition mx-auto"
              >
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* ⭐ TEXT SECTION BELOW */}
              <div className="mt-4 flex flex-col items-center text-center px-2">

                {/* ⭐ BIG + FULL WRAP TITLE */}
                <h3 className="text-black font-bold text-base md:text-xl leading-tight break-words">
                  {offer.title}
                </h3>

                <p className="text-gray-600 text-[11px] md:text-sm mt-1 break-words">
                  {offer.text}
                </p>

                <Link
                  to={offer.button_link}
                  className="bg-black text-white px-8 py-2 rounded-xl mt-3 text-xs md:text-lg font-semibold"
                >
                  {offer.button_text}
                </Link>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
