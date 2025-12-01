import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

import { FaHandsHelping, FaRocket, FaUsers, FaGlobeAsia } from "react-icons/fa";

export default function AboutUs() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await axiosClient.get("/footer/about/");
        setData(res.data);
      } catch (err) {
        console.error("About page load failed", err);
      }
    }
    loadData();
  }, []);

  // If no backend data → default static content
  const d = {
  title: data?.title || "About Us",
  intro_text:
    data?.intro_text ||
    "Welcome to Our E-Commerce Store — Your trusted destination for premium quality products.",

  mission_title: data?.mission_title || "Our Mission",
  mission_description:
    data?.mission_description ||
    "To provide customers with top-quality products at fair prices.",

  vision_title: data?.vision_title || "Our Vision",
  vision_description:
    data?.vision_description ||
    "To become a leading and trusted online brand known for value and satisfaction.",

  stat_1_value: data?.stat_1_value || "10K+",
  stat_1_label: data?.stat_1_label || "Happy Customers",

  stat_2_value: data?.stat_2_value || "12+",
  stat_2_label: data?.stat_2_label || "Cities Served",

  stat_3_value: data?.stat_3_value || "500+",
  stat_3_label: data?.stat_3_label || "Products Delivered",

  stat_4_value: data?.stat_4_value || "4.9★",
  stat_4_label: data?.stat_4_label || "Customer Rating",

  who_we_are:
    data?.who_we_are ||
    "We are a passionate team committed to offering genuine, high-quality products.",

  why_list:
    data?.why_list && data?.why_list.length > 0
      ? data.why_list
      : [
          "✔ Premium quality products",
          "✔ Fast & secure delivery",
          "✔ Easy and hassle-free returns",
          "✔ Friendly 24/7 customer support",
          "✔ Best prices with trusted service",
        ],

  cta_text: data?.cta_text || "Explore Our Store",
  cta_link: data?.cta_link || "/shop",
};

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-gray-900">{d.title}</h1>

      {/* Intro */}
      <p className="text-gray-600 leading-relaxed mb-8">{d.intro_text}</p>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
          <FaRocket className="text-indigo-600 text-4xl mb-4" />
          <h2 className="text-xl font-semibold mb-2">{d.mission_title}</h2>
          <p className="text-gray-600">{d.mission_description}</p>
        </div>

        <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
          <FaHandsHelping className="text-indigo-600 text-4xl mb-4" />
          <h2 className="text-xl font-semibold mb-2">{d.vision_title}</h2>
          <p className="text-gray-600">{d.vision_description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 text-center">
        <div className="p-4 border rounded-lg shadow-sm">
          <FaUsers className="text-indigo-600 text-3xl mx-auto mb-2" />
          <h3 className="text-xl font-bold">{d.stat_1_value}</h3>
          <p className="text-gray-600 text-sm">{d.stat_1_label}</p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm">
          <FaGlobeAsia className="text-indigo-600 text-3xl mx-auto mb-2" />
          <h3 className="text-xl font-bold">{d.stat_2_value}</h3>
          <p className="text-gray-600 text-sm">{d.stat_2_label}</p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm">
          <FaRocket className="text-indigo-600 text-3xl mx-auto mb-2" />
          <h3 className="text-xl font-bold">{d.stat_3_value}</h3>
          <p className="text-gray-600 text-sm">{d.stat_3_label}</p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm">
          <FaUsers className="text-indigo-600 text-3xl mx-auto mb-2" />
          <h3 className="text-xl font-bold">{d.stat_4_value}</h3>
          <p className="text-gray-600 text-sm">{d.stat_4_label}</p>
        </div>
      </div>

      {/* Who We Are */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-3 text-gray-900">
          Who We Are
        </h2>
        <p className="text-gray-600 leading-relaxed">{d.who_we_are}</p>
      </div>

      {/* Why Choose Us */}
      <div className="mb-14">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Why Choose Us?
        </h2>
        <ul className="space-y-3 text-gray-600">
          {(d.why_list || []).map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <a
          href={d.cta_link}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
        >
          {d.cta_text}
        </a>
      </div>
    </div>
  );
}
