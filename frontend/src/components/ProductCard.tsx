import { Link } from "react-router-dom";
import type { Product } from "../types";
import { formatMoney } from "../api";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-sm bg-white/80 shadow-card ring-1 ring-ink/5 transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-sand/40">
        <img
          src={product.imageUrl}
          alt=""
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          loading="lazy"
        />
        {product.featured ? (
          <span className="absolute left-3 top-3 bg-parchment/90 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-ink/70 backdrop-blur-sm">
            Featured
          </span>
        ) : null}
      </div>
      <div className="space-y-1 p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-clay">
          {product.category.name}
        </p>
        <h3 className="font-display text-xl font-medium leading-tight text-ink group-hover:text-wine">
          {product.name}
        </h3>
        <p className="text-sm text-ink/70">{formatMoney(product.price)}</p>
      </div>
    </Link>
  );
}
