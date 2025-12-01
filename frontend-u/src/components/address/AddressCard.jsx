export default function AddressCard({ address, onEdit, onDelete }) {
  return (
    <div className="border p-4 rounded shadow bg-white">
      <div className="flex justify-between">
        <div>
          <p className="font-semibold">{address.full_name}</p>
          <p>{address.phone}</p>
          <p>{address.address_line1}</p>

          {address.address_line2 && <p>{address.address_line2}</p>}

          <p>
            {address.city}, {address.state} - {address.postal_code}
          </p>
          <p>{address.country}</p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => onEdit(address)}
            className="text-blue-600 underline"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(address.id)}
            className="text-red-600 underline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
