import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function ShippingPolicy() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        // 🔥 FIXED — Correct API URL
        const res = await axiosClient.get("/footer/shipping/");
        setData(res.data);
      } catch (err) {
        console.error("Shipping policy load failed", err);
      }
    }
    loadData();
  }, []);

  // -------------------------------
  // DEFAULT STATIC FALLBACK CONTENT
  // -------------------------------
  const defaultContent = {
    title: "Shipping Policy",
    intro_text:
      "This page explains how your orders are packed, shipped, and delivered. Please read carefully before placing an order.",

    section1_title: "1. Order Processing Time",
    section1_content:
      "Most orders are processed and dispatched within 1–2 business days. During high demand, processing may take slightly longer.",

    section2_title: "2. Delivery Time",
    section2_content:
      "Delivery usually takes 3–7 business days depending on your location and courier availability.",

    section3_title: "3. Shipping Charges",
    section3_content:
      "Shipping charges, if applicable, will be shown during checkout before you complete your order.",

    section4_title: "4. Order Tracking",
    section4_content:
      "Once your order is shipped, you will receive a tracking link or AWB number on your email/SMS to track your shipment.",

    section5_title: "5. Delayed or Lost Orders",
    section5_content:
      "In rare cases of delay or lost shipments, please contact our support team. We will coordinate with the courier partner and resolve the issue.",

    footer_note: "Last updated: 01 Jan 2025",
  };

  // If no backend data → use static fallback
  const d = data || defaultContent;

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-gray-900">{d.title}</h1>

      {/* Intro */}
      <p className="text-gray-600 mb-8">{d.intro_text}</p>

      {/* Sections 1 to 5 */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            {d[`section${i}_title`]}
          </h2>
          <p className="text-gray-600">{d[`section${i}_content`]}</p>
        </div>
      ))}

      {/* Footer Note */}
      <div className="text-xs text-gray-500 border-t pt-4">
        {d.footer_note}
      </div>
    </div>
  );
}
