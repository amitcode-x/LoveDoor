import { useEffect, useState } from "react";
import { getCategories, deleteCategory } from "../../api/adminApi";
import { Link } from "react-router-dom";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.results || res.data);  // pagination safe
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      loadData();
    } catch {
      alert("Failed to delete");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Categories</h1>
        <Link to="/categories/create" className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add Category
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Slug</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td className="border p-2">
                <img
                  src={cat.category_image_url || cat.category_image}
                  alt=""
                  className="h-12 w-12 object-cover rounded"
                />
              </td>
              <td className="border p-2">{cat.name}</td>
              <td className="border p-2">{cat.slug}</td>
              <td className="border p-2">
                {cat.is_active ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-red-600">Inactive</span>
                )}
              </td>

              <td className="border p-2">
                <Link to={`/categories/${cat.id}`} className="text-blue-600 mr-4">
                  Edit
                </Link>
                <button onClick={() => handleDelete(cat.id)} className="text-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
