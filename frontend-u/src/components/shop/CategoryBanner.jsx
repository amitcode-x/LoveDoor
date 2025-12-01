export default function CategoryBanner({ category }) {
  if (!category) return null;

  return (
    <div className="w-full h-48 md:h-64 relative rounded-xl overflow-hidden mb-6">
      {/* Background Image */}
      <img
        src={category.banner_image}
        alt={category.name}
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6 md:px-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-gray-200 mt-2 max-w-2xl">
            {category.description}
          </p>
        )}
      </div>
    </div>
  );
}
