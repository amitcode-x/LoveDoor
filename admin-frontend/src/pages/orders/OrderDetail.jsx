import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getOrderDetails } from "../../api/adminApi";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import { Table, THead, TBody, Tr, Th, Td } from "../../components/UI/Table";

export default function OrderDetail() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await getOrderDetails(orderNumber);
        setOrder(res.data);
      } catch (error) {
        console.error(error);
        setErr("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (err || !order) {
    return (
      <Card>
        <div className="text-sm text-red-400 mb-2">{err || "Order not found."}</div>
        <Button variant="outline" onClick={() => navigate("/orders")}>
          Back to Orders
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            Order {order.order_number}
          </h1>
          <p className="text-xs text-slate-400">
            Detailed view of the order, items and status.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/orders/${order.order_number}/status`)}
          >
            Update Status
          </Button>
          <Button variant="outline" onClick={() => navigate("/orders")}>
            Back to Orders
          </Button>
        </div>
      </div>

      <Card>
        <h2 className="text-sm font-semibold text-slate-50 mb-2">
          Order Summary
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 text-xs text-slate-200">
          <div>
            <div>Status: {order.status}</div>
            <div>Payment Status: {order.payment_status}</div>
            <div>Payment Method: {order.payment_method}</div>
            <div>Total: ₹{order.total_amount}</div>
          </div>
          <div>
            <div>Subtotal: ₹{order.subtotal_amount}</div>
            <div>Discount: ₹{order.discount_amount}</div>
            <div>Shipping: ₹{order.shipping_amount}</div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-slate-50 mb-2">
          Shipping Address
        </h2>
        <div className="text-xs text-slate-200 space-y-1">
          <div>{order.shipping_full_name}</div>
          <div>{order.shipping_phone}</div>
          <div>
            {order.shipping_address_line1} {order.shipping_address_line2}
          </div>
          <div>
            {order.shipping_city}, {order.shipping_state},{" "}
            {order.shipping_postal_code}
          </div>
          <div>{order.shipping_country}</div>
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-slate-50 mb-2">Items</h2>
        <Table>
          <THead>
            <Tr>
              <Th>Product</Th>
              <Th>Price</Th>
              <Th>Qty</Th>
              <Th>Total</Th>
            </Tr>
          </THead>
          <TBody>
            {order.items?.map((item) => (
              <Tr key={item.id}>
                <Td>{item.product_name}</Td>
                <Td>₹{item.product_price}</Td>
                <Td>{item.quantity}</Td>
                <Td>₹{item.line_total}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Card>

      {order.status_history?.length ? (
        <Card>
          <h2 className="text-sm font-semibold text-slate-50 mb-2">
            Status History
          </h2>
          <ul className="space-y-1 text-xs text-slate-200">
            {order.status_history.map((h) => (
              <li
                key={h.id}
                className="flex justify-between border-b border-slate-800/80 pb-1 last:border-0"
              >
                <span>
                  {h.status} — {h.message || ""}
                </span>
                <span className="text-slate-400">
                  {new Date(h.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
