import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-white/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-2xl">Atelier</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/55">
            Curated silhouettes, honest materials, and pieces you will reach for
            year after year.
          </p>
        </div>
        <div className="flex flex-wrap gap-8 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
          <Link to="/shop" className="hover:text-ink">
            Shop
          </Link>
          <a href="#" className="hover:text-ink">
            Editorial
          </a>
          <a href="#" className="hover:text-ink">
            Care
          </a>
        </div>
      </div>
      <div className="border-t border-ink/5 py-6 text-center text-[11px] uppercase tracking-[0.25em] text-ink/35">
        © {new Date().getFullYear()} Atelier
      </div>
    </footer>
  );
}
