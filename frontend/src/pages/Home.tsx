import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import type { Product } from "../types";
import { ProductCard } from "../components/ProductCard";
import { Spinner } from "../components/Spinner";
const btnPrimary =
  "inline-flex items-center justify-center rounded-sm bg-ink px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-parchment shadow-soft transition-colors hover:bg-wine";
const btnOutline =
  "inline-flex items-center justify-center rounded-sm border border-ink/20 bg-transparent px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-ink hover:border-ink/50";

export function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const page = await api.featuredProducts(0, 6);
        if (alive) setFeatured(page.content);
      } catch (e) {
        if (alive)
          setError(e instanceof Error ? e.message : "Could not load collection");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent" />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="animate-fade-up space-y-8">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold">
              Spring / Summer
            </p>
            <h1 className="font-display text-balance text-5xl font-medium leading-[1.05] text-ink md:text-6xl lg:text-7xl">
              Quiet luxury for everyday rhythm.
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-ink/60">
              Natural fibers, precise tailoring, and a palette borrowed from late
              afternoons. Built to last beyond the season.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/shop" className={btnPrimary}>
                Explore shop
              </Link>
              <Link to="/shop?q=linen" className={btnOutline}>
                New linen
              </Link>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute -right-8 top-8 h-64 w-64 rounded-full bg-sand/60 blur-3xl" />
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80"
              alt=""
              className="relative z-10 aspect-[4/5] w-full max-w-md rounded-sm object-cover shadow-soft ring-1 ring-ink/10"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-medium md:text-4xl">
              Featured
            </h2>
            <p className="mt-2 text-sm text-ink/50">
              A rotation of pieces our atelier returns to again and again.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-medium uppercase tracking-[0.2em] text-ink/50 hover:text-ink"
          >
            View all →
          </Link>
        </div>

        {error ? (
          <p className="rounded-sm border border-wine/20 bg-wine/5 px-4 py-3 text-sm text-wine">
            {error}
          </p>
        ) : loading ? (
          <Spinner />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-ink/10 bg-white/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-3 sm:px-6 sm:py-20">
          {[
            {
              title: "Materials",
              body: "European linen, merino, and full-grain leather selected for hand and longevity.",
            },
            {
              title: "Make",
              body: "Small-batch production with partners who share our standards for ethics and finish.",
            },
            {
              title: "Fit",
              body: "Relaxed tailoring you can live in—sharp enough for evening, soft enough for travel.",
            },
          ].map((item) => (
            <div key={item.title} className="space-y-3">
              <h3 className="text-xs font-medium uppercase tracking-[0.25em] text-gold">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink/60">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
