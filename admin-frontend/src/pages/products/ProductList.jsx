import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct } from "../../api/adminApi";

import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import { Table, THead, TBody, Tr, Th, Td } from "../../components/UI/Table";
import Modal from "../../components/UI/Modal";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const navigate = useNavigate();

  const loadProducts = async () => {
    setLoading(true);
    setErr("");

    try {
      const res = await getProducts();

      // ⭐ MAIN FIX: use `results`
      setProducts(res.data.results || []);
    } catch (error) {
      console.error(error);
      setErr("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
      loadProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">Products</h1>
          <p className="text-xs text-slate-400">
            Manage all products in your store.
          </p>
        </div>

        <Button onClick={() => navigate("/products/create")}>
          + Add Product
        </Button>
      </div>

      {/* Error */}
      {err && (
        <Card>
          <div className="text-sm text-red-400">{err}</div>
        </Card>
      )}

      {/* Table */}
      <Table>
        <THead>
          <Tr>
            <Th>Name</Th>
            <Th>Category</Th>
            <Th>Price</Th>
            <Th>Discount</Th>
            <Th>Stock</Th>
            <Th>Status</Th>
            <Th align="right">Actions</Th>
          </Tr>
        </THead>

        <TBody>
          {loading ? (
            <Tr>
              <Td colSpan={7} align="center">
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-7 w-7 border-2 border-emerald-500 border-t-transparent" />
                </div>
              </Td>
            </Tr>
          ) : products.length ? (
            products.map((p) => (
              <Tr key={p.id}>
                <Td>{p.name}</Td>
                <Td>{p.category?.name || "-"}</Td>
                <Td>₹{p.price}</Td>
                <Td>{p.discount_price ? `₹${p.discount_price}` : "-"}</Td>
                <Td>{p.stock}</Td>

                <Td>
                  <span className="inline-flex rounded-full px-2 py-0.5 text-[11px] bg-slate-800 text-slate-200">
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
                </Td>

                <Td align="right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/products/${p.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => setDeleteTarget(p)}
                    >
                      Delete
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={7} align="center" className="py-4 text-slate-500">
                No products found.
              </Td>
            </Tr>
          )}
        </TBody>
      </Table>

      {/* Delete Modal */}
      <Modal
        open={!!deleteTarget}
        title="Delete Product"
        onClose={() => setDeleteTarget(null)}
      >
        <p>Are you sure you want to delete this product?</p>
        <p className="text-slate-300 mt-1 font-semibold">
          {deleteTarget?.name}
        </p>

        <div className="mt-3 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>

          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
