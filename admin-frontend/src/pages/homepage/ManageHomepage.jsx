import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import { Link } from "react-router-dom";

export default function ManageHomepage() {
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-slate-50">Homepage Manager</h1>
      <p className="text-xs text-slate-400">
        Manage all homepage sections from here.
      </p>

      {/* STATIC HERO */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Static Hero</h2>
            <p className="text-xs text-slate-400">
              Manage main homepage banner section.
            </p>
          </div>

          <Link to="/homepage/static-hero">
            <Button>Edit</Button>
          </Link>
        </div>
      </Card>

      {/* HERO SLIDES */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Hero Slides</h2>
            <p className="text-xs text-slate-400">
              Manage multiple rotating slides.
            </p>
          </div>

          <Link to="/homepage/hero-slides">
            <Button>Manage Slides</Button>
          </Link>
        </div>
      </Card>

      {/* FEATURED OFFERS */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Featured Offers</h2>
            <p className="text-xs text-slate-400">
              Highlight special discount & offer banners.
            </p>
          </div>

          <Link to="/homepage/featured-offers">
            <Button>Manage Offers</Button>
          </Link>
        </div>
      </Card>

      {/* SECONDARY HERO */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Secondary Hero</h2>
            <p className="text-xs text-slate-400">
              Edit secondary promotional banner.
            </p>
          </div>

          <Link to="/homepage/secondary-hero">
            <Button>Edit</Button>
          </Link>
        </div>
      </Card>

      {/* GIFT OFFER SECTION */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Gift Offer Section</h2>
            <p className="text-xs text-slate-400">
              Manage gift-themed homepage banner.
            </p>
          </div>

          <Link to="/homepage/gift-offer">
            <Button>Edit</Button>
          </Link>
        </div>
      </Card>

      {/* SERVICE FEATURES */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Service Features</h2>
            <p className="text-xs text-slate-400">
              Manage features like shipping, support, moneyback.
            </p>
          </div>

          <Link to="/homepage/service-features">
            <Button>Manage</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
