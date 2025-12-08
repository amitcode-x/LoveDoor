import { useEffect, useState } from "react";
import { getFeaturedOffers, deleteFeaturedOffer } from "../../api/adminApi";
import { Link } from "react-router-dom";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";

export default function FeaturedOfferList() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getFeaturedOffers();

    //   console.log("FEATURED OFFERS RESPONSE ===>", res.data);

      const arr = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.results)
        ? res.data.results
        : [];

      setOffers(arr);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this featured offer?")) return;
    try {
      await deleteFeaturedOffer(id);
      load();
    } catch (err) {
      console.error(err);
      alert("Unable to delete featured offer");
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
        <h1 className="text-lg font-semibold text-slate-50">Featured Offers</h1>

        <Link to="/homepage/featured-offers/create">
          <Button>Add Offer</Button>
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
                <th className="text-left py-2">Text</th>
                <th className="text-left py-2">Order</th>
                <th className="text-left py-2">Active</th>
                <th className="text-right py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {offers.map((offer) => (
                <tr
                  key={offer.id}
                  className="border-b border-slate-800 hover:bg-slate-900/40"
                >
                  <td className="py-2">
                    {offer.image ? (
                      <img
                        src={offer.image}
                        alt=""
                        className="w-20 h-12 rounded object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-500">
                        No image
                      </span>
                    )}
                  </td>

                  <td className="py-2">{offer.title}</td>

                  <td className="py-2 max-w-xs truncate">{offer.text}</td>

                  <td className="py-2">{offer.sort_order}</td>

                  <td className="py-2">
                    <span
                      className={`px-2 py-1 text-[10px] rounded ${
                        offer.is_active
                          ? "bg-emerald-600/30 text-emerald-400"
                          : "bg-red-600/30 text-red-400"
                      }`}
                    >
                      {offer.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="py-2 text-right space-x-2">
                    <Link
                      to={`/homepage/featured-offers/${offer.id}/edit`}
                      className="text-emerald-400 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {offers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-4 text-center text-xs text-slate-500"
                  >
                    No featured offers found. Click &quot;Add Offer&quot; to
                    create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-slate-900 p-3 rounded-xl border border-slate-800"
            >
              {offer.image && (
                <img
                  src={offer.image}
                  className="w-full h-28 object-cover rounded mb-2"
                  alt=""
                />
              )}

              <div className="text-slate-200 text-sm font-semibold">
                {offer.title}
              </div>

              <div className="text-[11px] text-slate-400 line-clamp-2">
                {offer.text}
              </div>

              <div className="text-[11px] text-slate-500 mt-1">
                Order: {offer.sort_order}
              </div>

              <div className="mt-2 flex justify-between text-xs">
                <Link
                  to={`/homepage/featured-offers/${offer.id}/edit`}
                  className="text-emerald-400"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(offer.id)}
                  className="text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {offers.length === 0 && (
            <p className="text-center text-xs text-slate-500">
              No featured offers found.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
