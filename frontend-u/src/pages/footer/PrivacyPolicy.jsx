import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function PrivacyPolicy() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await axiosClient.get("/footer/privacy/");
        setData(res.data);
      } catch (err) {
        console.error("Privacy policy load failed", err);
      }
    }
    load();
  }, []);

  // 🔥 If no backend data → use existing static content
  const fallback = {
    title: "Privacy Policy",
    intro_text:
      "Your privacy is important to us. This page explains how we handle your personal information.",

    section1_title: "1. Information We Collect",
    section1_content:
      "We collect basic details such as your name, email, phone number, and order information.",

    section2_title: "2. How We Use Your Information",
    section2_content:
      "Your information helps us deliver orders, send updates, and improve services.",

    section3_title: "3. Data Protection",
    section3_content:
      "We use secure methods to protect your information, but no system is risk-free.",

    section4_title: "4. Third-Party Services",
    section4_content:
      "Trusted partners may receive limited information to process orders.",

    section5_title: "5. Contact Us",
    section5_content:
      "If you have any questions, reach us at support@myecommerce.com",

    last_updated: "2025-01-01",
  };

  const page = data || fallback;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">{page.title}</h1>

      <p className="text-gray-600 mb-8">{page.intro_text}</p>

      {/* Sections */}
      {Array.from({ length: 5 }).map((_, idx) => {
        const i = idx + 1;
        return (
          <div className="mb-8" key={i}>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              {page[`section${i}_title`]}
            </h2>
            <p className="text-gray-600">{page[`section${i}_content`]}</p>
          </div>
        );
      })}

      <div className="text-xs text-gray-500 border-t pt-4">
        Last updated: {page.last_updated || fallback.last_updated}
      </div>
    </div>
  );
}
