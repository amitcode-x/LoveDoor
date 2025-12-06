import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getPaymentDetail, refundPayment } from "../../api/adminApi";

import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";

export default function PaymentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await getPaymentDetail(id);
      setPayment(res.data);
    } catch (err) {
      alert("Payment not found");
      navigate("/payments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  const handleRefund = async () => {
    if (!window.confirm("Are you sure you want to refund this payment?")) return;

    try {
      await refundPayment(id);
      alert("Payment refunded successfully.");
      load();
    } catch (err) {
      alert("Refund failed. Check Razorpay API.");
    }
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (!payment) return null;

  const isRazorpay = payment.method === "RAZORPAY";
  const isSuccess = payment.status === "SUCCESS";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-slate-50">Payment Detail</h1>

        <Button variant="outline" onClick={() => navigate("/payments")}>
          Back
        </Button>
      </div>

      <Card>
        <h2 className="text-sm font-semibold text-slate-50 mb-3">Payment Info</h2>

        <div className="text-xs text-slate-300 space-y-2">
          
          <p>
            <strong>Order:</strong>{" "}
            {payment.order_number ? (
              <Link
                to={`/orders/${payment.order_number}`}
                className="text-blue-400 underline"
              >
                {payment.order_number}
              </Link>
            ) : (
              "-"
            )}
          </p>

          <p>
            <strong>User:</strong> {payment.username || "-"}
          </p>

          <p>
            <strong>Payment Method:</strong>{" "}
            <span className="uppercase font-bold">{payment.method}</span>
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`font-semibold ${
                payment.status === "SUCCESS"
                  ? "text-green-400"
                  : payment.status === "FAILED"
                  ? "text-red-400"
                  : "text-yellow-300"
              }`}
            >
              {payment.status}
            </span>
          </p>

          <p>
            <strong>Amount:</strong> ₹{payment.amount}
          </p>

          <p>
            <strong>Currency:</strong> {payment.currency}
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {payment.created_at
              ? new Date(payment.created_at).toLocaleString()
              : "-"}
          </p>

          {/* RAZORPAY ONLY FIELDS */}
          {isRazorpay && (
            <>
              <hr className="my-3" />
              <p>
                <strong>Razorpay Order ID:</strong>{" "}
                {payment.razorpay_order_id || "-"}
              </p>
              <p>
                <strong>Razorpay Payment ID:</strong>{" "}
                {payment.razorpay_payment_id || "-"}
              </p>
            </>
          )}
        </div>

        {/* REFUND BUTTON */}
        {isRazorpay && isSuccess && (
          <Button variant="danger" className="mt-4" onClick={handleRefund}>
            Refund Payment
          </Button>
        )}
      </Card>
    </div>
  );
}
