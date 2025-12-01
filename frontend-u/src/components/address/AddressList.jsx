export default function AddressList({ addresses, onEdit, onDelete }) {
  // ⭐ FIX: Always ensure addresses is an array
  const list = Array.isArray(addresses) ? addresses : addresses?.results || [];

  if (!list.length) {
    return <p className="text-center text-gray-600">No addresses found.</p>;
  }

  return (
    <div className="space-y-4">
      {list.map((addr) => (
        <div
          key={addr.id}
          className="border p-4 rounded shadow-sm bg-white"
        >
          <p className="font-semibold text-lg">{addr.full_name}</p>
          <p>{addr.phone}</p>
          <p>{addr.address_line1}</p>
          {addr.address_line2 && <p>{addr.address_line2}</p>}
          <p>
            {addr.city}, {addr.state} - {addr.postal_code}
          </p>
          <p>{addr.country}</p>

          <div className="flex gap-3 mt-3">
            <button
              onClick={() => onEdit(addr)}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(addr.id)}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
