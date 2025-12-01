import { Link } from "react-router-dom";

function Rating({ value }) {
  if (!value) {
    return (
      <div className="flex items-center gap-1 text-gray-400 text-sm">
        ★ No rating
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-yellow-500 text-sm">
      ★ {Number(value).toFixed(1)}
    </div>
  );
}

function VerticalCard({ product }) {
  return (
    <div className="flex gap-3 border-b pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
      <Link to={`/product/${product.slug}`}>
        <img
          src={product.thumbnail}
          className="w-16 h-16 object-cover rounded-md"
        />
      </Link>

      <div className="flex-1">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
        </Link>

        <p className="text-sm font-bold mt-1">₹{product.effective_price}</p>

        {/* ⭐ Backend Rating Here */}
        <Rating value={product.average_rating} />
      </div>
    </div>
  );
}

export default function RecentAndTopProducts({ recent, top }) {
  return (
    <section className="w-full  px-4.5 pb-6">
      <div className="max-w-8xl bg-gradient-to-r from-yellow-100/40 via-red-100/60 to-red-100/90 rounded-2xl mx-auto px-4 md:px-6 py-12">

        <div className="grid  md:grid-cols-2 gap-8">

          {/* Recent Products */}
          <div className="bg-gradient-to-r from-red-100/90 via-red-100/60 to-yellow-100/50  rounded-xl shadow-sm border-1 border-red-600 p-5">
            <h3 className="text-xl font-bold mb-4">Recent Products</h3>

            {recent.length > 0 ? (
              recent.map((p) => <VerticalCard  key={p.id} product={p} />)
            ) : (
              <p className="text-gray-500">No recent products.</p>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-gradient-to-r from-red-100/90 via-red-100/60 to-yellow-100/40 rounded-xl shadow-sm border-1 border-red-600 p-5">
            <h3 className="text-xl font-bold mb-4">Top Products</h3>

            {top.length > 0 ? (
              top.map((p) => <VerticalCard key={p.id} product={p} />)
            ) : (
              <p className="text-gray-500">No top products.</p>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
