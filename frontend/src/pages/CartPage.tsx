import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatMoney } from "../api";
import type { Cart } from "../types";
import { Spinner } from "../components/Spinner";
export function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const c = await api.cart();
      setCart(c);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load cart");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setQuantity(itemId: number, quantity: number) {
    setUpdating(itemId);
    try {
      const c = await api.updateCartItem(itemId, quantity);
      setCart(c);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setUpdating(null);
    }
  }

  if (loading) return <Spinner />;
  if (error && !cart) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <p className="text-wine">{error}</p>
      </div>
    );
  }

  const empty = !cart?.items.length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="font-display text-4xl font-medium">Your cart</h1>
      <p className="mt-2 text-sm text-ink/50">
        Edits save automatically when you change quantity. Set to zero to remove.
      </p>

      {error ? (
        <p className="mt-6 text-sm text-wine" role="alert">
          {error}
        </p>
      ) : null}

      {empty ? (
        <div className="mt-14 rounded-sm border border-dashed border-ink/15 bg-white/50 py-16 text-center">
          <p className="text-ink/55">Your cart is empty.</p>
          <Link to="/shop" className="mt-4 inline-block text-sm underline">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {cart!.items.map((line) => (
            <div
              key={line.id}
              className="flex flex-col gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:items-center"
            >
              <Link
                to={`/product/${line.product.slug}`}
                className="h-28 w-20 shrink-0 overflow-hidden rounded-sm bg-sand/40"
              >
                <img
                  src={line.product.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  to={`/product/${line.product.slug}`}
                  className="font-display text-lg hover:text-wine"
                >
                  {line.product.name}
                </Link>
                <p className="mt-1 text-sm text-ink/45">
                  {line.product.category.name} · {formatMoney(line.product.price)}{" "}
                  each
                </p>
              </div>
              <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                <label className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-ink/40">
                  Qty
                  <input
                    type="number"
                    min={0}
                    max={line.product.stock}
                    disabled={updating === line.id}
                    value={line.quantity}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (Number.isNaN(n)) return;
                      void setQuantity(line.id, n);
                    }}
                    className="w-14 rounded-sm border border-ink/15 bg-white px-2 py-1 text-sm"
                  />
                </label>
                <p className="text-sm font-medium">{formatMoney(line.lineTotal)}</p>
              </div>
            </div>
          ))}

          <div className="flex flex-col items-end gap-4 pt-4">
            <p className="text-lg">
              <span className="text-ink/50">Subtotal </span>
              <span className="font-medium">{formatMoney(cart!.subtotal)}</span>
            </p>
            <div className="flex flex-wrap justify-end gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-sm border border-ink/20 px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-ink hover:border-ink/50"
              >
                Keep shopping
              </Link>
              <Link
                to="/checkout"
                className="inline-flex items-center justify-center rounded-sm bg-ink px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-parchment shadow-soft hover:bg-wine"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
