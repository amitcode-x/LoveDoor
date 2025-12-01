import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function TermsOfUse() {

  const [data, setData] = useState(null);

 useEffect(() => {
  async function loadData() {
    try {
      const res = await axiosClient.get("/footer/terms/");
      setData(res.data);
    } catch (err) {
      console.error("Terms load failed", err);
    }
  }
  loadData();
}, []);


  // If no backend data → show your existing static default
  if (!data) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Terms of Use</h1>
        <p className="text-gray-600 mb-8">
          By using this website, you agree to the terms and conditions mentioned on
          this page. Please read them carefully.
        </p>
        {/* your full static content here */}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">{data.title}</h1>

      <p className="text-gray-600 mb-8">{data.intro_text}</p>

      {[1,2,3,4,5].map((i) => (
        <div key={i} className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            {data[`section${i}_title`]}
          </h2>
          <p className="text-gray-600">
            {data[`section${i}_content`]}
          </p>
        </div>
      ))}

      <div className="text-xs text-gray-500 border-t pt-4">
        {data.footer_note}
      </div>
    </div>
  );
}
