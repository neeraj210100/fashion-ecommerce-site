import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, formatMoney } from "../api";
import { useAuth } from "../auth/AuthContext";
import type { Product } from "../types";
import { Spinner } from "../components/Spinner";
import { Button } from "../components/Button";

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { token } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const p = await api.productBySlug(slug);
        if (alive) {
          setProduct(p);
          setQty(1);
        }
      } catch (e) {
        if (alive)
          setError(e instanceof Error ? e.message : "Product not found");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  async function addToCart() {
    if (!product || !token) return;
    setAdding(true);
    setMessage(null);
    try {
      await api.addToCart(product.id, qty);
      setMessage("Added to your cart.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not add to cart");
    } finally {
      setAdding(false);
    }
  }

  if (!slug) {
    return <p className="p-8 text-sm text-ink/50">Invalid product.</p>;
  }

  if (loading) return <Spinner />;
  if (error || !product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20">
        <p className="text-wine">{error ?? "Not found"}</p>
        <Link to="/shop" className="mt-4 inline-block text-sm underline">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-6 text-[11px] font-medium uppercase tracking-[0.2em] text-ink/40">
        <Link to="/shop" className="hover:text-ink">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink/60">{product.category.name}</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="overflow-hidden rounded-sm bg-sand/30 ring-1 ring-ink/10">
          <img
            src={product.imageUrl}
            alt=""
            className="aspect-[3/4] w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold">
              {product.category.name}
            </p>
            <h1 className="mt-2 font-display text-4xl font-medium md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl font-light">{formatMoney(product.price)}</p>
          </div>

          <p className="max-w-md leading-relaxed text-ink/65">
            {product.description}
          </p>

          <p className="text-sm text-ink/45">
            {product.stock > 0 ? (
              <span>{product.stock} in stock</span>
            ) : (
              <span className="text-wine">Out of stock</span>
            )}
          </p>

          {token ? (
            product.stock > 0 ? (
              <div className="flex flex-wrap items-end gap-4">
                <label className="text-xs font-medium uppercase tracking-[0.15em] text-ink/40">
                  Quantity
                  <input
                    type="number"
                    min={1}
                    max={product.stock}
                    value={qty}
                    onChange={(e) =>
                      setQty(
                        Math.max(
                          1,
                          Math.min(product.stock, Number(e.target.value) || 1)
                        )
                      )
                    }
                    className="ml-3 w-16 rounded-sm border border-ink/15 bg-white px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ink/20"
                  />
                </label>
                <Button disabled={adding} onClick={addToCart}>
                  {adding ? "Adding…" : "Add to cart"}
                </Button>
              </div>
            ) : null
          ) : (
            <p className="text-sm text-ink/55">
              <Link
                to="/login"
                state={{ from: `/product/${product.slug}` }}
                className="font-medium text-ink underline underline-offset-4"
              >
                Sign in
              </Link>{" "}
              to add this piece to your cart.
            </p>
          )}

          {message ? (
            <p
              className={`text-sm ${
                message.startsWith("Added") ? "text-ink/70" : "text-wine"
              }`}
            >
              {message}
            </p>
          ) : null}

          <Link
            to="/cart"
            className="text-xs font-medium uppercase tracking-[0.15em] text-ink/45 hover:text-ink"
          >
            View cart →
          </Link>
        </div>
      </div>
    </div>
  );
}
