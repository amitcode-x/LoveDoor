import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, updateQty, removeItem, totalAmount } = useCart();

  if (cart.length === 0)
    return <p className="p-6 text-xl">Your cart is empty!</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Your Cart</h1>

      <div className="mt-6 space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border p-4 rounded"
          >
            <div>
              <h2 className="font-semibold">{item.name}</h2>
              <p>₹{item.effective_price}</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                className="border w-16 p-1"
                value={item.quantity}
                onChange={(e) => updateQty(item.id, parseInt(e.target.value))}
              />

              <button
                className="text-red-500"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div className="text-right text-xl font-bold">
          Total: ₹{totalAmount}
        </div>

        <Link
          to="/checkout"
          className="block bg-black text-white text-center py-2 rounded mt-4"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
