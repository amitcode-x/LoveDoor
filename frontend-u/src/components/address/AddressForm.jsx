export default function AddressForm({
  form,
  setForm,
  onSubmit,
  onCancel,
  isEditing,
}) {
  const labels = {
    full_name: "Full Name",
    phone: "Phone",
    address_line1: "Address Line 1",
    address_line2: "Address Line 2",
    city: "City",
    state: "State",
    postal_code: "Postal Code",
    country: "Country",
  };

  return (
    <form
      onSubmit={onSubmit}
      className="border p-4 rounded shadow mb-6 bg-white"
    >
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? "Edit Address" : "Add New Address"}
      </h2>

      {Object.keys(form).map((key) => (
        <div className="mb-3" key={key}>
          <label className="block font-medium mb-1">{labels[key]}</label>
          <input
            className="border w-full p-2 rounded"
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            required={key !== "address_line2"}
          />
        </div>
      ))}

      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          {isEditing ? "Update" : "Save"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded w-full"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
