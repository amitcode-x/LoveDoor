export default function SiteMap() {
  const sections = [
    {
      title: "Shop",
      links: [
        { label: "All Products", url: "/all-products" },
        { label: "Categories", url: "/shop" },
        { label: "Wishlist", url: "/wishlist" },
        { label: "Cart", url: "/cart" },
      ],
    },
    {
      title: "My Account",
      links: [
        { label: "Login", url: "/login" },
        { label: "Register", url: "/register" },
        { label: "My Orders", url: "/my-orders" },
        { label: "Profile", url: "/profile" },
      ],
    },
    {
      title: "Customer Support",
      links: [
        { label: "Contact Us", url: "/contact" },
        { label: "Help Center", url: "/help" },
        { label: "FAQs", url: "/faq" },
        { label: "Track Order", url: "/track-order" },
      ],
    },
    {
      title: "Policies",
      links: [
        { label: "Privacy Policy", url: "/privacy" },
        { label: "Terms of Use", url: "/terms" },
        { label: "Shipping Policy", url: "/shipping" },
        { label: "Return & Refund", url: "/returns" },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Site Map</h1>

      <p className="text-gray-600 mb-8">
        Quickly find important pages and sections across our website.
      </p>

      {/* Sections */}
      <div className="grid md:grid-cols-2 gap-8">
        {sections.map((sec, index) => (
          <div key={index}>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              {sec.title}
            </h2>

            <ul className="space-y-2 ml-2">
              {sec.links.map((lnk, idx) => (
                <li key={idx}>
                  <a
                    href={lnk.url}
                    className="text-gray-600 hover:text-gray-900 transition"
                  >
                    {lnk.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-xs text-gray-500 border-t pt-4 mt-10">
        Last updated: 01 Jan 2025
      </div>
    </div>
  );
}
