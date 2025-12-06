import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getUserDetail,
  blockUser,
  unblockUser,
  deleteUser,
} from "../../api/adminApi";

import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import { Table, THead, TBody, Tr, Th, Td } from "../../components/UI/Table";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await getUserDetail(id);
      setUser(res.data);
    } catch (error) {
      alert("User not found!");
      navigate("/users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  const handleBlock = async () => {
    await blockUser(id);
    load();
  };

  const handleUnblock = async () => {
    await unblockUser(id);
    load();
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this user permanently?")) return;

    await deleteUser(id);
    alert("User deleted!");
    navigate("/users");
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-lg font-semibold text-slate-50">
          User: {user.username}
        </h1>

        <Button variant="outline" onClick={() => navigate("/users")}>
          Back
        </Button>
      </div>

      {/* USER INFO */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-50 mb-2">
          User Information
        </h2>

        <div className="text-xs text-slate-300 space-y-1">
          <p>
            <strong>Name:</strong> {user.first_name} {user.last_name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {new Date(user.date_joined).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {user.is_active ? "Active" : "Blocked"}
          </p>
        </div>

        <div className="flex gap-3 mt-4">
          {user.is_active ? (
            <Button variant="danger" onClick={handleBlock}>
              Block User
            </Button>
          ) : (
            <Button variant="success" onClick={handleUnblock}>
              Unblock User
            </Button>
          )}

          <Button variant="danger" onClick={handleDelete}>
            Delete User
          </Button>
        </div>
      </Card>

      {/* ORDER HISTORY */}
     {/* ORDER HISTORY */}
<Card>
  <h2 className="text-sm font-semibold text-slate-50 mb-2">
    Order History
  </h2>

  <Table>
    <THead>
      <Tr>
        <Th>Order #</Th>
        <Th>Status</Th>
        <Th>Total</Th>
        <Th>Date</Th>
        <Th>Action</Th>
      </Tr>
    </THead>

    <TBody>
      {user.orders?.length ? (
        user.orders.map((o) => (
          <Tr key={o.id}>
            <Td>{o.order_number || "-"}</Td>
            <Td>{o.status || "-"}</Td>
            <Td>₹{o.total_amount ?? 0}</Td>
            <Td>
              {o.created_at
                ? new Date(o.created_at).toLocaleString()
                : "-"}
            </Td>

            {/* 👇 NEW — View Order Button */}
            <Td>
              <button
                onClick={() => navigate(`/orders/${o.order_number}`)}
                className="text-blue-400 hover:underline"
              >
                View Order
              </button>
            </Td>
          </Tr>
        ))
      ) : (
        <Tr>
          <Td colSpan={5} className="text-center py-3">
            No orders found.
          </Td>
        </Tr>
      )}
    </TBody>
  </Table>
</Card>

    </div>
  );
}
