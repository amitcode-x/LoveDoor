import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FileText, XCircle, Truck, History } from "lucide-react";

export default function OrderDetails() {
  const { user } = useAuth();
  const { orderId } = useParams(); // order_number
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [productThumbs, setProductThumbs] = useState({});

  const steps = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

  const getStepIndex = (status) => {
    const idx = steps.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    axiosClient
      .get(`/orders/${orderId}/`)
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId, user]);

  // Fetch product thumbnails
  useEffect(() => {
    const fetchThumbs = async () => {
      if (!order || !order.items || order.items.length === 0) return;

      const currentMap = { ...productThumbs };
      const needed = [];

      order.items.forEach((item) => {
        if (!currentMap[item.product]) {
          needed.push({
            id: item.product,
            name: item.product_name,
          });
        }
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
        } catch (e) {
          // ignore
        }
      }

      setProductThumbs(currentMap);
    };

    fetchThumbs();
  }, [order]);

  const handleCancel = async () => {
    if (!order) return;
    if (
      !window.confirm(
        "Are you sure you want to cancel this order?\nThis cannot be undone."
      )
    ) {
      return;
    }

    setCancelLoading(true);
    try {
      const res = await axiosClient.post(
        `/orders/cancel/${order.order_number}/`
      );
      setOrder(res.data.order);
    } catch (e) {
      alert(
        e.response?.data?.error || "Failed to cancel order. Please try again."
      );
    }
    setCancelLoading(false);
  };

  const handleInvoice = () => {
    if (!order) return;

    // ⭐ Correct backend URL — .env NAHI hai → axiosClient se baseURL le lo
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

  if (!user) {
    return (
      <div className="p-6 text-center text-xl">
        Please{" "}
        <Link className="text-blue-600 underline" to="/login">
          login
        </Link>{" "}
        to see order details.
      </div>
    );
  }

  if (loading) return <p className="p-6 text-lg">Loading order details...</p>;

  if (!order)
    return (
      <div className="p-6 text-center text-xl text-red-500">
        Order not found!
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Order #{order.order_number}
      </h1>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-100 p-4 rounded mb-4 shadow"
      >
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div>
            <p className="text-lg">
              <strong>Status:</strong>{" "}
              <span className="text-blue-600 font-semibold">
                {order.status}
              </span>
            </p>
            <p className="text-lg">
              <strong>Payment:</strong>{" "}
              <span
                className={
                  order.payment_status === "PAID"
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {order.payment_status}
              </span>
            </p>
            <p className="text-lg">
              <strong>Total Amount:</strong> ₹{order.total_amount}
            </p>
            <p className="text-sm text-gray-600">
              Placed on: {new Date(order.created_at).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              ETA: <span className="font-semibold">{getETA(order.created_at)}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
            <button
              onClick={handleInvoice}
              className="flex items-center gap-1 px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50"
            >
              <FileText size={16} /> Invoice
            </button>

            {(order.status === "PENDING" ||
              order.status === "PROCESSING") && (
              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-60"
              >
                <XCircle size={16} />
                {cancelLoading ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <Truck size={20} /> Order Progress
        </h2>

        <div className="relative">
          <div className="absolute top-3 left-0 w-full h-1 bg-gray-300 rounded"></div>
          <div
            className="absolute top-3 left-0 h-1 bg-blue-600 rounded"
            style={{
              width: `${
                (getStepIndex(order.status) / (steps.length - 1)) * 100
              }%`,
            }}
          ></div>

          <div className="flex justify-between mt-6">
            {steps.map((step, idx) => {
              const active = idx <= getStepIndex(order.status);
              return (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-full border-2 ${
                      active
                        ? "bg-blue-600 border-blue-600"
                        : "bg-gray-300 border-gray-400"
                    }`}
                  >
                    {active && <div className="w-3 h-3 bg-white rounded-full"></div>}
                  </div>

                  <span
                    className={`text-xs mt-1 ${
                      active ? "text-blue-600 font-semibold" : "text-gray-500"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status History */}
        {Array.isArray(order.status_history) &&
          order.status_history.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-1">
                <History size={16} /> Status History
              </h3>

              <div className="space-y-1 text-xs text-gray-700">
                {order.status_history.map((h) => (
                  <div
                    key={h.id}
                    className="flex justify-between border-b border-dashed py-1"
                  >
                    <span>{h.status}</span>
                    <span>{new Date(h.created_at).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* Shipping */}
      <h2 className="text-xl font-semibold mt-4 mb-3">Shipping Address</h2>
      <div className="border p-4 rounded shadow bg-white">
        <p>
          <strong>{order.shipping_full_name}</strong>
        </p>
        <p>{order.shipping_phone}</p>
        <p>{order.shipping_address_line1}</p>
        {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
        <p>
          {order.shipping_city}, {order.shipping_state} -{" "}
          {order.shipping_postal_code}
        </p>
        <p>{order.shipping_country}</p>
      </div>

      {/* Items */}
      <h2 className="text-xl font-semibold mt-8 mb-3">Items</h2>
      <div className="space-y-4">
        {order.items.map((item) => {
          const thumb = productThumbs[item.product];
          return (
            <div
              key={item.id}
              className="border rounded p-4 shadow bg-white flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
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
                  <p className="font-semibold">{item.product_name}</p>
                  <p className="text-sm text-gray-700">
                    Price: ₹{item.product_price}
                  </p>
                  <p className="text-sm text-gray-700">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>

              <div className="text-right font-semibold">₹{item.line_total}</div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <Link to="/my-orders" className="text-blue-600 underline">
          Back to My Orders
        </Link>
      </div>
    </div>
  );
}
