import {
  FiTruck,
  FiRefreshCcw,
  FiHeadphones,
  FiGift
} from "react-icons/fi";

export default function ServiceFeatures({ features }) {
  if (!features || features.length === 0) return null;

  // ⭐ Auto Icons Map
  const icons = {
    money_back: <FiRefreshCcw size={32} className="text-gray-700" />,
    shipping: <FiTruck size={32} className="text-gray-700" />,
    support: <FiHeadphones size={32} className="text-gray-700" />,
    custom: <FiGift size={32} className="text-gray-700" />,
  };

  return (
    <section className="w-full px-4.5 pb-6">
      <div className="max-w-8xl bg-gradient-to-r from-red-100/90 via-red-100/60 to-pink-100/60 rounded-2xl mx-auto px-4 md:px-6 py-12">

        <div className="grid md:grid-cols-3 gap-6">

          {features.map((f) => (
            <div key={f.id} className="bg-gray-50 rounded-xl border p-6 text-center">

              {/* ⭐ Image > URL > Icon priority */}
              {f.final_image ? (
                <img
                  src={f.final_image}
                  alt={f.title}
                  className="w-14 h-14 object-contain mx-auto mb-3"
                />
              ) : (
                <div className="mb-3 flex justify-center">
                  {icons[f.icon_key] || icons.custom}
                </div>
              )}

              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-gray-700 text-sm mb-3">{f.description}</p>

              <a
                href={f.link_url}
                className="text-blue-600 text-sm hover:underline"
              >
                {f.link_text}
              </a>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
