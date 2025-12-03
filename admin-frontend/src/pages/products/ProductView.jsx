import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetail } from "../../api/adminApi";

import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";

export default function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await getProductDetail(id);
      setProduct(res.data);
    }
    load();
  }, [id]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-slate-50">Product Details</h1>
        <Button variant="outline" onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </div>

      <Card className="space-y-4">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-40 h-40 rounded object-cover border border-slate-700"
        />

        <div className="space-y-1 text-sm text-slate-200">
          <p><strong>Name:</strong> {product.name}</p>
          <p><strong>Category:</strong> {product.category?.name}</p>

          <p><strong>Price:</strong> ₹{product.price}</p>
          {product.discount_price && (
            <p><strong>Discount Price:</strong> ₹{product.discount_price}</p>
          )}

          <p><strong>Stock:</strong> {product.stock}</p>

          <p><strong>Short Description:</strong> {product.short_description}</p>

          <p><strong>Description:</strong></p>
          <p className="text-slate-400 text-xs">{product.description}</p>

          <p><strong>Status:</strong> {product.is_active ? "Active" : "Inactive"}</p>
          <p><strong>Featured:</strong> {product.is_featured ? "Yes" : "No"}</p>
          <p><strong>New Product:</strong> {product.is_new ? "Yes" : "No"}</p>
        </div>
      </Card>
    </div>
  );
}
