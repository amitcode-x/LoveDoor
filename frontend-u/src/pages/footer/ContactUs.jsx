import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function ContactUs() {
  const [data, setData] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [status, setStatus] = useState("");

  // Load dynamic content
  useEffect(() => {
    axiosClient.get("/footer/contact/")
      .then(res => setData(res.data))
      .catch(err => console.error("Contact load failed", err));
  }, []);

  // FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await axiosClient.post("/footer/contact/send/", form);
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      console.error(err);
    }
  };

  // Default fallback content
  const d = data || {
    title: "Contact Us",
    intro_text: "Have questions? We're here to help.",
    phone_number: "+91 98765 43210",
    email: "support@myecommerce.com",
    address: "123 Market Road, Delhi, India",
    working_hours: "Mon - Sat: 9:00 AM - 7:00 PM",
    map_embed_url:
      "https://www.google.com/maps/embed?pb=!1m18!1m12..."
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{d.title}</h1>
      <p className="text-gray-600 mb-10">{d.intro_text}</p>

      <div className="grid md:grid-cols-2 gap-10">
        
        {/* LEFT — CONTACT DETAILS */}
        <div className="space-y-6">

          <div className="p-5 border rounded-xl shadow-sm">
            <FaPhoneAlt className="text-indigo-600 text-3xl mb-3" />
            <h2 className="text-lg font-semibold">Phone</h2>
            <p className="text-gray-600">{d.phone_number}</p>
          </div>

          <div className="p-5 border rounded-xl shadow-sm">
            <FaEnvelope className="text-indigo-600 text-3xl mb-3" />
            <h2 className="text-lg font-semibold">Email</h2>
            <p className="text-gray-600">{d.email}</p>
          </div>

          <div className="p-5 border rounded-xl shadow-sm">
            <FaMapMarkerAlt className="text-indigo-600 text-3xl mb-3" />
            <h2 className="text-lg font-semibold">Address</h2>
            <p className="text-gray-600">{d.address}</p>
          </div>

          <div className="p-5 border rounded-xl shadow-sm">
            <FaClock className="text-indigo-600 text-3xl mb-3" />
            <h2 className="text-lg font-semibold">Working Hours</h2>
            <p className="text-gray-600">{d.working_hours}</p>
          </div>

        </div>

        {/* RIGHT — CONTACT FORM */}
        <div className="p-6 border rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Your Name"
              className="w-full border px-4 py-2 rounded-lg"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full border px-4 py-2 rounded-lg"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
            />

            <textarea
              rows="4"
              placeholder="Write your message..."
              className="w-full border px-4 py-2 rounded-lg"
              value={form.message}
              onChange={(e) => setForm({...form, message: e.target.value})}
            ></textarea>

            <button className="w-full py-3 bg-indigo-600 text-white rounded-lg">
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>

            {status === "success" && (
              <p className="text-green-600 text-sm">Message sent successfully!</p>
            )}
            {status === "error" && (
              <p className="text-red-600 text-sm">Something went wrong.</p>
            )}

          </form>
        </div>
      </div>

      {/* MAP */}
      <div className="mt-14 w-full h-64 rounded-xl overflow-hidden shadow">
        <iframe
          title="Map"
          src={d.map_embed_url}
          width="100%"
          height="100%"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
