import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function ReturnRefund() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axiosClient
      .get("/footer/returns/")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Return page load failed", err));
  }, []);

  // Safe split for \n
  const safeSplit = (text) => {
    if (!text || typeof text !== "string") return [];
    return text.split("\n");
  };

  // ==== SAFE DEFAULT DATA (NO BACKTICKS, NO TEMPLATE STRINGS) ====
  const defaultData = {
    title: "Return & Refund Policy",
    intro_text:
      "We want you to have a smooth and worry-free shopping experience. If you are not fully satisfied, you may be eligible for a return, replacement, or refund.",

    section1_title: "1. Return Eligibility",
    section1_content:
      "- Products can be returned within 7 days of delivery.\n" +
      "- Item must be unused, undamaged, and in original packaging.\n" +
      "- Invoice / order ID is required.\n" +
      "- Used or tampered products are not accepted.",

    section2_title: "2. Refund Process",
    section2_content:
      "- 3–5 days for UPI/Wallet\n" +
      "- 5–7 days for Bank Transfer\n" +
      "- 7–10 days for Card/Net Banking",

    section3_title: "3. Replacement Policy",
    section3_content:
      "- Damaged or defective products\n" +
      "- Wrong item delivered\n" +
      "- Missing item",

    section4_title: "4. Non-Returnable Items",
    section4_content:
      "- Opened consumables\n" +
      "- Items without original packaging\n" +
      "- Sale/clearance items\n" +
      "- Customized products",

    section5_title: "5. Cancellation Policy",
    section5_content:
      "You can cancel before shipment. After shipping, cancellation isn't possible.",

    section6_title: "6. How to Request a Return",
    section6_content:
      "- Email us at support@myecommerce.com\n" +
      "- Provide order ID + reason\n" +
      "- Response in 24–48 hours",

    footer_note:
      "We are committed to ensuring you have a smooth experience with us.",
  };

  // ==== Fallback logic (API null or empty object) ====
  const isEmpty = !data || Object.keys(data).length === 0;
  const d = isEmpty ? defaultData : data;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{d.title}</h1>

      {/* Intro */}
      <p className="text-gray-600 mb-8">{d.intro_text}</p>

      {/* Sections */}
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <div key={num} className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            {d[`section${num}_title`]}
          </h2>

          <div className="ml-2">
            {safeSplit(d[`section${num}_content`]).map((line, i) => (
              <p key={i} className="text-gray-600 mb-1">
                {line}
              </p>
            ))}
          </div>
        </div>
      ))}

      {/* Footer Note */}
      <div className="mt-12 p-5 border-l-4 border-indigo-600 bg-indigo-50 rounded">
        <p className="text-gray-700">{d.footer_note}</p>
      </div>
    </div>
  );
}
