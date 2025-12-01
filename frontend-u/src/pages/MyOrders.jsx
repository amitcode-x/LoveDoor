import { useEffect, useState, useMemo } from "react";
import axiosClient from "../api/axiosClient";
import { Link, useNavigate } from "react-router-dom";
import { FileText, XCircle, Search } from "lucide-react";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cancelLoadingId, setCancelLoadingId] = useState(null);
  const [productThumbs, setProductThumbs] = useState({});
  const navigate = useNavigate();

  const steps = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

  const getStepIndex = (status) => {
    const idx = steps.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  const fetchOrders = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/orders/?page=${pageNumber}`);
      if (Array.isArray(res.data)) {
        setOrders(res.data);
        setHasNext(false);
        setHasPrev(false);
      } else {
        const list = res.data.results || [];
        setOrders(list);
        setHasNext(Boolean(res.data.next));
        setHasPrev(Boolean(res.data.previous));
      }
    } catch (e) {
      setOrders([]);
      setHasNext(false);
      setHasPrev(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  // thumbnails
  useEffect(() => {
    const fetchThumbnails = async () => {
      if (!orders || orders.length === 0) return;

      const currentMap = { ...productThumbs };
      const needed = [];

      orders.forEach((order) => {
        order.items?.forEach((item) => {
          if (!currentMap[item.product]) {
            needed.push({
              id: item.product,
              name: item.product_name,
            });
          }
        });
      });

      for (const p of needed) {
        try {
          const res = await axiosClient.get(
            `/products/?search=${encodeURIComponent(p.name)}`
          );
          const list = Array.isArray(res.data)
            ? res.data
            : res.data.results || [];
          const found = list.find((prod) => prod.id === p.id) || list[0];
          if (found && found.thumbnail) {
            currentMap[p.id] = found.thumbnail;
          }
        } catch (e) {}
      }

      setProductThumbs(currentMap);
    };

    fetchThumbnails();
  }, [orders]);

  const handleCancel = async (order) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this order?\nThis cannot be undone."
      )
    ) {
      return;
    }

    setCancelLoadingId(order.id);
    try {
      const res = await axiosClient.post(
        `/orders/cancel/${order.order_number}/`
      );
      const updated = res.data.order;
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? updated : o))
      );
    } catch (e) {
      alert(
        e.response?.data?.error || "Failed to cancel order. Please try again."
      );
    }
    setCancelLoadingId(null);
  };

  const handleInvoice = (order) => {
    const BASE = axiosClient.defaults.baseURL;
    window.open(`${BASE}/orders/${order.order_number}/invoice/`, "_blank");
  };

  const getETA = (createdAt) => {
    if (!createdAt) return "3–5 days";
    const d = new Date(createdAt);
    const eta = new Date(d);
    eta.setDate(eta.getDate() + 4);
    return eta.toLocaleDateString();
  };

  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    const term = searchTerm.toLowerCase();

    return orders.filter((o) => {
      if (o.order_number.toLowerCase().includes(term)) return true;
      if (
        o.items?.some((item) =>
          item.product_name.toLowerCase().includes(term)
        )
      )
        return true;
      return false;
    });
  }, [orders, searchTerm]);

  if (loading)
    return <p className="p-6 text-lg">Loading your orders...</p>;

  if (!Array.isArray(orders) || orders.length === 0)
    return (
      <p className="p-6 text-xl text-center">
        You have no orders yet.
      </p>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">My Orders</h1>

      {/* Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Search by order or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <p className="text-sm text-gray-500">
          Page {page}
          {hasNext || hasPrev ? " (paginated)" : ""}
        </p>
      </div>

      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="border p-5 rounded-xl shadow bg-white hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">
                  Order #{order.order_number}
                </h2>

                <p className="text-sm text-gray-600">
                  Placed on:{" "}
                  {new Date(order.created_at).toLocaleDateString()}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  {/* Status Badge */}
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded text-white ${
                      order.status === "DELIVERED"
                        ? "bg-green-600"
                        : order.status === "SHIPPED"
                        ? "bg-blue-600"
                        : order.status === "PROCESSING"
                        ? "bg-yellow-500"
                        : order.status === "CANCELLED"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {order.status}
                  </span>

                  {/* Payment Badge */}
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded text-white ${
                      order.payment_status === "PAID"
                        ? "bg-green-700"
                        : "bg-red-500"
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  ETA:{" "}
                  <span className="font-semibold">
                    {getETA(order.created_at)}
                  </span>
                </p>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold">
                  ₹{order.total_amount}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="mt-4 space-y-2">
              {order.items?.map((item) => {
                const thumb = productThumbs[item.product];
                return (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-gray-500">
                            {item.product_name.charAt(0)}
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="font-semibold">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-gray-600">
                          ₹{item.product_price} × {item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="font-semibold">₹{item.line_total}</div>
                  </div>
                );
              })}
            </div>

            {/* Timeline */}
            <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
              {steps.map((step, idx) => {
                const active = idx <= getStepIndex(order.status);
                return (
                  <span key={step} className="flex items-center gap-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        active ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    ></span>
                    <span className={active ? "text-blue-600" : ""}>
                      {step}
                    </span>
                    {idx < steps.length - 1 && <span>›</span>}
                  </span>
                );
              })}
            </div>

            {/* Buttons */}
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to={`/order/${order.order_number}`}
                className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-black"
              >
                View Details
              </Link>

              <button
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                onClick={() =>
                  navigate(
                    `/track-order?order=${order.order_number}&phone=${order.shipping_phone}`
                  )
                }
              >
                Track Order
              </button>

              <button
                className="flex items-center gap-1 px-4 py-2 bg-white border text-sm rounded-lg hover:bg-gray-50"
                onClick={() => handleInvoice(order)}
              >
                <FileText size={16} /> Invoice
              </button>

              {(order.status === "PENDING" ||
                order.status === "PROCESSING") && (
                <button
                  className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-60"
                  disabled={cancelLoadingId === order.id}
                  onClick={() => handleCancel(order)}
                >
                  <XCircle size={16} />
                  {cancelLoadingId === order.id
                    ? "Cancelling..."
                    : "Cancel Order"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {(hasNext || hasPrev) && (
        <div className="mt-6 flex justify-center gap-3">
          <button
            disabled={!hasPrev}
            onClick={() => hasPrev && setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 text-sm rounded border disabled:opacity-50"
          >
            Previous
          </button>

          <button
            disabled={!hasNext}
            onClick={() => hasNext && setPage((p) => p + 1)}
            className="px-4 py-2 text-sm rounded border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
