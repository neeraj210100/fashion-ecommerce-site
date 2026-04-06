import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api";
import type { Category, Product } from "../types";
import { ProductCard } from "../components/ProductCard";
import { Spinner } from "../components/Spinner";
import { Button } from "../components/Button";

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "";
  const q = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? "0") || 0;

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await api.categories();
        if (alive) setCategories(list);
      } catch {
        /* categories optional */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.products({
          category: category || undefined,
          q: q || undefined,
          page,
          size: 12,
        });
        if (alive) {
          setProducts(res.content);
          setTotalPages(res.totalPages);
        }
      } catch (e) {
        if (alive)
          setError(e instanceof Error ? e.message : "Could not load products");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [category, q, page]);

  const setFilter = useCallback(
    (next: { category?: string; q?: string; page?: number }) => {
      const p = new URLSearchParams(searchParams);
      if (next.category !== undefined) {
        if (next.category) p.set("category", next.category);
        else p.delete("category");
      }
      if (next.q !== undefined) {
        if (next.q) p.set("q", next.q);
        else p.delete("q");
      }
      if (next.page !== undefined) p.set("page", String(next.page));
      else p.set("page", "0");
      setSearchParams(p, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="mb-12 space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
          Collection
        </p>
        <h1 className="font-display text-4xl font-medium md:text-5xl">Shop</h1>
        <p className="max-w-xl text-ink/55">
          Filter by category or search the catalog. Pieces ship within 2–3
          business days.
        </p>
      </header>

      <div className="flex flex-col gap-10 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-ink/40">
            Category
          </p>
          <ul className="space-y-1 border-l border-ink/10 pl-4">
            <li>
              <button
                type="button"
                onClick={() => setFilter({ category: "", page: 0 })}
                className={`text-left text-sm ${
                  !category ? "font-medium text-ink" : "text-ink/45 hover:text-ink"
                }`}
              >
                All
              </button>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setFilter({ category: c.slug, page: 0 })}
                  className={`text-left text-sm ${
                    category === c.slug
                      ? "font-medium text-ink"
                      : "text-ink/45 hover:text-ink"
                  }`}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>

          <form
            className="mt-10 space-y-3"
            onSubmit={(ev) => {
              ev.preventDefault();
              const fd = new FormData(ev.currentTarget);
              const query = String(fd.get("q") ?? "").trim();
              setFilter({ q: query, page: 0 });
            }}
          >
            <label className="block text-[11px] font-medium uppercase tracking-[0.2em] text-ink/40">
              Search
            </label>
            <input
              name="q"
              key={q}
              defaultValue={q}
              placeholder="Dress, linen…"
              className="w-full rounded-sm border border-ink/15 bg-white/80 px-3 py-2 text-sm outline-none ring-ink/10 placeholder:text-ink/30 focus:ring-2"
            />
            <Button type="submit" className="w-full">
              Search
            </Button>
          </form>
        </aside>

        <div className="min-w-0 flex-1">
          {error ? (
            <p className="rounded-sm border border-wine/20 bg-wine/5 px-4 py-3 text-sm text-wine">
              {error}
            </p>
          ) : loading ? (
            <Spinner />
          ) : products.length === 0 ? (
            <p className="text-sm text-ink/50">
              No pieces match this filter.{" "}
              <Link to="/shop" className="underline underline-offset-4">
                Reset
              </Link>
            </p>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {totalPages > 1 ? (
                <nav className="mt-12 flex flex-wrap items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    disabled={page <= 0}
                    onClick={() => setFilter({ page: page - 1 })}
                  >
                    Previous
                  </Button>
                  <span className="px-2 text-xs text-ink/45">
                    Page {page + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page >= totalPages - 1}
                    onClick={() => setFilter({ page: page + 1 })}
                  >
                    Next
                  </Button>
                </nav>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
