import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useEffect } from "react";

export default function ImageViewer({ images, index, onClose, setIndex }) {
  // Close on ESC key
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const prev = () => setIndex((index - 1 + images.length) % images.length);
  const next = () => setIndex((index + 1) % images.length);

  return (
    <div className="fixed inset-0 bg-black/90 z-[9999] flex flex-col items-center justify-center">
      
      {/* Close Button */}
      <button
        className="absolute top-5 right-5 text-white text-3xl"
        onClick={onClose}
      >
        <FiX />
      </button>

      {/* Main Image */}
      <div className="relative w-full max-w-3xl px-4">
        <img
          src={images[index].image_url || images[index]}
          className="w-full max-h-[80vh] object-contain rounded-lg"
        />

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute top-1/2 left-0 -translate-y-1/2 text-white text-4xl p-2"
            >
              <FiChevronLeft />
            </button>

            <button
              onClick={next}
              className="absolute top-1/2 right-0 -translate-y-1/2 text-white text-4xl p-2"
            >
              <FiChevronRight />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex gap-3 mt-6 px-4 overflow-x-auto">
        {images.map((img, i) => (
          <img
            key={i}
            src={img.image_url || img}
            className={`w-16 h-16 object-cover border rounded cursor-pointer ${
              index === i ? "border-white" : "border-gray-600"
            }`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
