import { useEffect, useState } from "react";
import { getServiceFeatures, deleteServiceFeature } from "../../api/adminApi";
import { Link } from "react-router-dom";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";

export default function ServiceFeaturesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await getServiceFeatures();
      setItems(res.data.results || res.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feature?")) return;
    await deleteServiceFeature(id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-slate-50">Service Features</h1>

        <Link to="/admin/homepage/service-features/create">
          <Button>Add Service Feature</Button>
        </Link>
      </div>

      <Card>
        <table className="w-full text-xs text-slate-300">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="py-2">Icon</th>
              <th className="py-2">Title</th>
              <th className="py-2">Link</th>
              <th className="py-2">Active</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-slate-800">
                <td className="py-2">{item.icon_key}</td>
                <td className="py-2">{item.title}</td>
                <td className="py-2">{item.link_url}</td>

                <td className="py-2">
                  <span
                    className={`px-2 py-1 text-[10px] rounded ${
                      item.is_active
                        ? "bg-emerald-600/30 text-emerald-400"
                        : "bg-red-600/30 text-red-400"
                    }`}
                  >
                    {item.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="py-2 text-right space-x-3">
                  <Link
                    to={`/admin/homepage/service-features/${item.id}/edit`}
                    className="text-emerald-400"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
