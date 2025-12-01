export default function StaticHero({ data }) {
  if (!data) return null;

  return (
    <section className="w-full">
      <div className="max-w-8xl mx-auto px-4 md:px-6 py-8">
        <div className="relative overflow-hidden rounded-2xl h-48 md:h-64">

          {/* BACKGROUND IMAGE */}
          <img
            src={data.image}
            alt=""
            className="w-full h-full object-cover"
          />

          {/* OVERLAY CONTENT */}
          <div className="absolute inset-0 bg-black/5 flex flex-col justify-center px-6 md:px-12">
            <p className="text-sm md:text-base text-red-500 mb-1">
              {data.subtitle}
            </p>

            <h3 className="text-xl md:text-3xl font-bold text-red-500  mb-3">
              {data.title}
            </h3>

            <a
              href={data.button_link}
              className="inline-flex items-center gap-2 bg-white/90 text-red-500 text-xl md:text-base px-10 py-2 rounded-xl hover:bg-white transition w-max"
            >
              {data.button_text}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
