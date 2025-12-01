import { useEffect, useState } from "react";
import { getPayments } from "../../api/adminApi";
import Card from "../../components/UI/Card";
import { Table, THead, TBody, Tr, Th, Td } from "../../components/UI/Table";

export default function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await getPayments();
        setPayments(res.data);
      } catch (error) {
        console.error(error);
        setErr(
          "Failed to load payments. Ensure you have a /api/payments/ list API."
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-50">Payments</h1>
        <p className="text-xs text-slate-400">
          Razorpay payment records (admin view).
        </p>
      </div>

      {err && (
        <Card>
          <div className="text-sm text-red-400">{err}</div>
        </Card>
      )}

      <Table>
        <THead>
          <Tr>
            <Th>Order</Th>
            <Th>User</Th>
            <Th>Razorpay Order</Th>
            <Th>Payment ID</Th>
            <Th>Status</Th>
            <Th>Amount</Th>
            <Th>Currency</Th>
            <Th>Date</Th>
          </Tr>
        </THead>
        <TBody>
          {loading ? (
            <Tr>
              <Td colSpan={8} align="center">
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-7 w-7 border-2 border-emerald-500 border-t-transparent" />
                </div>
              </Td>
            </Tr>
          ) : payments.length ? (
            payments.map((p) => (
              <Tr key={p.id}>
                <Td>{p.order_number || p.order?.order_number || "-"}</Td>
                <Td>{p.user?.username || "-"}</Td>
                <Td>{p.razorpay_order_id}</Td>
                <Td>{p.razorpay_payment_id || "-"}</Td>
                <Td>{p.status}</Td>
                <Td>₹{p.amount}</Td>
                <Td>{p.currency}</Td>
                <Td>
                  {p.created_at ? new Date(p.created_at).toLocaleString() : "-"}
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={8} align="center" className="py-4 text-slate-500">
                No payments found.
              </Td>
            </Tr>
          )}
        </TBody>
      </Table>
    </div>
  );
}
