export default function OrdersReturns() {
  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        Orders & Returns
      </h1>

      <p className="text-gray-600 mb-8">
        Manage your orders, track shipments, and learn how returns or replacements work.
      </p>

      {/* Section 1 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">
          1. Check Your Order Status
        </h2>
        <p className="text-gray-600">
          You can view all your past and current orders from the{" "}
          <a href="/my-orders" className="text-blue-600 hover:underline">
            My Orders
          </a>{" "}
          page after logging into your account.
        </p>
      </div>

      {/* Section 2 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">
          2. Track Your Shipment
        </h2>
        <p className="text-gray-600">
          If your order has been shipped, you will find the tracking link inside your
          order details. You can also visit{" "}
          <a href="/track-order" className="text-blue-600 hover:underline">
            Track Order
          </a>{" "}
          page and enter your Order ID.
        </p>
      </div>

      {/* Section 3 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">
          3. Return or Replacement
        </h2>
        <p className="text-gray-600">
          If your product is damaged, defective, wrong, or missing, you may request a
          return or replacement within the eligible window. Read more on our{" "}
          <a href="/returns" className="text-blue-600 hover:underline">
            Return & Refund Policy
          </a>
          .
        </p>
      </div>

      {/* Section 4 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">
          4. Cancellation
        </h2>
        <p className="text-gray-600">
          Orders can be cancelled before shipping. Once shipped, cancellation may not
          be possible. You can apply for cancellation from the order details page.
        </p>
      </div>

      {/* Section 5 */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">
          5. Need More Help?
        </h2>
        <p className="text-gray-600">
          For any issues, reach us through{" "}
          <a href="/contact" className="text-blue-600 hover:underline">
            Contact Us
          </a>{" "}
          .
        </p>
      </div>

      {/* Last Updated */}
      <div className="text-xs text-gray-500 border-t pt-4">
        Last updated: 01 Jan 2025
      </div>

    </div>
  );
}
