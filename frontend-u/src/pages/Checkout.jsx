import { useEffect, useState, useMemo } from "react";
import axiosClient from "../api/axiosClient";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Checkout() {
  const { cart, clearCart, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD"); // "COD" | "RAZORPAY"
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");


    // Selected address object
 const selectedAddress = useMemo(() => {
  if (!Array.isArray(addresses)) return null;
  return addresses.find((a) => a.id === Number(addressId));
}, [addresses, addressId]);


    // Load addresses on mount
useEffect(() => {
  axiosClient.get("/auth/addresses/")
    .then((res) => {
      const list =
        Array.isArray(res.data)
          ? res.data
          : res.data.results || [];

      setAddresses(list);

      // auto-select first address
      if (list.length > 0) {
        setAddressId(list[0].id);
      }
    })
    .finally(() => setLoading(false));
}, []);


  const buildOrderItems = () =>
    cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));


  // User not logged in
  if (!user) {
    return (
      <div className="p-6 text-center text-xl">
        Please{" "}
        <Link className="text-blue-600 underline" to="/login">
          login
        </Link>{" "}
        to checkout.
      </div>
    );
  }

  // No items in cart
  if (cart.length === 0) {
    return (
      <div className="p-6 text-center text-xl">
        Your cart is empty.{" "}
        <Link to="/shop" className="text-blue-600 underline">
          Go to Shop
        </Link>
      </div>
    );
  }




  // MAIN handler - Place order btn
const handlePlaceOrder = async () => {
  try {
    setError("");

    if (!addressId) {
      setError("Please select an address.");
      return;
    }

    if (!selectedAddress) {
      setError("Selected address not found.");
      return;
    }

    if (totalAmount <= 0) {
      setError("Invalid total amount.");
      return;
    }

    // 🔥 If Razorpay is selected → DO NOTHING, only show coming soon
    if (paymentMethod === "RAZORPAY") {
      setError("Online Payment Coming Soon!");
      return; // ❌ Stop execution here
    }

    // COD → proceed with actual order
    setPlacing(true);
    await handleCodOrder();

  } catch (err) {
    console.error(err);
    setError("Something went wrong. Try again.");
  } finally {
    setPlacing(false);
  }
};


  // COD flow
  const handleCodOrder = async () => {
  const itemsData = buildOrderItems();

  const res = await axiosClient.post("/orders/create/", {
    shipping_address_id: addressId,
    payment_method: "COD",
    items: itemsData,
    notes: "",
  });

  // 👇 Show success message
  setError("Order Successfully Placed!");

  // Clean cart AFTER message
  setTimeout(() => {
    clearCart();
    navigate(`/order/${res.data.order.order_number}`);
  }, 1200); // 1.2 seconds delay for message visibility
};

  // Razorpay flow
  const handleRazorpayOrder = async () => {
    const itemsData = buildOrderItems();

    // 1. Create Order with payment_method = RAZORPAY
    const orderRes = await axiosClient.post("/orders/create/", {
      shipping_address_id: addressId,
      payment_method: "RAZORPAY",
      items: itemsData,
      notes: "",
    });

    const order = orderRes.data.order;
    const orderNumber = order.order_number;

    // 2. Create Razorpay Order from backend
    const rpRes = await axiosClient.post("/payments/create-order/", {
      order_number: orderNumber,
    });

    const rpData = rpRes.data;

    if (!window.Razorpay) {
      setError("Razorpay SDK not loaded. Please refresh the page.");
      return;
    }

    // 3. Open Razorpay popup
    const options = {
      key: rpData.key,
      amount: rpData.amount,
      currency: rpData.currency,
      name: rpData.name,
      description: rpData.description,
      order_id: rpData.order_id,
      handler: async function (response) {
        try {
          // 4. Verify payment
          await axiosClient.post("/payments/verify/", {
            order_number: orderNumber,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          clearCart();
          navigate(`/order/${orderNumber}`);
        } catch (err) {
          console.error(err);
          setError("Payment verification failed. If amount deducted, contact support.");
        }
      },
      prefill: {
        name: `${user.first_name} ${user.last_name}`.trim() || user.username,
        email: user.email,
        contact: selectedAddress?.phone || "",
      },
      notes: {
        address: `${selectedAddress?.address_line1}, ${selectedAddress?.city}`,
      },
      theme: {
        color: "#000000",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      {error && (
        <p className="mb-4 text-center text-green-600 font-medium">{error}</p>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Address & Payment */}
        <div className="md:col-span-2 space-y-6">
          {/* Addresses */}
          <div className="border rounded p-4 shadow bg-white">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">Shipping Address</h2>
              <Link
                to="/addresses"
                className="text-blue-600 underline text-sm"
              >
                Manage Addresses
              </Link>
            </div>

            {loading ? (
              <p>Loading addresses...</p>
            ) : addresses.length === 0 ? (
              <p>
                No addresses found.{" "}
                <Link to="/addresses" className="text-blue-600 underline">
                  Add a new address
                </Link>
              </p>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`border rounded p-3 flex gap-3 cursor-pointer ${
                      Number(addressId) === addr.id
                        ? "border-black bg-gray-100"
                        : "border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={Number(addressId) === addr.id}
                      onChange={(e) => setAddressId(e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold">{addr.full_name}</p>
                      <p>{addr.phone}</p>
                      <p>{addr.address_line1}</p>
                      {addr.address_line2 && <p>{addr.address_line2}</p>}
                      <p>
                        {addr.city}, {addr.state} - {addr.postal_code}
                      </p>
                      <p>{addr.country}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="border rounded p-4 shadow bg-white">
            <h2 className="text-xl font-semibold mb-3">Payment Method</h2>

            <label className="flex items-center gap-3 mb-2">
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Cash on Delivery (COD)</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="payment"
                value="RAZORPAY"
                checked={paymentMethod === "RAZORPAY"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Pay Online (Razorpay)</span>
            </label>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="border rounded p-4 shadow bg-white">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-2 mb-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{item.effective_price * item.quantity}</span>
              </div>
            ))}
          </div>

          <hr className="my-3" />

          <p className="flex justify-between font-semibold text-lg mb-4">
            <span>Total:</span>
            <span>₹{totalAmount}</span>
          </p>

          <button
            onClick={handlePlaceOrder}
            disabled={placing || !cart.length}
            className="w-full bg-black text-white py-2 rounded disabled:bg-gray-500"
          >
            {placing
              ? "Processing..."
              : paymentMethod === "COD"
              ? "Place Order (COD)"
              : "Pay Now (Razorpay)"}
          </button>
        </div>
      </div>
    </div>
  );
}
