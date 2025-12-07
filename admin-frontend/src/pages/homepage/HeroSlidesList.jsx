import { useEffect, useState } from "react";
import { getHeroSlides, deleteHeroSlide } from "../../api/adminApi";
import { Link } from "react-router-dom";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";

export default function HeroSlidesList() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
  try {
    const res = await getHeroSlides();

    console.log("HERO SLIDES RESPONSE ===>", res.data);

    // 👉 FIX: Always extract results array from pagination
    const arr = Array.isArray(res.data.results) ? res.data.results : [];

    setSlides(arr);
  } catch (err) {
    console.error(err);
  }

  setLoading(false);
};


  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slide?")) return;
    try {
      await deleteHeroSlide(id);
      load();
    } catch (err) {
      console.error(err);
      alert("Unable to delete slide");
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-slate-50">Hero Slides</h1>

        <Link to="/admin/homepage/hero-slides/create">
          <Button>Add Slide</Button>
        </Link>
      </div>

      <Card>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2">Image</th>
                <th className="text-left py-2">Title</th>
                <th className="text-left py-2">Order</th>
                <th className="text-left py-2">Active</th>
                <th className="text-right py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {slides.map((slide) => (
                <tr
                  key={slide.id}
                  className="border-b border-slate-800 hover:bg-slate-900/40"
                >
                  <td className="py-2">
                    <img
                      src={slide.image}
                      alt=""
                      className="w-20 h-12 rounded object-cover"
                    />
                  </td>

                  <td className="py-2">{slide.title}</td>

                  <td className="py-2">{slide.sort_order}</td>

                  <td className="py-2">
                    <span
                      className={`px-2 py-1 text-[10px] rounded ${
                        slide.is_active
                          ? "bg-emerald-600/30 text-emerald-400"
                          : "bg-red-600/30 text-red-400"
                      }`}
                    >
                      {slide.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="py-2 text-right space-x-2">
                    <Link
                      to={`/admin/homepage/hero-slides/${slide.id}/edit`}
                      className="text-emerald-400 hover:underline"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="bg-slate-900 p-3 rounded-xl border border-slate-800"
            >
              <img
                src={slide.image}
                className="w-full h-28 object-cover rounded mb-2"
                alt=""
              />

              <div className="text-slate-200 text-sm font-semibold">
                {slide.title}
              </div>

              <div className="text-[11px] text-slate-400">
                Order: {slide.sort_order}
              </div>

              <div className="mt-2 flex justify-between text-xs">
                <Link
                  to={`/admin/homepage/hero-slides/${slide.id}/edit`}
                  className="text-emerald-400"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(slide.id)}
                  className="text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
