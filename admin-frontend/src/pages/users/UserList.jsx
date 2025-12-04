import { useEffect, useState } from "react";
import { getUsers } from "../../api/adminApi";
import Card from "../../components/UI/Card";
import { Table, THead, TBody, Tr, Th, Td } from "../../components/UI/Table";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await getUsers();
        setUsers(res.data.results || res.data);

      } catch (error) {
        console.error(error);
        setErr("Failed to load users.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-50">Users</h1>
        <p className="text-xs text-slate-400">
          List of all registered users.
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
            <Th>ID</Th>
            <Th>Username</Th>
            <Th>Email</Th>
            <Th>Name</Th>
            <Th>Active</Th>
            <Th>Staff</Th>
            <Th>Date Joined</Th>
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
          ) : users.length ? (
            users.map((u) => (
              <Tr key={u.id}>
                <Td>{u.id}</Td>
                <Td>{u.username}</Td>
                <Td>{u.email}</Td>
                <Td>
                  {u.first_name} {u.last_name}
                </Td>
                <Td>{u.is_active ? "Yes" : "No"}</Td>
                <Td>{u.is_staff ? "Yes" : "No"}</Td>
                <Td>
                  {u.date_joined
                    ? new Date(u.date_joined).toLocaleString()
                    : "-"}
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={7} align="center" className="py-4 text-slate-500">
                No users found.
              </Td>
            </Tr>
          )}
        </TBody>
      </Table>
    </div>
  );
}
