import { useEffect } from "react";

export default function TawkTo() {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = 'https://embed.tawk.to/6939a66e2a271419893a1126/1jc4j48ij'; // 👉 Yaha apna script wala URL paste karo
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}



